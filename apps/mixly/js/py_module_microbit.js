function _TEXT(wrap) {
    return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
}

var py_module = [
{filename:"hcsr04.py",code:_TEXT(function(){/*
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
{filename:"motor_control.py",code:_TEXT(function(){/*
def initPCA9685():
    i2c.write(0x40, bytearray([0x00, 0x00]))
    setFreq(50)
    for idx in range(0, 16, 1):
        setPwm(idx, 0 ,0)
def MotorRun(Motors, speed):
    speed = speed * 16
    if (speed >= 4096):
        speed = 4095
    if (speed <= -4096):
        speed = -4095
    if (Motors <= 4 and Motors > 0):
        pp = (Motors - 1) * 2
        pn = (Motors - 1) * 2 + 1
        if (speed >= 0):
            setPwm(pp, 0, speed)
            setPwm(pn, 0, 0)
        else :
            setPwm(pp, 0, 0)
            setPwm(pn, 0, -speed)
def Servo(Servos, degree):
    v_us = (degree * 1800 / 180 + 600)
    value = int(v_us * 4096 / 20000)
    setPwm(Servos + 7, 0, value)
def setFreq(freq):
    prescaleval = int(25000000/(4096*freq)) - 1
    i2c.write(0x40, bytearray([0x00]))
    oldmode = i2c.read(0x40, 1)
    newmode = (oldmode[0] & 0x7F) | 0x10
    i2c.write(0x40, bytearray([0x00, newmode]))
    i2c.write(0x40, bytearray([0xfe, prescaleval]))
    i2c.write(0x40, bytearray([0x00, oldmode[0]]))
    sleep(4)
    i2c.write(0x40, bytearray([0x00, oldmode[0] | 0xa1]))
def setPwm(channel, on, off):
    if (channel >= 0 and channel <= 15):
        buf = bytearray([0X06 + 4 * channel, on & 0xff, (on >> 8) & 0xff, off & 0xff, (off >> 8) & 0xff])
        i2c.write(0x40, buf)
def setStepper(stpMotors, dir, speed):
    spd = speed
    setFreq(spd)
    if (stpMotors == 1):
        if (dir):
            setPwm(0, 2047, 4095)
            setPwm(1, 1, 2047)
            setPwm(2, 1023, 3071)
            setPwm(3, 3071, 1023)
        else:
            setPwm(3, 2047, 4095)
            setPwm(2, 1, 2047)
            setPwm(1, 1023, 3071)
            setPwm(0, 3071, 1023)
    elif (stpMotors == 2):
        if (dir):
            setPwm(4, 2047, 4095)
            setPwm(5, 1, 2047)
            setPwm(6, 1023, 3071)
            setPwm(7, 3071, 1023)
        else:
            setPwm(7, 2047, 4095)
            setPwm(6, 1, 2047)
            setPwm(4, 1023, 3071)
            setPwm(5, 3071, 1023)
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
*/})},
{filename:"lcd1602.py",code:_TEXT(function(){/*
class LCD1602():
    def __init__(self, lcd_i2c_addr):
        self.buf = bytearray(1)
        self.BK = 0x08
        self.RS = 0x00
        self.E = 0x04
        self.setcmd(0x33)
        sleep(5)
        self.send(0x30)
        sleep(5)
        self.send(0x20)
        sleep(5)
        self.setcmd(0x28)
        self.setcmd(0x0C)
        self.setcmd(0x06)
        self.setcmd(0x01)
        self.version='1.0'
        self.lcd_i2c_addr=lcd_i2c_addr

    def setReg(self, dat):
        self.buf[0] = dat
        i2c.write(self.lcd_i2c_addr, self.buf)
        sleep(1)

    def send(self, dat):
        d=dat&0xF0
        d|=self.BK
        d|=self.RS
        self.setReg(d)
        self.setReg(d|0x04)
        self.setReg(d)

    def setcmd(self, cmd):
        self.RS=0
        self.send(cmd)
        self.send(cmd<<4)

    def setdat(self, dat):
        self.RS=1
        self.send(dat)
        self.send(dat<<4)

    def clear(self):
        self.setcmd(1)

    def backlight(self, on):
        if on:
            self.BK=0x08
        else:
            self.BK=0
        self.setdat(0)

    def on(self):
        self.setcmd(0x0C)

    def off(self):
        self.setcmd(0x08)

    def char(self, ch, x=-1, y=0):
        if x>=0:
            a=0x80
            if y>0:
                a=0xC0
            a+=x
            self.setcmd(a)
        self.setdat(ch)

    def puts(self, s, x=0, y=0):
        if len(s)>0:
            self.char(ord(s[0]),x,y)
            for i in range(1, len(s)):
                self.char(ord(s[i]))

    def mixly_puts(self, s, x=1, y=1):
        s = str(s)
        x = x - 1
        y = y - 1
        self.puts(self, s, x, y)

    def mixly_puts_two_lines(self, line1, line2):
        line1 = str(line1)
        line2 = str(line2)
        self.puts(self, line1, 0, 0)
        self.puts(self, line2, 0, 1)
*/})},
{filename:"oled.py",code:_TEXT(function(){/*
from microbit import *

class OLED12864_I2C():
    def __init__(self):
        cmd = [
            [0xAE],           # SSD1306_DISPLAYOFF
            [0xA4],           # SSD1306_DISPLAYALLON_RESUME
            [0xD5, 0xF0],     # SSD1306_SETDISPLAYCLOCKDIV
            [0xA8, 0x3F],     # SSD1306_SETMULTIPLEX
            [0xD3, 0x00],     # SSD1306_SETDISPLAYOFFSET
            [0 | 0x0],        # line #SSD1306_SETSTARTLINE
            [0x8D, 0x14],     # SSD1306_CHARGEPUMP
            [0x20, 0x00],     # SSD1306_MEMORYMODE
            [0x21, 0, 127],   # SSD1306_COLUMNADDR
            [0x22, 0, 63],    # SSD1306_PAGEADDR
            [0xa0 | 0x1],     # SSD1306_SEGREMAP
            [0xc8],           # SSD1306_COMSCANDEC
            [0xDA, 0x12],     # SSD1306_SETCOMPINS
            [0x81, 0xCF],     # SSD1306_SETCONTRAST
            [0xd9, 0xF1],     # SSD1306_SETPRECHARGE
            [0xDB, 0x40],     # SSD1306_SETVCOMDETECT
            [0xA6],           # SSD1306_NORMALDISPLAY
            [0xd6, 1],        # zoom on
            [0xaf]            # SSD1306_DISPLAYON
        ]

        for c in cmd:
            self.command(c)
        self._ZOOM = 1
        self.ADDR = 0x3C
        self.screen = bytearray(1025)    # send byte plus pixels
        self.screen[0] = 0x40
    
    def command(self, c):
        i2c.write(self.ADDR, b'·' + bytearray(c))

    def set_pos(self, col=0, page=0):
        self.command([0xb0 | page])    # page number
        # take upper and lower value of col * 2
        c = col * (self._ZOOM+1)
        c1, c2 = c & 0x0F, c >> 4
        self.command([0x00 | c1])    # lower start column address
        self.command([0x10 | c2])    # upper start column address

    def pixel(self, x, y, color=1, draw=1):
        page, shift_page = divmod(y, 8)
        ind = x * (self._ZOOM+1) + page * 128 + 1
        b = self.screen[ind] | (1 << shift_page) if color else self.screen[ind] & ~ (1 << shift_page)
        self.screen[ind] = b
        self.set_pos(x, page)
        if self._ZOOM:
            self.screen[ind+1]=b
            i2c.write(0x3c, bytearray([0x40, b, b]))
        else:
            i2c.write(0x3c, bytearray([0x40, b]))

    def zoom(self, d=1):
        self._ZOOM = 1 if d else 0
        self.command([0xd6, self._ZOOM])

    def invert(self, v=1):
        n = 0xa7 if v else 0xa6
        self.command([n])

    def clear(self, c=0):
        for i in range(1, 1025):
            self.screen[i] = 0
        self.draw()

    def draw(self):
        self.set_pos()
        i2c.write(self.ADDR, self.screen)

    def text(self, x, y, s, draw=1):
        for i in range(0, min(len(s), 12 - x)):
            for c in range(0, 5):
                col = 0
                for r in range(1, 6):
                    p = Image(s[i]).get_pixel(c, r - 1)
                    col = col | (1 << r) if (p != 0) else col
                ind = (x + i) * 5 * (self._ZOOM+1) + y * 128 + c*(self._ZOOM+1) + 1
                self.screen[ind] = col
                if self._ZOOM:
                    self.screen[ind + 1] = col
        self.set_pos(x * 5, y)
        ind0 = x * 5 * (self._ZOOM+1) + y * 128 + 1
        i2c.write(self.ADDR, b'@' + self.screen[ind0:ind + 1])

    def hline(self, x, y, l,c=1):
        d = 1 if l>0 else -1
        for i in range(x, x+l, d):
            self.pixel(i,y,c)

    def vline(self, x, y, l,c=1):
        d = 1 if l>0 else -1
        for i in range(y, y+l,d):
            self.pixel(x,i,c,0)

    def rect(self, x1,y1,x2,y2,c=1):
        self.hline(x1,y1,x2-x1+1,c)
        self.hline(x1,y2,x2-x1+1,c)
        self.vline(x1,y1,y2-y1+1,c)
        self.vline(x2,y1,y2-y1+1,c)

oled = OLED12864_I2C()

*/})}
];