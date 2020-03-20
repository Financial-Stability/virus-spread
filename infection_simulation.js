/*jshint esversion: 6 */

const sheeps = ["🐑", "🐑", "🐑"];

function setupGraphs() {
  arrx.push(time);
  arry.push(countInfected());
  infChart.update();
}

function setup() {
  // put setup code here
  let canvas = createCanvas(600, 600);
  canvas.parent("canvascontainer");
  noStroke();
  background(220);
  // populate();
  noLoop();
  setupGraphs();
}

function draw() {
  // put drawing code here
  // loops forever unless noLoop is called
}

// Settings ======================================================================
var population_size = 10000;

// var start_infected_chance = document.getElementById("in_inf_input").value;
var start_infected_chance = 0.001;

// var infection_chance = document.getElementById("inf_input").value;
var infection_chance = 0.1;

var persons = [];
var side_size = Math.sqrt(population_size);
// ================================================================================

var startButton = document.getElementById("start_btn");
startButton.onclick = start;

var stopButton = document.getElementById("stop_btn");
stopButton.onclick = stop;

var settingsButton = document.getElementById("set_btn");
settingsButton.onclick = applySettings;

var infectButton = document.getElementById("inf_btn");
infectButton.onclick = infect;

function applySettings() {
  infection_chance = document.getElementById("inf_input").value / 100;
  start_infected_chance = document.getElementById("in_inf_input").value / 100;
  time = 0;
  // clear arrays
  arrx.length = 0;
  arry.length = 0;
  populate();
  infChart.update();
}

function populate() {
  // will be square

  class Person {
    constructor(infected) {
      this.infected = infected; // If healthy, false
      this.immune = false;
      this.dead = false;
    }
  }

  var individual_size = height / side_size / 1.5;

  // populate persons array
  var temp_persons = [];

  for (var x = 0; x < side_size; x++) {
    var temp_row = [];
    for (var y = 0; y < side_size; y++) {
      if (Math.random() < start_infected_chance) {
        temp_row.push(new Person(true));
      } else {
        temp_row.push(new Person(false));
      }
    }
    temp_persons.push(temp_row);
  }
  persons = JSON.parse(JSON.stringify(temp_persons));
  drawPeople();
}

function getPosition() {
  collumnNum = population_size % side_size;
  rowNum = Math.floor(population_size / side_size);
  return collumnNum, rowNum;
}

var doinfect = false;

function start() {
  doinfect = true;
  recursive_infect();
}

function stop() {
  doinfect = false;
}

function recursive_infect() {
  infect();
  if (doinfect) {
    setTimeout(recursive_infect, 10);
  }
}

function infect() {
  var temp_persons = JSON.parse(JSON.stringify(persons));
  num_infected = 0;

  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y].infected) {
        // above
        try {
          if (
            Math.random() < infection_chance &&
            !temp_persons[x - 1][y].infected
          ) {
            temp_persons[x - 1][y].infected = true;
            num_infected++;
          }
        } catch (error) {
          //do nothing
        }
        // below
        try {
          if (
            Math.random() < infection_chance &&
            !temp_persons[x + 1][y].infected
          ) {
            temp_persons[x + 1][y].infected = true;
            num_infected++;
          }
        } catch (error) {
          //do nothing
        }
        // left
        try {
          if (
            Math.random() < infection_chance &&
            !temp_persons[x][y - 1].infected
          ) {
            temp_persons[x][y - 1].infected = true;
            num_infected++;
          }
        } catch (error) {
          //do nothing
        }
        // right
        try {
          if (
            Math.random() < infection_chance &&
            !temp_persons[x][y + 1].infected
          ) {
            temp_persons[x][y + 1].infected = true;
            num_infected++;
          }
        } catch (error) {
          // do nothing
        }
      }
    }
  }

  console.log(num_infected);
  persons = temp_persons;
  time++;
  arrx.push(time);
  arry.push(countInfected());

  infChart.update();
  drawPeople();
  redraw();
}

function tryInfect(x,y) {
  
}

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
  if (persons.length == 0) {return 0;}
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
var arrx = []; // x data array
var arry = []; // y data array
// initialize chart
var infChart = new Chart(inf, {
  type: "line",
  data: {
    labels: arrx,
    datasets: [
      {
        // This dataset appears on the first axis
        label: "Infected Population",
        data: arry,
        borderWidth: 1,
        backgroundColor: "#0f0",
        yAxisID: "first-y-axis"
      }
      // ,
      // {
      //   // This dataset appears on the second axis
      //   label: "Total Population (not really yet)",
      //   data: arrx,
      //   yAxisID: "second-y-axis"
      // }
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
          // stacked: true
        }
      ]
    }
  }
});
