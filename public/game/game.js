var game = new GameEngine(document.getElementById('game'));
if (location.hash) {
  game.connect('https://'+location.hostname,location.hash.slice(1));
} else {
  alert('The Game Cannot be runned, try #0,0 instead.')
}
