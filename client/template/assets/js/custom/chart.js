// In this script we manage all the data related to the charts

const socket = io();

// Chart #1: Field vs time
const canva = document.getElementById("fieldVsTime");
const ctx = canva.getContext("2d");

const data = {
  labels: [],
  datasets: [
    {
      label: "Serial",
      data: [],
      fill: true,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
      spanGaps: true
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top"
    },
    title: {
      display: true,
      text: "Chart.js Line Chart"
    }
  },
  scales: {
    xAxes: [
      {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    ]
  }
};

const chart = new Chart(ctx, {
  type: "line",
  data: data,
  options: options,
});


let counter = 0;
socket.on("arduino:data", function(dataSerial) {
  console.log(dataSerial)
  if (isPlotting){ 
    chart.data.labels.push(counter);
    chart.data.datasets[0].data.push(dataSerial);
    counter++;
  }
  
  // Limit the number of points shown on the chart
  const maxPoints = 10;
  if (chart.data.labels.length > maxPoints) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
});

  
  socket.on("arduino:data", function(dataSerial){
      chart.data.labels.push(counter);
      chart.data.datasets.forEach(dataset => {
        dataset.data.push(dataSerial.value);
      })
      counter++;
      chart.update();
    });

// Chart #2: Field vs distance
const FIELD_VS_DISTANCE_CANVA = document.getElementById('fieldVsDistance')

// Chart #3: Magnetic flux
const MAGNETIC_FLUX_CANVA = document.getElementById('magneticFlux')