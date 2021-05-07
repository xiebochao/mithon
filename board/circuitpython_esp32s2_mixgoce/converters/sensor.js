'use strict';

function pressed_converter (mode) {
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
        pbc.pinType = "pins_button";
        var objblock = py2block.convert(btn);
        pbc.pinType = null;
        return block(mode, func.lineno, {}, {
            "btn": objblock
        }, {
            "inline": "true"
        });
    }
    return converter;
}


pbc.moduleFunctionD.get('mixgoce.button_B1')['is_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_B2')['is_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A1')['is_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A2')['is_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A3')['is_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A4')['is_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_B1')['was_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_B2')['was_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A1')['was_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A2')['was_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A3')['was_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 
pbc.moduleFunctionD.get('mixgoce.button_A4')['was_pressed'] = pressed_converter('sensor_mixgoce_button_is_pressed'); 


function getpresses_converter (mode) {
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 1) {
            throw new Error("Incorrect number of arguments");
        }
        var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
        pbc.pinType = "pins_button";
        var objblock = py2block.convert(btn);        
        pbc.pinType = null;
        var argblock = py2block.convert(args[0]);
        return block(mode, func.lineno, {}, {
            "btn": objblock,
            'VAR': argblock
        }, {
            "inline": "true"
        });
    }
    return converter;
}
pbc.moduleFunctionD.get('mixgoce.button_B1')['get_presses'] = getpresses_converter('sensor_mixgoce_button_get_presses'); 
pbc.moduleFunctionD.get('mixgoce.button_B2')['get_presses'] = getpresses_converter('sensor_mixgoce_button_get_presses'); 
pbc.moduleFunctionD.get('mixgoce.button_A1')['get_presses'] = getpresses_converter('sensor_mixgoce_button_get_presses'); 
pbc.moduleFunctionD.get('mixgoce.button_A2')['get_presses'] = getpresses_converter('sensor_mixgoce_button_get_presses'); 
pbc.moduleFunctionD.get('mixgoce.button_A3')['get_presses'] = getpresses_converter('sensor_mixgoce_button_get_presses'); 
pbc.moduleFunctionD.get('mixgoce.button_A4')['get_presses'] = getpresses_converter('sensor_mixgoce_button_get_presses'); 


pbc.moduleFunctionD.get('mixgoce.touch_T1')['is_touched'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
            var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
    pbc.pin
    pbc.pinType = "number1";
    var objblock = py2block.convert(btn);
    pbc.pinType = null;
    return block("sensor_mixgoce_pin_pressed", func.lineno, {}, {
        "button":objblock
    }, {
        "inline": "true"
    });
}
pbc.moduleFunctionD.get('mixgoce.touch_T2')['is_touched'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
            var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
    pbc.pin
    pbc.pinType = "number1";
    var objblock = py2block.convert(btn);
    pbc.pinType = null;
    return block("sensor_mixgoce_pin_pressed", func.lineno, {}, {
        "button":objblock
    }, {
        "inline": "true"
    });
}
pbc.moduleFunctionD.get('mixgoce.touch_T3')['is_touched'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
            var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
    pbc.pin
    pbc.pinType = "number1";
    var objblock = py2block.convert(btn);
    pbc.pinType = null;
    return block("sensor_mixgoce_pin_pressed", func.lineno, {}, {
        "button":objblock
    }, {
        "inline": "true"
    });
}
pbc.moduleFunctionD.get('mixgoce.touch_T4')['is_touched'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
            var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
    pbc.pin
    pbc.pinType = "number1";
    var objblock = py2block.convert(btn);
    pbc.pinType = null;
    return block("sensor_mixgoce_pin_pressed", func.lineno, {}, {
        "button":objblock
    }, {
        "inline": "true"
    });
}


pbc.moduleFunctionD.get('mixgoce')['infrared_near'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    if (keywords.length == 2) {
        var freq = py2block.convert(keywords[0].value);
        var dc = py2block.convert(keywords[1].value);
        return block("sensor_mixgoce_pin_near_more", func.lineno, {"direction":'left'}, {
            "freq": freq,
            "dc": dc
        }, {
            "inline": "true"
        });
    } else {
        return block("sensor_mixgoce_pin_near", func.lineno, {"direction":'left'}, {}, {
            "inline": "true"
        });
    }
}

