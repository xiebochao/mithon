var MixlyBurnUpload = {};

var download_shell = null;
var PythonShell = null;
var iconv = null;
if (Mixly_20_environment) {
	PythonShell = require('python-shell').PythonShell;
	iconv = require('iconv-lite');
}

var options = {
  	pythonPath: python3_path,
  	pythonOptions: ['-u'],
  	encoding: "binary",
  	mode: 'utf-8'
};

MixlyBurnUpload.ESPTOOL_COMMAND = {
	esp32_s2: ['--baud', '460800', '--after', 'no_reset', 'write_flash', '0x0000', mixly_20_path+'\\cpBuild\\ESP32S2_MixGoCE\\mixgoce.bin'],
	mixgo: [
		['--baud', '460800', 'erase_flash'],
		['--baud', '460800', '--after', 'no_reset', 'write_flash', '0x1000', mixly_20_path+'\\mpBuild\\ESP32_MixGo\\esp32.bin', '0x200000', mixly_20_path+'\\mpBuild\\ESP32_MixGo\\Noto_Sans_CJK_SC_Light16.bin']
	]
}

MixlyBurnUpload.UPLOADING = false;

MixlyBurnUpload.BURNING = false;

MixlyBurnUpload.uploadType = "";

MixlyBurnUpload.uploadVolumeName = "";

MixlyBurnUpload.uploadFileType = "";

MixlyBurnUpload.uploadFilePath = "";

MixlyBurnUpload.uploadCommand = "";

MixlyBurnUpload.burnCommand = "";

function replaceWithReg (str, newData, type) {
	if (str) {
		try{
			switch (type) {
				case "path":
					return str.replace(/{[\s]*path[\s]*}/g, newData);
				case "com":
					return str.replace(/{[\s]*com[\s]*}/g, newData);
				case "esptool":
					return str.replace(/{[\s]*esptool[\s]*}/g, newData);
				case "ampy":
					return str.replace(/{[\s]*ampy[\s]*}/g, newData);
				default:
					return str;
			}
		} catch(e) {
			return str;
		}
	}
	return str;
}

/**
* @ function 读取json并获取相关数据
* @ description 读取MixlyUrl.BOARD_CONFIG，从中获取uploadFilePath、uploadFileType、uploadVolumeName、burnCommand、uploadCommand
* @ return void
*/
MixlyBurnUpload.setUploadConfig = function () {
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("Upload.filePath")) {
		MixlyBurnUpload.uploadFilePath = MixlyUrl.BOARD_CONFIG["Upload.filePath"];
		MixlyBurnUpload.uploadFilePath = replaceWithReg(MixlyBurnUpload.uploadFilePath, mixly_20_path, "path");
		if (MixlyBurnUpload.uploadFilePath.toLowerCase().indexOf(".py") != -1) {
			MixlyBurnUpload.uploadFileType = "py";
		} else {
			MixlyBurnUpload.uploadFileType = "hex";
		}
	} else {
		MixlyBurnUpload.uploadFileType = "py";
		MixlyBurnUpload.uploadFilePath = mixly_20_path + "\\" + "mpbuild\\main.py";
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("Upload.type")) {
		MixlyBurnUpload.uploadType = MixlyUrl.BOARD_CONFIG["Upload.type"];
	} else {
		MixlyBurnUpload.uploadType = "ampy";
	}
	if (MixlyBurnUpload.uploadType == "volumeLabel") {
		if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("Upload.volumeName")) {
			MixlyBurnUpload.uploadVolumeName = MixlyUrl.BOARD_CONFIG["Upload.volumeName"];
		} else {
			MixlyBurnUpload.uploadVolumeName = "CIRCUITPY";
		}
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("Burn.command")) {
		MixlyBurnUpload.burnCommand = MixlyUrl.BOARD_CONFIG["Burn.command"];
		MixlyBurnUpload.burnCommand = replaceWithReg(MixlyBurnUpload.burnCommand, "python {path}\\mixpyBuild\\win_python3\\Lib\\site-packages\\esptool.py ", "esptool");
		MixlyBurnUpload.burnCommand = replaceWithReg(MixlyBurnUpload.burnCommand, mixly_20_path, "path");
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("Upload.command")) {
		MixlyBurnUpload.uploadCommand = MixlyUrl.BOARD_CONFIG["Upload.command"];
		MixlyBurnUpload.uploadCommand = replaceWithReg(MixlyBurnUpload.uploadCommand, "python {path}\\mixpyBuild\\win_python3\\Lib\\site-packages\\ampy\\cli.py ", "ampy");
		MixlyBurnUpload.uploadCommand = replaceWithReg(MixlyBurnUpload.uploadCommand, mixly_20_path, "path");
		
	}
}

