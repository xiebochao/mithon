

pbc.objectFunctionD.get('value')['Pin'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1 && args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    if(args.length == 1){
    pbc.pinType = "pins_digital";
    var pinblock = py2block.convert(func.value);
    var argblock = py2block.convert(args[0]);
    pbc.pinType = null;
    return [block("inout_digital_write", func.lineno, {}, {
        "PIN": pinblock,
        "STAT": argblock
    }, {
        "inline": "true"
    })];}
    else if(args.length == 0){
      pbc.pinType = "pins_digital";
      var pinblock = py2block.convert(func.value);
      pbc.pinType = null;
      return block("inout_digital_read", func.lineno, {}, {
          "PIN": pinblock
      }, {
          "inline": "true"
      });
    }
}


pbc.assignD.get('DigitalInOut')['check_assign'] = function(py2block, node, targets, value) {
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if(value._astname === "Call" && funcName === "DigitalInOut" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('DigitalInOut')['create_block'] = function(py2block, node, targets, value){
    pbc.pinType = "pins_digital_pin";
    var pinblock = py2block.convert(value.args[0]);
    pbc.pinType = null;
    pinobj = py2block.identifier(targets[0].id);
    return block("inout_digital_init", node.lineno, 
    {
        "PIN_OBJ":pinobj
    }, {
        "PIN":pinblock
    });
}

function DigitalInOut_switch(mode){
    function converter(py2block, func, args, keywords, starargs, kwargs, node) {
        if (keywords.length !== 1) {
            throw new Error("Incorrect number of arguments");
        }
        pbc.pinType = "pins_digital";
        var pinblock = py2block.convert(func.value);
        pbc.pinType = null;
        var keyword = keywords[0].value.attr.v;

        return [block("inout_digitalinout_mode", func.lineno, {
            "TYPE": keyword
        }, {
            "PIN": pinblock
        }, {
            "inline": "true"
        })];  
    }
    return converter;
}
pbc.objectFunctionD.get('switch_to_output')['digitalio'] = DigitalInOut_switch("switch_to_output");
pbc.objectFunctionD.get('switch_to_input')['digitalio'] = DigitalInOut_switch("switch_to_input");

//ok
pbc.assignD.get('AnalogOut')['check_assign'] = function(py2block, node, targets, value) {
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if(value._astname === "Call" && funcName === "AnalogOut" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('AnalogOut')['create_block'] = function(py2block, node, targets, value){
    pbc.pinType = "pins_dac_pin";
    var pinblock = py2block.convert(value.args[0]);
    pbc.pinType = null;
    pinobj = py2block.identifier(targets[0].id);
    return block("inout_analog_write_init", node.lineno, 
    {
        "PIN_OBJ":pinobj
    }, {
        "PIN":pinblock
    });
}

//ok
pbc.assignD.get('PWMOut')['check_assign'] = function(py2block, node, targets, value) {
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if(value._astname === "Call" && funcName === "PWMOut" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('PWMOut')['create_block'] = function(py2block, node, targets, value){
    pbc.pinType = "pins_pwm_pin";
    var pinblock = py2block.convert(value.args[0]);
    pbc.pinType = null;
    pinobj = py2block.identifier(targets[0].id);
    return block("inout_pwm_analog_write_init", node.lineno, 
    {
        "PIN_OBJ":pinobj
    }, {
        "PIN":pinblock
    });
}

//ok
pbc.assignD.get('AnalogIn')['check_assign'] = function(py2block, node, targets, value) {
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if(value._astname === "Call" && funcName === "AnalogIn" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('AnalogIn')['create_block'] = function(py2block, node, targets, value){
    pbc.pinType = "pins_analog_pin";
    var pinblock = py2block.convert(value.args[0]);
    pbc.pinType = null;
    pinobj = py2block.identifier(targets[0].id);
    return block("inout_analog_read_init", node.lineno, 
    {
        "PIN_OBJ":pinobj
    }, {
        "PIN":pinblock
    });
}

pbc.objectFunctionD.get('read')['Pin'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    value = func.value.id.v
    value = value.slice(0,2)
    if( value=="ad"){
    pbc.pinType = "pins_analog";
    var pinblock = py2block.convert(func.value);
    pbc.pinType = null;

    return block("inout_analog_read", func.lineno, {}, {
        "PIN": pinblock,
    }, {
        "inline": "true"
    });}
    else if(value =="tc"){
    pbc.pinType = "pins_touch";
    var pinblock = py2block.convert(func.value);
    pbc.pinType = null;

    return block("inout_pin_pressed", func.lineno, {}, {
        "pin": pinblock,
    }, {
        "inline": "true"
    });
    }
}
//ok
pbc.assignD.get('TouchIn')['check_assign'] = function(py2block, node, targets, value) {
    var moduleName = py2block.Name_str(value.func.value);
    var funcName = py2block.identifier(value.func.attr);
    if(value._astname === "Call" && funcName === "TouchIn" && value.args.length === 1)
        return true;
    return false;
}

pbc.assignD.get('TouchIn')['create_block'] = function(py2block, node, targets, value){
    pbc.pinType = "pins_touch_pin";
    var pinblock = py2block.convert(value.args[0]);
    pbc.pinType = null;
    pinobj = py2block.identifier(targets[0].id);
    return block("inout_pin_pressed_init", node.lineno, 
    {
        "PIN_OBJ":pinobj
    }, {
        "PIN":pinblock
    });    
}

pbc.objectFunctionD.get('irq')['Pin'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0 || keywords.length!==2) {
        throw new Error("Incorrect number of arguments");
    }
    var pin=py2block.identifier(func.value.func.attr);
    var mac=py2block.identifier(func.value.func.value.id);
    if(pin==="Pin" && mac==="machine"){

    pbc.pinType = "pins_digital_pin";
    var pinblock = py2block.convert(func.value.args[0]);
    pbc.pinType = null;

    var mode = mac+"."+pin+"."+py2block.identifier(keywords[1].value.attr);

    pbc.pinType = "pins_callback";
    var callback = py2block.convert(keywords[0].value);
    pbc.pinType = null;

    return [block("inout_pin_attachInterrupt", func.lineno, {"mode":mode}, {
        "PIN": pinblock,
        "DO": callback
    }, {
        "inline": "true"
    })];
}

}

pbc.objectFunctionD.get('atten')['Pin'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }

    pbc.pinType = "pins_analog";
    var pinblock = py2block.convert(func.value);
    pbc.pinType = null;

    var atten  = py2block.identifier(args[0].value.value.id)+"."+py2block.identifier(args[0].value.attr)+"."+py2block.identifier(args[0].attr)

    return [block("inout_analog_atten", func.lineno, {"atten":atten}, {
        "PIN": pinblock,
    }, {
        "inline": "true"
    })];
}
