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
