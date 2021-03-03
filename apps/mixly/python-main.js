var FS = microbitFsWrapper();

// Reset the filesystem and load the files from this hex file to the fs and editor
function loadHex(filename, hexStr) {
    var importedFiles = [];
    // If hexStr is parsed correctly it formats the file system before adding the new files
    try {
        importedFiles = FS.importHexFiles(hexStr);
    } catch(hexImportError) {
        try {
            importedFiles = FS.importHexAppended(hexStr);
        } catch(appendedError) {
            return alert(hexImportError.message);
        }
    }
    // Check if imported files includes a main.py file
    var code = '';
    if (importedFiles.indexOf('main.py') > -1) {
        code = FS.read('main.py');
    } else {
        alert("no main.py");
    }
    //setName(filename.replace('.hex', ''));
    document.getElementById('changemod_btn').value = 0;
    document.getElementById('changemod_btn').textContent = MSG['tab_arduino'];
    tabClick('arduino');
    editor.setValue(code, -1);
}

// Function for adding file to filesystem
function loadFileToFilesystem(filename, fileBytes) {
    // For main.py confirm if the user wants to replace the editor content
    if (filename === 'main.py') {
        return;
    }
    try {
    	if (FS.exists(filename)) {
            FS.remove(filename);
            FS.create(filename, fileBytes);
        } else {
	        FS.write(filename, fileBytes);
	    }
	    // Check if the filesystem has run out of space
	    var _ = FS.getUniversalHex();
    } catch(e) {
        if (FS.exists(filename)) {
            FS.remove(filename);
        }
        return alert(filename + '\n' + e.message);
    }
}

// Update main.py code with required rules for including or excluding the file
function updateMain() {
    try {
        // Remove main.py if editor content is empty to download a hex file
        // with MicroPython included (also includes the rest of the filesystem)
        var code = "";
		if(document.getElementById('tab_arduino').className == 'tabon'){
			//code = document.getElementById('content_arduino').value;
	        code = editor.getValue();
		}else{
			code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
		}
		//code = code_head+code
		code = code.replace('from mixpy import math_map','')
		code = code.replace('from mixpy import math_mean','')
		code = code.replace('from mixpy import math_median','')
		code = code.replace('from mixpy import math_modes','')
		code = code.replace('from mixpy import math_standard_deviation','')
		code = code.replace('from mixpy import lists_sort','')
        //var mainCode = EDITOR.getCode();
        if (FS.exists('main.py')) {
            FS.remove('main.py');
        }
        for (var i = 0; i < py_module.length; i++) {
        	if (FS.exists(py_module[i]['filename'])) {
	            FS.remove(py_module[i]['filename']);
	        }
        }
        if (code) {
            FS.create('main.py', code);
        }
        var str = code;
        var arrayObj = new Array();
		str.trim().split("\n").forEach(function(v, i) {
		  arrayObj.push(v);
		})
        
        var module_name = "";
        for (var i = 0; i < arrayObj.length; i++) {
        	if (arrayObj[i].indexOf("from") == 0) {
        		module_name = arrayObj[i].substring(4, arrayObj[i].indexOf("import"));
        		module_name = module_name.replace(/(^\s*)|(\s*$)/g, "");
        		if (FS.exists(module_name + '.py'))
        			continue;
        		for (var j = 0; j < py_module.length; j++) {
        			if (py_module[j]['filename'] == module_name + ".py") {
        				loadFileToFilesystem(py_module[j]['filename'], py_module[j]['code']);
        			}
        		}
        	} else if (arrayObj[i].indexOf("import") == 0) {
        		module_name = arrayObj[i].substring(6);
        		module_name = module_name.replace(/(^\s*)|(\s*$)/g, "");
        		if (FS.exists(module_name + '.py'))
        			continue;
        		for (var j = 0; j < py_module.length; j++) {
        			if (py_module[j]['filename'] == module_name + ".py") {
        				loadFileToFilesystem(py_module[j]['filename'], py_module[j]['code']);
        			}
        		}
        	}
        }
    } catch(e) {
        // We generate a user readable error here to be caught and displayed
        throw new Error(e.message);
    }
}

function writeToHex(){
	fso = new ActiveXObject("Scripting.FileSystemObject");
	f1 = fso.CreateTextFile("mithon.hex", true);
	f1.Write(doDownload());
	f1.Close();
}

