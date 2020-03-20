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
  population_size = 100;

  axis_size = Math.sqrt(population_size);

  // xCoords = [];
  // yCoords = [];
  // infected = [];

  class Person {
    constructor(x, y, infected) {
      this.x = x;
      this.y = y;
    }
  }

  persons = [];

  // assume height = width
  // space_between = 5; //px
  var individal_size = height / axis_size;

  for (var x = 0; x < axis_size; x++) {
    // this is wrong
    for (var y = 0; y < axis_size; y++) {
      persons.push(
        new Person(x * (height / individal_size), y * (height / individal_size))
      );
      console.log("(" + x + ", " + y + ")");
    }
  }

  for (var i = 0; i < persons.length; i++) {
    circle(persons[i].x, persons[i].y, individal_size);
  }
}
