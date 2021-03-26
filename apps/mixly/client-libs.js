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
var defaultUrl = 'https://gitee.com/smilebrightly/git_-test/raw/master/libs.json';
var clientLibsArray = [];

var libsUrlList = [];

var clientLibsNum = 0;

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

var clientLibsUrl = readUrlArr(mixly_20_path+'\\setting\\'+board_config.myBlock+'.json');

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
				clientLibsArray = clientLibsArray.concat(jsonData);
			} catch(e) {
				console.log(e);
			}
        } else {
          console.log(error);
        }
        clientLibsNum++;
        if (clientLibsNum >= clientLibsUrl.length) {
        	table.render({
				id: 'client-libs-table',
				elem: '#import-library-page',
				data: clientLibsArray,
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
	clientLibsNum = 0;
    clientLibsArray = [];
    clientLibsUrl.forEach(function(key){
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
	    	id: 'client-libs-table',
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
				        id: "client-libs-download-content",
				        title: '进度',
				        area: ['80%', '70%'],
				        content: $('#client-libs-download-form'),
				        resize: false,
				        fixed: true,
				        //offset: 'auto',
				        success: function(layero){
				    		try{
				          		document.getElementById("client-libs-download-content").style.position = "absolute";
				          		document.getElementById("client-libs-download-content").style.left = "0";
				          		document.getElementById("client-libs-download-content").style.top = "43px";
				          		document.getElementById("client-libs-download-content").style.bottom = "0px";
				          		document.getElementById("client-libs-download-content").style.width = "100%";
				          		document.getElementById("client-libs-download-content").style.height = "auto";
					    		var now_page = document.getElementById(layero.selector.replace("#", ""));
					    		now_page.style.maxWidth = "700px";
					    		now_page.style.maxHeight = "400px";
					    		var now_height = document.documentElement.clientHeight;
								var now_width = document.documentElement.clientWidth;
								now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
								now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
								document.getElementById('client-libs-download-message').value = "";
								cloudDownload(mixly_20_path+'\\mylib\\', element);
					    	} catch(e) {
					    		console.log(e);
					    	}
				        },
				        cancel: function(index, layero){ 
				        	
						},
			          	end: function() {
			            	document.getElementById('client-libs-download-form').style.display = 'none';
			          	}
			      	});
	          	} else {
	          		layer.msg('请先选择至少一个云端库！', {
				        time: 2000
				    });
	          	}
	        	break;
	        case 'local-import':
	          	load_library_File();
	        	break;

	        case 'LAYTABLE_SET':
	          	layer.open({
			        type: 1,
			        id: "client-libs-url-content",
			        title: '编辑url',
			        area: ['80%', '70%'],
			        content: $('#client-libs-url-form'),
			        resize: false,
			        fixed: true,
			        //offset: 'auto',
			        success: function(layero){
			          	try{
			          		document.getElementById("client-libs-url-content").style.position = "absolute";
			          		document.getElementById("client-libs-url-content").style.left = "0";
			          		document.getElementById("client-libs-url-content").style.top = "43px";
			          		document.getElementById("client-libs-url-content").style.bottom = "0px";
			          		document.getElementById("client-libs-url-content").style.width = "100%";
			          		document.getElementById("client-libs-url-content").style.height = "auto";
				    		var now_page = document.getElementById(layero.selector.replace("#", ""));
				    		now_page.style.maxWidth = "700px";
				    		now_page.style.maxHeight = "300px";
				    		var now_height = document.documentElement.clientHeight;
							var now_width = document.documentElement.clientWidth;
							now_page.style.left = (now_width - now_page.clientWidth)/2 + "px";
							now_page.style.top = (now_height - now_page.clientHeight)/2 + "px";
							document.getElementById('client-libs-url-data').value = "";
							for (var i = 0; i < clientLibsUrl.length; i++) {
								if (clientLibsUrl[i] == defaultUrl) {
									continue;
								}
								document.getElementById('client-libs-url-data').value += clientLibsUrl[i] + "\n";
							}
							//layer.setTop(layero);
							//client_libs_url_text.resize();
				    	} catch(e) {
				    		console.log(e);
				    	}
			        },
			        cancel: function(index, layero){ 
			        	var urlText = document.getElementById('client-libs-url-data').value;
					  	clientLibsUrl = [];
					  	clientLibsUrl.push(defaultUrl);
					  	var urlArr = getUrl(urlText);
					  	if (urlArr)
					  		clientLibsUrl = clientLibsUrl.concat(getUrl(urlText));
					  	writeUrlArr(clientLibsUrl, mixly_20_path+'\\setting\\'+board_config.myBlock+'.json');
					  	refreshTable(table);
					},
		          	end: function() {
		            	document.getElementById('client-libs-url-form').style.display = 'none';
		          	}
		      	});
	        	break;
	      	};
	    });
	    
	    //监听行工具事件
	    table.on('tool(import-library-page)', function(obj){
			var data = obj.data;
			//console.log(obj)
			if(obj.event === 'del') {
				layer.confirm('真的删除行么', function(index){
				  	obj.del();
				  	layer.close(index);
				});
			} else if(obj.event === 'edit') {
				layer.prompt({
				  	formType: 2
				  	,value: data.email
				}, function(value, index){
				  	obj.update({
				    	email: value
				  	});
				  	layer.close(index);
				});
			}
	    });
	}); 
}