function doDownload(){
	/*
	var firmware = $("#firmware").text();
	var output = getHexFile(firmware);
	*/
	try {
        updateMain();
        var output = FS.getUniversalHex();
    } catch(e) {
        alert(e.message);
        return;
    }
	return output;
}

function doSave(){
	var code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
	code=code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) { return decodeURIComponent(s.replace(/_/g, '%')); });
	alert(code);
}

function getHexFile(firmware) {
	var code = "";
	if(document.getElementById('tab_arduino').className == 'tabon'){
		//code = document.getElementById('content_arduino').value;
        code = editor.getValue();
	}else{
		code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
	}
	code = code_head+code
	code = code.replace('from mixpy import math_map','')
	code = code.replace('from mixpy import math_mean','')
	code = code.replace('from mixpy import math_median','')
	code = code.replace('from mixpy import math_modes','')
	code = code.replace('from mixpy import math_standard_deviation','')
	code = code.replace('from mixpy import lists_sort','')
	var hexlified_python = hexlify(code);
	var insertion_point = ":::::::::::::::::::::::::::::::::::::::::::";
	return firmware.replace(insertion_point, hexlified_python);
}

function hexlify(script) {
	function hexlify(ar) {
		var result = '';
		for (var i = 0; i < ar.length; ++i) {
			if (ar[i] < 16) {
				result += '0';
			}
			result += ar[i].toString(16);
		}
		return result;
	}
	// add header, pad to multiple of 16 bytes
	data = new Uint8Array(4 + script.length + (16 - (4 + script.length) % 16));
	data[0] = 77; // 'M'
	data[1] = 80; // 'P'
	data[2] = script.length & 0xff;
	data[3] = (script.length >> 8) & 0xff;
	for (var i = 0; i < script.length; ++i) {
		data[4 + i] = script.charCodeAt(i);
	}
	// check data.length < 0x2000
	if(data.length > 8192) {
		throw new RangeError('Too long');
	}
	// convert to .hex format
	var addr = 0x3e000; // magic start address in flash
	var chunk = new Uint8Array(5 + 16);
	var output = [];
	for (var i = 0; i < data.length; i += 16, addr += 16) {
		chunk[0] = 16; // length of data section
		chunk[1] = (addr >> 8) & 0xff; // high byte of 16-bit addr
		chunk[2] = addr & 0xff; // low byte of 16-bit addr
		chunk[3] = 0; // type (data)
		for (var j = 0; j < 16; ++j) {
			chunk[4 + j] = data[i + j];
		}
		var checksum = 0;
		for (var j = 0; j < 4 + 16; ++j) {
			checksum += chunk[j];
		}
		chunk[4 + 16] = (-checksum) & 0xff;
		output.push(':' + hexlify(chunk).toUpperCase())
	}
	return output.join('\n');
};

var code_head = 'import math\n'+
'\n'+
'def math_map(v, al, ah, bl, bh):\n'+
'    return bl +  (bh - bl) * (v - al) / (ah - al)\n'+
'\n'+
'def math_mean(myList):\n'+
'    localList = [e for e in myList if type(e) == int or type(e) == float]\n'+
'    if not localList: return\n'+
'    return float(sum(localList)) / len(localList)\n'+
'\n'+
'def math_median(myList):\n'+
'    localList = sorted([e for e in myList if type(e) == int or type(e) == float])\n'+
'    if not localList: return\n'+
'    if len(localList) % 2 == 0:\n'+
'        return (localList[len(localList) // 2 - 1] + localList[len(localList) // 2]) / 2.0\n'+
'    else:\n'+
'        return localList[(len(localList) - 1) // 2]\n'+
'\n'+
'def math_modes(some_list):\n'+
'    modes = []\n'+
'    # Using a lists of [item, count] to keep count rather than dict\n'+
'    # to avoid "unhashable" errors when the counted item is itself a list or dict.\n'+
'    counts = []\n'+
'    maxCount = 1\n'+
'    for item in some_list:\n'+
'        found = False\n'+
'        for count in counts:\n'+
'            if count[0] == item:\n'+
'                count[1] += 1\n'+
'                maxCount = max(maxCount, count[1])\n'+
'                found = True\n'+
'        if not found:\n'+
'            counts.append([item, 1])\n'+
'    for counted_item, item_count in counts:\n'+
'        if item_count == maxCount:\n'+
'            modes.append(counted_item)\n'+
'    return modes\n'+
'\n'+
'def math_standard_deviation(numbers):\n'+
'    n = len(numbers)\n'+
'    if n == 0: return\n'+
'    mean = float(sum(numbers)) / n\n'+
'    variance = sum((x - mean) ** 2 for x in numbers) / n\n'+
'    return math.sqrt(variance)\n'+
'\n'+
'def lists_sort(my_list, type, reverse):\n'+
'    def try_float(s):\n'+
'        try:\n'+
'            return float(s)\n'+
'        except:\n'+
'            return 0\n'+
'    key_funcs = {\n'+
'        "NUMERIC": try_float,\n'+
'        "TEXT": str,\n'+
'        "IGNORE_CASE": lambda s: str(s).lower()\n'+
'    }\n'+
'    key_func = key_funcs[type]\n'+
'    list_cpy = list(my_list)\n'+
'    return sorted(list_cpy, key=key_func, reverse=reverse)\n'


