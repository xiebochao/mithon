function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0].replaceAll("@","=")] = hash[1].replaceAll("@","=");
    }
    return myJson;
}

function getQueryObject(url) {
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
//console.log(window.location.href);
var href_data = decodeURIComponent(window.location.href);
href_data = href_data.substring(href_data.indexOf("?")+1, href_data.length);
var board_config = getUrlVars(href_data);
//var board_config = getQueryObject();
console.log(board_config);
