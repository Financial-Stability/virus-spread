/*jshint esversion: 6 */

// setup chart
var popc = document.getElementById("populationChart").getContext("2d");
var population = 0; // current x value
var time = 0; // current y value
var arrx = []; // x data array
var arry = []; // y data array
// initialize chart
var myChart = new Chart(popc, {
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

// graph growth functions

var grow = true;

function increment_number() {
  population++;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
}

function linear_growth() {
  grow = true;
  population++;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  if (grow) {
    setTimeout(linear_growth_helper, 100);
  }
}

function linear_growth_helper() {
  population++;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  if (grow) {
    setTimeout(linear_growth_helper, 100);
  }
}

function exponential_growth() {
  grow = true;
  population = population * population;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  if (grow) {
    setTimeout(exponential_growth_helper, 1000);
  }
}

function exponential_growth_helper() {
  population = population * population;
  time++;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  if (grow) {
    setTimeout(exponential_growth_helper, 1000);
  }
}

var r = 2; // growth rate
var K = 1000000; // carrying capacity

function logistic_growth() {
  grow = true;
  time++;
  population = population + r * ((K - population) / K) * population;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  if (grow) {
    setTimeout(logistic_growth_helper, 100);
  }
}

function logistic_growth_helper() {
  time++;
  population = population + r * ((K - population) / K) * population;
  arrx.push(time);
  arry.push(population);
  myChart.update();

  document.getElementById("display_num").innerHTML = population;
  if (grow) {
    setTimeout(logistic_growth_helper, 100);
  }
}

// graph buttons

var incBtn = document.getElementById("inc_num_btn");
incBtn.onclick = increment_number;

var startExpButton = document.getElementById("exp_start_btn");
startExpButton.onclick = exponential_growth;

var startLinButton = document.getElementById("lin_start_btn");
startLinButton.onclick = linear_growth;

var startLogButton = document.getElementById("log_start_btn");
startLogButton.onclick = logistic_growth;

var stopButton = document.getElementById("stop_btn");
stopButton.onclick = function() {
  grow = false;
};

var resetButton = document.getElementById("reset_btn");
resetButton.onclick = function() {
  arrx.length = 0;
  arry.length = 0;
  grow = false;
  population = 0;
  time = 0;
  myChart.update();
  document.getElementById("display_num").innerHTML = population;
};