let connect_btn = document.getElementById("connect_btn");
let upload_btn = document.getElementById("upload_btn");
let serial_read_btn = document.getElementById("serial_read_btn");
let serial_write_btn = document.getElementById("serial_write_btn");
let serial_clear_btn = document.getElementById("serial_clear_btn");
let deviceObj = null;
let transport = null;
let target = null;

// Choose a device
const selectDevice = async () => {
    // setStatus("Selecting device...");
    // setTransfer();
    try {
        const device = await navigator.usb.requestDevice({
            filters: [{vendorId: 0xD28}]
        });
        deviceObj = device;
        transport = new DAPjs.WebUSB(deviceObj);
		target = new DAPjs.DAPLink(transport);
		await target.connect();
		await target.setSerialBaudrate(115200);
	} catch (error) {
		setStatus(error);
		return null;
	}
}

const buildTarget = async () => {
	if(target && target.transport){
		return;
	}
	else{
		if(!deviceObj){
			modalAlert('无可用设备!');
			return;
		}
		else{
			transport = new DAPjs.WebUSB(deviceObj);
			target = new DAPjs.DAPLink(transport);
			await target.connect();
			await target.setSerialBaudrate(115200);
		}	
	}
}

//connect_btn.addEventListener("click", () => {selectDevice()});

//-----------------------------------------------------------
const setStatus = state => {
    alert(state);
}

const setTransfer = progress => {
   
}

// Load a firmware image
const setImage = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = evt => {
        buffer = evt.target.result;
        setStatus(`Firmware image: ${file.name}`);
        selectEl.style.visibility = "visible";
    }
    reader.readAsArrayBuffer(file);
}

const {resolve} = require('path')
var child_process=require("child_process")
var file_save = require('fs')
var esp32_s2_path = resolve('./').replace("apps/mixly","") + '\\cpBuild\\ESP32S2_MixGoCE';
var python3_path = resolve('./').replace("apps/mixly","") + '\\mixpyBuild\\win_python3\\python3.exe';
var py_file_path = resolve('./').replace("apps/mixly","") + '\\mixpyBuild\\mixly.py';
var mixly_cp = resolve('./').replace("apps/mixly","") + '\\cpBuild\\code.py';
var wmicResult = null;
var upload_cancel = false;

function serial_port_operate_start() {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	if (upload_cancel) {
		layui.use('layer', function(){
	        var layer = layui.layer;
	        layer.open({
	          	type: 1,
	          	title: '烧录中...',
	          	content: $('#webusb-flashing'),
	          	closeBtn: 0,
	          	end: function() {
	            	document.getElementById('webusb-flashing').style.display = 'none';
	          	}
	        });
	        var com_data = $('#select_serial_device option:selected').val();
	        esp32s2_download(com_data);
      	}); 
	} else {
		cp_serial_upload_start();
	}
}

function serial_port_operate_cancel() {
	if (upload_cancel) {
		layer.closeAll('page');
		document.getElementById('serial-device-form').style.display = 'none';
		upload_cancel = true;
		layer.closeAll('page');
		layer.msg('已取消烧录', {
	        time: 1000
	    });
		upload_cancel = false;
	} else {
		serial_upload_cancel();
	}
}

