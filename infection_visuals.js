// show/hide buttons

var immune_recover = document.getElementById("dev_imm");
immune_recover.onclick = function() {
  if (document.getElementById("dev_imm").checked) {
    document.getElementById("immunity_settings").style.display = "block";
  } else {
    document.getElementById("immunity_settings").style.display = "none";
  }
};

var immune_recover = document.getElementById("imm_recover");
immune_recover.onclick = function() {
  if (document.getElementById("imm_recover").checked) {
    document.getElementById("recovery_time_settings").style.display = "block";
  } else {
    document.getElementById("recovery_time_settings").style.display = "none";
  }
};

var showhidegraphButton = document.getElementById("showhide_graph");
showhidegraphButton.onclick = function() {
  if (document.getElementById("chart-container").style.display == "none") {
    document.getElementById("chart-container").style.display = "block";
  } else if (
    document.getElementById("chart-container").style.display == "block"
  ) {
    document.getElementById("chart-container").style.display = "none";
  }
};