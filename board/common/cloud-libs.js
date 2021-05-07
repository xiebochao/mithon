if (!Mixly_20_environment) throw false;

var request = require("request");
const https = require("https");
const mixlyPath = require("path");
const AdmZip = require('adm-zip-iconv');
/*
var url =[
    "https://gitee.com/mixlyplus/mixly-create-agent-bin/raw/master/libs.json"
]
var url_data = null;
request({
    url: "https://gitee.com/mixlyplus/mixly-create-agent-bin/raw/master/libs.json",
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
    	var data = JSON.parse(JSON.stringify(body));
    	console.log(data);
    	url_data = data;
    } else {
    	console.log(error);
    }
})
*/
var defaultUrl = '';
if (MixlyUrl.BOARD_CONFIG.hasOwnProperty("lib.url")) {
	defaultUrl = MixlyUrl.BOARD_CONFIG["lib.url"];
}
var cloudLibsArray = [];

var libsUrlList = [];

var cloudLibsNum = 0;

//数组去除重复元素
function unique(arr) {
  return Array.from(new Set(arr))
}

function jsonArray(data){
  	var len=data.length;
  	var arr=[];
  	for(var i=0; i < len; i++){
    	arr[i] =[]; //js中二维数组必须进行重复的声明，否则会undefind
   	 	arr[i]=data[i];
  	}
  	return arr;  
}

function getUrl(val) {
	var urlArr = [];
	try {
    	//urlArr = val.match(/http[s]?:\/\/([\w-]+.)+[\w-]+(\/[\w-\.\/\?%&=]*)?/g);//旧的匹配方法
    	urlArr = val.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g);
    	urlArr = unique(urlArr);
    	urlArr = urlArr.filter(item => item != defaultUrl);
    } catch(e) {
    	console.log(e);
    }
    return urlArr;
}

function writeUrlArr(arr, path) {
	var urlJson = null;
	try {
		urlJson = JSON.stringify(unique(arr));
		file_save.writeFileSync(path, urlJson);
	} catch(e) {
		console.log(e);
	}
}

function readUrlArr(path) {
	var urlArr = [];
	var data = null;
	try {
		if (!file_save.existsSync(path)) {
	    	urlArr.push(defaultUrl);
	    	writeUrlArr(urlArr, path);
	        return urlArr;
	    }
		data = file_save.readFileSync(path, "utf-8");

		if (!data) {
			urlArr.push(defaultUrl);
	    	writeUrlArr(urlArr, path);
	        return urlArr;
		}
		urlArr = unique(jsonArray(JSON.parse(data)));
	} catch(e) {
		console.log(e);
	}
	return urlArr;
}

var cloudLibsUrl = readUrlArr(indexPath + '/libraries/cloudLibsUrl.json');

function getLibsJson(table, libUrl) {
	request({
        url: libUrl,
        json: true
    }, function (error, response, body) {
    	var receiveData = null;
    	var jsonData = null;
        if (!error && response.statusCode === 200) {
			try {
				//receiveData = JSON.parse(body);
				jsonData = jsonArray(body);
				cloudLibsArray = cloudLibsArray.concat(jsonData);
			} catch(e) {
				console.log(e);
			}
        } else {
          console.log(error);
        }
        cloudLibsNum++;
        if (cloudLibsNum >= cloudLibsUrl.length) {
        	table.render({
				id: 'cloud-libs-table',
				elem: '#import-library-page',
				data: cloudLibsArray,
				toolbar: '#import-library-toolbar',
				defaultToolbar:[{
				  	title: '设置',
				  	layEvent: 'LAYTABLE_SET',
				  	icon: 'layui-icon-set'
				}],
				title: '云端库',
				cols: [[
				  	{type: 'checkbox', width:"5%", unresize:false, align: "center"},
				  	{field:'name', title:'名称', width:"30%", sort: true, unresize:false, align: "center"},
				  	{field:'version', title:'版本', width:"20%", unresize:false, align: "center"},
				  	{field:'desc', title:'介绍', width:"45%", unresize:false, align: "center"}
				]],
				limit: 1000
			});
        }
    })
}

function refreshTable(table) {
	cloudLibsNum = 0;
    cloudLibsArray = [];
    cloudLibsUrl.forEach(function(key){
	    getLibsJson(table, key);
	});
}