function cp_serial_upload_start() {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	upload_cancel = false;
	layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            type: 1,
            title: '上传中...',
            content: $('#webusb-flashing'),
            closeBtn: 0,
            end: function() {
              document.getElementById('webusb-flashing').style.display = 'none';
            }
        });
    }); 

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
	
    file_save.writeFile(mixly_cp, code,'utf8',function(err){
	    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
	    if(err) {
	    	layer.closeAll('page');
	    	document.getElementById('webusb-flashing').style.display = 'none';
	    	layer.msg('写文件出错了，错误是：'+err, {
	            time: 1000
	        });
	        upload_cancel = false;
	        return;
	    }  else if(upload_cancel) { //如果检测到用户取消上传，则隐藏上传框
	    	layer.closeAll('page');
	    	document.getElementById('webusb-flashing').style.display = 'none';
	    	upload_cancel = false;
	        return;
	    } else {
	    	var device_values = $.map($('#select_serial_device option'), function(ele) {
			   return ele.value; 
			});
			var device_num = device_values.length;
			var device_select_name = $('#select_serial_device option:selected').val();
			if (device_select_name == "all") {
				var upload_finish_num = 0;
				for (var i = 0; i < device_num; i++) {
					if (device_values[i] == "all") continue;
					file_save.copyFile(mixly_cp, device_values[i]+"\\code.py", (err) => { 
						layer.closeAll('page');
					    document.getElementById('webusb-flashing').style.display = 'none';
					    if (err) { 
					  	    layer.msg('写文件出错了，错误是：'+err, {
				                time: 1000
				            });
					    } else if(!upload_cancel) {
					    	upload_finish_num++;
					    	if (upload_finish_num >= device_num-1) {
					    		layer.closeAll('page');
				    			document.getElementById('webusb-flashing').style.display = 'none';
						    	layer.msg('上传成功!', {
						            time: 1000
						        });
						        status_bar_show(1);
				        		py_refreshSerialList_select_com("cp");
								setTimeout(function () {connect_com_with_option("cp")}, 1000);
						        upload_cancel = false;
						    }
					    }
					}); 
				}
			} else {
				file_save.copyFile(mixly_cp, device_select_name+"\\code.py", (err) => { 
					layer.closeAll('page');
				    document.getElementById('webusb-flashing').style.display = 'none';
				    if (err) { 
				  	    layer.msg('写文件出错了，错误是：'+err, {
			                time: 1000
			            });
				    } else if(!upload_cancel) {
				    	layer.msg('上传成功!', {
				            time: 1000
				        });
						status_bar_show(1);
						py_refreshSerialList_select_com("cp");
						setTimeout(function () {connect_com_with_option("cp")}, 1000);
				    }
				    upload_cancel = false;
				}); 
			}
			
		}
	})
}

function mp_serial_upload_start() {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	upload_cancel = false;
	layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            type: 1,
            title: '上传中...',
            content: $('#webusb-flashing'),
            closeBtn: 0,
            end: function() {
              document.getElementById('webusb-flashing').style.display = 'none';
            }
        });
    }); 

	try {
        updateMain();
        var output = FS.getUniversalHex();
    } catch(e) {
        alert(e.message);
        return;
    }
    var device_values = $.map($('#select_serial_device option'), function(ele) {
	   return ele.value; 
	});
	var device_num = device_values.length;
	var device_select_name = $('#select_serial_device option:selected').val();
	if (device_select_name == "all") {
		var upload_finish_num = 0;
		for (var i = 0; i < device_num-1; i++) {
			if (device_values[i] == "all") continue;
		    file_save.writeFile(device_values[i]+"\\firmware.hex", output,'utf8',function(err){
			    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
			    if(err) {
			    	layer.closeAll('page');
			    	layer.msg('写文件出错了，错误是：'+err, {
			            time: 1000
			        });
			    } else if(!upload_cancel) {
			    	upload_finish_num++;
					if (upload_finish_num >= device_num-1) {
				    	layer.closeAll('page');
				    	layer.msg('上传成功!', {
				            time: 1000
				        });
				        status_bar_show(1);
				        py_refreshSerialList_select_com("mp");
						setTimeout(function () {connect_com_with_option("mp")}, 1000);
						upload_cancel = false;
					}
			    }
			});
		}
	} else {
		file_save.writeFile(device_select_name+"\\firmware.hex", output,'utf8',function(err){
		    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
		    if(err) {
		    	layer.closeAll('page');
		    	layer.msg('写文件出错了，错误是：'+err, {
		            time: 1000
		        });
		    } else if(!upload_cancel) {
		    	layer.closeAll('page');
		    	layer.msg('上传成功!', {
		            time: 1000
		        });
		        status_bar_show(1);
		        py_refreshSerialList_select_com("mp");
				setTimeout(function () {connect_com_with_option("mp")}, 1000);
		    }
		    upload_cancel = false;
		})
	}
}

