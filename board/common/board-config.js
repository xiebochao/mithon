var MixlyUrl = {};

MixlyUrl.BOARD_CONFIG = null;

/**
* @ function url转json
* @ description 输入url，返回json
* @ param url {String} 输入的url字符串
* @ return object
*/
MixlyUrl.getUrlVars = function (url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        try {
            var hash0 = hash[0].replaceAll("@", "=");
            hash0 = hash0.replaceAll("$", "&");
            var hash1 = hash[1].replaceAll("@", "=");
            hash1 = hash1.replaceAll("$", "&");
            myJson[hash0] = hash1;
        } catch(e) {
            console.log(e);
            myJson[hash[0]] = hash[1];
        }
    }
    return myJson;
}

/**
* @ function url转json
* @ description 输入url，返回json
* @ param url {String} 输入的url字符串
* @ return object
*/
MixlyUrl.getQueryObject = function (url) {
    url = url == null ? window.location.href : url;
    var search = url.substring(url.lastIndexOf("?") + 1);
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, function (rs, $1, $2) {
        var name = decodeURIComponent($1);
        var val = decodeURIComponent($2);               
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
* @ function 获取板卡配置信息
* @ description 返回当前板卡的配置信息
* @ return object
*/
MixlyUrl.getBoardConfig = function () {
    var href = "";
    try {
        href = window.location.href.replaceAll("#", "");
    } catch(e) {
        console.log(e);
        href = window.location.href;
    }
    var href_data = decodeURIComponent(href);
    href_data = href_data.substring(href_data.indexOf("?")+1, href_data.length);
    var board_config = MixlyUrl.getUrlVars(href_data);
    return board_config;
}

//json转url参数
MixlyUrl.parseParam = function(param, key) {
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
            paramStr += '&' + MixlyUrl.parseParam(this, k);
        });
    }
    return paramStr.substr(1);
};

if (typeof(boardConfig) == "undefined") {
    MixlyUrl.BOARD_CONFIG = MixlyUrl.getBoardConfig();
} else {
    MixlyUrl.BOARD_CONFIG = MixlyUrl.getUrlVars(decodeURIComponent(MixlyUrl.parseParam(boardConfig)));
    var boardUrl = MixlyUrl.getBoardConfig();
    if (boardUrl.hasOwnProperty("BoardName")) {
        MixlyUrl.BOARD_CONFIG["BoardName"] = boardUrl["BoardName"];
    }
    if (boardUrl.hasOwnProperty("ThirdPartyBoard")) {
        MixlyUrl.BOARD_CONFIG["ThirdPartyBoard"] = boardUrl["ThirdPartyBoard"];
    }
}
console.log(MixlyUrl.BOARD_CONFIG);