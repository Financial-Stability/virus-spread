var num = 0;
var button = document.getElementById("inc_num");
button.onclick = show_number;

var tit = document.getElementById("title");
tit.onclick = show_number;

function show_number() {
    num++;
    document.getElementById("display_num").innerHTML = num;
}