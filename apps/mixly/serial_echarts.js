//ECharts
if (!Mixly_20_environment) throw false;
var echarts_data = [];
var echarts_series = [];
var echarts_legend = [];
var echarts_grid_left = 20;
var echarts_now_time;
var echarts_y_value;
var echarts_start_time;
var echarts_draw_line = true;
var echarts_x_name = "时间/ms";
var echarts_update = null;
var myChart = null;
var echarts = require('echarts');

function echarts_init() {
    if (!(serial_port && serial_port.isOpen)) return;
    //myChart && echarts.dispose(myChart);
    myChart && myChart.dispose();
    var chartDom = document.getElementById('com_data_draw');
    myChart = echarts.init(chartDom);
    var option;
    echarts_data = [];
    echarts_series = [];
    echarts_legend = [];
    echarts_grid_left = 20;
    echarts_y_value = 0;
    echarts_start_time = Number(new Date());
    echarts_now_time = 0;
    echarts_draw_line = true;
    echarts_x_name = "时间/ms";
    option = {
        title: {
            left: 'center',
            text: '串口数据'
        },
        grid: {
            top: 70,
            left: echarts_grid_left,
            right: 20,
            bottom: 82
            //containLabel: true
        },
        legend: {
            data: echarts_legend,
            top: 30,
            type: "scroll"
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {}
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'value',
            name: echarts_x_name,
            nameLocation: 'center',
            nameTextStyle: {
                padding: [8, 0, 0, 0]
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
        }, {
            start: 0,
            end: 100
        }],
        series: echarts_series
    };
    echarts_update = setInterval(function () {
        if (serial_port && serial_port.isOpen && echarts_data) {
            var _time_rate = 0; 
            var _data_length = 0;
            if (echarts_draw_line) {
                try{
                    _data_length = echarts_data[0].length;
                    if (_data_length > 20) {
                        var _old_time = echarts_data[0][_data_length - 21].value[0];
                        var _now_time = echarts_data[0][_data_length - 1].value[0];
                        _time_rate = 100*_old_time/_now_time;
                    }
                } catch(e) {
                    console.log(e);
                }
            } else {
                _time_rate = 0;
            }
            myChart.setOption({
                title: {
                    left: 'center',
                    text: '串口数据'
                },
                grid: {
                    top: 70,
                    left: echarts_grid_left,
                    right: 20,
                    bottom: 82
                },
                legend: {
                    data: echarts_legend
                },
                dataZoom: [{
                    type: 'inside',
                    start: _time_rate,
                    end: 100
                }],
                xAxis: {
                    type: 'value',
                    name: echarts_x_name,
                    nameLocation: 'center',
                    nameTextStyle: {
                        padding: [8, 0, 0, 0]
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: echarts_series
            });
        }
    }, 500);
    option && myChart.setOption(option);
}

function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function getNumber(val) {
    var numArr = val.match(/-?([1-9]\d*(\.\d*)*(\e\+[0-9]*)*|0\.[1-9]\d*)/g);
    var numArr1 = [];
    if (numArr) {
        for (var i = 0; i < numArr.length; i++) {
            numArr1.push(parseFloat(numArr[i]));
        }
    }
    return numArr1;
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                if (obj.hasOwnProperty("legend") && obj.hasOwnProperty("data") && obj.legend.length == obj.data.length) {
                    if (obj.hasOwnProperty("xType") && obj.xType == "data") {
                        try {
                            if (obj.data[0].length == 2) {
                                for (var i = 0; i < obj.data.length; i++) {
                                    for (var j = 0; j < 2; j++) {
                                        if (!isNumber(obj.data[i][j]))
                                            return false;
                                    }
                                }
                                try {
                                    if (obj.hasOwnProperty("xName"))
                                        echarts_x_name = obj.xName;
                                } catch(e) {

                                }
                                return obj;
                            }
                        } catch(e) {
                            return false;
                        }
                    } else {
                        for (var i = 0; i < obj.data.length; i++) {
                            if (!isNumber(obj.data[i]))
                                return false;
                        }
                        return obj;
                    }
                }
            }
        } catch(e) {
            return false;
        }
    }
    return false;
}

function echart_draw(serialData) {
    var serialNumber = getNumber(serialData);
    var serialJson = isJSON(serialData);
    if (serialJson) {
        if (myChart) {
            echarts_now_time = Number(new Date()) - echarts_start_time;
            while (echarts_series.length < serialJson.legend.length) {
                echarts_data[echarts_series.length] = new Array();
                var now_show_data = null;
                
                now_show_data = {
                    name: serialJson.legend[echarts_series.length],
                    type: (serialJson.hasOwnProperty("type")?serialJson.type:'line'),
                    showSymbol: false,
                    hoverAnimation: false,
                    data: echarts_data[echarts_series.length]
                };
                
                echarts_legend.push(serialJson.legend[echarts_series.length]);
                echarts_series.push(now_show_data);
            }
            var now_grid_left = 20;
            for (var i = 0; i < serialJson.legend.length; i++) {
                var now_show_data = null;
                if (serialJson.hasOwnProperty("xType") && serialJson.xType == "data") {
                    now_show_data = {
                        name: serialJson.legend[i],
                        value: [
                            serialJson.data[i][0]-0,
                            serialJson.data[i][1]-0
                        ]
                    };  
                    echarts_draw_line = false;
                } else {
                    now_show_data = {
                        name: serialJson.legend[i],
                        value: [
                            echarts_now_time,
                            serialJson.data[i]-0
                        ]
                    };  
                    echarts_draw_line = true;
                }
                if (now_grid_left < 20 + (parseInt(serialJson.data[i])).toString().length*7) {
                    now_grid_left = 20 + (parseInt(serialJson.data[i])).toString().length*8;
                }
                //if (echarts_data[i].length > 1000)
                //  echarts_data[i].shift();
                echarts_data[i].push(now_show_data);
            }
            if (echarts_grid_left < now_grid_left) {
                echarts_grid_left = now_grid_left;
            }
        }
    } else {
        if (myChart && serialNumber.length >= 1) {
            echarts_now_time = Number(new Date()) - echarts_start_time;

            while (echarts_series.length < serialNumber.length) {
                echarts_data[echarts_series.length] = new Array();
                var now_show_data = {
                    name: '数据' + echarts_series.length,
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: echarts_data[echarts_series.length]
                };
                echarts_legend.push('数据' + echarts_series.length);
                echarts_series.push(now_show_data);
            }
            echarts_draw_line = true;
            var now_grid_left = 20;
            for (var i = 0; i < serialNumber.length; i++) {
                var now_show_data = {
                    name: serialData,
                    value: [
                        echarts_now_time,
                        serialNumber[i]
                    ]
                };  
                if (now_grid_left < 20 + (parseInt(serialNumber[i])).toString().length*7) {
                    now_grid_left = 20 + (parseInt(serialNumber[i])).toString().length*8;
                }
                //if (echarts_data[i].length > 1000)
                //  echarts_data[i].shift();
                echarts_data[i].push(now_show_data);
            }
            if (echarts_grid_left < now_grid_left) {
                echarts_grid_left = now_grid_left;
            }
        }
    }
}