'use strict'

function Bonfire(game, x, y, spritename) {
    Phaser.Sprite.call(this, game, x, y, spritename);
    this.anchor.setTo(0.5, 0.5);
}

Bonfire.prototype = Object.create(Phaser.Sprite.prototype);
Bonfire.prototype.constructor = Bonfire;

Bonfire.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.body.moves = false;
    this.width = 100;
    this.height = 100;

    var esto = this;
     
    this.e = this.game.add.sprite(esto.x, esto.y - 50, "e");
    this.e.width = 50;
    this.e.height = 50;
    this.e.anchor.setTo(0.5,0.5);
    this.game.add.existing(this.e);
}

Bonfire.prototype.col = function(player) {
    player.estus = 5;
    player.salud = 100;
    player.stamina = 100;
}

Bonfire.prototype.update = function(playerx, playery) {
    
    var dist = this.distanceToXY(playerx, playery);

    if (dist > 50){
       this.e.alpha = 0;
     }
     if(dist < 50) {
       this.e.alpha = 1;
     }
}

Bonfire.prototype.distanceToXY = function (x, y) {

   var dx =  this.x - x;
   var dy =  this.y - y;
 
   return Math.sqrt(dx * dx + dy * dy);
}

module.exports = Bonfire;