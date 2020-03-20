/*jshint esversion: 6 */

const sheeps = ["🐑", "🐑", "🐑"];

// setup chart
var ctx = document.getElementById("myChart").getContext("2d");
var population = 0; // current x value
var time = 0; // current y value
var arrx = []; // x data array
var arry = []; // y data array
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
  noStroke();
  background(220);
  populate();
  noLoop();
}

function draw() {
  // put drawing code here
  // loops forever unless noLoop is called
}

// Start Population Code
var population_size = 100;
var infection_chance = 0.2;
var persons = [];
var side_size = Math.sqrt(population_size);

function populate() {
  // will be square

  class Person {
    constructor(infected) {
      this.infected = infected;
    }
  }

  var individual_size = height / side_size / 1.5;

  // populate persons array
  for (var x = 0; x < side_size; x++) {
    var temp_row = [];
    for (var y = 0; y < side_size; y++) {
      if (Math.random() < 0.05) {
        temp_row.push(new Person(true));
      } else {
        temp_row.push(new Person(false));
      }
    }
    persons.push(temp_row);
  }

  // Used to draw people to screen
  // for (var x = 0; x < side_size; x++) {
  //   for (var y = 0; y < side_size; y++) {
  //     persons.push(
  //       new Person(
  //         x * (height / side_size) + height / side_size / 2,
  //         y * (height / side_size) + height / side_size / 2
  //       )
  //     );
  //     // console.log("(" + x + ", " + y + ")");
  //   }
  // }

  drawPeople();
}

function getPosition() {
  collumnNum = population_size % side_size;
  rowNum = Math.floor(population_size / side_size);
  return collumnNum, rowNum;
}

function infect() {
  old_persons = JSON.parse(JSON.stringify(persons));
  console.log(sheeps);

  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y].infected) {
        // above
        try {
          if (Math.random() > infection_chance) {
            old_persons[x - 1][y].infected = true;
          }
        } catch (error) {
          //do nothing
        }
        // below
        try {
          if (Math.random() > infection_chance) {
            old_persons[x + 1][y].infected = true;
          }
        } catch (error) {
          //do nothing
        }
        // left
        try {
          if (Math.random() > infection_chance) {
            old_persons[x][y - 1].infected = true;
          }
        } catch (error) {
          //do nothing
        }
        // right
        try {
          if (Math.random() > infection_chance) {
            old_persons[x][y + 1].infected = true;
          }
        } catch (error) {
          // do nothing
        }
      }
    }
  }
  persons = old_persons;
  drawPeople();
  redraw();
}

var infectButton = document.getElementById("inf_btn");
infectButton.onclick = infect;

function drawPeople() {
  var side_size = Math.sqrt(population_size);
  var individual_size = height / side_size / 1.5;
  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y].infected) {
        fill(color("#0f0"));
      } else {
        fill(color("#FFF"));
      }
      circle(
        x * (height / side_size) + height / side_size / 2,
        y * (height / side_size) + height / side_size / 2,
        individual_size
      );
    }
  }
}
