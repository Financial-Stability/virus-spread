/*jshint esversion: 6 */

/**
 * TODO LIST
 *
 * simulation
 * TODO: Grouping (boundaries are same thing?)
 * TODO: Travel
 * TODO: Boundaries, maybe user drawn or somehow randomly generated in interesting way
 * TODO: find way to fix the fact that virus can only spread to adjacent stops exponential growth, maybe with a spread radius variable
 *
 * settings UI
 * TODO: have input for population arrows increment by square numbers using the step attribute
 * TODO: sliders will be much nicer
 * TODO: tabbed settings, like this https://www.w3schools.com/w3css/w3css_tabulators.asp
 *
 * TODO: general theme and css styling
 * TODO: style buttons
 */

/**
 * Initialize Variables
 */

// simulation variables
var population_size = 50 * 50; // have default value be square number to fill nicely
var start_infected_chance = 0.005;
var infection_chance = 0.15;
var death_chance = 0.1;
var immune_develop_num = 5;
var persons = [];
var side_size = Math.ceil(Math.sqrt(population_size));
var num_infected = 0;
var immune_infect_others = false;
var immune_recover = true;
var develop_immunity = true;
var time_to_recover = 50;
var sim_spd = 10;
var percent_empty = 0.5;

// colors
var dead_color = "rgb(49, 62, 80)";
var immune_color = "rgb(234, 173, 233)";
var infected_color = "rgb(112, 175, 124)";
var healthy_color = "rgb(200, 200, 200)";

/**
 * Initialize Inputs
 */

// set html values to default values specified above
document.getElementById("inf_input").value = infection_chance * 100;
document.getElementById("in_inf_input").value = start_infected_chance * 100;
document.getElementById("death_input").value = death_chance * 100;
document.getElementById("imm_input").value = immune_develop_num;
document.getElementById("imm_infect").checked = immune_infect_others;
document.getElementById("imm_recover").checked = immune_recover;
document.getElementById("dev_imm").checked = develop_immunity;
document.getElementById("imm_recover_time").value = time_to_recover;
document.getElementById("sim_spd_input").value = sim_spd;
document.getElementById("pop_size_input").value = population_size;

// setup buttons
var startButton = document.getElementById("start_btn");
startButton.onclick = start;

var stopButton = document.getElementById("stop_btn");
stopButton.onclick = stop;

var settingsButton = document.getElementById("set_btn");
settingsButton.onclick = applySettings;

var infectButton = document.getElementById("inf_btn");
infectButton.onclick = doTimestep;

/**
 * Applies settings from html inputs into backend
 */
function applySettings() {
  stop();
  infection_chance = document.getElementById("inf_input").value / 100;
  start_infected_chance = document.getElementById("in_inf_input").value / 100;
  death_chance = document.getElementById("death_input").value / 100;
  immune_develop_num = document.getElementById("imm_input").value;
  immune_infect_others = document.getElementById("imm_infect").checked;
  immune_recover = document.getElementById("imm_recover").checked;
  develop_immunity = document.getElementById("dev_imm").checked;
  time_to_recover = document.getElementById("imm_recover_time").value;
  sim_spd = document.getElementById("sim_spd_input").value;
  population_size = document.getElementById("pop_size_input").value;
  side_size = Math.ceil(Math.sqrt(population_size));

  time = 0;
  arrx.length = 0;

  arrys[0].length = 0;
  arrys[1].length = 0;
  arrys[2].length = 0;
  arrys[3].length = 0;

  populate();
  infChart.update();
}

/**
 * Setup Chart
 */
var inf = document.getElementById("infectedChart").getContext("2d");
var time = 0; // current x value
var arrx = []; // x data array
var arrys = [[], [], [], []]; // y value data arrays

