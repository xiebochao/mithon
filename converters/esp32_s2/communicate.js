pbc.assignD.get('spi')['check_assign'] = function(py2block, node, targets, value) {
    if(value._astname != "Call" || value.func._astname != "Name"){
        return false;
    }
    var funcName = py2block.Name_str(value.func);
    if(funcName === "bytearray" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('spi')['create_block'] = function(py2block, node, targets, value){
    return block("communicate_buffer", node.lineno, {
    }, {
        "data":py2block.convert(value.args[0]),
        "VAR":py2block.convert(targets[0])
    });
}

pbc.assignD.get('I2C')['check_assign'] = function(py2block, node, targets, value) {
    var funcName = py2block.identifier(value.func.attr);
    var moduleName = py2block.identifier(value.func.value);
    if(value._astname === "Call" && funcName === "I2C" && value.keywords.length === 3)
        return true;
    return false;
}

pbc.assignD.get('I2C')['create_block'] = function(py2block, node, targets, value){
    var sdablock = null;
    var sclblock = null;
    var freqblock = null;
    var i2cblock=py2block.convert(targets[0])
    for (var i = 0; i < value.keywords.length; i++) {
        var param = value.keywords[i];
        var key = py2block.identifier(param.arg);
        if (key === "sda") {
            pbc.pinType = "pins_digital_pin";
            sdablock = py2block.convert(param.value);
            pbc.pinType = null;
        } else if (key === "scl") {
            pbc.pinType = "pins_digital_pin";
            sclblock = py2block.convert(param.value);
            pbc.pinType = null;
        } else if (key === "frequency") {
            freqblock = py2block.convert(param.value);
        }
    }
    if (sdablock != null && sclblock != null && freqblock != null) {
        return block("communicate_i2c_init", node.lineno, {}, {
            "SUB":i2cblock,
            'RX': sdablock,
            'TX': sclblock,
            "freq": freqblock
        }, {
            "inline": "true"
        });
    }
}

pbc.objectFunctionD.get('try_lock')['I2C_SPI'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    if(func.value.id.v.toLowerCase().indexOf('spi') != -1)
    {
        return block("communicate_spi_try_lock", func.lineno, {}, {
            "VAR": objblock,
        }, {
            "inline": "true"
        });
    }
    else if(func.value.id.v.toLowerCase().indexOf('i2c') != -1)
    {
        return block("communicate_i2c_try_lock", func.lineno, {}, {
            "VAR": objblock,
        }, {
            "inline": "true"
        });
    }
    else
    {
        return block("communicate_try_lock", func.lineno, {}, {
            "VAR": objblock,
        }, {
            "inline": "true"
        });
    }
}

pbc.objectFunctionD.get('scan')['I2C'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    return block("communicate_i2c_scan", func.lineno, {}, {
        "VAR": objblock,
    }, {
        "inline": "true"
    });
}

pbc.objectFunctionD.get('writeto')['I2C'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    var adblock = py2block.convert(args[0]);
    var datablock = py2block.convert(args[1].args[0]);
    return [block("communicate_i2c_write", func.lineno, {}, {
        "address": adblock,
        "data": datablock,
        "VAR": objblock
    }, {
        "inline": "true"
    })];
}

pbc.objectFunctionD.get('readfrom_into')['I2C'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 4) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    var adblock = py2block.convert(args[0]);
    var datablock = py2block.convert(args[1].args[0]);
    var lengthblock = py2block.convert(args[3]);
    return [block("communicate_i2c_read", func.lineno, {}, {
        "address": adblock,
        "data": datablock,
        "length": lengthblock,
        "VAR": objblock
    }, {
        "inline": "true"
    })];
}

pbc.objectFunctionD.get('writeto_then_readfrom')['SPI'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (keywords.length !== 3) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    var addressblock = py2block.convert(keywords[0].value);
    var writeblock = py2block.convert(keywords[1].value.args[0]);
    var readblock = py2block.convert(keywords[2].value.args[0]);
    return [block("communicate_i2c_writeto_then_readfrom", func.lineno, {}, {
        "address": addressblock,
        "write": writeblock,
        "read": readblock,
        "VAR": objblock
    }, {
        "inline": "true"
    })];
}

pbc.objectFunctionD.get('unlock')['I2C_SPI'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    if(func.value.id.v.toLowerCase().indexOf('spi') != -1)
    {
        return [block("communicate_spi_unlock", func.lineno, {}, {
            "VAR": objblock,
        }, {
            "inline": "true"
        })];
    }
    else if(func.value.id.v.toLowerCase().indexOf('i2c') != -1)
    {
        return [block("communicate_i2c_unlock", func.lineno, {}, {
            "VAR": objblock,
        }, {
            "inline": "true"
        })];
    }
    else
    {
        return [block("communicate_unlock", func.lineno, {}, {
            "VAR": objblock,
        }, {
            "inline": "true"
        })];
    }
}

pbc.assignD.get('SPI')['check_assign'] = function(py2block, node, targets, value) {
    var funcName = py2block.identifier(value.func.attr);
    var moduleName = py2block.Name_str(value.func.value);
    if(value._astname === "Call" && moduleName === "busio"
        && funcName === "SPI" && value.keywords.length === 3)
        return true;
    return false;
}

pbc.assignD.get('SPI')['create_block'] = function(py2block, node, targets, value){
    var astname = value.keywords[0]._astname;
    var sckblock = null;
    var mosiblock = null;
    var misoblock = null;
    var spiblock=py2block.convert(targets[0]);
    for (var i = 0; i < value.keywords.length; i++) {
        var param = value.keywords[i];
        var key = py2block.identifier(param.arg);
        if (key === "clock") {
            pbc.pinType = "pins_digital_pin";
            sckblock = py2block.convert(param.value);
            pbc.pinType = null;
        } else if (key === "MOSI") {
            pbc.pinType = "pins_digital_pin";
            mosiblock = py2block.convert(param.value);
            pbc.pinType = null;
        } else if (key === "MISO") {
            pbc.pinType = "pins_digital_pin";
            misoblock = py2block.convert(param.value);
            pbc.pinType = null;
        }
    }
    if (sckblock != null && mosiblock != null && misoblock != null) {
        return block("communicate_spi_init", node.lineno, {}, {
            "VAR":spiblock,
            "sck": sckblock,
            "mosi": mosiblock,
            "miso": misoblock,
        }, {
            "inline": "true"
        });
    }
}

pbc.objectFunctionD.get('configure')["SPI"] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (keywords.length != 3) {
        throw new Error("Incorrect number of arguments");
    }
    var astname = keywords[0]._astname;
    var freqblock = null;
    var polarityblock = null;
    var phaseblock = null;
    var spiblock=py2block.convert(func.value);
    for (var i = 0; i < keywords.length; i++) {
        var param = keywords[i];
        var key = py2block.identifier(param.arg);
        if (key === "baudrate") {
            freqblock = py2block.convert(param.value);
        } else if (key === "polarity") {
            polarityblock = py2block.convert(param.value);
        } else if (key === "phase") {
            phaseblock = py2block.convert(param.value);
        }
    }
    if (freqblock != null && polarityblock != null && phaseblock != null) {
        return [block("communicate_spi_configure", node.lineno, {}, {
            "VAR":spiblock,
            "freq": freqblock,
            "polarity": polarityblock,
            "phase": phaseblock,
        }, {
            "inline": "true"
        })];
    }
}

