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
if (Mixly_20_environment == 0) {
	fs = require('fs');
	path = require('path')
	resolve = require('path').resolve;
	mixly_20_path = resolve('./').replace("apps/mixly","");
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
            console.log("mkdirsSync = " + dirname);
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
  console.log("dist = " + dist)
  if(!b){
    console.log("mk dist = ",dist)
    mkdirsSync(dist);//创建目录
  }
  console.log("_copy start")
  _copy(src,dist);
}

function createDocs(src,dist,callback){
  console.log("createDocs...")
  copyDir(src,dist);
  console.log("copyDir finish exec callback")
  if(callback){
    callback();
  }
}

function get_index_File(input) {
    var files = input.files;
    if (files) {
	    if (files[0] && files[0].size > 10 * 1024 * 1024) {
	        alert('你选择的文件太大了！');
	        return false;
	    }
	    var index_path = files[0].path;
	    var index_name = files[0].name;
	    var old_path = index_path.replace("\\" + index_name, "");
	    var new_path = mixly_20_path + "\\company\\";
	    new_path = new_path + old_path.substring(old_path.lastIndexOf("\\") + 1, old_path.length);
	    
	    if (files[0].type != "text/html") {
	    	layer.msg('所选择文件不是有效的板卡文件！', {
	            time: 2000
	        });
	        return;
	    }

	    if (!fs.existsSync(old_path + "\\config.json")) {
	    	layer.msg('未找到板卡配置文件！', {
	            time: 2000
	        });
	        return;
	    }

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
}

function load_board() {
	var readDir = null;
	if (Mixly_20_environment == 0)
		readDir = fs.readdirSync(mixly_20_path + "\\company\\");
	var now_index_num = 0;
	if (Mixly_20_environment == 0 && readDir.length != 0) {
		for (var i = 0; i < readDir.length; i++) {
			var now_index_path = mixly_20_path + "\\company\\" + readDir[i];
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
				mixly_board.push(config_data);
				//console.log(config_data);
				//console.log(mixly_board);
				try{
					deleteFolder(mixly_20_path + "\\resources\\app\\blocks\\" + config_data['blocks']);
				} catch (e) {
					console.log(e);
				}

				try{
					deleteFolder(mixly_20_path + "\\resources\\app\\generators\\" + config_data['generators']);
				} catch (e) {
					console.log(e);
				}

				try{
					deleteFolder(mixly_20_path + "\\resources\\app\\converters\\" + config_data['converters']);
				} catch (e) {
					console.log(e);
				}

				try{
					deleteFolder(mixly_20_path + "\\resources\\app\\apps\\mixly\\" + config_data['myBlock']);
				} catch (e) {
					console.log(e);
				}

				try{
					fs.unlinkSync(mixly_20_path + "\\resources\\app\\apps\\mixly\\css\\" + config_data['css']);
				} catch (e) {
					console.log(e);
				}

				try{
					fs.unlinkSync(mixly_20_path + "\\resources\\app\\files\\" + config_data['files']);
				} catch (e) {
					console.log(e);
				}

				try{
					fs.unlinkSync(mixly_20_path + "\\resources\\app\\apps\\mixly\\" + config_data['BoardIndex'].replace("./apps/mixly/", ""));
				} catch (e) {
					console.log(e);
				}

				try{
					fs.copyFileSync(now_index_path + "\\" + config_data['BoardIndex'].replace("./apps/mixly/", ""), mixly_20_path + "\\resources\\app\\apps\\mixly\\" + config_data['BoardIndex'].replace("./apps/mixly/", "")); 
				} catch (e) {
					console.log(e);
				}

				try{
					fs.copyFileSync(now_index_path + "\\files\\" + config_data['files'], mixly_20_path + "\\resources\\app\\files\\" + config_data['files']);  
				} catch (e) {
					console.log(e);
				}

				try{
					fs.copyFileSync(now_index_path + "\\css\\" + config_data['css'], mixly_20_path + "\\resources\\app\\apps\\mixly\\css\\" + config_data['css']);
				} catch (e) {
					console.log(e);
				}

				try{
					createDocs(now_index_path + "\\blocks\\", mixly_20_path + "\\resources\\app\\blocks\\",function(){});
				} catch (e) {
					console.log(e);
				}

				try{
					createDocs(now_index_path + "\\generators\\", mixly_20_path + "\\resources\\app\\generators\\",function(){});
				} catch (e) {
					console.log(e);
				}

				try{
					createDocs(now_index_path + "\\converters\\", mixly_20_path + "\\resources\\app\\converters\\",function(){});
				} catch (e) {
					console.log(e);
				}

				try{
					if (config_data['myBlock'])
						createDocs(now_index_path + "\\" + config_data['myBlock'], mixly_20_path + "\\resources\\app\\apps\\mixly\\" + config_data['myBlock'],function(){});
				} catch (e) {
					console.log(e);
				}
				
				/*
				fs.mkdir(mixly_20_path + "\\resources\\app\\apps\\mixly\\" + config_data['myBlock'], function (err) {
				    if (err) {
				    	console.log(err);
				    } else {
				    	createDocs(now_index_path + "\\" + config_data['myBlock'], mixly_20_path + "\\resources\\app\\apps\\mixly\\" + config_data['myBlock'],function(){});
				    }
				})
				*/
			}
			now_index_num++;
			if (now_index_num == readDir.length)
				board_show();
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

	try{
		deleteFolder(mixly_20_path + "\\resources\\app\\blocks\\" + mixly_board[board_number]['blocks']);
	} catch (e) {
		console.log(e);
	}

	try{
		deleteFolder(mixly_20_path + "\\resources\\app\\generators\\" + mixly_board[board_number]['generators']);
	} catch (e) {
		console.log(e);
	}

	try{
		deleteFolder(mixly_20_path + "\\resources\\app\\converters\\" + mixly_board[board_number]['converters']);
	} catch (e) {
		console.log(e);
	}

	try{
		deleteFolder(mixly_20_path + "\\resources\\app\\apps\\mixly\\" + mixly_board[board_number]['myBlock']);
	} catch (e) {
		console.log(e);
	}

	try{
		fs.unlinkSync(mixly_20_path + "\\resources\\app\\apps\\mixly\\css\\" + mixly_board[board_number]['css']);
	} catch (e) {
		console.log(e);
	}

	try{
		fs.unlinkSync(mixly_20_path + "\\resources\\app\\files\\" + mixly_board[board_number]['files']);
	} catch (e) {
		console.log(e);
	}

	try{
		fs.unlinkSync(mixly_20_path + "\\resources\\app\\apps\\mixly\\" + mixly_board[board_number]['BoardIndex'].replace("./apps/mixly/", ""));
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
				                <!--<p>${mixly_board[i]['BoardDescription']}</p>-->
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
				                <!--<p>${mixly_board[i]['BoardDescription']}</p>-->
				            </div>
				        </div>
						`;
					}
				} else {
					a_row += `
					<div class="col-sm-4 col-md-3">
			            <div class="service-single">
			                <a href="${mixly_board[i]['BoardIndex']}" onclick="load_index_File();">
			                    <img id="add-board" src="${mixly_board[i]['BoardImg']}" alt="service image" class="tiltimage">
			                    <h2>${mixly_board[i]['BoardName']}</h2>
			                </a>
			                <!--<p>${mixly_board[i]['BoardDescription']}</p>-->
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
		                    <img src="./files/blank2.jpg" alt="service image" class="tiltimage">
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