pbc.moduleFunctionD.get('mixgoce')['get_brightness'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return block("sensor_mixgoce_light", func.lineno, {}, {}, {
        "inline": "true"
    });

}

pbc.moduleFunctionD.get('mixgoce')['get_soundlevel'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return block("sensor_mixgoce_sound", func.lineno, {}, {}, {
        "inline": "true"
    });
}

pbc.moduleFunctionD.get('mixgoce')['get_temperature'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return block("sensor_mixgoce_temperature_lm35", func.lineno, {}, {}, {
        "inline": "true"
    });
}

pbc.moduleAttrD.get('mixgoce.msa')['acceleration'] = function (node, module, attr) {
    return block("sensor_MSA301_get_acceleration", node.lineno, {
        "key": "values"
    });
}

pbc.globalFunctionD['RTC_set_datetime'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 9) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("RTC_set_datetime", func.lineno, {}, {
        'year': py2block.convert(args[0]),
        'month': py2block.convert(args[1]),
        'day': py2block.convert(args[2]),
        'hour': py2block.convert(args[3]),
        'minute': py2block.convert(args[4]),
        'second': py2block.convert(args[5]),
        'weekday': py2block.convert(args[6]),
        'yearday': py2block.convert(args[7]),
        'isdist': py2block.convert(args[8])
    }, {
        "inline": "False"
    })];
}

pbc.moduleAttrD.get('mixgoce.rtc_clock')['datetime'] = function (node, module, attr) {
    return block("RTC_get_time", node.lineno, {});
}

pbc.assignD.get('struct_time')['check_assign'] = function (py2block, node, targets, value) {
    if(value.func._astname != "Attribute" || value.func.value._astname != "Name"){
        return false;
    }
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if (value._astname === "Call" && moduleName === "time"
        && funcName === "struct_time" && value.args.length === 0)
        return true;
    return false;
}

pbc.assignD.get('struct_time')['create_block'] = function (py2block, node, targets, value) {
    //var turtle = py2block.Name_str(node.targets[0]);
     //注意：赋值语句里，即使图形块上下可接，也不需要加[]
    return block('turtle_create', node.lineno, {
            'VAR': turtle
    }, {});
}

pbc.assignD.get('RTC')['check_assign'] = function(py2block, node, targets, value) {
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if(value._astname === "Call" && moduleName === "machine" && funcName === "RTC" && value.args.length === 0)
        return true;

    return false;
}

pbc.assignD.get('RTC')['create_block'] = function(py2block, node, targets, value){

    var objblock=py2block.convert(targets[0]);

    return [block("sensor_rtc_init", node.lineno, {}, {
        'SUB':objblock
    },
    {
        "inline":"true"
    }
    )];
}

pbc.moduleFunctionD.get('mixgoce.rtc_clock')['datetime'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    /*if (keywords.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }*/
    if(args.length==0){
        var objblock=py2block.convert(func.value);
        return block("RTC_get_time", func.lineno, {}, {
            'SUB':objblock
        }, {
            "inline": "true"
        }); 
    }
    else if(args.length==1&&args[0]._astname=="Tuple"){

        var objblock=py2block.convert(func.value);
        var yearblock=py2block.convert(args[0].elts[0])
        var monthblock=py2block.convert(args[0].elts[1])
        var dayblock=py2block.convert(args[0].elts[2])
        var weekdayblock=py2block.convert(args[0].elts[3])
        var hourblock=py2block.convert(args[0].elts[4])
        var minuteblock=py2block.convert(args[0].elts[5])
        var secondblock=py2block.convert(args[0].elts[6])
        var millisecondblock=py2block.convert(args[0].elts[7])

        return [block("RTC_set_datetime", func.lineno, {}, {
            'SUB':objblock,
            'year':yearblock,
            'month':monthblock,
            'day':dayblock,
            'weekday':weekdayblock,
            'hour':hourblock,
            'minute':minuteblock,
            'second':secondblock,
            'millisecond':millisecondblock,
        }, {
            "inline": "false"
        })]; 
    }
   
}

