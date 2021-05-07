'use strict';

goog.provide('Blockly.Arduino.display');

goog.require('Blockly.Arduino');

Blockly.Arduino.group_lcd_init2 = function() {
  var varName = this.getFieldValue('VAR');
  var TYPE = this.getFieldValue('TYPE');
  var SCL = this.getFieldValue('SCL');
  var SDA = this.getFieldValue('SDA');
  var board_type = /*JSFuncs.getPlatform()*/"Arduino";
  var device = Blockly.Arduino.valueToCode(this, 'device', Blockly.Arduino.ORDER_ATOMIC) || '0x27';  
  if(SDA=="SDA"&&SCL=="SCL")
  {
    Blockly.Arduino.definitions_['include_Wire'] = '#include <Wire.h>';
    Blockly.Arduino.definitions_['include_LiquidCrystal_I2C'] = '#include <LiquidCrystal_I2C.h>';
    Blockly.Arduino.definitions_['var_declare_LiquidCrystal_I2C_'+varName] = 'LiquidCrystal_I2C '+varName+'('+device+','+TYPE+');';
  }
  else
  {
    if (board_type.match(RegExp(/AVR/))) {
      Blockly.Arduino.definitions_['include_SoftI2CMaster'] = '#include <SoftI2CMaster.h>';
      Blockly.Arduino.definitions_['include_LiquidCrystal_SoftI2C'] = '#include <LiquidCrystal_SoftI2C.h>';
      Blockly.Arduino.definitions_['var_declare_LiquidCrystal_SoftI2C_' + varName] = 'LiquidCrystal_SoftI2C ' + varName + '(' + device + ',' + TYPE + ',' + SCL + ',' + SDA + ');';
    }
    else{
      Blockly.Arduino.definitions_['include_Wire'] = '#include <Wire.h>';
      Blockly.Arduino.definitions_['include_LiquidCrystal_SoftI2C'] = '#include <LiquidCrystal_I2C.h>';
      Blockly.Arduino.definitions_['var_declare_LiquidCrystal_I2C_'+varName] = 'LiquidCrystal_I2C '+varName+'('+device+','+TYPE+');';
      Blockly.Arduino.setups_["setup_Wire"] ='Wire.begin(' +SDA+ ',' +SCL+ ');';
    }
  }
  Blockly.Arduino.setups_['setup_lcd_init_' + varName] = varName + '.init();';
  Blockly.Arduino.setups_['setup_lcd_backlight_' + varName] = varName + '.backlight();';    
  return '';
};

Blockly.Arduino.group_lcd_init3 = function () {
  var varName = this.getFieldValue('VAR');
  var TYPE = this.getFieldValue('TYPE');
  var RS = this.getFieldValue('RS');
  var EN = this.getFieldValue('EN');
  var D4 = this.getFieldValue('D4');
  var D5 = this.getFieldValue('D5');
  var D6 = this.getFieldValue('D6');
  var D7 = this.getFieldValue('D7');
  Blockly.Arduino.definitions_['include_LiquidCrystal'] = '#include <LiquidCrystal.h>';
  Blockly.Arduino.definitions_['var_declare_LiquidCrystal' + varName] = 'LiquidCrystal ' + varName + '(' + RS + ',' + EN + ',' + D4 + ',' + D5 + ',' + D6 + ',' + D7 + ');';
  Blockly.Arduino.setups_['setup_lcd_begin_' + varName] = varName + '.begin('+TYPE+');';

  return '';
};

Blockly.Arduino.group_lcd_print = function() {
  var varName = this.getFieldValue('VAR');
  var str1 = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ATOMIC) || '\"\"';
  var str2 = Blockly.Arduino.valueToCode(this, 'TEXT2', Blockly.Arduino.ORDER_ATOMIC) || '\"\"';

  var code = varName+'.setCursor(0, 0);\n'
  code+=varName+'.print('+str1+');\n';
  code+=varName+'.setCursor(0, 1);\n';
  code+=varName+'.print('+str2+');\n';  
  //code+=varName+'.setCursor(0, 2);\n';
  //code+=varName+'.print('+str3+');\n';
  //code+=varName+'.setCursor(0, 3);\n';
  //code+=varName+'.print('+str4+');\n';
  return code;
};

Blockly.Arduino.group_lcd_print2 = function() {
  var varName = this.getFieldValue('VAR');
  var str = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ATOMIC) || 'String(\"\")';
  var row = Blockly.Arduino.valueToCode(this, 'row', Blockly.Arduino.ORDER_ATOMIC) || '1';
  var column = Blockly.Arduino.valueToCode(this, 'column', Blockly.Arduino.ORDER_ATOMIC) || '1';
  var code = varName+'.setCursor('+column+'-1, '+row+'-1);\n'
  code+=varName+'.print('+str+');\n';
  return code;
};

Blockly.Arduino.group_lcd_power = function() {
  var varName = this.getFieldValue('VAR');
  var dropdown_stat = this.getFieldValue('STAT');
  var code = varName+'.'+dropdown_stat+'();\n'
  return code;
};

Blockly.Arduino.display_4digitdisplay_power=function(){
	var stat=this.getFieldValue("STAT");
	Blockly.Arduino.definitions_['include_Wire'] = '#include <Wire.h>';
	Blockly.Arduino.definitions_['include_TM1650'] = '#include <TM1650.h>';
	Blockly.Arduino.definitions_['var_declare_display_4display'] = 'TM1650 tm_4display;';
	Blockly.Arduino.setups_['setup_wire_begin'] ='Wire.begin();';
	Blockly.Arduino.setups_['setup_display_4display_init'] ='tm_4display.init();';
	return 'tm_4display.'+stat+'();\n';
}
Blockly.Arduino.display_4digitdisplay_displayString=function(){
	var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
	Blockly.Arduino.definitions_['include_Wire'] = '#include <Wire.h>';
  Blockly.Arduino.definitions_['include_TM1650'] = '#include <TM1650.h>';
  Blockly.Arduino.definitions_['var_declare_display_4display'] = 'TM1650 tm_4display;';
  Blockly.Arduino.setups_['setup_wire_begin'] ='Wire.begin();';
  Blockly.Arduino.setups_['setup_display_4display_init'] ='tm_4display.init();';
  return 'tm_4display.displayString('+value+');\n';
}
Blockly.Arduino.display_4digitdisplay_showDot=function(){
	var no=this.getFieldValue("NO");
	var stat=this.getFieldValue("STAT");
	Blockly.Arduino.definitions_['include_Wire'] = '#include <Wire.h>';
  Blockly.Arduino.definitions_['include_TM1650'] = '#include <TM1650.h>';
  Blockly.Arduino.definitions_['var_declare_display_4display'] = 'TM1650 tm_4display;';
  Blockly.Arduino.setups_['setup_wire_begin'] ='Wire.begin();';
  Blockly.Arduino.setups_['setup_display_4display_init'] ='tm_4display.init();';
  return 'tm_4display.setDot('+no+','+stat+');\n';
}
var tm1637_DIO;
var tm1637_CLK;

Blockly.Arduino.display_TM1637_init = function () {
 tm1637_CLK = this.getFieldValue('CLK');
 tm1637_DIO = this.getFieldValue('DIO');
  var NAME = this.getFieldValue('NAME') || 'display';
 Blockly.Arduino.definitions_['include_SevenSegmentTM1637'] = '#include <SevenSegmentTM1637.h>';
 Blockly.Arduino.definitions_['var_declare_SevenSegmentTM1637'+NAME] = 'SevenSegmentTM1637  '+NAME+'(' + tm1637_CLK + ',' + tm1637_DIO + ');';
 Blockly.Arduino.setups_['setup_'+NAME+'.begin()'] = NAME+'.begin();';
 return '';
};

