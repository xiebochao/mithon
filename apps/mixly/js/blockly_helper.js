
'use strict'

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  No checks for infinite loops, etc.
 */
function runJS() {
    var code = Blockly.Generator.workspaceToCode('JavaScript');
    try {
        eval(code);
    } catch (e) {
        alert('Program error:\n' + e);
    }
}

/**
 * Backup code blocks to localStorage.
 */
function backup_blocks() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    xml = Blockly.Xml.domToText(xml);
    if ('localStorage' in window && window['localStorage'] != null) {
        window.localStorage.setItem('arduino', xml);
    } else {
        //当同时打开打开两个以上（含两个）的Mixly窗口时，只有第一个打开的窗口才有window.localStorage对象，怀疑是javafx的bug.
        //其他的窗口得通过java写cache文件来实现，否则这些窗口在普通、高级视图中进行切换时，无法加载切换之前的块
        JSFuncs.saveToLocalStorageCache(xml);
    }
}

function clear_blocks_from_storage() {
    var itl = setInterval(function () {
        if (window) {
            if ('localStorage' in window && window['localStorage'] != null && window.localStorage.arduino) {
                window.localStorage.removeItem('arduino');
            } else {
                JSFuncs.saveToLocalStorageCache("<xml></xml>");
            }
            Blockly.mainWorkspace.clear();
            clearInterval(itl);
        }
    }, 200);
}

/**
 * Restore code blocks from localStorage.
 */
function restore_blocks() {
    var xml;
    if ('localStorage' in window && window['localStorage'] != null && window.localStorage.arduino) {
        xml = Blockly.Xml.textToDom(window.localStorage.arduino);
    } else {
        xml = Blockly.Xml.textToDom(JSFuncs.loadFromLocalStorageCache());
    }
    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
}

/**
 * Save blocks to local file.
 * better include Blob and FileSaver for browser compatibility
 */
function save() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var data = Blockly.Xml.domToText(xml);

    // Store data in blob.
    // var builder = new BlobBuilder();
    // builder.append(data);
    // saveAs(builder.getBlob('text/plain;charset=utf-8'), 'blockduino.xml');
    console.log("saving blob");
    var blob = new Blob([data], { type: 'text/xml' });
    saveAs(blob, 'blockduino.xml');
}

/**
 * open serial modal
 */
async function openSerialModal() {
    await serialRead(deviceObj);
}

/**
 * Load blocks from local file.
 */
function load(event) {
    var files = event.target.files;
    // Only allow uploading one file.
    if (files.length != 1) {
        return;
    }

    // FileReader
    var reader = new FileReader();
    reader.onloadend = function (event) {
        var target = event.target;
        // 2 == FileReader.DONE
        if (target.readyState == 2) {
            try {
                var xml = Blockly.Xml.textToDom(target.result);
            } catch (e) {
                alert('Error parsing XML:\n' + e);
                return;
            }
            var count = Blockly.mainWorkspace.getAllBlocks().length;
            if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
                Blockly.mainWorkspace.clear();
            }
            Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
        }
        // Reset value of input after loading because Chrome will not fire
        // a 'change' event if the same file is loaded again.
        document.getElementById('load').value = '';
    };
    reader.readAsText(files[0]);
}

/**
 * Discard all blocks from the workspace.
 */
function discard() {
    var count = Blockly.mainWorkspace.getAllBlocks().length;
    if (count < 2 || window.confirm('Delete all ' + count + ' blocks?')) {
        Blockly.mainWorkspace.clear();
        renderContent();
    }
}

/*
 * auto save and restore blocks
 */
function auto_save_and_restore_blocks() {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(restore_blocks, 200);
    // Hook a save function onto unload.
    bindEvent(window, 'unload', backup_blocks);
    tabClick(selected);

    // Init load event.
    var loadInput = document.getElementById('load');
    loadInput.addEventListener('change', load, false);
    document.getElementById('fakeload').onclick = function () {
        loadInput.click();
    };
}

/**
 * Bind an event to a function call.
 * @param {!Element} element Element upon which to listen.
 * @param {string} name Event name to listen to (e.g. 'mousedown').
 * @param {!Function} func Function to call when event is triggered.
 *     W3 browsers will call the function with the event object as a parameter,
 *     MSIE will not.
 */
