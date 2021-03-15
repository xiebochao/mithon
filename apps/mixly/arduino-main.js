const { spawn } = require('child_process');
var arduino_shell = null;
var arduino_compiling = false;
var arduino_layer_update = null;
var now_layer_data = "";

function arduino_cancel() {
	arduino_layer_update && clearInterval(arduino_layer_update);
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
	if (arduino_compiling) {
		layer.msg('已取消编译', {
	        time: 1000
	    });
	    div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==已取消编译==\n");
	} else {
		layer.msg('已取消上传', {
	        time: 1000
	    });
	    div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==已取消上传==\n");
	}
	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
}

function arduino_compile(boardType) {
	arduino_compiling = true;
	status_bar_show(1);
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
	div_inout_middle_text.setValue("编译中...");
	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	arduino_run(mixly_20_path + "\\arduino\\arduino_debug --pref build.path="+mixly_20_path+"\\mixlyBuild --verbose --board "+boardType+" --verify " + mixly_20_path + "\\testArduino\\testArduino.ino");
}

function arduino_upload(boardType) {
	if (serial_port && serial_port.isOpen) {
    	serial_port.close();
  	}
	arduino_compiling = false;
	initmp_firmware_SerialList(ports=>{
      	var form = layui.form;
		const $devNames = $('#select_serial_device');
		$devNames.empty();
		_.map(v=>{
		if (`${v}` != "undefined")
		  	$devNames.append($(`<option value="${v}">${v}</option>`));
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
			status_bar_show(1);
			div_inout_middle_text.setValue("上传中...\n");
			div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			var device_select_name = $('#select_serial_device option:selected').val();
			arduino_run(mixly_20_path + "\\arduino\\arduino_debug --pref build.path="+mixly_20_path+"\\mixlyBuild --verbose --board "+boardType+" --port " + device_select_name + " --upload " + mixly_20_path + "\\testArduino\\testArduino.ino");
		} else {
			layui.use(['layer','form'], function(){
			  	var layer = layui.layer;
			  	layer.open({
					type: 1,
					title: '检测到多个串口，请选择：',
					area: ['350px','170px'],
					content: $('#serial-device-form'),
					closeBtn: 0,
					end: function() {
						document.getElementById('serial-device-form').style.display = 'none';
					}
			  	});
			}); 
		}
    });
}

function arduino_upload_start(boardType) {
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
        status_bar_show(1);
		div_inout_middle_text.setValue("上传中...");
		div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
        var device_select_name = $('#select_serial_device option:selected').val();
		arduino_run(mixly_20_path + "\\arduino\\arduino_debug --pref build.path="+mixly_20_path+"\\mixlyBuild --verbose --board "+boardType+" --port " + device_select_name + " --upload " + mixly_20_path + "\\testArduino\\testArduino.ino");
  	}); 
	
}

function arduino_upload_cancel() {
	layer.closeAll('page');
	document.getElementById('serial-device-form').style.display = 'none';
	layer.msg('已取消上传', {
        time: 1000
    });
    div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==已取消上传==\n");
	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
}

function arduino_run(cmd) {
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
			    	now_layer_data = div_inout_middle_text.getValue();
			    	if (arduino_shell)
			    		arduino_layer_update = setInterval(arduino_layer_refresh, 100);
					arduino_shell.stdout.on('data', (data) => {
					  	//div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + data);
			        	//div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			        	now_layer_data += data;
					});

					arduino_shell.stderr.on('data', (data) => {
						//var err_data = data.toString();
						//var err = "";
						//if (err_data.indexOf("错误") != -1 || err_data.indexOf("ERROR") != -1 || err_data.indexOf("avrdude:") != -1) {
							//err_data.trim().split('\n').forEach(function(v, i) {
							//	if (v.indexOf("StatusLogger") == -1) {
							//	  err = err + v + "\n";
							//	}
							//})
						//div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + data);
				        //div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
				        //}
				        now_layer_data += data;
					});

					arduino_shell.on('close', (code) => {
						if (code == 0) {
							if (arduino_compiling) {
								div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==编译成功==\n");
					            layer.msg('编译成功！', {
					                time: 1000
					            });
					        } else {
					        	div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==上传成功==\n");
					            layer.msg('上传成功！', {
					                time: 1000
					            });
					        }
					        arduino_layer_update && clearInterval(arduino_layer_update);
				            layer.closeAll('page');
			        		document.getElementById('webusb-flashing').style.display = 'none';
				        	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
				        	arduino_compiling = false;
						} else if (code == 1) {
							//用户终止运行
						} else {
							if (arduino_compiling) {
								div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==编译失败==\n");
					        } else {
					        	div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==上传失败==\n");
					        }
					        arduino_layer_update && clearInterval(arduino_layer_update);
							layer.closeAll('page');
			        		document.getElementById('webusb-flashing').style.display = 'none';
				        	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
				        	arduino_compiling = false;
						}
					});
				}
			});
		}
	});
	
}

function arduino_layer_refresh() {
	var layer_dispose_data = "";
	now_layer_data.trim().split('\n').forEach(function(v, i) {
		if (v.indexOf("StatusLogger") == -1 && v.indexOf("cc.arduino.packages.discoverers.serial.SerialDiscovery") == -1)
	  		layer_dispose_data = layer_dispose_data + v + "\n";
	})
	div_inout_middle_text.setValue(layer_dispose_data);
	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
}

function arduino_serial() {
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
				py_refreshSerialList_select_com("esp32");
				setTimeout(function () {
					connect_com_with_option("esp32");
					$("#serial_content").val(div_inout_middle_text.getValue());
					status_bar_show(1);
					serial_open = true;
				}, 150);
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