Blockly.Arduino.display_TM1637_displyPrint = function () {
    var NAME = this.getFieldValue('NAME') || 'display';
    //var Speed = Blockly.Arduino.valueToCode(this, 'Speed', Blockly.Arduino.ORDER_ATOMIC);
    var VALUE = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
    var code = NAME+'.print(' + VALUE + ');' + '\n';
    return code;
  };

  Blockly.Arduino.display_TM1637_displayTime = function () {
        var NAME = this.getFieldValue('NAME') || 'display';
    Blockly.Arduino.definitions_['include_SevenSegmentExtended'] = '#include <SevenSegmentExtended.h>';
    Blockly.Arduino.definitions_['var_declare_SevenSegmentTM1637'+NAME] = 'SevenSegmentExtended  '+NAME+'(' + tm1637_CLK + ',' + tm1637_DIO + ');';
    var hour = Blockly.Arduino.valueToCode(this, 'hour', Blockly.Arduino.ORDER_ATOMIC);
    var minute = Blockly.Arduino.valueToCode(this, 'minute', Blockly.Arduino.ORDER_ATOMIC);
    var dropdown_stat = this.getFieldValue("STAT");
    var code = NAME+'.printTime(' + hour + ',' + minute +','+dropdown_stat+');\n';
    return code;
  };

  Blockly.Arduino.display_TM1637_clearDisplay = function () {
    var stat=this.getFieldValue("STAT");
     var NAME = this.getFieldValue('NAME') || 'display';
    return NAME+'.'+stat+'();\n';
  };

  Blockly.Arduino.display_TM1637_Brightness = function () {
     var NAME = this.getFieldValue('NAME') || 'display';
    var BRIGHTNESS = Blockly.Arduino.valueToCode(this, 'Brightness', Blockly.Arduino.ORDER_ATOMIC);
    var code = NAME+'.setBacklight(' + BRIGHTNESS + ');\n';
    return code;
  };
  
  //HT16K33点阵初始化
  Blockly.Arduino.HT16K33_Init = function() {
   var SDA = this.getFieldValue('SDA');
   var SCL = this.getFieldValue('SCL');
   //var matrixName = this.getFieldValue('matrixName');
   var matrixName = "myMatrix";
   Blockly.Arduino.definitions_['include_Matrix'] = '#include <Matrix.h>';
   Blockly.Arduino.definitions_['var_declare'+matrixName] = 'Matrix '+ matrixName +'('+SDA+','+SCL+');';
   Blockly.Arduino.setups_['setup_' + matrixName] = matrixName + '.begin(0x70);';
   var code= matrixName+'.clear();\n';
   return code;
 };

  //Max7219点阵初始化
  Blockly.Arduino.MAX7219_init = function() {
   var pin_cs = Blockly.Arduino.valueToCode(this, 'PIN2', Blockly.Arduino.ORDER_ATOMIC);
   //var matrixName = this.getFieldValue('matrixName');
   var matrixName = "myMatrix";
   var hDisplays = Blockly.Arduino.valueToCode(this, 'hDisplays', Blockly.Arduino.ORDER_ATOMIC);
   var vDisplays = Blockly.Arduino.valueToCode(this, 'vDisplays', Blockly.Arduino.ORDER_ATOMIC);
   Blockly.Arduino.definitions_['include_SPI'] = '#include <SPI.h>';
   Blockly.Arduino.definitions_['include_Adafruit_GFX'] = '#include <Adafruit_GFX.h>';
   Blockly.Arduino.definitions_['include_Max72xxPanel'] = '#include <Max72xxPanel.h>';
   Blockly.Arduino.definitions_['var_declare_Max72xxPanel'] = 'Max72xxPanel '+matrixName+' = Max72xxPanel('+pin_cs+','+hDisplays+','+ vDisplays+');';
   var code = '';
   return code;
 };

 //点阵屏画点
 Blockly.Arduino.display_Matrix_DrawPixel = function() {
  var matrixType = this.getFieldValue('TYPE');
  var pos_x = Blockly.Arduino.valueToCode(this, 'XVALUE', Blockly.Arduino.ORDER_ASSIGNMENT);
  var pos_y = Blockly.Arduino.valueToCode(this, 'YVALUE', Blockly.Arduino.ORDER_ASSIGNMENT);
  //var matrixName = this.getFieldValue('matrixName');
  var matrixName = "myMatrix";
  var dropdown_type = Blockly.Arduino.valueToCode(this, 'STAT', Blockly.Arduino.ORDER_ATOMIC);
  if(matrixType=="HT16K33")
  {
    var code = matrixName + '.drawPixel('+pos_x+',7-'+pos_y+','+dropdown_type+');\n'
  }
  else
  {
    var code =matrixName+ '.drawPixel('+pos_x+','+pos_y+','+dropdown_type+');\n'
  }
  code+= matrixName +'.write();\n';
  return code;
};

//点阵屏滚动显示文本
Blockly.Arduino.display_Matrix_TEXT = function() {
  var matrixType = this.getFieldValue('TYPE');
  var matrixName = "myMatrix";
  var textString = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ASSIGNMENT);
  var speed = Blockly.Arduino.valueToCode(this, 'Speed', Blockly.Arduino.ORDER_ATOMIC);
  var code = matrixName + '.scrollMessage('+textString+','+speed+');\n'
  return code;
};

//点阵屏显示文本
Blockly.Arduino.display_Matrix_print = function() {
  var matrixType = this.getFieldValue('TYPE');
  var matrixName = "myMatrix";
  var textString = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ASSIGNMENT);
  var code=matrixName+'.setCursor(0, 0);\n'
  code += matrixName + '.print('+textString+');\n'
  code += matrixName + '.write();\n'
  return code;
};

//点阵屏显示_显示图案
Blockly.Arduino.display_Matrix_DisplayChar = function() {
  var matrixType = this.getFieldValue('TYPE');
  //var matrixName = this.getFieldValue('matrixName');
  var matrixName = "myMatrix";
  var NO = Blockly.Arduino.valueToCode(this, 'NO', Blockly.Arduino.ORDER_ATOMIC);
  var dotMatrixArray = Blockly.Arduino.valueToCode(this, 'LEDArray', Blockly.Arduino.ORDER_ASSIGNMENT);
  Blockly.Arduino.definitions_['var_declare_LEDArray'] = 'uint8_t  LEDArray[8];';
  var code='';
  code+= 'memcpy_P(&LEDArray, &'+ dotMatrixArray + ', 8);\n';
  code+='for(int index_i=0; index_i<8; index_i++)\n';
  code+='{\n'
  //code+='  LEDArray[index_i]='+dotMatrixArray+'[index_i];\n';
  code+='  for(int index_j='+(NO)+'*8; index_j<'+ (NO)+'*8+8; index_j++)\n'
  //code+='  for(int index_j=7; index_j>=0; index_j--)\n'
  code+='  {\n'
  code+='    if((LEDArray[index_i]&0x01)>0)\n';
  if(matrixType=="HT16K33")
  {
    code+='      '+  matrixName +'.drawPixel(index_j, index_i,1);\n';
    code+='    else\n      '+  matrixName +'.drawPixel(index_j, index_i,0);\n';
  }
  else
  {
    code+='      '+  matrixName +'.drawPixel(index_j, 7-index_i,1);\n';
    code+='    else\n      '+  matrixName +'.drawPixel(index_j, 7-index_i,0);\n';
  }
  code+='    LEDArray[index_i] = LEDArray[index_i]>>1;\n';
  code+='  }  \n'
  code+='}\n'
  code+= matrixName+'.write();\n'
  return code;
};

