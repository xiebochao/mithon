if (!Mixly_20_environment) throw false;

const SerialPort = require('serialport');
const _ = require('lodash/fp');
var MixlySerial = {};

MixlySerial.serialPort = null;
MixlySerial.PARSER = null;
MixlySerial.READ_LINE =null;
MixlySerial.SERIAL_RECEIVE = "";

MixlySerial.OPENED = false;

MixlySerial.BURN_COM_SELECT = null;

MixlySerial.UPLOAD_COM_SELECT = null;

/**
* @ function 设置当前板卡串口的VID和PID
* @ description 读取此板卡的配置数据，设置此板卡烧录和上传时的串口PID和VID
* @ param type {String} "Burn" - 设置烧录时串口的PID和VID，"Upload" - 设置上传时串口的PID和VID
* @ return void
*/
MixlyBurnUpload.SetComSelect = function (type) {
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty(type+".comSelect[0].productId")
		&& MixlyUrl.BOARD_CONFIG.hasOwnProperty(type+".comSelect[0].vendorId")) {
		if (type == "Burn")
			MixlySerial.BURN_COM_SELECT = [];
		else 
			MixlySerial.UPLOAD_COM_SELECT = [];
		var i = 0;
		while (MixlyUrl.BOARD_CONFIG.hasOwnProperty(type+".comSelect["+i+"].productId")
			&& MixlyUrl.BOARD_CONFIG.hasOwnProperty(type+".comSelect["+i+"].vendorId")) {
			var comSelect = [];
			comSelect.push(MixlyUrl.BOARD_CONFIG[type+".comSelect["+i+"].vendorId"]);
			comSelect.push(MixlyUrl.BOARD_CONFIG[type+".comSelect["+i+"].productId"]);
			if (type == "Burn")
				MixlySerial.BURN_COM_SELECT.push(comSelect);
			else
				MixlySerial.UPLOAD_COM_SELECT.push(comSelect);
			i++;
		}
	} else {
		if (type == "Burn")
			MixlySerial.BURN_COM_SELECT = "all";
		else
			MixlySerial.UPLOAD_COM_SELECT = "all";
	}
}

try {
	MixlyBurnUpload.SetComSelect("Burn");
	MixlyBurnUpload.SetComSelect("Upload");
} catch(e) {
	console.log(e);
}

/**
* @ function 初始化串口列表
* @ description 通过传入的串口PID和VID初始化串口列表
* @ param select {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ param cb {function} 
* @ return void
*/
MixlySerial.initSerialList = function (select, cb) {
	SerialPort.list().then(ports => {
		const names = ports.map(p=>{
			if (select == "all")
				return p.comName;
			if (typeof(select) == "object") {
				if (typeof(select[0]) == "object") {
					for (var i = 0; i < select.length; i++) {
						for (var j = 0; j < select[i].length; j++) {
							if (select[i].length ==2 && p.vendorId == select[i][0] && p.productId == select[i][1]) {
								return p.comName;
							}
						}
					}
				} else {
					if (select.length == 2 && p.vendorId == select[0] && p.productId == select[1]) {
			  			return p.comName;
					}
				}
			}
		});
		if(typeof cb === 'function') {
			cb(names);
		}
	});
}

/**
* @ function 刷新串口列表
* @ description 刷新串口列表并更新串口到串口下拉列表内
* @ param select {Array | String} 通过串口的VID和PID获取对应串口，当为all时，则获取全部串口
* @ return void
*/
MixlySerial.refreshSerialList = function (select) {
	var old_com_is_empty = true;
  	var old_com = null;
  	var com_num = 0;
  	var form = layui.form;
  	var old_Device = $('#select_serial_device option:selected').val();
    MixlySerial.initSerialList(select, ports=>{
	  	const $devNames = $('#select_com');
	  	old_com = $devNames.val();
	  	$devNames.empty();
	  	_.map(v=>{
	    	if (`${v}` == old_com)
	      		old_com_is_empty = false;
	    	if (`${v}` != "undefined") {
	      		if (`${v}` == old_Device) {
	        		$devNames.append($(`<option value="${v}" selected>${v}</option>`));
	      		} else {
	        		$devNames.append($(`<option value="${v}">${v}</option>`));
	      		}
	    	}
	    	com_num++;
	  	}, ports);
	  	if(com_num) {
	    	if (old_com_is_empty) {
	      		$devNames.val($devNames.eq(0).val());
	    	} else {
	      		$devNames.val(old_com);
	    	}
	  	}
	});
  	form.render();
}

