function _TEXT(wrap) {
    return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
}

var py_module = [
{filename:"rgb_show.py",code:_TEXT(function(){/*
from microbit import *
import neopixel

np = neopixel.NeoPixel(pin12, 4)

def mixly_rgb_show_all(r, g, b):
    for led in range(4):
        np[led] = (r, g, b)
    np.show()

def mixly_rgb_show(led, r, g, b):
    np[led] = (r, g, b)
    np.show()
*/})},
{filename:"motor_control.py",code:_TEXT(function(){/*
from microbit import *

def motor1(v,d=1):
    v = min(12,max(0,v))
    if v==0:
        pin14.write_analog(0)
        pin13.write_analog(0)
    elif d==1:
        pin14.write_analog(int(v/12*1023))
        pin13.write_analog(0)
    elif d==0:
        pin14.write_analog(0)
        pin13.write_analog(int(v/12*1023))

def motor2(v,d=1):
    v = min(12,max(0,v))
    if v==0:
        pin8.write_analog(0)
        pin16.write_analog(0)
    elif d==1:
        pin8.write_analog(int(v/12*1023))
        pin16.write_analog(0)
    elif d==0:
        pin8.write_analog(0)
        pin16.write_analog(int(v/12*1023))

def motor3(v,d=1):
    v = min(12,max(0,v))
    if v==0:
        pin0.write_analog(0)
        pin15.write_analog(0)
    elif d==1:
        pin0.write_analog(int(v/12*1023))
        pin15.write_analog(0)
    elif d==0:
        pin0.write_analog(0)
        pin15.write_analog(int(v/12*1023))
*/})}
];