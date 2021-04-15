var MixlyFile = {};

MixlyFile.IMGPATH = "";
MixlyFile.MIXPATH = "";
MixlyFile.CODEPATH = "";
MixlyFile.HEXPATH = "";

MixlyFile.FILTERS = [];

try {
	var obj1 = { name: '', extensions: ['mix'] };
	MixlyFile.FILTERS.push(obj1);
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.py")
		&& MixlyUrl.BOARD_CONFIG["nav.save.py"].toLowerCase() == "true") {
		var obj = { name: '', extensions: ['py'] };
		MixlyFile.FILTERS.push(obj);
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.ino")
		&& MixlyUrl.BOARD_CONFIG["nav.save.ino"].toLowerCase() == "true") {
		var obj = { name: '', extensions: ['ino'] };
		MixlyFile.FILTERS.push(obj);
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.hex")
		&& MixlyUrl.BOARD_CONFIG["nav.save.hex"].toLowerCase() == "true") {
		var obj = { name: '', extensions: ['hex'] };
		MixlyFile.FILTERS.push(obj);
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.img")
		&& MixlyUrl.BOARD_CONFIG["nav.save.img"].toLowerCase() == "true") {
		var obj = { name: '', extensions: ['png'] };
		MixlyFile.FILTERS.push(obj);
	}
} catch(e) {
	console.log(e);
}

var dialog = null;

if (mixly_20_path) {
	dialog = require('electron').remote.dialog;
}

MixlyFile.open = function () {
	const res = dialog.showOpenDialogSync({
  		title: '对话框窗口的标题',
  		// 默认打开的路径，比如这里默认打开下载文件夹
  		defaultPath: app.getPath('downloads'), 
  		buttonLabel: '确认按钮文案',
  		// 限制能够选择的文件类型
  		filters: [
    		// { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    		// { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    		// { name: 'Custom File Type', extensions: ['as'] },
    		// { name: 'All Files', extensions: ['*'] }, 
  		],
  		properties: [ 'openFile', 'openDirectory', 'multiSelections', 'showHiddenFiles' ],
  		message: 'mac文件选择器title'
	})
	console.log('res', res)
}

MixlyFile.saveAs = function (extension, boxTitle, data) {
	var limit = [];
	var fileType = "All Files";
	var savePath = "";
	if (file_save.existsSync(mixly_20_path + "\\sample\\")) {
		savePath = mixly_20_path + "\\sample\\";
	}
	if (extension) {
		fileType = '';
		extension = extension.toLowerCase();
		limit.push(extension);
	}

	if (extension) {
		const res = dialog.showSaveDialogSync({
		  	title: boxTitle,
		  	defaultPath: savePath, // 打开文件选择器的哪个路径 需要输入一个有效路径
		  	buttonLabel: '确定',
		  	// 限制能够选择的文件为某些类型
		  	filters: [
		    	 { name: fileType, extensions: limit }
		  	],
		  	nameFieldLabel: '替换文件', // “文件名”文本字段前面显示的文本自定义标签
		  	showsTagField: true, // 显示标签输入框，默认值为true
		  	properties: [ 'showHiddenFiles' ],
		  	message: boxTitle
		})
		console.log('res', res);
		if (res) {
			file_save.writeFile(res, data,'utf8',function(err){
				//如果err=null，表示文件使用成功，否则，表示希尔文件失败
				if (err) {
					layer.msg('写文件出错了，错误是：'+err, {
			            time: 1000
			        });
				} else {
					MixlyFile.updatePath(extension, res);
					MixlyTitle.updeteFilePath(res);
				}
			});
		}
	} else {
		console.log(MixlyFile.FILTERS)
		const res = dialog.showSaveDialogSync({
		  	title: boxTitle,
		  	defaultPath: savePath, // 打开文件选择器的哪个路径 需要输入一个有效路径
		  	buttonLabel: '确定',
		  	// 限制能够选择的文件为某些类型
		  	filters: MixlyFile.FILTERS,
		  	nameFieldLabel: '替换文件', // “文件名”文本字段前面显示的文本自定义标签
		  	showsTagField: true, // 显示标签输入框，默认值为true
		  	properties: [ 'showHiddenFiles' ],
		  	message: boxTitle
		})
		console.log('res', res);
		
		if (res) {
			if (res.indexOf(".py") != -1) {
				data = MixlyFile.getPy();
				extension = "py";
			} else if (res.indexOf(".ino") != -1) {
				data = MixlyFile.getIno();
				extension = "ino";
			} else if (res.indexOf(".hex") != -1) {
				data = MixlyFile.getHex();
				extension = "hex";
			} else if (res.indexOf(".png") != -1) {
				data = MixlyFile.getBlockPng();
				extension = "png";
			} else {
				data = MixlyFile.getMix();
				extension = "mix";
			}
			file_save.writeFile(res, data,'utf8',function(err){
				//如果err=null，表示文件使用成功，否则，表示希尔文件失败
				if (err) {
					layer.msg('写文件出错了，错误是：'+err, {
			            time: 1000
			        });
				} else {
					MixlyFile.updatePath(extension, res);
					MixlyTitle.updeteFilePath(res);
				}
			});
		}
	}
}

