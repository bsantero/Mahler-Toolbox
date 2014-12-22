var settings = {};
settings.arrayPos = {"cur":36, "user":36};
settings.currentPitch = {"name": "A", "octave": 4, "frequency": 440};
settings.userPitch = {"name": "A", "octave": 4, "frequency": 440};
settings.defaultPitch = {"name": "A", "octave": 4, "frequency": 440};
settings.isPlaying = false;
settings.notes = [];
settings.range = {"minimum": 54, "maximum": 1761};
//settings.keydir = null;

function Note(name, octave, frequency) {
  this.name = name;
  this.octave = octave;
  this.frequency = frequency;
}

function createNoteFreqs() {
  var base = settings.currentPitch,
      notes = settings.notes,
      newNote;
  newNote = new Note(base.name, base.octave, base.frequency);
  //console.log(newNote);
  notes.push(newNote);
  //console.log(notes.length);
  while ((notes[notes.length-1].frequency * Math.pow(1.059463094359, 1)) <= settings.range.maximum) {
    var nextName,
        nextOctave,
        nextFrequency;
    switch (notes[notes.length-1].name) {
      case "A":
        nextName = "Bb";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "Bb":
        nextName = "B";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "B":
        nextName = "C";
        nextOctave = notes[notes.length-1].octave + 1;
        break;
      case "C":
        nextName = "C#";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "C#":
        nextName = "D";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "D":
        nextName = "D#";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "D#":
        nextName = "E";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "E":
        nextName = "F";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "F":
        nextName = "F#";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "F#":
        nextName = "G";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "G":
        nextName = "G#";
        nextOctave = notes[notes.length-1].octave;
        break;
      case "G#":
        nextName = "A";
        nextOctave = notes[notes.length-1].octave;
        break
    }
    nextFrequency = notes[notes.length-1].frequency * Math.pow(1.059463094359, 1);
    newNote = new Note(nextName, nextOctave, nextFrequency);
    notes.push(newNote);
  }
  while ((notes[0].frequency * Math.pow(1.059463094359, -1)) >= settings.range.minimum) {
    var nextName,
        nextOctave,
        nextFrequency;
    switch (notes[0].name) {
      case "A":
        nextName = "G#";
        nextOctave = notes[0].octave;
        break;
      case "Bb":
        nextName = "A";
        nextOctave = notes[0].octave;
        break;
      case "B":
        nextName = "Bb";
        nextOctave = notes[0].octave;
        break;
      case "C":
        nextName = "B";
        nextOctave = notes[0].octave - 1;
        break;
      case "C#":
        nextName = "C";
        nextOctave = notes[0].octave;
        break;
      case "D":
        nextName = "C#";
        nextOctave = notes[0].octave;
        break;
      case "D#":
        nextName = "D";
        nextOctave = notes[0].octave;
        break;
      case "E":
        nextName = "D#";
        nextOctave = notes[0].octave;
        break;
      case "F":
        nextName = "E";
        nextOctave = notes[0].octave;
        break;
      case "F#":
        nextName = "F";
        nextOctave = notes[0].octave;
        break;
      case "G":
        nextName = "F#";
        nextOctave = notes[0].octave;
        break;
      case "G#":
        nextName = "G";
        nextOctave = notes[0].octave;
        break
    }
    nextFrequency = notes[0].frequency * Math.pow(1.059463094359, -1);
    newNote = new Note(nextName, nextOctave, nextFrequency);
    notes.unshift(newNote);
  }
  console.log(notes);
  console.log(settings.notes[62])
}

function newOsc() {
  oscillator = context.createOscillator(); // Create bass guitar
  gainNode = context.createGain(); // Create boost pedal 
  oscillator.connect(gainNode); // Connect bass guitar to boost pedal
  gainNode.connect(context.destination); // Connect boost pedal to amplifier
  gainNode.gain.value = 1; // Set boost pedal to 30 percent volume
}

function pitchChange(keydir) {
  var pitch = settings.currentPitch;
  switch (keydir) {
    case "up":
      if (settings.notes[settings.arrayPos.cur+1] !== undefined) {
        settings.arrayPos.cur++;
        settings.currentPitch = settings.notes[settings.arrayPos.cur];
      }
      break;
    case "down":
      if (settings.notes[settings.arrayPos.cur - 1] !== undefined) {
        settings.arrayPos.cur--;
        settings.currentPitch = settings.notes[settings.arrayPos.cur];
      }
      break;
  }
  oscillator.frequency.value = settings.currentPitch.frequency;
  $("span.display.pitch").html(settings.currentPitch.name);
  $("span.display.octave").html(settings.currentPitch.octave);
  $("span.display.frequency").html(Math.round(settings.currentPitch.frequency) + "Hz");
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

function resetPitch() {
  settings.currentPitch = settings.userPitch;
  settings.arrayPos.cur = settings.arrayPos.user;
  oscillator.frequency.value = settings.currentPitch.frequency;
  $("span.display.pitch").html(settings.currentPitch.name);
  $("span.display.octave").html(settings.currentPitch.octave);
  $("span.display.frequency").html(Math.round(settings.currentPitch.frequency) + "Hz");
}

function setUserDefault(definedPitch){
  if (definedPitch) {
  } else {
    console.log("Default set to: " + settings.currentPitch.name + settings.currentPitch.octave);
    settings.arrayPos.user = settings.arrayPos.cur;
    settings.userPitch.name = settings.currentPitch.name;
    settings.userPitch.octave = settings.currentPitch.octave;
    settings.userPitch.frequency = settings.currentPitch.frequency;
  }
}

$(document).ready(function() {

  createNoteFreqs();

  $("#play").on("click", playPitch);
  $("#stop").on("click", stopPitch);
  $("#reset").on("click", function(){
    resetPitch();
  });
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
    resetPitch();
  });

  context = new (window.AudioContext || window.webkitAudioContext)();

  newOsc();


});
