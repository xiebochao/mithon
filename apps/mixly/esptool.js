var MixlyEsptool = {};

MixlyEsptool.burnFirmware = function (boardType) {

}

/*
* @ function 使用esptool烧录固件
* @ description 调用python-shell运行esptool.py为板卡烧录固件
* @ param {String} 选择的串口
* @ param {boardType} 板卡类型：可选值有esp
*
*/
function esptool_download(com, boardType) {
	if (serial_port && serial_port.isOpen) {
		serial_port.close();
	}
	status_bar_show(1);
	upload_cancel = true;

	//div_inout_middle_text.setValue("程序正在运行...\n");
	//div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	if(boardType == 'esp32_s2') {
	var code = "import esptool\n"
	         + "command = ['--port', '"+com+"', '--baud', '460800', '--after', 'no_reset', 'write_flash', '0x0000', '"+mixly_20_path+"\\cpBuild\\ESP32S2_MixGoCE\\mixgoce.bin']\n"
	         + "print('Using command %s' % ' '.join(command))\n"
	         + "esptool.main(command)\n";
	esptool_run(mixly_20_path + "\\cpBuild\\ESP32S2_MixGoCE\\program.py", code, true, boardType);
	} else if (boardType == 'mixgo') {
	var code = "import esptool\n"
	         + "command1 = ['--port', '"+com+"', '--baud', '460800', 'erase_flash']\n"
	         + "print('Using command1 %s' % ' '.join(command1))\n"
	         + "esptool.main(command1)\n"
	         + "command2 = ['--port', '"+com+"', '--baud', '460800', 'write_flash', '0x1000', '"+mixly_20_path+"\\mpBuild\\ESP32_MixGo\\esp32.bin', '0x200000', r'"+mixly_20_path+"\\mpBuild\\ESP32_MixGo\\Noto_Sans_CJK_SC_Light16.bin']\n"
	         + "print('Using command2 %s' % ' '.join(command2))\n"
	         + "esptool.main(command2)\n";
	esptool_run(mixly_20_path + "\\mpBuild\\ESP32_MixGo\\program.py", code, true, boardType);
	} else {
	div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "不支持的板卡类型！\n==烧录失败==\n");
	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	layer.closeAll('page');
	document.getElementById('webusb-flashing').style.display = 'none';
	}
}

function esptool_run(esp_path, esp_code, burn, boardType) {
  file_save.writeFile(esp_path, esp_code,'utf8',function(err){
      //如果err=null，表示文件使用成功，否则，表示希尔文件失败
      if(err) {
        layer.closeAll('page');
        document.getElementById('webusb-flashing').style.display = 'none';
        layer.msg('写文件出错了，错误是：'+err, {
          time: 1000
        });
      } else {
      download_shell = new PythonShell(esp_path, options);

        //程序运行完成时执行
      download_shell.childProcess.on('exit', (code) => {
        console.log(code);
        if(code == 0) {
          layer.closeAll('page');
          document.getElementById('webusb-flashing').style.display = 'none';
          if (burn) {
            div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==烧录成功==\n");
            layer.msg('烧录成功！', {
                time: 1000
            });
          } else {
            div_inout_middle_text.setValue(div_inout_middle_text.getValue()  + "==上传成功==\n");
            layer.msg('上传成功！', {
                time: 1000
            });
          }

          if (boardType == 'mixgo' && !burn) {
            py_refreshSerialList_select_com("mixgo");
            setTimeout(function () {
              connect_com_with_option("cp");
              serialWrite_ctrl_d();
            }, 1000);
          }
        }
        div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
        download_shell = null;
        upload_cancel = true;
      });
      
      //有数据输出时执行
      download_shell.stdout.setEncoding('binary');  
      download_shell.stdout.on('data', function (data) {
        data = decode(iconv.decode(iconv.encode(data, "iso-8859-1"), 'gbk'));
        div_inout_middle_text.setValue(div_inout_middle_text.getValue() + data);
        div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
      });

        //程序运行出错时执行
      download_shell.stderr.setEncoding('binary');  
        download_shell.stderr.on('data', function (err) {
          console.log('stderr: ' + err);
          if (iconv.encode(err, "iso-8859-1"))
            div_inout_middle_text.setValue(div_inout_middle_text.getValue() + iconv.decode(iconv.encode(err, "iso-8859-1"), 'gbk'));
          else
            div_inout_middle_text.setValue(div_inout_middle_text.getValue() + err);
          layer.closeAll('page');
          document.getElementById('webusb-flashing').style.display = 'none';
          if (burn) {
            layer.msg('烧录失败', {
              time: 1000
            });
          } else {
            layer.msg('上传失败', {
              time: 1000
            });
          }
          div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
          download_shell = null;
        });
      }
  })
}