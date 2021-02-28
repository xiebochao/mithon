//ECharts
var echarts = require('echarts');

var echarts_data = [];
var echarts_now_time;
var echarts_y_value;
var echarts_start_time;
var echarts_old_time;
var echarts_update = null;
var myChart = null;
function echarts_init() {
    var chartDom = document.getElementById('com_data_draw');
    myChart = echarts.init(chartDom);
    var option;
    echarts_data = [];
    echarts_y_value = 0;
    echarts_start_time = Number(new Date());
    echarts_now_time = 0;
    echarts_old_time = 0;
    option = {
        title: {
            left: 'center',
            text: '串口数据'
        },
        grid: {
            top: 40,
            left: 50,
            right: 50,
            bottom: 70
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
            splitLine: {
                show: false
            },
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
        series: [{
            name: '串口数据',
            type: 'line',
            showSymbol: true,
            hoverAnimation: false,
            data: echarts_data
        }]
    };
    echarts_update = setInterval(function () {
        if (com_connected) {
            var _time_rate = 0; 
            var _data_length = echarts_data.length;
            if (_data_length > 20) {
                var _old_time = echarts_data[_data_length - 21].value[0];
                var _now_time = echarts_data[_data_length - 1].value[0];
                _time_rate = 100*_old_time/_now_time;
            }
            myChart.setOption({
                dataZoom: [{
                    type: 'inside',
                    start: _time_rate,
                    end: 100
                }],
                series: [{
                    data: echarts_data
                }]
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
