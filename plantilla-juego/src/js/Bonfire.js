'use strict'

var Interactuable = require('./Interactuable.js');

function Bonfire(game, x, y, spritename) {
    Interactuable.call(this, game, x, y, spritename)
    
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    
    this.animations.add('bonfire',[0,1,2,3],4,true);
}

Bonfire.prototype = Object.create(Interactuable.prototype);
Bonfire.prototype.constructor = Bonfire;

Bonfire.prototype.col = function(player) {
    player.estus = 5;
    player.salud = 100;
    player.stamina = 100;
}


module.exports = Bonfire;