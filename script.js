var ctx = document.getElementById("myChart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
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

function show_number() {
  num++;
  document.getElementById("display_num").innerHTML = num;
}

function exponential_growth() {
  num = num * num;
  // console.log("exponential growth to " + num);
  document.getElementById("display_num").innerHTML = num;
  setTimeout(exponential_growth, 1000);
}

function logistic_curve() {
  var L = 1000000;
  var k = 0.01;
  var x;
  var x0;
  num = L / (1 + Math.pow(Math.E, -k * (x - x0)));
  console.log(num);
  document.getElementById("display_num").innerHTML = num;
  setTimeout(logistic_curve, 1000);
}

var num = 0;

var button = document.getElementById("inc_num");
button.onclick = show_number;

var startButton = document.getElementById("start_btn");
// startButton.onclick = exponential_growth;
startButton.onclick = logistic_curve;
