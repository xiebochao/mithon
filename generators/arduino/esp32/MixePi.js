'use strict';

goog.provide('Blockly.Arduino.HandTFT');

goog.require('Blockly.Arduino');

function str2hex(str){
  if(str == ""){
    return "";
  }
  var arr = [];
  arr.push("0x");
  for(var i=0;i<str.length;i++){
    arr.push(str.charCodeAt(i).toString(16));
  }
  return arr.join('');
}



Blockly.Arduino.mixepi_inout_touchRead = function(){
 var touch_pin = this.getFieldValue('touch_pin');
 var code ='touchRead('+touch_pin+')';
 return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.mixepi_button_is_pressed = function(){
 var btn = this.getFieldValue('btn');
 Blockly.Arduino.setups_['setup_btn'+btn] = 'pinMode('+btn+',INPUT);';
 var code ='!digitalRead('+btn+')';
 return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.mixePi_button_is_pressed = function(){
 var btn = this.getFieldValue('btn');
 Blockly.Arduino.setups_['setup_btn'+btn] = 'pinMode('+btn+',INPUT_PULLUP);';
 var code ='!digitalRead('+btn+')';
 return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.mixepi_light= function(){
  return ['analogRead(39)', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.mixepi_sound= function(){
  return ['analogRead(36)', Blockly.Arduino.ORDER_ATOMIC];
};

//传感器_重力感应块
Blockly.Arduino.mixepi_ADXL345_action = function() {
  Blockly.Arduino.definitions_['include_Wire'] = '#include <Wire.h>';
  Blockly.Arduino.definitions_['include_I2Cdev'] = '#include <I2Cdev.h>';
  Blockly.Arduino.definitions_['include_ADXL345'] = '#include <ADXL345.h>';
  Blockly.Arduino.definitions_['var_declare_ADXL345'] = 'ADXL345 accel;\n';
  Blockly.Arduino.setups_['setup_accel.begin'] = 'accel.begin();';
  Blockly.Arduino.setups_['setup_Wire.begin'] = 'Wire.begin();';
  var dropdown_type = this.getFieldValue('MIXEPI_ADXL345_ACTION');
  var code = dropdown_type;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.RGB_color_seclet = function() {
  var colour = this.getFieldValue('COLOR');
  return [colour, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino.RGB_color_rgb=function(){
  var R = Blockly.Arduino.valueToCode(this, 'R', Blockly.Arduino.ORDER_ATOMIC);
  var G = Blockly.Arduino.valueToCode(this, 'G', Blockly.Arduino.ORDER_ATOMIC);
  var B = Blockly.Arduino.valueToCode(this, 'B', Blockly.Arduino.ORDER_ATOMIC);
//   if(parseInt(R).toString(16).length>1)
//     var colour = parseInt(R).toString(16);
//   else
//    var colour = 0+parseInt(R).toString(16);
//  if(parseInt(G).toString(16).length>1)
//   colour += parseInt(G).toString(16);
//  else
//   colour += 0+parseInt(G).toString(16);
// if(parseInt(B).toString(16).length>1)
//  colour += parseInt(B).toString(16);
// else
//   colour += 0+parseInt(B).toString(16);
// colour="#"+colour;
var colour=R+"*65536"+"+"+G+"*256"+"+"+B;
return [colour, Blockly.Arduino.ORDER_NONE];
};


Blockly.Arduino.mixepi_rgb=function(){
  var value_led = Blockly.Arduino.valueToCode(this, '_LED_', Blockly.Arduino.ORDER_ATOMIC);
  var COLOR = Blockly.Arduino.valueToCode(this, 'COLOR');
  COLOR=COLOR.replace(/#/g,"0x");
  Blockly.Arduino.definitions_['include_Adafruit_NeoPixel'] = '#include <Adafruit_NeoPixel.h>';
  Blockly.Arduino.definitions_['var_declare_rgb_display17'] = 'Adafruit_NeoPixel rgb_display_17= Adafruit_NeoPixel(3,17,NEO_RGB + NEO_KHZ800);';
  Blockly.Arduino.setups_['setup_rgb_display_begin_17'] = 'rgb_display_17.begin();';
  var code = 'rgb_display_17.setPixelColor('+value_led+'-1,'+COLOR+');\n';
  code +='rgb_display_17.show();\nrgb_display_17.show();\n';
  return code;
};

Blockly.Arduino.mixepi_rgb2=function(){
 var COLOR1 = Blockly.Arduino.valueToCode(this, 'COLOR1');
 var COLOR2 = Blockly.Arduino.valueToCode(this, 'COLOR2');
 var COLOR3 = Blockly.Arduino.valueToCode(this, 'COLOR3');
 COLOR1=COLOR1.replace(/#/g,"0x");
 COLOR2=COLOR2.replace(/#/g,"0x");
 COLOR3=COLOR3.replace(/#/g,"0x");
 Blockly.Arduino.definitions_['include_Adafruit_NeoPixel'] = '#include <Adafruit_NeoPixel.h>';
 Blockly.Arduino.definitions_['var_declare_rgb_display17'] = 'Adafruit_NeoPixel rgb_display_17= Adafruit_NeoPixel(3,17,NEO_RGB + NEO_KHZ800);';
 Blockly.Arduino.setups_['setup_rgb_display_begin_17'] = 'rgb_display_17.begin();';
 var code = 'rgb_display_17.setPixelColor(0,'+COLOR1+');\n';
 code += 'rgb_display_17.setPixelColor(1,'+COLOR2+');\n';
 code += 'rgb_display_17.setPixelColor(2,'+COLOR3+');\n';
 code+='rgb_display_17.show();\nrgb_display_17.show();\n';
 return code;
};

Blockly.Arduino.mixepi_rgb_Brightness=function(){
  var Brightness = Blockly.Arduino.valueToCode(this, 'Brightness',Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.definitions_['include_Adafruit_NeoPixel'] = '#include <Adafruit_NeoPixel.h>';
  Blockly.Arduino.definitions_['var_declare_rgb_display17'] = 'Adafruit_NeoPixel rgb_display_17= Adafruit_NeoPixel(3,17,NEO_RGB + NEO_KHZ800);';
  Blockly.Arduino.setups_['setup_rgb_display_begin_17'] = 'rgb_display_17.begin();';
  var code='rgb_display_17.setBrightness('+Brightness+');\n';
  code +='rgb_display_17.show();\nrgb_display_17.show();\n';
  return code;
};

Blockly.Arduino.mixepi_rgb_rainbow1=function(){
 Blockly.Arduino.definitions_['include_Adafruit_NeoPixel'] = '#include <Adafruit_NeoPixel.h>';
 Blockly.Arduino.definitions_['var_declare_rgb_display17'] = 'Adafruit_NeoPixel rgb_display_17= Adafruit_NeoPixel(3,17,NEO_RGB + NEO_KHZ800);';
 var wait_time=Blockly.Arduino.valueToCode(this, 'WAIT',Blockly.Arduino.ORDER_ATOMIC);
 Blockly.Arduino.setups_['setup_rgb_display_begin_17'] = 'rgb_display_17.begin();';
 var funcName2 = 'Wheel';
 var code2= 'uint32_t Wheel(byte WheelPos) {\n';
 code2 += 'if(WheelPos < 85) \n{\nreturn rgb_display_17.Color(WheelPos * 3, 255 - WheelPos * 3, 0);\n} \n';
 code2 += 'else if(WheelPos < 170) \n{\nWheelPos -= 85; \nreturn rgb_display_17.Color(255 - WheelPos * 3, 0, WheelPos * 3);\n}\n ';
 code2 += 'else\n {\nWheelPos -= 170;\nreturn rgb_display_17.Color(0, WheelPos * 3, 255 - WheelPos * 3);\n}\n';
 code2 += '}\n';
 Blockly.Arduino.definitions_[funcName2] = code2;
 var funcName3 = 'rainbow';
 var code3= 'void rainbow(uint8_t wait) {\n uint16_t i, j;\n';
 code3 += 'for(j=0; j<256; j++) {\n';
 code3 += 'for(i=0; i<rgb_display_17.numPixels(); i++)\n {\n';
 code3 += 'rgb_display_17.setPixelColor(i, Wheel((i+j) & 255));\n}\n';
 code3 += 'rgb_display_17.show();\nrgb_display_17.show();\n';
 code3 += 'delay(wait);\n}\n}\n';
 Blockly.Arduino.definitions_[funcName3] = code3;
 var code = 'rainbow('+ wait_time+');\n'
 return code;
};

Blockly.Arduino.mixepi_rgb_rainbow3=function(){
  Blockly.Arduino.definitions_['include_Adafruit_NeoPixel'] = '#include <Adafruit_NeoPixel.h>';
  Blockly.Arduino.definitions_['var_declare_rgb_display17'] = 'Adafruit_NeoPixel rgb_display_17= Adafruit_NeoPixel(3,17,NEO_RGB + NEO_KHZ800);';
  var rainbow_color = Blockly.Arduino.valueToCode(this, 'rainbow_color',Blockly.Arduino.ORDER_ATOMIC);
  var type = this.getFieldValue('TYPE');
  var funcName2 = 'Wheel';
  var code2= 'uint32_t Wheel(byte WheelPos) {\n';
  code2 += 'if(WheelPos < 85)\n {\nreturn rgb_display_17.Color(WheelPos * 3, 255 - WheelPos * 3, 0);} \n';
  code2 += 'else if(WheelPos < 170)\n {\nWheelPos -= 85; return rgb_display_17.Color(255 - WheelPos * 3, 0, WheelPos * 3);}\n ';
  code2 += 'else {\nWheelPos -= 170;return rgb_display_17.Color(0, WheelPos * 3, 255 - WheelPos * 3);}\n';
  code2 += '}\n';
  Blockly.Arduino.definitions_[funcName2] = code2;
  if(type=="normal")
    var code3= 'for (int i = 0; i < rgb_display_17.numPixels(); i++)\n{rgb_display_17.setPixelColor(i, Wheel('+rainbow_color+' & 255));\n}\n';
  else 
    var code3= 'for (int i = 0; i < rgb_display_17.numPixels(); i++)\n {rgb_display_17.setPixelColor(i, Wheel(((i * 256 / rgb_display_17.numPixels()) + '+rainbow_color+') & 255));\n}\n';
  return code3;
};

Blockly.Arduino.brightness_select = function() {
  var code = this.getFieldValue('STAT');
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
