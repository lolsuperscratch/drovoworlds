var worldindex = 0;
var worldx = 0,worldy = 0;
var socket = io('/maps');
socket.on('map',function (map,online) {
  $('#worlds').append(`<a href="/game/game.html#${worldx},${worldy}" style="float:left;border:1px solid black;width:300px;height:300px;color:black;">World ${worldx}, ${worldy}<br>Online: ${online}</a>`);
  
  worldx += 1;
  if (worldx > 9) {
    worldx = 0;
    worldy += 1;
  } 
})
  
  
  