try {
	MixlyBurnUpload.setUploadConfig();
} catch(e) {
	console.log(e);
}

/**
* @ function 返回生成的esptool烧录固件对应的py程序
* @ description 根据所给串口和命令数组生成esptool烧录固件对应的py程序
* @ param com {Array | String} 所选择的串口
* @ param commandArr {Array} 烧录固件时的一些配置项
* @ return String
*/
MixlyBurnUpload.generateEsptoolPyCode = function (com, commandArr) {
	var code = "";
	if (typeof(commandArr) == "object") {
		if (typeof(commandArr[0]) == "object") {
			for (var i = 0; i < commandArr.length; i++) {
				if (com == "all") continue;
				var command = "command"+i+" = ['--port', '"+com+"'";
				for (var j = 0; ; j++) {
					if (j >= commandArr[i].length - 1) {
						command += ", r'" + commandArr[i][j] + "']\n";
						break;
					}
					command += ", '" + commandArr[i][j] + "'";
				}
				command += "print('Using command %s' % ' '.join(command"+i+"))\n" + "esptool.main(command"+i+")\n";
				code += command;
			}
		} else {
			if (com == "all") return code;
			var command = "command0 = ['--port', '"+com+"'";
			for (var i = 0; ; i++) {
				if (i >= commandArr.length - 1) {
					command += ", r'" + commandArr[i] + "']\n";
					break;
				}
				command += ", '" + commandArr[i] + "'";
			}
			command += "print('Using command %s' % ' '.join(command0))\n" + "esptool.main(command0)\n";
			code += command;
		}
	}
	return code;
}

/**
* @ function 通过包含配置项的数组生成py字符串
* @ description 根据包含配置项的数组生成py的字符串，并使用runPyCode()函数运行它
* @ param com {Array | String} 所选择的串口
* @ param commandArr {Array} 烧录固件时的一些配置项
* @ return void
*/
MixlyBurnUpload.esptoolBurn = function (com, commandArr) {
	if (MixlySerial.serialPort && MixlySerial.serialPort.isOpen) {
		MixlySerial.serialPort.close();
	}
	MixlyStatusBar.show(1);
	MixlyBurnUpload.BURNING = true;
	var code = "import esptool\n";
	if (typeof(com) == "object") {
		for (var nowCom = 0; nowCom < com.length; nowCom++) {
			code += MixlyBurnUpload.generateEsptoolPyCode(com[nowCom], commandArr);
		}
	} else {
		code += MixlyBurnUpload.generateEsptoolPyCode(com, commandArr);
	}

	MixlyBurnUpload.runPyCode(mixly_20_path + "\\mixpyBuild\\program.py", code, true, null);
}

/**
* @ function 使用ampy上传
* @ description 调用ampy模块上传程序
* @ return void
*/
MixlyBurnUpload.uploadByAmpy = function () {
	var code = MixlyBurnUpload.getPy();
	MixlyStatusBar.show(1);
  	MixlyBurnUpload.UPLOADING = true;
	var device_values = $.map($('#select_serial_device option'), function(ele) {
	   return ele.value; 
	});
	var device_select_name = $('#select_serial_device option:selected').val();
	if (device_select_name == 'all') {
		MixlyBurnUpload.ampyUpload(device_values, "main.py", code, "all");
	} else {
		MixlyBurnUpload.ampyUpload(device_select_name, "main.py", code, "all");
	}
}

