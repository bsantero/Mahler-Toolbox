var settings = {};
settings.arrayPos = {"cur":36, "user":36, "def":36, "A4": null};
settings.basePitch = {"name": "A", "octave": 4, "frequency": 440};
settings.currentPitch = {"name": "A", "octave": 4, "frequency": 440};
settings.userPitch = {"name": "A", "octave": 4, "frequency": 440, "calibration": 440};
settings.isPlaying = false;
settings.notes = [];
settings.range = {"minimum": "A1", "maximum": "A6"};
settings.volume = 18;

function Note(name, octave) {
  this.name = name;
  this.octave = octave;
}

function findBasePitch() {
  var base = (settings.basePitch.name + settings.basePitch.octave.toString())
  for (var i = settings.notes.length - 1; i >= 0; i--) {
    if ((settings.notes[i].name + settings.notes[i].octave.toString()) == base) {
      settings.arrayPos[(settings.notes[i].name + settings.notes[i].octave.toString())] = i;
      //console.log(base + " is at: "+ settings.arrayPos[base]);
    }
  }
}

function calibratePitch(caldir) {
  // alert(settings.arrayPos.cur);
  if (!settings.userPitch.calibration) {
    settings.userPitch.calibration = settings.basePitch.frequency;
  }
  if (caldir === "up" && settings.userPitch.calibration < 452) {
    settings.userPitch.calibration++;
  } else if (caldir === "down" && settings.userPitch.calibration > 415) {
    settings.userPitch.calibration--;
  }
  //console.log("Base freq " + caldir + " to: " + settings.userPitch.calibration);
  $("#calibrateDisplay").html(settings.userPitch.calibration + "Hz");
  setNoteArrayFreqs();
  //console.log("Pos 36 is: "+settings.notes[36].frequency);
  $("span.display.frequency").html(Math.round(settings.notes[settings.arrayPos.cur].frequency) + "Hz");
  oscillator.frequency.value = settings.notes[settings.arrayPos.cur].frequency;
}

function createNoteNames() {
  settings.notes = [];
  var base = settings.currentPitch,
      notes = settings.notes,
      baseNote;
  //console.log("calib is "+settings.userPitch.calibration);
  baseNote = new Note(base.name, base.octave);
  notes.push(baseNote);
  while ((notes[notes.length-1].name + notes[notes.length-1].octave.toString()) != settings.range.maximum) {
    var higherNote,
        nextName,
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
    higherNote = new Note(nextName, nextOctave);
    notes.push(higherNote);
  }
  while ((notes[0].name + notes[0].octave.toString()) != settings.range.minimum) {
    var lowerNote,
        nextNameDown,
        nextOctaveDown,
        nextFrequencyDown;
    switch (notes[0].name) {
      case "A":
        nextNameDown = "G#";
        nextOctaveDown = notes[0].octave;
        break;
      case "Bb":
        nextNameDown = "A";
        nextOctaveDown = notes[0].octave;
        break;
      case "B":
        nextNameDown = "Bb";
        nextOctaveDown = notes[0].octave;
        break;
      case "C":
        nextNameDown = "B";
        nextOctaveDown = notes[0].octave - 1;
        break;
      case "C#":
        nextNameDown = "C";
        nextOctaveDown = notes[0].octave;
        break;
      case "D":
        nextNameDown = "C#";
        nextOctaveDown = notes[0].octave;
        break;
      case "D#":
        nextNameDown = "D";
        nextOctaveDown = notes[0].octave;
        break;
      case "E":
        nextNameDown = "D#";
        nextOctaveDown = notes[0].octave;
        break;
      case "F":
        nextNameDown = "E";
        nextOctaveDown = notes[0].octave;
        break;
      case "F#":
        nextNameDown = "F";
        nextOctaveDown = notes[0].octave;
        break;
      case "G":
        nextNameDown = "F#";
        nextOctaveDown = notes[0].octave;
        break;
      case "G#":
        nextNameDown = "G";
        nextOctaveDown = notes[0].octave;
        break;
    }
    lowerNote = new Note(nextNameDown, nextOctaveDown);
    notes.unshift(lowerNote);
  }
  for (i = settings.notes.length - 1; i >= 0; i--) {
    //console.log(settings.notes[i]);
  }
  //console.log(notes.length);
}

