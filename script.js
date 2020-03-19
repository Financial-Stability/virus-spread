

var num = 0;

var button = document.getElementById("inc_num");
button.onclick = show_number;

var startButton = document.getElementById("start_btn");
// startButton.onclick = exponential_growth;
startButton.onclick = logistic_curve;

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
    var k = .01;
    var x;
    var x0;
    num = L / (1 + Math.pow(Math.E, -k * (x - x0)));
    console.log(num);
    document.getElementById("display_num").innerHTML = num;
    setTimeout(logistic_curve, 1000);
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
});
}