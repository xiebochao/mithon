//ECharts
if (!Mixly_20_environment) throw false;

var MixlySerialEcharts = {};
MixlySerialEcharts.data = [];
MixlySerialEcharts.series = [];
MixlySerialEcharts.legend = [];
MixlySerialEcharts.gridLeft = 20;
MixlySerialEcharts.nowTime;
MixlySerialEcharts.yValue;
MixlySerialEcharts.startTime;
MixlySerialEcharts.drawLine = true;
MixlySerialEcharts.xName = "时间/ms";
MixlySerialEcharts.update = null;
MixlySerialEcharts.myChart = null;
var echarts = require('echarts');

/**
* @ function 初始化串口绘图工具
* @ description 初始化串口绘图工具（Echarts）
* @ return void
*/
MixlySerialEcharts.init = function () {
    if (!(MixlySerial.serialPort && MixlySerial.serialPort.isOpen)) return;
    //MixlySerialEcharts.myChart && echarts.dispose(MixlySerialEcharts.myChart);
    MixlySerialEcharts.myChart && MixlySerialEcharts.myChart.dispose();
    var chartDom = document.getElementById('com_data_draw');
    MixlySerialEcharts.myChart = echarts.init(chartDom);
    var option;
    MixlySerialEcharts.data = [];
    MixlySerialEcharts.series = [];
    MixlySerialEcharts.legend = [];
    MixlySerialEcharts.gridLeft = 20;
    MixlySerialEcharts.yValue = 0;
    MixlySerialEcharts.startTime = Number(new Date());
    MixlySerialEcharts.nowTime = 0;
    MixlySerialEcharts.drawLine = true;
    MixlySerialEcharts.xName = "时间/ms";
    option = {
        title: {
            left: 'center',
            text: '串口数据'
        },
        grid: {
            top: 70,
            left: MixlySerialEcharts.gridLeft,
            right: 20,
            bottom: 82
            //containLabel: true
        },
        legend: {
            data: MixlySerialEcharts.legend,
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
            name: MixlySerialEcharts.xName,
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
        series: MixlySerialEcharts.series
    };
    MixlySerialEcharts.update = setInterval(function () {
        if (MixlySerial.serialPort && MixlySerial.serialPort.isOpen && MixlySerialEcharts.data) {
            var _time_rate = 0; 
            var _data_length = 0;
            if (MixlySerialEcharts.drawLine) {
                try{
                    _data_length = MixlySerialEcharts.data[0].length;
                    if (_data_length > 20) {
                        var _old_time = MixlySerialEcharts.data[0][_data_length - 21].value[0];
                        var _now_time = MixlySerialEcharts.data[0][_data_length - 1].value[0];
                        _time_rate = 100*_old_time/_now_time;
                    }
                } catch(e) {
                    console.log(e);
                }
            } else {
                _time_rate = 0;
            }
            MixlySerialEcharts.myChart.setOption({
                title: {
                    left: 'center',
                    text: '串口数据'
                },
                grid: {
                    top: 70,
                    left: MixlySerialEcharts.gridLeft,
                    right: 20,
                    bottom: 82
                },
                legend: {
                    data: MixlySerialEcharts.legend
                },
                dataZoom: [{
                    type: 'inside',
                    start: _time_rate,
                    end: 100
                }],
                xAxis: {
                    type: 'value',
                    name: MixlySerialEcharts.xName,
                    nameLocation: 'center',
                    nameTextStyle: {
                        padding: [8, 0, 0, 0]
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: MixlySerialEcharts.series
            });
        }
    }, 500);
    option && MixlySerialEcharts.myChart.setOption(option);
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
                                        MixlySerialEcharts.xName = obj.xName;
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

/**
* @ function 串口绘图工具绘制图像
* @ description 串口绘图工具根据所接收的·串口数据重新绘制图像
* @ return void
*/
MixlySerialEcharts.draw = function (serialData) {
    var serialNumber = getNumber(serialData);
    var serialJson = isJSON(serialData);
    if (serialJson) {
        if (MixlySerialEcharts.myChart) {
            MixlySerialEcharts.nowTime = Number(new Date()) - MixlySerialEcharts.startTime;
            while (MixlySerialEcharts.series.length < serialJson.legend.length) {
                MixlySerialEcharts.data[MixlySerialEcharts.series.length] = new Array();
                var now_show_data = null;
                
                now_show_data = {
                    name: serialJson.legend[MixlySerialEcharts.series.length],
                    type: (serialJson.hasOwnProperty("type")?serialJson.type:'line'),
                    showSymbol: false,
                    hoverAnimation: false,
                    data: MixlySerialEcharts.data[MixlySerialEcharts.series.length]
                };
                
                MixlySerialEcharts.legend.push(serialJson.legend[MixlySerialEcharts.series.length]);
                MixlySerialEcharts.series.push(now_show_data);
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
                    MixlySerialEcharts.drawLine = false;
                } else {
                    now_show_data = {
                        name: serialJson.legend[i],
                        value: [
                            MixlySerialEcharts.nowTime,
                            serialJson.data[i]-0
                        ]
                    };  
                    MixlySerialEcharts.drawLine = true;
                }
                if (now_grid_left < 20 + (parseInt(serialJson.data[i])).toString().length*7) {
                    now_grid_left = 20 + (parseInt(serialJson.data[i])).toString().length*8;
                }
                //if (MixlySerialEcharts.data[i].length > 1000)
                //  MixlySerialEcharts.data[i].shift();
                MixlySerialEcharts.data[i].push(now_show_data);
            }
            if (MixlySerialEcharts.gridLeft < now_grid_left) {
                MixlySerialEcharts.gridLeft = now_grid_left;
            }
        }
    } else {
        if (MixlySerialEcharts.myChart && serialNumber.length >= 1) {
            MixlySerialEcharts.nowTime = Number(new Date()) - MixlySerialEcharts.startTime;

            while (MixlySerialEcharts.series.length < serialNumber.length) {
                MixlySerialEcharts.data[MixlySerialEcharts.series.length] = new Array();
                var now_show_data = {
                    name: '数据' + MixlySerialEcharts.series.length,
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: MixlySerialEcharts.data[MixlySerialEcharts.series.length]
                };
                MixlySerialEcharts.legend.push('数据' + MixlySerialEcharts.series.length);
                MixlySerialEcharts.series.push(now_show_data);
            }
            MixlySerialEcharts.drawLine = true;
            var now_grid_left = 20;
            for (var i = 0; i < serialNumber.length; i++) {
                var now_show_data = {
                    name: serialData,
                    value: [
                        MixlySerialEcharts.nowTime,
                        serialNumber[i]
                    ]
                };  
                if (now_grid_left < 20 + (parseInt(serialNumber[i])).toString().length*7) {
                    now_grid_left = 20 + (parseInt(serialNumber[i])).toString().length*8;
                }
                //if (MixlySerialEcharts.data[i].length > 1000)
                //  MixlySerialEcharts.data[i].shift();
                MixlySerialEcharts.data[i].push(now_show_data);
            }
            if (MixlySerialEcharts.gridLeft < now_grid_left) {
                MixlySerialEcharts.gridLeft = now_grid_left;
            }
        }
    }
}