//点阵屏显示_点阵数组
Blockly.Arduino.display_Matrix_LedArray = function() {
  var varName = this.getFieldValue('VAR');
  var a = new Array();
  for (var i = 1; i < 9; i++) {
    a[i] = new Array();
    for (var j = 1; j < 9; j++) {
      a[i][9-j] = (this.getFieldValue('a' + i + j) == "TRUE") ? 1 : 0;
    }
  }
  var code = '{';
  for (var i = 1; i < 9; i++) {
    var tmp = ""
    for (var j = 1; j < 9; j++) {
      tmp += a[i][j];
    }
    tmp = (parseInt(tmp, 2)).toString(16)
    if (tmp.length == 1) tmp = "0" + tmp;
    code += '0x' + tmp + ((i != 8) ? ',' : '');
  }
  code += '};';
  //Blockly.Arduino.definitions_[varName] = "uint8_t " + varName + "[8]=" + code;
  Blockly.Arduino.definitions_[varName] = "const uint8_t " + varName + "[8] PROGMEM =" + code;
  return [varName, Blockly.Arduino.ORDER_ATOMIC];
};

//点阵设置亮度
Blockly.Arduino.display_Matrix_Brightness = function () {
 var matrixType = this.getFieldValue('TYPE');
 //var matrixName = this.getFieldValue('matrixName');
 var matrixName = "myMatrix";
 var BRIGHTNESS = Blockly.Arduino.valueToCode(this, 'Brightness', Blockly.Arduino.ORDER_ATOMIC);
 if(matrixType=="HT16K33")
 {
  var code = matrixName +'.setBrightness(' + BRIGHTNESS + ');\n';
}
else
{
  var code = matrixName +'.setIntensity(' + BRIGHTNESS + ');\n';
}
return code;
};

//点阵 全亮/全灭/关闭/开启
Blockly.Arduino.display_Matrix_fillScreen = function() {
  var matrixType = this.getFieldValue('TYPE');
  //var matrixName = this.getFieldValue('matrixName');
  var matrixName = "myMatrix";
  var FILLSCREEN_TYPE = this.getFieldValue('FILLSCREEN_TYPE');
  var code = matrixName+'.'+FILLSCREEN_TYPE+';\n'
  code+= matrixName+'.write();\n';
  return code;
};

//点阵屏旋转
Blockly.Arduino.display_Max7219_Rotation = function() {
  //var matrixName = this.getFieldValue('matrixName');
  var matrixName = "myMatrix";
  var dropdown_type = this.getFieldValue('Rotation_TYPE');
  var NO = Blockly.Arduino.valueToCode(this, 'NO', Blockly.Arduino.ORDER_ATOMIC);
  var code = matrixName + '.setRotation('+NO+','+dropdown_type+');\n'
  return code;
};

//点阵屏位置
Blockly.Arduino.display_Max7219_setPosition = function() {
  //var matrixName = this.getFieldValue('matrixName');
  var matrixName = "myMatrix";
  var NO = Blockly.Arduino.valueToCode(this, 'NO', Blockly.Arduino.ORDER_ATOMIC);
  var X = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC);
  var Y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC);
  var code = matrixName + '.setPosition('+NO+','+X+','+Y+');\n'
  return code;
};

//点阵屏旋转
Blockly.Arduino.display_HT16K33_Rotation = function() {
 //var matrixName = this.getFieldValue('matrixName');
 var matrixName = "myMatrix";
 var dropdown_type = this.getFieldValue('Rotation_TYPE');
 var code = matrixName + '.setRotation(4-'+dropdown_type+');\n'
 return code;
};

//点阵屏 图案数组
Blockly.Arduino.LedArray = function() {
  var varName = this.getFieldValue('VAR');
  var a = new Array();
  for (var i = 1; i < 9; i++) {
    a[i] = new Array();
    for (var j = 1; j < 9; j++) {
      a[i][j] = (this.getFieldValue('a' + i + j) == "TRUE") ? 1 : 0;
    }
  }
  var code = '{';
  for (var i = 1; i < 9; i++) {
    var tmp = ""
    for (var j = 1; j < 9; j++) {
      tmp += a[i][j];
    }
    tmp = (parseInt(tmp, 2)).toString(16)
    if (tmp.length == 1) tmp = "0" + tmp;
    code += '0x' + tmp + ((i != 8) ? ',' : '');
  }
  code += '};\n';
  Blockly.Arduino.definitions_[varName] = "byte " + varName + "[]=" + code;
  return [varName, Blockly.Arduino.ORDER_ATOMIC];
};

//点阵屏预设图案
Blockly.Arduino.Matrix_img = function() {
  var dropdown_img_ = this.getFieldValue('img_');
  var code = '"' + dropdown_img_ + '"';
  code = '{';
  for (var i = 0; i < 15; i += 2) {
    code += '0x' + dropdown_img_.substr(i, 2) + ((i != 14) ? ',' : '');
  }
  code += '};\n';
  Blockly.Arduino.definitions_['matrix_img_' + dropdown_img_] = "const uint8_t " + 'matrix_img_' + dropdown_img_ + "[8] PROGMEM=" + code;
  return ['matrix_img_' + dropdown_img_, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.oled_init = function() {
  var OLED_TYPE = this.getFieldValue('OLED_TYPE');
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var ROTATION = this.getFieldValue('ROTATION');
  var SDA = this.getFieldValue('SDA');
  var SCL = this.getFieldValue('SCL');
  var ADDRESS = Blockly.Arduino.valueToCode(this, 'ADDRESS') || '0x3C';
  var board_type=/*JSFuncs.getPlatform()*/"Arduino";
  //var board_type ="ESP8266";
  Blockly.Arduino.definitions_['include_U8g2lib'] = '#include <U8g2lib.h>';
  if(board_type.match(RegExp(/AVR/)))
  {
    if(SDA=="SDA"&&SCL=="SCL")
      Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_'+OLED_TYPE+'_1_HW_I2C '+NAME+'('+ROTATION+', U8X8_PIN_NONE);';
    else
      Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_'+OLED_TYPE+'_1_SW_I2C '+NAME+'('+ROTATION+',  '+SCL+', '+SDA+', U8X8_PIN_NONE);';
  }
  else
  {
    if(SDA=="SDA"&&SCL=="SCL")
      Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_'+OLED_TYPE+'_F_HW_I2C '+NAME+'('+ROTATION+', U8X8_PIN_NONE);';
    else
      Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_'+OLED_TYPE+'_F_SW_I2C '+NAME+'('+ROTATION+',  '+SCL+', '+SDA+', U8X8_PIN_NONE);';
  }  
  Blockly.Arduino.definitions_['include_Wire'] = '#include <Wire.h>';
  Blockly.Arduino.setups_["setup_u8g2"+NAME] =NAME+'.setI2CAddress('+ADDRESS+'*2);\n'
  +'  '+NAME+'.begin();';
  var code = '';
  return code;
};

Blockly.Arduino.u8g2_spi_init = function() {
  var U8G2_TYPE_SPI = this.getFieldValue('U8G2_TYPE_SPI');
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var ROTATION = this.getFieldValue('ROTATION');
  var CLK = this.getFieldValue('CLK');
  var MOSI = this.getFieldValue('MOSI');
  var CS = this.getFieldValue('CS');
  var DC = this.getFieldValue('DC');
  var RST = this.getFieldValue('RST');
  Blockly.Arduino.definitions_['include_U8g2lib'] = '#include <U8g2lib.h>';
  Blockly.Arduino.definitions_['include_SPI'] = '#include <SPI.h>';
  Blockly.Arduino.setups_["setup_u8g2"+NAME] =NAME+'.begin();';
  if(CLK=="SCK"&&MOSI=="MOSI")
    Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_'+U8G2_TYPE_SPI+'_1_4W_HW_SPI '+NAME+'('+ROTATION+', '+CS+', '+DC+', '+RST+');';
  else
    Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_'+U8G2_TYPE_SPI+'_1_4W_SW_SPI '+NAME+'('+ROTATION+', '+CLK+','+MOSI+','+CS+', '+DC+', '+RST+');';
  var code = '';
  return code;
};

Blockly.Arduino.u8g2_LCD12864_spi_init = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var ROTATION = this.getFieldValue('ROTATION');
  var DC = this.getFieldValue('DC');
  //var RST = this.getFieldValue('RST');
  Blockly.Arduino.definitions_['include_U8g2lib'] = '#include <U8g2lib.h>';
  Blockly.Arduino.definitions_['include_SPI'] = '#include <SPI.h>';
  Blockly.Arduino.setups_["setup_u8g2"+NAME] =NAME+'.begin();';
  Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_ST7920_128X64_1_HW_SPI '+NAME+'('+ROTATION+', '+DC+', U8X8_PIN_NONE);';
  var code = '';
  return code;
};

Blockly.Arduino.u8g2_LCD12864_8080_init = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var ROTATION = this.getFieldValue('ROTATION');
  var DB0 = this.getFieldValue('DB0');
  var DB1 = this.getFieldValue('DB1');
  var DB2 = this.getFieldValue('DB2');
  var DB3 = this.getFieldValue('DB3');
  var DB4 = this.getFieldValue('DB4');
  var DB5 = this.getFieldValue('DB5');
  var DB6 = this.getFieldValue('DB6');
  var DB7 = this.getFieldValue('DB7');
  var ENABLE = this.getFieldValue('ENABLE');
  var DC = this.getFieldValue('DC');
  //var RST = this.getFieldValue('RST');
  Blockly.Arduino.definitions_['include_U8g2lib'] = '#include <U8g2lib.h>';
  Blockly.Arduino.setups_["setup_u8g2"+NAME] =NAME+'.begin();';
  Blockly.Arduino.definitions_['var_declare_U8G2'+NAME] ='U8G2_ST7920_128X64_1_8080 '+NAME+'('+ROTATION+', '+DB0+', '+DB1+', '+DB2+', '+DB3+', '+DB4+', '+DB5+', '+DB6+', '+DB7+', '+ENABLE+', U8X8_PIN_NONE, '+DC+');';
  var code = '';
  return code;
};

