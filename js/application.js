var settings = {};
settings.currentPitch = "3";
settings.notes = ["4A","4Asharp","4B","5C","5Csharp","5D","5Dsharp","5E","5F","5Fsharp","5G","5Gsharp"];
settings.soundPack = [];
settings.rebuildSoundPack = function(scale, startNote) {
};

function createSoundPack() {
  for(var soundIndex = 0; soundIndex < settings.notes.length; soundIndex++) {
    settings.soundPack[soundIndex] = new Howl({
      urls: ['media/5seconds/OGG/'+settings.notes[soundIndex]+'.ogg', 'media/5seconds/MP3'+settings.notes[soundIndex]+'.mp3'],
      volume: .5,
      loop: true
    });
  }
}

function pitchChange(el) {
  var el = this;
  var direction = $(this).data("direction"),
      scale = settings.notes;
      //pitchDisplay = $(this).parent().find("#droneInput").find("input"),
      //pitchDisplayIndex = scale.indexOf(pitchDisplay.val()); 
  console.log('Current pitch is' + settings.currentPitch + " - " + scale[settings.currentPitch]);
  if (direction === "down") {
    if (settings.currentPitch === 0) {
      settings.currentPitch = scale.length-1;
    }
    else {
      settings.currentPitch -= 1;
    }
  }
  else {
    if (setting.currentPitch === scale.length-1) {
      settings.currentPitch = 0;
    }
    else {
      settings.currentPitch += 1;
    }
  }
  console.log('Next pitch is' + settings.currentPitch + " - " + scale[settings.currentPitch]);
  $(el).parent().find("#droneInput").find("input").val(settings.notes[settings.currentPitch]);
  playPitch();
}

function playPitch() {
  console.log("Should play "+settings.notes[settings.currentPitch]);
  settings.soundPack[settings.currentPitch].play();
  //$.delay(30);
  settings.soundPack[settings.currentPitch].play({"fadeIn":30});
}

$(document).ready(function() {

  createSoundPack();
  $(".changePitch.down").on("click", pitchChange);
  $(".changePitch.up").on("click", pitchChange);
  $("#play").on("click", playPitch);

});