/**
* @ function 运行ampy
* @ description 通过串口号和文件名生成py字符串，并使用runPyCode()函数运行它
* @ param com {Array | String} 所选择的串口
* @ param fileName {String} 所要上传到板卡上文件的文件名
* @ param code {String} 所要上传到板卡上文件内包含的代码
* @ param comSelect {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ return void
*/
MixlyBurnUpload.ampyUpload = function (com, fileName, code, comSelect) {
	var ampy_code = 'from ampy.pyboard import Pyboard\n'
				  + 'import ampy.files as files\n';
	if (typeof(com) == "object") {
		for (var i = 0; i < com.length; i++) {
			if (com[i] == "all") continue;
			ampy_code += 'pyb = Pyboard(device="'+com[i]+'",baudrate=115200)\n' 
					  + 'file = files.Files(pyb)\n'
					  + 'file.put("'+fileName+'","""' + code +'""")\n'
					  + 'print("串口：", "'+com[i]+'", "  信息：", file.ls())\n';
		}
	} else {
		ampy_code += 'pyb = Pyboard(device="'+com+'",baudrate=115200)\n' 
				  + 'file = files.Files(pyb)\n'
				  + 'file.put("'+fileName+'","""' + code +'""")\n'
				  + 'print("串口：", "'+com+'", "  信息：", file.ls())\n';
	}

	if (MixlySerial.serialPort && MixlySerial.serialPort.isOpen) {
    	MixlySerial.serialPort.close();
  	}

	MixlyBurnUpload.runPyCode(mixly_20_path + "\\mixpyBuild\\program.py", ampy_code, false, comSelect);
}

/**
* @ function 运行py
* @ description 储存py字符串到Mixly\mixpyBuild\program.py，并使用python-shell运行此py文件
* @ param path {String} 所要运行的py文件的路径
* @ param code {String} 所要储存到path路径下的py字符串
* @ param burn {Boolean} 烧录或上传，True - 烧录固件，False - 程序上传
* @ param comSelect {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ return void
*/
MixlyBurnUpload.runPyCode = function (path, code, burn, comSelect) {
  file_save.writeFile(path, code, 'utf8', function(err){
		//如果err=null，表示文件使用成功，否则，表示希尔文件失败
		if(err) {
			layer.closeAll('page');
			document.getElementById('webusb-flashing').style.display = 'none';
			layer.msg('写文件出错了，错误是：'+err, {
			  	time: 1000
			});
			if (burn)
	    		MixlyBurnUpload.BURNING = false;
	    	else
	    		MixlyBurnUpload.UPLOADING = false;
		} else {
			download_shell = new PythonShell(path, options);

			//程序运行完成时执行
			download_shell.childProcess.on('exit', (code) => {
				console.log(code);
				if(code == 0) {
				  	layer.closeAll('page');
				  	document.getElementById('webusb-flashing').style.display = 'none';
				  	if (burn) {
					    MixlyStatusBar.addValue("==烧录成功==\n", false);
					    layer.msg('烧录成功！', {
					        time: 1000
					    });
				  	} else {
					    MixlyStatusBar.addValue("==上传成功==\n", false);
					    layer.msg('上传成功！', {
					        time: 1000
					    });
				  	}

					if (comSelect && !burn) {
						MixlySerial.refreshSerialList(comSelect);
						setTimeout(function () {
						  	MixlySerial.connectCom();
						  	MixlySerial.writeCtrlD();
						}, 1000);
					}
	        	}
	        	MixlyStatusBar.scrollToTheBottom();
	        	download_shell = null;
	        	if (burn)
	        		MixlyBurnUpload.BURNING = false;
	        	else
	        		MixlyBurnUpload.UPLOADING = false;
      		});
      
			//有数据输出时执行
			download_shell.stdout.setEncoding('binary');  
			download_shell.stdout.on('data', function (data) {
				data = decode(iconv.decode(iconv.encode(data, "iso-8859-1"), 'gbk'));
				MixlyStatusBar.addValue(data, true);
			});

        	//程序运行出错时执行
			download_shell.stderr.setEncoding('binary');  
			download_shell.stderr.on('data', function (err) {
				console.log('stderr: ' + err);
				if (iconv.encode(err, "iso-8859-1"))
					MixlyStatusBar.addValue(iconv.decode(iconv.encode(err, "iso-8859-1"), 'gbk'), false);
				else
					MixlyStatusBar.addValue(err, false);
				layer.closeAll('page');
				document.getElementById('webusb-flashing').style.display = 'none';
				if (burn) {
					layer.msg('烧录失败', {
					  time: 1000
					});
					MixlyBurnUpload.BURNING = false;
				} else {
					layer.msg('上传失败', {
					  time: 1000
					});
					MixlyBurnUpload.UPLOADING = false;
				}
				MixlyStatusBar.scrollToTheBottom();
				download_shell = null;
			});
      	}
  	})
}