Blockly.Arduino.oled_clear = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var code=NAME+".clearDisplay();\n";
  return code;
};

Blockly.Arduino.oled_face = function() {
 var NAME = this.getFieldValue('NAME') || 'u8g2';
 var POS_x = Blockly.Arduino.valueToCode(this, 'POS_X') || '0';
 var POS_y = Blockly.Arduino.valueToCode(this, 'POS_Y') || '0';
 var FACE_IMAGE = this.getFieldValue('FACE_IMAGE');
 var pos=FACE_IMAGE.indexOf(',');
 var varName="FACE_"+FACE_IMAGE.substring(0,pos);
 FACE_IMAGE=FACE_IMAGE.substring(pos+1,FACE_IMAGE.length);
 // YANG use PROGMEM to save the RAM space
 //Blockly.Arduino.definitions_['var_declare' + varName] = 'static unsigned char ' + varName + '[]={' + FACE_IMAGE + ' };\n';
 //var code="u8g2.drawXBM("+POS_x+","+POS_y+",89,64,"+varName+");\n";
 Blockly.Arduino.definitions_['var_declare' + varName] = 'const static unsigned char ' + varName + '[] PROGMEM ={' + FACE_IMAGE + ' };\n';
 var code=NAME+".drawXBMP("+POS_x+","+POS_y+",89,64,"+varName+");\n";
 return code;
};

Blockly.Arduino.oled_icons = function() {
 var NAME = this.getFieldValue('NAME') || 'u8g2';
 var POS_x = Blockly.Arduino.valueToCode(this, 'POS_X') || '0';
 var POS_y = Blockly.Arduino.valueToCode(this, 'POS_Y') || '0';
 var ICON_SIZE = this.getFieldValue('ICON_SIZE');
 var ICON_IMAGE = this.getFieldValue('ICON_IMAGE');
 var code = NAME+".setFont(u8g2_font_open_iconic_all_"+ICON_SIZE+"x_t);\n"
 +NAME+".drawGlyph("+POS_x+","+POS_y+"+"+ICON_SIZE+"*8,"+ICON_IMAGE+");\n";
 return code;
};

Blockly.Arduino.oled_drawPixel = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var pos_x = Blockly.Arduino.valueToCode(this, 'POS_X') || '0';
  var pos_y = Blockly.Arduino.valueToCode(this, 'POS_Y') || '0';
  var code = "";
  code = code + NAME + '.drawPixel(' + pos_x + ',';
  code += pos_y + ');\n';
  return code;
};

Blockly.Arduino.oled_page = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  //branch = branch.replace(/(^\s*)|(\s*$)/g, ""); 
  if (branch) {
    var code = NAME+".firstPage();"
    +"\ndo"
    +"\n{"
    +"\n"+branch 
    +  "}while("+NAME+".nextPage());\n";
    return code;
  }
};

Blockly.Arduino.oled_showBitmap = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var start_x = Blockly.Arduino.valueToCode(this, 'START_X') || '0';
  var start_y = Blockly.Arduino.valueToCode(this, 'START_Y') || '0';
  var width = Blockly.Arduino.valueToCode(this, 'WIDTH') || '0';
  var height = Blockly.Arduino.valueToCode(this, 'HEIGHT') || '0';
  var data_name = Blockly.Arduino.valueToCode(this, 'bitmap_name', Blockly.Arduino.ORDER_ATOMIC);
  data_name = data_name.replace(/\"/g, ""); 
  var code = "";
  //YANG use PROGMEM to save the RAM space
  //code = 'u8g2.drawXBM(' + start_x + ', ';
  code = NAME+'.drawXBMP(' + start_x + ', ';
  code += start_y + ', ';
  code += width + ', ';
  code += height + ', ' + data_name + ');\n';
  return code;
};

Blockly.Arduino.oled_define_bitmap_data = function() {
  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var text = this.getFieldValue('TEXT');
  //YANG use PROGMEM to save the RAM space
  //Blockly.Arduino.definitions_['var_declare' + varName] = 'static unsigned char ' + varName + '[]={' + text + ' };\n';
  Blockly.Arduino.definitions_['var_declare' + varName] = 'const static unsigned char ' + varName + '[] PROGMEM ={' + text + ' };\n';
  return '';
};

Blockly.Arduino.oled_drawLine = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var start_x = Blockly.Arduino.valueToCode(this, 'START_X') || '0';
  var start_y = Blockly.Arduino.valueToCode(this, 'START_Y') || '0';
  var end_x = Blockly.Arduino.valueToCode(this, 'END_X') || '0';
  var end_y = Blockly.Arduino.valueToCode(this, 'END_Y') || '0';
  var code = "";
  code = NAME+'.drawLine(' + start_x + ',';
  code += start_y + ',';
  code += end_x + ',';
  code += end_y + ');\n';
  return code;
};

Blockly.Arduino.oled_draw_Str_Line = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var start_x = Blockly.Arduino.valueToCode(this, 'START_X') || '0';
  var start_y = Blockly.Arduino.valueToCode(this, 'START_Y') || '0';
  var length = Blockly.Arduino.valueToCode(this, 'LENGTH') || '0';
  var TYPE = this.getFieldValue('TYPE');
  var code = "";
  code = NAME+".draw" + TYPE + "Line(" + start_x + ',';
  code += start_y + ',';
  code += length + ');\n'; 
  return code;
};

Blockly.Arduino.oled_drawTriangle = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
  var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
  var D1_x = Blockly.Arduino.valueToCode(this, 'D1_X') || '0';
  var D1_y = Blockly.Arduino.valueToCode(this, 'D1_Y') || '0';
  var D2_x = Blockly.Arduino.valueToCode(this, 'D2_X') || '0';
  var D2_y = Blockly.Arduino.valueToCode(this, 'D2_Y') || '0';
  var code = "";
  code = NAME+'.drawTriangle(' + D0_x + ',';
  code += D0_y + ',';
  code += D1_x + ',';
  code += D1_y + ',';
  code += D2_x + ',';
  code += D2_y + ');\n';
  return code;
};

