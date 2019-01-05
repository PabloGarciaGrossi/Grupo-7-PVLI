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

NPC.prototype.update = function(playerx, playery) {
    
     var dist = this.distanceToXY(playerx, playery);

     if (dist > 50){
        this.e.alpha = 0;
      }
      if(dist < 50) {
        this.e.alpha = 1;
      }
}

NPC.prototype.distanceToXY = function (x, y) {

    var dx =  this.x - x;
    var dy =  this.y - y;
  
    return Math.sqrt(dx * dx + dy * dy);
}

module.exports = NPC;
