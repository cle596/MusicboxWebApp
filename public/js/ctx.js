window.AudioContext = window.AudioContext||window.webkitAudioContext;
var ctx = new AudioContext();
var comp = ctx.createDynamicsCompressor();
comp.threshold.value = -50;
comp.connect(ctx.destination);
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
gain.v1.connect(comp);
gain.v2.connect(comp);
gain.v3.connect(comp);
gain.v4.connect(comp);
gain.v5.connect(comp);
