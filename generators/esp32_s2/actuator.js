'use strict';

goog.provide('Blockly.Python.actuator');
goog.require('Blockly.Python');


Blockly.Python.number = function () {
    var code = this.getFieldValue('op');
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.ledswitch = function () {
    var code = this.getFieldValue('flag');
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.actuator_led_bright = function() {
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var op = Blockly.Python.valueToCode(this,'led', Blockly.Python.ORDER_ATOMIC);
    var bright = Blockly.Python.valueToCode(this,'bright', Blockly.Python.ORDER_ATOMIC);
    // var bright = this.getFieldValue('bright');
    var code = "mixgoce.led_L" + op + ".setonoff("+bright+")\n";
    return code;
};

Blockly.Python.actuator_get_led_bright = function() {
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var op = Blockly.Python.valueToCode(this,'led', Blockly.Python.ORDER_ATOMIC);
    var code = "mixgoce.led_L" + op + ".getonoff("+")";
    return [code, Blockly.Python.ORDER_ATOMIC];;
};

Blockly.Python.actuator_led_brightness = function() {
    Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
    var op = Blockly.Python.valueToCode(this,'led', Blockly.Python.ORDER_ATOMIC);
    var flag = Blockly.Python.valueToCode(this,'bright', Blockly.Python.ORDER_ATOMIC);
    var code = 'mixgoce.led_L'+op+'.setbrightness('+flag+')\n';
    return code;
};

Blockly.Python.actuator_onboard_neopixel_write = function(){
  Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
  var code= 'mixgoce.rgb.write()\n';   
  return code;
};

Blockly.Python.actuator_onboard_neopixel_rgb_show_one = function(){
  Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
  var value_led = Blockly.Python.valueToCode(this, '_LED_', Blockly.Python.ORDER_ATOMIC);
  var value_rvalue = Blockly.Python.valueToCode(this, 'RVALUE', Blockly.Python.ORDER_ATOMIC);
  var value_gvalue = Blockly.Python.valueToCode(this, 'GVALUE', Blockly.Python.ORDER_ATOMIC);
  var value_bvalue = Blockly.Python.valueToCode(this, 'BVALUE', Blockly.Python.ORDER_ATOMIC);
  var code= 'mixgoce.rgb.show_one('+value_led+', '+value_rvalue+', '+value_gvalue+', '+value_bvalue+')\n';
  return code;
};

Blockly.Python.actuator_onboard_neopixel_rgb_show_all = function(){
  Blockly.Python.definitions_['import_mixgoce'] = 'import mixgoce';
  var value_rvalue = Blockly.Python.valueToCode(this, 'RVALUE', Blockly.Python.ORDER_ATOMIC);
  var value_gvalue = Blockly.Python.valueToCode(this, 'GVALUE', Blockly.Python.ORDER_ATOMIC);
  var value_bvalue = Blockly.Python.valueToCode(this, 'BVALUE', Blockly.Python.ORDER_ATOMIC);
  var code= 'mixgoce.rgb.show_all('+value_rvalue+', '+value_gvalue+', '+value_bvalue+')\n';
  return code;
};