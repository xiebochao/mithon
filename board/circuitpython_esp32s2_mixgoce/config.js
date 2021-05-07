var boardConfig = {
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
}