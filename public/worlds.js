var worldx=0,worldy=0

for (var i = 0;i < 90;i++) {
  $('#worlds').append(`<a href="/game/game.html#${worldx},${worldy}" style="float:left;"><img src="/tile/${worldx}/${worldy}" title="World ${worldx},${worldy}"></a>`);
  worldx += 1;
  if (worldx > 9) {
    worldx = 0;
    worldy += 1;
  } 
}
