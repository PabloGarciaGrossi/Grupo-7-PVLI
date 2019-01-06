'use strict';
var Interactuable = require('./Interactuable.js');
var TextBox = require('./TextBox.js');

function NPC(game,x,y,spritename, dialogue)
{
    Interactuable.call(this, game, x, y, spritename)
    this.text = dialogue;
}

NPC.prototype = Object.create(Interactuable.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    
    this.texto = new TextBox(this.game, this.text);
    this.texto.create();

    var esto = this;
     
    this.e = this.game.add.sprite(esto.x, esto.y - 50, "e");
    this.e.width = 50;
    this.e.height = 50;
    this.e.anchor.setTo(0.5,0.5);
    this.game.add.existing(this.e);
}

NPC.prototype.col = function() {
    this.texto.show();
}

module.exports = NPC;
