function writeToHex(){
	fso = new ActiveXObject("Scripting.FileSystemObject");
	f1 = fso.CreateTextFile("mithon.hex", true);
	f1.Write(doDownload());
	f1.Close();
}

function doDownload(){
	var firmware = $("#firmware").text();
	var output = getHexFile(firmware);
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

connect_btn.addEventListener("click", () => {selectDevice()});

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

// Update a device with the firmware image transferred from block/code
const update = async() => {
	let buffer = null;
	firmware = document.getElementById('firmware').innerText;
	hexfile = getHexFile(firmware);
	var hex2Blob = new Blob([hexfile],{type:'text/plain'});
	buffer =  await hex2Blob.arrayBuffer()
    if (!buffer) return;

    target.on(DAPjs.DAPLink.EVENT_PROGRESS, progress => {
        setTransfer(progress);
    });

    try {
        // Push binary to board
        // setStatus(`Flashing binary file ${buffer.byteLength} words long...`);
        await target.connect();
        await target.setSerialBaudrate(115200);
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                type: 1,
                title: '上传',
                content: $('#webusb-flashing'),
                closeBtn: 0
              });
          }); 
        await target.flash(buffer);
        layer.closeAll('page');
        await target.disconnect();
        // setStatus("Flash complete!");
    } catch (error) {
        setStatus(error);
        layer.closeAll('page');
    }
}
upload_btn.addEventListener("click", () => {update(deviceObj)});

const serialRead = async () => {
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            type: 1,
            area: ['700px','500px'],
            content: $('#serial-form') 
            });
      });
	if(!target.connected){
		try{
            await target.connect();
		}
		catch (e){
			console.error(e);
        }
	}
	//防止重复绑定事件监听
	target.removeAllListeners(DAPjs.DAPLink.EVENT_SERIAL_DATA);
	target.on(DAPjs.DAPLink.EVENT_SERIAL_DATA, data => {
		console.log(data);
        document.getElementById('serial_content').value = document.getElementById('serial_content').value + data;
        
	});
	await target.startSerialRead();	
}


serial_read_btn.addEventListener("click", () => {serialRead()});

//这两个事件对应的按钮渲染太慢，只能放到html onclick里
const clearSerialContent = async () => {
    document.getElementById('serial_content').value = '';
}

const serialWrite = async () => {
	if(!target.connected){
		try{
			await target.connect();
		}
		catch (e){
			console.error(e);
		}
	}
	if(await target.getSerialBaudrate() != 115200) {
		try{
			await target.setSerialBaudrate(115200);
		}
		catch (e){
			console.error(e);
		}
	}
	let serialWriteInput = document.getElementById('serial_write');
	let serialWriteContent = serialWriteInput.value;
	serialWriteInput.value = '';
	if(serialWriteContent != ''){
		await target.serialWrite(serialWriteContent);
        document.getElementById('serial_content').value = document.getElementById('serial_content').value + serialWriteContent + '\n';
		//可能是因为mutex lock的原因，每次发送后需要重新启动监听，并且清理缓冲区
		await target.stopSerialRead();
		await target.startSerialRead();
	}
}