function getHttpReqCallback(Src, dirName, index, element) {
	var fileName = mixlyPath.basename(Src);
	var callback = function(res) {
		console.log("request: " + Src + " return status: " + res.statusCode);
		document.getElementById('client-libs-download-message').value += "request: " + Src + " return status: " + res.statusCode + "\n";
		document.getElementById('client-libs-download-message').scrollTop = document.getElementById('client-libs-download-message').scrollHeight;
		//var contentLength = parseInt(res.headers['content-length']);
		var contentType = res.headers['content-type'];
		var fileBuff = [];
		res.on('data', function (chunk) {
			var buffer = new Buffer(chunk);
			fileBuff.push(buffer);
		});
		res.on('end', function() {
			console.log("end downloading " + Src);
			document.getElementById('client-libs-download-message').value += "end downloading " + Src + "\n";
			document.getElementById('client-libs-download-message').scrollTop = document.getElementById('client-libs-download-message').scrollHeight;
			//if (isNaN(contentLength)) {
			//  	console.log(Src + " content length error");
			//  	return;
			//}
			var totalBuff = Buffer.concat(fileBuff);
			console.log("totalBuff.length = " + totalBuff.length + " " + "contentType = " + contentType);
			document.getElementById('client-libs-download-message').value += "totalBuff.length = " + totalBuff.length + " " + "contentType = " + contentType + "\n";
			document.getElementById('client-libs-download-message').scrollTop = document.getElementById('client-libs-download-message').scrollHeight;
			//if (totalBuff.length < contentLength) {
			//  	console.log(Src + " download error, try again");
			//  	startDownloadTask(Src, dirName, index);
			//  	return;
			//}
			if (contentType != "application/zip") {
				console.log("This file is not zip");
				clientLibsNum++;
				element.progress('download-percent', parseInt(clientLibsNum/libsUrlList.length*100) + '%');
				if (clientLibsNum == libsUrlList.length) {
					cloneLibs();
					console.log("finish! return 1");
				}
				return;
			}
			file_save.appendFile(dirName + "/" + fileName, totalBuff, function(err){
				if (err) {
					console.log(err);
				} else {
					try {
						const unzip = new AdmZip(dirName + "/" + fileName, 'GBK');
						unzip.extractAllTo(dirName + "/", true);
					} catch(e) {
						console.log(e);
					}
				}
				clientLibsNum++;
				element.progress('download-percent', parseInt(clientLibsNum/libsUrlList.length*100) + '%');
				if (clientLibsNum == libsUrlList.length) {
					cloneLibs();
					console.log("finish! return 2");
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
	  	startDownloadTask(Src, dirName, index, element);
	});
	req.setTimeout(5 * 1000, function() {
      	console.log("reqeust " + Src + " timeout, abort this reqeust");
      	req.abort();
      	clientLibsNum++;
      	element.progress('download-percent', parseInt(clientLibsNum/libsUrlList.length*100) + '%');
		if (clientLibsNum == libsUrlList.length) {
			cloneLibs();
			console.log("finish! return 0");
			document.getElementById('client-libs-download-message').value += "reqeust " + Src + " timeout, abort this reqeust" + "\n";
			document.getElementById('client-libs-download-message').scrollTop = document.getElementById('client-libs-download-message').scrollHeight;
		}
    })
	req.end();
}

function cloudDownload(path, element) {
	clientLibsNum = 0;
	element.progress('download-percent', parseInt(clientLibsNum/libsUrlList.length*100) + '%');
	libsUrlList.forEach(function(item, index, array) {
		if (item.toLowerCase().indexOf(".zip") != -1) {
			startDownloadTask(item, path, index, element);
		} else {
			clientLibsNum++;
			element.progress('download-percent', parseInt(clientLibsNum/libsUrlList.length*100) + '%');
			if (clientLibsNum == libsUrlList.length) {
				cloneLibs();
				document.getElementById('client-libs-download-message').value += libsUrlList[index] + "无效" + "\n";
				document.getElementById('client-libs-download-message').scrollTop = document.getElementById('client-libs-download-message').scrollHeight;
				console.log("finish! return 3");
			}
		}
	})
}

function cloneLibs() {

}