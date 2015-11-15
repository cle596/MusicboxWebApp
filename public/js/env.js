var combine = function() {
  var arr = new Float32Array(sample);
  var z = 0;
  for (var x in arguments) {
    arguments[x].forEach(function(y, x, data) {
      arr[z] = y;
      z += 1;
    });
  }
  return arr;
}


var voice_env = function(size){
  var adsr = new Float32Array(size);
  for (var x=0;x<Math.ceil(size/4);++x){
    adsr[x] = 1/Math.ceil(size/4) * x;
  }
  for (var x=Math.ceil(size/4);x<Math.ceil(size/4*2);++x){
    adsr[x] = -.5/Math.ceil(size/4) * x + 1.5;
  }
  for (var x=Math.ceil(size/4*2);x<Math.ceil(size/4*3);++x){
    adsr[x] = .5;
  }
  for (var x=Math.ceil(size/4*3);x<size;++x){
    adsr[x] = -.5/Math.ceil(size/4) * x + 2;
  }
  return adsr;
}

var envelopes = [voice_env];
envelopes.push(function(sample) {
  var adsr = new Float32Array(sample);
  var piece = adsr.slice(0, Math.ceil(sample / 64));
  piece.forEach(function(y, x, data) {
    data[x] = 1 / Math.ceil(sample / 64) * x;
  });
  var piece2 = adsr.slice(Math.ceil(sample / 64), Math.ceil(sample / 64*2));
  piece2.forEach(function(y, x, data) {
    data[x] = -.99 / (Math.ceil(sample / 64)) * x + 1;
  });
  var piece3 = adsr.slice(Math.ceil(sample / 32 ));
  piece3.forEach(function(y, x, data) {
    data[x] = -.01 / (Math.ceil(sample / 32 * 31)) * x + .01;
  });
  adsr = combine(piece, piece2, piece3);
  return adsr;
});
