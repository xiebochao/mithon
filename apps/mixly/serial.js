var serial_port = null;
var parser = null;
var Readline =null;
var serial_receive = "";


if (!Mixly_20_environment) throw false;
var Serial_Port = require("serialport").SerialPort;
 
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
		if($("#serial_data_type")[0].checked == false) {
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
	if ($("#serial_data_type")[0].checked == false) {
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
	if (serial_port && (serial_port.isOpen || serial_port.opening)) {
		if (serial_port.path == com_data) {
			return;
		} else {
			serial_port.close();
			return;
		}
	}
    serial_port = new SerialPort(com_data, {
      baudRate: $('#div_cb_cf_baud_rates option:selected').val() - 0,  //波特率
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
	    serial_port = null;
	    //$("#button_connect").text("打开");
	    //$("#button_connect").css("background-color","#eee");
	    //div_inout_middle_text.setValue(div_inout_middle_text.getValue() + error + "\n");
	    //div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	    return;
	  } else {
	  	//layer.msg('已打开串口' + com_data, {
        //    time: 1000
        //});
	  	//$("#button_connect").text("关闭");
	  	//$("#button_connect").css("background-color","#5bd46d");
        div_inout_middle_text.setValue('已打开串口' + com_data + '\n');
        div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());

        $("#serial_content").val('已打开串口' + com_data + '\n');
		$("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);

		var serial_data_update = setInterval(serial_data_refresh, 100);

	    parser.on('data', function(data) {
	    	serial_receive += data;
	    	if (myChart && isNumber(parseInt(data))) {
	    		echarts_now_time = Number(new Date()) - echarts_start_time;
	    		if ((echarts_now_time - echarts_old_time) > 1) {
		    		var now_show_data = {
				        name: data,
				        value: [
				            echarts_now_time,
				            data-0
				        ]
				    };		    
				    echarts_old_time = echarts_now_time;
				    //if (echarts_data.length > 1000)
				    //	echarts_data.shift();
				    echarts_data.push(now_show_data);
				}
	    	}
	    });
	    serial_port.on('error', function(err) {
	    	serial_data_update && clearInterval(serial_data_update);
	    	serial_show_data(serial_open, data);
	    });
	    //串口结束使用时执行此函数
	    serial_port.on('close', ()=>{
	        //$("#button_connect").text("打开");
	        //$("#button_connect").css("background-color","#eee");
	        serial_data_update && clearInterval(serial_data_update);
			$("#serial_content").val($("#serial_content").val() + '已关闭串口' + com_data + '\n');
			$("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);
			div_inout_middle_text.setValue(div_inout_middle_text.getValue() + '已关闭串口' + com_data + '\n');
			div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			
			/*
			if (serial_port && serial_port.isOpen) {
				div_inout_middle_text.setValue(div_inout_middle_text.getValue() + '已关闭串口' + com_data + '\n');
				div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			    py_refreshSerialList_select_com(select);
	    		
	    		layer.msg('已关闭串口' + com_data, {
	                time: 1000
	            });
	    	}
	    	*/

	    	serial_port = null;
	    });
	  }
	});
}

function update_select_com() {
	if (serial_open 
		&& !document.querySelector("#div_select_com > div.layui-unselect.layui-form-select.layui-form-selected")
		&& !document.querySelector("#div_cb_cf_baud_rates > div.layui-unselect.layui-form-select.layui-form-selected")
		&& !document.querySelector("#div_send_data_with > div.layui-unselect.layui-form-select.layui-form-selected")
		) {
		try{
			if (py2block_config.board == "CircuitPython[ESP32_S2]") {
				py_refreshSerialList_select_com("cp");
				setTimeout(function () {
					connect_com_with_option("cp");
					status_bar_show(1);
				}, 150);
			} else if (py2block_config.board == "microbit[py]") {
				py_refreshSerialList_select_com("mp");
				setTimeout(function () {
					connect_com_with_option("mp");
					status_bar_show(1);
				}, 150);
			} else {
				py_refreshSerialList_select_com("esp32");
				setTimeout(function () {
					connect_com_with_option("esp32");
					status_bar_show(1);
				}, 150);
			}
		} catch(e) {
			py_refreshSerialList_select_com("arduino");
			setTimeout(function () {
				connect_com_with_option("arduino");
				status_bar_show(1);
			}, 500);
		}

		//检测发送框提示信息是否与当前选择相符，不相符则更改
		if ( serial_port && serial_port.isOpen && serial_port.baudRate != $('#div_cb_cf_baud_rates option:selected').val() - 0 ) {
			//var com_data = serial_port.path;
			serial_port.close();
			//serial_port.settings.baudRate = $('#div_cb_cf_baud_rates option:selected').val() - 0;
		}
		if ($("#serial_data_type")[0].checked == false && $("#serial_write").attr("placeholder") != "请输入二进制流  例如:0x03 0x04") {
			$("#serial_write").attr("placeholder","请输入内容  例如:0x03 0x04");
		} else if ($("#serial_data_type")[0].checked == true && $("#serial_write").attr("placeholder") != "请输入内容") {
			$("#serial_write").attr("placeholder","请输入内容");
		}
	}
}

function serial_data_refresh() {
	var serial_receive_old = "";
	var serial_dispose_data = [];
	if (serial_open) {
		serial_receive_old = $("#serial_content").val();
	} else {
		serial_receive_old = div_inout_middle_text.getValue();
	}
	serial_receive_old.trim().split('\n').forEach(function(v, i) {
	  	serial_dispose_data.push(v);
	})
	
	if ($("#serial_data_type")[0].checked == false) {
		serial_receive = Uint8ArrayToString(stringToByte(serial_receive));
		serial_receive = serial_receive.replace( /^\s*/, "");
		serial_receive += "\n";
	}

	serial_receive_old = "";
	if (serial_dispose_data.length >= 1000) {
		for (var z = serial_dispose_data.length - 1000; z < serial_dispose_data.length; z++) {
			serial_receive_old += serial_dispose_data[z] + "\n";
		}
	} else {
		for (var z = 0; z < serial_dispose_data.length; z++) {
			serial_receive_old += serial_dispose_data[z] + "\n";
		}
	}
	if (serial_open) {
		$("#serial_content").val(serial_receive_old + serial_receive);
		$("#screen_scroll")[0].checked == true && $("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);
	} else {
		div_inout_middle_text.setValue(serial_receive_old + serial_receive);
		div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	}
	serial_receive = "";
}