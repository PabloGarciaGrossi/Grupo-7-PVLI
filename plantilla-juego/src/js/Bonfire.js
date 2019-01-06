'use strict'

var Interactuable = require('./Interactuable.js');

function Bonfire(game, x, y, spritename) {
    Phaser.Sprite.call(this, game, x, y, spritename)
}

Bonfire.prototype = Object.create(Interactuable.prototype);
Bonfire.prototype.constructor = Bonfire;

Bonfire.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.body.moves = false;
    this.animations.add('bonfire',[0,1,2,3],4,true);

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


module.exports = Bonfire;