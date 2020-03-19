// setup chart
var ctx = document.getElementById("myChart").getContext("2d");
var population = 0; // current x value
var time = 0; // current y value
let arrx = []; // x data array
let arry = []; // y data array
// initialize chart
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: arrx,
    datasets: [
      {
        label: "Population",
        data: arry,
        borderWidth: 1
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});

function increment_number() {
  population++;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
}

function linear_growth() {
  population++;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  setTimeout(linear_growth, 1000);
}

function exponential_growth() {
  population = population * population;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  setTimeout(exponential_growth, 1000);
}

var r = 2; // growth rate
var K = 1000000; // carrying capacity

function logistic_curve() {
  time++;
  population = population + r * ((K - population) / K) * population;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  setTimeout(logistic_curve, 1000);
}

var incBtn = document.getElementById("inc_num_btn");
incBtn.onclick = increment_number;

var startExpButton = document.getElementById("exp_start_btn");
startExpButton.onclick = exponential_growth;

var startLinButton = document.getElementById("lin_start_btn");
startLinButton.onclick = linear_growth;

var startLogButton = document.getElementById("log_start_btn");
startLogButton.onclick = logistic_curve;
