var sidecodeDisplay = false;
var now_visual_height = document.documentElement.clientHeight;

/**
* 点击侧边显示代码按钮
*/
function sidecodeClick() {
    if (sidecodeDisplay) {
        document.getElementById('side_code_parent').style.display = 'none';
        document.getElementById('sidebar').className = 'right-top';
        document.getElementById('mid_td').style.display = 'none';
        document.getElementById('content_area').style.width = document.getElementById('table_whole').clientWidth + "px";
        document.getElementById('content_area').width = '100%';
        sidecodeDisplay = false;
    } else {
        document.getElementById('side_code_parent').style.display = '';
        document.getElementById('sidebar').className = 'right-top2';
        document.getElementById('mid_td').style.display = '';
        document.getElementById('content_area').style.width = document.getElementById('table_whole').clientWidth + "px";
        document.getElementById('content_area').width = '75%';
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
        /*
         动态绑定undo和redo按钮，使得ace和blockly都能使用
         author:zyc
         date:2018-10-14
       */
        //动态绑定undo和redo按钮
        $('input[name="undo"]').unbind();
        $('input[name="redo"]').unbind();
        $('input[name="undo"]').click(function () {
            Blockly.mainWorkspace.undo(0);
        });
        $('input[name="redo"]').click(function () {
            Blockly.mainWorkspace.undo(1);
        });
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
        py2block_editor.updateBlock();
    }
    if (clickedName == "arduino") {
        py2block_editor.fromCode = true;
        //隐藏右侧悬浮按钮
        document.getElementById('sidebar').style.visibility = 'hidden';
        //点击代码将隐藏右侧代码，否则出现两个代码区域
        document.getElementById('side_code_parent').style.display = 'none';
        document.getElementById('mid_td').style.display = 'none';
        //动态绑定undo和redo按钮
        $('input[name="undo"]').unbind();
        $('input[name="redo"]').unbind();
        $('input[name="undo"]').click(function () {
            editor.undo();
        });
        document.getElementById('content_area').style.width = document.getElementById('table_whole').clientWidth + "px";
        document.getElementById('content_area').width = '100%';
        $('input[name="redo"]').click(function () {
            editor.redo();
        });
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
        //var arduinoTextarea = document.getElementById('side_code');
        var code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
        var chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) { return decodeURIComponent(s.replace(/_/g, '%')); });
        editor_side_code.setValue(chinese_code, -1);
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
       //content.innerHTML = Blockly.Python.workspaceToCode(Blockly.mainWorkspace);
       var code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
       var chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function(s) { return decodeURIComponent(s.replace(/_/g, '%')); });
       editor.setValue(chinese_code, -1);
       //arduinoTextarea.value = Blockly.Python.workspaceToCode(Blockly.mainWorkspace);
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
        document.getElementById('changemod_btn').textContent = MSG['tab_arduino'];
        document.getElementById('changemod_btn').className = "icon-code";
        tabClick('blocks');
    }
    else{
        document.getElementById('changemod_btn').value = 0;
        document.getElementById('changemod_btn').textContent = MSG['tab_blocks'];
        document.getElementById('changemod_btn').className = "icon-puzzle";
        tabClick('arduino');
    }
}

/**
 * Initialize Blockly.  Called on page load.
 */
var editor;
var editor_side_code;
/*
  添加ACE放大缩小事件
  author:zyc
  date:2018-10-15
*/
/*
    解决ACE放大后padding扩大导致放大缩小按钮偏移的问题
    author:zyc
    date:2018-10-15
*/
function resetACEFontSizeButtonPositon() {
    $('#content_arduino').css("padding", "9px");
}
var increaseACEFontSize = function () {
    //放大代码界面字体
    var size = parseInt(editor.getFontSize(), 10) || 12;
    editor.setFontSize(size + 1);
    //放大侧边栏字体
    var sideSize = parseInt(editor_side_code.getFontSize(), 10) || 12;
    editor_side_code.setFontSize(sideSize + 1);
    //resetACEFontSizeButtonPositon()
}
var decreaseACEFontSize = function () {
    var size = parseInt(editor.getFontSize(), 10) || 12;
    editor.setFontSize(Math.max(size - 1 || 1));
    var sideSize = parseInt(editor_side_code.getFontSize(), 10) || 12;
    editor_side_code.setFontSize(Math.max(sideSize - 1 || 1));
    //resetACEFontSizeButtonPositon()
}
var resetACEFontSize = function () {
    editor.setFontSize(17);
    editor_side_code.setFontSize(17);
}

