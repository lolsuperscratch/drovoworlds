var MapRenderer = function (canvas) {
  this.tiles = new Image();
  this.canva = canvas;
  this.ctx = canvas.getContext('2d');
  this.tiles.src = '/images/tiles';
}
MapRenderer.prototype.render = function (map) {
  var ctx = this.ctx;
  var canvas = this.canva;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var tilex=0,tiley=0;
  for (var i = 0;i < this.map.length;i++) {
    var self = this.map[i];
    ctx.drawImage(this.tiles,self*32,0,32,32,tilex,tiley,32,32)
    tilex += 32;
    if (tilex >= canvas.width) {
      tilex = 0;
      tiley += 32;
    }
  }
}
