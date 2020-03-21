/*jshint esversion: 6 */

const sheeps = ["🐑", "🐑", "🐑"];

// setup chart
var inf = document.getElementById("infectedChart").getContext("2d");
// countInfected(); // current x value
var time = 0; // current y value
var arrx = []; // x data array

// var arrys = new Array(4);
// for (var i = 0; i < arrys.length; i++) {
//   arrys[i] = [];
// }
var arrys = [[], [], [], []];

// initialize chart
var infChart = new Chart(inf, {
  type: "line",
  data: {
    labels: arrx,
    datasets: [
      {
        // This dataset appears on the first axis
        label: "Infected Population",
        data: arrys[0],
        borderWidth: 1,
        backgroundColor: "rgba(0, 255, 0, 0.5)"
      },
      {
        // This dataset appears on the second axis
        label: "Immune Population",
        data: arrys[2],
        backgroundColor: "rgba(255, 105, 180, 0.5)"
      },
      {
        // This dataset appears on the second axis
        label: "Dead Population",
        data: arrys[1],
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      },
      {
        // This dataset appears on the second axis
        label: "Healthy Population",
        data: arrys[3],
        backgroundColor: "rgba(50, 50, 50, 0.5)"
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
          },
          stacked: true
        }
      ]
    }
  }
});

function setupGraphs() {
  arrx.push(time);

  arrys[0].push(getTotals().infected);
  arrys[1].push(getTotals().dead);
  arrys[2].push(getTotals().immune);
  arrys[3].push(getTotals().healthy);

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
var death_chance = 0.1;
var immune_develop_num = 10;

var persons = [];
var side_size = Math.sqrt(population_size);
// Init ============================================================================

var num_infected = 0;

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
  death_chance = document.getElementById("death_input").value / 100;
  immune_develop_num = document.getElementById("imm_input").value;
  time = 0;
  arrx.length = 0;

  arrys[0].length = 0;
  arrys[1].length = 0;
  arrys[2].length = 0;
  arrys[3].length = 0;

  populate();
  infChart.update();
}

class Person {
  constructor(infected) {
    this.infected = infected; // If healthy, false
    this.immune = false;
    this.dead = false;
    this.survivedTime = 0;
  }
}

function populate() {
  // will be square

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
  var temp_persons = JSON.parse(JSON.stringify(persons)); // Copy of persons
  var immune_infect_others = false;

  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (
        persons[x][y].infected &&
        !persons[x][y].dead &&
        (!persons[x][y].immune || immune_infect_others)
      ) {
        temp_persons = applyInfection(x - 1, y, temp_persons); //Left
        temp_persons = applyInfection(x + 1, y, temp_persons); //Right
        temp_persons = applyInfection(x, y - 1, temp_persons); //Up
        temp_persons = applyInfection(x, y + 1, temp_persons); //Down

        // temp_persons = applyDeath(x - 1, y, temp_persons);
        // temp_persons = applyDeath(x + 1, y, temp_persons);
        // temp_persons = applyDeath(x, y - 1, temp_persons);
        // temp_persons = applyDeath(x, y + 1, temp_persons);
        temp_persons = applyDeath(x, y, temp_persons);
      }
    }
  }

  // console.log(num_infected);

  persons = temp_persons;
  time++;

  arrx.push(time);

  arrys[0].push(getTotals().infected);
  arrys[1].push(getTotals().dead);
  arrys[2].push(getTotals().immune);
  arrys[3].push(getTotals().healthy);

  infChart.update();
  drawPeople();
  redraw();
}

function applyDeath(x, y, temp_persons) {
  // Should be called after if person is infected/immune/dead check is done
  // immune_chance = 0.05; The rest of the thing is immune chance

  try {
    random_number = Math.random(0, 1);
    if (!temp_persons[x][y].dead && !temp_persons[x][y].immune) {
      if (temp_persons[x][y].survivedTime >= immune_develop_num) {
        temp_persons[x][y].immune = true;
        temp_persons[x][y].infected = false;
      } else if (random_number < death_chance) {
        temp_persons[x][y].dead = true;
      } else {
        temp_persons[x][y].survivedTime++;
      }
    }
  } catch (error) {
    //do nothing
  }
  return temp_persons;
}

function applyInfection(x, y, temp_persons) {
  // Returns an updated 2d array after infecting one person
  try {
    if (
      Math.random() < infection_chance &&
      !temp_persons[x][y].infected &&
      !temp_persons[x][y].immune
    ) {
      temp_persons[x][y].infected = true;
      num_infected++;
    }
  } catch (error) {
    //do nothing
  }
  return temp_persons;
}

function drawPeople() {
  var side_size = Math.sqrt(population_size);
  var individual_size = height / side_size / 1.5;
  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y].dead) {
        fill(color("rgb(0, 0, 0)"));
      } else if (persons[x][y].immune) {
        fill(color("rgb(255, 105, 180)"));
      } else {
        if (persons[x][y].infected) {
          fill(color("rgb(0, 255, 0)"));
        } else {
          fill(color("rgb(255, 255, 255)"));
        }
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

function getTotals() {
  infected = 0;
  dead = 0;
  immune = 0;
  healthy = 0; // not immune

  if (persons.length == 0) {
    return 0;
  }

  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y].dead) {
        dead++;
      } else if (persons[x][y].immune) {
        immune++;
      } else if (persons[x][y].infected) {
        infected++;
      } else {
        healthy++;
      }
    }
  }
  return { infected: infected, dead: dead, immune: immune, healthy: healthy };
}
