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
