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

pbc.moduleFunctionD.get('wifi.radio')['connect'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var name = py2block.convert(args[0]);
    var password = py2block.convert(args[1]);
    return [block("WIFI_RADIO_CONNECT", func.lineno, {}, {
        "USERNAME": name,
        "PASSWORD": password
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('wifi')['reset'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("WIFI_RESET", func.lineno, {}, {}, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['publish'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 4 && args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var topic = py2block.convert(args[0].right);
    var msg = py2block.convert(args[1]);
    if (args.length == 4) {
        var location = py2block.convert(args[2]);
        var retain = py2block.convert(args[2]);
        var qos = py2block.convert(args[3]);
        return [block("IOT_EMQX_PUBLISH_MORE", func.lineno, {}, {
            "TOPIC": topic,
            "MSG": msg,
            "LOCATION": location,
            "RETAIN": retain,
            "QOS": qos
        }, {
            "inline": "true"
        })];
    } else {
        return [block("IOT_EMQX_PUBLISH", func.lineno, {}, {
            "TOPIC": topic,
            "MSG": msg
        }, {
            "inline": "true"
        })];
    }
}

pbc.moduleFunctionD.get('mqtt_client')['subscribe'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2 && args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var topic = py2block.convert(args[0].right);
    if (args.length == 2) {
        var qos = py2block.convert(args[1]);
        return [block("IOT_EMQX_SUBSCRIBE_MORE", func.lineno, {}, {
            "TOPIC": topic,
            "QOS": qos
        }, {
            "inline": "true"
        })];
    } else {
        return [block("IOT_EMQX_SUBSCRIBE", func.lineno, {}, {
            "TOPIC": topic
        }, {
            "inline": "true"
        })];
    }
}

pbc.moduleFunctionD.get('mqtt_client')['unsubscribe'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var topic = py2block.convert(args[0].right);
    return [block("IOT_EMQX_UNSUBSCRIBE", func.lineno, {}, {
        "TOPIC": topic
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['loop'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var timeout = py2block.convert(args[0]);
    return [block("IOT_EMQX_LOOP", func.lineno, {}, {
        "TIMEOUT": timeout
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['connect'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("IOT_EMQX_CONNECT", func.lineno, {}, {}, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['disconnect'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("IOT_EMQX_DISCONNECT", func.lineno, {}, {}, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['is_connect'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0 && args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    return block("IOT_EMQX_IS_CONNECT", func.lineno, {}, {}, {
        "inline": "true"
    });
}

pbc.moduleFunctionD.get('mqtt_client')['reconnect'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("IOT_EMQX_RECONNECT", func.lineno, {}, {}, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['ping'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return block("IOT_EMQX_PING", func.lineno, {}, {}, {
        "inline": "true"
    });
}

pbc.moduleFunctionD.get('mqtt_client')['enable_logger'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var level = py2block.convert(args[0].right);
    return [block("IOT_EMQX_ENABLE_LOGGER", func.lineno, {}, {
        "LEVEL": level
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['add_topic_callback'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var topic = py2block.convert(args[0].right);
    var method = py2block.convert(args[1]);
    return [block("IOT_EMQX_ADD_TOPIC_CALLBACK", func.lineno, {}, {
        "TOPIC": topic,
        "METHOD": method
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['remove_topic_callback'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var topic = py2block.convert(args[0].right);
    return [block("IOT_EMQX_REMOVE_TOPIC_CALLBACK", func.lineno, {}, {
        "TOPIC": topic
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['username_pw_set'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var name = py2block.convert(args[0]);
    var password = py2block.convert(args[1]);
    return [block("IOT_EMQX_USERNAME_PW_SET", func.lineno, {}, {
        "USERNAME": name,
        "PASSWORD": password
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mqtt_client')['deinit'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("IOT_EMQX_DEINIT", func.lineno, {}, {}, {
        "inline": "true"
    })];
}