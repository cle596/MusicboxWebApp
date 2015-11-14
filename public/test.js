"use strict";

var ctx = new AudioContext();
var comp = ctx.createDynamicsCompressor();
comp.threshold.value = -50;
comp.connect(ctx.destination);
var voice = [
  {pitch:440,duration:.5},
  {pitch:493.88,duration:.5},
  {pitch:554.37,duration:.5},
  {pitch:587.33,duration:.5},
  {pitch:659.25,duration:.5},
  {pitch:739.99,duration:.5},
  {pitch:830.61,duration:.5},
  {pitch:880.00,duration:.5}
];
var make_note = function(nobj){
  var rate = 44100;
  var sample = rate * nobj.duration;
  var src = ctx.createBufferSource();
  var buf = ctx.createBuffer(1,sample,rate);
  var data = new Float32Array(sample);
  data.forEach(function(y,x,data){
    data[x] = Math.sin(2*Math.PI*nobj.pitch/rate*x);
  });
  buf.copyToChannel(data,0);
  src.buffer = buf;
  src.connect(comp);
  return src;
}
var ntime = 0;
var schedule_note = function(src,t){
  src.start(t);
}
var getntime = function(){
  return ntime + voice[0].duration;
};
var peek = function(ptime){
  while (voice.length && ntime<ctx.currentTime+ptime){
    schedule_note(make_note(voice[0]),ntime);
    voice.splice(0,1);
    if (voice.length){
      ntime = getntime();
    }
  }
}
var timer = new Worker('timer.js');
timer.postMessage("");
timer.onmessage = function(e){
  peek(1000);
}
