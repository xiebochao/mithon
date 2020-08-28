var sidecodeDisplay = false;
/**
 * 点击侧边显示代码按钮
 */
function sidecodeClick() {
    if (sidecodeDisplay) {
        document.getElementById('side_code_parent').style.display = 'none';
        document.getElementById('sidebar').className = 'right-top';
        document.getElementById('mid_td').style.display = 'none';
        sidecodeDisplay = false;
    } else {
        document.getElementById('side_code_parent').style.display = '';
        document.getElementById('sidebar').className = 'right-top2';
        document.getElementById('mid_td').style.display = '';
        sidecodeDisplay = true;
    }
    Blockly.fireUiEvent(window, 'resize');
}
/**
 * List of tab names.
 * @private
 */
var TABS_ = ['blocks', 'arduino', 'xml'];
var selected = 'blocks';
/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
function tabClick(clickedName) {
    // If the XML tab was open, save and render the content.
    if (document.getElementById('tab_xml').className == 'tabon') {
        var xmlTextarea = document.getElementById('content_xml');
        var xmlText = xmlTextarea.value;
        var xmlDom = null;
        try {
            xmlDom = Blockly.Xml.textToDom(xmlText);
        } catch (e) {
            var q =
                window.confirm('Error parsing XML:\n' + e + '\n\nAbandon changes?');
            if (!q) {
                // Leave the user on the XML tab.
                return;
            }
        }
        if (xmlDom) {
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, Blockly.mainWorkspace);
        }
    }
    if (document.getElementById('tab_blocks').className == 'tabon') {
        Blockly.mainWorkspace.setVisible(false);
    }
    // Deselect all tabs and hide all panes.
    for (var i = 0; i < TABS_.length; i++) {
        var name = TABS_[i];
        document.getElementById('tab_' + name).className = 'taboff';
        document.getElementById('content_' + name).style.visibility = 'hidden';
    }
    // Select the active tab.
    selected = clickedName;
    document.getElementById('tab_' + clickedName).className = 'tabon';
    // Show the selected pane.
    document.getElementById('content_' + clickedName).style.visibility =
        'visible';
    renderContent();
    if (clickedName == 'blocks') {
        Blockly.mainWorkspace.setVisible(true);
        //重新显示
        if (sidecodeDisplay) {
            document.getElementById('side_code_parent').style.display = '';
            document.getElementById('mid_td').style.display = '';
            document.getElementById('sidebar').className = 'right-top2';
        } else {
            document.getElementById('side_code_parent').style.display = 'none';
            document.getElementById('mid_td').style.display = 'none';
            document.getElementById('sidebar').className = 'right-top';
        }
        //显示右侧悬浮按钮
        document.getElementById('sidebar').style.visibility = 'visible';
        //py2block_editor.updateBlock();
    }
    if (clickedName == "arduino") {
        //py2block_editor.fromCode = true;
        sidecodeDisplay = false;
        sidecodeClick();
    }
    Blockly.fireUiEvent(window, 'resize');
}
/**
 * Populate the currently selected pane with content generated from the blocks.
 */
function renderContent() {
    var content = document.getElementById('content_' + selected);
    // Initialize the pane.
    if (content.id == 'content_blocks') {
        // If the workspace was changed by the XML tab, Firefox will have performed
        // an incomplete rendering due to Blockly being invisible.  Rerender.
        Blockly.mainWorkspace.render();
        var arduinoTextarea = document.getElementById('side_code');
        var code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
        //arduinoTextarea.value = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) { return decodeURIComponent(s.replace(/_/g, '%')); });
        //editor_side_code.setValue(Blockly.Python.workspaceToCode(Blockly.mainWorkspace), -1);
        Blockly.Python.workspaceToCode(Blockly.mainWorkspace)
        document.getElementById("tab_blocks").style.display = "none";
        // document.getElementById("tab_arduino").style.display = "inline";

    } else if (content.id == 'content_xml') {
        var xmlTextarea = document.getElementById('content_xml');
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        xmlTextarea.value = xmlText;
        xmlTextarea.focus();
    } else if (content.id == 'content_arduino') {
        document.getElementById("tab_arduino").style.display = "none";
        // document.getElementById("tab_blocks").style.display = "inline";
        //content.innerHTML = Blockly.Python.workspaceToCode(Blockly.mainWorkspace);
        // var arduinoTextarea = document.getElementById('content_arduino');
        // var code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
        // var chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) { return decodeURIComponent(s.replace(/_/g, '%')); });
        // editor.setValue(chinese_code, -1);

        //arduinoTextarea.focus();
    }
}
/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
function getBBox_(element) {
    var height = element.offsetHeight;
    var width = element.offsetWidth;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    return {
        height: height,
        width: width,
        x: x,
        y: y
    };
}
/**
 * 重写撤销和重复关联.
 */
function UndoClick(){
    if (document.getElementById('tab_blocks').className == 'tabon') {
        Blockly.mainWorkspace.undo(0);
    }
    else{
        editor.undo();
    }
}

function RedoClick(){
    if (document.getElementById('tab_blocks').className == 'tabon') {
        Blockly.mainWorkspace.undo(1);
    }
    else{
        editor.redo();
    }
}

