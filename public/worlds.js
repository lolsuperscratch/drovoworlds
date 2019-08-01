var worldindex = 0;
var worldx = 0,worldy = 0;
var socket = io('/maps');
socket.on('map',function (map,online,players) {
  var convertedto = "";
  for (var p in players) {
    convertedto += players[p].name+"<br>"
  }
  $('#worlds').append(`<a href="/game/game.html#${worldx},${worldy}" style="float:left;border:1px solid black;width:300px;height:300px;color:black;text-decoration: none;font-family:Helvetica,Arial,sans-serif;">World ${worldx}, ${worldy}<br>Online: ${online}<br>${convertedto}</a>`);
  
  worldx += 1;
  if (worldx > 9) {
    worldx = 0;
    worldy += 1;
  } 
})
socket.on('clearall',function () {
  $('#worlds > a').remove();
})
  
  
