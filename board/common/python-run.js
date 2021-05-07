let {PythonShell} = require('python-shell')
//const {resolve} = require('path')
//var windows1252 = require('windows-1252');
var iconv = require('iconv-lite');
var input_prompt_message = "";
var input_prompt_message_line = -1;
var input_prompt_position_row = -1;
var input_prompt_position_column = -1;
//python-shell输出中文数据有乱码，现在编码为iso-8859-1，原来编码为GBK
var options = {
  　　pythonPath: python3_path,
  　　pythonOptions: ['-u'/*,'-i'*/],
      encoding: "binary",
      mode: 'utf-8'/*,
 　　 //scriptPath: 'D:\\mixly\\Mixly_WIN\\mixpyBuild\\win_python3\\Scripts',
 　　 args: ['value1', 'value2', 'value3']*/
};

let shell = null;

var MixlyPython = {};

function message_decode(s) {
	if (s) {
		try{
			return unescape(s.replace(/_([0-9a-fA-F]{3})/gm, '%$1'));
		} catch(e) {
			return s;
		}
	}
	return s;
}

/**
* @ function 运行python
* @ description 运行当前画布上的python程序
* @ return void
*/
MixlyPython.play = function () {
	MixlyStatusBar.show(1);
	MixlyStatusBar.setValue("程序正在运行...\n", true);
	var code = "";
	if(document.getElementById('tab_arduino').className == 'tabon'){
        code = editor.getValue();
        try {
        	var inputArr = code.match(/(?<![\w+])input\(/g);
			if (inputArr) {
				code = code.replace("\n", "import pyinput\n");
				code = code.replace(/(?<![\w+])input\(/g, "pyinput.input(");
			}
		} catch(e) {
			console.log(e);
		}
	}else{
		code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
		var chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) { return decodeURIComponent(s.replace(/_/g, '%')); });
		code = chinese_code;
		try {
        	var inputArr = code.match(/(?<![\w+])input\(/g);
			if (inputArr) {
				code = "import pyinput\n" + code;
				code = code.replace(/(?<![\w+])input\(/g, "pyinput.input(");
			}
		} catch(e) {
			console.log(e);
		}
	}
	if (code.indexOf("import turtle") != -1) code+="\nturtle.done()\n"; 
	if(shell) 
		shell.terminate('SIGKILL');
	file_save.writeFile(py_file_path, code,'utf8',function(err){
	    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
	    err = message_decode(err);
	    if(err) {
	    	layer.msg('写文件出错了，错误是：'+err, {
	            time: 1000
	        });
	    } else {
	    	shell = new PythonShell(py_file_path, options);

	    	//程序运行完成时执行
			shell.childProcess.on('exit', (code) => {
			    console.log(code);
			    if(code == 0) {
			    	if (MixlyStatusBar.getValue().lastIndexOf("\n") == MixlyStatusBar.getValue().length-1)
			    		MixlyStatusBar.addValue("==程序运行完成==\n", false);
			    	else
			    		MixlyStatusBar.addValue("\n==程序运行完成==\n", false);
			  		MixlyStatusBar.scrollToTheBottom();
			  		shell = null;
			    }
			});
			
			/*
			//有数据输入时执行
			var data =  Buffer.from([0, 1, 2], 'float32');  
			shell.stdin.setEncoding('utf-8');   
			setInterval(function(){
				if (shell)
					shell.stdin.write('111\r\n');
			}, 500);
			*/
			
			//有数据输出时执行
		    shell.stdout.setEncoding('binary');  
			shell.stdout.on('data', function (data) {
				try {
					data = decode(iconv.decode(iconv.encode(data, "iso-8859-1"), 'gbk'));
					data = message_decode(data);
					data = data.replace(/(?<![\w+])pyinput.input\(/g, "input(");
				} catch(e) {
					console.log(e);
				}
		    	MixlyStatusBar.addValue(data, true);
		    	
		    	if (data.lastIndexOf(">>>") != -1 && shell) {
					input_prompt_message = data.substring(data.lastIndexOf(">>>"));
					input_prompt_message_line = MixlyStatusBar.object.session.getLength();
					MixlyStatusBar.object.selection.moveCursorLineEnd();
					input_prompt_position_row = MixlyStatusBar.object.selection.getCursor().row;
					input_prompt_position_column = MixlyStatusBar.object.selection.getCursor().column;
				}
		    });

		    //程序运行出错时执行
			shell.stderr.setEncoding('binary');  
		    shell.stderr.on('data', function (err) {
				console.log('stderr: ' + err);
				try {
					err = err.replace(/(?<![\w+])pyinput.input\(/g, "input(");
				} catch(e) {
					console.log(e);
				}
			  	try {
			  		MixlyStatusBar.addValue(iconv.decode(iconv.encode(err, "iso-8859-1"), 'gbk'), false);
			  		err = message_decode(err);
			  	} catch(e) {
			  		err = message_decode(err);
			  		MixlyStatusBar.addValue(err, false);
			  	}
		  	    MixlyStatusBar.scrollToTheBottom();
			    shell = null;
			});
	    }

	})
}

/**
* @ function 停止py
* @ description 停止当前正在运行的python程序
* @ return void
*/
MixlyPython.stop = function () {
	MixlyStatusBar.show(1);
	if (shell) {
		shell.terminate('SIGKILL');
		//shell.stdout.end();
		//shell.stdin.end();
		MixlyStatusBar.addValue("\n==程序运行完成==\n", false);
		shell = null;
	} else {
		MixlyStatusBar.addValue("\n==无程序在运行==\n", false);
	}
	MixlyStatusBar.scrollToTheBottom();
}

/**
* @ function 清空状态栏
* @ description 清空当前状态栏内的所有数据
* @ return void
*/
MixlyPython.clearOutput = function () {
	MixlyStatusBar.setValue("");
}

MixlyStatusBar.object.getSession().selection.on('changeCursor', function(e) {
	if (shell && input_prompt_message_line != -1) {
		if (MixlyStatusBar.object.selection.getCursor().row < input_prompt_position_row) {
			MixlyStatusBar.object.selection.moveCursorTo(input_prompt_position_row, input_prompt_position_column, true);
		}
		else if(MixlyStatusBar.object.selection.getCursor().row <= input_prompt_position_row 
			&& MixlyStatusBar.object.selection.getCursor().column <= input_prompt_position_column) {
			MixlyStatusBar.object.selection.moveCursorTo(input_prompt_position_row, input_prompt_position_column, true);
		}
		last_row_data = MixlyStatusBar.object.session.getLine(input_prompt_message_line-1);
		if(last_row_data.indexOf(">>>") != -1 
			&& MixlyStatusBar.object.selection.getCursor().row == input_prompt_message_line
			&& MixlyStatusBar.object.selection.getCursor().column == 0){
			//shell.stdin.setEncoding('utf-8'); 
			if (last_row_data.indexOf(input_prompt_message) == -1) {
				last_row_data = last_row_data.replace(">>> ", "");
				last_row_data = last_row_data.replace(">>>", "");
				shell.stdin.write(escape(last_row_data.replace(">>>", "")) + "\n");
			} else {
				shell.stdin.write(escape(last_row_data.replace(input_prompt_message, "")) + "\n");
			}
			input_prompt_message_line = -1;
			last_row_data = "";
		}
	}

});


