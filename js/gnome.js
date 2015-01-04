gnome.isPlaying = false;
gnome.startTime = null;
gnome.oscVol = 18;
gnome.tempo = 120.0;
gnome.lookahead = 25.0;
gnome.scheduleAheadTime = 0.1;
gnome.nextNoteTime = 0.0;
gnome.subdivision = {	"selected": "Quarter",
	                    "Whole": 0.25,
	                    "Half": 0.5,
	                    "Quarter": 1,
	                    "Eighth": 2,
	                    "Sixteenth": 4,
	                  	"current": null};
gnome.totalBeats = 4;
gnome.noteLength = 0.05;
gnomeCanvas = undefined;
gnomeCanvasContext = undefined;
gnome.lastSubdivisionDrawn = -1;
gnome.notesInQueue = [];
gnome.timerWorker = null;

function renderKnob(){
  $(".knob").knob({
    'skin': 'tron',
    'min': 40,
    'max': 240,
    'width': 150,
    'cursor': true,
    'thickness': 0.4,
    'angleArc': 320,
    'angleOffset': -160,
    'change': function (val) { gnome.tempo = val; },
    'release': function (val) { gnome.tempo = val; }
  });
}

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function gnomeNextNote() {
  var secondsPerBeat = 60.0 / gnome.tempo ;   // Notice this picks up the CURRENT 
                                        			// tempo value to calculate beat length.
  // gnome.nextNoteTime += secondsPerBeat;    // Add beat length to last beat time
  gnome.nextNoteTime += (1.0 / gnome.subdivision[gnome.subdivision.selected]) * secondsPerBeat;    // Add beat length to last beat time
	// console.log(gnome.nextNoteTime);
  gnome.subdivision.current++;    // Advance the beat number, wrap to zero
  if (gnome.subdivision.current == gnome.totalBeats * gnome.subdivision[gnome.subdivision.selected]) {
      gnome.subdivision.current = 0;
  }
}

function gnomeScheduleNote( beatNumber, time ) {
  // push the note on the queue, even if we're not playing.
  gnome.notesInQueue.push( { note: beatNumber, time: time } );

  // create an oscillator
  var osc = audioContext.createOscillator();
  gnomeGain = audioContext.createGain(); // Create boost pedal 
  osc.connect(gnomeGain); // Connect bass guitar to boost pedal
  gnomeGain.connect(audioContext.destination); // Connect boost pedal to amplifier
  gnomeGain.gain.value = gnome.oscVol/24;
  if (beatNumber % gnome.subdivision[gnome.subdivision.selected] === 0 )    // quarter notes = medium pitch
      osc.frequency.value = 880.0;
  else                        // other subdivided notes = high pitch
      osc.frequency.value = 659.0;

  osc.start( time );
  osc.stop( time + gnome.noteLength );
}

function gnomeScheduler() {
  // while there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (gnome.nextNoteTime < audioContext.currentTime + gnome.scheduleAheadTime ) {
      gnomeScheduleNote( gnome.subdivision.current, gnome.nextNoteTime );
      gnomeNextNote();
  }
}

function gnomePlay() {
  gnome.isPlaying = !gnome.isPlaying;

  if (gnome.isPlaying) { // start playing
      gnome.subdivision.current = 0;
      gnome.nextNoteTime = audioContext.currentTime;
      timerWorker.postMessage("start");
      $("#gnomePlay").hide();
      $("#gnomeStop").show();
      return "stop";
  } else {
      $("#gnomePlay").show();
      $("#gnomeStop").hide();
      timerWorker.postMessage("stop");
      return "play";
  }
}

function tempoChange(value) {
  $(".knob").val(gnome.tempo + value).trigger('change');
}


function gnomeVolumeChange(direction) {
  if (direction === "up" && gnome.oscVol !== 24) {
    gnome.oscVol++;
  } else if (direction === "down" && gnome.oscVol !== 0) {
    gnome.oscVol--;
  }
  gnomeGain.gain.value = (Math.exp(gnome.oscVol/24)-1)/(Math.E-1);
  $("#gnomeVolDisplay").html(Math.round(gnome.oscVol/24*100)+"%");
}

function resetCanvas (e) {
  // resize the canvas - but remember - this clears the canvas too.
  gnomeCanvas.width = window.innerWidth;
  gnomeCanvas.height = window.innerHeight/10;

  //make sure we scroll to the top left.
  window.scrollTo(0,0); 
}

function draw() {
  var currentNote = gnome.lastSubdivisionDrawn;
  var currentTime = audioContext.currentTime;

  while (gnome.notesInQueue.length && gnome.notesInQueue[0].time < currentTime) {
      currentNote = gnome.notesInQueue[0].note;
      gnome.notesInQueue.splice(0,1);   // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (gnome.lastSubdivisionDrawn != currentNote) {
      var x = Math.floor( gnomeCanvas.width );
      gnomeCanvasContext.clearRect(0,0,gnomeCanvas.width, gnomeCanvas.height); 
      for (var i=0; i<gnome.totalBeats * gnome.subdivision[gnome.subdivision.selected]; i++) {
          gnomeCanvasContext.fillStyle = ( currentNote == i ) ? 
              ((currentNote%gnome.subdivision[gnome.subdivision.selected] === 0)?"red":"green") : "#754B75";
          //gnomeCanvasContext.fillRect( (x / 4) +
                                       // (x / (2 * (gnome.totalBeats * gnome.subdivision[gnome.subdivision.selected]))) *
                                       // (i * (1 + 1/(gnome.totalBeats * gnome.subdivision[gnome.subdivision.selected]))),
                                       // 0, 10, 10 );
          gnomeCanvasContext.beginPath();
          gnomeCanvasContext.arc((x / 4) +
                  (x / (2 * (gnome.totalBeats * gnome.subdivision[gnome.subdivision.selected]))) *
                  (i * (1 + 1/(gnome.totalBeats * gnome.subdivision[gnome.subdivision.selected]))),
                  gnomeCanvas.height/2, 10, 0 ,2*Math.PI);
          gnomeCanvasContext.fill();
      }
      gnome.lastSubdivisionDrawn = currentNote;
  }

  // set up to draw again
  requestAnimFrame(draw);
}

function gnomeInit() {

  renderKnob();
  // setTempo(60);

	var container = document.createElement( 'div' );
  container.className = "gnomeBlinky";

  gnomeCanvas = document.createElement( 'canvas' );
  gnomeCanvasContext = gnomeCanvas.getContext( '2d' );
  gnomeCanvas.width = window.innerWidth; 
  gnomeCanvas.height = window.innerHeight/20;

  $("#gnomeUi").prepend( container );
  $(container).append(gnomeCanvas);
  gnomeCanvasContext.strokeStyle = "#ffffff";
  gnomeCanvasContext.lineWidth = 1;

  window.onorientationchange = resetCanvas;
  window.onresize = resetCanvas;

  requestAnimFrame(draw);    // start the drawing loop.

  timerWorker = new Worker("js/metronomeworker.js");

  timerWorker.onmessage = function(e) {
      if (e.data == "tick") {
          // console.log("tick!");
          gnomeScheduler();
      }
      else
          console.log("message: " + e.data);
  };
  timerWorker.postMessage({"interval":gnome.lookahead});
}