/*I2C出现了一些问题，待解决*/
pbc.assignD.get('i2c')['check_assign'] = function (py2block, node, targets, value) {
    var funcName = py2block.identifier(value.func.attr);
    var moduleName = py2block.identifier(value.func.value.id);
    if (value._astname === "Call" && ['MPU9250', 'SHT20', 'BMP280', 'ADXL345'].indexOf(funcName) != -1
        && ['mpu9250', 'sht20', 'bmp280', 'adxl345'].indexOf(moduleName) != -1 && value.args.length === 1)
        return true;

    return false;
    
}
pbc.assignD.get('i2c')['create_block'] = function (py2block, node, targets, value) {
    var funcblock = py2block.identifier(value.func.attr);
    var mpublock = py2block.convert(targets[0]);
    var i2cblock = py2block.convert(value.args[0]);
    return block("sensor_use_i2c_init", node.lineno, { "key": funcblock }, {
        'I2CSUB': i2cblock,
        'SUB': mpublock,
    }, {
            "inline": "true"
        });
}


function getAcceleration(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var mpublock=py2block.convert(func.value)
        return block('sensor_mpu9250_get_acceleration', func.lineno, {
                "key": mode
            }, {
                'SUB': mpublock
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.objectFunctionD.get('mpu9250_get_x')['mpu'] = getAcceleration('x');
pbc.objectFunctionD.get('mpu9250_get_y')['mpu'] = getAcceleration('y');
pbc.objectFunctionD.get('mpu9250_get_z')['mpu'] = getAcceleration('z');
pbc.objectFunctionD.get('mpu9250_get_values')['mpu'] = getAcceleration('values');

function getADXLAcceleration(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var mpublock=py2block.convert(func.value)
        return block('sensor_adxl345_get_acceleration', func.lineno, {
                "key": mode
            }, {
                'SUB': mpublock
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.objectFunctionD.get('readX')['snsr'] = getADXLAcceleration('x');
pbc.objectFunctionD.get('readY')['snsr'] = getADXLAcceleration('y');
pbc.objectFunctionD.get('readZ')['snsr'] = getADXLAcceleration('z');
pbc.objectFunctionD.get('readXYZ')['snsr'] = getADXLAcceleration('values');

function getMagnetic(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var mpublock=py2block.convert(func.value)
        return block('sensor_mpu9250_get_magnetic', func.lineno, {
                "key": mode
            }, {
                'SUB': mpublock
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.objectFunctionD.get('mpu9250_magnetic_x')['mpu'] = getMagnetic('x');
pbc.objectFunctionD.get('mpu9250_magnetic_y')['mpu'] = getMagnetic('y');
pbc.objectFunctionD.get('mpu9250_magnetic_z')['mpu'] = getMagnetic('z');
pbc.objectFunctionD.get('mpu9250_magnetic_values')['mpu'] = getMagnetic('values');

function getGyro(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var mpublock=py2block.convert(func.value)
        return block('sensor_mpu9250_get_gyro', func.lineno, {
                "key": mode
            }, {
                'SUB': mpublock
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.objectFunctionD.get('mpu9250_gyro_x')['mpu'] = getGyro('x');
pbc.objectFunctionD.get('mpu9250_gyro_y')['mpu'] = getGyro('y');
pbc.objectFunctionD.get('mpu9250_gyro_z')['mpu'] = getGyro('z');
pbc.objectFunctionD.get('mpu9250_gyro_values')['mpu'] = getGyro('values');

function sensorcompass(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var mpublock=py2block.convert(func.value)
        return block('sensor_mpu9250_field_strength', func.lineno, {
                "compass": mode
            }, {
                'SUB': mpublock
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.objectFunctionD.get('mpu9250_get_field_strength')['mpu'] = sensorcompass('strength');
pbc.objectFunctionD.get('heading')['mpu'] = sensorcompass('heading');

pbc.objectFunctionD.get('mpu9250_get_temperature')['mpu'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }    
    var mpublock=py2block.convert(func.value)
    return block("sensor_mpu9250_temperature", func.lineno, {}, {
        'SUB': mpublock
    }, {
        "inline": "true"
    });
}

function sensorBmp(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var mpublock=py2block.convert(func.value)
        return block('sensor_bmp', func.lineno, {
                "key": mode
            }, {
                'SUB': mpublock
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.objectFunctionD.get('get_BMP_temperature')['mpu'] = sensorBmp('get_BMP_temperature()');
pbc.objectFunctionD.get('get_BMP_pressure')['mpu'] = sensorBmp('get_BMP_pressure()');

function sensorSht(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var mpublock=py2block.convert(func.value)
        return block('sensor_sht', func.lineno, {
                "key": mode
            }, {
                'SUB': mpublock
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.objectFunctionD.get('get_SHT_temperature')['mpu'] = sensorSht('get_SHT_temperature()');
pbc.objectFunctionD.get('get_SHT_relative_humidity')['mpu'] = sensorSht('get_SHT_relative_humidity()');



function dht(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 2) {
            throw new Error("Incorrect number of arguments");
        }
        pbc.pinType="pins_digital_pin";
        var pinblock=py2block.convert(args[1]);
        pbc.pinType=null;
        var dhtblock=py2block.identifier(args[0].s);
        return block('sensor_dht11', func.lineno, {
                'TYPE':dhtblock,
                'WHAT':mode
            }, {
                "PIN":pinblock,
            }, {
                "inline": "true"
            });
    }
    return converter;
}

pbc.moduleFunctionD.get('dhtx')['get_dht_temperature'] = dht('temperature');
pbc.moduleFunctionD.get('dhtx')['get_dht_relative_humidity'] = dht('relative_humidity');
pbc.moduleFunctionD.get('dhtx')['get_dht_tempandhum'] = dht('tempandhum');



pbc.objectFunctionD.get('checkdist')['sonar'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (func.value.args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="pins_digital_pin";
    var trigblock=py2block.convert(func.value.args[0]);
    var echoblock=py2block.convert(func.value.args[1]);
    pbc.pinType=null;
    return block("HCSR04", func.lineno, {}, {
        "PIN1":trigblock,
        "PIN2":echoblock
    }, {
        "inline": "true"
    });
}


pbc.objectFunctionD.get('mpu9250_is_gesture')['mpu'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }   
    var gesblock=py2block.identifier(args[0].s);
    var mpublock=py2block.convert(func.value)
    return block("sensor_mpu9250_gesture", func.lineno, {
        'gesture':gesblock
    }, {
        'SUB': mpublock
    }, {
        "inline": "true"
    });
}


pbc.moduleFunctionD.get('mixgo.button_a')['irq'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0 || keywords.length!==2) {
        throw new Error("Incorrect number of arguments");
    }

      var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
    pbc.pinType="pins_button";
    var objblock=py2block.convert(btn);
    pbc.pinType=null;
    var irq=py2block.identifier(keywords[1].value.attr);
    var pin=py2block.identifier(keywords[1].value.value.attr);
    var mac=py2block.identifier(keywords[1].value.value.value.id)
 

    var mode = mac+"."+pin+"."+py2block.identifier(keywords[1].value.attr);

    pbc.pinType = "pins_callback";
    var callback = py2block.convert(keywords[0].value);
    pbc.pinType = null;

    return [block("sensor_mixgo_button_attachInterrupt", func.lineno, {"mode":mode}, {
        "btn": objblock,
        "DO": callback
    }, {
        "inline": "true"
    })];

}

pbc.moduleFunctionD.get('mixgo.button_b')['irq'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0 || keywords.length!==2) {
        throw new Error("Incorrect number of arguments");
    }

      var btn = {
            '_astname': 'Name',
            'id': {
                '_astname': 'Str',
                'v': py2block.identifier(func.value.attr)
            }
        };
    pbc.pinType="pins_button";
    var objblock=py2block.convert(btn);
    pbc.pinType=null;
    var irq=py2block.identifier(keywords[1].value.attr);
    var pin=py2block.identifier(keywords[1].value.value.attr);
    var mac=py2block.identifier(keywords[1].value.value.value.id)
 

    var mode = mac+"."+pin+"."+py2block.identifier(keywords[1].value.attr);

    pbc.pinType = "pins_callback";
    var callback = py2block.convert(keywords[0].value);
    pbc.pinType = null;

    return [block("sensor_mixgo_button_attachInterrupt", func.lineno, {"mode":mode}, {
        "btn": objblock,
        "DO": callback
    }, {
        "inline": "true"
    })];

}

pbc.objectFunctionD.get('was_pressed')['Button'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
            throw new Error("Incorrect number of arguments");
        }
        var pin=py2block.identifier(func.value.func.attr);
        var mac=py2block.identifier(func.value.func.value.id);
        if(pin==="Button" && mac==="mixgo"){

        pbc.pinType = "pins_digital_pin";
        var pinblock = py2block.convert(func.value.args[0]);
        pbc.pinType = null;

        pbc.pinType = "pins_digital";
        var argblock = py2block.convert(args[0]);
        pbc.pinType = null;

        return block('sensor_mixgo_extern_button_was_pressed', func.lineno, {}, {
            "PIN": pinblock,
            "STAT": argblock
        }, {
            "inline": "true"
        });
 }   
}

pbc.objectFunctionD.get('get_presses')['Button'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
            throw new Error("Incorrect number of arguments");
        }
        var pin=py2block.identifier(func.value.func.attr);
        var mac=py2block.identifier(func.value.func.value.id);
        if(pin==="Button" && mac==="mixgo"){

        pbc.pinType = "pins_digital_pin";
        var pinblock = py2block.convert(func.value.args[0]);
        pbc.pinType = null;
        var argblock = py2block.convert(args[0]);
        return block('sensor_mixgo_extern_button_get_presses', func.lineno, {}, {
            "PIN": pinblock,
            'VAR':argblock
        }, {
            "inline": "true"
        });
 }   
}

pbc.objectFunctionD.get('is_pressed')['Button'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
            throw new Error("Incorrect number of arguments");
        }
        var pin=py2block.identifier(func.value.func.attr);
        var mac=py2block.identifier(func.value.func.value.id);
        if(pin==="Button" && mac==="mixgo"){

        pbc.pinType = "pins_digital_pin";
        var pinblock = py2block.convert(func.value.args[0]);
        pbc.pinType = null;
        
        pbc.pinType = "pins_digital";
        var argblock = py2block.convert(args[0]);
        pbc.pinType = null;

        return block('sensor_mixgo_extern_button_is_pressed', func.lineno, {}, {
            "PIN": pinblock,
            "STAT": argblock
        }, {
            "inline": "true"
        });
 }   
}

pbc.moduleFunctionD.get('ds18x20x')['get_ds18x20_temperature'] = function(py2block, func, args, keywords, starargs, kwargs, node){
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="pins_digital_pin";
    var argblock = py2block.convert(args[0]);
    pbc.pinType = null;
    return block("sensor_ds18x20", func.lineno, {}, {
        "PIN":argblock,
    }, {
        "inline": "true"
    });
}

pbc.objectFunctionD.get('calibrate')['mpu'] = function(py2block, func, args, keywords, starargs, kwargs, node){
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    return [block("sensor_mpu9250_calibrate_compass", func.lineno, {}, {
        "SUB": objblock,
    }, {
        "inline": "true"
    })];
};

pbc.objectFunctionD.get('reset_calibrate')['mpu'] = function(py2block, func, args, keywords, starargs, kwargs, node){
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    var objblock = py2block.convert(func.value);
    return [block("sensor_compass_reset", func.lineno, {}, {
        "SUB": objblock,
    }, {
        "inline": "true"
    })];
};

pbc.moduleFunctionD.get('lm35')['get_LM35_temperature'] = function(py2block, func, args, keywords, starargs, kwargs, node){
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="pins_analog_pin";
    var argblock = py2block.convert(args[0]);
    pbc.pinType = null;
    return block("sensor_lm35", func.lineno, {}, {
        "PIN":argblock,
    }, {
        "inline": "true"
    });
}

pbc.assignD.get('LTR_308ALS')['check_assign'] = function (py2block, node, targets, value) {
    if(value.func._astname != "Attribute" || value.func.value._astname != "Name"){
        return false;
    }
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if (value._astname === "Call" && moduleName === "ltr308al"
        && funcName === "LTR_308ALS" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('LTR_308ALS')['create_block'] = function (py2block, node, targets, value) {
    var sub = py2block.convert(node.targets[0]);
    var arg = py2block.convert(value.args[0]);
    var moduleName = py2block.Name_str(value.func.value);
     //注意：赋值语句里，即使图形块上下可接，也不需要加[]
    return block('sensor_use_i2c_init', node.lineno, {
        'key': 'LTR308'
    }, {
        'SUB': sub,
        'I2CSUB': arg
    });
}

pbc.assignD.get('HP203X')['check_assign'] = function (py2block, node, targets, value) {
    if(value.func._astname != "Attribute" || value.func.value._astname != "Name"){
        return false;
    }
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if (value._astname === "Call" && moduleName === "hp203x"
        && funcName === "HP203X" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('HP203X')['create_block'] = function (py2block, node, targets, value) {
    var sub = py2block.convert(node.targets[0]);
    var arg = py2block.convert(value.args[0]);
    var moduleName = py2block.Name_str(value.func.value);
     //注意：赋值语句里，即使图形块上下可接，也不需要加[]
    return block('sensor_use_i2c_init', node.lineno, {
        'key': 'HP203B'
    }, {
        'SUB': sub,
        'I2CSUB': arg
    });
}

pbc.assignD.get('SHTC3')['check_assign'] = function (py2block, node, targets, value) {
    if(value.func._astname != "Attribute" || value.func.value._astname != "Name"){
        return false;
    }
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if (value._astname === "Call" && moduleName === "adafruit_shtc3"
        && funcName === "SHTC3" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('SHTC3')['create_block'] = function (py2block, node, targets, value) {
    var sub = py2block.convert(node.targets[0]);
    var arg = py2block.convert(value.args[0]);
    var moduleName = py2block.Name_str(value.func.value);
     //注意：赋值语句里，即使图形块上下可接，也不需要加[]
    return block('sensor_use_i2c_init', node.lineno, {
        'key': 'SHTC3'
    }, {
        'SUB': sub,
        'I2CSUB': arg
    });
}

pbc.assignD.get('VL53L0X')['check_assign'] = function (py2block, node, targets, value) {
    if(value.func._astname != "Attribute" || value.func.value._astname != "Name"){
        return false;
    }
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if (value._astname === "Call" && moduleName === "adafruit_vl53l0x"
        && funcName === "VL53L0X" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('VL53L0X')['create_block'] = function (py2block, node, targets, value) {
    var sub = py2block.convert(node.targets[0]);
    var arg = py2block.convert(value.args[0]);
    var moduleName = py2block.Name_str(value.func.value);
     //注意：赋值语句里，即使图形块上下可接，也不需要加[]
    return block('sensor_use_i2c_init', node.lineno, {
        'key': 'VL53L0X'
    }, {
        'SUB': sub,
        'I2CSUB': arg
    });
}

function getSensorData(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (args.length !== 0) {
            throw new Error("Incorrect number of arguments");
        }
        var objblock = py2block.convert(func.value);
        if (mode == 'getdata') {
            return block("sensor_LTR308", func.lineno, {}, {
                "SUB": objblock
            }, {
                "inline": "true"
            });
        } else if (mode == 'p_data()' || mode == 't_data()' || mode == 'h_data()') {
            return block("sensor_hp203", func.lineno, {
                "key": mode
            }, {
                "SUB": objblock
            }, {
                "inline": "true"
            });
        }
    }
    return converter;
}

pbc.objectFunctionD.get('getdata')['Sensor'] = getSensorData('getdata');
pbc.objectFunctionD.get('p_data')['Sensor'] = getSensorData('p_data()');
pbc.objectFunctionD.get('t_data')['Sensor'] =  getSensorData('t_data()');
pbc.objectFunctionD.get('h_data')['Sensor'] = getSensorData('h_data()');

pbc.objectAttrD.get('range')['Sensor'] = function (py2block, node, value, attr) {
    return block('sensor_VL530LX', node.lineno, {}, {
        'SUB': py2block.convert(value)
    });
}

pbc.objectAttrD.get('measurements')['Sensor'] = function (py2block, node, value, attr) {
    return block('sensor_shtc3', node.lineno, {
        'key': 'ALL'
    }, {
        'SUB': py2block.convert(value)
    });
}