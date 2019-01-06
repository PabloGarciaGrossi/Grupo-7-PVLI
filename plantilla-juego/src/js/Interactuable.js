'use strict';

function Interactuable(game, x, y,spritename) {
    Phaser.Sprite.call(this, game, x, y, spritename)
    this.anchor.setTo(0.5,0.5);
}

Interactuable.prototype = Object.create(Phaser.Sprite.prototype);
Interactuable.prototype.constructor = Interactuable;

Interactuable.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.body.moves = false;

    var esto = this;
     
    this.e = this.game.add.sprite(esto.x, esto.y - 50, "e");
    this.e.width = 50;
    this.e.height = 50;
    this.e.anchor.setTo(0.5,0.5);
    this.game.add.existing(this.e);
}

Interactuable.prototype.distanceToXY = function (x, y) {

    var dx =  this.x - x;
    var dy =  this.y - y;
  
    return Math.sqrt(dx * dx + dy * dy);
}

Interactuable.prototype.update = function(playerx, playery) {
    var dist = this.distanceToXY(playerx, playery);

    if (dist > 50){
       this.e.alpha = 0;
     }
     if(dist < 50) {
       this.e.alpha = 1;
     }
}

module.exports = Interactuable;