var infChart = new Chart(inf, {
  type: "line",
  data: {
    labels: arrx,
    datasets: [
      {
        // infected population
        label: "Infected Population",
        data: arrys[0],
        borderWidth: 1,
        backgroundColor: infected_color
      },
      {
        // immune population
        label: "Immune Population",
        data: arrys[2],
        backgroundColor: immune_color
      },
      {
        // dead population
        label: "Dead Population",
        data: arrys[1],
        backgroundColor: dead_color
      },
      {
        // healthy population
        label: "Healthy Population",
        data: arrys[3],
        backgroundColor: healthy_color
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
          stacked: true,
          display: false
        }
      ]
    }
  }
});

/**
 * Sets up graph for the first time by pushing initial values
 */
function setupGraphs() {
  arrys[0].push(getTotals().infected);
  arrys[1].push(getTotals().dead);
  arrys[2].push(getTotals().immune);
  arrys[3].push(getTotals().healthy);

  infChart.update();
}

/**
 * Setup p5 stuff
 */

/**
 * Setup function that runs once to setup p5 stuff
 */
function setup() {
  let canvas = createCanvas(displayWidth / 2, displayWidth / 2);
  canvas.parent("canvascontainer");
  noStroke();
  background(220);
  noLoop();
  applySettings();
  setupGraphs();
  setupGraphs();
}

/**
 * Draw function disabled with noLoop() in setup().
 */
function draw() {}

/**
 * Class to represent a person
 */
class Person {
  constructor(infected) {
    this.infected = infected; // If healthy, false
    this.immune = false;
    this.dead = false;
    this.survivedTime = 0;
  }
}

/**
 * Populates the p5 canvas with a new population based on settings
 */
function populate() {
  // populate persons array
  var temp_persons = [];

  // fill shoulder to shoulder
  // for (var x = 0; x < side_size; x++) {
  //   var temp_row = [];
  //   for (var y = 0; y < side_size; y++) {
  //     if (x * side_size + y < population_size) {
  //       if (Math.random() < start_infected_chance) {
  //         temp_row.push(new Person(true));
  //       } else {
  //         temp_row.push(new Person(false));
  //       }
  //     } else {
  //       temp_row.push(null);
  //     }
  //   }
  //   temp_persons.push(temp_row);
  // }

  // fill with spaces
  side_size = Math.ceil(side_size / (1 - percent_empty)); // make bigger

  for (var x = 0; x < side_size; x++) {
    var temp_row = [];
    for (var y = 0; y < side_size; y++) {
      // if need more people, maybe place
      if (x * side_size + y < population_size) {
        if (Math.random() < start_infected_chance) {
          temp_row.push(new Person(true));
        } else {
          temp_row.push(new Person(false));
        }
      }
    }
    temp_persons.push(temp_row);
  }

  persons = JSON.parse(JSON.stringify(temp_persons));
  drawPeople();
}

/**
 *
 */
function getPosition() {
  collumnNum = population_size % side_size;
  rowNum = Math.floor(population_size / side_size);
  return collumnNum, rowNum;
}

// sentinel variable to control animations
var do_animation = false;

/**
 * Starts infection animation
 */
function start() {
  do_animation = true;
  recursive_timestep();
}

/**
 * Stops infection animation and calculations
 */
function stop() {
  do_animation = false;
}

/**
 * Recursive helper for infection animation and calculations
 */
function recursive_timestep() {
  doTimestep();
  if (do_animation) {
    setTimeout(recursive_timestep, sim_spd);
  }
}

/**
 * Calculates one time step (infections, deaths, immunities, etc.)
 */
function doTimestep() {
  var temp_persons = JSON.parse(JSON.stringify(persons)); // Copy of persons

  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y] != null) {
        // if infected
        if (
          persons[x][y].infected &&
          !persons[x][y].dead &&
          (!persons[x][y].immune || immune_infect_others)
        ) {
          // infect others
          temp_persons = infectOthers(x - 1, y, temp_persons); // Left
          temp_persons = infectOthers(x + 1, y, temp_persons); // Right
          temp_persons = infectOthers(x, y - 1, temp_persons); // Up
          temp_persons = infectOthers(x, y + 1, temp_persons); // Down

          // effects of infection on person (death, immunity)
          temp_persons = applyInfection(x, y, temp_persons);
        }
        // if immune
        if (immune_recover && persons[x][y].immune) {
          temp_persons = applyRecovery(x, y, temp_persons);
        }
      } else {
        // do nothing
      }
    }
  }
  persons = temp_persons;

  // apply to graphs
  arrx.push(time);
  time++;
  arrys[0].push(getTotals().infected);
  arrys[1].push(getTotals().dead);
  arrys[2].push(getTotals().immune);
  arrys[3].push(getTotals().healthy);
  infChart.update();
  // apply to p5
  drawPeople();
}

