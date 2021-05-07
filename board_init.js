var Mixly_20_environment = 0;
try {
	Mixly_20_environment = (window && window.process && window.process.versions && window.process.versions['electron'])? 0: 1;
} catch (error) {
	Mixly_20_environment = 1;
}

var fs = null;
var resolve = null;
var mixly_20_path = null;
var path = null;
var dialog = null;
var nowPath = null;
if (Mixly_20_environment == 0) {
	fs = require('fs');
	path = require('path');
	resolve = require('path').resolve;
	mixly_20_path = resolve('./').replace("apps/mixly","");
	dialog = require('electron').remote.dialog;
	nowPath = path.resolve(__dirname);
}

function getid(id) {
	return document.getElementById(id);
}

function load_index_File() {
    return document.getElementById("html_file").click();
}

var copyFile = function(srcPath, tarPath, cb) {
	var rs = fs.createReadStream(srcPath)
	rs.on('error', function(err) {
	    if (err) {
	      	console.log('read error', srcPath)
	    }
	    cb && cb(err)
	})

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function(err) {
    	if (err) {
      		console.log('write error', tarPath)
    	}
    	cb && cb(err)
  	})
  	ws.on('close', function(ex) {
    	cb && cb(ex)
  	})

  	rs.pipe(ws)
}

var copyFolder = function(srcDir, tarDir, cb) {
  	fs.readdir(srcDir, function(err, files) {
	    var count = 0
	    var checkEnd = function() {
	      	++count == files.length && cb && cb()
	    }

	    if (err) {
	      	checkEnd()
	      	return
	    }

	    files.forEach(function(file) {
		     var srcPath = path.join(srcDir, file)
		     var tarPath = path.join(tarDir, file)

		     fs.stat(srcPath, function(err, stats) {
		        if (stats.isDirectory()) {
		          	console.log('mkdir', tarPath)
		          	fs.mkdir(tarPath, function(err) {
		            	if (err) {
		              		console.log(err)
		              		return
		            	}

		            	copyFolder(srcPath, tarPath, checkEnd)
		        	})
		    	} else {
		        	copyFile(srcPath, tarPath, checkEnd)
		    	}
	      	})
	    })

	    //为空时直接回调
	    files.length === 0 && cb && cb()
  	})
}

function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function writeFile(p,text){
    fs.writeFile(p, text,function (err) {
        if (!err)
          console.log("写入成功！")
      })
}

//递归创建目录 同步方法  
function mkdirsSync(dirname) {  
    if (fs.existsSync(dirname)) {  
      return true;
    } else {  
        if (mkdirsSync(path.dirname(dirname))) {  
            //console.log("mkdirsSync = " + dirname);
            fs.mkdirSync(dirname);
            return true;
        }  
    }  
}

function _copy(src, dist) {
  var paths = fs.readdirSync(src)
  paths.forEach(function(p) {
    var _src = src + '/' +p;
    var _dist = dist + '/' +p;
    var stat = fs.statSync(_src)
    if(stat.isFile()) {// 判断是文件还是目录
      fs.writeFileSync(_dist, fs.readFileSync(_src));
    } else if(stat.isDirectory()) {
      copyDir(_src, _dist)// 当是目录是，递归复制
    }
  })
}

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src,dist){
  var b = fs.existsSync(dist)
  //console.log("dist = " + dist)
  if(!b){
    //console.log("mk dist = ",dist)
    mkdirsSync(dist);//创建目录
  }
  //console.log("_copy start")
  _copy(src,dist);
}

function createDocs(src,dist,callback){
  //console.log("createDocs...")
  copyDir(src,dist);
  //console.log("copyDir finish exec callback")
  if(callback){
    callback();
  }
}