Blockly.Arduino.oled_drawFrame = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
  var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
  var Width = Blockly.Arduino.valueToCode(this, 'WIDTH') || '0';
  var Height = Blockly.Arduino.valueToCode(this, 'HEIGHT') || '0';
  var type = this.getFieldValue('TYPE');
  var code = "";
  code = NAME+'.'+type+'(' + D0_x + ',';
  code += D0_y + ',';
  code += Width + ',';
  code += Height + ');\n';
  return code;
};

Blockly.Arduino.oled_drawRFrame = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
  var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
  var Width = Blockly.Arduino.valueToCode(this, 'WIDTH') || '0';
  var Height = Blockly.Arduino.valueToCode(this, 'HEIGHT') || '0';
  var Rauius = Blockly.Arduino.valueToCode(this, 'RADIUS') || '0';
  var type = this.getFieldValue('TYPE');
  var code = "";
  code = NAME+'.'+type+'(' + D0_x + ',';
  code += D0_y + ',';
  code += Width + ',';
  code += Height + ',';
  code += Rauius + ');\n'; 
  return code;
};

Blockly.Arduino.oled_drawCircle = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
  var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
  var Rauius = Blockly.Arduino.valueToCode(this, 'RADIUS') || '0';
  var type = this.getFieldValue('TYPE');
  var opt = this.getFieldValue('OPT');
  var code = "";
  code = NAME+'.'+type+'(' + D0_x + ',';
  code += D0_y + ',';
  code += Rauius + "," + opt + "); \n";
  return code;
};

Blockly.Arduino.oled_drawEllipse = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
  var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
  var Rauius_X = Blockly.Arduino.valueToCode(this, 'RADIUS_X') || '0';
  var Rauius_Y = Blockly.Arduino.valueToCode(this, 'RADIUS_Y') || '0';
  var type = this.getFieldValue('TYPE');
  var opt = this.getFieldValue('OPT');
  var code = "";
  code = NAME+'.'+type+'(' + D0_x + ',';
  code += D0_y + ',';
  code += Rauius_X + "," ;
  code += Rauius_Y + "," + opt + "); \n";
  return code;
};

Blockly.Arduino.oled_print = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var POS_x = Blockly.Arduino.valueToCode(this, 'POS_X') || '0';
  var POS_y = Blockly.Arduino.valueToCode(this, 'POS_Y') || '0';
  var TEXT = Blockly.Arduino.valueToCode(this, 'TEXT') || '0';
  Blockly.Arduino.setups_["setup_enableUTF8Print"+NAME] =NAME+'.enableUTF8Print();\n';
  var code = "";
  code = NAME+'.setCursor(' + POS_x + ',';
  code += POS_y + "); \n";
  code += NAME+".print(" + TEXT + "); \n";
  return code;
};

Blockly.Arduino.oled_set_EN_Font = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var FONT_NAME = this.getFieldValue('FONT_NAME');
  var FONT_SIZE = this.getFieldValue('FONT_SIZE');
  var FONT_STYLE = this.getFieldValue('FONT_STYLE');
  var code = NAME+".setFont(u8g2_font_"+FONT_NAME+FONT_STYLE+FONT_SIZE+"_tf);\n"+NAME+".setFontPosTop();\n";
  return code;
};

Blockly.Arduino.oled_set_CN_Font = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var FONT_NAME = this.getFieldValue('FONT_NAME');
  var FONT_SIZE = this.getFieldValue('FONT_SIZE');
  var code = NAME+".setFont(u8g2_font_"+FONT_SIZE+FONT_NAME+");\n"+NAME+".setFontPosTop();\n";
  return code;
};
Blockly.Arduino.oled_set_ZH_TW_Font = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  
  var code = NAME+".setFont(u8g2_font_unifont_t_chinese1);\n"+NAME+".setFontPosTop();\n";
  return code;
};
//OLED背光亮度
Blockly.Arduino.u8g2_setContrast = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var Contrast= Blockly.Arduino.valueToCode(this, 'Contrast', Blockly.Arduino.ORDER_ATOMIC);
  var code=NAME+'.setContrast(' +Contrast+ ');\n';
  return code;
};

