var express = require('express');
var ioServer = require('socket.io');
var {createCanvas, loadImage} = require('canvas');
var fs = require('fs');
var app = express();
app.use(express.static('public'));
var worlds = {};
function generateMap(size) {
  var generated = [];
  for (var i = 0;i < size;i++) {
    generated.push(Math.floor(Math.random()*3))
  }
  return generated;
}
app.get('/tile/:x/:y',function (req,res) {
  // canvas
  if (!worlds[req.params.x+','+req.params.y]) {
    worlds[req.params.x+','+req.params.y] = generateMap(500);
  }
  var curworld = worlds[req.params.x+','+req.params.y];
  var canvas = new createCanvas(300,300);
  var ctx = canvas.getContext('2d');
  var tilex = 0,tiley = 0;
  for (var i = 0;i < curworld;i++) {
    var curtile = curworld[i];
    if (curtile == 0) {
      ctx.fillStyle = 'green';
      ctx.fillRect(tilex,tiley,32,32)
    }
    if (curtile == 1) {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(tilex,tiley,32,32)
    }
    if (curtile == 2) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(tilex,tiley,32,32)
    }
    tilex += 32;
    if (tilex >= 300) {
      tiley += 32;
      tilex = 0;
    }
  }
  var out = fs.writeFileSync(__dirname + '/map.png',canvas.toBuffer('image/png'));
  res.sendFile(__dirname + '/map.png')
});
app.get('/images/player',function (req,res) {
  res.sendFile(__dirname + '/DrovoWorlds Character.png')
})
app.get('/images/tiles',function (req,res) {
  res.sendFile(__dirname + '/DrovoWorlds Tiles.png')
})
var serv = app.listen(process.env.PORT || 2000);
var io = ioServer(serv);
var players = {};
var player = function (id) {
  this.x = 0;
  this.y = 0;
  this.animation = 0;
  this.walking = false;
  this.name = "Player";
  this.id = id;
  this.room = 0;
  this.inputs = {};
}
function sendroom(room,evnt) {
  var args = Array.prototype.slice.call(arguments,2);
  for (var p in players) {
    if (players[p].room == room) {
      io.to(players[p].id).emit(evnt,args);
    }
  }
}
function playerList(room) {
  var plr = {};
  for (var p in players) {
    if (players[p].room == room) {
      plr[players[p].id] = players[p];
    }
  }
  return plr;
}
function playerTick(self) {
  if (self.inputs.ArrowUp) {
    self.y += 1;
    self.animation = 2;
    self.walking = true;
  }
  else if (self.inputs.ArrowDown) {
    self.y -= 1;
    self.animation = 3;
    self.walking = true;
  }
  else if (self.inputs.ArrowLeft) {
    self.x -= 1;
    self.animation = 1;
    self.walking = true;
  }
  else if (self.inputs.ArrowRight) {
    self.x += 1;
    self.animation = 0;
    self.walking = true;
  }
  else {
    self.walking = false;
  }
}
io.on('connection',function (socket) {
  players[socket.id] = new player(socket.id);
  var gameTickinterval;
  var self = players[socket.id];
  socket.on('join',function (room,name) {
    if (worlds[room]) {
      socket.emit('map',worlds[room])
    } else {
      worlds[room] = generateMap(500);
      socket.emit('map',worlds[room])
    }
    self.room = room;
    self.name = name || "Player";
    gameTickinterval = setInterval(function () {
      playerTick(self)
      socket.emit('tick',playerList(self.room))
    },1000);
  });
  socket.on('leave',function () {
    if (gameTickinterval) {
    clearInterval(gameTickinterval);
    gameTickinterval = undefined;
    }
    self.room = 0;
    socket.emit('doneleave');
  })
  socket.on('disconnect',function () {
    if (gameTickinterval) {
       clearInterval(gameTickinterval)
       gameTickinterval = undefined;
    }
    
    delete players[socket.id];
  })
  socket.on('keydown',function (key) {
    self.inputs[key] = true;
  })
  socket.on('keyup',function (key) {
    self.inputs[key] = false;
  })
  socket.on('chat',function (msg) {
    sendroom(self.room,'chat',[self.name,msg])
  })
})
