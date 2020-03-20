/*jshint esversion: 6 */

const sheeps = ["🐑", "🐑", "🐑"];

function setupGraphs() {
  // arrx.push(time);
  // arry.push(population);
  // myChart.update();

  inf_arrx.push(time);
  inf_arry.push(countInfected());
  infChart.update();
}

function setup() {
  // put setup code here
  createCanvas(400, 400);
  noStroke();
  background(220);
  populate();
  noLoop();
  setupGraphs();
}

function draw() {
  // put drawing code here
  // loops forever unless noLoop is called
}

// Start Population Code
var population_size = 10000;
var infection_chance = document.getElementById("inf_input").value;
var persons = [];
var side_size = Math.sqrt(population_size);
// var start_infected_chance = document.getElementById("in_inf_input").value;
var start_infected_chance = 0.05;

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
      if (Math.random() < start_infected_chance) {
        temp_row.push(new Person(true));
      } else {
        temp_row.push(new Person(false));
      }
    }
    persons.push(temp_row);
  }
  drawPeople();
}

function getPosition() {
  collumnNum = population_size % side_size;
  rowNum = Math.floor(population_size / side_size);
  return collumnNum, rowNum;
}

function infect() {
  var var_persons = JSON.parse(JSON.stringify(persons));
  num_infected = 0;

  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y].infected) {
        // above
        try {
          if (
            Math.random() > infection_chance &&
            !var_persons[x - 1][y].infected
          ) {
            var_persons[x - 1][y].infected = true;
            num_infected++;
          }
        } catch (error) {
          //do nothing
        }
        // below
        try {
          if (
            Math.random() > infection_chance &&
            !var_persons[x + 1][y].infected
          ) {
            var_persons[x + 1][y].infected = true;
            num_infected++;
          }
        } catch (error) {
          //do nothing
        }
        // left
        try {
          if (
            Math.random() > infection_chance &&
            !var_persons[x][y - 1].infected
          ) {
            var_persons[x][y - 1].infected = true;
            num_infected++;
          }
        } catch (error) {
          //do nothing
        }
        // right
        try {
          if (
            Math.random() > infection_chance &&
            !var_persons[x][y + 1].infected
          ) {
            var_persons[x][y + 1].infected = true;
            num_infected++;
          }
        } catch (error) {
          // do nothing
        }
      }
    }
  }
  console.log(num_infected);
  persons = var_persons;
  time++;
  inf_arrx.push(time);
  inf_arry.push(countInfected());
  infChart.update();
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

// graph functions

function countInfected() {
  infected = 0;
  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y].infected) {
        infected++;
      }
    }
  }
  return infected;
}

// setup chart
var inf = document.getElementById("infectedChart").getContext("2d");
// countInfected(); // current x value
var time = 0; // current y value
var inf_arrx = []; // x data array
var inf_arry = []; // y data array
// initialize chart
var infChart = new Chart(inf, {
  type: "line",
  data: {
    labels: inf_arrx,
    datasets: [
      {
        label: "Infected Population",
        data: inf_arry,
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
