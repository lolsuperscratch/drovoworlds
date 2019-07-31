// Game Engine for DrovoWorlds
var GameEngine = function (canvas) {
  this.players = {};
  this.images = {player:new Image(),tiles:new Image()};
  this.socket;
  this.canva = canvas;
  this.map = [];
  this.ctx = canvas.getContext('2d');
  this.images.player.src = '/images/player';
  this.images.tiles.src = '/images/tiles';
  this.frame = 0;
}
GameEngine.prototype.render = function () {
  // rendering the game
  var ctx = this.ctx;
  var canvas = this.canva;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // 1. tiles
  var tilex=0,tiley=0;
  for (var i = 0;i < this.map.length;i++) {
    var self = this.map[i];
    ctx.drawImage(this.images.tiles,self*32,0,32,32,tilex,tiley,32,32)
    tilex += 32;
    if (tilex >= canvas.width) {
      tilex = 0;
      tiley += 32;
    }
  }
  // 2. players
  for (var p in this.players) {
    var self = this.players[p];
    if (self.walking) {
      // when walking (next frame can be cycle walked.)
      ctx.drawImage(this.images.player,this.frame*32,self.animation*32,32,32,self.x,self.y,32,32);
    } else {
      // when not walking (stands here.)
      ctx.drawImage(this.images.player,0,self.animation*32,32,32,self.x,self.y,32,32);
    }
    
    // we recommend to put the names below of player.
    ctx.font = '5px Arial';
ctx.fillText(self.name, self.x, self.y+20);
  }
  // 3. next frame after rendering
  this.frame += 1;
  if (this.frame >= 4) {
    this.frame = 0;
  }
};
GameEngine.prototype.bindEvents = function () {
  var _this = this;
  this.socket.on('tick',function (players) {
    _this.players = players;
  });
  this.socket.on('map',function (map) {
    _this.map = map
  });
  $(window).on('keydown',function (e) {
    _this.socket.emit('keydown',e.key)
  });
  $(window).on('keyup',function (e) {
    _this.socket.emit('keyup',e.key)
  });
  setInterval(function () {
    _this.render();
  })
}
GameEngine.prototype.input = {
  down: function (key) {
    this.socket.emit('keydown',key)
  },
  up: function (key) {
    this.socket.emit('keyup',key)
  }
}
GameEngine.prototype.connect = function (server,room) {
  if (server) {
    this.socket = io(server);
  } else {
    this.socket = io();
  }
  this.bindEvents();
  var myname = prompt('Enter your name');
  this.socket.emit('join',room,myname || "Player");
}
