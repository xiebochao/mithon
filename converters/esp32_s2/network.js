'use strict';

pbc.moduleFunctionD.get('mixgoce')['do_connect'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var name = py2block.convert(args[0]);
    var password = py2block.convert(args[1]);
    return [block("iot_wifi_connect", func.lineno, {}, {
        "WIFINAME": name,
        "PASSWORD": password
    }, {
        "inline": "true"
    })];
}
