var worldindex = 0;
var worldx = 0,worldy = 0;
var socket = io('/maps');
socket.on('map',function (map) {
  $('#worlds').append(`<a href="/game/game.html#${worldx},${worldy}" style="float:left;">World ${worldx}, ${worldy}<br>Online: 0</a>`);
  
  worldx += 1;
  if (worldx > 9) {
    worldx = 0;
    worldy += 1;
  } 
})
  
  
  
