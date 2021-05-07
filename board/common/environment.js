var Mixly_20_environment = true;
var resolve = null;
var child_process = null;
var file_save = null;
var mixly_20_path = null;
var python3_path = null;
var py_file_path = null;
var blockly_clipboard = null;
var indexPath = null;
var path = null;
try {
	Mixly_20_environment = (window && window.process && window.process.versions && window.process.versions['electron'])? true: false;
} catch (error) {
	Mixly_20_environment = false;
}

if (Mixly_20_environment) {
	path = require('path');
	resolve = require('path').resolve;
	mixly_20_path = resolve('./').replace("apps/mixly","");
	python3_path = resolve('./').replace("apps/mixly","") + '\\mixpyBuild\\win_python3\\python3.exe';
	py_file_path = resolve('./').replace("apps/mixly","") + '\\mixpyBuild\\mixly.py';
	child_process = require("child_process");
	file_save = require('fs');
	blockly_clipboard = require('electron').clipboard;
	indexPath = require('path').resolve(__dirname);
}
