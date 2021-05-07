var boardConfig = {
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
                "filePath": "{path}\\hexbuild\\firmware.hex",
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
}