var py2block_editor;
function init() {
    //window.onbeforeunload = function() {
    //  return 'Leaving this page will result in the loss of your work.';
    //};
    editor = ace.edit("content_arduino");
    if (window.conf == null || window.conf.lastEditorTheme == null) {
        window.conf = window.conf || {};
        window.conf['lastEditorTheme'] = "ace/theme/crimson_editor";
    }
    editor.setTheme(window.conf.lastEditorTheme);
    editor.getSession().setMode("ace/mode/python");
    editor.setFontSize(17);
    editor.setShowPrintMargin(false);
    editor.getSession().setTabSize(2);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setScrollSpeed(0.2);
    editor_side_code = ace.edit("side_code");
    editor_side_code.setTheme(window.conf.lastEditorTheme);
    editor_side_code.getSession().setMode("ace/mode/python");
    editor_side_code.setFontSize(17);
    editor_side_code.setShowPrintMargin(false);
    editor_side_code.setReadOnly(true);
    editor_side_code.setScrollSpeed(0.2);
    editor_side_code.getSession().setTabSize(2);
    $('#aceTheme').val(window.conf.lastEditorTheme);
    /*
          添加ACE放大缩小快捷键
          author:zyc
          date:2018-10-14
     */
    editor.commands.addCommands([
        {
            name: "increaseFontSize",
            bindKey: "Ctrl-=|Ctrl-+",
            exec: function (editor) {
                var size = parseInt(editor.getFontSize(), 10) || 12;
                editor.setFontSize(size + 1);
            }
        }, {
            name: "decreaseFontSize",
            bindKey: "Ctrl+-|Ctrl-_",
            exec: function (editor) {
                var size = parseInt(editor.getFontSize(), 10) || 12;
                editor.setFontSize(Math.max(size - 1 || 1));
            }
        }, {
            name: "resetFontSize",
            bindKey: "Ctrl+0|Ctrl-Numpad0",
            exec: function (editor) {
                editor.setFontSize(12);
            }
        }]);
    //动态生成按钮元素
    $('#content_arduino').append('<div id="resetFontSize" class="setFontSize" width="32" height="32" onclick="resetACEFontSize()" style="cursor:hand;"></div>');
    $('#content_arduino').append('<div id="increaseFontSize" class="setFontSize" width="32" height="32" onclick="increaseACEFontSize()" style="cursor:hand;"></div>');
    $('#content_arduino').append('<div id="decreaseFontSize" class="setFontSize" width="32" height="32" onclick="decreaseACEFontSize()" style="cursor:hand;"></div>');
    
    //$('#div_inout_middle').append('<button id="reset_output" onclick="py_clear_output()" style="position:absolute;right:20px;height:20px;top:2px;width:auto;">清空</button>');
    //endACE放大缩小
    var py2block_converter = new PythonToBlocks();
    py2block_editor = new Py2blockEditor(py2block_converter, editor);
    Sk.python3 = true;
    var container = document.getElementById('content_area');
    var status_bar_location = getid("layer_btn").offsetParent.offsetLeft + getid("layer_btn").offsetParent.offsetWidth;
    var nav_item_id = ["li_undo", "li_redo", "li_play", "li_stop", "li_layer"];
    var onresize = function (e) {
        var content_blocks = getid("content_blocks"); 
        var content_arduino = getid("content_arduino"); 
        var content_xml = getid("content_xml"); 
        var content_area = getid("content_area");
        var side_code_parent = getid("side_code_parent");
        var td_middle = getid("td_middle");

        var copyright = getid("copyright");
        var filename_input = getid("filename_input");
        var layer_btn = getid("layer_btn");
        var li_operate = getid("li_operate");

        if (filename_input.offsetParent.offsetLeft < status_bar_location + 105) {
            if (filename_input.offsetParent.offsetLeft < li_operate.offsetLeft + li_operate.offsetWidth + 105)
                copyright.style.display = "none";
            else
                copyright.style.display = "";
            for (var i = 0; i < nav_item_id.length; i++) {
                var nav_item = getid(nav_item_id[i]);
                if (nav_item) {
                    nav_item.style.display = "none";
                }
            }
            li_operate.style.display = "";

            var copyright_width = filename_input.offsetParent.offsetLeft - (li_operate.offsetLeft + li_operate.offsetWidth);
            copyright.style.width = copyright_width;
            copyright.style.left = li_operate.offsetLeft + li_operate.offsetWidth;
            copyright.style.textAlign="center";
            copyright.style.top = (60 - copyright.offsetHeight)/2;
        } else {
            copyright.style.display = "";
            li_operate.style.display = "none";
            for (var i = 0; i < nav_item_id.length; i++) {
                var nav_item = getid(nav_item_id[i]);
                if (nav_item) {
                    nav_item.style.display = "";
                }
            }
            var copyright_width = filename_input.offsetParent.offsetLeft - status_bar_location;
            copyright.style.width = copyright_width;
            copyright.style.left = status_bar_location;
            copyright.style.textAlign="center";
            copyright.style.top = (60 - copyright.offsetHeight)/2;
        }

        if (getid("layer_btn").offsetParent) {
            status_bar_location = getid("layer_btn").offsetParent.offsetLeft + getid("layer_btn").offsetParent.offsetWidth;
        }

        if (status_bar_select) {
            if(now_visual_height > document.body.clientHeight) {
                var iT = 0.8;
                var percent=(document.body.clientHeight - 60) * iT;
                content_blocks.style.height = percent + "px";
                content_arduino.style.height = percent + "px";
                content_xml.style.height = percent + "px";
                content_area.style.height = percent + "px";
                side_code_parent.style.height = percent + "px";
                mid_td.style.height= percent + "px";
                td_middle.style.height = "auto";
                var bBox = getBBox_(container);
                for (var i = 0; i < TABS_.length; i++) {
                    var el = document.getElementById('content_' + TABS_[i]);
                    el.style.top = bBox.y + 'px';
                    el.style.left = bBox.x + 'px';
                    el.style.width = bBox.width + 'px';
                    el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
                }
            } else {
                var visual_height = document.documentElement.clientHeight;
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
                
            }
            now_visual_height = document.body.clientHeight;
        } else {  
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
        }
        editor.resize();
        var serial_page = getid("serial_page");
        if (serial_page) {
            var serial_width_height = serial_form_update(1);
            var serial_left_top = serial_form_update(0);
            serial_page.parentNode.style.width = serial_width_height[0];
            serial_page.parentNode.style.height = serial_width_height[1];
            serial_page.style.width = serial_width_height[0];
            serial_page.style.height = serial_width_height[1];

            serial_page.parentNode.style.left = serial_left_top[0];
            serial_page.parentNode.style.top = serial_left_top[1];
        }
        // Make the 'Blocks' tab line up with the toolbox.
        // if (Blockly.mainWorkspace.toolbox_.width) {
        //     document.getElementById('tab_blocks').style.minWidth =
        //         (Blockly.mainWorkspace.toolbox_.width - 38) + 'px';
        //     // Account for the 19 pixel margin and on each side.
        // }
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
    if(localStorage.Theme == 'Dark'){
        Code.changeEditorTheme_dark();
    }else if(localStorage.Theme == 'Light'){
        Code.changeEditorTheme_light();
    }
    function rightCodeEvent(masterEvent) {
        if (masterEvent.type == Blockly.Events.UI) {
            return;  // Don't update UI events.
        }
        //更新
        //var arduinoTextarea = document.getElementById('side_code');
        var code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
        var chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) { return decodeURIComponent(s.replace(/_/g, '%')); });
        editor_side_code.setValue(chinese_code, -1);
    }

    auto_save_and_restore_blocks();

    //load from url parameter (single param)
    //http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
    var dest = unescape(location.search.replace(/^.*\=/, '')).replace(/\+/g, " ");
    if (dest) {
        load_by_url(dest);
    }
}
function show_tag(){
    tag_select('tab_blocks', 'tab_blocks');
    tag_select('tab_arduino', 'tab_arduino');
    tag_select('undo_btn', 'undo');
    tag_select('redo_btn', 'redo');
    tag_select('file_btn', 'file');
    tag_select('new_btn', 'new');
    tag_select('open_btn', 'open');
    tag_select('save_btn', 'save');
    tag_select('save_img_btn', 'save_img');
    tag_select('save_xml_btn', 'save_blocks');
    tag_select('save_py_btn', 'save_py');
    tag_select('save_hex_btn', 'save_hex');
    tag_select('setting_btn', 'setting');
    tag_select('language_btn', 'language');
    tag_select('theme_btn', 'theme');
    tag_select('changemod_btn', 'tab_blocks');
    tag_select('play_btn', 'run');
    tag_select('stop_btn', 'stop');
    tag_select('layer_btn', 'status_bar_show');
    tag_select('changemod_btn', 'tab_arduino');
    document.getElementById('filename_input').placeholder = MSG['fn'];

    tag_select('operate_undo_btn', 'undo');
    tag_select('operate_redo_btn', 'redo');
    tag_select('operate_play_btn', 'run');
    tag_select('operate_stop_btn', 'stop');
    tag_select('operate_layer_btn', 'status_bar_show');
    tag_select('operate_btn', 'operate');
}

function tag_select(id, msg) {
    if (document.getElementById(id)) {
        document.getElementById(id).textContent = MSG[msg];
    }
}