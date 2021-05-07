var MixlyStatusBar = {};

MixlyStatusBar.SELECTED = false;

MixlyStatusBar.object = null;

/**
* @ function 初始化状态栏
* @ description 初始化状态栏
* @ return void
*/
MixlyStatusBar.init = function () {
	MixlyStatusBar.object = ace.edit("div_inout_middle");
  	//editor_side_code1.setTheme(window.conf.lastEditorTheme);
  	MixlyStatusBar.object.getSession().setMode("ace/mode/python");
  	MixlyStatusBar.object.setFontSize(12);
  	MixlyStatusBar.object.setReadOnly(false);
  	MixlyStatusBar.object.setScrollSpeed(0.3);
  	MixlyStatusBar.object.setShowPrintMargin(false);
  	MixlyStatusBar.object.renderer.setShowGutter(false);
}

/**
* @ function 显示、隐藏或反转状态栏
* @ description 显示、隐藏或反转状态栏
* @ param type {number} 0 - 反转状态栏，1 - 打开状态栏，2 - 关闭状态栏
* @ return void
*/
MixlyStatusBar.show = function (type) {
	var oBox = getid("table_whole"); 
	var content_blocks = getid("content_blocks"); 
	var content_arduino = getid("content_arduino"); 
	var content_xml = getid("content_xml"); 
	var content_area = getid("content_area");
	var side_code_parent = getid("side_code_parent");
	var td_top = getid("td_top");
	var td_middle = getid("td_middle");
    if(type && MixlyStatusBar.SELECTED) return;
	if (MixlyStatusBar.SELECTED || type == 2) {
		td_top.style.display = 'none';
		td_middle.style.display = 'none';
		td_top.style.height = '0px';
		td_middle.style.height = '0px';
	    content_blocks.style.height = "100%";
	    content_arduino.style.height = "100%";
	    content_xml.style.height = "100%";
	    content_area.style.height = "100%";
	    side_code_parent.style.height = "100%";
		MixlyStatusBar.SELECTED = false;
	} else {
		td_top.style.display = '';
		td_middle.style.display = '';
		td_top.style.height = '5px';
		td_middle.style.height = 'auto';
		var iT = 0.8;
		var percent=oBox.clientHeight * iT;
		content_blocks.style.height = percent + "px";
	    content_arduino.style.height = percent + "px";
	    content_area.style.height = percent + "px";
	    side_code_parent.style.height = percent + "px";
	    mid_td.style.height= percent + "px";
	    td_middle.style.height = "auto";
		MixlyStatusBar.SELECTED = true;
	}
	editor.resize();
	Blockly.fireUiEvent(window, 'resize');
}

/**
* @ function 状态栏显示数据
* @ description 显示数据到状态栏内
* @ param data {String} 需要显示的字符串
* @ param scroll {Boolean} 是否将滚动条移到底部，true - 移动到底部，false - 保持当前位置不变
* @ return void
*/
MixlyStatusBar.setValue = function (data, scroll=false) {
	if (!MixlyStatusBar.object) return;
	if (MixlyStatusBar.getValue() == data) return;
	MixlyStatusBar.object.setValue(data);
	if (scroll)
		MixlyStatusBar.object.gotoLine(MixlyStatusBar.object.session.getLength());
}

/**
* @ function 获取状态栏数据
* @ description 获取当前状态栏显示的数据
* @ return String
*/
MixlyStatusBar.getValue = function () {
	if (!MixlyStatusBar.object) return "";
	return MixlyStatusBar.object.getValue();
}

/**
* @ function 状态栏追加数据
* @ description 显示数据到状态栏内
* @ param data {String} 需要追加的字符串
* @ param scroll {Boolean} 是否将滚动条移到底部，true - 移动到底部，false - 保持当前位置不变
* @ return void
*/
MixlyStatusBar.addValue = function (data, scroll=false) {
	if (!MixlyStatusBar.object) return;
	MixlyStatusBar.setValue(MixlyStatusBar.getValue() + data, scroll);
}

/**
* @ function 移动滚动条到底部
* @ description 移动状态栏的滚动条到最底部
* @ return void
*/
MixlyStatusBar.scrollToTheBottom = function () {
	if (!MixlyStatusBar.object) return;
	MixlyStatusBar.object.gotoLine(MixlyStatusBar.object.session.getLength());
}

/**
* @ function 移动滚动条到顶部
* @ description 移动状态栏的滚动条到最顶部
* @ return void
*/
MixlyStatusBar.scrollToTheTop = function () {
	if (!MixlyStatusBar.object) return;
	MixlyStatusBar.object.gotoLine(0);
}

MixlyStatusBar.init();