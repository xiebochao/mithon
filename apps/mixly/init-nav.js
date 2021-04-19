if (!Mixly_20_environment) throw false;

var navById = null;
try {
    navById = document.getElementById("nav");
    navById.innerHTML = `
	<li class="layui-nav-item" lay-unselect><a id="mixly2.0-path" href="../../index.html" style="color:white; text-align:center; vertical-align: middle;font-size: 18px;">Mixly</a></li>
	<li style="display:none" id="tab_blocks" lay-unselect></li>
	<li style="display:none" id="tab_arduino" lay-unselect></li>
	<li style="display:none" id="tab_xml"></li>
	`;
} catch(e) {
    console.log(e);
}

function navInit() {
	var dataHead = `
	<li class="layui-nav-item" id="li_operate" style="display:none;" lay-unselect>
		<a href="javascript:;" id="operate_btn">操作</a>
		<dl class="layui-nav-child">
			<!-- 二级菜单 -->
	    	<dd lay-unselect><a href="#" onclick="UndoClick();" name="undo" id="operate_undo_btn" title="undo(ctrl+z)" class="icon-ccw">撤销</a>
	    	<dd lay-unselect><a href="#" onclick="RedoClick();" name="redo" id="operate_redo_btn" title="redo(ctrl+y)" class="icon-cw">重复</a></dd>
	`;
	var dataTail = `
	<li class="layui-nav-item" id="li_undo" lay-unselect><a href="#" onclick="UndoClick();" name="undo" id="undo_btn" title="undo(ctrl+z)" class="icon-ccw"></a></li>
	<li class="layui-nav-item" id="li_redo" lay-unselect><a href="#" onclick="RedoClick();" name="redo" id="redo_btn" title="redo(ctrl+y)" class="icon-cw"></a></li>
	`;
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.burn") && MixlyUrl.BOARD_CONFIG["nav.burn"].toLowerCase() == "true") {
		dataHead += '<dd lay-unselect><a href="#" onclick="MixlyBurnUpload.initBurn();" id="operate_serial_reset" class="icon-upload-1">初始化固件</a></dd>\n';
		dataTail += '<li class="layui-nav-item" id="li_serial_reset" lay-unselect><a href="#" onclick="MixlyBurnUpload.initBurn();" id="serial_reset" class="icon-upload-1" ></a></li>\n';
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.compile") && MixlyUrl.BOARD_CONFIG["nav.compile"].toLowerCase() == "true") {
		dataHead += '<dd lay-unselect><a href="#" onclick="MixlyArduino.compile();" id="operate_arduino_compile" class="icon-check">编译</a></dd>\n';
		dataTail += '<li class="layui-nav-item" id="li_serial_reset" lay-unselect><a href="#" onclick="MixlyArduino.compile();" id="arduino_compile_btn" class="icon-check" ></a></li>\n';
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.compile") && MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.upload") && MixlyUrl.BOARD_CONFIG["nav.upload"].toLowerCase() == "true") {
		dataHead += '<dd lay-unselect><a href="#" onclick="MixlyArduino.upload();" id="operate_download_btn" class="icon-upload">上传</a></dd>\n';
		dataTail += '<li class="layui-nav-item" id="li_download" lay-unselect><a href="#" onclick="MixlyArduino.upload();" id="arduino_download_btn" class="icon-upload" ></a></li>\n';
	} else if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.upload") && MixlyUrl.BOARD_CONFIG["nav.upload"].toLowerCase() == "true") {
		dataHead += '<dd lay-unselect><a href="#" onclick="MixlyBurnUpload.initUpload();" id="operate_download_btn" class="icon-upload">上传</a></dd>\n';
		dataTail += '<li class="layui-nav-item" id="li_download" lay-unselect><a href="#" id="download_btn" onclick="MixlyBurnUpload.initUpload();" class="icon-upload" ></a></li>\n';
	}
	//if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.serial") && MixlyUrl.BOARD_CONFIG["nav.serial"].toLowerCase() == "true") {
		dataHead += '<dd lay-unselect><a href="#" onclick="MixlySerial.init();" id="operate_serial_read_btn" class="icon-link">串口</a></dd>\n';
		dataTail += '<li class="layui-nav-item" id="li_serial_read" lay-unselect><a href="#" id="serial_read_btn" onclick="MixlySerial.init();" class="icon-link" ></a></li>\n';
	//}
	//if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.statusBar") && MixlyUrl.BOARD_CONFIG["nav.statusBar"].toLowerCase() == "true") {
		dataHead += '<dd lay-unselect><a href="#" onclick="MixlyStatusBar.show(0);" id="operate_layer_btn" class="icon-window">状态栏</a></dd>\n';
		dataTail += '<li class="layui-nav-item" id="li_layer" lay-unselect><a href="#" id="layer_btn" class="icon-window" onclick="MixlyStatusBar.show(0);"></a></li>\n';
	//}
	dataHead += '</dl>\n</li>\n';
	dataTail += `
	<a id="copyright" style="font-family:'YaHei Consolas Hybrid', 'Microsoft Yahei Light', 'Arial';font-size:12px;color:#fff;position: fixed;top: 22px;right: 375px;"></a>
	<li class="layui-nav-item" style="float:right" lay-unselect>
	    <a href="javascript:;" id="setting_btn"></a>
	    <dl class="layui-nav-child">
	        <!-- 二级菜单 -->
	        <dd lay-unselect><a href="#" id="language_btn" class="icon-language" onclick="open_language(); "></a></dd>
	        <dd lay-unselect><a href="#" id="theme_btn" class="icon-art-gallery" onclick="open_theme();"></a></dd>
	        <dd lay-unselect><a href="#" id="changemod_btn" class="icon-code" value=1 onclick="changeMod();"></a></dd>
	`;
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.setting.thirdPartyLibrary") && MixlyUrl.BOARD_CONFIG["nav.setting.thirdPartyLibrary"].toLowerCase() == "true") {
		dataTail += `
		<dd lay-unselect><a href="#" id="import_libraries_btn" class="icon-download" onclick="open_lib();"></a></dd>
		<dd lay-unselect><a href="#" id="manage_libraries_btn" class="icon-menu"></a></dd>
		`;
	}
	dataTail += "</dl>\n</li>\n";
	dataTail += `
		<li class="layui-nav-item" style="float:right" lay-unselect>
	        <a href="javascript:;" id="file_btn"></a>
	        <dl class="layui-nav-child">
	            <!-- 二级菜单 -->
	            <dd lay-unselect><a href="#" onclick="MixlyFile.newFile()" id="new_btn" class="icon-doc-new"></a></dd>
	            <dd lay-unselect><a href="#" onclick="MixlyFile.loadFile()" id="open_btn" class="icon-folder-open-empty"></a></dd>
	        </dl>
	    </li>
	    <li class="layui-nav-item" style="float:right" lay-unselect>
            <a href="javascript:;" id="save_btn"></a>
            <dl class="layui-nav-child">
	`;
	//if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.mix") && MixlyUrl.BOARD_CONFIG["nav.save.mix"].toLowerCase() == "true") {
		dataTail += `
		<dd lay-unselect><a href="#" id="save_xml_btn" class="icon-floppy" onclick="MixlyFile.saveMix()"></a></dd>
		`;
	//}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.py") && MixlyUrl.BOARD_CONFIG["nav.save.py"].toLowerCase() == "true") {
		dataTail += `
		<dd lay-unselect><a href="#" id="save_py_btn" class="icon-file-code" onclick="MixlyFile.savePy()"></a></dd>
		`;
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.ino") && MixlyUrl.BOARD_CONFIG["nav.save.ino"].toLowerCase() == "true") {
		dataTail += `
		<dd lay-unselect><a href="#" id="save_ino_btn" class="icon-file-code" onclick="MixlyFile.saveIno()"></a></dd>
		`;
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.hex") && MixlyUrl.BOARD_CONFIG["nav.save.hex"].toLowerCase() == "true") {
		dataTail += `
		<dd lay-unselect><a href="#" id="save_hex_btn" class="icon-file-code" onclick="MixlyFile.saveHex()"></a></dd>
		`;
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("nav.save.img") && MixlyUrl.BOARD_CONFIG["nav.save.img"].toLowerCase() == "true") {
		dataTail += `
		<dd lay-unselect><a href="#" id="save_img_btn" class="icon-floppy" onclick="MixlyFile.saveImg()"></a></dd>
		`;
	}
	dataTail += `
	<dd lay-unselect><a href="#" id="save_as_btn" class="icon-floppy" onclick="MixlyFile.saveAs(null, '另存为', '')"></a></dd>
	`;
	dataTail += '</dl>\n</li>\n';
	dataTail += '<li class="layui-nav-item" lay-unselect><select id="languageMenu" style="display:none"></select></li>';
	if (navById) {
		navById.innerHTML += dataHead + dataTail; 
	}
}

navInit();