//返回UTF8字符串宽度
Blockly.Arduino.get_utf8_width = function() {
  var NAME = this.getFieldValue('NAME') || 'u8g2';
  var str= Blockly.Arduino.valueToCode(this, 'str', Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.definitions_['getutf8width'+NAME] ='int '+NAME+'_getUTF8Width(String str) {\n  const char *string_variable = str.c_str();\n  return '+NAME+'.getUTF8Width(string_variable);\n}';
  var code=NAME+'_getUTF8Width(String('+str+'))';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

//LCD自定义图案显示
Blockly.Arduino.lcd_display_pattern = function() {
  var name = this.getFieldValue('name');
  var number = this.getFieldValue('number');
  var row= Blockly.Arduino.valueToCode(this, 'row', Blockly.Arduino.ORDER_ATOMIC);
  var column= Blockly.Arduino.valueToCode(this, 'column', Blockly.Arduino.ORDER_ATOMIC); 
  var pattern= Blockly.Arduino.valueToCode(this, 'pattern', Blockly.Arduino.ORDER_ATOMIC); 
  Blockly.Arduino.setups_["setup_lcd_display_pattern"+number] ='' +name+ '.createChar(' +number+ ', ' +pattern+ ');';
  var code = '' +name+ '.setCursor(' +column+ '-1, ' +row+ '-1);\n' +name+ '.write(' +number+ ');\n';
  return code;
};

Blockly.Arduino.lcd_pattern = function() {
  var varName = this.getFieldValue('VAR');
  var a = new Array();
  for (var i = 1; i < 9; i++) {
    a[i] = new Array();
    for (var j = 1; j < 6; j++) {
      a[i][6-j] = (this.getFieldValue('a' + i + j) == "TRUE") ? 1 : 0;
    }
  }
  var code = '{0B' +a[8][5]+ '' +a[8][4]+ '' +a[8][3]+ '' +a[8][2]+ '' +a[8][1]+ ',0B' +a[7][5]+ '' +a[7][4]+ '' +a[7][3]+ '' +a[7][2]+ '' +a[7][1]+ ',0B' +a[6][5]+ '' +a[6][4]+ '' +a[6][3]+ '' +a[6][2]+ '' +a[6][1]+ ',0B' +a[5][5]+ '' +a[5][4]+ '' +a[5][3]+ '' +a[5][2]+ '' +a[5][1]+ ',0B' +a[4][5]+ '' +a[4][4]+ '' +a[4][3]+ '' +a[4][2]+ '' +a[4][1]+ ',0B' +a[3][5]+ '' +a[3][4]+ '' +a[3][3]+ '' +a[3][2]+ '' +a[3][1]+ ',0B' +a[2][5]+ '' +a[2][4]+ '' +a[2][3]+ '' +a[2][2]+ '' +a[2][1]+ ',0B' +a[1][5]+ '' +a[1][4]+ '' +a[1][3]+ '' +a[1][2]+ '' +a[1][1]+ '};';
  Blockly.Arduino.definitions_[varName] = "byte " + varName + "[]=" + code;
  return [varName, Blockly.Arduino.ORDER_ATOMIC];
};
function RGB_RGB565(colour){
  colour=colour.substr(1);
  var R,G,B;
  R=colour.substr(0,2);
  G=colour.substr(2,2);
  B=colour.substr(4,2);
  colour=B+G+R;
  colour="0x"+colour;
  var RGB565_red= (colour & 0xf80000)>>8;
  var RGB565_green= (colour & 0xfc00)>>5;
  var RGB565_blue= (colour & 0xf8)>>3;
  var n565Color = RGB565_red+RGB565_green + RGB565_blue ;
  return n565Color;
}
//初始化TFT
Blockly.Arduino.TFT_init_with_pin = function() {
  var value_CS = Blockly.Arduino.valueToCode(this, 'CS', Blockly.Arduino.ORDER_ATOMIC);
  var value_DC = Blockly.Arduino.valueToCode(this, 'DC', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_["include_Adafruit_GFX"] = '#include <Adafruit_GFX.h>';
  Blockly.Arduino.definitions_["include_Adafruit_ST7735"] = '#include <Adafruit_ST7735.h>';
  Blockly.Arduino.definitions_["include_SPI"] = '#include <SPI.h>';
  Blockly.Arduino.definitions_['var_declare_Adafruit_ST7735'] ='Adafruit_ST7735 tft = Adafruit_ST7735('+value_CS+', '+value_DC+', -1);';
  Blockly.Arduino.setups_["setup_tft.initR"] ='tft.initR(INITR_18GREENTAB);';
  Blockly.Arduino.setups_["setup_tft.fillScreen(ST7735_BLACK)"] ='tft.fillScreen(ST7735_BLACK);';
  Blockly.Arduino.definitions_["include_U8g2_for_Adafruit_GFX"] = '#include <U8g2_for_Adafruit_GFX.h>';
  Blockly.Arduino.definitions_['var_declare_U8G2_FOR_ADAFRUIT_GFX'] ='U8G2_FOR_ADAFRUIT_GFX u8g2_for_adafruit_gfx;';
  Blockly.Arduino.setups_["setup_u8g2_for_adafruit_gfx"] ='u8g2_for_adafruit_gfx.begin(tft);';
  var code = '';
  return code;
};

//显示汉字（使用位图显示）
Blockly.Arduino.TFT_st7735_show_hz = function() {
    var text_st7735_name = 'tft';
    var checkbox_st7735_show_hz = 'TRUE';
    var checkbox_st7735_show_hz_message = 'TRUE';
    var checkbox_st7735_show_hz_save = this.getFieldValue('st7735_show_hz_save') == 'TRUE';
    var dropdown_st7735_hz_sharp = this.getFieldValue('st7735_hz_sharp');
    var text_st7735_hz_line_height = this.getFieldValue('st7735_hz_line_height');
    var dropdown_hz_up_down = this.getFieldValue('hz_up_down');
    var text_hz_up_down_data = this.getFieldValue('hz_up_down_data');
    var dropdown_hz_left_right = this.getFieldValue('hz_left_right');
    var text_hz_left_right_data = this.getFieldValue('hz_left_right_data');
    var value_st7735_hz_data = Blockly.Arduino.valueToCode(this, 'st7735_hz_data', Blockly.Arduino.ORDER_ATOMIC);
    var value_st7735_hz_x = Blockly.Arduino.valueToCode(this, 'st7735_hz_x', Blockly.Arduino.ORDER_ATOMIC);
    var value_st7735_hz_y = Blockly.Arduino.valueToCode(this, 'st7735_hz_y', Blockly.Arduino.ORDER_ATOMIC);
    var value_st7735_hz_height = Blockly.Arduino.valueToCode(this, 'st7735_hz_height', Blockly.Arduino.ORDER_ATOMIC);
    var value_st7735_hz_width = Blockly.Arduino.valueToCode(this, 'st7735_hz_width', Blockly.Arduino.ORDER_ATOMIC);
    var value_st7735_hz_color = Blockly.Arduino.valueToCode(this, 'st7735_hz_color', Blockly.Arduino.ORDER_ATOMIC);
    var dropdown_st7735_hz_variant = 'normal';
    var dropdown_st7735_hz_style = 'normal';
    var dropdown_st7735_hz_thickness = 'normal';
    var fontSize_width=myAtoi(value_st7735_hz_width);
    var fontSize_height=myAtoi(value_st7735_hz_height);
    var bs=Math.ceil(fontSize_width/8);//每行占字节数

    var move_x = 0;
    var move_y = 0;
    if(dropdown_hz_up_down == "hz_down")
    {
      move_y = myAtoi(text_hz_up_down_data);
    }
    else
    {
      move_y = myAtoi("-"+text_hz_up_down_data);
    }

    if(dropdown_hz_left_right == "hz_right")
    {
      move_x = myAtoi(text_hz_left_right_data);
    }
    else
    {
      move_x = myAtoi("-"+text_hz_left_right_data);
    }
    canvas.width=fontSize_width;
    canvas.height=fontSize_height;
    ctx.font = dropdown_st7735_hz_style + ' ' + dropdown_st7735_hz_variant + ' ' + dropdown_st7735_hz_thickness + ' ' + text_st7735_hz_line_height + 'px ' + dropdown_st7735_hz_sharp;
    ctx.textAlign="left";
    ctx.textBaseline="top";

    var c = value_st7735_hz_data;
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,fontSize_width,fontSize_height);//涂背景
    ctx.fillStyle="#ffffff";
    ctx.fillText(c,move_x,move_y);//写字
    var data=ctx.getImageData(0,0,fontSize_width,fontSize_height).data;//获取图像
    var zm=new Array(bs*fontSize_height);
    for(var i=0;i<zm.length;i++)zm[i]=0;//初始化字模数组
    for(var i=0;i<fontSize_height;i++)//读像素值组成字模数组
      for(var j=0;j<fontSize_width;j++)
        if(data[i*fontSize_width*4+j*4])zm[parseInt(j/8)+i*bs]+=bitArr[j%8];
    var outStr="";//将字模数组转化为十六进制形式
    for(var i=0;i<zm.length-1;i++)outStr+=toHex(zm[i])+",";
    outStr+=toHex(zm[i]);

    var zm1=new Array(bs*fontSize_height);
    var outstr1 = "";
    for(var i in zm)zm1[i] = zm[i].toString(2);
    for(var i in zm1)
    {
      var str = "";
      for(var j = 0;j<8-zm1[i].length;j++)str+="0";
      zm1[i] = str + zm1[i];
    }
    for(var i in zm1)outstr1+=zm1[i];

    var HZ_image = "";
    var num_hz = 0;
    for(var i = 0;i<fontSize_width;i++)
    {
      HZ_image+="--";
      if(i == (fontSize_width - 1))HZ_image+="\n|";
    }

    for(var data_hz of outstr1)
    {
      num_hz++;
      if(num_hz == outstr1.length)
      {
        HZ_image+="|\n";
      }
      else if(num_hz%(bs*8) < fontSize_width && num_hz%(bs*8) > 0)
      {
        if(data_hz == "0")HZ_image+="  ";
        else if(data_hz == "1")HZ_image+="0 ";
      } 
      else if(num_hz%(bs*8) == 0)
      {
        HZ_image+="|\n|";
      }
    }
    for(var i = 0;i<fontSize_width;i++)
    {
      HZ_image+="--";
    }
    HZ_image = "/*" + "\n" + HZ_image + "\n" + "*/";
    
    var hz_sharp = "";
    switch(dropdown_st7735_hz_sharp)
    {
      case "STHeiti":
        hz_sharp = "华文黑体";
        break;
      case "STKaiti":
        hz_sharp = "华文楷体";
        break;
      case "STXihei":
        hz_sharp = "华文细黑";
        break;
      case "STSong":
        hz_sharp = "华文宋体";
        break;
      case "STZhongsong":
        hz_sharp = "华文中宋";
        break;
      case "STFangsong":
        hz_sharp = "华文仿宋";
        break;
      case "STCaiyun":
        hz_sharp = "华文彩云";
        break;
      case "STHupo":
        hz_sharp = "华文琥珀";
        break;
      case "STLiti":
        hz_sharp = "华文隶书";
        break;
      case "STXingkai":
        hz_sharp = "华文行楷";
        break;
      case "STXinwei":
        hz_sharp = "华文新魏";
        break;
      case "simHei":
        hz_sharp = "黑体";
        break;
      case "simSun":
        hz_sharp = "宋体";
        break;
      case "NSimSun":
        hz_sharp = "新宋体";
        break;
      case "FangSong":
        hz_sharp = "仿宋";
        break;
      case "KaiTi":
        hz_sharp = "楷体";
        break;
      case "FangSong_GB2312":
        hz_sharp = "仿宋_GB2312";
        break;
      case "KaiTi_GB2312":
        hz_sharp = "楷体_GB2312";
        break;
      case "LiSu":
        hz_sharp = "隶书";
        break;
      case "YouYuan":
        hz_sharp = "幼圆";
        break;
      case "PMingLiU":
        hz_sharp = "新细明体";
        break;
      case "MingLiU":
        hz_sharp = "细明体";
        break;
      case "DFKai-SB":
        hz_sharp = "标楷体";
        break;
      case "Microsoft JhengHei":
        hz_sharp = "微软正黑体";
        break;
      case "Microsoft YaHei":
        hz_sharp = "微软雅黑体";
        break;
      default:
        hz_sharp = dropdown_st7735_hz_sharp;
        break;
    }
    hz_sharp = "字体：" + hz_sharp + "  字号：" + text_st7735_hz_line_height + "px" + "  显示文字：" + value_st7735_hz_data;
    
    if(checkbox_st7735_show_hz)
    {
      if(checkbox_st7735_show_hz_save)
      {
        Blockly.Arduino.definitions_['var_declare_st7735_'+dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)] = HZ_image + "\n//" + hz_sharp + "\nstatic const unsigned char PROGMEM oled_st7735_" + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+"["+(bs*fontSize_height)+"]={"+outStr+"};";
      }
      else
      {
        Blockly.Arduino.definitions_['var_declare_st7735_'+dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)] = HZ_image + "\n//" + hz_sharp + "\nunsigned char oled_st7735_" + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+"["+(bs*fontSize_height)+"]={"+outStr+"};";
      }
    }
    else
    {
      if(checkbox_st7735_show_hz_message)
      {
        if(checkbox_st7735_show_hz_save)
        {
          Blockly.Arduino.definitions_['var_declare_st7735_'+dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)] = "//" + hz_sharp + "\nstatic const unsigned char PROGMEM oled_st7735_" + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+"["+(bs*fontSize_height)+"]={"+outStr+"};";
        }
        else
        {
          Blockly.Arduino.definitions_['var_declare_st7735_'+dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)] = "//" + hz_sharp + "\nunsigned char oled_st7735_" + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+"["+(bs*fontSize_height)+"]={"+outStr+"};";
        }
      }
      else
      {
        if(checkbox_st7735_show_hz_save)
        {
          Blockly.Arduino.definitions_['var_declare_st7735_'+dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)] = "static const unsigned char PROGMEM oled_st7735_" + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+"["+(bs*fontSize_height)+"]={"+outStr+"};";
        }
        else
        {
          Blockly.Arduino.definitions_['var_declare_st7735_'+dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)] = "unsigned char oled_st7735_" + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+"["+(bs*fontSize_height)+"]={"+outStr+"};";
        }
      }
    }
  if(checkbox_st7735_show_hz_message)
  {
    var code = '//绘制位图 ' + hz_sharp + '  X坐标：' + value_st7735_hz_x + '  Y坐标：' + value_st7735_hz_y + '  位图宽度：' + value_st7735_hz_width + '  位图高度：' + value_st7735_hz_height + '\n' + text_st7735_name+'.drawBitmap('+value_st7735_hz_x+', '+value_st7735_hz_y+', oled_st7735_' + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+', '+value_st7735_hz_width+', '+value_st7735_hz_height+', '+value_st7735_hz_color+');\n';
  }
  else
  {
    var code = text_st7735_name+'.drawBitmap('+value_st7735_hz_x+', '+value_st7735_hz_y+', oled_st7735_' + dropdown_st7735_hz_sharp + '_' + text_st7735_hz_line_height + 'px' + encodeUnicode(value_st7735_hz_data)+', '+value_st7735_hz_width+', '+value_st7735_hz_height+', '+value_st7735_hz_color+');\n';
  }
  return code;
};

