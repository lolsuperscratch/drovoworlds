var worldx=0,worldy=0

for (var i = 0;i < 90;i++) {
  $('#worlds').append(`<a href="/game/game.html#${worldx},${worldy}" style="float:left;"><canvas id="world${worldx}-${worldy}" title="World ${worldx},${worldy}" width="300" height="300"></a>`);
  
  worldx += 1;
  if (worldx > 9) {
    worldx = 0;
    worldy += 1;
  } 
}
worldx=0,worldy=0
for (var i = 0;i < 90;i++) {
var world = new MapRenderer(document.getElementById(`world${worldx}-${worldy}`))
  var xhr = new XMLHttpRequest()
  xhr.open("GET",`/map/${worldx}/${worldy}`,true)
  xhr.onreadystatechange = function () {
  if(xhr.readyState === 4 && xhr.status === 200) {
    world.render(JSON.parse(xhr.responseText))
  }
  }
xhr.send();
  worldx += 1;
  if (worldx > 9) {
    worldx = 0;
    worldy += 1;
  } 
}
