class Regression {
	constructor() {
		this.x = [];
		this.y = [];
		this.n = 0;
		this.beta = 1;
		this.alpha = 0;
	}
	/**
   * 适配
   * @param {Array} x 
   * @param {Array} y 
   */
	fit(x, y) {
		this.x = x;
		this.y = y;
		this.n = x.length;
		this.beta = this.getBeta();
		this.alpha = this.getAlpha(this.beta);
	}
	/**
   * 预测
   * @param {Array}  x 数据集
   * @returns {Array} 预测结果数据集
   */
	predict(x) {
		if(!Array.isArray(x)) x = [x];
		const y = [];
		for(const num of x) {
			y.push(this.alpha + num * this.beta);
		}
		return y;
	}
	/**
   * 获取beta
   * @returns {Number}  斜率
   */
	getBeta() {
		const beta = (this.sum(this.x, (v, k) => v * this.y[k])*this.n 
					  - this.sum(this.x)*this.sum(this.y)) /
			  (this.sum(this.x, (v)=>v*v) * this.n  
			   - Math.pow(this.sum(this.x), 2));
		return beta;
	}
	/**
   * 获取alpha
   * @param {Number} beta 斜率
   * @returns {Number}  偏移量
   */
	getAlpha(beta) {
		return this.avg(this.y) - this.avg(this.x) * beta;
	}
	/**
   * 求和(Σ)
   * @param {Array} arr 数字集合
   * @param {Function}  fun 每个集合的操作方法
   */
	sum(arr, fun = (v, k) => v) {
		let s = 0;
		const operate = fun;
		for(const i in arr) {
			const num = arr[i];
			s += operate(num, i);
		}
		return s;
	}
	/**
   * 均值
   * @param {Array} arr 数字集合
   */
	avg(arr) {
		const s = this.sum(arr);
		return s / arr.length;
	}
}

const regression = new Regression();

var MixlyHighCharts = {};

var Highcharts = require('highcharts');

MixlyHighCharts.startTime = 0;
MixlyHighCharts.oldTime = 0;
MixlyHighCharts.nowTime = 0;
MixlyHighCharts.timeDiff = 0;
MixlyHighCharts.pointNum = 100;
MixlyHighCharts.xData = [];
MixlyHighCharts.yData = [];
MixlyHighCharts.data = [];

MixlyHighCharts.chart = null;

MixlyHighCharts.DRAW = null;
MixlyHighCharts.ADD_DATA = null;

MixlyHighCharts.init = function () {
	MixlyHighCharts.startTime = Number(new Date());
	MixlyHighCharts.nowTime = MixlyHighCharts.startTime;
	MixlyHighCharts.timeDiff = 0;
	MixlyHighCharts.oldTime = MixlyHighCharts.nowTime;
	MixlyHighCharts.xData = [];
	MixlyHighCharts.yData = [];
	MixlyHighCharts.data = [];
	MixlyHighCharts.chart = Highcharts.chart('com_data_draw', {
		chart: {
			type: 'line'
		},
		title: {
			text: '串口数据'
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		xAxis: {
			//reversed: false,
			title: {
				enabled: true,
				text: '时间/ms'
			},
			lineWidth: 2
			//endOnTick: true
			//maxPadding: 0.05,
			//showLastLabel: true
		},
		yAxis: {
			title: {
				text: '串口数据'
			},
			endOnTick: true,
			lineWidth: 2
		},
		series: [{
			name: '串口数据',
			data: []
		}]
	});

	MixlyHighCharts.DRAW = window.setInterval(MixlyHighCharts.draw, 100);

	//MixlyHighCharts.ADD_DATA = window.setInterval(MixlyHighCharts.addData, 50);
}

MixlyHighCharts.draw = function () {
	if ($('#serial-y-max').val() && $('#serial-y-min').val()) {
		var yMax = $('#serial-y-max').val() || 100;
		var yMin = $('#serial-y-min').val() || 0;
		MixlyHighCharts.chart.yAxis[0].setExtremes(yMin, yMax);
	}
	var xMin = 0;
	if (MixlyHighCharts.data.length > 0 && MixlyHighCharts.data[0].length > 0) {
		xMin = MixlyHighCharts.data[0][0];
	}
	var xMax = xMin + 100;
	if (MixlyHighCharts.data.length > 0 && MixlyHighCharts.data.length < MixlyHighCharts.pointNum) {
		regression.fit(MixlyHighCharts.xData, MixlyHighCharts.yData);
		xMax = regression.predict([MixlyHighCharts.pointNum]);
		//if (xMax > nowXMax) {
		//nowXMax = xMax;
		//}
		//console.log(xData)
		//console.log(yData)
		//console.log(xMax)
		if (MixlyHighCharts.data.length > 0 && xMax < MixlyHighCharts.data[MixlyHighCharts.data.length-1][0]) {
			xMax = MixlyHighCharts.data[MixlyHighCharts.data.length-1][0];
		}
		MixlyHighCharts.chart.xAxis[0].setExtremes(xMin, xMax);
	} else if (MixlyHighCharts.data.length >= MixlyHighCharts.pointNum) {
		xMax = MixlyHighCharts.data[MixlyHighCharts.pointNum-1][0];
		MixlyHighCharts.chart.xAxis[0].setExtremes(xMin, xMax);
	}
	MixlyHighCharts.chart.series[0].setData(MixlyHighCharts.data, true, false, false);
	MixlyHighCharts.update();
}

MixlyHighCharts.addData = function (serialData) {
	var timeData = Number(new Date());
	var serialNumber = getNumber(serialData);
	if (timeData - MixlyHighCharts.nowTime > 50 && serialNumber && serialNumber.length > 0) {
		if (timeData - MixlyHighCharts.nowTime > MixlyHighCharts.timeDiff) {
			MixlyHighCharts.timeDiff = timeData - MixlyHighCharts.nowTime;
		}
		MixlyHighCharts.oldTime = MixlyHighCharts.nowTime;
		MixlyHighCharts.nowTime = timeData;
		var newData = [MixlyHighCharts.nowTime - MixlyHighCharts.startTime, serialNumber[0]];
		while (MixlyHighCharts.data.length > MixlyHighCharts.pointNum) {
			MixlyHighCharts.data.shift();
		}
		if (MixlyHighCharts.data.length < MixlyHighCharts.pointNum) {
			MixlyHighCharts.xData.push(MixlyHighCharts.data.length);
			MixlyHighCharts.yData.push(MixlyHighCharts.nowTime - MixlyHighCharts.startTime);
		}
		MixlyHighCharts.data.push(newData);
	}
}

MixlyHighCharts.update = function () {
	if ($('#serial-point-num option:selected').val()-0 != MixlyHighCharts.pointNum) {
		try {
			MixlyHighCharts.chart.destroy();
		} catch(e) {
			console.log(e);
		}
		MixlyHighCharts.pointNum = $('#serial-point-num option:selected').val() - 0;
		MixlyHighCharts.init();
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