Blockly.Arduino.TFT_Brightness= function () {
  var Brightness = Blockly.Arduino.valueToCode(this, 'BRIGHTNESS',Blockly.Arduino.ORDER_ASSIGNMENT);
  //Blockly.Arduino.setups_['ledcSetup_tft_brightness'] = 'ledcSetup(0,5000,8);\n';
  //Blockly.Arduino.setups_['ledcAttachPin_tft_brightness'] = 'ledcAttachPin(26,0);\n ';
  var code = 'dacWrite(26, '+Brightness+'*4+30);\n';
  return code;
};

Blockly.Arduino.tft_icons = function() {
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 var POS_x = Blockly.Arduino.valueToCode(this, 'POS_X') || '0';
 var POS_y = Blockly.Arduino.valueToCode(this, 'POS_Y') || '0';
 var ICON_SIZE = this.getFieldValue('ICON_SIZE');
 var ICON_IMAGE = this.getFieldValue('ICON_IMAGE');
 var code = "u8g2_for_adafruit_gfx.setFont(u8g2_font_open_iconic_all_"+ICON_SIZE+"x_t);\n"
 +"u8g2_for_adafruit_gfx.setForegroundColor("+colour+");\n"
 +"u8g2_for_adafruit_gfx.setFontMode(1);\n"
 +"u8g2_for_adafruit_gfx.drawGlyph("+POS_x+","+POS_y+"+"+ICON_SIZE+"*8,"+ICON_IMAGE+");\n";
 return code;
};
Blockly.Arduino.TFT_Rotation = function() {
  var dropdown_type = this.getFieldValue('Rotation_TYPE');
  var code = 'tft.setRotation('+dropdown_type+');\n'
  return code;
};
Blockly.Arduino.tft_setFont = function() {
 var type = this.getFieldValue('TYPE');
 var code = "u8g2_for_adafruit_gfx.setFont(u8g2_font_"+type+");\nu8g2_for_adafruit_gfx.setFontMode(1);\n";
 return code;
};

Blockly.Arduino.tft_print = function() {
 var POS_x = Blockly.Arduino.valueToCode(this, 'POS_X') || '0';
 var POS_y = Blockly.Arduino.valueToCode(this, 'POS_Y') || '0';
 var TEXT = Blockly.Arduino.valueToCode(this, 'TEXT') || '0';
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 
 var code="";
 if ((!isNaN(POS_x) && POS_x < 129 && POS_x >= 0) || (isNaN(POS_x))) 
  code = 'u8g2_for_adafruit_gfx.setCursor(' + POS_x + ',';
if ((!isNaN(POS_y) && POS_y < 129 && POS_y >= 0) || (isNaN(POS_y))) 
  code += POS_y + "); \n";
 // code +='u8g2_for_adafruit_gfx.setFontMode(0);'
 code += 'u8g2_for_adafruit_gfx.setForegroundColor'+'('+colour+');\n';
 code += "u8g2_for_adafruit_gfx.print(" + TEXT + "); \n";
 return code;
};