function open_lib() {
  	layui.use(['layer','form', 'table', 'element'], function(){
	    var layer = layui.layer;
	    var element = layui.element;
	    layer.open({
	        type: 1,
	        title: '导入库',
	        area: ['90%','80%'],
	        content: $('#import-library'),
	        closeBtn: 1,
	        resize: false,
	        fixed: true,
	        offset: 'auto',
	        success: function (layero, index) {
	        	try{
	        		var now_page = document.getElementById(layero.selector.replace("#", ""));
	        		now_page.style.maxWidth = "800px";
	        		var now_height = document.documentElement.clientHeight;
	    			var now_width = document.documentElement.clientWidth;
	    			now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
	    			now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
	        	} catch(e) {
	        		console.log(e);
	        	}
	        },
	        end: function() {
	          document.getElementById('import-library').style.display = 'none';
	        }
	    });
	    var table = layui.table;

	    table.render({
	    	id: 'cloud-libs-table',
		    elem: '#import-library-page',
		    data: [],
		    toolbar: '#import-library-toolbar',
		    defaultToolbar:[{
		      	title: '设置',
		      	layEvent: 'LAYTABLE_SET',
		      	icon: 'layui-icon-set'
		    }],
		    title: '云端库',
		    cols: [[
		      	{type: 'checkbox', width:"5%", unresize:false, align: "center"},
		      	{field:'name', title:'名称', width:"30%", sort: true, unresize:false, align: "center"},
		      	{field:'version', title:'版本', width:"20%", unresize:false, align: "center"},
		      	{field:'desc', title:'介绍', width:"45%", unresize:false, align: "center"}
		    ]],
		    limit: 1000
		});

		refreshTable(table);
	    
	    //头工具栏事件
	    table.on('toolbar(import-library-page)', function(obj){
	      var checkStatus = table.checkStatus(obj.config.id);
	      switch(obj.event){
	        case 'cloud-import':
	          	var checkedJsonData = checkStatus.data;
	          	libsUrlList = [];
	          	for (var i = 0; i < checkedJsonData.length; i++) {
	          		libsUrlList.push(checkedJsonData[i].url);
	          	}
	          	console.log(libsUrlList);
	          	if (libsUrlList.length > 0) {
	          		layer.open({
				        type: 1,
				        id: "cloud-libs-download-content",
				        title: '进度',
				        area: ['80%', '70%'],
				        content: $('#cloud-libs-download-form'),
				        resize: false,
				        fixed: true,
				        //offset: 'auto',
				        success: function(layero){
				    		try{
				          		document.getElementById("cloud-libs-download-content").style.position = "absolute";
				          		document.getElementById("cloud-libs-download-content").style.left = "0";
				          		document.getElementById("cloud-libs-download-content").style.top = "43px";
				          		document.getElementById("cloud-libs-download-content").style.bottom = "0px";
				          		document.getElementById("cloud-libs-download-content").style.width = "100%";
				          		document.getElementById("cloud-libs-download-content").style.height = "auto";
					    		var now_page = document.getElementById(layero.selector.replace("#", ""));
					    		now_page.style.maxWidth = "700px";
					    		now_page.style.maxHeight = "400px";
					    		var now_height = document.documentElement.clientHeight;
								var now_width = document.documentElement.clientWidth;
								now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
								now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
								document.getElementById('cloud-libs-download-message').value = "";
								try {
									if (!file_save.existsSync(indexPath + '/libraries/ThirdParty/'))
										file_save.mkdirSync(indexPath + '/libraries/ThirdParty/');
									cloudDownload(indexPath + '/libraries/ThirdParty/', element);
								} catch(e) {
									console.log(e);
									cloudDownload(indexPath + '/libraries/ThirdParty/', element);
								}
					    	} catch(e) {
					    		console.log(e);
					    	}
				        },
				        cancel: function(index, layero){ 
				        	
						},
			          	end: function() {
			            	document.getElementById('cloud-libs-download-form').style.display = 'none';
			          	}
			      	});
	          	} else {
	          		layer.msg('请选择至少一个云端库！', {
				        time: 2000
				    });
	          	}
	        	break;
	        case 'local-import':
	          	importLocalLibrary();
	        	break;

	        case 'LAYTABLE_SET':
	          	layer.open({
			        type: 1,
			        id: "cloud-libs-url-content",
			        title: '编辑url',
			        area: ['80%', '70%'],
			        content: $('#cloud-libs-url-form'),
			        resize: false,
			        fixed: true,
			        //offset: 'auto',
			        success: function(layero){
			          	try{
			          		document.getElementById("cloud-libs-url-content").style.position = "absolute";
			          		document.getElementById("cloud-libs-url-content").style.left = "0";
			          		document.getElementById("cloud-libs-url-content").style.top = "43px";
			          		document.getElementById("cloud-libs-url-content").style.bottom = "0px";
			          		document.getElementById("cloud-libs-url-content").style.width = "100%";
			          		document.getElementById("cloud-libs-url-content").style.height = "auto";
				    		var now_page = document.getElementById(layero.selector.replace("#", ""));
				    		now_page.style.maxWidth = "700px";
				    		now_page.style.maxHeight = "300px";
				    		var now_height = document.documentElement.clientHeight;
							var now_width = document.documentElement.clientWidth;
							now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
							now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
							document.getElementById('cloud-libs-url-data').value = "";
							for (var i = 0; i < cloudLibsUrl.length; i++) {
								if (cloudLibsUrl[i] == defaultUrl) {
									continue;
								}
								document.getElementById('cloud-libs-url-data').value += cloudLibsUrl[i] + "\n";
							}
							//layer.setTop(layero);
							//cloud_libs_url_text.resize();
				    	} catch(e) {
				    		console.log(e);
				    	}
			        },
			        cancel: function(index, layero){ 
			        	var urlText = document.getElementById('cloud-libs-url-data').value;
					  	cloudLibsUrl = [];
					  	cloudLibsUrl.push(defaultUrl);
					  	var urlArr = getUrl(urlText);
					  	if (urlArr)
					  		cloudLibsUrl = cloudLibsUrl.concat(getUrl(urlText));
					  	writeUrlArr(cloudLibsUrl, indexPath + '/libraries/cloudLibsUrl.json');
					  	refreshTable(table);
					},
		          	end: function() {
		            	document.getElementById('cloud-libs-url-form').style.display = 'none';
		          	}
		      	});
	        	break;
	      	};
	    });
	}); 
}

