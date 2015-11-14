"use strict";

var ctx = new AudioContext();
var comp = ctx.createDynamicsCompressor();
comp.threshold.value = -50;
comp.connect(ctx.destination);
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
var make_note = function(nobj){
  var rate = 44100;
  var sample = rate * nobj.duration;
  var src = ctx.createBufferSource();
  var buf = ctx.createBuffer(1,sample,rate);
  var data = new Float32Array(sample);
  var adsr = env(sample);
  data.forEach(function(y,x,data){
    data[x] = adsr[x]*Math.sin(2*Math.PI*nobj.pitch/rate*x);
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
    for (var x in ntime){
      ntime[x] = ctx.currentTime;
    }
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