/**
* @ function 上传代码
* @ description 通过盘符名称获取盘符号并拷贝某一文件（.hex | .py）到此盘符下
* @ param VolumeName {String} 所要查找盘符的名称
* @ param path {String} 所要拷贝文件的路径
* @ param pyCode {Boolean} 上传文件为hex或py，true - 上传文件为py，false - 上传文件为hex
* @ param comSelect {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ param addAllSelect {Boolean} 是否在串口下拉框内添加【全部】选项，true - 添加，false - 不添加
* @ return void
*/
MixlyBurnUpload.uploadWithVolumeName = function (VolumeName, path, pyCode, comSelect, addAllSelect) {
	child_process.exec('wmic logicaldisk where VolumeName="'+VolumeName+'" get DeviceID', function (err, stdout, stderr) {
    	if (err || stderr) {
    		layer.closeAll('page');
    		document.getElementById('webusb-flashing').style.display = 'none';
	        console.log("root path open failed" + err + stderr);
	        layer.msg('无可用设备!', {
	            time: 1000
	        });
	        MixlyBurnUpload.UPLOADING = false;
	        return;
	    }
	    if (stdout.indexOf(":") != stdout.lastIndexOf(":")) {
	    	layer.closeAll('page');
			document.getElementById('webusb-flashing').style.display = 'none';
	    	layui.use(['layer','form'], function(){
		        var layer = layui.layer;
		        layer.open({
		            type: 1,
		            id: "serialSelect",
		            title: '检测到多个同类型设备，请选择：',
		            area: ['350px','150px'],
		            content: $('#serial-device-form'),
		            closeBtn: 0,
		            success: function(layero){
		            	document.getElementById("serialSelect").style.height = "200px";
		            },
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
			var old_Device = $('#select_serial_device option:selected').val();
		    device_Names.empty();
		    for(var i = 0; i < result.length; i++) {
		    	if (result[i]) {
		    		if (old_Device == result[i] + ':') {
		    			device_Names.append('<option value="'+result[i]+':" selected>'+result[i]+':</option>');
		    		} else {
		    			device_Names.append('<option value="'+result[i]+':">'+result[i]+':</option>');
		    		}
		    	}
		    }
		    if (addAllSelect) {
			    if (old_Device == 'all') {
			    	device_Names.append('<option value="all" selected>全部</option>');
			    } else {
			    	device_Names.append('<option value="all">全部</option>');
			    }
			}
		    form.render();
			return;
		}

		var code = "";
		if (pyCode) {
			code = MixlyBurnUpload.getPy();
		} else {
			code = MixlyBurnUpload.getHex();
		}

	    file_save.writeFile(path, code,'utf8',function(err){
		    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
		    if (err) {
		    	layer.closeAll('page');
		    	document.getElementById('webusb-flashing').style.display = 'none';
		    	layer.msg('写文件出错了，错误是：'+err, {
		            time: 1000
		        });
		        console.log('写文件出错了，错误是：'+err);
		        MixlyBurnUpload.UPLOADING = false;
		        return;
		    } else if (!MixlyBurnUpload.UPLOADING) {
		    	layer.closeAll('page');
		    	document.getElementById('webusb-flashing').style.display = 'none';
		        return;
		    } else {
		    	file_save.copyFile(path, wmicResult + "\\" + basename(path), (err) => { 
					layer.closeAll('page');
				    document.getElementById('webusb-flashing').style.display = 'none';
				    if (err) { 
				  	    layer.msg('写文件出错了，错误是：'+err, {
			                time: 1000
			            });
				        console.log("写文件出错了，错误是：", err); 
				    } else if(MixlyBurnUpload.UPLOADING) {
				    	layer.msg('上传成功!', {
				            time: 1000
				        });
				        console.log('ok');
						MixlyStatusBar.show(1);
						MixlySerial.refreshSerialList(comSelect);
						setTimeout(function () {
							MixlySerial.connectCom();
							MixlySerial.writeCtrlD();
						}, 1000);
				    }
				    MixlyBurnUpload.UPLOADING = false;
				}); 
			}
		})

	});
}

/**
* @ function 上传代码
* @ description 通过下拉列表获取盘符号并拷贝某一文件（.hex | .py）到此盘符下
* @ param path {String} 所要拷贝文件的路径
* @ param pyCode {Boolean} 上传文件为hex或py，true - 上传文件为py，false - 上传文件为hex
* @ param comSelect {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ return void
*/
MixlyBurnUpload.uploadWithDropdownBox = function (path, pyCode, comSelect) {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	MixlyBurnUpload.UPLOADING = true;
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
	if (pyCode) {
		code = MixlyBurnUpload.getPy();
	} else {
		code = MixlyBurnUpload.getHex();
	}
	
    file_save.writeFile(path, code,'utf8',function(err){
	    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
	    if(err) {
	    	layer.closeAll('page');
	    	document.getElementById('webusb-flashing').style.display = 'none';
	    	layer.msg('写文件出错了，错误是：'+err, {
	            time: 1000
	        });
	        MixlyBurnUpload.UPLOADING = false;
	        return;
	    }  else if (!MixlyBurnUpload.UPLOADING) { //如果检测到用户取消上传，则隐藏上传框
	    	layer.closeAll('page');
	    	document.getElementById('webusb-flashing').style.display = 'none';
	    	MixlyBurnUpload.UPLOADING = false;
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
					file_save.copyFile(path, device_values[i]+"\\" + basename(path), (err) => { 
						layer.closeAll('page');
					    document.getElementById('webusb-flashing').style.display = 'none';
					    if (err) { 
					  	    layer.msg('写文件出错了，错误是：'+err, {
				                time: 1000
				            });
					    } else if(MixlyBurnUpload.UPLOADING) {
					    	upload_finish_num++;
					    	if (upload_finish_num >= device_num-1) {
					    		layer.closeAll('page');
				    			document.getElementById('webusb-flashing').style.display = 'none';
						    	layer.msg('上传成功!', {
						            time: 1000
						        });
						        MixlyStatusBar.show(1);
				        		MixlySerial.refreshSerialList(comSelect);
								setTimeout(function () {
									MixlySerial.connectCom();
									MixlySerial.writeCtrlD();
								}, 1000);
						        MixlyBurnUpload.UPLOADING = false;
						    }
					    }
					}); 
				}
			} else {
				file_save.copyFile(path, device_select_name+"\\" + basename(path), (err) => { 
					layer.closeAll('page');
				    document.getElementById('webusb-flashing').style.display = 'none';
				    if (err) { 
				  	    layer.msg('写文件出错了，错误是：'+err, {
			                time: 1000
			            });
				    } else if(MixlyBurnUpload.UPLOADING) {
				    	layer.msg('上传成功!', {
				            time: 1000
				        });
						MixlyStatusBar.show(1);
						MixlySerial.refreshSerialList(comSelect);
						setTimeout(function () {
							MixlySerial.connectCom();
							MixlySerial.writeCtrlD();
						}, 1000);
				    }
				    MixlyBurnUpload.UPLOADING = false;
				}); 
			}
			
		}
	})
}

/**
* @ function 获取Py
* @ description 返回当前画布上的py代码
* @ return String
*/
MixlyBurnUpload.getPy = function () {
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

/**
* @ function 获取hex
* @ description 通过当前画布上py程序生成对应的Hex文件并返回
* @ return String
*/
MixlyBurnUpload.getHex = function () {
	try {
        updateMain();
        var output = FS.getUniversalHex();
        return output;
    } catch(e) {
        alert(e.message);
        return "";
    }
}

function basename(str) {
	var idx = str.lastIndexOf('/')
	idx = idx > -1 ? idx : str.lastIndexOf('\\')
	if (idx < 0) {
		return str
	}
	return str.substring(idx + 1);
}

/**
* @ function 取消烧录或上传
* @ description 取消将要进行的烧录或上传过程
* @ return void
*/
MixlyBurnUpload.Cancel = function () {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	if (MixlyBurnUpload.UPLOADING) {
		MixlyBurnUpload.UPLOADING = false;
		layer.msg('已取消上传', {
	        time: 1000
	    });
	} else if (MixlyBurnUpload.BURNING) {
		MixlyBurnUpload.BURNING = false;
		layer.msg('已取消烧录', {
	        time: 1000
	    });
	}
}

/**
* @ function 取消烧录或上传
* @ description 取消当前正在运行的烧录或上传进程
* @ return void
*/
MixlyBurnUpload.CancelHalfway = function () {
	layer.closeAll('page');
	document.getElementById('webusb-flashing').style.display = 'none';
	if (download_shell) {
		download_shell.stdout.end();
		//download_shell.stdin.end();
		download_shell.kill("SIGTERM");
		download_shell = null;
	}
	if (MixlyBurnUpload.UPLOADING) {
		MixlyBurnUpload.UPLOADING = false;
		layer.msg('已取消上传', {
	        time: 1000
	    });
	} else if (MixlyBurnUpload.BURNING) {
		MixlyBurnUpload.BURNING = false;
		layer.msg('已取消烧录', {
	        time: 1000
	    });
	}
}

/**
* @ function 开始烧录
* @ description 开始一个烧录过程
* @ param comSelect {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ return void
*/
MixlyBurnUpload.burnStart = function (comSelect) {
	MixlySerial.initSerialList(comSelect, ports=>{
      	MixlySerial.interfaceDisplay(ports, true, false);
    });
}

/**
* @ function 判断当前环境，以开始一个烧录过程
* @ description 判断当前环境(当前界面处在Mixly2.0或浏览器中)，以开始一个烧录过程
* @ return void
*/
MixlyBurnUpload.initBurn = function () {
	if (Mixly_20_environment) {
		MixlyBurnUpload.BURNING = true;
  		MixlyBurnUpload.burnStart(MixlySerial.BURN_COM_SELECT);
	} else {
  		layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
              	type: 2, 
              	title:'固件初始化向导',
              	content: '../webdfu/dfu-util/initialize.html', //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
              	btn: ['返回'],
              	btnAlign: 'c',//按钮排列：居中对齐
              	area: ['800px', '600px']
            });
        });
  	}
}

