'use strict';
var Interactuable = require('./Interactuable.js');
var TextBox = require('./TextBox.js');

function NPC(game,x,y,spritename, dialogue)
{
    Interactuable.call(this, game, x, y, spritename)
    this.text = dialogue;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    
    this.texto = new TextBox(this.game, this.text);
    this.texto.create();
}

NPC.prototype = Object.create(Interactuable.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.col = function() {
    this.texto.show();
    this.texto.bringToTop();
    this.texto.texto.bringToTop();
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {this.text = "Ja ja ja ja";}, this);
    this.texto = new TextBox(this.game, this.text);
    this.texto.create();
}

module.exports = NPC;