function getHttpReqCallback(Src, dirName, index, element) {
	var fileName = mixlyPath.basename(Src);
	var callback = function(res) {
		console.log("request: " + Src + " return status: " + res.statusCode);
		document.getElementById('cloud-libs-download-message').value += "request: " + Src + " return status: " + res.statusCode + "\n";
		document.getElementById('cloud-libs-download-message').scrollTop = document.getElementById('cloud-libs-download-message').scrollHeight;
		//var contentLength = parseInt(res.headers['content-length']);
		var contentType = res.headers['content-type'];
		var fileBuff = [];
		res.on('data', function (chunk) {
			var buffer = new Buffer(chunk);
			fileBuff.push(buffer);
		});
		res.on('end', function() {
			console.log("end downloading " + Src);
			document.getElementById('cloud-libs-download-message').value += "end downloading " + Src + "\n";
			document.getElementById('cloud-libs-download-message').scrollTop = document.getElementById('cloud-libs-download-message').scrollHeight;
			//if (isNaN(contentLength)) {
			//  	console.log(Src + " content length error");
			//  	return;
			//}
			var totalBuff = Buffer.concat(fileBuff);
			console.log("totalBuff.length = " + totalBuff.length + " " + "contentType = " + contentType);
			document.getElementById('cloud-libs-download-message').value += "totalBuff.length = " + totalBuff.length + " " + "contentType = " + contentType + "\n";
			document.getElementById('cloud-libs-download-message').scrollTop = document.getElementById('cloud-libs-download-message').scrollHeight;
			//if (totalBuff.length < contentLength) {
			//  	console.log(Src + " download error, try again");
			//  	startDownloadTask(Src, dirName, index);
			//  	return;
			//}
			if (contentType != "application/zip") {
				console.log("This file is not zip");
				cloudLibsNum++;
				element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
				if (cloudLibsNum == libsUrlList.length) {
					console.log("finish! return 1");
					if (document.getElementById('cloud-libs-download-form').style.display != "none") {
						setTimeout(function() {
							loadLibraries();
						}, 1000);
					}
				}
				return;
			}
			try {
				file_save.unlinkSync(dirName + "/" + fileName);
			} catch(e) {
				console.log(e);
			}
			file_save.appendFile(dirName + "/" + fileName, totalBuff, function(err){
				if (err) {
					console.log(err);
				} else {
					try {
						const unzip = new AdmZip(dirName + "/" + fileName, 'GBK');
						unzip.extractAllTo(dirName + "/", true);
						file_save.unlinkSync(dirName + "/" + fileName);
					} catch(e) {
						console.log(e);
					}
				}
				cloudLibsNum++;
				element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
				if (cloudLibsNum == libsUrlList.length) {
					console.log("finish! return 2");
					if (document.getElementById('cloud-libs-download-form').style.display != "none") {
						setTimeout(function() {
							loadLibraries();
						}, 1000);
					}
				}
			});	   
		});
	};

	return callback;
}

