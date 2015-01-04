var drone = {},
    gnome = {},
    quencher = {},
    ui = {};

ui.currentInterface = "drone";

drone.osc = undefined;
drone.arrayPos = {"cur":36, "user":36, "def":36, "A4": null};
drone.basePitch = {"name": "A", "octave": 4, "frequency": 440};
drone.currentPitch = {"name": "A", "octave": 4, "frequency": 440};
drone.userPitch = {"name": "A", "octave": 4, "frequency": 440, "calibration": 440};
drone.isPlaying = false;
drone.notes = [];
drone.range = {"minimum": "A1", "maximum": "A6"};
drone.volume = 18;

function Note(name, octave) {
  this.name = name;
  this.octave = octave;
}

function findBasePitch() {
  var base = (drone.basePitch.name + drone.basePitch.octave.toString());
  for (var i = drone.notes.length - 1; i >= 0; i--) {
    if ((drone.notes[i].name + drone.notes[i].octave.toString()) == base) {
      drone.arrayPos[(drone.notes[i].name + drone.notes[i].octave.toString())] = i;
    }
  }
}

function calibratePitch(caldir) {
  if (!drone.userPitch.calibration) {
    drone.userPitch.calibration = drone.basePitch.frequency;
  }
  if (caldir === "up" && drone.userPitch.calibration < 452) {
    drone.userPitch.calibration++;
  } else if (caldir === "down" && drone.userPitch.calibration > 415) {
    drone.userPitch.calibration--;
  }
  $("#calibrateDisplay").html(drone.userPitch.calibration + "Hz");
  setNoteArrayFreqs();
  $("span.display.frequency").html(Math.round(drone.notes[drone.arrayPos.cur].frequency) + "Hz");
  drone.osc.frequency.value = drone.notes[drone.arrayPos.cur].frequency;
}

function createNoteNames() {
  drone.notes = [];
  var base = drone.currentPitch,
      notes = drone.notes,
      baseNote;
  baseNote = new Note(base.name, base.octave);
  notes.push(baseNote);
  while ((notes[notes.length-1].name + notes[notes.length-1].octave.toString()) != drone.range.maximum) {
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
        break;
    }
    higherNote = new Note(nextName, nextOctave);
    notes.push(higherNote);
  }
  while ((notes[0].name + notes[0].octave.toString()) != drone.range.minimum) {
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
  for (i = drone.notes.length - 1; i >= 0; i--) {
  }
}

function setNoteArrayFreqs() {
  // var notes = drone.notes;
  drone.notes[drone.arrayPos.A4].frequency = drone.userPitch.calibration;
  for (var i = drone.arrayPos.A4 + 1; i < drone.notes.length; i++) {
    drone.notes[i].frequency = drone.notes[i-1].frequency * Math.pow(1.059463094359, 1);
  }
  for (i = drone.arrayPos.A4 - 1; i >= 0; i--) {
    drone.notes[i].frequency = drone.notes[i+1].frequency * Math.pow(1.059463094359, -1);
  }
  for (i = drone.notes.length - 1; i >= 0; i--) {
  }
}

function newDrone() {
  drone.osc = audioContext.createOscillator(); // Create bass guitar
  gainNode = audioContext.createGain(); // Create boost pedal 
  drone.osc.connect(gainNode); // Connect bass guitar to boost pedal
  gainNode.connect(audioContext.destination); // Connect boost pedal to amplifier
  gainNode.gain.value = drone.osc.volume/24; // Set boost pedal to 30 percent volume
}

function pitchChange(keydir) {
  var pitch = drone.currentPitch;
  switch (keydir) {
    case "up":
      if (drone.notes[drone.arrayPos.cur + 1] !== undefined) {
        drone.arrayPos.cur++;
        drone.currentPitch = drone.notes[drone.arrayPos.cur];
      }
      break;
    case "down":
      if (drone.notes[drone.arrayPos.cur - 1] !== undefined) {
        drone.arrayPos.cur--;
        drone.currentPitch = drone.notes[drone.arrayPos.cur];
      }
      break;
  }
  drone.osc.frequency.value = drone.currentPitch.frequency;
  $("span.display.pitch").html(drone.currentPitch.name);
  $("span.display.octave").html(drone.currentPitch.octave);
  $("span.display.frequency").html(Math.round(drone.currentPitch.frequency) + "Hz");
}

function dronePlay() {
  if (!drone.isPlaying) {
    newDrone();
    drone.osc.frequency.value = drone.currentPitch.frequency;
    if (window.AudioContext) {
      drone.osc.start();
    } else {
      drone.osc.start(audioContext.currentTime);
    }
    drone.isPlaying = true;
    $("#dronePlay").hide();
    $("#droneStop").show();
  } else if (drone.isPlaying) {
    if (window.AudioContext) {
      drone.osc.stop();
    } else {
      drone.osc.stop(audioContext.currentTime);
    }
    drone.isPlaying = false;
    $("#droneStop").hide();
    $("#dronePlay").show();
  }
}

function droneStop() {
}

function resetPitch() {
  drone.currentPitch = drone.userPitch;
  drone.arrayPos.cur = drone.arrayPos.user;
  drone.osc.frequency.value = drone.currentPitch.frequency;
  $("span.display.pitch").html(drone.currentPitch.name);
  $("span.display.octave").html(drone.currentPitch.octave);
  $("span.display.frequency").html(Math.round(drone.currentPitch.frequency) + "Hz");
}

function setUserDefault(definedPitch){
  if (definedPitch) {
  } else {
    //console.log("Default set to: " + drone.currentPitch.name + drone.currentPitch.octave);
    drone.arrayPos.user = drone.arrayPos.cur;
    drone.userPitch.name = drone.currentPitch.name;
    drone.userPitch.octave = drone.currentPitch.octave;
    drone.userPitch.frequency = drone.currentPitch.frequency;
  }
}

function droneVolumeChange(direction) {
  if (direction === "up" && drone.volume !== 24) {
    drone.volume++;
  } else if (direction === "down" && drone.volume !== 0) {
    drone.volume--;
  }
  gainNode.gain.value = (Math.exp(drone.volume/24)-1)/(Math.E-1);
  $("#droneVolDisplay").html(Math.round(drone.volume/24*100)+"%");
}

function droneInit() {
  createNoteNames();
  findBasePitch();
  setNoteArrayFreqs();
  newDrone();
}
