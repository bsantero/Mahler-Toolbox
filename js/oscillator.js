var settings = {};
settings.currentPitch = {"name": "A4", "frequency": 440};
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
  console.log($(this));
  var direction = $(this).data("direction"),
      pitchOctave,
      pitchName;

  calcFreq(direction);


  //alert("pitch: "+settings.currentPitch+" - "+ displayPitch);
  $("span.display.pitch").html(pitchName);
  $("span.display.octave").html(pitchOctave);
  if (settings.isPlaying === true){
    //playPitch();
  }
}

function playPitch() {
  console.log("playing "+settings.currentPitch.frequency);
  //settings.soundPack[settings.currentPitch].stop();
  settings.isPlaying = true;
  oscillator.start(); // Play bass guitar instantly
  //settings.soundPack[settings.currentPitch].play();
  $(this).hide();
  $(this).siblings("#stop").show();
}

function stopPitch() {
  //settings.soundPack[settings.currentPitch].stop();
  oscillator.stop(); // Play bass guitar instantly
  settings.isPlaying = false;
  $(this).hide();
  $(this).siblings("#play").show();
}

$(document).ready(function() {

  //createSoundPack();
  $(".changePitch").on("click", pitchChange);
  $("#play").on("click", playPitch);
  $("#stop").on("click", stopPitch);
  console.log("pitch: "+settings.currentPitch.name);

  var context = new AudioContext(); // Create audio container
  oscillator = context.createOscillator(); // Create bass guitar
  gainNode = context.createGain(); // Create boost pedal 
  oscillator.connect(gainNode); // Connect bass guitar to boost pedal
  gainNode.connect(context.destination); // Connect boost pedal to amplifier
  oscillator.frequency.value = settings.currentPitch.frequency;
  gainNode.gain.value = .5; // Set boost pedal to 30 percent volume
});
