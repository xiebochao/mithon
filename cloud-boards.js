if (Mixly_20_environment != 0) throw false;

var request = require("request");
const https = require("https");
const mixlyPath = require("path");
const AdmZip = require('adm-zip-iconv');
const indexPath = mixlyPath.resolve(__dirname);

var defaultUrl = '';
if (MixlyConfig.softwareConfig.hasOwnProperty("board.url")) {
	defaultUrl = MixlyConfig.softwareConfig["board.url"];
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
		fs.writeFileSync(path, urlJson);
	} catch(e) {
		console.log(e);
	}
}

function readUrlArr(path) {
	var urlArr = [];
	var data = null;
	try {
		if (!fs.existsSync(path)) {
	    	urlArr.push(defaultUrl);
	    	writeUrlArr(urlArr, path);
	        return urlArr;
	    }
		data = fs.readFileSync(path, "utf-8");

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

var cloudLibsUrl = readUrlArr(indexPath + '/board/ThirdParty/cloudBoardsUrl.json');

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
				id: 'cloud-boards-table',
				elem: '#import-board-page',
				data: cloudLibsArray,
				toolbar: '#import-board-toolbar',
				defaultToolbar:[
					{
					  	title: '设置',
					  	layEvent: 'LAYTABLE_SET',
					  	icon: 'layui-icon-set'
					}
				],
				title: '云端板卡',
				cols: [[
				  	{type: 'radio', width:"5%", unresize:false, align: "center"},
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

function open_board() {
  	layui.use(['layer','form', 'table', 'element'], function(){
	    var layer = layui.layer;
	    var element = layui.element;
	    layer.open({
	        type: 1,
	        title: '导入板卡',
	        area: ['90%','80%'],
	        content: $('#import-board'),
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
	          document.getElementById('import-board').style.display = 'none';
	        }
	    });
	    var table = layui.table;

	    table.render({
	    	id: 'cloud-boards-table',
		    elem: '#import-board-page',
		    data: [],
		    toolbar: '#import-board-toolbar',
		    defaultToolbar:[
			    {
			      	title: '设置',
			      	layEvent: 'LAYTABLE_SET',
			      	icon: 'layui-icon-set'
			    }
		    ],
		    title: '云端板卡',
		    cols: [[
		      	{type: 'radio', width:"5%", unresize:false, align: "center"},
		      	{field:'name', title:'名称', width:"30%", sort: true, unresize:false, align: "center"},
		      	{field:'version', title:'版本', width:"20%", unresize:false, align: "center"},
		      	{field:'desc', title:'介绍', width:"45%", unresize:false, align: "center"}
		    ]],
		    limit: 1000
		});

		refreshTable(table);
	    
	    //头工具栏事件
	    table.on('toolbar(import-board-page)', function(obj){
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
				        id: "cloud-boards-download-content",
				        title: '进度',
				        area: ['80%', '70%'],
				        content: $('#cloud-boards-download-form'),
				        resize: false,
				        fixed: true,
				        //offset: 'auto',
				        success: function(layero){
				    		try{
				          		document.getElementById("cloud-boards-download-content").style.position = "absolute";
				          		document.getElementById("cloud-boards-download-content").style.left = "0";
				          		document.getElementById("cloud-boards-download-content").style.top = "43px";
				          		document.getElementById("cloud-boards-download-content").style.bottom = "0px";
				          		document.getElementById("cloud-boards-download-content").style.width = "100%";
				          		document.getElementById("cloud-boards-download-content").style.height = "auto";
					    		var now_page = document.getElementById(layero.selector.replace("#", ""));
					    		now_page.style.maxWidth = "700px";
					    		now_page.style.maxHeight = "400px";
					    		var now_height = document.documentElement.clientHeight;
								var now_width = document.documentElement.clientWidth;
								now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
								now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
								document.getElementById('cloud-boards-download-message').value = "";
								try {
									if (!fs.existsSync(indexPath + '/board/ThirdParty/'))
										fs.mkdirSync(indexPath + '/board/ThirdParty/');
									cloudDownload(indexPath + '/board/ThirdParty/', element);
								} catch(e) {
									console.log(e);
									cloudDownload(indexPath + '/board/ThirdParty/', element);
								}
					    	} catch(e) {
					    		console.log(e);
					    	}
				        },
				        cancel: function(index, layero){ 
				        	
						},
			          	end: function() {
			            	document.getElementById('cloud-boards-download-form').style.display = 'none';
			          	}
			      	});
	          	} else {
	          		layer.msg('请选择至少一块云端板卡！', {
				        time: 2000
				    });
	          	}
	        	break;
	        case 'local-import':
	          	get_index_File();
	        	break;

	        case 'LAYTABLE_SET':
	          	layer.open({
			        type: 1,
			        id: "cloud-boards-url-content",
			        title: '编辑url',
			        area: ['80%', '70%'],
			        content: $('#cloud-boards-url-form'),
			        resize: false,
			        fixed: true,
			        //offset: 'auto',
			        success: function(layero){
			          	try{
			          		document.getElementById("cloud-boards-url-content").style.position = "absolute";
			          		document.getElementById("cloud-boards-url-content").style.left = "0";
			          		document.getElementById("cloud-boards-url-content").style.top = "43px";
			          		document.getElementById("cloud-boards-url-content").style.bottom = "0px";
			          		document.getElementById("cloud-boards-url-content").style.width = "100%";
			          		document.getElementById("cloud-boards-url-content").style.height = "auto";
				    		var now_page = document.getElementById(layero.selector.replace("#", ""));
				    		now_page.style.maxWidth = "700px";
				    		now_page.style.maxHeight = "300px";
				    		var now_height = document.documentElement.clientHeight;
							var now_width = document.documentElement.clientWidth;
							now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
							now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
							document.getElementById('cloud-boards-url-data').value = "";
							for (var i = 0; i < cloudLibsUrl.length; i++) {
								if (cloudLibsUrl[i] == defaultUrl) {
									continue;
								}
								document.getElementById('cloud-boards-url-data').value += cloudLibsUrl[i] + "\n";
							}
							//layer.setTop(layero);
							//cloud_libs_url_text.resize();
				    	} catch(e) {
				    		console.log(e);
				    	}
			        },
			        cancel: function(index, layero){ 
			        	var urlText = document.getElementById('cloud-boards-url-data').value;
					  	cloudLibsUrl = [];
					  	cloudLibsUrl.push(defaultUrl);
					  	var urlArr = getUrl(urlText);
					  	if (urlArr)
					  		cloudLibsUrl = cloudLibsUrl.concat(getUrl(urlText));
					  	writeUrlArr(cloudLibsUrl, indexPath + '/board/ThirdParty/cloudBoardsUrl.json');
					  	refreshTable(table);
					},
		          	end: function() {
		            	document.getElementById('cloud-boards-url-form').style.display = 'none';
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
		document.getElementById('cloud-boards-download-message').value += "request: " + Src + " return status: " + res.statusCode + "\n";
		document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;
		//var contentLength = parseInt(res.headers['content-length']);
		var contentType = res.headers['content-type'];
		var contentTLen = parseInt(res.headers['content-length']);
		var fileBuff = [];
		var downloadedLen = 0;
		var oldPercent = 0;
		var nowPercent = 0;
		res.on('data', function (chunk) {
			var buffer = new Buffer(chunk);
			fileBuff.push(buffer);
			downloadedLen += buffer.length;

			//element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100 + downloadedLen/contentTLen*1/libsUrlList.length*100) + '%');		
			nowPercent = parseInt(cloudLibsNum/libsUrlList.length*100 + downloadedLen/contentTLen*1/libsUrlList.length*100);
			if (nowPercent > oldPercent) {
				oldPercent = nowPercent;
				element.progress('download-percent',  nowPercent + '%');
			}
			//console.log(parseInt(cloudLibsNum/libsUrlList.length*100 + downloadedLen/contentTLen*1/libsUrlList.length*100));
			//document.getElementById('cloud-boards-download-message').value += parseInt(cloudLibsNum/libsUrlList.length*100 + downloadedLen/contentTLen*1/libsUrlList.length*100) + "\n";
			//document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;
		});
		res.on('end', function() {
			console.log("end downloading " + Src);
			document.getElementById('cloud-boards-download-message').value += "end downloading " + Src + "\n";
			document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;

			var totalBuff = Buffer.concat(fileBuff);
			console.log("totalBuff.length = " + totalBuff.length + " " + "contentType = " + contentType);
			document.getElementById('cloud-boards-download-message').value += "totalBuff.length = " + totalBuff.length + " " + "contentType = " + contentType + "\n";
			document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;
			document.getElementById('cloud-boards-download-message').value += "解压中...\n";
			document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;
			setTimeout(function() {
				try {
					fs.unlinkSync(dirName + "/" + fileName);
				} catch(e) {
					console.log(e);
				}
				fs.appendFile(dirName + "/" + fileName, totalBuff, function(err){
					if (err) {
						console.log(err);
					} else {
						try {
							const unzip = new AdmZip(dirName + "/" + fileName, 'GBK');
							unzip.extractAllTo(dirName + "/", true);
							fs.unlinkSync(dirName + "/" + fileName);
						} catch(e) {
							console.log(e);
						}
					}
					cloudLibsNum++;
					element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
					if (cloudLibsNum == libsUrlList.length) {
						console.log("finish! return 1");
						if (document.getElementById('cloud-boards-download-form').style.display != "none") {
							window.location.reload();
						}
					}
				});	
			}, 1000);
		});
	};

	return callback;
}

var startDownloadTask = function(Src, dirName, index, element) {
	console.log("start downloading " + Src);
	var req = https.request(Src, getHttpReqCallback(Src, dirName, index, element));
	req.on('error', function(e){
	  	console.log("request " + Src + " error, try again");
	  	document.getElementById('cloud-boards-download-message').value += "request " + Src + " error, try again\n";
		document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;
	  	startDownloadTask(Src, dirName, index, element);
	});
	req.setTimeout(5000, function() {
      	console.log("reqeust " + Src + " timeout, abort this reqeust");
      	document.getElementById('cloud-boards-download-message').value += "reqeust " + Src + " timeout, abort this reqeust\n";
		document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;
      	//req.abort();
      	req.destroy();
      	cloudLibsNum++;
      	element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
		if (cloudLibsNum == libsUrlList.length) {
			console.log("finish! return 0");
			document.getElementById('cloud-boards-download-message').value += "reqeust " + Src + " timeout, abort this reqeust" + "\n";
			document.getElementById('cloud-boards-download-message').scrollTop = document.getElementById('cloud-boards-download-message').scrollHeight;
			if (document.getElementById('cloud-boards-download-form').style.display != "none") {
				window.location.reload();
			}
		}
    })
	req.end();
}

function cloudDownload(path, element) {
	cloudLibsNum = 0;
	element.progress('download-percent', parseInt(cloudLibsNum/libsUrlList.length*100) + '%');
	libsUrlList.forEach(function(item, index, array) {
		startDownloadTask(item, path, index, element);
	})
}