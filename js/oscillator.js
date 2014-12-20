var settings = {};
settings.currentPitch = {"name": "A", "octave":4, "frequency": 440};
settings.notes = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
settings.isPlaying = false;

function calcFreq(direction) {
  var freq = settings.currentPitch.frequency,
    exponent;
  if (direction === "up") exponent = 1;
  else if (direction === "down") exponent = -1;
  settings.currentPitch.frequency = settings.currentPitch.frequency * Math.pow(1.059463094359, exponent);
  oscillator.frequency.value = settings.currentPitch.frequency;
  $("span.display.frequency").html(settings.currentPitch.frequency);
}

function pitchChange(details) {
  var direction = $(this).data("direction");
  if ((direction === "up" && settings.currentPitch.frequency * Math.pow(1.059463094359, 1) >= 1700) || (direction === "down" && settings.currentPitch.frequency * Math.pow(1.059463094359, -1) <= 50 )) return;
  switch (settings.currentPitch.name) {
    case "A":
      if (direction === "up") {
        settings.currentPitch.name = "A#";
      } else settings.currentPitch.name = "G#";
      break;
    case "A#":
      if (direction === "up") {
        settings.currentPitch.name = "B";
      } else settings.currentPitch.name = "A";
      break;
    case "B":
      if (direction === "up") {
        settings.currentPitch.name = "C";
        settings.currentPitch.octave++;
      } else settings.currentPitch.name = "A#";
      break;
    case "C":
      if (direction === "up") {settings.currentPitch.name = "C#";} else {
        settings.currentPitch.name = "B";
        settings.currentPitch.octave--;
      }
      break;
    case "C#":
      if (direction === "up") {
        settings.currentPitch.name = "D";
      } else settings.currentPitch.name = "C";
      break;
    case "D":
      if (direction === "up") {
        settings.currentPitch.name = "D#";
      } else settings.currentPitch.name = "C#";
      break;
    case "D#":
      if (direction === "up") {
        settings.currentPitch.name = "E";
      } else settings.currentPitch.name = "D";
      break;
    case "E":
      if (direction === "up") {
        settings.currentPitch.name = "F";
      } else settings.currentPitch.name = "D#";
      break;
    case "F":
      if (direction === "up") {
        settings.currentPitch.name = "F#";
      } else settings.currentPitch.name = "E";
      break;
    case "F#":
      if (direction === "up") {
        settings.currentPitch.name = "G";
      } else settings.currentPitch.name = "F";
      break;
    case "G":
      if (direction === "up") {
        settings.currentPitch.name = "G#";
      } else settings.currentPitch.name = "F#";
      break;
    case "G#":
      if (direction === "up") {
        settings.currentPitch.name = "A";
      } else settings.currentPitch.name = "G";
      break;
  }

  calcFreq(direction);

  $("span.display.pitch").html(settings.currentPitch.name);
  $("span.display.octave").html(settings.currentPitch.octave);
}

function newOsc() {
  oscillator = context.createOscillator(); // Create bass guitar
  //gainNode = context.createGain(); // Create boost pedal 
  oscillator.connect(context.destination); // Connect bass guitar to boost pedal
  //oscillator.connect(gainNode); // Connect bass guitar to boost pedal
  //gainNode.connect(context.destination); // Connect boost pedal to amplifier
  //gainNode.gain.value = 1; // Set boost pedal to 30 percent volume
}

function playPitch() {
  newOsc();
  console.log("playing "+settings.currentPitch.frequency);
  if (window.AudioContext) {
    oscillator.frequency.value = settings.currentPitch.frequency;
    oscillator.start();
  } else {
    oscillator.start(settings.currentPitch.frequency);
  }
  settings.isPlaying = true;
  $(this).hide();
  $(this).siblings("#stop").show();
}

function stopPitch() {
  if (window.AudioContext) {
    oscillator.stop();
  } else {
    oscillator.stop(settings.currentPitch.frequency);
  }
  settings.isPlaying = false;
  $(this).hide();
  $(this).siblings("#play").show();
}

$(document).ready(function() {
  context = new (window.AudioContext || window.webkitAudioContext)();

  $(".changePitch").on("click", pitchChange);
  $("#play").on("click", playPitch);
  $("#stop").on("click", stopPitch);
  console.log("pitch: "+settings.currentPitch.name);
  newOsc();

});
