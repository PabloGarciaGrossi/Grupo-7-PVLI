'use strict';
var Character = require('./Character.js');
var TextBox = require('./TextBox.js');

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
    
    this.texto = new TextBox(this.game, this.text);
    this.texto.create();
}

NPC.prototype.col = function() {
    this.texto.show();
}

module.exports = NPC;
