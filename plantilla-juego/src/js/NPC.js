'use strict';
var Character = require('./Character.js');

function NPC(game,x,y,spritename, dialogue)
{
    Character.call(this,game,0,x,y,spritename);
    this.text = dialogue;
}

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
}

NPC.prototype.col = function() {
    console.log("Hola, viajero");
}

module.exports = NPC;
