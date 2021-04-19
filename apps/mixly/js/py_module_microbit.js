function _TEXT(wrap) {
    return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
}

var py_module = [
{filename:"ultrasonic.py",code:_TEXT(function(){/*
from microbit import *

def distance_mm(tpin=pin16, epin=pin15):
    spi.init(baudrate=125000, sclk=pin13,
             mosi=tpin, miso=epin)
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

def distance_cm(t_pin=pin16, e_pin=pin15):
    return distance_mm(tpin=t_pin, epin=e_pin) / 10.0

*/})},
{filename:"RTC.py",code:_TEXT(function(){/*
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
from microbit import *

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

def angle(pin, angle):
    duty = 26 + (angle * 102) / 180
    pin.write_analog(duty)
*/})},
{filename:"lcd1602.py",code:_TEXT(function(){/*
from microbit import *

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

*/})},
{filename:"rgb.py",code:_TEXT(function(){/*
from microbit import *

def show(object, led, r, g, b):
    object[led] = (r, g, b)
    object.show()
*/})},
{filename:"TCS.py",code:_TEXT(function(){/*
from microbit import *

class TCS34725():

    TCS34725_ADDRESS          = 0x29

    TCS34725_COMMAND_BIT      = 0x80

    TCS34725_ENABLE           = 0x00
    TCS34725_ENABLE_AIEN      = 0x10    # RGBC Interrupt Enable 
    TCS34725_ENABLE_WEN       = 0x08    # Wait enable - Writing 1 activates the wait timer 
    TCS34725_ENABLE_AEN       = 0x02    # RGBC Enable - Writing 1 actives the ADC, 0 disables it 
    TCS34725_ENABLE_PON       = 0x01    # Power on - Writing 1 activates the internal oscillator, 0 disables it 
    TCS34725_ATIME            = 0x01    # Integration time 
    TCS34725_WTIME            = 0x03    # Wait time (if TCS34725_ENABLE_WEN is asserted 
    TCS34725_WTIME_2_4MS      = 0xFF    # WLONG0 = 2.4ms   WLONG1 = 0.029s 
    TCS34725_WTIME_204MS      = 0xAB    # WLONG0 = 204ms   WLONG1 = 2.45s  
    TCS34725_WTIME_614MS      = 0x00    # WLONG0 = 614ms   WLONG1 = 7.4s   
    TCS34725_AILTL            = 0x04    # Clear channel lower interrupt threshold 
    TCS34725_AILTH            = 0x05
    TCS34725_AIHTL            = 0x06    # Clear channel upper interrupt threshold 
    TCS34725_AIHTH            = 0x07
    TCS34725_PERS             = 0x0C    # Persistence register - basic SW filtering mechanism for interrupts 
    TCS34725_PERS_NONE        = 0b0000  # Every RGBC cycle generates an interrupt                                
    TCS34725_PERS_1_CYCLE     = 0b0001  # 1 clean channel value outside threshold range generates an interrupt   
    TCS34725_PERS_2_CYCLE     = 0b0010  # 2 clean channel values outside threshold range generates an interrupt  
    TCS34725_PERS_3_CYCLE     = 0b0011  # 3 clean channel values outside threshold range generates an interrupt  
    TCS34725_PERS_5_CYCLE     = 0b0100  # 5 clean channel values outside threshold range generates an interrupt  
    TCS34725_PERS_10_CYCLE    = 0b0101  # 10 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_15_CYCLE    = 0b0110  # 15 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_20_CYCLE    = 0b0111  # 20 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_25_CYCLE    = 0b1000  # 25 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_30_CYCLE    = 0b1001  # 30 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_35_CYCLE    = 0b1010  # 35 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_40_CYCLE    = 0b1011  # 40 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_45_CYCLE    = 0b1100  # 45 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_50_CYCLE    = 0b1101  # 50 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_55_CYCLE    = 0b1110  # 55 clean channel values outside threshold range generates an interrupt 
    TCS34725_PERS_60_CYCLE    = 0b1111  # 60 clean channel values outside threshold range generates an interrupt 
    TCS34725_CONFIG           = 0x0D
    TCS34725_CONFIG_WLONG     = 0x02    # Choose between short and long (12x wait times via TCS34725_WTIME 
    TCS34725_CONTROL          = 0x0F    # Set the gain level for the sensor 
    TCS34725_ID               = 0x12    # 0x44 = TCS34721/TCS34725, 0x4D = TCS34723/TCS34727 
    TCS34725_STATUS           = 0x13
    TCS34725_STATUS_AINT      = 0x10    # RGBC Clean channel interrupt 
    TCS34725_STATUS_AVALID    = 0x01    # Indicates that the RGBC channels have completed an integration cycle 
    TCS34725_CDATAL           = 0x14    # Clear channel data 
    TCS34725_CDATAH           = 0x15
    TCS34725_RDATAL           = 0x16    # Red channel data 
    TCS34725_RDATAH           = 0x17
    TCS34725_GDATAL           = 0x18    # Green channel data 
    TCS34725_GDATAH           = 0x19
    TCS34725_BDATAL           = 0x1A    # Blue channel data 
    TCS34725_BDATAH           = 0x1B
 
  # TCS34725_INTEGRATIONTIME_2_4MS  = 0xFF,   /**<  2.4ms - 1 cycle    - Max Count: 1024  
  # TCS34725_INTEGRATIONTIME_24MS   = 0xF6,   /**<  24ms  - 10 cycles  - Max Count: 10240 
  # TCS34725_INTEGRATIONTIME_50MS   = 0xEB,   /**<  50ms  - 20 cycles  - Max Count: 20480 
  # TCS34725_INTEGRATIONTIME_101MS  = 0xD5,   /**<  101ms - 42 cycles  - Max Count: 43008 
  # TCS34725_INTEGRATIONTIME_154MS  = 0xC0,   /**<  154ms - 64 cycles  - Max Count: 65535 
  # TCS34725_INTEGRATIONTIME_700MS  = 0x00    /**<  700ms - 256 cycles - Max Count: 65535 

    _tcs34725Initialised = False
    _tcs34725Gain = 0
    _tcs34725IntegrationTime = 0x00

    def __init__(self, i2c):
        self.i2c = i2c
        #pass

    def write8(self, reg, val):
        self.i2c.write(self.TCS34725_ADDRESS, bytearray([self.TCS34725_COMMAND_BIT | reg, val & 0xFF]))

    def read16(self, reg):
        self.i2c.write(self.TCS34725_ADDRESS, bytearray([self.TCS34725_COMMAND_BIT | reg]))
        list_bytes = self.i2c.read(self.TCS34725_ADDRESS, 2)
        bytes = list_bytes[1]<<8 | list_bytes[0]
        #return [ hex(x) for x in bytes ][0]
        return bytes
        
    def read8(self, reg):
        self.i2c.write(self.TCS34725_ADDRESS, bytearray([self.TCS34725_COMMAND_BIT | reg]))
        return i2c.read(self.TCS34725_ADDRESS, 1)[0] - 0

    def begin(self):
        x = self.read8(self.TCS34725_ID)
        #print(x)
        if x != 68: # code I was basing this on expects 0x44, not sure why. Got 0x12
            print('did not get the expected response from sensor: ', x)
            return False
        self._tcs34725Initialised = True
        self.setIntegrationTime(self._tcs34725IntegrationTime)
        self.setGain(0)
        self.enable()
        return True
        
    def setIntegrationTime(self, theTime):
        if theTime not in [0xFF,0xF6,0xEB,0xD5,0xC0,0x00]:
            print('setting integration time to 0x00, %s is illegal' % theTime)
            theTime = 0x00
        self.write8(self.TCS34725_ATIME, theTime)
        # self.i2c.write8(self.TCS34725_ATIME, theTime)
        self._tcs34725IntegrationTime = theTime
        
    def setGain(self, gain):
        # TCS34725_GAIN_1X                = 0x00,   /**<  No gain  
        # TCS34725_GAIN_4X                = 0x01,   /**<  2x gain  
        # TCS34725_GAIN_16X               = 0x02,   /**<  16x gain 
        # TCS34725_GAIN_60X               = 0x03    /**<  60x gain 
        if gain not in [0,1,2,3]:
            print('setting gain to 0, %s is illegal' % gain)
            gain = 0
        self.write8(self.TCS34725_CONTROL, gain)
        self._tcs34725Gain = gain
        
    def enable(self):
        self.write8(self.TCS34725_ENABLE, self.TCS34725_ENABLE_PON)
        sleep(0.003)
        self.write8(self.TCS34725_ENABLE, (self.TCS34725_ENABLE_PON | self.TCS34725_ENABLE_AEN))

    def getRawRGBData(self, type):
        r = self.read16(self.TCS34725_RDATAL)
        g = self.read16(self.TCS34725_GDATAL)
        b = self.read16(self.TCS34725_BDATAL)
        if self._tcs34725IntegrationTime == 0xFF:
            sleep(0.0024)
        elif self._tcs34725IntegrationTime == 0xF6:
            sleep(0.024)
        elif self._tcs34725IntegrationTime == 0xEB:
            sleep(0.050)
        elif self._tcs34725IntegrationTime == 0xD5:
            sleep(0.101)
        elif self._tcs34725IntegrationTime == 0xC0:
            sleep(0.154)
        elif self._tcs34725IntegrationTime == 0x00:
            sleep(0.700)
        else:
            sleep(0.700)
        if type == 0:
            return r
        elif type == 1:
            return g
        else:
            return b

tcs = TCS34725(i2c)

*/})},
{filename:"MP3.py",code:_TEXT(function(){/*
from microbit import *

class DJ004_MP3:
  def __init__(self, mp3_rx=pin2, mp3_tx=pin16, volume=0x16, mode=0x01):
    uart.init(rx=mp3_rx, tx=mp3_tx, baudrate=9600)
    self.set_eq(1)
    self.set_vol(volume)
    self.set_mode(mode)
    self.pause()

  def _send_cmd(self, length, cmd, data_high=None, data_low=None):
    uart.write(b'\x7E')
    uart.write(bytes([length]))
    uart.write(bytes([cmd]))
    if data_high != None:
      uart.write(bytes([data_high]))
    if data_low != None:
      uart.write(bytes([data_low]))
    uart.write(b'\xEF')
    sleep(200)
  
  #下一曲
  def next_track(self):
    self._send_cmd(0x02, 0x03)
  
  #上一曲
  def prev_track(self):
    self._send_cmd(0x02, 0x04)
  
  #选择曲目
  def sel_track(self, track_index):
    self._send_cmd(0x03, track_index)
  
  #音量+
  def inc_vol(self):
    self._send_cmd(0x02, 0x05)
  
  #音量-
  def dec_vol(self):
    self._send_cmd(0x02, 0x06)
  
  #设置音量
  def set_vol(self, volume):
    self._send_cmd(0x03, 0x31, data_high=volume)
  
  #设置音效
  def set_eq(self, equalizer):
    self._send_cmd(0x03, 0x32, data_high=equalizer)
  
  #设置播放设备
  def set_mode(self, mode):
    self._send_cmd(0x03, 0x35, data_high=mode)

  #播放
  def play(self):
    self._send_cmd(0x02, 0x01)
  
  #终止播放
  def pause(self):
    self._send_cmd(0x02, 0x02)
  
  #设置文件夹播放
  def set_folder(self, folder_index, music_index):
    self._send_cmd(0x04, 0x42, data_high=folder_index, data_low=music_index)
    
  #设置曲目播放
  def playFileByIndexNumber(self, music_index):
    self._send_cmd(0x04, 0x41, data_high=0x00, data_low=music_index)
  
  #设置循环
  def set_loop(self, mode):
    self._send_cmd(0x03, 0x33, data_high=mode)
    
*/})},
{filename:"mixpy.py",code:_TEXT(function(){/*
import math

def math_map(v, al, ah, bl, bh):
    return bl +  (bh - bl) * (v - al) / (ah - al)

def math_mean(myList):
    localList = [e for e in myList if type(e) == int or type(e) == float]
    if not localList: return
    return float(sum(localList)) / len(localList)

def math_median(myList):
    localList = sorted([e for e in myList if type(e) == int or type(e) == float])
    if not localList: return
    if len(localList) % 2 == 0:
        return (localList[len(localList) // 2 - 1] + localList[len(localList) // 2]) / 2.0
    else:
        return localList[(len(localList) - 1) // 2]

def math_modes(some_list):
    modes = []
    # Using a lists of [item, count] to keep count rather than dict
    # to avoid "unhashable" errors when the counted item is itself a list or dict.
    counts = []
    maxCount = 1
    for item in some_list:
        found = False
        for count in counts:
            if count[0] == item:
                count[1] += 1
                maxCount = max(maxCount, count[1])
                found = True
        if not found:
            counts.append([item, 1])
    for counted_item, item_count in counts:
        if item_count == maxCount:
            modes.append(counted_item)
    return modes

def math_standard_deviation(numbers):
    n = len(numbers)
    if n == 0: return
    mean = float(sum(numbers)) / n
    variance = sum((x - mean) ** 2 for x in numbers) / n
    return math.sqrt(variance)

def lists_sort(my_list, type, reverse):
    def try_float(s):
        try:
            return float(s)
        except:
            return 0
    key_funcs = {
        "NUMERIC": try_float,
        "TEXT": str,
        "IGNORE_CASE": lambda s: str(s).lower()
    }
    key_func = key_funcs[type]
    list_cpy = list(my_list)
    return sorted(list_cpy, key=key_func, reverse=reverse)
*/})}
];