function bindEvent(element, name, func) {
    if (element.addEventListener) {  // W3C
        element.addEventListener(name, func, false);
    } else if (element.attachEvent) {  // IE
        element.attachEvent('on' + name, func);
    }
}

//loading examples via ajax
var ajax;
function createAJAX() {
    if (window.ActiveXObject) { //IE
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e2) {
                return null;
            }
        }
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return null;
    }
}

function onSuccess() {
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {
            try {
                var xml = Blockly.Xml.textToDom(ajax.responseText);
            } catch (e) {
                alert('Error parsing XML:\n' + e);
                return;
            }
            var count = Blockly.mainWorkspace.getAllBlocks().length;
            if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
                Blockly.mainWorkspace.clear();
            }
            Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
        } else {
            //alert("Server error");
        }
    }
}

function load_by_url(uri) {
    ajax = createAJAX();
    if (!ajax) {
        alert('Not compatible with XMLHttpRequest');
        return 0;
    }
    if (ajax.overrideMimeType) {
        ajax.overrideMimeType('text/xml');
    }

    ajax.onreadystatechange = onSuccess;
    ajax.open("GET", uri, true);
    ajax.send("");
}

function uploadCode(code, callback) {
    var target = document.getElementById('content_arduino');
    var spinner = new Spinner().spin(target);

    var url = "http://127.0.0.1:8080/";
    var method = "POST";

    // You REALLY want async = true.
    // Otherwise, it'll block ALL execution waiting for server response.
    var async = true;

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState != 4) {
            return;
        }

        spinner.stop();

        var status = parseInt(request.status); // HTTP response status, e.g., 200 for "200 OK"
        var errorInfo = null;
        switch (status) {
            case 200:
                break;
            case 0:
                errorInfo = "code 0\n\nCould not connect to server at " + url + ".  Is the local web server running?";
                break;
            case 400:
                errorInfo = "code 400\n\nBuild failed - probably due to invalid source code.  Make sure that there are no missing connections in the blocks.";
                break;
            case 500:
                errorInfo = "code 500\n\nUpload failed.  Is the Arduino connected to USB port?";
                break;
            case 501:
                errorInfo = "code 501\n\nUpload failed.  Is 'ino' installed and in your path?  This only works on Mac OS X and Linux at this time.";
                break;
            default:
                errorInfo = "code " + status + "\n\nUnknown error.";
                break;
        };

        callback(status, errorInfo);
    };

    request.open(method, url, async);
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    request.send(code);
}

function uploadClick() {
    var code = document.getElementById('textarea_arduino').value;

    alert("Ready to upload to Arduino.\n\nNote: this only works on Mac OS X and Linux at this time.");

    uploadCode(code, function (status, errorInfo) {
        if (status == 200) {
            alert("Program uploaded ok");
        } else {
            alert("Error uploading program: " + errorInfo);
        }
    });
}

function resetClick() {
    var code = "void setup() {} void loop() {}";

    uploadCode(code, function (status, errorInfo) {
        if (status != 200) {
            alert("Error resetting program: " + errorInfo);
        }
    });
}

'use strict';

/** Create a namespace for the application. */

goog.require('Blockly.Generator');
goog.require('Blockly.Python');

var mixlyjs = mixlyjs || {};
mixlyjs.hex = "";

mixlyjs.createFn = function () {
    if (document.getElementById("username") === null) {
        mixlyjs.discardAllBlocks();
    } else {
        //$("#opModal").load(mixlyjs.modalPagesPath + "create_new_project.html");
        $('#opModal').modal('show');
    }
};

/**
 *clear the mainWorkSpace 
 */
mixlyjs.discardAllBlocks = function () {
    Blockly.mainWorkspace.clear();
    renderContent();
};

mixlyjs.operateModal = function (action) {
    $("#opModal").modal(action);
};

