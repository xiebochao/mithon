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