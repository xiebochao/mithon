var boardConfig = {
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
    }
}