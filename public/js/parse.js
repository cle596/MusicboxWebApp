function popspace(string){
  var newstring="";
  for (var x=0;x<string.length;++x){
    if (string[x]!=" "){
      newstring+=string[x];
    }
  }
  return newstring;
}

function fraction(string){
  var split = string.split('/');
  if (split.length>1){
      var result = parseInt(split[0], 10) / parseInt(split[1], 10);
      return result;
  }
  else {
    return string;
  }
}

function parse(data){
  data = data.replace(/\n/g,'');
  data = data.split("|");
  data.pop();
  data = data.join(",");
  data = data.split(",");
  for (var x=0;x<data.length;++x){
    data[x] = data[x].split(":");
  }
  for (var x=0;x<data.length;++x){
    data[x] = {
      pitch:  pitch[popspace(data[x][0])],
      duration: parseFloat(fraction(data[x][1]))
    }
  }
  return data;
}
var voice = {};
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    voice.v1 = parse(xhttp.responseText);
    ready.dispatchEvent(voiceready);
  }
}
xhttp.open("GET", "music/v1.not", true);
xhttp.send();

var ready = document.getElementById("ready");
var voiceready = new Event("voiceready");
ready.addEventListener("voiceready",function(e){
  console.log("voice ready");
});
