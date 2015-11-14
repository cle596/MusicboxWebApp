"use strict";

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
var ptime = 4;
var timer = new Worker('js/timer.js');
timer.onmessage = function(e){
  if (!playTimeSet){
    playTimeSet = true;
    playTime = ctx.currentTime+ptime;
    for (var x in ntime){
      ntime[x] = playTime;
    }
  }
  peek(ptime,"v4");
  peek(ptime,"v5");
  peek(ptime,"v1");
  peek(ptime,"v2");
  peek(ptime,"v3");
}
var start = document.getElementById("start");
start.onclick = function(e){
  timer.postMessage("");
}
