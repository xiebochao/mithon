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

Blockly.Python.sensor_mixgo_pin_near = function(){
    Blockly.Python.definitions_['import_mixgo'] = 'import mixgo';
    var direction = this.getFieldValue('direction');
    var code = 'mixgo.'+'infrared_'+ direction +'.near()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.sensor_MSA301_get_acceleration = function(){
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    // Blockly.Python.definitions_['import_machine'] = 'import machine';
    var key = this.getFieldValue('key');
    var code;
    if (key=='x') {
        code = 'mixgoce.msa.acceleration[0]';
    }else if (key=='y') {
        code = 'mixgoce.msa.acceleration[1]';
    }else if (key=='z') {
        code = 'mixgoce.msa.acceleration[2]';
    }else if (key=='values') {
        code = 'mixgoce.msa.acceleration';
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};