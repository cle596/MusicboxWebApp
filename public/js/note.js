var make_note = function(nobj,no){
  var rate = 44100;
  var sample = rate * nobj.duration;
  var src = ctx.createBufferSource();
  var buf = ctx.createBuffer(1,sample,rate);
  var data = new Float32Array(sample);
  if (no=="v1"){
    var adsr = envelopes[0](sample);
  }
  else {
    var adsr = envelopes[1](sample);
  }
  data.forEach(function(y,x,data){
    data[x] = .2*adsr[x]*
      (
        .3*Math.sin(2*Math.PI*nobj.pitch/rate*x)+
        .05*Math.sin(2*Math.PI*nobj.pitch*2/rate*x)+
        .4*Math.sin(2*Math.PI*nobj.pitch*3/rate*x)+
        .05*Math.sin(2*Math.PI*nobj.pitch*4/rate*x)+
        .05*Math.sin(2*Math.PI*nobj.pitch*5/rate*x)+
        .05*Math.sin(2*Math.PI*nobj.pitch*6/rate*x)
      );
  });
  buf.copyToChannel(data,0);
  src.buffer = buf;
  src.connect(gain[no]);
  return src;
}
