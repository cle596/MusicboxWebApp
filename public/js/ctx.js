window.AudioContext = window.AudioContext||window.webkitAudioContext;
var ctx = new AudioContext();
var comp = ctx.createDynamicsCompressor();
comp.threshold.value = -50;
var gain = {
  v1 : ctx.createGain(),
  v2 : ctx.createGain(),
  v3 : ctx.createGain(),
  v4 : ctx.createGain(),
  v5 : ctx.createGain()
};
gain.v1.gain.value = .8;
gain.v2.gain.value = .1;
gain.v3.gain.value = .1;
gain.v4.gain.value = .2;
gain.v5.gain.value = .2;
var convolver = ctx.createConvolver();
var soundSource, concertHallBuffer;
ajaxRequest = new XMLHttpRequest();
ajaxRequest.open('GET', 'impulse.wav', true);
ajaxRequest.responseType = 'arraybuffer';
var ready = document.getElementById("ready");
ajaxRequest.onload = function() {
  var audioData = ajaxRequest.response;
  ctx.decodeAudioData(audioData, function(buffer) {
      concertHallBuffer = buffer;
      convolver.buffer = concertHallBuffer;
      gain.v1.connect(convolver);
      gain.v2.connect(convolver);
      gain.v3.connect(convolver);
      gain.v4.connect(convolver);
      gain.v5.connect(convolver);
      convolver.connect(comp);
      comp.connect(ctx.destination);
      ready.innerHTML += "convolver ready <br>";
    }, function(e){"Error with decoding audio data" + e.err});
}
ajaxRequest.send();
