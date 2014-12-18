var settings = {};
settings.currentPitch = 3;
settings.notes = ["4A","4Asharp","4B","5C","5Csharp","5D","5Dsharp","5E","5F","5Fsharp","5G","5Gsharp"];
settings.soundPack = [];
settings.isPlaying = false;

function createSoundPack() {
  for(var soundIndex = 0; soundIndex < settings.notes.length; soundIndex++) {
    settings.soundPack[soundIndex] = new Howl({
      urls: ['media/OGG/'+settings.notes[soundIndex]+'.ogg', 'media/MP3'+settings.notes[soundIndex]+'.mp3'],
      volume: .7,
      loop: true 
    });
  }
}

function pitchChange(details) {
  settings.soundPack[settings.currentPitch].stop();
  var direction = $(this).data("direction"),
      scale = settings.notes,
      displayOctave,
      displayPitch;
  if (direction === "down") {
    if (settings.currentPitch === 0) {
      settings.currentPitch = scale.length-1;
    }
    else {
      settings.currentPitch--;
    }
  }
  else if (direction === "up") {
    if (settings.currentPitch === scale.length-1) {
      settings.currentPitch = 0;
    }
    else {
      settings.currentPitch++;
    }
  }
  displayPitch = settings.notes[settings.currentPitch];
  displayOctave = displayPitch[0];
  if (displayPitch[2] === 'f' ) {
    displayPitch = displayPitch[1]+"b";    
  } else if (displayPitch[2] === 's' ) {
    displayPitch = displayPitch[1]+"#";    
  } else {
    displayPitch = displayPitch[1];
  }
  //alert("pitch: "+settings.currentPitch+" - "+ displayPitch);
  $("span.display.pitch").html(displayPitch);
  $("span.display.octave").html(displayOctave);
  if (settings.isPlaying === true){
    playPitch();
  }
}

function playPitch() {
  console.log("playing "+settings.currentPitch);
  //settings.soundPack[settings.currentPitch].stop();
  settings.isPlaying = true;
  //settings.soundPack[settings.currentPitch].play();
  $(this).hide();
  $(this).siblings("#stop").show();
}

function stopPitch() {
  settings.soundPack[settings.currentPitch].stop();
  settings.isPlaying = false;
  $(this).hide();
  $(this).siblings("#play").show();
}

$(document).ready(function() {

  createSoundPack();
  $(".changePitch.down").on("click", pitchChange);
  $(".changePitch.up").on("click", pitchChange);
  $("#play").on("click", playPitch);
  $("#stop").on("click", stopPitch);
  console.log("pitch: "+settings.currentPitch);

var context = new AudioContext(); // Create audio container
oscillator = context.createOscillator(); // Create bass guitar
gainNode = context.createGain(); // Create boost pedal 
oscillator.connect(gainNode); // Connect bass guitar to boost pedal
gainNode.connect(context.destination); // Connect boost pedal to amplifier
gainNode.gain.value = 1; // Set boost pedal to 30 percent volume
oscillator.frequency.value = 200;
oscillator.start(); // Play bass guitar instantly
});
