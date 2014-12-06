var settings = {};
settings.currentPitch = "3";
settings.notes = ["4A","4Asharp","4B","5C","5Csharp","5D","5Dsharp","5E","5F","5Fsharp","5G","5Gsharp"];
settings.soundPack = [];
settings.isPlaying = false;
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
  //console.log(settings.soundPack);
}

function pitchChange(details) {
  var el = this,
      direction = $(this).data("direction"),
      scale = settings.notes;
  console.log('Current pitch is ' + settings.currentPitch + " - " + scale[settings.currentPitch]);
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
  console.log('Next pitch is ' + settings.currentPitch + " - " + scale[settings.currentPitch]);
  $(el).parent().find("#droneInput").find("input").val(settings.notes[settings.currentPitch]);
  if (settings.isPlaying === true){
    playPitch();
  }
}

function playPitch() {
  settings.soundPack[settings.currentPitch].stop();
  settings.isPlaying = true;
  console.log("Should play "+settings.soundPack[settings.currentPitch]);
  settings.soundPack[settings.currentPitch].play();
  $(this).hide();
  $(this).siblings("#stop").show();
}

function stopPitch() {
  settings.isPlaying = false;
  settings.soundPack[settings.currentPitch].stop();
  $(this).hide();
  $(this).siblings("#play").show();
}

$(document).ready(function() {

  createSoundPack();
  $(".changePitch.down").on("click", pitchChange);
  $(".changePitch.up").on("click", pitchChange);
  $("#play").on("click", playPitch);
  $("#stop").on("click", stopPitch);
  console.log(settings.currentPitch);

});