/**
 * Applies the effects of the infection onto one person. The effects being death, or development of immunity.
 * @param {*} x
 * @param {*} y
 * @param {*} temp_persons
 */
function applyInfection(x, y, temp_persons) {
  // Should be called only on infected person
  try {
    random_number = Math.random(0, 1);
    // if not dead or immune
    if (!temp_persons[x][y].dead && !temp_persons[x][y].immune) {
      if (
        develop_immunity &&
        temp_persons[x][y].survivedTime >= immune_develop_num
      ) {
        // lived long enough with infection to develop immunity
        temp_persons[x][y].immune = true;
        temp_persons[x][y].survivedTime = 0;
      } else if (random_number < death_chance) {
        // dies
        temp_persons[x][y].dead = true;
      } else {
        // survives a little longer
        temp_persons[x][y].survivedTime++;
      }
    }
  } catch (error) {}
  return temp_persons;
}

/**
 * Returns an updated 2d array after infecting one person
 * @param {*} x
 * @param {*} y
 * @param {*} temp_persons
 */
function infectOthers(x, y, temp_persons) {
  try {
    if (
      Math.random() < infection_chance &&
      !temp_persons[x][y].infected &&
      !temp_persons[x][y].immune
    ) {
      temp_persons[x][y].infected = true;
      num_infected++;
    }
  } catch (error) {}
  return temp_persons;
}

/**
 * Tracks person's recovery after becoming immune to becoming healthy again. (A normal person who can be infected again)
 * Should be called after if person is infected/immune/dead check is done
 * @param {*} x
 * @param {*} y
 * @param {*} temp_persons
 */
function applyRecovery(x, y, temp_persons) {
  try {
    if (temp_persons[x][y].survivedTime >= time_to_recover) {
      // enough time passed to recover
      temp_persons[x][y].infected = false;
      temp_persons[x][y].immune = false;
      temp_persons[x][y].survivedTime = 0;
    } else {
      // more time until recovered
      temp_persons[x][y].survivedTime++;
    }
  } catch (error) {}
  return temp_persons;
}

/**
 * Draw the current population to the p5 graph
 */
function drawPeople() {
  clear();
  var individual_size = height / side_size / 1.5;
  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y] != null) {
        if (persons[x][y].dead) {
          fill(color(dead_color)); // dead color
        } else if (persons[x][y].immune) {
          fill(color(immune_color)); // immune color
        } else {
          if (persons[x][y].infected) {
            fill(color(infected_color)); // infected color
          } else {
            fill(color(healthy_color)); // healthy color
          }
        }
        circle(
          x * (height / side_size) + height / side_size / 2,
          y * (height / side_size) + height / side_size / 2,
          individual_size
        );
      } else {
        // draw nothing
      }
    }
  }
  redraw();
}

/**
 * Gets the number of each demographic for plotting on the graph
 *
 * Returns an object with labels infected, dead, immune, healthy with values
 * corrisponding to each demographic's population size
 */
function getTotals() {
  infected = 0;
  dead = 0;
  immune = 0;
  healthy = 0;

  if (persons.length == 0) {
    return 0;
  }

  for (var x = 0; x < persons.length; x++) {
    for (var y = 0; y < persons[0].length; y++) {
      if (persons[x][y] != null) {
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
  }
  return { infected: infected, dead: dead, immune: immune, healthy: healthy };
}
