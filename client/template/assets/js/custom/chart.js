 
const socket = io();


const canva = document.getElementById("funciona");
const ctx = canva.getContext("2d");
isPlotting = true;
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

function changeButtonColor() {

      var button = document.getElementById("serialButton");
      var chart = document.getElementById("funciona")

      if (button.classList.contains("btn-inverse-danger")) {

        button.classList.remove("btn-inverse-danger");
        button.classList.add("btn-inverse-success");

        button.innerText = "Run serial";

      //isPlotting = false
      } else {

        button.classList.remove("btn-inverse-success");
        button.classList.add("btn-inverse-danger");

        button.innerText = "Stop serial";

        //isPlotting = true
      }

    }