function get_index_File() {
	const res = dialog.showOpenDialogSync({
  		title: '导入板卡',
  		// 默认打开的路径，比如这里默认打开下载文件夹
  		defaultPath: mixly_20_path, 
  		buttonLabel: '确认',
  		// 限制能够选择的文件类型
  		filters: [
    		 { name: 'JSON File', extensions: ['json'] }
  		],
  		properties: [ 'openFile', 'showHiddenFiles' ],
  		message: '导入板卡'
	})
	console.log('res', res);

	if (!res) {
		return;
	}

	if (res[0].indexOf("config.json") == -1) {
		layer.msg('所选配置文件无效！', {
            time: 2000
        });
        return;
	}

    var old_path = res[0].substring(0, res[0].lastIndexOf("\\"));
    var new_path = nowPath + "\\board\\ThirdParty\\";
    new_path = new_path + old_path.substring(old_path.lastIndexOf("\\") + 1, old_path.length);
    if (new_path == old_path) {
    	layer.msg('此板卡已导入！', {
            time: 2000
        });
        return;
    }
    deleteFolder(new_path);
    fs.mkdir(new_path, function (err) {
	    if (!err) {
	        copyFolder(old_path, new_path, function(err) {
				if (err) {
				    return;
				}
				window.location.reload();
			})
	    }
	})
}

function load_board() {
	var readDir = null;
	if (Mixly_20_environment == 0 
		&& fs.existsSync(nowPath + "\\board\\ThirdParty\\")
		&& fs.statSync(nowPath + "\\board\\ThirdParty\\").isDirectory()) {
		readDir = fs.readdirSync(nowPath + "\\board\\ThirdParty\\");
		var now_index_num = 0;
		if (readDir.length != 0) {
			for (var i = 0; i < readDir.length; i++) {
				var now_index_path = nowPath + "\\board\\ThirdParty\\" + readDir[i];
				if (fs.existsSync(now_index_path + "\\config.json")) {
					var rawdata = fs.readFileSync(now_index_path + "\\config.json");
					var config_data = null;
					try{
						config_data = JSON.parse(rawdata);
					} catch(e) {
						console.log(e);
						continue;
					}
					config_data.ThirdPartyBoard = true;
					config_data.FolderPath = now_index_path;
					config_data.BoardIndex = 'board\\ThirdParty\\' + readDir[i] + '\\index.html';
					mixly_board.push(config_data);
					//console.log(config_data);
					//console.log(mixly_board);
				}
				now_index_num++;
				if (now_index_num == readDir.length)
					board_show();
			}
		}
	} else {
		board_show();
	}
}

function del_board(board_number) {
	try{
		deleteFolder(mixly_board[board_number].FolderPath);
	} catch (e) {
		console.log(e);
	}
	window.location.reload();
	//load_board();
}

//json转url参数
var parseParam = function(param, key) {
    var paramStr = "";
    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
    	try {
    		var newKey = key.toString().replaceAll("=", "@");
    		newKey = newKey.replaceAll("&", "$");
    		var newParam = param.toString().replaceAll("=", "@")
    		newParam = newParam.replaceAll("&", "$");
        	paramStr += "&" + newKey + "=" + encodeURIComponent(newParam);
    	} catch(e) {
    		console.log(e);
    		paramStr += "&" + key + "=" + encodeURIComponent(param);
    	}
    } else {
        $.each(param, function(i) {
            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + parseParam(this, k);
        });
    }
    return paramStr.substr(1);
};

