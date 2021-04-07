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
    var href_data = decodeURIComponent(window.location.href);
    href_data = href_data.substring(href_data.indexOf("?")+1, href_data.length);
    var board_config = MixlyUrl.getUrlVars(href_data);
    return board_config;
}

MixlyUrl.BOARD_CONFIG = MixlyUrl.getBoardConfig();
console.log(MixlyUrl.BOARD_CONFIG);