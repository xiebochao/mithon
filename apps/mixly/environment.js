var Mixly_20_environment = true;
var resolve = null;
var child_process = null;
var file_save = null;
var esp32_s2_path = null;
var python3_path = null;
var py_file_path = null;
var mixly_cp = null;
try {
    resolve = require('path').resolve;
	child_process = require("child_process");
	file_save = require('fs');
	esp32_s2_path = resolve('./').replace("apps/mixly","") + '\\cpBuild\\ESP32S2_MixGoCE';
	python3_path = resolve('./').replace("apps/mixly","") + '\\mixpyBuild\\win_python3\\python3.exe';
	py_file_path = resolve('./').replace("apps/mixly","") + '\\mixpyBuild\\mixly.py';
	mixly_cp = resolve('./').replace("apps/mixly","") + '\\cpBuild\\code.py';
	Mixly_20_environment = true;
} catch (error) {
	Mixly_20_environment = false;
}