Blockly.Arduino.TFT_color_seclet = function() {
  var colour = this.getFieldValue('COLOR');
  colour=RGB_RGB565(colour);
  return [colour, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino.TFT_color_rgb=function(){
 var R = Blockly.Arduino.valueToCode(this, 'R', Blockly.Arduino.ORDER_ATOMIC);
 var G = Blockly.Arduino.valueToCode(this, 'G', Blockly.Arduino.ORDER_ATOMIC);
 var B = Blockly.Arduino.valueToCode(this, 'B', Blockly.Arduino.ORDER_ATOMIC);
 var colour=B+"*256"+"+"+G+"*8"+"+"+R+"/8";
 return [colour, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino.TFT_init = function() {
  Blockly.Arduino.definitions_["include_Adafruit_GFX"] = '#include <Adafruit_GFX.h>';
  Blockly.Arduino.definitions_["include_Adafruit_ST7735"] = '#include <Adafruit_ST7735.h>';
  Blockly.Arduino.definitions_["include_SPI"] = '#include <SPI.h>';
  Blockly.Arduino.definitions_['var_declare_Adafruit_ST7735'] ='Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC,-1);';
  Blockly.Arduino.setups_["setup_tft.initR"] ='tft.initR(INITR_18GREENTAB);';
  Blockly.Arduino.setups_["setup_tft.fillScreen(ST7735_BLACK)"] ='tft.fillScreen(ST7735_BLACK);';
  Blockly.Arduino.setups_['ledcSetup_tft_brightness'] = 'dacWrite(26, 255);';
  Blockly.Arduino.definitions_["include_U8g2_for_Adafruit_GFX"] = '#include <U8g2_for_Adafruit_GFX.h>';
  Blockly.Arduino.definitions_['var_declare_U8G2_FOR_ADAFRUIT_GFX'] ='U8G2_FOR_ADAFRUIT_GFX u8g2_for_adafruit_gfx;';
  Blockly.Arduino.setups_["setup_u8g2_for_adafruit_gfx"] ='u8g2_for_adafruit_gfx.begin(tft);';
  return '';
};

Blockly.Arduino.TFT_fillScreen=function(){
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 var code = 'tft.fillScreen'+'('+colour+');\n';
 return code;
};

Blockly.Arduino.tft_drawPixel = function() {
 var pos_x = Blockly.Arduino.valueToCode(this, 'POS_X') || '0';
 var pos_y = Blockly.Arduino.valueToCode(this, 'POS_Y') || '0';
 var code = "";
 var COLOR = Blockly.Arduino.valueToCode(this, 'COLOR');
 COLOR=COLOR.replace(/#/g,"0x");
 COLOR=RGB_RGB565(COLOR);
 code += 'tft.drawPixel(' + pos_x + ',';
 code += pos_y ;
 code+=','+COLOR+');\n';
 return code;
};

Blockly.Arduino.tft_drawLine = function() {
 var start_x = Blockly.Arduino.valueToCode(this, 'START_X') || '0';
 var start_y = Blockly.Arduino.valueToCode(this, 'START_Y') || '0';
 var end_x = Blockly.Arduino.valueToCode(this, 'END_X') || '0';
 var end_y = Blockly.Arduino.valueToCode(this, 'END_Y') || '0';
 var code = "";
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 
 code = 'tft.drawLine(' + start_x + ',';
 code += start_y + ',';
 code += end_x + ',';
 code += end_y;
 code+=','+colour+');\n';
 return code;
};

Blockly.Arduino.tft_drawFastLine = function() {
 var start_x = Blockly.Arduino.valueToCode(this, 'START_X') || '0';
 var start_y = Blockly.Arduino.valueToCode(this, 'START_Y') || '0';
 var length = Blockly.Arduino.valueToCode(this, 'LENGTH') || '0';
 var TYPE = this.getFieldValue('TYPE');
 var code = "";
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 
 code = "tft.drawFast" + TYPE + "Line(" + start_x + ',';
 code += start_y + ',';
 code += length ;
 code+=','+colour+');\n';
 return code;
};

Blockly.Arduino.tft_Triangle = function() {
 var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
 var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
 var D1_x = Blockly.Arduino.valueToCode(this, 'D1_X') || '0';
 var D1_y = Blockly.Arduino.valueToCode(this, 'D1_Y') || '0';
 var D2_x = Blockly.Arduino.valueToCode(this, 'D2_X') || '0';
 var D2_y = Blockly.Arduino.valueToCode(this, 'D2_Y') || '0';
 var code = "";
 var type = this.getFieldValue('TYPE');
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 
 code = 'tft.'+type+'Triangle(' + D0_x + ',';
 code += D0_y + ',';
 code += D1_x + ',';
 code += D1_y + ',';
 code += D2_x + ',';
 code += D2_y;
 code+=','+colour+');\n';
 return code;
};

Blockly.Arduino.tft_Rect = function() {
 var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
 var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
 var Width = Blockly.Arduino.valueToCode(this, 'WIDTH') || '0';
 var Height = Blockly.Arduino.valueToCode(this, 'HEIGHT') || '0';
 var type = this.getFieldValue('TYPE');
 var code = "";
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 
 code = 'tft.'+type+'Rect(' + D0_x + ',';
 code += D0_y + ',';
 code += Width + ',';
 code += Height;
 code+=','+colour+');\n';
 return code;
};

Blockly.Arduino.tft_RoundRect = function() {
 var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
 var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
 var Width = Blockly.Arduino.valueToCode(this, 'WIDTH') || '0';
 var Height = Blockly.Arduino.valueToCode(this, 'HEIGHT') || '0';
 var Rauius = Blockly.Arduino.valueToCode(this, 'RADIUS') || '0';
 var type = this.getFieldValue('TYPE');
 var code = "";
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 
 code = 'tft.'+type+'RoundRect(' + D0_x + ',';
 code += D0_y + ',';
 code += Width + ',';
 code += Height + ',';
 code += Rauius ;
 code+=','+colour+');\n';
 return code;
};

Blockly.Arduino.tft_Circle = function() {
 var D0_x = Blockly.Arduino.valueToCode(this, 'D0_X') || '0';
 var D0_y = Blockly.Arduino.valueToCode(this, 'D0_Y') || '0';
 var Rauius = Blockly.Arduino.valueToCode(this, 'RADIUS') || '0';
 var type = this.getFieldValue('TYPE');
 var opt = this.getFieldValue('OPT');
 var code = "";
 var colour = Blockly.Arduino.valueToCode(this, 'COLOR');
 
 code = 'tft.'+type+'Circle(' + D0_x + ',';
 code += D0_y + ',';
 code += Rauius;
 code+=','+colour+');\n';
 return code;
};

Blockly.Arduino.tft_define_bitmap_data = function() {
  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var text = this.getFieldValue('TEXT');
  Blockly.Arduino.definitions_['var_declare' + varName] = 'const uint16_t ' + varName + '[] PROGMEM ={' + text + ' };\n';
  return '';
};

Blockly.Arduino.tft_showBitmap = function() {
 var start_x = Blockly.Arduino.valueToCode(this, 'START_X')||'0';
 var start_y = Blockly.Arduino.valueToCode(this, 'START_Y')|| '0';
 var Height = Blockly.Arduino.valueToCode(this, 'HEIGHT')|| '0';
 var WIDTH = Blockly.Arduino.valueToCode(this, 'WIDTH')|| '0';
 var data_name = Blockly.Arduino.valueToCode(this, 'bitmap_name', Blockly.Arduino.ORDER_ATOMIC);
 data_name = data_name.replace(/\"/g, ""); 
 var code = "tft.drawRGBBitmap("+start_x+", "+start_y+", "+data_name+", "+WIDTH+", "+Height+");";

 return code;
};

Blockly.Arduino.tft_set_EN_Font = function() {
 var FONT_NAME = this.getFieldValue('FONT_NAME');
 var FONT_SIZE = this.getFieldValue('FONT_SIZE');
 var FONT_STYLE = this.getFieldValue('FONT_STYLE');
 var code = "u8g2_for_adafruit_gfx.setFont(u8g2_font_"+FONT_NAME+FONT_STYLE+FONT_SIZE+"_tf);\n";
 return code;
};

Blockly.Arduino.tft_set_CN_Font = function() {
 var FONT_NAME = this.getFieldValue('FONT_NAME');
 var FONT_SIZE = this.getFieldValue('FONT_SIZE');
 var code = "u8g2_for_adafruit_gfx.setFont(u8g2_font_"+FONT_SIZE+FONT_NAME+");\n";
 return code;
};


Blockly.Arduino.group_lcd_init=Blockly.Arduino.group_lcd_init2;