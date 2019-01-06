'use strict';
var Interactuable = require('./Interactuable.js');
var TextBox = require('./TextBox.js');

function NPC(game,x,y,spritename, dialogue)
{
    Interactuable.call(this, game, x, y, spritename)
    this.text = dialogue;
    
    
    this.texto = new TextBox(this.game, this.text);
    this.texto.create();
}

NPC.prototype = Object.create(Interactuable.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.col = function() {
    this.texto.show();
}

module.exports = NPC;
