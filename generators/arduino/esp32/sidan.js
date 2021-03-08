'use strict';

goog.provide('Blockly.Arduino.Handbit');
goog.require('Blockly.Arduino');

//HSC025A 蓝牙MP3指令
Blockly.Arduino.hsc025a_instruction = function() {
    var instruction= this.getFieldValue('instruction');
    Blockly.Arduino.setups_['setup_serial_Serial'] = 'Serial.begin(9600);';
    var code = "";
  if(instruction==1)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x00);\n  Serial.write(0xEF);\n';
  }
    if(instruction==2)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x01);\n  Serial.write(0xEF);\n';
  }
  if(instruction==3)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x02);\n  Serial.write(0xEF);\n';
  }
    if(instruction==4)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x03);\n  Serial.write(0xEF);\n';
  }
  if(instruction==5)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x04);\n  Serial.write(0xEF);\n';
  }
    if(instruction==6)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x05);\n  Serial.write(0xEF);\n';
  }
  if(instruction==7)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x06);\n  Serial.write(0xEF);\n';
  }
    if(instruction==8)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x07);\n  Serial.write(0xEF);\n';
  }
  if(instruction==9)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x08);\n  Serial.write(0xEF);\n';
  }
    if(instruction==10)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x09);\n  Serial.write(0xEF);\n';
  }
  if(instruction==11)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x0A);\n  Serial.write(0xEF);\n';
  }
   if(instruction==12)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x0D);\n  Serial.write(0x00);\n  Serial.write(0xEF);\n';
  }
  if(instruction==13)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x0D);\n  Serial.write(0x02);\n  Serial.write(0xEF);\n';
  }
    if(instruction==14)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x0D);\n  Serial.write(0x04);\n  Serial.write(0xEF);\n';
  }
    if(instruction==15)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x02);\n  Serial.write(0x17);\n  Serial.write(0xEF);\n';
  }
  if(instruction==16)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x46);\n  Serial.write(0x01);\n  Serial.write(0xEF);\n';
  }
    if(instruction==17)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x51);\n  Serial.write(0x00);\n  Serial.write(0xEF);\n';
  }
  if(instruction==18)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x51);\n  Serial.write(0x0B);\n  Serial.write(0xEF);\n';
  }
   if(instruction==19)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x51);\n  Serial.write(0x0C);\n  Serial.write(0xEF);\n';
  }
  if(instruction==20)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x51);\n  Serial.write(0x45);\n  Serial.write(0xEF);\n';
  }
    if(instruction==21)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x51);\n  Serial.write(0x44);\n  Serial.write(0xEF);\n';
  }
    if(instruction==22)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x15);\n  Serial.write(0x00);\n  Serial.write(0xEF);\n';
  }
    if(instruction==23)
  {
    code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x15);\n  Serial.write(0x01);\n  Serial.write(0xEF);\n';
  }
  return code;
};

//指定播放歌曲
Blockly.Arduino.hsc025a_play = function () {
    var num = Blockly.Arduino.valueToCode(this, 'num', Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setups_['setup_serial_Serial'] = 'Serial.begin(9600);';
    var code = '  Serial.write(0x7E);\n  Serial.write(0x04);\n  Serial.write(0x40);\n  Serial.write(0x00);\n  Serial.write(' + num + ');\n  Serial.write(0xEF);\n';
    return code;
};

//音量设置
Blockly.Arduino.hsc025a_volume = function () {
    var num = Blockly.Arduino.valueToCode(this, 'num', Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setups_['setup_serial_Serial'] = 'Serial.begin(9600);';
    var code = '  Serial.write(0x7E);\n  Serial.write(0x03);\n  Serial.write(0x0F);\n  Serial.write(' + num + ');\n  Serial.write(0xEF);\n';
    return code;
};