mixlyjs.translateQuote = function (str, trimEscaped) {
    var xml = "";
    var hasComleteAngleBracket = true;
    var lenStr = str.length;
    for (var i = 0; i < lenStr; i++) {
        if (str[i] === "<") {
            hasComleteAngleBracket = false;
        } else if (str[i] === ">") {
            hasComleteAngleBracket = true;
        }

        if (trimEscaped === true
            && hasComleteAngleBracket === false
            && i + 1 < lenStr
            && str[i] === "\\"
            && str[i + 1] === '"') {
            i += 1;
        }

        if (trimEscaped === false
            && hasComleteAngleBracket === false
            && i > 0
            && str[i - 1] !== "\\"
            && str[i] === '"') {
            xml += "\\";
        }
        xml += str[i];
    }
    return xml;
}

mixlyjs.getBoardFromXml = function (xml) {
    if (xml.indexOf("board=\"") === -1) {
        var idxa = xml.indexOf("board=\\\"") + 7;
        var idxb = xml.indexOf("\"", idxa + 1);
        if (idxa !== -1 && idxb !== -1 && idxb > idxa)
            return xml.substring(idxa + 1, idxb - 1);
    } else {
        var idxa = xml.indexOf("board=\"") + 6;
        var idxb = xml.indexOf("\"", idxa + 1);
        if (idxa !== -1 && idxb !== -1 && idxb > idxa)
            return xml.substring(idxa + 1, idxb);
    }
    return undefined;
}

/*处理ardunio板子之间的互相切换*/
mixlyjs.changeBoardName = function (xmlContent, cb) {
    var itl = setInterval(function () {
        if (compilerflasher.loadedBoardList == true) {

            var boardName = mixlyjs.getBoardFromXml(xmlContent);
            if (boardName !== undefined) {
                var boardProfileName = boardName.replace(/\[.*?\]/, "");
                if (profile[boardProfileName] === undefined) {
                    alert("错误：确保板子名称和boardList里的一致！");
                    clearInterval(itl);
                    return;
                }
                $("#cb_cf_boards").val(boardName);
                profile['default'] = profile[boardProfileName];
            } else {
                profile['default'] = profile[$("#cb_cf_boards").find("option:selected").text().replace(/\[.*?\]/, "")];
            }
            cb();
            clearInterval(itl);
        }
    }, 200);

}

mixlyjs.renderXml = function (xmlContent) {
    try {
        var xml = Blockly.Xml.textToDom(xmlContent);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
        renderContent();
    } catch (e) {
        alert("invalid xml file!");
        console.log(e);
        return;
    }
};
mixlyjs.renderIno = function (xmlContent) {
    tabClick('arduino');
    editor.setValue(xmlContent, -1);
};
mixlyjs.isArduino = function (board) {
    return board.indexOf("Arduino") !== -1;
}
mixlyjs.isMicrobitjs = function (board) {
    return board === "microbit[js]";
}
mixlyjs.isMicrobitpy = function (board) {
    return board === "microbit[py]";
}
mixlyjs.isMixpy = function (board) {
    return board === "mixpy";
}
mixlyjs.isSameTypeBoard = function (boarda, boardb) {
    if (boarda.indexOf("Arduino") !== -1 && boardb.indexOf("Arduino") !== -1)
        return true;
    else if (boarda == boardb)
        return true;
    else
        return false;
}
mixlyjs.getFileSuffix = function (fname) {
    return fname.substring(fname.lastIndexOf(".") + 1);
}

mixlyjs.loadLocalFile = function () {
    // Create event listener function
    var parseInputXMLfile = function (e) {
        var files = e.target.files;
        var reader = new FileReader();
        reader.onload = function () {
            var text = mixlyjs.translateQuote(reader.result, true);
            var filesuffix = files[0].name.split(".")[files[0].name.split(".").length - 1];

            if (filesuffix === "xml" || filesuffix === "mix") {
                var newboard = mixlyjs.getBoardFromXml(text)
                if (newboard !== undefined) {
                    mixlyjs.renderXml(text);
                } else {
                    alert("Error:could not read board from xml!!");
                }
            } else if (filesuffix === "py") {
                mixlyjs.renderIno(text);
            } else {
                alert("Invalid file type! (.ino|.xml|.mix|.js|.py|.hex file supported)");
                return;
            }
        };
        reader.readAsText(files[0]);
    };
    // Create once invisible browse button with event listener, and click it
    var selectFile = document.getElementById('select_file');
    if (selectFile != null) {
        $("#select_file").remove();
        $("#select_file_wrapper").remove();
        selectFile = document.getElementById('select_file');
    }
    if (selectFile == null) {
        var selectFileDom = document.createElement('INPUT');
        selectFileDom.type = 'file';
        selectFileDom.id = 'select_file';

        var selectFileWrapperDom = document.createElement('DIV');
        selectFileWrapperDom.id = 'select_file_wrapper';
        selectFileWrapperDom.style.display = 'none';
        selectFileWrapperDom.appendChild(selectFileDom);

        document.body.appendChild(selectFileWrapperDom);
        selectFile = document.getElementById('select_file');
        //$("body").on('change', '#select_file', parseInputXMLfile);
        $("#select_file").change(parseInputXMLfile);
    }
    selectFile.click();
};