var startDownloadTask = function(Src, dirName, index, element) {
	console.log("start downloading " + Src);
	var req = https.request(Src, getHttpReqCallback(Src, dirName, index, element));
	req.on('error', function(e){
	  	console.log("request " + Src + " error, try again");
	  	document.getElementById('cloud-libs-download-message').value += "request " + Src + " error, try again\n";
		document.getElementById('cloud-libs-download-message').scrollTop = document.getElementById('cloud-libs-download-message').scrollHeight;
	  	startDownloadTask(Src, dirName, index, element);
	});
	req.setTimeout(5000, function() {
      	console.log("reqeust " + Src + " timeout, abort this reqeust");
      	document.getElementById('cloud-libs-download-message').value += "reqeust " + Src + " timeout, abort this reqeust\n";
		document.getElementById('cloud-libs-download-message').scrollTop = document.getElementById('cloud-libs-download-message').scrollHeight;
      	//req.abort();
      	req.destroy();
      	cloudLibsNum++;
      	element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
		if (cloudLibsNum == libsUrlList.length) {
			console.log("finish! return 0");
			document.getElementById('cloud-libs-download-message').value += "reqeust " + Src + " timeout, abort this reqeust" + "\n";
			document.getElementById('cloud-libs-download-message').scrollTop = document.getElementById('cloud-libs-download-message').scrollHeight;
			if (document.getElementById('cloud-libs-download-form').style.display != "none") {
				setTimeout(function() {
					loadLibraries();
				}, 1000);
			}
		}
    })
	req.end();
}

function cloudDownload(path, element) {
	cloudLibsNum = 0;
	element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
	libsUrlList.forEach(function(item, index, array) {
		if (item.toLowerCase().indexOf(".zip") != -1) {
			startDownloadTask(item, path, index, element);
		} else {
			cloudLibsNum++;
			element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
			if (cloudLibsNum == libsUrlList.length) {
				document.getElementById('cloud-libs-download-message').value += libsUrlList[index] + "无效" + "\n";
				document.getElementById('cloud-libs-download-message').scrollTop = document.getElementById('cloud-libs-download-message').scrollHeight;
				console.log("finish! return 3");
				if (document.getElementById('cloud-libs-download-form').style.display != "none") {
					setTimeout(function() {
						loadLibraries();
					}, 1000);
				}
			}
		}
	})
}