/**
 * 模块/代码切换调整到界面右侧.
 */
function changeMod(){
    if (document.getElementById('changemod_btn').value == 0) {
        document.getElementById('changemod_btn').value = 1;
        document.getElementById('changemod_btn').textContent = MSG['tab_blocks'];
        tabClick('blocks');
    }
    else{
        document.getElementById('changemod_btn').value = 0;
        document.getElementById('changemod_btn').textContent = MSG['tab_arduino'];
        tabClick('arduino');
    }
}
/**
 * Initialize Blockly.  Called on page load.
 */
var editor;
var editor;
var EditorRange;
var pyengine;
//var py2block_editor;
function init() {
    //window.onbeforeunload = function() {
    //  return 'Leaving this page will result in the loss of your work.';
    //};
    ace.require("ace/ext/language_tools");
    editor = ace.edit("content_arduino");
    editor.setTheme("ace/theme/dracula");
    editor.getSession().setMode("ace/mode/turtle");
    editor.setFontSize(17);
    editor.setShowPrintMargin(false);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    EditorRange = ace.require('ace/range').Range;
    editor.hasMarker = false;
    editor.session.on('change', function () {
        if (editor.hasMarker === true) {
            editor.hasMarker = false;
            for (var mid in editor.session.$backMarkers) {
                if (editor.session.$backMarkers[mid]['clazz'] == 'errorMarker')
                    editor.session.removeMarker(mid);
            }
        }
    });
    editor.setScrollSpeed(0.05);
    var mixpyProject = new MixpyProject();
    pyengine = new PyEngine({}, mixpyProject);
    //var py2block_converter = new PythonToBlocks();
    //py2block_editor = new Py2blockEditor(py2block_converter, editor);
    Sk.python3 = true;
    var container = document.getElementById('content_area');
    var onresize = function (e) {
        var bBox = getBBox_(container);
        for (var i = 0; i < TABS_.length; i++) {
            var el = document.getElementById('content_' + TABS_[i]);
            el.style.top = bBox.y + 'px';
            el.style.left = bBox.x + 'px';
            // Height and width need to be set, read back, then set again to
            // compensate for scrollbars.
            el.style.height = bBox.height + 'px';
            el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
            el.style.width = bBox.width + 'px';
            el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
        }
        // Make the 'Blocks' tab line up with the toolbox.
        if (Blockly.mainWorkspace.toolbox_.width) {
            document.getElementById('tab_blocks').style.minWidth =
                (Blockly.mainWorkspace.toolbox_.width - 38) + 'px';
            // Account for the 19 pixel margin and on each side.
        }
    };
    window.addEventListener('resize', onresize, false);
    var toolbox = document.getElementById('toolbox');
    var masterWorkspace = Blockly.inject(document.getElementById('content_blocks'),
        {//grid:
            //{spacing: 25,
            //length: 3,
            //colour: '#ccc',
            //snap: true},
            media: '../../media/',
            toolbox: toolbox,
            zoom:
            {
                controls: true,
                wheel: true
            }
        });
    onresize();
    //实时更新右侧对比代码
    masterWorkspace.addChangeListener(rightCodeEvent);
    function rightCodeEvent(masterEvent) {
        if (masterEvent.type == Blockly.Events.UI) {
            return;  // Don't update UI events.
        }
        //更新
        var arduinoTextarea = document.getElementById('side_code');
        //var code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
        //arduinoTextarea.value = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) { return decodeURIComponent(s.replace(/_/g, '%')); });
        //editor_side_code.setValue(Blockly.Python.workspaceToCode(Blockly.mainWorkspace), -1);
        Blockly.Python.workspaceToCode(Blockly.mainWorkspace);
    }

    auto_save_and_restore_blocks();
    //load from url parameter (single param)
    //http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
    var dest = unescape(location.search.replace(/^.*\=/, '')).replace(/\+/g, " ");
    if (dest) {
        load_by_url(dest);
    }

    sidecodeClick();
}
function show_tag(){
    document.getElementById('tab_blocks').textContent = MSG['tab_blocks'];
    document.getElementById('tab_arduino').textContent = MSG['tab_arduino'];
    document.getElementById('undo_btn').textContent = MSG['undo'];
    document.getElementById('redo_btn').textContent = MSG['redo'];
    document.getElementById('file_btn').textContent = MSG['file'];
    document.getElementById('new_btn').textContent = MSG['new'];
    document.getElementById('open_btn').textContent = MSG['open'];
    document.getElementById('save_btn').textContent = MSG['save'];
    document.getElementById('save_xml_btn').textContent = MSG['save_blocks'];
    document.getElementById('save_py_btn').textContent = MSG['save_py'];
    document.getElementById('save_hex_btn').textContent = MSG['save_hex'];
    document.getElementById('setting_btn').textContent = MSG['setting'];
    document.getElementById('language_btn').textContent = MSG['language'];
    document.getElementById('theme_btn').textContent = MSG['theme'];
    document.getElementById('changemod_btn').textContent = MSG['tab_blocks'];
    document.getElementById('play_btn').textContent = MSG['run'];
    document.getElementById('stop_btn').textContent = MSG['stop'];
}