function setNoteArrayFreqs() {
  // var notes = settings.notes;
  settings.notes[settings.arrayPos.A4].frequency = settings.userPitch.calibration;
  for (var i = settings.arrayPos.A4 + 1; i < settings.notes.length; i++) {
    settings.notes[i].frequency = settings.notes[i-1].frequency * Math.pow(1.059463094359, 1);
  }
  for (i = settings.arrayPos.A4 - 1; i >= 0; i--) {
    settings.notes[i].frequency = settings.notes[i+1].frequency * Math.pow(1.059463094359, -1);
  }
  for (i = settings.notes.length - 1; i >= 0; i--) {
    //console.log(settings.notes[i]);
  }
}

function newOsc() {
  oscillator = context.createOscillator(); // Create bass guitar
  gainNode = context.createGain(); // Create boost pedal 
  oscillator.connect(gainNode); // Connect bass guitar to boost pedal
  gainNode.connect(context.destination); // Connect boost pedal to amplifier
  gainNode.gain.value = settings.volume/24; // Set boost pedal to 30 percent volume
}

function pitchChange(keydir) {
  var pitch = settings.currentPitch;
  switch (keydir) {
    case "up":
      if (settings.notes[settings.arrayPos.cur + 1] !== undefined) {
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
  //console.log("playing "+settings.currentPitch.frequency);
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
    //console.log("Default set to: " + settings.currentPitch.name + settings.currentPitch.octave);
    settings.arrayPos.user = settings.arrayPos.cur;
    settings.userPitch.name = settings.currentPitch.name;
    settings.userPitch.octave = settings.currentPitch.octave;
    settings.userPitch.frequency = settings.currentPitch.frequency;
  }
}

function menuBtnPress(menu) {
  $("#"+menu+"Menu").siblings().hide();
  $("#"+menu+"Button").siblings().removeClass("clicked");
  $("#"+menu+"Button").toggleClass("clicked");
  $("#"+menu+"Menu").toggle();
}

function volumeChange(voldir) {
  if (voldir === "up" && settings.volume !== 24) {
    settings.volume++;
    //console.log("Volume " + voldir + ", current: " + settings.volume);
    gainNode.gain.value = settings.volume/24; // Set boost pedal to 30 percent volume
  } else if (voldir === "down" && settings.volume !== 0) {
    settings.volume--;
    //console.log("Volume " + voldir + ", current: " + settings.volume);
    gainNode.gain.value = settings.volume/24; // Set boost pedal to 30 percent volume
  }
  $("#volDisplay").html(Math.round(settings.volume/24*100)+"%");
}

$(document).ready(function() {

  createNoteNames();
  findBasePitch();
  setNoteArrayFreqs();

  $("#play").on("click", function(){
    playPitch();
    this.blur();
  });
  $("#stop").on("click", function(){
    stopPitch();
    this.blur();
  });
  $("#default").on("click", function(){
    setUserDefault();
    this.blur();
  });
  $("#reset").on("click", function(){
    resetPitch();
    this.blur();
  });

  $("#infoButton").on("click", function(){
    menuBtnPress("info");
  });
  $("#settingsButton").on("click", function(){
    menuBtnPress("settings");
  });
  $("#volMinus").on("click", function(){
    volumeChange("down");
  });
  $("#volPlus").on("click", function(){
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

  Mousetrap.bind(['q','w','e','r','t','a','s','d','f','g','z','x','c','v', 'down'], function(){
    pitchChange("down");
  });
  Mousetrap.bind(['y','u','i','o','p','h','j','k','l','b','n','m', 'up'], function(){ 
    pitchChange("up");
  });
  Mousetrap.bind('-', function(){
    volumeChange("down");
  });
  Mousetrap.bind('=', function(){
    volumeChange("up");
  });
  Mousetrap.bind('left', function(){ 
    calibratePitch("down");
  });
  Mousetrap.bind('right', function(){ 
    calibratePitch("up");
  });
  Mousetrap.bind('space', function(){
    if (settings.isPlaying) stopPitch(); else playPitch();
  });
  Mousetrap.bind('shift', function(){
    resetPitch();
  });

  context = new (window.AudioContext || window.webkitAudioContext)();

  newOsc();

  // $("#settingsMenu").show()
});
