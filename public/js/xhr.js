var voice = {};

var xhr = function(no){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      voice[no] = parse(xhttp.responseText);
      ready.dispatchEvent(voiceready);
    }
  }
  xhttp.open("GET", "music/"+no+".not", true);
  xhttp.send();
}

xhr("v1");xhr("v2");xhr("v3");xhr("v4");xhr("v5");

var start = document.getElementById("start");
var ready = document.getElementById("ready");
var readycnt = 0;
var voiceready = new Event("voiceready");
ready.addEventListener("voiceready",function(e){
  readycnt+=1;
  if (readycnt==5){
    start.disabled = false;
    console.log("all voices ready");
  }
});
