function _TEXT(wrap) {
    return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
}

var py_module = [
{filename:"HCSR04.py",code:_TEXT(function(){/*
from microbit import *

class HCSR04:
    def __init__(self, tpin=pin16, epin=pin15, spin=pin13):
        self.trigger_pin = tpin
        self.echo_pin = epin
        self.sclk_pin = spin

    def distance_mm(self):
        spi.init(baudrate=125000, sclk=self.sclk_pin,
                 mosi=self.trigger_pin, miso=self.echo_pin)
        pre = 0
        post = 0
        k = -1
        length = 500
        resp = bytearray(length)
        resp[0] = 0xFF
        spi.write_readinto(resp, resp)
        # find first non zero value
        try:
            i, value = next((ind, v) for ind, v in enumerate(resp) if v)
        except StopIteration:
            i = -1
        if i > 0:
            pre = bin(value).count("1")
            # find first non full high value afterwards
            try:
                k, value = next((ind, v)
                                for ind, v in enumerate(resp[i:length - 2]) if resp[i + ind + 1] == 0)
                post = bin(value).count("1") if k else 0
                k = k + i
            except StopIteration:
                i = -1
        dist= -1 if i < 0 else round((pre + (k - i) * 8. + post) * 8 * 0.172)
        return dist

    def distance_cm(self):
        return self.distance_mm() / 10.0

sonar = HCSR04()
*/})},
{filename:"DS1307.py",code:_TEXT(function(){/*
from microbit import *

DS1307_I2C_ADDRESS  = (104)
DS1307_REG_SECOND   = (0)
DS1307_REG_MINUTE   = (1)
DS1307_REG_HOUR     = (2)
DS1307_REG_WEEKDAY  = (3)
DS1307_REG_DAY      = (4)
DS1307_REG_MONTH    = (5)
DS1307_REG_YEAR     = (6)
DS1307_REG_CTRL     = (7)
DS1307_REG_RAM      = (8)
class DS1307():
    # set reg
    def setReg(self, reg, dat):
        i2c.write(DS1307_I2C_ADDRESS, bytearray([reg, dat]))

    # get reg
    def getReg(self, reg):
        i2c.write(DS1307_I2C_ADDRESS, bytearray([reg]))
        t = i2c.read(DS1307_I2C_ADDRESS, 1)
        return t[0]

    def start(self):
        t = self.getReg(DS1307_REG_SECOND)
        self.setReg(DS1307_REG_SECOND, t&0x7F)

    def stop(self):
        t = self.getReg(DS1307_REG_SECOND)
        self.setReg(DS1307_REG_SECOND, t|0x80)

    def DecToHex(self, dat):
        return (dat//10) * 16 + (dat%10)

    def HexToDec(self, dat):
        return (dat//16) * 10 + (dat%16)

    def DateTime(self, DT=None):
        if DT == None:
            i2c.write(DS1307_I2C_ADDRESS, bytearray([0]))
            buf = i2c.read(DS1307_I2C_ADDRESS, 7)
            DT = [0] * 8
            DT[0] = self.HexToDec(buf[6]) + 2000
            DT[1] = self.HexToDec(buf[5])
            DT[2] = self.HexToDec(buf[4])
            DT[3] = self.HexToDec(buf[3])
            DT[4] = self.HexToDec(buf[2])
            DT[5] = self.HexToDec(buf[1])
            DT[6] = self.HexToDec(buf[0])
            DT[7] = 0
            return DT
        else:
            buf = bytearray(8)
            buf[0] = 0
            buf[1] = self.DecToHex(DT[6]%60)    # second
            buf[2] = self.DecToHex(DT[5]%60)    # minute
            buf[3] = self.DecToHex(DT[4]%24)    # hour
            buf[4] = self.DecToHex(DT[3]%8)     # week day
            buf[5] = self.DecToHex(DT[2]%32)    # date
            buf[6] = self.DecToHex(DT[1]%13)    # month
            buf[7] = self.DecToHex(DT[0]%100)   # year
            i2c.write(DS1307_I2C_ADDRESS, buf)

    def Year(self, year = None):
        if year == None:
            return self.HexToDec(self.getReg(DS1307_REG_YEAR)) + 2000
        else:
            self.setReg(DS1307_REG_YEAR, self.DecToHex(year%100))

    def Month(self, month = None):
        if month == None:
            return self.HexToDec(self.getReg(DS1307_REG_MONTH))
        else:
            self.setReg(DS1307_REG_MONTH, self.DecToHex(month%13))

    def Day(self, day = None):
        if day == None:
            return self.HexToDec(self.getReg(DS1307_REG_DAY))
        else:
            self.setReg(DS1307_REG_DAY, self.DecToHex(day%32))

    def Weekday(self, weekday = None):
        if weekday == None:
            return self.HexToDec(self.getReg(DS1307_REG_WEEKDAY))
        else:
            self.setReg(DS1307_REG_WEEKDAY, self.DecToHex(weekday%8))

    def Hour(self, hour = None):
        if hour == None:
            return self.HexToDec(self.getReg(DS1307_REG_HOUR))
        else:
            self.setReg(DS1307_REG_HOUR, self.DecToHex(hour%24))

    def Minute(self, minute = None):
        if minute == None:
            return self.HexToDec(self.getReg(DS1307_REG_MINUTE))
        else:
            self.setReg(DS1307_REG_MINUTE, self.DecToHex(minute%60))

    def Second(self, second = None):
        if second == None:
            return self.HexToDec(self.getReg(DS1307_REG_SECOND))
        else:
            self.setReg(DS1307_REG_SECOND, self.DecToHex(second%60))

    def ram(self, reg, dat = None):
        if dat == None:
            return self.getReg(DS1307_REG_RAM + (reg%56))
        else:
            self.setReg(DS1307_REG_RAM + (reg%56), dat)

    def get_time(self):
        return self.Hour() + self.Minute() + self.Second()

    def get_date(self):
        return self.Year() + self.Month() + self.Day()

    def set_time(self, hour, minute, second):
        self.Hour(hour)
        self.Minute(minute)
        self.Second(second)

    def set_date(self, year, month, day):
        self.Year(year)
        self.Month(month)
        self.Day(day)

ds = DS1307()
*/})},
{filename:"Servo.py",code:_TEXT(function(){/*
from microbit import *

class Servo:
    def __init__(self, pin, freq=50, min_us=600, max_us=2400, angle=180):
        self.min_us = min_us
        self.max_us = max_us
        self.us = 0
        self.freq = freq
        self.angle = angle
        self.analog_period = 0
        self.pin = pin
        analog_period = round((1/self.freq) * 1000)
        self.pin.set_analog_period(analog_period)

    def write_us(self, us):
        us = min(self.max_us, max(self.min_us, us))
        duty = round(us * 1024 * self.freq // 1000000)
        self.pin.write_analog(duty)
        self.pin.write_digital(0)

    def write_angle(self, degrees=None):
        degrees = degrees % 360
        total_range = self.max_us - self.min_us
        us = self.min_us + total_range * degrees // self.angle
        self.write_us(us)
*/})}
];