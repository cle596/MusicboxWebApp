var combine = function() {
  var sample = 0;
  for (var x in arguments){
    sample += arguments[x].length;
  }
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
  for (var x=0;x<Math.ceil(size/32);++x){
    adsr[x] = 1/Math.ceil(size/32) * x;
  }
  for (var x=Math.ceil(size/32);x<Math.ceil(size/16);++x){
    adsr[x] = -.7/Math.ceil(size/32) * x + 1.7;
  }
  for (var x=Math.ceil(size/16);x<Math.ceil(size/4*2);++x){
    adsr[x] = .3;
  }
  for (var x=Math.ceil(size/4*2);x<size;++x){
    adsr[x] = -.3/Math.ceil(size/4*2) * x + .6;
  }
  return adsr;
}

var envelopes = [voice_env];
envelopes.push(function(sample) {
  var adsr = new Float32Array(sample);
  var piece = adsr.slice(0, Math.ceil(sample / 16));
  piece.forEach(function(y, x, data) {
    data[x] = 1 / Math.ceil(sample / 16) * x;
  });
  var piece2 = adsr.slice(Math.ceil(sample / 16), Math.ceil(sample / 16*2));
  piece2.forEach(function(y, x, data) {
    data[x] = -.7 / (Math.ceil(sample / 16)) * x + 1;
  });
  var piece3 = adsr.slice(Math.ceil(sample / 8 ));
  piece3.forEach(function(y, x, data) {
    data[x] = -.3 / (Math.ceil(sample / 8 * 7)) * x + .3;
  });
  adsr = combine(piece, piece2, piece3);
  return adsr;
});