function board_show() {
	var add_board = {
		BoardImg: "./files/add.png",
		BoardName: "",
		BoardDescription:"",
		BoardIndex: "javascript:;",
		environment: 0
	};

	mixly_board.push(add_board);

	if (getid("mixly-board")) {
		var board_container = getid("mixly-board");
		var board_num = 0;
		var a_row = '';
		board_container.innerHTML = '';
		for (var i = 0; i < mixly_board.length; i++) {
			if (mixly_board[i]['environment'] == 2 || Mixly_20_environment == mixly_board[i]['environment']) {
				if (mixly_board[i]['BoardIndex'] != 'javascript:;') {
					var board_json = JSON.parse(JSON.stringify(mixly_board[i]));

					/*
					var params = Object.keys(board_json).map(function (key) {
				        return encodeURIComponent(key) + "=" + encodeURIComponent(board_json[key]);
				    }).join("&");
				    */
				    var params = "id=error";
				    try{
					    params = parseParam(board_json);
					} catch(e) {
						console.log(e);
					}

					if (mixly_board[i]['ThirdPartyBoard']) {
						a_row += `
						<style>
							#board_${i}:hover #board_${i}_button {
							    display: block;
							}

							#board_${i}_button {
							    display: none;
							    background-color: rgba(0,0,0,0);
							    border: 0px;
							    padding-top: 2px;
							    margin-top: 0px;
							    margin-right: 0px;
							    position: absolute;
							    right: 15px;
							    top: 5px;
							    opacity: 0.5;
							}

							#board_${i}_button:hover {
							    opacity: 1;
							}
						</style>
						<div class="col-sm-4 col-md-3" id="board_${i}">
							<button id="board_${i}_button" onclick="del_board(${i})" type="button" class="layui-btn layui-btn-sm layui-btn-primary">
							  	<i class="icon-cancel-outline"></i>
							</button>
				            <div class="service-single">
				                <a href="${mixly_board[i]['BoardIndex']}?${params}">
				                    <img src="${mixly_board[i]['BoardImg']}" alt="service image" class="tiltimage">
				                    <h2>${mixly_board[i]['BoardName']}</h2>
				                </a>
				            </div>
				        </div>
						`;
					} else {
						a_row += `
						<div class="col-sm-4 col-md-3" id="board_${i}">
				            <div class="service-single">
				                <a href="${mixly_board[i]['BoardIndex']}?${params}">
				                    <img src="${mixly_board[i]['BoardImg']}" alt="service image" class="tiltimage">
				                    <h2>${mixly_board[i]['BoardName']}</h2>
				                </a>
				            </div>
				        </div>
						`;
					}
				} else {
					a_row += `
					<div class="col-sm-4 col-md-3">
			            <div class="service-single">
			                <a href="${mixly_board[i]['BoardIndex']}" onclick="open_board();">
			                    <img id="add-board" src="${mixly_board[i]['BoardImg']}" alt="service image" class="tiltimage">
			                    <h2>${mixly_board[i]['BoardName']}</h2>
			                </a>
			            </div>
			        </div>
					`;
				}
				board_num++;
				if (board_num % 4 == 0) {
					if (board_num == 4)
						a_row = '<div style="background-color:rgba(0,0,0,0);padding-left: 70px;padding-right: 70px;"><div class="row maxs">' + a_row + '</div></div>';
					else
						a_row = '<div style="background-color:rgba(0,0,0,0);padding-left: 70px;padding-right: 70px;"><div class="row maxs">' + a_row + '</div></div>';
					board_container.innerHTML = board_container.innerHTML + a_row;
					a_row = '';
				}
			}
		}
		if (board_num % 4 != 0 && a_row != '') {
			while(board_num % 4 != 0) {
				a_row += `
				<div class="col-sm-4 col-md-3">
		            <div class="service-single">
		                <a href="javascript:;">
		                    <img src="./files/blank.jpg" alt="service image" class="tiltimage">
		                </a>
		            </div>
		        </div>
				`;
				board_num++;
			}
			a_row = '<div style="background-color:rgba(0,0,0,0);padding-left: 70px;padding-right: 70px;"><div class="row maxs">' + a_row + '</div></div>';
			board_container.innerHTML = board_container.innerHTML + a_row;
			a_row = '';
		}
	}

	setTimeout(function () {
		if (getid("footer")) {
			var footer = getid("footer");
			footer.innerHTML = 
			`
			<div class="container" style="text-align:center;">
			    <hr>
			    <p>Copyright © Mixly Team@BNU, CHINA</p>
			</div>
			`;
		}
	}, 400);
}

load_board();