mixlyjs.getCodeContent = function () {
    if (document.getElementById('tab_blocks').className == 'tabon') {
        var board = Code.getStringParamFromUrl("board", "Arduino Nano[atmega328]")
        //	if(mixlyjs.isArduino(board))
        //			return Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace);
        //	else if(mixlyjs.isMicrobitjs(board))
        //	return Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace);
        //		else if(mixlyjs.isMicrobitpy(board))
        return Blockly.Python.workspaceToCode(Blockly.mainWorkspace);
        //else if(mixlyjs.isMixpy(board))
        //return Blockly.Mixpy.workspaceToCode(Blockly.mainWorkspace);
    } else {
        return editor.getValue();
    }
};

mixlyjs.getXmlContent = function (xmlType) {
    var xmlCodes = goog.string.quote(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)));
    if (xmlType === "project") {
        var boardName = $("#cb_cf_boards").val();
        xmlCodes = xmlCodes.replace("<xml", "<xml version=\\\"mixgo_0.997\\\" board=\\\"" + boardName + "\\\"");
    } else if (xmlType === "lib")
        xmlCodes = xmlCodes.replace("<xml", "<xml version=\\\"mixgo_0.997\\\" board=\\\"" + "mylib" + "\\\"");
    return xmlCodes.substring(1, xmlCodes.length - 1);
};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
mixlyjs.saveXmlFileAs = function () {
    var xmlCodes = mixlyjs.getXmlContent("project");
    var blob = new Blob(
        [xmlCodes],
        { type: 'text/plain;charset=utf-8' });
    saveAs(blob, "Mixgo.xml");
};

mixlyjs.saveInoFileAs = function (f) {
    var xmlCodes = mixlyjs.getCodeContent();
    var board = Code.getStringParamFromUrl("board", "Arduino Nano[atmega328]")
    var filesuffix = ".py";
    var file = (f !== undefined ? f : "mixgo") + filesuffix;
    var blob = new Blob(
        [xmlCodes],
        { type: 'text/plain;charset=utf-8' });
    saveAs(blob, file);
};

