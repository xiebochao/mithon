if (!Mixly_20_environment) throw false;

var companyBlockXml = "";
var myBlockXml = "";
//加载公司库的xml并处理block/xxx.js
try {
    var rootPath = require('path').resolve(__dirname);
    if (file_save.existsSync(rootPath + "\\libraries\\ThirdParty\\")) {
      var libDir = file_save.readdirSync(rootPath + "\\libraries\\ThirdParty\\");
      for (var i = 0; i < libDir.length; i++) {
        	if (file_save.existsSync(rootPath + "\\libraries\\ThirdParty\\" + libDir[i] + "\\") 
            && file_save.statSync(rootPath + "\\libraries\\ThirdParty\\" + libDir[i] + "\\").isDirectory()) {
        		//读取xml
          	var xmlDir = file_save.readdirSync(rootPath + "\\libraries\\ThirdParty\\" + libDir[i] + "\\");
          	for (var j = 0; j < xmlDir.length; j++) {
            		if (xmlDir[j].toLowerCase().indexOf(".xml") != -1) {
              		var xmlData = String(file_save.readFileSync(rootPath + "\\libraries\\ThirdParty\\" + libDir[i] + "\\" + xmlDir[j]));
              		try {
  	        	 		$('#toolbox').append(xmlData);
  	        	 	} catch(e) {
  	        			console.log(e);
  	        		}
            		}
          	}
        	}
      }
    }
} catch(e) {
	console.log(e);
}