MixlyFile.save = function (extension) {
	extension = extension.toLowerCase();
	if (MixlyFile.havePath(extension)) {
		file_save.writeFile(MixlyFile.getPath(extension), MixlyFile.getData(extension),'utf8',function(err){
			//如果err=null，表示文件使用成功，否则，表示希尔文件失败
			if (err) {
				layer.msg('写文件出错了，错误是：'+err, {
		            time: 1000
		        });
			} else {
				layer.msg('保存成功！', {
		            time: 1000
		        });
			}
		});
	} else {
		MixlyFile.saveAs(extension, "保存", MixlyFile.getData(extension));
	}
}

MixlyFile.updatePath = function (extension, newPath) {
	extension = extension.toLowerCase();
	switch (extension) {
		case "png":
			MixlyFile.IMGPATH = newPath;
			break;
		case "hex":
			MixlyFile.HEXPATH = newPath;
			break;
		case "ino":
			MixlyFile.CODEPATH = newPath;
			break;
		case "py":
			MixlyFile.CODEPATH = newPath;
			break;
		default:
			MixlyFile.MIXPATH = newPath;
	}
}

MixlyFile.havePath = function (extension) {
	extension = extension.toLowerCase();
	switch (extension) {
		case "png":
			if (MixlyFile.IMGPATH != "") {
				return true;
			} else {
				return false;
			}
		case "hex":
			if (MixlyFile.HEXPATH != "") {
				return true;
			} else {
				return false;
			}
		case "ino":
			if (MixlyFile.CODEPATH != "") {
				return true;
			} else {
				return false;
			}
		case "py":
			if (MixlyFile.CODEPATH != "") {
				return true;
			} else {
				return false;
			}
		default:
			if (MixlyFile.MIXPATH != "") {
				return true;
			} else {
				return false;
			}
	}
}

MixlyFile.getPath = function (extension) {
	extension = extension.toLowerCase();
	switch (extension) {
		case "png":
			return MixlyFile.IMGPATH;
		case "hex":
			return MixlyFile.HEXPATH;
		case "ino":
			return MixlyFile.CODEPATH;
		case "py":
			return MixlyFile.CODEPATH;
		default:
			return MixlyFile.MIXPATH;
	}
}

MixlyFile.getData = function (extension) {
	extension = extension.toLowerCase();
	switch (extension) {
		case "png":
			return MixlyFile.getBlockPng();
		case "hex":
			return MixlyFile.getHex();
		case "ino":
			return MixlyFile.getIno();
		case "py":
			return MixlyFile.getPy();
		default:
			return MixlyFile.getMix("project");
	}
}

MixlyFile.getBlockPng = function () {
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

    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

MixlyFile.getPy = function () {
	var code = "";
	if (document.getElementById('tab_arduino').className == 'tabon') {
        code = editor.getValue();
	} else {
		code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
	}
	//code = code_head+code
	code = code.replace('from mixpy import math_map','')
	code = code.replace('from mixpy import math_mean','')
	code = code.replace('from mixpy import math_median','')
	code = code.replace('from mixpy import math_modes','')
	code = code.replace('from mixpy import math_standard_deviation','')
	code = code.replace('from mixpy import lists_sort','')
	return code;
}

MixlyFile.getHex = function () {
	try {
        updateMain();
        var output = FS.getUniversalHex();
        return output;
    } catch(e) {
        alert(e.message);
        return "";
    }
}

MixlyFile.getIno = function () {
	var code = "";
	if (document.getElementById('tab_arduino').className == 'tabon') {
        code = editor.getValue();
	} else {
		code = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace) || '';
	}
	return code;
}

MixlyFile.getMix = function (xmlType) {
    var xmlCodes = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
    if (xmlType === "project") {
        //var boardName = $("#cb_cf_boards").val();
        if (document.getElementById("boards-type")) {
        	xmlCodes = xmlCodes.replace("<xml", "<xml version=\\\"Mixly 2.0\\\" board=\\\""+$('#boards-type option:selected').val()+"\\\"");
        } else {
        	xmlCodes = xmlCodes.replace("<xml", "<xml version=\\\"Mixly 2.0\\\" board=\\\"all\\\"");
    	}
    } else if (xmlType === "lib")
        xmlCodes = xmlCodes.replace("<xml", "<xml version=\\\"Mixly 2.0\\\" board=\\\"" + "mylib" + "\\\"");
    return xmlCodes;
}

MixlyFile.saveImg = function () {
	MixlyFile.save("png");
}

MixlyFile.saveAsImg = function () {
	MixlyFile.saveAs("png", "另存为", MixlyFile.getData("png"));
}

MixlyFile.saveHex = function () {
	MixlyFile.save("hex");
}

MixlyFile.saveAsHex= function () {
	MixlyFile.saveAs("hex", "另存为", MixlyFile.getData("hex"));
}

MixlyFile.saveIno = function () {
	MixlyFile.save("ino");
}

MixlyFile.saveAsIno= function () {
	MixlyFile.saveAs("ino", "另存为", MixlyFile.getData("ino"));
}

MixlyFile.savePy = function () {
	MixlyFile.save("py");
}

MixlyFile.saveAsPy = function () {
	MixlyFile.saveAs("py", "另存为", MixlyFile.getData("py"));
}

MixlyFile.saveMix = function () {
	MixlyFile.save("mix");
}

MixlyFile.saveAsMix= function () {
	MixlyFile.saveAs("mix", "另存为", MixlyFile.getData("mix"));
}