function serial_upload_cancel() {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	upload_cancel = true;
	layer.closeAll('page');
	layer.msg('已取消上传', {
        time: 1000
    });
}

// Update a device with the firmware image transferred from block/code
const update = async() => {
	upload_cancel = false;
	child_process.exec('wmic logicaldisk where VolumeName="MICROBIT" get DeviceID', function (err, stdout, stderr) {
	    if (err || stderr) {
	        console.log("root path open failed" + err + stderr);
	        layer.closeAll('page');
	        layer.msg('无可用设备!', {
	            time: 1000
	        });
	        return;
		}

		if (stdout.indexOf(":") != stdout.lastIndexOf(":")) {
			layer.closeAll('page');
			document.getElementById('webusb-flashing').style.display = 'none';
			layui.use(['layer','form'], function(){
		        var layer = layui.layer;
		        layer.open({
		            type: 1,
		            title: '检测到多个同类型设备，请选择：',
		            area: ['350px','170px'],
		            content: $('#serial-device-form'),
		            closeBtn: 0,
		            end: function() {
		              document.getElementById('serial-device-form').style.display = 'none';
		            }
		        });
			}); 
		} else {
			layui.use('layer', function(){
		        var layer = layui.layer;
		        layer.open({
		            type: 1,
		            title: '上传中...',
		            content: $('#webusb-flashing'),
		            closeBtn: 0,
		            end: function() {
		              document.getElementById('webusb-flashing').style.display = 'none';
		            }
		        });
		    }); 
		}
	    wmicResult = stdout;
	    wmicResult = wmicResult.replace(/\s+/g, "");
	    wmicResult = wmicResult.replace("DeviceID", "");
	    // wmicResult = 'G:K:F:';
	    let result = wmicResult.split(':');
	    console.log(result);

	    if (wmicResult.indexOf(":") != wmicResult.lastIndexOf(":")) {
			var form = layui.form;
			var device_Names = $('#select_serial_device');
		    device_Names.empty();
		    for(var i = 0; i < result.length; i++) {
		    	if (result[i])
		    		device_Names.append('<option value="'+result[i]+':">'+result[i]+':</option>');
		    }
		    device_Names.append('<option value="all">全部</option>');
		    form.render();
			return;
		}

	    try {
	        updateMain();
	        var output = FS.getUniversalHex();
	    } catch(e) {
	        alert(e.message);
	        return;
	    }

	    file_save.writeFile(wmicResult+"\\firmware.hex", output,'utf8',function(err){
		    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
		    if(err) {
		    	layer.closeAll('page');
		    	layer.msg('写文件出错了，错误是：'+err, {
		            time: 1000
		        });
		        console.log('写文件出错了，错误是：'+err);
		    } else if(!upload_cancel) {
		    	layer.closeAll('page');
		    	layer.msg('上传成功!', {
		            time: 1000
		        });
		        console.log('ok');
		        //status_bar_select = false;
		        status_bar_show(1);
		        py_refreshSerialList_select_com("mp");
				setTimeout(function () {
					connect_com_with_option("mp");
					serialWrite_ctrl_d();
				}, 1000);
		    }
		    upload_cancel = false;
		})

	});
}
if (upload_btn)
	upload_btn.addEventListener("click", () => {update(deviceObj)});