mixlyjs.saveCommonFileAs = function (fname, fcontent) {
    var blob = new Blob(
        [fcontent],
        { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fname);
};

mixlyjs.compileMicrobitPy = function () {
    mixlyjs.saveCommonFileAs("binary.hex", doDownload())
}

mixlyjs.setHexContent = function (jsonResponse) {
    var parsed_json = JSON.parse(jsonResponse);
    mixlyjs.hex = parsed_json.output;
    console.log(mixlyjs.hex);
};

mixlyjs.saveBlockImg = function(){
    //this value you can render a much higher resolution image, which looks better on high density displays
    var scaleFactor = 2;

    //Any modifications are executed on a deep copy of the element
    var cp = Blockly.mainWorkspace.svgBlockCanvas_.cloneNode(true);
    cp.removeAttribute("width");
    cp.removeAttribute("height");
    cp.removeAttribute("transform");
    console.log(cp)

    //It is important to create this element in the SVG namespace rather than the XHTML namespace
    var styleElem = document.createElementNS("http://www.w3.org/2000/svg", "style");
    //I've manually pasted codethemicrobit.com's CSS for blocks in here, but that can be removed as necessary
    //styleElem.textContent = Blockly.Css.CONTENT.join('') + ".blocklyToolboxDiv {background: rgba(0, 0, 0, 0.05);}.blocklyMainBackground {stroke:none !important;}.blocklyTreeLabel, .blocklyText, .blocklyHtmlInput {font-family:'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;}.blocklyText { font-size:1rem !important;}.rtl .blocklyText {text-align:right;} .blocklyTreeLabel { font-size:1.25rem !important;} .blocklyCheckbox {fill: #ff3030 !important;text-shadow: 0px 0px 6px #f00;font-size: 17pt !important;}";
    Blockly.Css.CONTENT=[
        ".blocklySvg {", "background-color: #fff;", "outline: none;", "overflow: hidden;", "position: absolute;", "display: block;", "}", ".blocklyWidgetDiv {", "display: none;", "position: absolute;", "z-index: 99999;", "}", ".injectionDiv {", "height: 100%;", "position: relative;", "overflow: hidden;", "}", ".blocklyNonSelectable {", "user-select: none;", "-moz-user-select: none;", "-webkit-user-select: none;", "-ms-user-select: none;", "}", ".blocklyWsDragSurface {", "display: none;", "position: absolute;",
        "overflow: visible;", "top: 0;", "left: 0;", "}", ".blocklyBlockDragSurface {", "display: none;", "position: absolute;", "top: 0;", "left: 0;", "right: 0;", "bottom: 0;", "overflow: visible !important;", "z-index: 50;", "}", ".blocklyTooltipDiv {", "background-color: #ffffc7;", "border: 1px solid #ddc;", "box-shadow: 4px 4px 20px 1px rgba(0,0,0,.15);", "color: #000;", "display: none;", "font-family: PingFang SC, sans-serif;", "font-size: 9pt;", "opacity: 0.9;", "padding: 2px;", "position: absolute;", "z-index: 100000;", "}", ".blocklyResizeSE {",
        "cursor: se-resize;", "fill: #aaa;", "}", ".blocklyResizeSW {", "cursor: sw-resize;", "fill: #aaa;", "}", ".blocklyResizeLine {", "stroke: #888;", "stroke-width: 1;", "}", ".blocklyHighlightedConnectionPath {", "fill: none;", "stroke: #fc3;", "stroke-width: 4px;", "}", ".blocklyPathLight {", "fill: none;", "stroke-linecap: round;", "stroke-width: 1;", "}", ".blocklySelected>.blocklyPath {", "stroke: #fc3;", "stroke-width: 3px;", "}", ".blocklySelected>.blocklyPathLight {", "display: none;", "}", ".blocklyDraggable {", 'cursor: url("<<<PATH>>>/handopen.cur"), auto;',
        "cursor: grab;", "cursor: -webkit-grab;", "cursor: -moz-grab;", "}", ".blocklyDragging {", 'cursor: url("<<<PATH>>>/handclosed.cur"), auto;', "cursor: grabbing;", "cursor: -webkit-grabbing;", "cursor: -moz-grabbing;", "}", ".blocklyDraggable:active {", 'cursor: url("<<<PATH>>>/handclosed.cur"), auto;', "cursor: grabbing;", "cursor: -webkit-grabbing;", "cursor: -moz-grabbing;", "}", ".blocklyBlockDragSurface .blocklyDraggable {", 'cursor: url("<<<PATH>>>/handclosed.cur"), auto;', "cursor: grabbing;", "cursor: -webkit-grabbing;",
        "cursor: -moz-grabbing;", "}", ".blocklyDragging.blocklyDraggingDelete {", 'cursor: url("<<<PATH>>>/handdelete.cur"), auto;', "}", ".blocklyToolboxDelete {", 'cursor: url("<<<PATH>>>/handdelete.cur"), auto;', "}", ".blocklyDragging>.blocklyPath,", ".blocklyDragging>.blocklyPathLight {", "fill-opacity: .8;", "stroke-opacity: .8;", "}", ".blocklyDragging>.blocklyPathDark {", "display: none;", "}", ".blocklyDisabled>.blocklyPath {", "fill-opacity: .5;", "stroke-opacity: .5;", "}", ".blocklyDisabled>.blocklyPathLight,",
        ".blocklyDisabled>.blocklyPathDark {", "display: none;", "}", ".blocklyText {", "cursor: default;", "fill: #fff;", "font-family: PingFang SC, sans-serif;", "font-size: 11pt;", "}", ".blocklyNonEditableText>text {", "pointer-events: none;", "}", ".blocklyNonEditableText>rect,", ".blocklyEditableText>rect {", "fill: #fff;", "fill-opacity: .6;", "}", ".blocklyNonEditableText>text,", ".blocklyEditableText>text {", "fill: #000;", "}", ".blocklyEditableText:hover>rect {", "stroke: #fff;", "stroke-width: 2;", "}", ".blocklyBubbleText {", "fill: #000;",
        "}", ".blocklyFlyout {", "position: absolute;", "z-index: 20;", "}", ".blocklyFlyoutButton {", "fill: #888;", "cursor: default;", "}", ".blocklyFlyoutButtonShadow {", "fill: #666;", "}", ".blocklyFlyoutButton:hover {", "fill: #aaa;", "}", ".blocklyFlyoutLabel {", "cursor: default;", "}", ".blocklyFlyoutLabelBackground {", "opacity: 0;", "}", ".blocklyFlyoutLabelText {", "fill: #000;", "}", ".blocklySvg text, .blocklyBlockDragSurface text {", "user-select: none;", "-moz-user-select: none;", "-webkit-user-select: none;", "cursor: inherit;",
        "}", ".blocklyHidden {", "display: none;", "}", ".blocklyFieldDropdown:not(.blocklyHidden) {", "display: block;", "}", ".blocklyIconGroup {", "cursor: default;", "}", ".blocklyIconGroup:not(:hover),", ".blocklyIconGroupReadonly {", "opacity: .6;", "}", ".blocklyIconShape {", "fill: #00f;", "stroke: #fff;", "stroke-width: 1px;", "}", ".blocklyIconSymbol {", "fill: #fff;", "}", ".blocklyMinimalBody {", "margin: 0;", "padding: 0;", "}", ".blocklyCommentTextarea {", "background-color: #ffc;", "border: 0;", "margin: 0;", "padding: 2px;",
        "resize: none;", "}", ".blocklyHtmlInput {", "border: none;", "border-radius: 4px;", "font-family: PingFang SC, sans-serif;", "height: 100%;", "margin: 0;", "outline: none;", "padding: 0 1px;", "width: 100%", "}", ".blocklyMainBackground {", "stroke-width: 1;", "stroke: #c6c6c6;", "}", ".blocklyMutatorBackground {", "fill: #fff;", "stroke: #ddd;", "stroke-width: 1;", "}", ".blocklyFlyoutBackground {", "fill: #666;", "fill-opacity: .8;", "}", ".blocklyMainWorkspaceScrollbar {", "z-index: 20;", "}", ".blocklyFlyoutScrollbar {", "z-index: 30;",
        "}", ".blocklyScrollbarHorizontal, .blocklyScrollbarVertical {", "position: absolute;", "outline: none;", "}", ".blocklyScrollbarBackground {", "opacity: 0;", "}", ".blocklyScrollbarHandle {", "fill: #ccc;", "}", ".blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,", ".blocklyScrollbarHandle:hover {", "fill: #bbb;", "}", ".blocklyZoom>image {", "opacity: .4;", "}", ".blocklyZoom>image:hover {", "opacity: .6;", "}", ".blocklyZoom>image:active {", "opacity: .8;", "}", ".blocklyFlyout .blocklyScrollbarHandle {", "fill: #bbb;",
        "}", ".blocklyFlyout .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,", ".blocklyFlyout .blocklyScrollbarHandle:hover {", "fill: #aaa;", "}", ".blocklyInvalidInput {", "background: #faa;", "}", ".blocklyAngleCircle {", "stroke: #444;", "stroke-width: 1;", "fill: #ddd;", "fill-opacity: .8;", "}", ".blocklyAngleMarks {", "stroke: #444;", "stroke-width: 1;", "}", ".blocklyAngleGauge {", "fill: #f88;", "fill-opacity: .8;", "}", ".blocklyAngleLine {", "stroke: #f00;", "stroke-width: 2;", "stroke-linecap: round;", "pointer-events: none;",
        "}", ".blocklyContextMenu {", "border-radius: 4px;", "}", ".blocklyDropdownMenu {", "padding: 0 !important;", "}", ".blocklyWidgetDiv .goog-option-selected .goog-menuitem-checkbox,", ".blocklyWidgetDiv .goog-option-selected .goog-menuitem-icon {", "background: url(<<<PATH>>>/sprites.png) no-repeat -48px -16px !important;", "}", ".blocklyToolboxDiv {", "background-color: #272727;", "overflow-x: visible;", "overflow-y: auto;", "position: absolute;", "z-index: 70;", "}", ".blocklyTreeRoot {", "padding: 4px 0;", "}", ".blocklyTreeRoot:focus {",
        "outline: none;", "}", ".blocklyTreeRow {", "height: 36px;", "line-height: 32px;", "margin-bottom: 6px;", "padding-right: 8px;", "border-radius: 4px;", "white-space: nowrap;", "}", ".blocklyHorizontalTree {", "float: left;", "margin: 1px 5px 8px 0;", "}", ".blocklyHorizontalTreeRtl {", "float: right;", "margin: 1px 0 8px 5px;", "}", '.blocklyToolboxDiv[dir="RTL"] .blocklyTreeRow {', "margin-left: 8px;", "}", ".blocklyTreeRow:not(.blocklyTreeSelected):hover {", "background-color: #ccc;", "}", ".blocklyTreeSeparator {", "border-bottom: solid #e5e5e5 1px;",
        "height: 0;", "margin: 5px 0;", "}", ".blocklyTreeSeparatorHorizontal {", "border-right: solid #e5e5e5 1px;", "width: 0;", "padding: 5px 0;", "margin: 0 5px;", "}", ".blocklyTreeIcon {", "background-image: url(<<<PATH>>>/sprites.png);", "height: 16px;", "vertical-align: middle;", "width: 16px;", "}", ".blocklyTreeIconClosedLtr {", "background-position: -32px -1px;", "}", ".blocklyTreeIconClosedRtl {", "background-position: 0px -1px;", "}", ".blocklyTreeIconOpen {", "background-position: -16px -1px;", "}", ".blocklyTreeSelected>.blocklyTreeIconClosedLtr {",
        "background-position: -32px -17px;", "}", ".blocklyTreeSelected>.blocklyTreeIconClosedRtl {", "background-position: 0px -17px;", "}", ".blocklyTreeSelected>.blocklyTreeIconOpen {", "background-position: -16px -17px;", "}", ".blocklyTreeIconNone,", ".blocklyTreeSelected>.blocklyTreeIconNone {", "background-position: -48px -1px;", "}", ".blocklyTreeLabel {", "cursor: default;", "font-family: PingFang SC, sans-serif;", "font-size: 16px;", "padding: 0 8px;", "vertical-align: middle;", "}", ".blocklyTreeSelected .blocklyTreeLabel {",
        "color: #fff;", "}", ".blocklyWidgetDiv .goog-palette {", "outline: none;", "cursor: default;", "}", ".blocklyWidgetDiv .goog-palette-table {", "border: 1px solid #666;", "border-collapse: collapse;", "}", ".blocklyWidgetDiv .goog-palette-cell {", "height: 13px;", "width: 15px;", "margin: 0;", "border: 0;", "text-align: center;", "vertical-align: middle;", "border-right: 1px solid #666;", "font-size: 1px;", "}", ".blocklyWidgetDiv .goog-palette-colorswatch {", "position: relative;", "height: 13px;", "width: 15px;", "border: 1px solid #666;",
        "}", ".blocklyWidgetDiv .goog-palette-cell-hover .goog-palette-colorswatch {", "border: 1px solid #FFF;", "}", ".blocklyWidgetDiv .goog-palette-cell-selected .goog-palette-colorswatch {", "border: 1px solid #000;", "color: #fff;", "}", ".blocklyWidgetDiv .goog-menu {", "background: #fff;", "border-color: #ccc #666 #666 #ccc;", "border-style: solid;", "border-width: 1px;", "cursor: default;", "font: normal 13px Arial, sans-serif;", "margin: 0;", "outline: none;", "padding: 4px 0;", "position: absolute;", "overflow-y: auto;",
        "overflow-x: hidden;", "max-height: 100%;", "z-index: 20000;", "}", ".blocklyWidgetDiv .goog-menuitem {", "color: #000;", "font: normal 13px Arial, sans-serif;", "list-style: none;", "margin: 0;", "padding: 4px 7em 4px 28px;", "white-space: nowrap;", "}", ".blocklyWidgetDiv .goog-menuitem.goog-menuitem-rtl {", "padding-left: 7em;", "padding-right: 28px;", "}", ".blocklyWidgetDiv .goog-menu-nocheckbox .goog-menuitem,", ".blocklyWidgetDiv .goog-menu-noicon .goog-menuitem {", "padding-left: 12px;", "}", ".blocklyWidgetDiv .goog-menu-noaccel .goog-menuitem {",
        "padding-right: 20px;", "}", ".blocklyWidgetDiv .goog-menuitem-content {", "color: #000;", "font: normal 13px Arial, sans-serif;", "}", ".blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-accel,", ".blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-content {", "color: #ccc !important;", "}", ".blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-icon {", "opacity: 0.3;", "-moz-opacity: 0.3;", "filter: alpha(opacity=30);", "}", ".blocklyWidgetDiv .goog-menuitem-highlight,", ".blocklyWidgetDiv .goog-menuitem-hover {",
        "background-color: #d6e9f8;", "border-color: #d6e9f8;", "border-style: dotted;", "border-width: 1px 0;", "padding-bottom: 3px;", "padding-top: 3px;", "}", ".blocklyWidgetDiv .goog-menuitem-checkbox,", ".blocklyWidgetDiv .goog-menuitem-icon {", "background-repeat: no-repeat;", "height: 16px;", "left: 6px;", "position: absolute;", "right: auto;", "vertical-align: middle;", "width: 16px;", "}", ".blocklyWidgetDiv .goog-menuitem-rtl .goog-menuitem-checkbox,", ".blocklyWidgetDiv .goog-menuitem-rtl .goog-menuitem-icon {",
        "left: auto;", "right: 6px;", "}", ".blocklyWidgetDiv .goog-option-selected .goog-menuitem-checkbox,", ".blocklyWidgetDiv .goog-option-selected .goog-menuitem-icon {", "background: url(//ssl.gstatic.com/editor/editortoolbar.png) no-repeat -512px 0;", "}", ".blocklyWidgetDiv .goog-menuitem-accel {", "color: #999;", "direction: ltr;", "left: auto;", "padding: 0 6px;", "position: absolute;", "right: 0;", "text-align: right;", "}", ".blocklyWidgetDiv .goog-menuitem-rtl .goog-menuitem-accel {", "left: 0;", "right: auto;",
        "text-align: left;", "}", ".blocklyWidgetDiv .goog-menuitem-mnemonic-hint {", "text-decoration: underline;", "}", ".blocklyWidgetDiv .goog-menuitem-mnemonic-separator {", "color: #999;", "font-size: 12px;", "padding-left: 4px;", "}", ".blocklyWidgetDiv .goog-menuseparator {", "border-top: 1px solid #ccc;", "margin: 4px 0;", "padding: 0;", "}", ""]; 
    styleElem.textContent = Blockly.Css.CONTENT.join(''); 
    // console.log(Blockly.Css.CONTENT);
    cp.insertBefore(styleElem, cp.firstChild);

    //Creates a complete SVG document with the correct bounds (it is necessary to get the viewbox right, in the case of negative offsets)
    var bbox = Blockly.mainWorkspace.svgBlockCanvas_.getBBox();
    var xml = new XMLSerializer().serializeToString(cp);
    xml = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+bbox.width+'" height="'+bbox.height+'" viewBox="' + bbox.x + ' ' + bbox.y + ' '  + bbox.width + ' ' + bbox.height + '"><rect width="100%" height="100%" style="fill-opacity:0"></rect>'+xml+'</svg>';
    //If you just want the SVG then do console.log(xml)
    //Otherwise we render as an image and export to PNG
    var svgBase64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    //var img = document.createElement('img');
    var img = new Image();
    img.src = svgBase64;

    var canvas = document.createElement("canvas");
    canvas.width = Math.ceil(bbox.width) * scaleFactor;
    canvas.height = Math.ceil(bbox.height) * scaleFactor;
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);

    //Might need to be in img.onload(function() {...}) in other browsers
    img.onload = function(){
        ctx.drawImage(img, 0, 0);
        //Opens the PNG image in a new tab for copying/saving
        var link = document.createElement('a');
        link.setAttribute('download', 'Mixgo.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
    };
}