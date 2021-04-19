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
	},{
	    "BoardImg": "./files/cp1.jpg",
	    "BoardName": "MixGo CE",
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
		"BoardImg": "./files/py.png",
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
		"BoardName": "Python 3 Lite",
		"BoardDescription":"Code with Python 3",
		"BoardIndex": "./apps/mixly/index_skulpt_board_mixpy.html",
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
	},{
	    "BoardImg": "./files/uno.jpg",
	    "BoardName": "Arduino AVR",
	    "BoardDescription": "Play UNO with C/C++",
	    "BoardIndex": "./apps/mixly/index.html",
	    "environment": 0,
	    "myBlock": "Arduino",
	    "css": "color.css",
	    "blocks": "arduino",
	    "generators": "arduino",
	    "files": "uno.jpg",
	    "board": {
	        "Arduino/Genuino Uno": "arduino:avr:uno",
	        "Arduino Nano w/ ATmega328P": "arduino:avr:nano:cpu=atmega328",
	        "Arduino Nano w/ ATmega328P (old bootloader)": "arduino:avr:nano:cpu=atmega328old",
	        "Arduino Nano w/ ATmega168": "arduino:avr:nano:cpu=atmega168",
	        "Arduino Pro or Pro Mini (5V, 16 MHz) w/ ATmega328P": "arduino:avr:pro:cpu=16MHzatmega328",
	        "Arduino Pro or Pro Mini (3.3V, 8 MHz) w/ ATmega328P": "arduino:avr:pro:cpu=8MHzatmega328",
	        "Arduino Pro or Pro Mini (5V, 16 MHz) w/ ATmega168": "arduino:avr:pro:cpu=16MHzatmega168",
	        "Arduino Pro or Pro Mini (3.3V, 8 MHz) w/ ATmega168": "arduino:avr:pro:cpu=8MHzatmega168",
	        "Arduino Mega w/ ATmega2560": "arduino:avr:mega:cpu=atmega2560",
	        "Arduino Mega w/ ATmega1280": "arduino:avr:mega:cpu=atmega1280",
	        "Arduino Mega ADK": "arduino:avr:megaADK",
	        "Arduino Leonardo": "arduino:avr:leonardo",
	        "Arduino Leonardo ETH": "arduino:avr:leonardoeth",
	        "Arduino Mini w/ ATmega328P": "arduino:avr:mini:cpu=atmega328",
	        "Arduino Mini w/ ATmega168": "arduino:avr:mini:cpu=atmega168",
	        "Arduino Ethernet": "arduino:avr:ethernet",
	        "Arduino Yún": "arduino:avr:yun",
	        "Arduino Yún Mini": "arduino:avr:yunmini",
	        "Arduino Uno WiFi": "arduino:avr:unowifi"
	    },
	    "Burn": "None",
	    "Upload": {
	        "comSelect": "all"
	    },
	    "nav": {
	        "compile": true,
	        "upload": true,
	        "save": {
	            "img": true,
	            "ino": true
	        }
	    },
	    "serial": {
	        "ctrlCBtn": false,
	        "ctrlDBtn": false,
	        "baudRates": 9600,
	        "yMax": 100,
	        "yMin": 0,
	        "pointNum": 100
	    },
	    "ThirdPartyBoard": false
	},{
	    "BoardImg": "./files/esp8266.png",
	    "BoardName": "Arduino ESP8266",
	    "BoardDescription": "Play ESP8266 with C/C++",
	    "BoardIndex": "./apps/mixly/index_board_Arduino_ESP8266.html",
	    "environment": 0,
	    "myBlock": "Arduino",
	    "css": "color.css",
	    "blocks": "arduino",
	    "generators": "arduino",
	    "files": "esp8266.png",
	    "board": {
	        "Generic ESP8266 Module": "esp8266:esp8266:generic",
	        "Generic ESP8285 Module": "esp8266:esp8266:esp8285",
	        "ESPDuino (ESP-13 Module)": "esp8266:esp8266:espduino",
	        "NodeMCU 0.9 (ESP-12 Module)": "esp8266:esp8266:nodemcu",
	        "NodeMCU 1.0 (ESP-12E Module)": "esp8266:esp8266:nodemcuv2",
	        "LOLIN(WEMOS) D1 R2 & mini": "esp8266:esp8266:d1_mini",
	        "LOLIN(WEMOS) D1 mini Pro": "esp8266:esp8266:d1_mini_pro",
	        "LOLIN(WEMOS) D1 mini Lite": "esp8266:esp8266:d1_mini_lite",
	        "WeMos D1 R1": "esp8266:esp8266:d1",
	        "ESPino (ESP-12 Module)": "esp8266:esp8266:espino",
	        "Arduino ESP8266": "esp8266:esp8266:arduino-esp8266",
	        "WiFiduino": "esp8266:esp8266:wifiduino"
	    },
	    "Burn": "None",
	    "Upload": {
	        "comSelect": "all"
	    },
	    "nav": {
	        "compile": true,
	        "upload": true,
	        "save": {
	            "img": true,
	            "ino": true
	        }
	    },
	    "serial": {
	        "ctrlCBtn": false,
	        "ctrlDBtn": false,
	        "baudRates": 9600,
	        "yMax": 100,
	        "yMin": 0,
	        "pointNum": 100
	    },
	    "ThirdPartyBoard": false
	},{
	    "BoardImg": "./files/esp32.png",
	    "BoardName": "Arduino ESP32",
	    "BoardDescription": "Play ESP32 with C/C++",
	    "BoardIndex": "./apps/mixly/index_board_Arduino_ESP32.html",
	    "environment": 0,
	    "myBlock": "Arduino",
	    "css": "color.css",
	    "blocks": "arduino",
	    "generators": "arduino",
	    "files": "esp32.png",
	    "board": {
	        "ESP32 Dev Module": "esp32:esp32:esp32",
	        "ESP32 Pico Kit": "esp32:esp32:pico32",
	        "TTGO LoRa32-OLED V1": "esp32:esp32:ttgo-lora32-v1",
	        "Nano32": "esp32:esp32:nano32",
	        "LOLIN D32": "esp32:esp32:d32",
	        "LOLIN D32 PRO": "esp32:esp32:d32_pro",
	        "WEMOS LOLIN32": "esp32:esp32:lolin32",
	        "Dongsen Tech Pocket 32": "esp32:esp32:pocket_32",
	        "Node32s": "esp32:esp32:node32s",
	        "NodeMCU-32S": "esp32:esp32:nodemcu-32s",
	        "M5Stack-Core-ESP32": "esp32:esp32:m5stack-core-esp32",
	        "M5Stack-FIRE": "esp32:esp32:m5stack-fire",
	        "Microduino-CoreESP32": "esp32:esp32:CoreESP32",
	        "BPI-BIT": "esp32:esp32:bpi-bit"
	    },
	    "Burn": "None",
	    "Upload": {
	        "comSelect": "all"
	    },
	    "nav": {
	        "compile": true,
	        "upload": true,
	        "save": {
	            "img": true,
	            "ino": true
	        }
	    },
	    "serial": {
	        "ctrlCBtn": false,
	        "ctrlDBtn": false,
	        "baudRates": 9600,
	        "yMax": 100,
	        "yMin": 0,
	        "pointNum": 100
	    },
	    "ThirdPartyBoard": false
	},{
	    "BoardImg": "./files/stm32.png",
	    "BoardName": "Arduino STM32",
	    "BoardDescription": "Play STM32 with C/C++",
	    "BoardIndex": "./apps/mixly/index_board_Arduino_STM32.html",
	    "environment": 0,
	    "myBlock": "Arduino",
	    "css": "color.css",
	    "blocks": "arduino",
	    "generators": "arduino",
	    "files": "esp32.png",
	    "board": {
	        "Generic STM32F103C series": "stm32duino:STM32F1:genericSTM32F103C",
	        "Generic STM32F103R series": "stm32duino:STM32F1:genericSTM32F103R",
	        "Generic STM32F103T series": "stm32duino:STM32F1:genericSTM32F103T",
	        "Generic STM32F103V series": "stm32duino:STM32F1:genericSTM32F103V",
	        "Generic STM32F103Z series": "stm32duino:STM32F1:genericSTM32F103Z",
	        "Generic STM32F103C6/fake STM32F103C8": "stm32duino:STM32F1:genericSTM32F103C6",
	        "HYTiny STM32F103TB": "stm32duino:STM32F1:hytiny-stm32f103t",
	        "STM32VLD to FLASH": "stm32duino:STM32F1:STM32VLD",
	        "Maple Mini": "stm32duino:STM32F1:mapleMini",
	        "Maple (Rev 3)": "stm32duino:STM32F1:maple",
	        "Maple (RET6)": "stm32duino:STM32F1:mapleRET6",
	        "Microduino Core STM32 to Flash": "stm32duino:STM32F1:microduino32_flash",
	        "STM Nucleo F103RB (STLink)": "stm32duino:STM32F1:nucleo_f103rb",
	        "Generic STM32F407V series": "stm32duino:STM32F4:generic_f407v",
	        "Generic STM32F407V mini series": "stm32duino:STM32F4:generic_f407v_mini",
	        "STM32 Discovery F407": "stm32duino:STM32F4:discovery_f407",
	        "Blackpill STM32F401CCU6": "stm32duino:STM32F4:blackpill_f401",
	        "STM32 Discovery F411E": "stm32duino:STM32F4:disco_f411"
	    },
	    "Burn": "None",
	    "Upload": {
	        "comSelect": "all"
	    },
	    "nav": {
	        "compile": true,
	        "upload": true,
	        "save": {
	            "img": true,
	            "ino": true
	        }
	    },
	    "serial": {
	        "ctrlCBtn": false,
	        "ctrlDBtn": false,
	        "baudRates": 9600,
	        "yMax": 100,
	        "yMin": 0,
	        "pointNum": 100
	    },
	    "ThirdPartyBoard": false
	},{
        "BoardImg": "./files/mixgo1.jpg",
        "BoardName": "MixGo",
        "BoardDescription": "Play MixGo with MicroPython",
        "BoardIndex": "./apps/mixly/index_board_MicroPython[ESP32_MixGo].html",
        "environment": 2,
        "myBlock": "MicroPython[ESP32_MixGo]",
        "css": "color_esp32_mixgo.css",
        "blocks": "esp32",
        "generators": "esp32",
        "converters": "esp32",
        "files": "mixgo1.jpg",
        "Burn": {
            "comSelect": "all",
            "command": "{esptool} --port {com} --baud 460800 erase_flash && {esptool} --port {com} --baud 460800 write_flash 0x1000 {path}\\mpBuild\\ESP32_MixGo\\esp32.bin 0x200000 {path}\\mpBuild\\ESP32_MixGo\\Noto_Sans_CJK_SC_Light16.bin"
        },
        "Upload": {
            "type": "ampy",
            "comSelect": "all",
            "command": "{ampy} -p {com} -d 1 put {path}\\mpBuild\\ESP32_MixGo\\main.py",
            "filePath": "{path}\\mpBuild\\ESP32_MixGo\\main.py",
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
        },
        "ThirdPartyBoard": false
	}
];