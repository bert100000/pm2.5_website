let chart = echarts.init(document.querySelector("#main"));
let chart1 = echarts.init(document.querySelector("#six"));
let chart2 = echarts.init(document.querySelector("#county"));


let pm25HighSite=document.querySelector("#pm25_high_site");
let pm25HighValue=document.querySelector("#pm25_high_value");
let pm25LowSite=document.querySelector("#pm25_low_site");
let pm25LowValue=document.querySelector("#pm25_low_value");
let dateE1=document.querySelector("#date");

//console.log(pm25HighSite,pm25HighValue,pm25LowSite,pm25LowValue)

$(document).ready(()=>{
    drawPM25();
    drawSixPM25();
    drawCountyPM25("南投縣");
});

window.onresize = function(){
  chart.resize();
  chart1.resize();
  chart2.resize();
};

$("#county_btn").click(() => {
  drawCountyPM25($("#select_county").val());
  //console.log($("#select_county").val());
  //drawCountyPM25
});


function drawCountyPM25(county){
  chart2.showLoading();
  $.ajax(
      {
        url:`/pm25-county/${county}`,
        type:"POST",
        dataType:"json",
        success:(data) =>{
          chart2.hideLoading();
          //console.log(data);
          //drawPM25Chart(data)
          drawChart(data["site"],data["pm25"], "", chart2, "#fbdb76b");
          //renderMaxPM25(data);
        },
        error:() =>{
          chart2.hideLoading();
          alert("讀取資料失敗");
        }
      }
  );
}
//呼叫ajax(jQuery)
function drawSixPM25(){
  chart1.showLoading();
  $.ajax(
      {
        url:"/pm25-six-jason",
        type:"POST",
        dataType:"json",
        success:(data) =>{
          chart1.hideLoading();
          //console.log(data);
          //drawPM25Chart(data)
          drawChart(data["site"],data["pm25"],"pm2.5六都平均值",chart1,"#ffdead");
          //renderMaxPM25(data);
        },
        error:() =>{
          chart1.hideLoading();
          alert("讀取資料失敗");
        }
      }
  );
}

//呼叫ajax(jQuery)
function drawPM25(){
  chart.showLoading();
  $.ajax(
      {
        url:"/pm25_json",
        type:"POST",
        dataType:"json",
        success:(data) =>{
          chart.hideLoading();
          //console.log(data);
          //drawPM25Chart(data)
          drawChart(data["site"],data["pm25"],"pm2.5全省示意圖",chart);
          renderMaxPM25(data);
        },
        error:() =>{
          chart.hideLoading();
          alert("讀取資料失敗");
        }
      }
  );
}
    //console.log("call drawPM25");

function renderMaxPM25(data){
  let pm25 = data["pm25"];
  let site = data["site"];
  let maxValue = Math.max(...pm25);
  let maxIndex = pm25.indexOf(maxValue);
  let maxSite = site[maxIndex];
  let minValue = Math.min(...pm25);
  let minIndex = pm25.indexOf(minValue);
  let minSite = site[minIndex];
  console.log(maxSite,maxValue,maxIndex);
  console.log(minSite,minValue,minIndex);


  pm25HighSite.innerText= maxSite;
  pm25HighValue.innerText= maxValue;
  pm25LowSite.innerText= minSite;
  pm25LowValue.innerText= minValue;
  
  dateE1.innerText = data["date"];

}

function drawPM25Chart2(data2){
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;

// prettier-ignore
  let dataAxis = data2["site"];
// prettier-ignore
  let data = data2["pm25"];
  let yMax = 500;
  let dataShadow = [];
  for (let i = 0; i < data.length; i++) {
  dataShadow.push(yMax);
}
option = {
    title: {
      text: '特性示例：渐变色 阴影 点击缩放',
      subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
  },
  xAxis: {
    data: dataAxis,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      },
      data: data
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize = 6;
myChart.on('click', function (params) {
  console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
  myChart.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
    endValue:
      dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
  });
});

option && myChart.setOption(option);
}

function drawChart(xdata,ydata,title= "",chart = null,color="#40e0d0"){
  let option = {
    title:{
      text: title
    },

    xAxis: {
      data: xdata
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        itemStyle:{
          color: color
        },
        data: ydata,
        type: "bar",
      },
    ],
  };
  chart.setOption(option);
}