/**
* @ function 烧录或上传时判断是否有多个设备
* @ description 判断是否有多个设备，如果存在，则弹出设备选择框，若不存在，则开始一个烧录或上传过程
* @ param burn {Boolean} 烧录或上传，true - 烧录，false - 上传
* @ param addAllSelect {Boolean} 是否在串口下拉框内添加【全部】选项，true - 添加，false - 不添加
* @ return void
*/
MixlySerial.interfaceDisplay = function (ports, burn, addAllSelect) {
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

	if (addAllSelect) {
		if (old_Device == 'all') {
			$devNames.append('<option value="all" selected>全部</option>');
		} else {
			$devNames.append('<option value="all">全部</option>');
		}
	}

	form.render();

	var device_num = document.getElementById("select_serial_device").length;

	if (device_num > addAllSelect) {
		if (burn)
			MixlyBurnUpload.BURNING = true;
		else 
			MixlyBurnUpload.UPLOADING = true;
	}
	if (device_num == addAllSelect) {
		layer.msg('无可用设备!', {
		  	time: 1000
		});
	} else if (device_num == 1 + addAllSelect) {
		layui.use('layer', function(){
		  	var layer = layui.layer;
		  	layer.open({
			    type: 1,
			    title: (burn?'烧录中...':'上传中...'),
			    content: $('#webusb-flashing'),
			    closeBtn: 0,
			    end: function() {
			      	document.getElementById('webusb-flashing').style.display = 'none';
			    }
		  	});
		  	var com_data = $('#select_serial_device option:selected').val();
		  	if (burn) {
		 		//MixlyBurnUpload.esptoolBurn(com_data, MixlyBurnUpload.ESPTOOL_COMMAND[boardType]);
		 		MixlyBurnUpload.esptoolBurnWithCmd(com_data);
		  	} else {
		  		//MixlyBurnUpload.uploadByAmpy();
		  		MixlyBurnUpload.ampyUploadWithCmd(com_data);
		  	}
		}); 
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

function Uint8ArrayToString(fileData) {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
  	var convert = (fileData[i]).toString(16);
  	if (convert.length%2 == 1)
  		convert = "0"+convert;
    dataString = dataString + " " + convert.toUpperCase();
  }
 
  return dataString

}

/**
* @ function 读取串口发送框数据并发送
* @ description 读取串口发送框数据并发送，然后清空串口发送框
* @ return void
*/
MixlySerial.write = function () {
	if (MixlySerial.serialPort) {
		if($("#serial_data_type")[0].checked == false) {
			var ready_send_data = $("#serial_write").val();
			var string_send_hex = ready_send_data.trim().split(/\s+/);
			var num_send_hex = [];
			for(var i = 0; i < string_send_hex.length; i++) {
				if(parseInt(string_send_hex[i], 16))
					num_send_hex.push(parseInt(string_send_hex[i], 16));
			}
			MixlySerial.serialPort.write(num_send_hex);
			var ready_send_data_end = $('#send_data_with option:selected').val();
			ready_send_data_end = ready_send_data_end.replace("\\r", "\r");
			ready_send_data_end = ready_send_data_end.replace("\\n", "\n");
			if( ready_send_data_end == "no" ) {
				ready_send_data_end = "";
			}
			if (ready_send_data) {
				MixlySerial.serialPort.write(ready_send_data_end);
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
				MixlySerial.serialPort.write(ready_send_data + ready_send_data_end);
				$("#serial_write").val("");
			}
		}
	}
}

/**
* @ function 串口发送
* @ description 串口发送Ctrl + C
* @ return void
*/
MixlySerial.writeCtrlC = function () {
	if (MixlySerial.serialPort) {
		MixlySerial.serialPort.write([3,13,10]);
	}
}

/**
* @ function 串口发送
* @ description 串口发送Ctrl + D
* @ return void
*/
MixlySerial.writeCtrlD = function () {
	if (MixlySerial.serialPort) {
		MixlySerial.serialPort.write([3,4]);
	}
}

/**
* @ function 显示串口数据
* @ description 显示串口数据到串口输出框或状态栏
* @ param select {Boolean} true - 显示数据到串口输出框，false - 显示数据到状态栏
* @ param data {String} 显示的数据
* @ return void
*/
MixlySerial.showData = function (select, data) {
	if ($("#serial_data_type")[0].checked == false) {
		data = Uint8ArrayToString(stringToByte(data));
		data = data.replace( /^\s*/, "");
		data += "\n";
	}
	if (select) {
		$("#serial_content").val($("#serial_content").val() + data);
		$("#screen_scroll")[0].checked == true && $("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);
	} else {
		MixlyStatusBar.addValue(data, true);
	}
}

/**
* @ function 连接串口
* @ description 读取串口下拉列表中选中的串口并连接
* @ return void
*/
MixlySerial.connectCom = function () {
	var com_data = $('#select_com option:selected').val();
	if (!com_data)
		return;
	if (MixlySerial.serialPort && (MixlySerial.serialPort.isOpen || MixlySerial.serialPort.opening)) {
		if (MixlySerial.serialPort.path == com_data) {
			return;
		} else {
			MixlySerial.serialPort.close();
			return;
		}
	}
    MixlySerial.serialPort = new SerialPort(com_data, {
      	baudRate: $('#div_cb_cf_baud_rates option:selected').val() - 0,  //波特率
      	dataBits: 8,    //数据位
      	parity: 'none',  //奇偶校验
      	stopBits: 1,  //停止位
      	flowControl: false ,
      	autoOpen:false //不自动打开1
    }, false);
    MixlySerial.READ_LINE = SerialPort.parsers.Readline;
    MixlySerial.PARSER = new MixlySerial.READ_LINE();
    MixlySerial.serialPort.pipe(MixlySerial.PARSER);
	MixlySerial.serialPort.open(function (error) {
	  if (error) {
	    console.log('failed to open: '+error);
	    MixlySerial.serialPort = null;
	    $("#button_connect").text("打开");
	    $("#button_connect").attr("class","layui-btn layui-btn-normal");
	    return;
	  } else {
	  	$("#button_connect").text("关闭");
	  	$("#button_connect").attr("class","layui-btn layui-btn-danger");
        MixlyStatusBar.setValue('已打开串口' + com_data + '\n', true);

        $("#serial_content").val('已打开串口' + com_data + '\n');
		$("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);

		var serial_data_update = setInterval(MixlySerial.dataRefresh, 100);

	    MixlySerial.PARSER.on('data', function(data) {
	    	MixlySerial.SERIAL_RECEIVE += data;
	    	MixlySerialEcharts.draw(data);
	    });
	    MixlySerial.serialPort.on('error', function(err) {
	    	serial_data_update && clearInterval(serial_data_update);
	    	MixlySerial.showData(MixlySerial.OPENED, data);
	    });
	    //串口结束使用时执行此函数
	    MixlySerial.serialPort.on('close', ()=>{
	        $("#button_connect").text("打开");
	        $("#button_connect").attr("class","layui-btn layui-btn-normal");
	        serial_data_update && clearInterval(serial_data_update);
			$("#serial_content").val($("#serial_content").val() + '已关闭串口' + com_data + '\n');
			$("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);
			MixlyStatusBar.addValue('已关闭串口' + com_data + '\n', true);

	    	MixlySerial.serialPort = null;
	    });
	  }
	});
}

/**
* @ function 更新串口工具界面
* @ description 刷新串口列表，并更新数据到串口工具页面
* @ return void
*/
MixlySerial.updateSelectCom = function () {
	if (MixlySerial.OPENED 
		&& !document.querySelector("#div_select_com > div.layui-unselect.layui-form-select.layui-form-selected")
		&& !document.querySelector("#div_cb_cf_baud_rates > div.layui-unselect.layui-form-select.layui-form-selected")
		&& !document.querySelector("#div_send_data_with > div.layui-unselect.layui-form-select.layui-form-selected")
		) {
		
		MixlySerial.refreshSerialList(MixlySerial.UPLOAD_COM_SELECT);

		/*
		setTimeout(function () {
			MixlySerial.connectCom();
			MixlyStatusBar.show(1);
		}, 500);
		*/

		if ( MixlySerial.serialPort && MixlySerial.serialPort.isOpen && MixlySerial.serialPort.path != $('#select_com option:selected').val()) {
			MixlySerial.serialPort.close();
			setTimeout(function () {
				MixlySerial.connectCom();
				MixlyStatusBar.show(1);
			}, 500);
		}
		

		//检测发送框提示信息是否与当前选择相符，不相符则更改
		if ( MixlySerial.serialPort && MixlySerial.serialPort.isOpen && MixlySerial.serialPort.baudRate != $('#div_cb_cf_baud_rates option:selected').val() - 0 ) {
			//var com_data = MixlySerial.serialPort.path;
			//MixlySerial.serialPort.settings.baudRate = $('#div_cb_cf_baud_rates option:selected').val() - 0;
			MixlySerial.serialPort.close();
			setTimeout(function () {
				MixlySerial.connectCom();
				MixlyStatusBar.show(1);
			}, 500);
		}
		if ($("#serial_data_type")[0].checked == false && $("#serial_write").attr("placeholder") != "请输入二进制流  例如:0x03 0x04") {
			$("#serial_write").attr("placeholder","请输入内容  例如:0x03 0x04");
		} else if ($("#serial_data_type")[0].checked == true && $("#serial_write").attr("placeholder") != "请输入内容") {
			$("#serial_write").attr("placeholder","请输入内容");
		}
	}
}

/**
* @ function 更新串口输出框中数据
* @ description 更新串口数据到串口输出框
* @ return void
*/
MixlySerial.dataRefresh = function () {
	var serial_receive_old = "";
	var serial_dispose_data = [];
	if (MixlySerial.OPENED) {
		serial_receive_old = $("#serial_content").val();
	} else {
		serial_receive_old = MixlyStatusBar.getValue();
	}
	serial_receive_old.trim().split('\n').forEach(function(v, i) {
	  	serial_dispose_data.push(v);
	})
	
	if ($("#serial_data_type")[0].checked == false) {
		MixlySerial.SERIAL_RECEIVE = Uint8ArrayToString(stringToByte(MixlySerial.SERIAL_RECEIVE));
		MixlySerial.SERIAL_RECEIVE = MixlySerial.SERIAL_RECEIVE.replace( /^\s*/, "");
		MixlySerial.SERIAL_RECEIVE += "\n";
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
	if (MixlySerial.OPENED) {
		$("#serial_content").val(serial_receive_old + MixlySerial.SERIAL_RECEIVE);
		$("#screen_scroll")[0].checked == true && $("#serial_content").scrollTop($("#serial_content")[0].scrollHeight);
	} else {
		MixlyStatusBar.setValue(serial_receive_old + MixlySerial.SERIAL_RECEIVE, true);
	}
	MixlySerial.SERIAL_RECEIVE = "";
}

/**
* @ function 打开串口工具
* @ description 打开串口工具并打开串口列表中选中的串口
* @ return void
*/
MixlySerial.openSerial = function () {
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
            	document.getElementById("serial_page").style.overflow="hidden";

                layero[0].childNodes[1].childNodes[0].classList.remove('layui-layer-close2');
                layero[0].childNodes[1].childNodes[0].classList.add('layui-layer-close1');

                serial_com_update = setInterval(MixlySerial.updateSelectCom, 1200);
				MixlySerial.refreshSerialList(MixlySerial.UPLOAD_COM_SELECT);
				setTimeout(function () {
					MixlySerial.connectCom();
					$("#serial_content").val(MixlyStatusBar.getValue());
					MixlyStatusBar.show(1);
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

/**
* @ function 打开串口工具
* @ description 判断当前环境已打开对应的串口工具
* @ return void
*/
MixlySerial.init = function () {
	if (Mixly_20_environment) {
		MixlySerial.openSerial();
	} else {
		web_serialRead();
	}
}

/**
* @ function 清空串口输出框
* @ description 清空当前串口输出框中的数据
* @ return void
*/
MixlySerial.clearContent = function () {
    document.getElementById('serial_content').value = '';
}

/**
* @ function 打开或关闭串口
* @ description 若串口已打开，则关闭它，反之则打开它
* @ return void
*/
MixlySerial.comOpenOrClose = function () {
	if (MixlySerial.serialPort && (MixlySerial.serialPort.isOpen || MixlySerial.serialPort.opening)) {
		MixlySerial.serialPort.close();
	} else {
		MixlySerial.connectCom();
		MixlyStatusBar.show(1);
	}
}