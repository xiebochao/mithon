const { spawn } = require('child_process');

var arduino_shell = null;

var MixlyArduino = {};
MixlyArduino.COMPILING = false;
MixlyArduino.UPLOADING = false;
MixlyArduino.statusBarUpdate = null;
MixlyArduino.nowStatusBarData = "";

/**
* @ function 取消编译或上传
* @ description 取消正在执行的编译或上传过程
* @ return void
*/
MixlyArduino.cancel = function () {
	MixlyArduino.statusBarUpdate && clearInterval(MixlyArduino.statusBarUpdate);
	if (arduino_shell) {
		try{
			arduino_shell.stdout.end();
			//download_shell.stdin.end();
			//var kill = spawn('kill', [arduino_shell.pid]);
			process.kill(arduino_shell.pid, 'SIGKILL');
			arduino_shell = null;
		} catch(e) {
			arduino_shell = null;
		}
	}
	layer.closeAll('page');
	document.getElementById('webusb-flashing').style.display = 'none';
	if (MixlyArduino.COMPILING) {
		layer.msg('已取消编译', {
	        time: 1000
	    });
	    MixlyStatusBar.addValue("==已取消编译==\n", false);
	} else {
		layer.msg('已取消上传', {
	        time: 1000
	    });
	    MixlyStatusBar.addValue("==已取消上传==\n", false);
	}
	MixlyStatusBar.scrollToTheBottom();
}

/**
* @ function 编译
* @ description 开始一个编译过程
* @ return void
*/
MixlyArduino.compile = function () {
	var boardType = $('#boards-type option:selected').val();
	MixlyArduino.COMPILING = true;
	MixlyStatusBar.show(1);
	layui.use('layer', function(){
	  	var layer = layui.layer;
		layer.open({
			type: 1,
			title: '编译中...',
			content: $('#webusb-flashing'),
			closeBtn: 0,
			end: function() {
			  	document.getElementById('webusb-flashing').style.display = 'none';
			}
		});
	}); 
	MixlyStatusBar.setValue("编译中...", true);
	MixlyArduino.runCmd(mixly_20_path + "\\arduino\\arduino_debug --pref build.path="+mixly_20_path+"\\mixlyBuild --verbose --board "+boardType+" --verify " + mixly_20_path + "\\testArduino\\testArduino.ino");
}

