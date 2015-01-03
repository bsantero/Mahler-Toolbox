function selectInterface(interface) {
  ui.currentInterface = $(this).data("interface") || interface;
  $("#" + ui.currentInterface + "Ui").show();
  $("#" + ui.currentInterface + "Ui").siblings().hide();
  $("#" + ui.currentInterface + "Heading").siblings().removeClass("currentInterfaceHeading");
  $("#" + ui.currentInterface + "Heading").addClass("currentInterfaceHeading");
  $(".menuContainer").hide();
  $(".menu").hide();
  $("#" + ui.currentInterface + "Menus").show();
}

function menuBtnPress(menu) {
  $("#" + menu + "Button").siblings().removeClass("clicked");
  $("#" + menu + "Button").toggleClass("clicked");
  $("#" + ui.currentInterface + menu + "Menu").siblings().fadeOut(250);
  $("#" + ui.currentInterface + menu + "Menu").fadeToggle(250);
}

function buttonRouter(passedState) {
	var destination;
	if (passedState.ui) {
		destination = passedState;
	} else {
  	destination = $(this).data("dest");
	}
	console.log(destination);
  switch (destination.ui) {
  	case "drone":
  		switch (destination.action) {
  			case "Toggle":
  			case "Play":
  			case "Stop":
					dronePlay();
					break;
				case "Default":
    			setUserDefault();
    			break;
    		case "Reset":
    			resetPitch();
    			break;
  		}
  		break;
    case "gnome":
    	switch (destination.action) {
  			case "Toggle":
  			case "Play":
  			case "Stop":
					gnomePlay();
					break;
  		}
      break;
  }
  this.blur();
}

$(document).ready(function() {

	console.log(ui.currentInterface);
  
  //Instantiate our audio engine
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  //Create Drone.js elements
  droneInit();

  //Create Gnome.js elements
  gnomeInit();

  // selectInterface("gnome");

  //Create our event handlers
  $("#navbar .clickable").on("click", selectInterface);

  $(".ctlButton").on("click", buttonRouter);

  $("#InfoButton").on("click", function(){
    menuBtnPress("Info");
  });
  $("#SettingsButton").on("click", function(){
    menuBtnPress("Settings");
  });
  $("#droneVolMinus").on("click", function(){
    volumeChange("down");
  });
  $("#droneVolPlus").on("click", function(){
    volumeChange("up");
  });
  $("#calibrateDown").on("click", function(){
    calibratePitch("down");
  });
  $("#calibrateUp").on("click", function(){
    calibratePitch("up");
  });

  $("#droneUp").on("click", function(){
    pitchChange("up");
  });
  $("#droneDown").on("click", function(){
    pitchChange("down");
  });

  $("#subdivisionSelector").change(function(){
  	gnome.subdivision.selected = $(this).val();
  });

  //Create keyboard shortcut event handlers
  var listener = new window.keypress.Listener();

  listener.simple_combo('alt 1', function() {
    selectInterface("drone");
  });
  listener.simple_combo('alt 2', function() {
    selectInterface("gnome");
  });
  listener.simple_combo('alt 3', function() {
    //selectInterface("quencher");
  });
  listener.simple_combo('[', function() {
    menuBtnPress("Info");
  });
  listener.simple_combo(']', function() {
    menuBtnPress("Settings");
  });
  listener.simple_combo('down', function(){
    pitchChange("down");
  });
  listener.simple_combo('up', function(){ 
    pitchChange("up");
  });
  listener.simple_combo('-', function(){
    volumeChange("down");
  });
  listener.simple_combo('=', function(){
    volumeChange("up");
  });
  listener.simple_combo('left', function(){ 
    calibratePitch("down");
  });
  listener.simple_combo('right', function(){ 
    calibratePitch("up");
  });
  listener.simple_combo('space', function(){
  	buttonRouter({"ui":ui.currentInterface, "action":"Toggle"});
  });
  listener.simple_combo('shift', function(){
    resetPitch();
  });

});