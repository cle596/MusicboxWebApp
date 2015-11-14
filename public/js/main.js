"use strict";

var ctx = new AudioContext();
var comp = ctx.createDynamicsCompressor();
comp.threshold.value = -50;
comp.connect(ctx.destination);
var gain = {};
gain.v1 = ctx.createGain();
gain.v2 = ctx.createGain();
gain.v3 = ctx.createGain();
gain.v4 = ctx.createGain();
gain.v5 = ctx.createGain();
gain.v1.gain.value = 1;
gain.v2.gain.value = .1;
gain.v3.gain.value = .1;
gain.v4.gain.value = .2;
gain.v5.gain.value = .2;
gain.v1.connect(comp);
gain.v2.connect(comp);
gain.v3.connect(comp);
gain.v4.connect(comp);
gain.v5.connect(comp);
var env = function(size){
  var adsr = new Float32Array(size);
  for (var x=0;x<Math.ceil(size/4);++x){
    adsr[x] = 1/Math.ceil(size/4) * x;
  }
  for (var x=Math.ceil(size/4);x<Math.ceil(size/4*2);++x){
    adsr[x] = -.3/Math.ceil(size/4) * x + 1.3;
  }
  for (var x=Math.ceil(size/4*2);x<Math.ceil(size/4*3);++x){
    adsr[x] = .7;
  }
  for (var x=Math.ceil(size/4*3);x<size;++x){
    adsr[x] = -.7/Math.ceil(size/4) * x + 2.8;
  }
  return adsr;
}
var make_note = function(nobj,no){
  var rate = 44100;
  var sample = rate * nobj.duration;
  var src = ctx.createBufferSource();
  var buf = ctx.createBuffer(1,sample,rate);
  var data = new Float32Array(sample);
  var adsr = env(sample);
  data.forEach(function(y,x,data){
    data[x] = .2*adsr[x]*
      (
        .5*Math.sin(2*Math.PI*nobj.pitch/rate*x)+
        .01*Math.sin(2*Math.PI*nobj.pitch*2/rate*x)+
        .01*Math.sin(2*Math.PI*nobj.pitch*3/rate*x)+
        .01*Math.sin(2*Math.PI*nobj.pitch*4/rate*x)+
        .01*Math.sin(2*Math.PI*nobj.pitch*5/rate*x)+
        .01*Math.sin(2*Math.PI*nobj.pitch*6/rate*x)+
        .01*Math.sin(2*Math.PI*nobj.pitch*7/rate*x)
      );
  });
  buf.copyToChannel(data,0);
  src.buffer = buf;
  src.connect(gain[no]);
  return src;
}
var playTime = 0;
var ntime = {
  v1:playTime,
  v2:playTime,
  v3:playTime,
  v4:playTime,
  v5:playTime
};
var schedule_note = function(src,t,no){
  src.start(t);
}
var getntime = function(no){
  return ntime[no] + voice[no][0].duration;
};
var peek = function(ptime,no){
  while (voice[no].length && ntime[no]<ctx.currentTime+ptime){
    schedule_note(make_note(voice[no][0],no),ntime[no],no);
    ntime[no] = getntime(no);
    voice[no].splice(0,1);
  }
}
var playTimeSet = false;
var ptime = 1;
var timer = new Worker('js/timer.js');
timer.onmessage = function(e){
  if (!playTimeSet){
    playTimeSet = true;
    playTime = ctx.currentTime+ptime;
  }
  peek(ptime,"v1");
  peek(ptime,"v2");
  peek(ptime,"v3");
  peek(ptime,"v4");
  peek(ptime,"v5");
}
var start = document.getElementById("start");
start.onclick = function(e){
  timer.postMessage("");
}
