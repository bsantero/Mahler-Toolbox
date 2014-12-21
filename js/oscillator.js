var settings = {};
settings.currentPitch = {"name": "A", "octave": 4, "frequency": 440};
settings.userDef = {"name": "A", "octave": 4, "frequency": 440};
settings.isPlaying = false;
//settings.keydir = null;

function calcFreq(direction, reset) {
  var pitch = settings.currentPitch,
    userPitch = settings.userDef;
    exponent = undefined;
  if (reset) {
    pitch.name = userPitch.name;
    pitch.octave = userPitch.octave;
    pitch.frequency = userPitch.frequency;
    $("span.display.pitch").html(pitch.name);
    $("span.display.octave").html(pitch.octave);
  } else {
    if (direction === "up") exponent = 1; else if (direction === "down") exponent = -1;
    pitch.frequency = pitch.frequency * Math.pow(1.059463094359, exponent);
  }
  oscillator.frequency.value = pitch.frequency;
  $("span.display.frequency").html(Math.round(pitch.frequency) + "Hz");
}

function pitchChange(keydir) {
  var direction = keydir || $(this).data("direction"),
    pitch = settings.currentPitch;
  if ((direction === "up" && pitch.frequency * Math.pow(1.059463094359, 1) >= 1761) || (direction === "down" && pitch.frequency * Math.pow(1.059463094359, -1) <= 54 )) return;
  switch (pitch.name) {
    case "A":
      if (direction === "up") {
        pitch.name = "A#";
      } else pitch.name = "G#";
      break;
    case "A#":
      if (direction === "up") {
        pitch.name = "B";
      } else pitch.name = "A";
      break;
    case "B":
      if (direction === "up") {
        pitch.name = "C";
        pitch.octave++;
      } else pitch.name = "A#";
      break;
    case "C":
      if (direction === "up") {pitch.name = "C#";} else {
        pitch.name = "B";
        pitch.octave--;
      }
      break;
    case "C#":
      if (direction === "up") {
        pitch.name = "D";
      } else pitch.name = "C";
      break;
    case "D":
      if (direction === "up") {
        pitch.name = "D#";
      } else pitch.name = "C#";
      break;
    case "D#":
      if (direction === "up") {
        pitch.name = "E";
      } else pitch.name = "D";
      break;
    case "E":
      if (direction === "up") {
        pitch.name = "F";
      } else pitch.name = "D#";
      break;
    case "F":
      if (direction === "up") {
        pitch.name = "F#";
      } else pitch.name = "E";
      break;
    case "F#":
      if (direction === "up") {
        pitch.name = "G";
      } else pitch.name = "F";
      break;
    case "G":
      if (direction === "up") {
        pitch.name = "G#";
      } else pitch.name = "F#";
      break;
    case "G#":
      if (direction === "up") {
        pitch.name = "A";
      } else pitch.name = "G";
      break;
  }
  calcFreq(direction);
  $("span.display.pitch").html(pitch.name);
  $("span.display.octave").html(pitch.octave);
  settings.keydir = null;
}

function newOsc() {
  oscillator = context.createOscillator(); // Create bass guitar
  gainNode = context.createGain(); // Create boost pedal 
  oscillator.connect(gainNode); // Connect bass guitar to boost pedal
  gainNode.connect(context.destination); // Connect boost pedal to amplifier
  gainNode.gain.value = 1; // Set boost pedal to 30 percent volume
}

function playPitch() {
  newOsc();
  console.log("playing "+settings.currentPitch.frequency);
  oscillator.frequency.value = settings.currentPitch.frequency;
  if (window.AudioContext) {
    oscillator.start();
  } else {
    oscillator.start(context.currentTime);
  }
  settings.isPlaying = true;
  $("button#play").hide();
  $("button#stop").show();
}

function stopPitch() {
  if (window.AudioContext) {
    oscillator.stop();
  } else {
    oscillator.stop(context.currentTime);
  }
  settings.isPlaying = false;
  $("button#stop").hide();
  $("button#play").show();
}

function setUserDefault(definedPitch){
  if (definedPitch) {
  } else {
    console.log("Default set to: " + settings.currentPitch.name + settings.currentPitch.octave);
    settings.userDef.name = settings.currentPitch.name;
    settings.userDef.octave = settings.currentPitch.octave;
    settings.userDef.frequency = settings.currentPitch.frequency;
  }
}

$(document).ready(function() {

  $("#play").on("click", playPitch);
  $("#stop").on("click", stopPitch);
  $("#reset").on("click", function(){ calcFreq(null, true); });
  $('#default').on("click", function(){
    setUserDefault();
  });


  $("#droneUp").on("click", function(){
    pitchChange("up");
  });
  $("#droneDown").on("click", function(){
    pitchChange("down");
  });
  Mousetrap.bind(['q','w','e','r','t','a','s','d','f','g','z','x','c','v'], function(){
    //settings.keydir = "up";
    pitchChange("up");
  });
  Mousetrap.bind(['y','u','i','o','p','h','j','k','l','b','n','m'], function(){ 
    //settings.keydir = "down";
    pitchChange("down");
  });
  Mousetrap.bind('space', function(){
    if (settings.isPlaying) stopPitch(); else playPitch();
  });
  Mousetrap.bind('shift', function(){
    calcFreq(null, true);
  });

  context = new (window.AudioContext || window.webkitAudioContext)();

  newOsc();


});