pbc.objectFunctionD.get('write')['SPI'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    var datablock = py2block.convert(args[0].args[0]);
    return [block("communicate_spi_write", func.lineno, {}, {
        "data": datablock,
        "VAR": objblock
    }, {
        "inline": "true"
    })];
}

pbc.objectFunctionD.get('readinto')['SPI'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 3) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    var datablock = py2block.convert(args[0].args[0]);
    var lengthblock = py2block.convert(args[2]);
    return [block("communicate_spi_read", func.lineno, {}, {
        "data": datablock,
        "length": lengthblock,
        "VAR": objblock
    }, {
        "inline": "true"
    })];
}

pbc.objectFunctionD.get('write_readinto')['SPI'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (keywords.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    var writeblock = py2block.convert(keywords[0].value.args[0]);
    var readblock = py2block.convert(keywords[1].value.args[0]);
    return [block("communicate_spi_write_readinto", func.lineno, {}, {
        "write": writeblock,
        "read": readblock,
        "VAR": objblock
    }, {
        "inline": "true"
    })];
}

pbc.assignD.get('OneWire')['check_assign'] = function(py2block, node, targets, value) {
    if(value._astname != "Call" || value.func._astname != "Attribute" || value.func.value._astname != "Name"){
        return false;
    }
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if(value._astname === "Call" && funcName === "OneWire" && value.args.length === 1)
        return true;
    return false;
}


pbc.assignD.get('OneWire')['create_block'] = function(py2block, node, targets, value){
    pbc.pinType = "pins_digital_pin";
    var pinblock = py2block.convert(value.args[0]);
    pbc.pinType = null;
    return block("communicate_ow_init", node.lineno, {
    }, {
        "BUS":pinblock,
        "VAR":py2block.convert(targets[0]),
    });
}

pbc.objectFunctionD.get('read_bit')['OneWire'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    return block("communicate_ow_read", func.lineno, {}, {
        "VAR": objblock,
    }, {
        "inline": "true"
    });
}

pbc.objectFunctionD.get('reset')['OneWire'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    return [block("communicate_ow_reset", func.lineno, {}, {
        "VAR": objblock,
    }, {
        "inline": "true"
    })];
}

pbc.objectFunctionD.get('write_bit')['OneWire'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    var byteblock = py2block.convert(args[0]);
    return [block("communicate_ow_write", func.lineno, {
        'op':'write'
    }, {
        "VAR": objblock,
        "byte": byteblock
    }, {
        "inline": "true"
    })];
}

pbc.objectFunctionD.get('resume')['irremote'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    //var objblock = py2block.convert(func.value);
    pbc.pinType = "pins_pwm_pin";
    var adblock = py2block.convert(args[0]);
    pbc.pinType = "pins_callback";
    var datablock = py2block.convert(args[1]);
    pbc.pinType=null;
    return [block("communicate_ir_recv", func.lineno, {}, {
        "PIN": adblock,
        "SUB": datablock,
        //"VAR": objblock
    }, {
        "inline": "true"
    })];
}
