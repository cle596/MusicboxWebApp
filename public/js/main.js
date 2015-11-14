"use strict";

var ctx = new AudioContext();
var comp = ctx.createDynamicsCompressor();
comp.threshold.value = -50;
comp.connect(ctx.destination);

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
var ntime = {
  v1:0,
  v2:0,
  v3:0,
  v4:0,
  v5:0
};
var schedule_note = function(src,t,no){
  if (t==0){
    ntime[no] = ctx.currentTime;
    src.start();
  }
  else{
    src.start(t);
  }
}
var getntime = function(no){
  return ntime[no] + voice[no][0].duration;
};
var peek = function(ptime,no){
  while (voice[no].length && ntime[no]<ctx.currentTime+ptime){
    schedule_note(make_note(voice[no][0],no),ntime[no]);
    ntime[no] = getntime(no);
    voice[no].splice(0,1);
  }
}
var timer = new Worker('js/timer.js');
timer.onmessage = function(e){
  peek(1000,"v1");
  peek(1000,"v2");
  peek(1000,"v3");
  peek(1000,"v4");
  peek(1000,"v5");
}
var start = document.getElementById("start");
start.onclick = function(e){
  timer.postMessage("");
}
