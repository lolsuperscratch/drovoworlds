var worldindex = 0;
var worldx = 0,worldy = 0;
var socket = io('/maps');
socket.on('map',function (map) {
  $('#worlds').append(`<a href="/game/game.html#${worldx},${worldy}" style="float:left;"><canvas id="world${worldx}-${worldy}" title="World ${worldx}, ${worldy}" width="300" height="300"></a>`);
  var world = new MapRenderer(document.getElementById(`world${worldx}-${worldy}`))
  world.render(map);
  worldx += 1;
  if (worldx > 9) {
    worldx = 0;
    worldy += 1;
  } 
})
  
  
  