/**
* @ function 判断当前环境，以开始一个上传过程
* @ description 判断当前环境(当前界面处在Mixly2.0或浏览器中)，以开始一个上传过程
* @ return void
*/
MixlyBurnUpload.initUpload = function () {
	if (Mixly_20_environment) {
		if (MixlyBurnUpload.uploadFileType == "hex") {
			MixlyBurnUpload.UPLOADING = true;
    		MixlyBurnUpload.uploadWithVolumeName(MixlyBurnUpload.uploadVolumeName, MixlyBurnUpload.uploadFilePath, false, MixlySerial.UPLOAD_COM_SELECT, false);
		} else {
			if (MixlyBurnUpload.uploadType == "volumeLabel") {
				MixlyBurnUpload.UPLOADING = true;
    			MixlyBurnUpload.uploadWithVolumeName(MixlyBurnUpload.uploadVolumeName, MixlyBurnUpload.uploadFilePath, true, MixlySerial.UPLOAD_COM_SELECT, false);
			} else {
				MixlySerial.initSerialList(MixlySerial.UPLOAD_COM_SELECT, ports=>{
			      	MixlySerial.interfaceDisplay(ports, false, false);
			    });
			}
		}
	} else {
		if (MixlyBurnUpload.uploadFileType == "hex") {
			update(deviceObj);
		} else {
			mixlyjs.savePyFileAs();
		}
	}
}

