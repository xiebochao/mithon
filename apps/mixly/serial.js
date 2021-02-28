var Serial_Port = require("serialport").SerialPort;
var serial_port = null;
var parser = null;
var Readline =null;

var com_connected = false;
function connect_com() {
    var com_data = $('#select_com option:selected').val();
    if (com_data) {
        if (com_connected) {
            //$("#button_connect").text("打开");
            //$("#button_connect").css("background-color","#eee");
            com_connected = false;
            serial_port.close();
        } else {
            serial_port = new SerialPort(com_data, {
	          baudRate: 115200,  //波特率
	          dataBits: 8,    //数据位
	          parity: 'none',  //奇偶校验
	          stopBits: 1,  //停止位
	          flowControl: false,
	          autoOpen:false //不自动打开1
	        }, false);
            Readline = SerialPort.parsers.Readline;
            parser = new Readline();
            serial_port.pipe(parser)
			serial_port.open(function (error) {
			  if (error) {
			    console.log('failed to open: ' + error + '\n');
			    $("#button_connect").text("打开");
			    $("#button_connect").css("background-color","#eee");
			    com_connected = false;
			    //refreshSerialList_select_com();
			    serial_port = null;
			    div_inout_middle_text.setValue(div_inout_middle_text.getValue() + error + "\n");
			    div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			  } else {
			  	$("#button_connect").text("关闭");
			  	$("#button_connect").css("background-color","#5bd46d");
	            com_connected = true;
	            layer.msg('已打开串口' + com_data, {
	                time: 1000
	            });
	            div_inout_middle_text.setValue('已打开串口' + com_data + '\n');
	            div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());

	            //添加串口发送控件
	            //$('#div_inout_middle').append('<input type="text" name="fname" id="text_send_data" style="position:absolute;left:0px;bottom:1px;height:15px;width:30%;background-color:#5bd46d;border-style:solid;border-width:1px;border-color:#000;opacity:1;" />');
    			//$('#div_inout_middle').append('<button id="button_send" onclick="button_send_data()" style="position:absolute;bottom:1px;height:15px;left:30.6%;">发送</button>');

			    //console.log('open');
			    parser.on('data', function(data) {
			        //console.log('data received: ' + data);
			        //div_inout_middle_text.setValue(div_inout_middle_text.getValue() + data);
			    	//div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			    	serial_show_data(serial_open, data);
			    });
			    serial_port.on('error', function(err) {
			        //console.log('data received: ' + data);
			        //div_inout_middle_text.setValue(div_inout_middle_text.getValue() + data);
			    	//div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			    	serial_show_data(serial_open, data);
			    });
			    //串口结束使用时执行此函数
			    serial_port.on('close', ()=>{
			        serial_port = null;
			        $("#button_connect").text("打开");
			        $("#button_connect").css("background-color","#eee");
			        div_inout_middle_text.setValue(div_inout_middle_text.getValue() + '已关闭串口' + com_data + '\n');
        		    div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
        			
        		    if (com_connected) {
        		    	if (py2block_config.board == "CircuitPython[ESP32_S2]")
        					py_refreshSerialList_del("cp", com_data);
        				else
        					py_refreshSerialList_del("mp", com_data);
        				com_connected = false;
        		    } else {
        		    	if (py2block_config.board == "CircuitPython[ESP32_S2]")
        					py_refreshSerialList_select_com("cp");
        				else
        					py_refreshSerialList_select_com("mp");
        		    }
	        		
	        		layer.msg('已关闭串口' + com_data, {
		                time: 1000
		            });
	        		//$("#text_send_data").remove();
	        		//$("#button_send").remove();
			    });
			  }
			});
        }
    } else {
        com_connected = false;
        if (py2block_config.board == "CircuitPython[ESP32_S2]")
			py_refreshSerialList_select_com("cp");
		else
			py_refreshSerialList_select_com("mp");
        $("#button_connect").text("打开");
        $("#button_connect").css("background-color","#eee");
        layer.msg('无可用设备!', {
            time: 1000
        });
    }
}

 
function stringToByte(str) {
    var len, c;
    len = str.length;
    var bytes = [];
    for(var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if(c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if(c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if(c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return new Int8Array(bytes);
}

function Uint8ArrayToString(fileData){
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
  	var convert = (fileData[i]).toString(16);
  	if (convert.length%2 == 1)
  		convert = "0"+convert;
    dataString = dataString + " " + convert.toUpperCase();
  }
 
  return dataString

}


function serialWrite() {
	if (serial_port) {
		if($('#select_serial_data_type option:selected').val() == "hex") {
			var ready_send_data = $("#serial_write").val();
			var string_send_hex = ready_send_data.trim().split(/\s+/);
			var num_send_hex = [];
			for(var i = 0; i < string_send_hex.length; i++) {
				if(parseInt(string_send_hex[i], 16))
					num_send_hex.push(parseInt(string_send_hex[i], 16));
			}
			serial_port.write(num_send_hex);
			var ready_send_data_end = $('#send_data_with option:selected').val();
			ready_send_data_end = ready_send_data_end.replace("\\r", "\r");
			ready_send_data_end = ready_send_data_end.replace("\\n", "\n");
			if( ready_send_data_end == "no" ) {
				ready_send_data_end = "";
			}
			if (ready_send_data) {
				serial_port.write(ready_send_data_end);
				$("#serial_write").val("");
			}
		} else {
			var ready_send_data = $("#serial_write").val();
			var ready_send_data_end = $('#send_data_with option:selected').val();
			ready_send_data_end = ready_send_data_end.replace("\\r", "\r");
			ready_send_data_end = ready_send_data_end.replace("\\n", "\n");
			if( ready_send_data_end == "no" ) {
				ready_send_data_end = "";
			}
			if (ready_send_data) {
				serial_port.write(ready_send_data + ready_send_data_end);
				$("#serial_write").val("");
			}
		}
	}
}

function serialWrite_ctrl_c() {
	if (serial_port) {
		serial_port.write([3,13,10]);
	}
}

function serialWrite_ctrl_d() {
	if (serial_port) {
		serial_port.write([3,4]);
	}
}

function serial_show_data(select, data) {
	if ($('#select_serial_data_type option:selected').val() == "hex") {
		data = Uint8ArrayToString(stringToByte(data));
		data = data.replace( /^\s*/, "");
		data += "\n";
	}
	if (select) {
		$("#serial_content").val($("#serial_content").val() + data);
		$("#screen_scroll")[0].checked == true && $("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);
	} else {
		div_inout_middle_text.setValue(div_inout_middle_text.getValue() + data);
		div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	}
}

function connect_com_with_option(select) {
	var com_data = $('#select_com option:selected').val();
	if (!com_data)
		return;
	if (com_connected) {
		if (serial_port.path == com_data) {
			return;
		} else {
			serial_port.close();
			com_connected = false;
			return;
		}
	}
	
    serial_port = new SerialPort(com_data, {
      baudRate: 115200,  //波特率
      dataBits: 8,    //数据位
      parity: 'none',  //奇偶校验
      stopBits: 1,  //停止位
      flowControl: false ,
      autoOpen:false //不自动打开1
    }, false);
    Readline = SerialPort.parsers.Readline;
    parser = new Readline();
    serial_port.pipe(parser);
	serial_port.open(function (error) {
	  if (error) {
	    console.log('failed to open: '+error);
	    $("#button_connect").text("打开");
	    $("#button_connect").css("background-color","#eee");
	    com_connected = false;
	    serial_port = null;
	    div_inout_middle_text.setValue(div_inout_middle_text.getValue() + error + "\n");
	    div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	  } else {
	  	layer.msg('已打开串口' + com_data, {
            time: 1000
        });
	  	com_connected = true;
	  	$("#button_connect").text("关闭");
	  	$("#button_connect").css("background-color","#5bd46d");
        com_connected = true;
        div_inout_middle_text.setValue('已打开串口' + com_data + '\n');
        div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());

        $("#serial_content").val('已打开串口' + com_data + '\n');
		$("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);

	    parser.on('data', function(data) {
	    	serial_show_data(serial_open, data);
	    	if (myChart && isNumber(parseInt(data))) {
	    		echarts_old_time = echarts_now_time;
	    		echarts_now_time = Number(new Date()) - echarts_start_time;
	    		if ((echarts_now_time - echarts_old_time) > 50) {
		    		var now_show_data = {
				        name: data,
				        value: [
				            echarts_now_time,
				            data-0
				        ]
				    };
				    //if (echarts_data.length > 1000)
				    //	echarts_data.shift();
				    echarts_data.push(now_show_data);
				}
	    	}
	    });
	    serial_port.on('error', function(err) {
	    	serial_show_data(serial_open, data);
	    });
	    //串口结束使用时执行此函数
	    serial_port.on('close', ()=>{
	        serial_port = null;
	        $("#button_connect").text("打开");
	        $("#button_connect").css("background-color","#eee");
			if (select) {
				$("#serial_content").val($("#serial_content").val() + '已关闭串口' + com_data + '\n');
				$("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);
			}
			if (com_connected) {
				div_inout_middle_text.setValue(div_inout_middle_text.getValue() + '已关闭串口' + com_data + '\n');
				div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
				com_connected = false;
			    py_refreshSerialList_select_com(select);
	    		
	    		layer.msg('已关闭串口' + com_data, {
	                time: 1000
	            });
	    	}
	    });
	  }
	});
}

function update_select_com() {
	if (serial_open 
		&& !document.querySelector("#div_select_com > div.layui-unselect.layui-form-select.layui-form-selected")
		&& !document.querySelector("#div_cb_cf_baud_rates > div.layui-unselect.layui-form-select.layui-form-selected")
		&& !document.querySelector("#div_send_data_with > div.layui-unselect.layui-form-select.layui-form-selected")
		&& !document.querySelector("#serial_data_type > div.layui-unselect.layui-form-select.layui-form-selected")
		 ) {
		if (py2block_config.board == "CircuitPython[ESP32_S2]") {
			py_refreshSerialList_select_com("cp");
			setTimeout(function () {
				connect_com_with_option("cp");
				status_bar_show(1);
			}, 150);
		} else {
			py_refreshSerialList_select_com("mp");
			setTimeout(function () {
				connect_com_with_option("mp");
				status_bar_show(1);
			}, 150);
		}

		//检测发送框提示信息是否与当前选择相符，不相符则更改
		if ( serial_port && serial_port.BaudRate != $('#div_cb_cf_baud_rates option:selected').val() )
			serial_port.BaudRate = $('#div_cb_cf_baud_rates option:selected').val();
		if ($('#select_serial_data_type option:selected').val() == "hex" && $("#serial_write").attr("placeholder") != "请输入二进制流  例如:0x03 0x04") {
			$("#serial_write").attr("placeholder","请输入内容  例如:0x03 0x04");
		} else if ($('#select_serial_data_type option:selected').val() == "string" && $("#serial_write").attr("placeholder") != "请输入内容") {
			$("#serial_write").attr("placeholder","请输入内容");
		}
	}
}