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

function stop() {
  grow = false;
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
stopButton.onclick = stop;

function setup() {
  // put setup code here
  createCanvas(400, 400);
  background(220);
  populate();
  noLoop();
}

function draw() {
  // put drawing code here
  // loops forever unless noLoop is called
}

function populate() {
  // completely fill
  // for (var i = 1; i < width / 20; i++) {
  //   for (var j = 1; j < height / 20; j++) {
  //     circle(i * 20, j * 20, 10);
  //   }
  // }
  var arr = [];
  for (var i = 0; i < 100; i++) {
    arr.push(i);
  }
  // fill to certain amount w/ golden ratio
  // the golden ratio: 2.11803398875
  var n = arr.length;
  var PHI = 1 + Math.sqrt(5) / 2;
  for (var i = 0; i < n; i++) {
    var theta = Math.PI * PHI * arr[i];
    // var r = Math.sqrt((arr[i] + 0.5) / n);
    var r = (arr[i] + 0.5) / n
    console.log("r: " + r);
    circle(
      (r * Math.cos(theta) + 1) * (width / 2),
      (r * Math.sin(theta) + 1) * (height / 2),
      10
    );
    // console.log(i / n + ", " + i / 2.11803398875);
    // console.log(r * Math.sin(theta) + ", " + r * Math.cos(theta / n));
    console.log(r * Math.cos(theta) + 1 + ", " + (r * Math.sin(theta / n) + 1));
  }
  redraw();
}