/**
* @ function 判断当前环境，以开始一个上传过程
* @ description 判断当前环境(当前界面处在Mixly2.0或浏览器中)，以开始一个上传过程，并从下拉列表中获取所选择的串口
* @ return void
*/
MixlyBurnUpload.initUploadWithDropdownBox = function () {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	if (MixlyBurnUpload.BURNING) {
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
	        //MixlyBurnUpload.esptoolBurn(com_data, MixlyBurnUpload.ESPTOOL_COMMAND[boardType]);
	        MixlyBurnUpload.esptoolBurnWithCmd(com_data);
      	}); 
	} else {
		if (MixlyBurnUpload.uploadFileType == "hex") {
			MixlyBurnUpload.uploadWithDropdownBox(MixlyBurnUpload.uploadFilePath, false, MixlySerial.UPLOAD_COM_SELECT);
		} else {
			MixlyBurnUpload.uploadWithDropdownBox(MixlyBurnUpload.uploadFilePath, true, MixlySerial.UPLOAD_COM_SELECT);
		}
	}
}

/**
* @ function 运行cmd
* @ description 通过所给串口运行用户提供的esptool的cmd指令
* @ param com {Array | String} 所选择的串口
* @ return void
*/
MixlyBurnUpload.esptoolBurnWithCmd = function (com) {
	MixlyStatusBar.show(1);
  	MixlyBurnUpload.BURNING = true;
	MixlyBurnUpload.runCommand(true, com, MixlySerial.BURN_COM_SELECT);
}