const esp_mainpy_update = async() => {
	upload_cancel = false;
    child_process.exec('wmic logicaldisk where VolumeName="CIRCUITPY" get DeviceID', function (err, stdout, stderr) {
    	if (err || stderr) {
    		layer.closeAll('page');
    		document.getElementById('webusb-flashing').style.display = 'none';
	        console.log("root path open failed" + err + stderr);
	        layer.msg('无可用设备!', {
	            time: 1000
	        });
	        return;
	    }
	    if (stdout.indexOf(":") != stdout.lastIndexOf(":")) {
	    	layer.closeAll('page');
			document.getElementById('webusb-flashing').style.display = 'none';
	    	layui.use(['layer','form'], function(){
		        var layer = layui.layer;
		        layer.open({
		            type: 1,
		            title: '检测到多个同类型设备，请选择：',
		            area: ['350px','170px'],
		            content: $('#serial-device-form'),
		            closeBtn: 0,
		            end: function() {
		              document.getElementById('serial-device-form').style.display = 'none';
		            }
		        });
			}); 
	    } else {
		    layui.use('layer', function(){
		        var layer = layui.layer;
		        layer.open({
		            type: 1,
		            title: '上传中...',
		            content: $('#webusb-flashing'),
		            closeBtn: 0,
		            end: function() {
		              document.getElementById('webusb-flashing').style.display = 'none';
		            }
		        });
		    }); 
		}
    	wmicResult = stdout;
	    wmicResult = wmicResult.replace(/\s+/g, "");
	    wmicResult = wmicResult.replace("DeviceID", "");
	    // wmicResult = 'G:K:F:';
	    let result = wmicResult.split(':');
	    console.log(result);

	    if (wmicResult.indexOf(":") != wmicResult.lastIndexOf(":")) {
			var form = layui.form;
			var device_Names = $('#select_serial_device');
		    device_Names.empty();
		    for(var i = 0; i < result.length; i++) {
		    	if (result[i])
		    		device_Names.append('<option value="'+result[i]+':">'+result[i]+':</option>');
		    }
		    device_Names.append('<option value="all">全部</option>');
		    form.render();
			return;
		}

	    var code = "";
		if (document.getElementById('tab_arduino').className == 'tabon') {
			//code = document.getElementById('content_arduino').value;
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
		
	    file_save.writeFile(mixly_cp, code,'utf8',function(err){
		    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
		    if(err) {
		    	layer.closeAll('page');
		    	document.getElementById('webusb-flashing').style.display = 'none';
		    	layer.msg('写文件出错了，错误是：'+err, {
		            time: 1000
		        });
		        console.log('写文件出错了，错误是：'+err);
		        upload_cancel = false;
		        return;
		    }  else if(upload_cancel) {
		    	layer.closeAll('page');
		    	document.getElementById('webusb-flashing').style.display = 'none';
		    	upload_cancel = false;
		        return;
		    } else {
		    	file_save.copyFile(mixly_cp, wmicResult+"\\code.py", (err) => { 
					layer.closeAll('page');
				    document.getElementById('webusb-flashing').style.display = 'none';
				    if (err) { 
				  	    layer.msg('写文件出错了，错误是：'+err, {
			                time: 1000
			            });
				        console.log("写文件出错了，错误是：", err); 
				    } else if(!upload_cancel) {
				    	layer.msg('上传成功!', {
				            time: 1000
				        });
				        console.log('ok');
				        //status_bar_select = false;
						status_bar_show(1);
						py_refreshSerialList_select_com("cp");
						setTimeout(function () {
							connect_com_with_option("cp");
							serialWrite_ctrl_d();
						}, 1000);
				    }
				    upload_cancel = false;
				}); 
			}
		})

	});
}
if (document.getElementById("download_btn")) {
	let download_btn = document.getElementById("download_btn");
	download_btn.addEventListener("click", () => {esp_mainpy_update()});
}

function webusb_cancel() {
	layer.closeAll('page');
	document.getElementById('webusb-flashing').style.display = 'none';
	if (upload_cancel) {
		if (download_shell) {
			download_shell.stdout.end();
			//download_shell.stdin.end();
			download_shell.kill("SIGTERM");
			download_shell = null;
		}
		layer.closeAll('page');
		layer.msg('已取消烧录', {
	        time: 1000
	    });
	    upload_cancel = false;
	} else {
		upload_cancel = true;
		layer.closeAll('page');
		layer.msg('已取消上传', {
	        time: 1000
	    });
	}
}

const esp32s2_download_data = async() => {
	var device_name = document.getElementById("device-name-select");
	var downloadLog_data = document.getElementById("downloadLog");
	var device_com = device_name.value;
	downloadLog_data.textContent = "正在烧录...\n";
    var shell = child_process.execFile(esp32_s2_path+"\\esptool.bat",[device_com,"115200"],function(error,stdout,stderr){
	    if(error !==null){
	        console.log("exec error"+error);
	        downloadLog_data.textContent = downloadLog_data.innerText + error + "\n";
	    }
	    else {
	    	console.log("成功");
	   		downloadLog_data.textContent = downloadLog_data.innerText + "烧录成功！\n";
	   	}
	   	downloadLog_data.scrollTop = downloadLog_data.scrollHeight;
	})

	shell.stdout.on('data', function (data) {
        //console.log(data);
        downloadLog_data.textContent = downloadLog_data.innerText + data;
        downloadLog_data.scrollTop = downloadLog_data.scrollHeight;
    });
	
}

const serialRead = async () => {
    layui.use(['layer','element','form'], function(){
        var layer = layui.layer;
        var element = layui.element;
        var serial_com_update = null;
        element.on('tab(serial)', function(elem){
        	if (elem.index == 1) {
        		echarts_init();
        	} else {
        		myChart && myChart.dispose();
        		echarts_update && clearInterval(echarts_update);
        	}
		});
        layer.open({
            type: 1,
            id: "serial_page",
            title: false,
            area: serial_form_update(1),
            closeBtn: 1,
            resize:false,
            content: $('#serial-form'),
            success: function (layero, index) {
                layero[0].childNodes[1].childNodes[0].classList.remove('layui-layer-close2');
                layero[0].childNodes[1].childNodes[0].classList.add('layui-layer-close1');

                serial_com_update = setInterval(update_select_com, 1200);

                if (py2block_config.board == "CircuitPython[ESP32_S2]") {
					py_refreshSerialList_select_com("cp");
					setTimeout(function () {
						connect_com_with_option("cp");
						$("#serial_content").val(div_inout_middle_text.getValue());
						status_bar_show(1);
						serial_open = true;
					}, 150);
				} else {
					py_refreshSerialList_select_com("mp");
					setTimeout(function () {
						connect_com_with_option("mp");
						$("#serial_content").val(div_inout_middle_text.getValue());
						status_bar_show(1);
						serial_open = true;
					}, 150);
				}
            },
            end: function() {
	            document.getElementById('serial-form').style.display = 'none';
	            div_inout_middle_text.setValue($("#serial_content").val());
    		    div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
    		    myChart && myChart.dispose();
    		    echarts_update && clearInterval(echarts_update);
    		    serial_com_update && clearInterval(serial_com_update);
    		    element.tabChange('serial', '1');
    		    serial_open = false;
	        }
        });
    });
}

if (serial_read_btn)
	serial_read_btn.addEventListener("click", () => {serialRead()});

//这两个事件对应的按钮渲染太慢，只能放到html onclick里
const clearSerialContent = async () => {
    document.getElementById('serial_content').value = '';
}

var status_bar_select = false;
function status_bar_show(is_open) {
	var oBox = getid("table_whole"); 
	var content_blocks = getid("content_blocks"); 
	var content_arduino = getid("content_arduino"); 
	var content_xml = getid("content_xml"); 
	var content_area = getid("content_area");
	var side_code_parent = getid("side_code_parent");
	var td_top = getid("td_top");
	var td_middle = getid("td_middle");
    if(is_open && status_bar_select) return;
	if (status_bar_select || is_open == 2) {
		td_top.style.display = 'none';
		td_middle.style.display = 'none';
		td_top.style.height = '0px';
		td_middle.style.height = '0px';
	    content_blocks.style.height = "100%";
	    content_arduino.style.height = "100%";
	    content_xml.style.height = "100%";
	    content_area.style.height = "100%";
	    side_code_parent.style.height = "100%";
		status_bar_select = false;
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
		status_bar_select = true;
	}
	editor.resize();
	Blockly.fireUiEvent(window, 'resize');
}

FS.setupFilesystem().then(function() {
    console.log('FS fully initialised');
}).fail(function() {
    console.error('There was an issue initialising the file system.');
});
