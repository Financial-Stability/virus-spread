var num = 0;
var button = document.getElementById("inc_num");
button.onclick = show_number;

var startButton = document.getElementById("exp_growth");
startButton.onclick = exponential_growth;

function show_number() {
    num++;
    document.getElementById("display_num").innerHTML = num;
}

function exponential_growth() {
    num = num * num;
    setTimeout(exponential_growth, 1000);
    console.log("exponential growth to " + num);
    document.getElementById("display_num").innerHTML = num;
}