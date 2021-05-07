'use strict';

goog.provide('Blockly.Python.sensor');

goog.require('Blockly.Python');

Blockly.Python.sensor_mixgoce_button_is_pressed = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var btn = Blockly.Python.valueToCode(this, 'btn', Blockly.Python.ORDER_ATOMIC);
    var code =  'mixgoce.'+btn + '.is_pressed()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};
//ok
Blockly.Python.sensor_mixgoce_button_was_pressed = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var btn = Blockly.Python.valueToCode(this, 'btn', Blockly.Python.ORDER_ATOMIC);
    var code =  'mixgoce.'+btn + '.was_pressed()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_button_get_presses = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var btn = Blockly.Python.valueToCode(this, 'btn', Blockly.Python.ORDER_ATOMIC);
    var argument = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
    var code =  'mixgoce.'+btn + '.get_presses(' + argument + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_light= function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    return ['mixgoce.get_brightness()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_sound= function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    return ['mixgoce.get_soundlevel()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_temperature_lm35 = function() {
  Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
  return ['mixgoce.get_temperature()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.number1 = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var code = this.getFieldValue('op');
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_pin_pressed = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var pin = Blockly.Python.valueToCode(this, 'button', Blockly.Python.ORDER_ATOMIC);
    var code = 'mixgoce.'+pin+'.is_touched()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_pin_near = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var key = this.getFieldValue('key');
    var code = 'mixgoce.infrared_near("'+key+'")';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_pin_near_more = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var freq = Blockly.Python.valueToCode(this, 'freq', Blockly.Python.ORDER_ATOMIC);
    var dc = Blockly.Python.valueToCode(this, 'dc', Blockly.Python.ORDER_ATOMIC);
    var code = 'mixgoce.infrared_near(f=' + freq + ', h=' + dc + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_MSA301_get_acceleration = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    // Blockly.Python.definitions_['import_machine'] = 'import machine';
    var key = this.getFieldValue('key');
    var code;
    if (key=='x') {
        code = 'mixgoce.acc.acceleration[0]';
    }else if (key=='y') {
        code = 'mixgoce.acc.acceleration[1]';
    }else if (key=='z') {
        code = 'mixgoce.acc.acceleration[2]';
    }else if (key=='values') {
        code = 'mixgoce.acc.acceleration';
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.RTC_set_datetime= function () {
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    Blockly.Python.definitions_['import_time'] = 'import time';
    var year = Blockly.Python.valueToCode(this, "year", Blockly.Python.ORDER_ASSIGNMENT);
    var month = Blockly.Python.valueToCode(this, "month",Blockly.Python.ORDER_ASSIGNMENT);
    var day = Blockly.Python.valueToCode(this, "day",Blockly.Python.ORDER_ASSIGNMENT);
    var hour = Blockly.Python.valueToCode(this, "hour", Blockly.Python.ORDER_ASSIGNMENT);
    var minute = Blockly.Python.valueToCode(this, "minute",Blockly.Python.ORDER_ASSIGNMENT);
    var second = Blockly.Python.valueToCode(this, "second",Blockly.Python.ORDER_ASSIGNMENT);
    var week = Blockly.Python.valueToCode(this, "weekday", Blockly.Python.ORDER_ASSIGNMENT);
    var yearday = Blockly.Python.valueToCode(this, "yearday",Blockly.Python.ORDER_ASSIGNMENT); 
    var isdist = Blockly.Python.valueToCode(this, "isdist",Blockly.Python.ORDER_ASSIGNMENT);
    Blockly.Python.setups_["RTC_set_datetime"] ='def RTC_set_datetime(year, month, day, hour, minute, second, weekday, yearday, isdist):\n' +
                                                '    mixgoce.rtc_clock.datetime = time.struct_time((year, month, day, hour, minute, second, weekday, yearday, isdist))\n';
    var code = 'RTC_set_datetime('+year+','+month+','+day+','+hour+','+minute+','+second+','+week+','+yearday+','+isdist+')\n';
    return code;
};

Blockly.Python.RTC_get_time = function () {
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var code = 'mixgoce.rtc_clock.datetime';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_extern_button_is_pressed = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC).replace("IO", "");
    var code =  'mixgoce.Button(board.IO'+pin + ').is_pressed()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};
//ok
Blockly.Python.sensor_mixgoce_extern_button_was_pressed = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC).replace("IO", "");
    var code =  'mixgoce.Button(board.IO'+pin + ').was_pressed()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_extern_button_get_presses = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC).replace("IO", "");
    var argument = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
    var code =  'mixgoce.Button(board.IO'+pin + ').get_presses(' + argument + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_extern_dimmer = function(){
    Blockly.Python.definitions_['import_analogio_AnalogIn'] = 'from analogio import AnalogIn';
    Blockly.Python.definitions_['import_board'] = 'import board';
    var pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC).replace("IO", "");
    var code =  'AnalogIn(board.IO'+ pin + ').value';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_mixgoce_extern_pin_near = function(){
    Blockly.Python.definitions_['import_analogio_AnalogIn'] = 'from analogio import AnalogIn';
    Blockly.Python.definitions_['import_board'] = 'import board';
    var pina = Blockly.Python.valueToCode(this, 'PINA', Blockly.Python.ORDER_ATOMIC).replace("IO", "");
    var pinb = Blockly.Python.valueToCode(this, 'PINB', Blockly.Python.ORDER_ATOMIC).replace("IO", "");
    var code =  '(AnalogIn(board.IO'+ pina + ').value, AnalogIn(board.IO'+ pinb + ').value)';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_use_i2c_init=function(){
    var v = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var iv = Blockly.Python.valueToCode(this, 'I2CSUB', Blockly.Python.ORDER_ATOMIC);
    var key = this.getFieldValue('key');
    var code;
    if (key=='LTR308') {
      Blockly.Python.definitions_['import_ltr308al'] = 'import ltr308al';
       code = v + ' = ltr308al.LTR_308ALS('+ iv+ ')\n';
    }else if (key=='HP203B') {
      Blockly.Python.definitions_['import_hp203x'] = 'import hp203x';
      code = v + ' = hp203x.HP203X('+ iv+ ')\n';
    }else if (key=='SHTC3') {
      Blockly.Python.definitions_['import_adafruit_shtc3'] = 'import adafruit_shtc3';
      code = v + ' = adafruit_shtc3.' + key + "("+ iv+ ')\n';
    }else if (key=='VL53L0X') {
      Blockly.Python.definitions_['import_adafruit_vl53l0x'] = 'import adafruit_vl53l0x';
      code = v + ' = adafruit_vl53l0x.' + key + "("+ iv+ ')\n';
    }
    return code;
};

Blockly.Python.sensor_LTR308 = function(){
    Blockly.Python.definitions_['import_ltr308al'] = 'import ltr308al';
    var sub = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var code = sub + '.getdata()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_hp203=function(){
    var sub = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var key = this.getFieldValue('key');
    Blockly.Python.definitions_['import_hp203x'] = 'import hp203x';
    var code = sub + '.' + key;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_shtc3=function(){
    var sub = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var key = this.getFieldValue('key');
    Blockly.Python.definitions_['import_adafruit_shtc3'] = 'import adafruit_shtc3';
    if (key == 'ALL'){
        var code = sub + '.measurements';
    }
    else{
        var code = sub + '.measurements[' + key + ']';   
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_VL530LX=function(){
    var sub = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var key = this.getFieldValue('key');
    Blockly.Python.definitions_['import_adafruit_vl53l0x'] = 'import adafruit_vl53l0x';
    var code = sub + '.range';
    return [code, Blockly.Python.ORDER_ATOMIC];
};