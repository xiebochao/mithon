if (!Mixly_20_environment) throw false;

var serialById = null;

try {
    serialById = document.getElementById("serial-form");
    serialById.innerHTML = "";
} catch(e) {
    console.log(e);
}

function isNum(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function serialInit () {
	var htmlData = "";
	var serialCtrlCBtn = "true";
	var serialCtrlDBtn = "true";
	var serialBaudRates = "115200";
	var serialYMax = "100";
	var serialYMin = "0";
	var serialPointNum = "100";
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("serial.baudRates") && isNum(MixlyUrl.BOARD_CONFIG["serial.baudRates"])) {
		serialBaudRates = MixlyUrl.BOARD_CONFIG["serial.baudRates"];
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("serial.ctrlCBtn")) {
		serialCtrlCBtn = MixlyUrl.BOARD_CONFIG["serial.ctrlCBtn"].toLowerCase();
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("serial.ctrlDBtn")) {
		serialCtrlDBtn = MixlyUrl.BOARD_CONFIG["serial.ctrlDBtn"].toLowerCase();
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("serial.baudRates")) {
		serialBaudRates = MixlyUrl.BOARD_CONFIG["serial.baudRates"];
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("serial.yMax") && isNum(MixlyUrl.BOARD_CONFIG["serial.yMax"])) {
		serialYMax = MixlyUrl.BOARD_CONFIG["serial.yMax"];
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("serial.yMin") && isNum(MixlyUrl.BOARD_CONFIG["serial.yMin"])) {
		serialYMin = MixlyUrl.BOARD_CONFIG["serial.yMin"];
	}
	if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("serial.pointNum") && isNum(MixlyUrl.BOARD_CONFIG["serial.pointNum"])) {
		serialPointNum = MixlyUrl.BOARD_CONFIG["serial.pointNum"];
	}
	htmlData += `
    	<div class="layui-tab" lay-filter="serial" style="width: 100%;height: 100%;margin-top: 0px;margin-bottom: 0px;position: relative;">
      		<ul class="layui-tab-title" style="position: absolute;left: 0px;top: 0px;height: 40px;right: 0px;">
        		<li class="layui-this" lay-id="1">串口监视器</li>
        		<li lay-id="2">串口可视化</li>
      		</ul>
      		<div class="layui-tab-content" style="position: absolute;left: 0px;top: 40px;bottom: 0px;right: 0px;overflow: auto;">
        		<div class="layui-tab-item layui-show">
          			<div class="layui-form-item layui-form-text">
            			<label class="layui-form-label">串口</label>
            			<div id="div_select_com" class="layui-input-inline" style="width:50%;clear:none;">
              				<select id="select_com" lay-verify="required"></select>
            			</div>
            			<div id="div_cb_cf_baud_rates" class="layui-input-inline" style="width:38%;clear:none;">
              				<select id="cb_cf_baud_rates">
                				<option value="9600"${serialBaudRates == "9600"?" selected":""}>9600</option>
				                <option value="19200"${serialBaudRates == "19200"?" selected":""}>19200</option>
				                <option value="28800"${serialBaudRates == "28800"?" selected":""}>28800</option>
				                <option value="38400"${serialBaudRates == "38400"?" selected":""}>38400</option>
				                <option value="57600"${serialBaudRates == "57600"?" selected":""}>57600</option>
				                <option value="115200"${serialBaudRates == "115200"?" selected":""}>115200</option>
              				</select>
			            </div>
			            <button id="button_connect" onclick="MixlySerial.comOpenOrClose();" class="layui-btn layui-btn-normal" style="width:12%;">连接</button>
			        </div>
	          		<div class="layui-form-item layui-form-text">
	            		<label class="layui-form-label">发送数据</label>
			            <div class="layui-input-inline" style="width:70%;clear:none;">
			              <input id="serial_write" type="text" name="title" placeholder="请输入内容" autocomplete="off" class="layui-input">
			            </div>
			            <div id="div_send_data_with" class="layui-input-inline" style="width:18%;clear:none;">
			              <select id="send_data_with">
			                <option value="no">no</option>
			                <option value="\\n">\\n</option>
			                <option value="\\r">\\r</option>
			                <option value="\\r\\n" selected>\\r\\n</option>
			              </select>
			            </div>
	            		<button id="serial_write_btn" onclick="MixlySerial.write()" class="layui-btn layui-btn-normal" style="width:12%;">发送</button>
	          		</div>
		          	<div class="layui-form-item layui-form-text">
			            <label class="layui-form-label" style="height: 44px;padding-top: 1px;padding-bottom: 1px;">
			              	<p style="display:inline;">接收数据</p>
			              	<input style="display:none;">
			              	<input id="screen_scroll" type="checkbox" name="screen_scroll" title="滚屏" checked>
			              	<input id="serial_data_type" type="checkbox" name="serial_data_type" title="字符串" checked>
			            </label>
			            <div class="layui-input-block">
			                <textarea readonly id="serial_content" name="desc" wrap="off" spellcheck="false" placeholder="串口输出" class="layui-textarea" style="height:220px"></textarea>
			            </div>
			        </div>
			        <div class="layui-form-item layui-form-text">
			            <div style="text-align: center;"> 
			              	<button id="serial_clear_btn" onclick="MixlySerial.clearContent()" class="layui-btn layui-btn-danger">清空</button>
			              	${serialCtrlCBtn == "true"?'<button id="serial_interrupt_btn" onclick="MixlySerial.writeCtrlC()" class="layui-btn layui-btn-danger">中断</button>':''}
			              	${serialCtrlDBtn == "true"?'<button id="serial_reset_btn" onclick="MixlySerial.writeCtrlD()" class="layui-btn layui-btn-danger">复位</button>':''}
			            </div>
			        </div>
		        </div>
		        <div class="layui-tab-item">
		          	<div class="layui-form-item layui-form-text">
		            	<div class="layui-input-inline" style="width:15%;clear:none;">
		              		<label class="layui-form-label">最小</label>
		              		<input id="serial-y-min" type="text" name="title" autocomplete="off" class="layui-input" value="${serialYMin}">
		            	</div>
		            	<div class="layui-input-inline" style="width:15%;clear:none;">
		              		<label class="layui-form-label">最大</label>
		              		<input id="serial-y-max" type="text" name="title" autocomplete="off" class="layui-input" value="${serialYMax}">
		            	</div>
		            	<div id="div_serial_point_num" class="layui-input-inline" style="width:15%;clear:none;">
		              		<label class="layui-form-label">点数</label>
		              		<select id="serial-point-num">
				                <option value="50"${serialPointNum == "50"?" selected":""}>50</option>
				                <option value="100"${serialPointNum == "100"?" selected":""}>100</option>
				                <option value="150"${serialPointNum == "150"?" selected":""}>150</option>
				                <option value="200"${serialPointNum == "200"?" selected":""}>200</option>
				                <option value="250"${serialPointNum == "250"?" selected":""}>250</option>
				                <option value="300"${serialPointNum == "300"?" selected":""}>300</option>
				            </select>
		            	</div>
		            	<div class="layui-input-inline" style="width:55%;clear:none;">
		              		<label class="layui-form-label">发送数据</label>
		              		<div class="layui-input-inline" style="width:50%;clear:none;">
		                		<input id="serial_write_string" type="text" name="title" placeholder="请输入内容" autocomplete="off" class="layui-input">
		              		</div>
		              		<div id="div_send_string_data_with" class="layui-input-inline" style="width:25%;clear:none;">
				                <select id="send_string_data_with">
				                  	<option value="no">no</option>
				                  	<option value="\\n">\\n</option>
				                  	<option value="\\r">\\r</option>
				                  	<option value="\\r\\n" selected>\\r\\n</option>
				                </select>
		              		</div>
		              		<button id="serial_write_string_btn" onclick="MixlySerial.writeString()" class="layui-btn layui-btn-normal" style="width:25%;">发送</button>
		            	</div>
		          	</div>
		          	<div class="layui-form-item layui-form-text" style="padding-top: 25px;">
		            	<div id="com_data_draw" style="width: 100%;">
		            	</div>
		          	</div>
		        </div>
      		</div>
    	</div>
	`;
	if (serialById) {
		serialById.innerHTML = htmlData; 
	}
}

serialInit();