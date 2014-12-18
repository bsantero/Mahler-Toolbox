var settings = {},
  context = new AudioContext();
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
  switch (settings.currentPitch.name) {
    case "A":
      direction === "up" ? settings.currentPitch.name = "A#" : settings.currentPitch.name = "G#";
      break
    case "A#":
      direction === "up" ? settings.currentPitch.name = "B" : settings.currentPitch.name = "A";
      break
    case "B":
      if (direction === "up") {
        settings.currentPitch.name = "C";
        settings.currentPitch.octave++;
      } else settings.currentPitch.name = "A#";
      break
    case "C":
      if (direction === "up") {settings.currentPitch.name = "C#";} else {
        settings.currentPitch.name = "B";
        settings.currentPitch.octave--;
      }
      break
    case "C#":
      direction === "up" ? settings.currentPitch.name = "D" : settings.currentPitch.name = "C";
      break
    case "D":
      direction === "up" ? settings.currentPitch.name = "D#" : settings.currentPitch.name = "C#";
      break
    case "D#":
      direction === "up" ? settings.currentPitch.name = "E" : settings.currentPitch.name = "D";
      break
    case "E":
      direction === "up" ? settings.currentPitch.name = "F" : settings.currentPitch.name = "D#";
      break
    case "F":
      direction === "up" ? settings.currentPitch.name = "F#" : settings.currentPitch.name = "E";
      break
    case "F#":
      direction === "up" ? settings.currentPitch.name = "G" : settings.currentPitch.name = "F";
      break
    case "G":
      direction === "up" ? settings.currentPitch.name = "G#" : settings.currentPitch.name = "F#";
      break
    case "G#":
      direction === "up" ? settings.currentPitch.name = "A" : settings.currentPitch.name = "G";
      break
  }

  calcFreq(direction);




  $("span.display.pitch").html(settings.currentPitch.name);
  $("span.display.octave").html(settings.currentPitch.octave);
}

function newOsc() {
  oscillator = context.createOscillator(); // Create bass guitar
  gainNode = context.createGain(); // Create boost pedal 
  oscillator.connect(gainNode); // Connect bass guitar to boost pedal
  gainNode.connect(context.destination); // Connect boost pedal to amplifier
  oscillator.frequency.value = settings.currentPitch.frequency;
  gainNode.gain.value = .5; // Set boost pedal to 30 percent volume
}

function playPitch() {
  newOsc();
  console.log("playing "+settings.currentPitch.frequency);
  oscillator.start();
  settings.isPlaying = true;
  $(this).hide();
  $(this).siblings("#stop").show();
}

function stopPitch() {
  oscillator.stop();
  settings.isPlaying = false;
  $(this).hide();
  $(this).siblings("#play").show();
}

$(document).ready(function() {

  $(".changePitch").on("click", pitchChange);
  $("#play").on("click", playPitch);
  $("#stop").on("click", stopPitch);
  console.log("pitch: "+settings.currentPitch.name);
  newOsc();

});