var copyFile = function(srcPath, tarPath, cb) {
	var rs = file_save.createReadStream(srcPath)
	rs.on('error', function(err) {
	    if (err) {
	      	console.log('read error', srcPath)
	    }
	    cb && cb(err)
	})

    var ws = file_save.createWriteStream(tarPath)
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
  	file_save.readdir(srcDir, function(err, files) {
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

		     file_save.stat(srcPath, function(err, stats) {
		        if (stats.isDirectory()) {
		          	console.log('mkdir', tarPath)
		          	file_save.mkdir(tarPath, function(err) {
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
    if( file_save.existsSync(path) ) {
        files = file_save.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(file_save.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                file_save.unlinkSync(curPath);
            }
        });
        file_save.rmdirSync(path);
    }
}

function importLocalLibrary() {
	const res = dialog.showOpenDialogSync({
  		title: '导入库',
  		// 默认打开的路径，比如这里默认打开下载文件夹
  		defaultPath: mixly_20_path, 
  		buttonLabel: '确认',
  		// 限制能够选择的文件类型
  		filters: [
    		 { name: 'XML File', extensions: ['xml'] }
  		],
  		properties: [ 'openFile', 'showHiddenFiles' ],
  		message: '导入库'
	})
	console.log('res', res);

	if (!res) {
		return;
	}
	var oldPath = res[0].substring(0, res[0].lastIndexOf("\\"));
	var rootPath = require('path').resolve(__dirname);
    var newPath = rootPath + "\\libraries\\ThirdParty\\" + oldPath.substring(oldPath.lastIndexOf("\\") + 1, oldPath.length);
    console.log(newPath);
    deleteFolder(newPath);
    file_save.mkdir(newPath, function (err) {
	    if (!err) {
	        copyFolder(oldPath, newPath, function(err) {
				if (err) {
				    return;
				}
				
				loadLibraries();
			})
	    }
	})
}

function loadLibraries() {
	try {
		var rootPath = require('path').resolve(__dirname);
	    var libDir = file_save.readdirSync(rootPath + "/libraries/ThirdParty/");
		for (var i = 0; i < libDir.length; i++) {
	      	if (file_save.existsSync(rootPath + "/libraries/ThirdParty/" + libDir[i] + "/")) {
	      		//处理block
	      		var blockDir = file_save.readdirSync(rootPath + "/libraries/ThirdParty/" + libDir[i] + "/block/");
	        	for (var j = 0; j < blockDir.length; j++) {
	        		var blockData = String(file_save.readFileSync(rootPath + "/libraries/ThirdParty/" + libDir[i] + "/block/" + blockDir[j]));
	        		try {
	        			blockData = blockData.replace(/\.\.\/\.\.\/media\//g, "./libraries/ThirdParty/" + libDir[i] + "/media/");
	        			file_save.writeFileSync(rootPath + "/libraries/ThirdParty/" + libDir[i] + "/block/" + blockDir[j], blockData);
	        	 	} catch(e) {
	        			console.log(e);
	        		}
	        	}
	        	
	      		//处理xml
	        	var xmlDir = file_save.readdirSync(rootPath + "/libraries/ThirdParty/" + libDir[i] + "/");
	        	for (var j = 0; j < xmlDir.length; j++) {
	          		if (xmlDir[j].toLowerCase().indexOf(".xml") != -1) {
	            		var xmlData = String(file_save.readFileSync(rootPath + "/libraries/ThirdParty/" + libDir[i] + "/" + xmlDir[j]));
	            		try {
		        			xmlData = xmlData.replace(/\.\.\/\.\.\/blocks\/company\//g, "libraries/ThirdParty/" + libDir[i] + "/block/");
		        			xmlData = xmlData.replace(/\.\.\/\.\.\/generators\/arduino\/company\//g, "libraries/ThirdParty/" + libDir[i] + "/generator/");
		        	 		file_save.writeFileSync(rootPath + "/libraries/ThirdParty/" + libDir[i] + "/" + xmlDir[j], xmlData);
		        	 	} catch(e) {
		        			console.log(e);
		        		}
	          		}
	        	}
	      	}
	    }
	} catch(e) {
		console.log(e);
	}
	window.location.reload();
}

function manageLibraries() {
	layui.use(['layer','form', 'table', 'element'], function(){
	    var layer = layui.layer;
	    var element = layui.element;
	    layer.open({
	        type: 1,
	        title: '管理库',
	        area: ['90%','80%'],
	        content: $('#import-library'),
	        closeBtn: 1,
	        resize: false,
	        fixed: true,
	        offset: 'auto',
	        success: function (layero, index) {
	        	try{
	        		var now_page = document.getElementById(layero.selector.replace("#", ""));
	        		now_page.style.maxWidth = "800px";
	        		var now_height = document.documentElement.clientHeight;
	    			var now_width = document.documentElement.clientWidth;
	    			now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
	    			now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
	        	} catch(e) {
	        		console.log(e);
	        	}
	        },
	        end: function() {
	          document.getElementById('import-library').style.display = 'none';
	        }
	    });
	    var table = layui.table;
	    
	    var libArr = [];
	    try {
		    var rootPath = require('path').resolve(__dirname);
		    var libDir = file_save.readdirSync(rootPath + "\\libraries\\ThirdParty\\");
		    for (var i = 0; i < libDir.length; i++) {
		      	if (file_save.existsSync(rootPath + "\\libraries\\ThirdParty\\" + libDir[i] + "\\")) {
		      		//读取xml
		        	var xmlDir = file_save.readdirSync(rootPath + "\\libraries\\ThirdParty\\" + libDir[i] + "\\");
		        	for (var j = 0; j < xmlDir.length; j++) {
		          		if (xmlDir[j].toLowerCase().indexOf(".xml") != -1) {
		            		var libObj = {};
		            		libObj.path = rootPath + "\\libraries\\ThirdParty\\" + libDir[i] + "\\";
		            		libArr.push(libObj);
		            		break;
		          		}
		        	}
		      	}
		    }
		} catch(e) {
		    console.log(e);
		}
	    
	    table.render({
	    	id: 'cloud-libs-table',
		    elem: '#import-library-page',
		    data: libArr,
		    toolbar: '#manage-library-toolbar',
		    defaultToolbar:[],
		    title: '管理库',
		    cols: [[
		      	{type: 'checkbox', width:"10%", unresize:false, align: "center"},
		      	{field:'path', title:'路径', width:"90%", unresize:false, align: "left"}
		    ]],
		    limit: 1000
		});
		//头工具栏事件
	    table.on('toolbar(import-library-page)', function(obj){
	      	var checkStatus = table.checkStatus(obj.config.id);
	      	switch(obj.event){
	        	case 'del':
		          	var checkedJsonData = checkStatus.data;
		          	for (var i = 0; i < checkedJsonData.length; i++) {
		          		deleteFolder(checkedJsonData[i].path);
		          	}
		          	loadLibraries();
		          	break;
	      	};
	    });
	}); 
}