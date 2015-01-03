gnome.isPlaying = false;
gnome.startTime = null;
gnome.tempo = 120.0;
gnome.lookahead = 25.0;
gnome.scheduleAheadTime = 0.1;
gnome.nextNoteTime = 0.0;
gnome.subdivision = {	"selected": "sixteenth",
	                    "whole": 0.25,
	                    "half": 0.5,
	                    "quarter": 1,
	                    "eighth": 2,
	                    "sixteenth": 4,
	                  	"current": null};
gnome.noteLength = 0.05;
gnomeCanvas = undefined;
gnomeCanvasContext = undefined;
gnome.lastSubdivisionDrawn = -1;
gnome.notesInQueue = [];
gnome.timerWorker = null;

function renderKnob(){
  $(".knob").knob({
    'min': 1,
    'max': 240,
    'width': 100,
    'change': function (val) { gnome.tempo = val; },
    'release': function (val) { gnome.tempo = val; }
  });
}

function setTempo(value) {
  // var milliseconds = (60/value)/gnome.subdivision[gnome.subdivision.selected];
  // gnome.tempo = value;
}

function gnomeStartStop(action){
  if (action === "Play" && !gnome.isPlaying) {
    gnome.isPlaying = true;
    console.log("gnome: ON");
  } else if (action === "Stop" && gnome.isPlaying) {
    gnome.isPlaying = false;
    console.log("gnome: OFF");
  }
  $("button#gnome" + action).hide();
  $("button#gnome" + action).siblings().show();
  // gnomeLoop();
}

function gnomeLoop() {
  setTimeout( function() {        
    if (gnome.isPlaying) {
      // console.log("Blink");
      $("div.blinky").toggleClass("blinkyOn");
      setTimeout( function() {
        $("div.blinky").toggleClass("blinkyOn");
      }, gnome.interval);
      console.log(audioContext.currentTime);
      gnomeLoop();
    } else {
      // console.log("No Blink");
      return;
    }
  }, gnome.interval);
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
  // Advance current note and time by a 16th note...
  var secondsPerBeat = 60.0 / gnome.tempo ;   // Notice this picks up the CURRENT 
                                        			// tempo value to calculate beat length.
  gnome.nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

  gnome.subdivision.current++;    // Advance the beat number, wrap to zero
  if (gnome.subdivision.current == 16) {
      gnome.subdivision.current = 0;
  }
}

function gnomeScheduleNote( beatNumber, time ) {
  // push the note on the queue, even if we're not playing.
  gnome.notesInQueue.push( { note: beatNumber, time: time } );

  if ( (gnome.subdivision.selected=="eighth") && (beatNumber%2) )
      return; // we're not playing non-8th 16th notes
  if ( (gnome.subdivision.selected=="quarter") && (beatNumber%4) )
      return; // we're not playing non-quarter 8th notes

  // create an oscillator
  var osc = audioContext.createOscillator();
  osc.connect( audioContext.destination );
  if (beatNumber % 16 === 0)    // beat 0 == low pitch
      osc.frequency.value = 880.0;
  else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
      osc.frequency.value = 440.0;
  else                        // other 16th notes = high pitch
      osc.frequency.value = 220.0;

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
      return "stop";
  } else {
      timerWorker.postMessage("stop");
      return "play";
  }
}

function resetCanvas (e) {
  // resize the canvas - but remember - this clears the canvas too.
  gnomeCanvas.width = window.innerWidth;
  gnomeCanvas.height = window.innerHeight;

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
      var x = Math.floor( gnomeCanvas.width / 18 );
      gnomeCanvasContext.clearRect(0,0,gnomeCanvas.width, gnomeCanvas.height); 
      for (var i=0; i<16; i++) {
          gnomeCanvasContext.fillStyle = ( currentNote == i ) ? 
              ((currentNote%4 === 0)?"red":"blue") : "black";
          gnomeCanvasContext.fillRect( x * (i+1), x, x/2, x/2 );
      }
      gnome.lastSubdivisionDrawn = currentNote;
  }

  // set up to draw again
  requestAnimFrame(draw);
}

function gnomeInit() {

  renderKnob();
  setTempo(60);

	var container = document.createElement( 'div' );
  container.className = "container";

  gnomeCanvas = document.createElement( 'canvas' );
  gnomeCanvasContext = gnomeCanvas.getContext( '2d' );
  gnomeCanvas.width = window.innerWidth; 
  gnomeCanvas.height = window.innerHeight;

  //$("#droneUi").append( container );
  //$(container).append(gnomeCanvas);    
  gnomeCanvasContext.strokeStyle = "#ffffff";
  gnomeCanvasContext.lineWidth = 2;

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