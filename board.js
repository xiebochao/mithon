/*
environment
0 - Mixly2.0
1 - Mixly Web
2 - Both
*/
var mixly_board = [
	{
		"BoardImg": "./files/mithon.png",
		"BoardName": "Mithon CC",
		"BoardDescription":"Experiment with Mithon CC",
		"BoardIndex": "./apps/mixly/index_board_MicroPython[NRF51822_mithon].html",
		"environment": 2,
		"ThirdPartyBoard": false,
		"Burn": "None",
	    "Upload": {
	        "type": "volumeLabel",
	        "volumeName": "MICROBIT",
	        "comSelect": [
	            {
	                "vendorId": "0D28",
	                "productId": "0204"
	            }
	        ],
	        "filePath": "\\hexbuild\\firmware.hex",
	        "pyCode": false
	    },
	    "nav": {
	    	"upload": true,
	    	"save": {
	    		"img": true,
	    		"py": true,
	    		"hex": true
	    	}
	    },
	    "serial": {
	    	"ctrlCBtn": true,
	    	"ctrlDBtn": true,
	    	"baudRates": 115200,
	    	"yMax": 100,
	    	"yMin": 0,
	    	"pointNum": 100
	    }
		//myBlock: "MicroPython[NRF51822_mithon]",
        //css: "color_mithon.css",
        //blocks: "mithon",
        //generators: "mithon",
        //converters: "mithon",
        //files: "mithon.png"
	},{
		"BoardImg": "./files/microbit.png",
		"BoardName": "BBC micro:bit",
		"BoardDescription":"Build cool projects with micro:bit",
		"BoardIndex": "./apps/mixly/index_board_MicroPython[NRF51822_microbit].html",
		"environment": 1,
		"ThirdPartyBoard": false,
		"Burn": "None",
	    "Upload": {
	        "type": "volumeLabel",
	        "volumeName": "MICROBIT",
	        "comSelect": [
	            {
	                "vendorId": "239A",
	                "productId": "80A8"
	            }
	        ],
	        "filePath": "\\hexbuild\\firmware.hex",
	        "pyCode": false
	    }
	}/*,{
		BoardImg: "./files/cp1.jpg",
		BoardName: "ESP32 S2",
		BoardDescription:"Play MixGoCE with CircuitPython",
		BoardIndex: "./apps/mixly/index_board_CircuitPython[ESP32S2_MixGoCE].html",
		environment: 2,
		ThirdPartyBoard: false,
        //myBlock: "CircuitPython[MixGoCE]",
        //css: "color_esp32_s2.css",
        //blocks: "esp32_s2",
        //generators: "esp32_s2",
        //converters: "esp32_s2",
        //files: "cp1.jpg",
        Serial: {
        	
        },
        Burn: {

        },
        Upload: {

        }
	}*/
	,{
	    "BoardImg": "./files/cp1.jpg",
	    "BoardName": "ESP32 S2",
	    "BoardDescription": "Play MixGoCE with CircuitPython",
	    "BoardIndex": "./apps/mixly/index_board_CircuitPython[ESP32S2_MixGoCE].html",
	    "environment": 2,
	    "ThirdPartyBoard": false,
	    "Burn": {
	        "comSelect": [
	            {
	                "vendorId": "303A",
	                "productId": "0002"
	            }
	        ],
	        "command": "{esptool} --port {com} --baud 460800 --after=no_reset write_flash 0x0000 {path}\\cpBuild\\ESP32S2_MixGoCE\\mixgoce.bin"
	    },
	    "Upload": {
	        "type": "volumeLabel",
	        "volumeName": "CIRCUITPY",
	        "comSelect": [
	            {
	                "vendorId": "239A",
	                "productId": "80A8"
	            }
	        ],
	        "filePath": "{path}\\cpBuild\\code.py",
	        "pyCode": true
	    },
	    "nav": {
	    	"burn": true,
	    	"upload": true,
	    	"save": {
	    		"img": true,
	    		"py": true
	    	}
	    },
	    "serial": {
	    	"ctrlCBtn": true,
	    	"ctrlDBtn": true,
	    	"baudRates": 115200,
	    	"yMax": 100,
	    	"yMin": 0,
	    	"pointNum": 100
	    }
	},{
		"BoardImg": "./files/webpy.png",
		"BoardName": "Python 3",
		"BoardDescription":"Code with Python 3",
		"BoardIndex": "./apps/mixly/index_board_mixpy.html",
		"environment": 0,
		"ThirdPartyBoard": false,
	    "nav": {
	    	"save": {
	    		"img": true,
	    		"py": true
	    	}
	    }
	},{
		"BoardImg": "./files/webpy.png",
		"BoardName": "Python 3",
		"BoardDescription":"Code with Python 3",
		"BoardIndex": "./apps/mixly/index_skulpt_board_mixpy.html",
		"environment": 1,
		"ThirdPartyBoard": false
	}/*,{
		BoardImg: "./files/mixgo1.jpg",
		BoardName: "MixGo",
		BoardDescription:"Play MixGo with MicroPython",
		BoardIndex: "./apps/mixly/index_board_MicroPython[ESP32_MixGo].html",
		environment: 2,
		ThirdPartyBoard: false
	},{
		BoardImg: "./files/uno.jpg",
		BoardName: "Arduino AVR",
		BoardDescription:"Play UNO with C/C++",
		BoardIndex: "./apps/mixly/index.html",
		environment: 0,
		ThirdPartyBoard: false
	}*/
];