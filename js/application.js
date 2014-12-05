var settings = {};
settings.notes = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
settings.changeNotes = function(scale, startNote) {
};

function logClick() {
  console.log("Document clicked.");
}

function pitchChange() {
  var direction = $(this).data("direction"),
    scale = settings.notes,
    pitchDisplay = $(this).parent().find("#droneInput").find("input"),
    pitchDisplayIndex = scale.indexOf(pitchDisplay.val()); 
  if (direction === "down") {
    if (pitchDisplayIndex === 0) {
      pitchDisplay.val(scale[scale.length-1]); }
    else {
      pitchDisplay.val(scale[pitchDisplayIndex-1]);
    }
  }
  else {
    if (pitchDisplayIndex === scale.length-1) {
      pitchDisplay.val(scale[0]);
    }
    else {
        pitchDisplay.val(scale[pitchDisplayIndex+1]);
    }
  }
}

$(document).ready(function() {

  $(".changePitch").on("click", pitchChange);

});
