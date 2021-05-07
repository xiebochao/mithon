var boardConfig = {
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
        //"simulate": true,
        "save": {
            "img": true,
            "ino": true
        },
        "setting": {
            "thirdPartyLibrary": true
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
    "lib": {
        "url": "https://gitee.com/smilebrightly/git_-test/raw/master/libs.json"
    }
}