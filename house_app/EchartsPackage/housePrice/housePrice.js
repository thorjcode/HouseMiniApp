import * as echarts from '../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  var option = {
    legend: {
		top: 'bottom'
    },
	toolbox: {
        show: true,
        feature: {
            restore: {show: true},
        }
    },
    series: [
        {
			name: '面积模式',
			type: 'pie',
            radius: [5, 100],
            center: ['50%', '40%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 5
            },
            data: [
                {value: 48, name: '高新 34761元/m²'},
                {value: 44, name: '海曙 34091元/m²'},
                {value: 40, name: '江北 28119元/m²'},
                {value: 36, name: '鄞州 26558元/m²'},
                {value: 32, name: '奉化 14268元/m²'},
                {value: 28, name: '慈溪 14182元/m²'},
                {value: 24, name: '余姚 12230元/m²'},
                {value: 20, name: '象山 10530元/m²'}  
            ]
        }
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