/**
* @ function 上传
* @ description 开始一个上传过程
* @ return void
*/
MixlyArduino.upload = function () {
	var boardType = $('#boards-type option:selected').val();
	if (MixlySerial.serialPort && MixlySerial.serialPort.isOpen) {
    	MixlySerial.serialPort.close();
  	}
	MixlyArduino.COMPILING = false;
	MixlySerial.initSerialList("all", ports=>{
      	var form = layui.form;
		const $devNames = $('#select_serial_device');
		var old_Device = $('#select_serial_device option:selected').val();
		$devNames.empty();
		_.map(v=>{
			if (`${v}` != "undefined") {
				if (`${v}` == old_Device) {
			  		$devNames.append($(`<option value="${v}" selected>${v}</option>`));
				} else {
					$devNames.append($(`<option value="${v}">${v}</option>`));
				}
			}
		}, ports);
		//$devNames.append('<option value="all">全部</option>');
		form.render();

		var device_num = document.getElementById("select_serial_device").length;
		if (device_num == 0) {
			var layer = layui.layer;
			layer.msg('无可用设备!', {
			  time: 1000
			});
		} else if (device_num == 1) {
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
			MixlyStatusBar.show(1);
			MixlyStatusBar.setValue("上传中...\n", true);
			var device_select_name = $('#select_serial_device option:selected').val();
			MixlyArduino.runCmd(mixly_20_path + "\\arduino\\arduino_debug --pref build.path="+mixly_20_path+"\\mixlyBuild --verbose --board "+boardType+" --port " + device_select_name + " --upload " + mixly_20_path + "\\testArduino\\testArduino.ino");
		} else {
			layui.use(['layer','form'], function(){
			  	var layer = layui.layer;
			  	layer.open({
					type: 1,
					id: "serialSelect",
					title: '检测到多个串口，请选择：',
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
		}
    });
}

/**
* @ function 上传
* @ description 当检测到多个串口时，使用此函数开始一个上传过程
* @ return void
*/
MixlyArduino.uploadStart = function () {
	var boardType = $('#boards-type option:selected').val();
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
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
        MixlyStatusBar.show(1);
		MixlyStatusBar.setValue("上传中...", true);
        var device_select_name = $('#select_serial_device option:selected').val();
		MixlyArduino.runCmd(mixly_20_path + "\\arduino\\arduino_debug --pref build.path="+mixly_20_path+"\\mixlyBuild --verbose --board "+boardType+" --port " + device_select_name + " --upload " + mixly_20_path + "\\testArduino\\testArduino.ino");
  	}); 
	
}

/**
* @ function 取消上传
* @ description 取消一个将要开始的上传过程
* @ return void
*/
MixlyArduino.uploadCancel = function () {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	layer.msg('已取消上传', {
        time: 1000
    });
	MixlyStatusBar.addValue("==已取消上传==\n", true);
}

/**
* @ function 运行一个cmd命令
* @ description 输入一行编译或上传的cmd命令
* @ param cmd {String} 输入的cmd命令
* @ return void
*/
MixlyArduino.runCmd = function (cmd) {
	var code = "";
	if (document.getElementById('tab_arduino').className == 'tabon') {
        code = editor.getValue();
	} else {
		code = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace) || '';
	}
	file_save.writeFile(mixly_20_path + "\\testArduino\\testArduino.ino", code,'utf8',function(err){
  		//如果err=null，表示文件使用成功，否则，表示希尔文件失败
  		if(err) {
    		layer.closeAll('page');
    		document.getElementById('webusb-flashing').style.display = 'none';
    		layer.msg('写文件出错了，错误是：'+err, {
	      		time: 1000
	    	});
      	} else {
      		/*
	    	download_shell = child_process.exec(mixly_20_path + "\\arduino\\arduino_debug --pref build.path="+mixly_20_path+"\\mixlyBuild --verbose --board arduino:avr:uno --verify " + mixly_20_path + "\\testArduino\\testArduino.ino",function(error,stdout,stderr){
		    	if(error !==null){
		        	console.log("exec error"+error);
		        	div_inout_middle_text.setValue(div_inout_middle_text.getValue() + error + "\n");
		    	} else {
		    		div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==编译成功==\n");
		            layer.msg('编译成功！', {
		                time: 1000
		            });
		   		}
		   		layer.closeAll('page');
        		document.getElementById('webusb-flashing').style.display = 'none';
		   		div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			})

			download_shell.stdout.on('data', function (data) {
	        	//console.log(data);
	        	div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + data);
	        	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	    	});
	    	*/
	    	file_save.writeFile(mixly_20_path + "\\arduino\\operation.cmd", cmd,'utf8',function(err){
		  		//如果err=null，表示文件使用成功，否则，表示希尔文件失败
		  		if(err) {
		    		layer.closeAll('page');
		    		document.getElementById('webusb-flashing').style.display = 'none';
		    		layer.msg('写文件出错了，错误是：'+err, {
			      		time: 1000
			    	});
		      	} else {
			    	arduino_shell = spawn(mixly_20_path + "\\arduino\\operation.cmd");
			    	MixlyArduino.nowStatusBarData = MixlyStatusBar.getValue();
			    	if (arduino_shell)
			    		MixlyArduino.statusBarUpdate = setInterval(MixlyArduino.statusBarRefresh, 100);
					arduino_shell.stdout.on('data', (data) => {
			        	MixlyArduino.nowStatusBarData += data;
					});

					arduino_shell.stderr.on('data', (data) => {
				        MixlyArduino.nowStatusBarData += data;
					});

					arduino_shell.on('close', (code) => {
						if (code == 0) {
							if (MixlyArduino.COMPILING) {
					            MixlyStatusBar.addValue("==编译成功==\n");
					            layer.msg('编译成功！', {
					                time: 1000
					            });
					        } else {
					            MixlyStatusBar.addValue("==上传成功==\n");
					            layer.msg('上传成功！', {
					                time: 1000
					            });
					        }
					        MixlyArduino.statusBarUpdate && clearInterval(MixlyArduino.statusBarUpdate);
				            layer.closeAll('page');
			        		document.getElementById('webusb-flashing').style.display = 'none';
				        	MixlyStatusBar.scrollToTheBottom();
				        	MixlyArduino.COMPILING = false;
						} else if (code == 1) {
							//用户终止运行
						} else {
							if (MixlyArduino.COMPILING) {
								MixlyStatusBar.addValue("==编译失败==\n");
					        } else {
					        	MixlyStatusBar.addValue("==上传失败==\n");
					        }
					        MixlyArduino.statusBarUpdate && clearInterval(MixlyArduino.statusBarUpdate);
							layer.closeAll('page');
			        		document.getElementById('webusb-flashing').style.display = 'none';
				        	MixlyStatusBar.scrollToTheBottom();
				        	MixlyArduino.COMPILING = false;
						}
					});
				}
			});
		}
	});
	
}

/**
* @ function 刷新状态栏
* @ description 更新最新数据到状态栏
* @ return void
*/
MixlyArduino.statusBarRefresh = function () {
	var layer_dispose_data = "";
	MixlyArduino.nowStatusBarData.trim().split('\n').forEach(function(v, i) {
		if (v.indexOf("StatusLogger") == -1 && v.indexOf("cc.arduino.packages.discoverers.serial.SerialDiscovery") == -1)
	  		layer_dispose_data = layer_dispose_data + v + "\n";
	})
	MixlyStatusBar.setValue(layer_dispose_data, true);
}

/**
* @ function 打开串口助手
* @ description 打开串口助手并尝试打开一个当前可以搜索到的串口
* @ return void
*/
MixlyArduino.serial = function () {
	layui.use(['layer','element','form'], function(){
        var layer = layui.layer;
        var element = layui.element;
        var serial_com_update = null;
        element.on('tab(serial)', function(elem){
        	if (elem.index == 1) {
        		MixlySerialEcharts.init();
        	} else {
        		MixlySerialEcharts.myChart && MixlySerialEcharts.myChart.dispose();
        		MixlySerialEcharts.update && clearInterval(MixlySerialEcharts.update);
        	}
		});
        layer.open({
            type: 1,
            id: "serial_page",
            title: false,
            area: serialFormUpdate(1),
            closeBtn: 1,
            resize:false,
            content: $('#serial-form'),
            success: function (layero, index) {
                layero[0].childNodes[1].childNodes[0].classList.remove('layui-layer-close2');
                layero[0].childNodes[1].childNodes[0].classList.add('layui-layer-close1');

                serial_com_update = setInterval(MixlySerial.updateSelectCom, 1200);
				MixlySerial.refreshSerialList(MixlySerial.UPLOAD_COM_SELECT);
				setTimeout(function () {
					MixlySerial.connectCom();
					MixlyStatusBar.show(1);
					$("#serial_content").val(MixlyStatusBar.getValue());
					MixlySerial.OPENED = true;
				}, 150);
            },
            end: function() {
	            document.getElementById('serial-form').style.display = 'none';
	            MixlyStatusBar.setValue($("#serial_content").val(), true);
    		    MixlySerialEcharts.myChart && MixlySerialEcharts.myChart.dispose();
    		    MixlySerialEcharts.update && clearInterval(MixlySerialEcharts.update);
    		    serial_com_update && clearInterval(serial_com_update);
    		    element.tabChange('serial', '1');
    		    MixlySerial.OPENED = false;
	        }
        });
    });
}
