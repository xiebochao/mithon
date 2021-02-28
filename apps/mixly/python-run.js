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

let play_btn = document.getElementById("play_btn");
let side_code_run = document.getElementById("div_inout_middle");
//let side_code_bottom = document.getElementById("side_code_bottom");
let shell = null;
const py_play = async () => {
	//status_bar_select = false;
	status_bar_show(1);
	//side_code_run.textContent = "程序正在运行...\n";
	div_inout_middle_text.setValue("程序正在运行...\n");
	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
	var code = "";
	if(document.getElementById('tab_arduino').className == 'tabon'){
        code = editor.getValue();
	}else{
		code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace) || '';
	}
	if (code.indexOf("import turtle") != -1) code+="\nturtle.done()\n"; 
	code = code.replaceAll("input(", "pyinput.input(");
	//code = "import pyinput\n" + code;
	if(shell) 
		shell.terminate('SIGKILL');
	file_save.writeFile(py_file_path, code,'utf8',function(err){
	    //如果err=null，表示文件使用成功，否则，表示希尔文件失败
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
			    	if (div_inout_middle_text.getValue().lastIndexOf("\n") == div_inout_middle_text.getValue().length-1)
			    		div_inout_middle_text.setValue(div_inout_middle_text.getValue() + "==程序运行完成==\n");
			    	else
			    		div_inout_middle_text.setValue(div_inout_middle_text.getValue() + "\n==程序运行完成==\n");
			  		div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
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
				data = decode(iconv.decode(iconv.encode(data, "iso-8859-1"), 'gbk'));
				
		        div_inout_middle_text.setValue(div_inout_middle_text.getValue() + data);
		    	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
		    	
		    	if (data.lastIndexOf(">>>") != -1 && shell) {
					input_prompt_message = data.substring(data.lastIndexOf(">>>"));
					input_prompt_message_line = div_inout_middle_text.session.getLength();
					div_inout_middle_text.selection.moveCursorLineEnd();
					input_prompt_position_row = div_inout_middle_text.selection.getCursor().row;
					input_prompt_position_column = div_inout_middle_text.selection.getCursor().column;
				}
		    });

		    //程序运行出错时执行
			shell.stderr.setEncoding('binary');  
		    shell.stderr.on('data', function (err) {
				console.log('stderr: ' + err);
			  	if (iconv.encode(err, "iso-8859-1"))
			  		div_inout_middle_text.setValue(div_inout_middle_text.getValue() + iconv.decode(iconv.encode(err, "iso-8859-1"), 'gbk'));
			  	else
			  		div_inout_middle_text.setValue(div_inout_middle_text.getValue() + err);
		  	    div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
			    shell = null;
			});
	    }

	})
}
play_btn.addEventListener("click", () => {py_play()});

const py_stop = async () => {
	//status_bar_select = false;
	status_bar_show(1);
	if (shell) {
		shell.terminate('SIGKILL');
		//shell.stdout.end();
		//shell.stdin.end();
		div_inout_middle_text.setValue(div_inout_middle_text.getValue() + "\n==程序运行完成==\n");
		shell = null;
	} else {
		div_inout_middle_text.setValue(div_inout_middle_text.getValue() + "\n==无程序在运行==\n");
	}
	div_inout_middle_text.gotoLine(div_inout_middle_text.session.getLength());
}
stop_btn.addEventListener("click", () => {py_stop()});

function py_clear_output() {
	div_inout_middle_text.setValue("");
}

div_inout_middle_text.getSession().selection.on('changeCursor', function(e) {
	if (shell && input_prompt_message_line != -1) {
		if (div_inout_middle_text.selection.getCursor().row < input_prompt_position_row) {
			div_inout_middle_text.selection.moveCursorTo(input_prompt_position_row, input_prompt_position_column, true);
		}
		else if(div_inout_middle_text.selection.getCursor().row <= input_prompt_position_row 
			&& div_inout_middle_text.selection.getCursor().column <= input_prompt_position_column) {
			div_inout_middle_text.selection.moveCursorTo(input_prompt_position_row, input_prompt_position_column, true);
		}
		last_row_data = div_inout_middle_text.session.getLine(input_prompt_message_line-1);
		if(last_row_data.indexOf(">>>") != -1 
			&& div_inout_middle_text.selection.getCursor().row == input_prompt_message_line
			&& div_inout_middle_text.selection.getCursor().column == 0){
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


