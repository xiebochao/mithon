//ECharts
var echarts = require('echarts');

var echarts_data = [];
var echarts_now_time;
var echarts_y_value;
var echarts_start_time;
var echarts_old_time = 0;
var echarts_update = null;
var myChart = null;
function echarts_init() {
    var chartDom = document.getElementById('com_data_draw');
    myChart = echarts.init(chartDom);
    var option;
    echarts_data = [];
    echarts_y_value = 0;
    echarts_start_time = new Date();
    echarts_now_time = 0;
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
            start: 70,
            end: 100
        }, {
            start: 70,
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
        myChart.setOption({
            series: [{
                data: echarts_data
            }]
        });
    }, 200);
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
