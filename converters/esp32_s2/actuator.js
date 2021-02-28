
'use strict';

pbc.moduleFunctionD.get('servo')['servo_write_angle'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var pwmAstName = args[0]._astname;
    pbc.pinType="pins_pwm_pin";
    var pinblock;

    if (pwmAstName === "Num") {
        pinblock=py2block.convert(args[0])
    }
    pbc.pinType=null;
    var angleblock=py2block.convert(args[1]);
    
    return [block("servo_move", func.lineno, {}, {
        "PIN":pinblock,
        "DEGREE": angleblock,

    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.led_L1')['setonoff'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="number";
    var ledblock = {
            _astname: "Num",
            n: {
                'v': "led_L1"
            }
        }
    var mode = py2block.convert(ledblock);   
    pbc.pinType=null;
    pbc.inScope="ledswitch";
    var argblock = py2block.convert(args[0]);
    
     pbc.inScope=null;
    return [block("actuator_led_bright", func.lineno, {
        
    }, {
        'led': mode,
        'bright':argblock,
    }, {
        "inline": "true"
    }),
    ];
}

pbc.moduleFunctionD.get('mixgoce.led_L2')['setonoff'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="number";
    var ledblock = {
            _astname: "Num",
            n: {
                'v': "led_L2"
            }
        }
    var mode = py2block.convert(ledblock);   
    pbc.pinType=null;
    pbc.inScope="ledswitch";
    var argblock = py2block.convert(args[0]);
    
     pbc.inScope=null;
    return [block("actuator_led_bright", func.lineno, {
        
    }, {
        'led': mode,
        'bright':argblock,
    }, {
        "inline": "true"
    }),
    ];
}

pbc.moduleFunctionD.get('mixgoce.led_L1')['getonoff'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="number";
    var ledblock = {
            _astname: "Num",
            n: {
                'v': "led_L1"
            }
        }
    var mode = py2block.convert(ledblock);
    pbc.pinType=null;
    return block("actuator_get_led_bright", func.lineno, {
    }, {
        'led': mode,
    }, {
        "inline": "true"
    });
}

pbc.moduleFunctionD.get('mixgoce.led_L2')['getonoff'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="number";
    var ledblock = {
            _astname: "Num",
            n: {
                'v': "led_L2"
            }
        }
    var mode = py2block.convert(ledblock);
    pbc.pinType=null;
    return block("actuator_get_led_bright", func.lineno, {
    }, {
        'led': mode,
    }, {
        "inline": "true"
    });
}

pbc.moduleFunctionD.get('mixgoce.led_L1')['setbrightness'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="number";
    var ledblock = {
            _astname: "Num",
            n: {
                'v': "led_L1"
            }
        }
    var mode = py2block.convert(ledblock);
    pbc.pinType=null;
    var brightblock = py2block.convert(args[0]);

    return [block("actuator_led_brightness", func.lineno, {}, {
        'led': mode,
        'bright':brightblock,
    }, {
        "inline": "true"
    }),
    ];
}

pbc.moduleFunctionD.get('mixgoce.led_L2')['setbrightness'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType="number";
    var ledblock = {
            _astname: "Num",
            n: {
                'v': "led_L2"
            }
        }
    var mode = py2block.convert(ledblock);
    pbc.pinType=null;
    var brightblock = py2block.convert(args[0]);

    return [block("actuator_led_brightness", func.lineno, {}, {
        'led': mode,
        'bright':brightblock,
    }, {
        "inline": "true"
    }),
    ];
}


pbc.moduleFunctionD.get('mixgoce.buzzer')['play'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
	if(args.length!==1 && args.length!==2){
		throw new Error("Incorrect number of arguments");
	}

	 if (args.length === 2) {
        var time = py2block.convert(args[1]);
        pbc.pinType = "pins_tone_notes";
        var pitchblock = py2block.convert(args[0]);
        pbc.pinType=null;
      
        
        return [block("esp32_s2_onboard_music_pitch_with_time", func.lineno, {}, {
            'pitch': pitchblock,
            'time': time
        }, {
            "inline": "true"
        })];
    } 
    else if (args.length=== 1){
        pbc.pinType = "pins_tone_notes";
        var pitchblock = py2block.convert(args[0]);
        pbc.pinType=null;
     return [block("esp32_s2_onboard_music_pitch", func.lineno, {}, {
                'pitch': pitchblock,
            }, {
                "inline": "true"
            })];

    }

}

pbc.moduleFunctionD.get('music')['pitch_time'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if(args.length!==2 && args.length!==3){
        throw new Error("Incorrect number of arguments");
    }

     if (args.length === 2) {
        pbc.pinType = "pins_tone_notes";
        var pitchblock = py2block.convert(args[0]);
        pbc.pinType=null;
        var timeblock=py2block.convert(args[1]);        
        return [block("esp32_onboard_music_pitch_with_time", func.lineno, {}, {
            'pitch': pitchblock,
            "time":timeblock
        }, {
            "inline": "true"
        })];
    } 
    else if (args.length=== 3){
        pbc.pinType = "pins_pwm_pin";
        var pinblock = py2block.convert(args[0]);
        pbc.pinType=null;
        pbc.pinType = "pins_tone_notes";
        var pitchblock = py2block.convert(args[1]);
        pbc.pinType=null;
        var timeblock=py2block.convert(args[2]);
     return [block("esp32_music_pitch_with_time", func.lineno, {}, {
                'pitch': pitchblock,
                'PIN': pinblock,
                "time":timeblock
            }, {
                "inline": "true"
            })];

    }

}

pbc.moduleFunctionD.get('mixgoce.buzzer')['stop'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("esp32_s2_onboard_music_stop", func.lineno, {}, {}, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.buzzer')['play_demo'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    pbc.pinType = "pins_playlist";
    var nameblock= py2block.convert(args[0]);
    pbc.pinType = null;
    return [block("esp32_s2_onboard_music_play_list", func.lineno, {}, {
        "LIST":nameblock
    }, {
        "inline": "true"
    })];
}

pbc.moduleAttrD.get('mixgoce')["BA_DING"] = function (node, module, attr) {
    return block("pins_playlist", node.lineno, {
        "PIN": module + "." + attr
    });
}

pbc.moduleAttrD.get('mixgoce')["DADADADUM"] = function (node, module, attr) {
    return block("pins_playlist", node.lineno, {
        "PIN": module + "." + attr
    });
}

pbc.moduleAttrD.get('mixgoce')["BIRTHDAY"] = function (node, module, attr) {
    return block("pins_playlist", node.lineno, {
        "PIN": module + "." + attr
    });
}

pbc.moduleAttrD.get('mixgoce')["JUMP_UP"] = function (node, module, attr) {
    return block("pins_playlist", node.lineno, {
        "PIN": module + "." + attr
    });
}

pbc.moduleAttrD.get('mixgoce')["JUMP_DOWN"] = function (node, module, attr) {
    return block("pins_playlist", node.lineno, {
        "PIN": module + "." + attr
    });
}

pbc.moduleAttrD.get('mixgoce')["POWER_UP"] = function (node, module, attr) {
    return block("pins_playlist", node.lineno, {
        "PIN": module + "." + attr
    });
}

pbc.moduleAttrD.get('mixgoce')["POWER_DOWN"] = function (node, module, attr) {
    return block("pins_playlist", node.lineno, {
        "PIN": module + "." + attr
    });
}

pbc.moduleFunctionD.get('mixgoce.buzzer')['set_duration_tempo'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 2) {
        throw new Error("Incorrect number of arguments");
    }
    var ticks = py2block.convert(args[0]);
    var bpm = py2block.convert(args[1]);
    return [block("esp32_s2_music_set_tempo", func.lineno, {}, {
        "TICKS": ticks,
        "BPM": bpm
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.buzzer')['get_tempo'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return block("esp32_s2_music_get_tempo", func.lineno, {}, {}, {
        "inline": "true"
    });
}

pbc.moduleFunctionD.get('mixgoce.buzzer')['reset'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("esp32_s2_music_reset", func.lineno, {}, {}, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.rgb')['show_all'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 3) {
        throw new Error("Incorrect number of arguments");
    }
    var r = py2block.convert(args[0]);
    var g = py2block.convert(args[1]);
    var b = py2block.convert(args[2]);
    return [block("actuator_onboard_neopixel_rgb_show_all", func.lineno, {}, {
        "RVALUE": r,
        "GVALUE": g,
        "BVALUE": b
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.rgb')['show_one'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 4) {
        throw new Error("Incorrect number of arguments");
    }
    var led_id = py2block.convert(args[0]);
    var r = py2block.convert(args[1]);
    var g = py2block.convert(args[2]);
    var b = py2block.convert(args[3]);
    return [block("actuator_onboard_neopixel_rgb_show_one", func.lineno, {}, {
        "_LED_": led_id,
        "RVALUE": r,
        "GVALUE": g,
        "BVALUE": b
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.rgb')['color_chase'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 4) {
        throw new Error("Incorrect number of arguments");
    }
    var r = py2block.convert(args[0]);
    var g = py2block.convert(args[1]);
    var b = py2block.convert(args[2]);
    var time = py2block.convert(args[3]);
    return [block("actuator_onboard_neopixel_rgb_show_all_chase", func.lineno, {}, {
        "RVALUE": r,
        "GVALUE": g,
        "BVALUE": b,
        "time": time
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.rgb')['rainbow_cycle'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 1) {
        throw new Error("Incorrect number of arguments");
    }
    var time = py2block.convert(args[0]);
    return [block("actuator_onboard_neopixel_rgb_show_all_rainbow", func.lineno, {}, {
        "time": time
    }, {
        "inline": "true"
    })];
}

pbc.moduleFunctionD.get('mixgoce.rgb')['write'] = function (py2block, func, args, keywords, starargs, kwargs, node) {
    if (args.length !== 0) {
        throw new Error("Incorrect number of arguments");
    }
    return [block("actuator_onboard_neopixel_write", func.lineno, {}, {}, {
        "inline": "true"
    })];
}