/**
* @ function 运行cmd
* @ description 通过所给串口运行用户提供的ampy的cmd指令
* @ param com {Array | String} 所选择的串口
* @ return void
*/
MixlyBurnUpload.ampyUploadWithCmd = function (com) {
	var code = MixlyBurnUpload.getPy();
	MixlyStatusBar.show(1);
  	MixlyBurnUpload.UPLOADING = true;
  	file_save.writeFile(MixlyBurnUpload.uploadFilePath, code, 'utf8', function(err){
	    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
	    if (err) {
	    	layer.closeAll('page');
	    	document.getElementById('webusb-flashing').style.display = 'none';
	    	layer.msg('写文件出错了，错误是：'+err, {
	            time: 1000
	        });
	        console.log('写文件出错了，错误是：'+err);
	        MixlyBurnUpload.UPLOADING = false;
	        return;
	    } else {
	    	MixlyBurnUpload.runCommand(false, com, MixlySerial.UPLOAD_COM_SELECT);
		}
	})
}

/**
* @ function 运行cmd
* @ description 通过所给信息运行用户提供的cmd指令
* @ param burn {Boolean} 烧录或上传，true - 烧录，false - 上传
* @ param com {Array | String} 所选择的串口
* @ param comSelect {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ return void
*/
MixlyBurnUpload.runCommand = function (burn, com, comSelect) {
	var now_command = "";
	try {
		if (burn)
			now_command = replaceWithReg(MixlyBurnUpload.burnCommand, com, "com");
		else 
			now_command = replaceWithReg(MixlyBurnUpload.uploadCommand, com, "com");
	} catch(e) {
		console.log(e);
	}
	console.log(now_command);
	download_shell = child_process.exec(now_command, function(error,stdout,stderr){
		if(error !==null){
	    	console.log("exec error"+error);
	    	MixlyStatusBar.addValue(error + "\n", false);
		} else {
	        layer.msg((burn?'烧录成功！':'上传成功！'), {
	            time: 1000
	        });
	        if (comSelect && !burn) {
				MixlySerial.refreshSerialList(comSelect);
				setTimeout(function () {
				  	MixlySerial.connectCom();
				  	MixlySerial.writeCtrlD();
				}, 1000);
			}
		}
		layer.closeAll('page');
		document.getElementById('webusb-flashing').style.display = 'none';
		MixlyStatusBar.scrollToTheBottom();
	})

	download_shell.stdout.on('data', function (data) {
		MixlyStatusBar.addValue(data, true);
	});
}