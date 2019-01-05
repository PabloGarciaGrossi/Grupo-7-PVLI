'use strict'
var TextBox = require('./TextBox.js');

function Chest(game, x, y, spritename, mejora)
  {
    Phaser.Sprite.call(this, game, x, y, spritename)
    this.anchor.setTo(0.5,0.5);
    this.opened = false;
    this.item = mejora;
    this.width = 50;
    this.height = 50;
   
  }

Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.body.moves = false;
    this.animations.add('closed', [0], 1, true);
    this.animations.add('opened', [1], 1, true);
    
    this.texto = new TextBox(this.game, "Mejora");
    this.texto.create();

    var esto = this;
     
    this.e = this.game.add.sprite(esto.x, esto.y - 50, "e");
    this.e.width = 50;
    this.e.height = 50;
    this.e.anchor.setTo(0.5,0.5);
    this.game.add.existing(this.e);
}

Chest.prototype.col = function(player) {
  if (this.opened == false) {
    this.animations.play('opened');
    this.opened = true;
    switch(this.item){
      case "estus":
       player.estus += 1;
       console.log("mejora de estus");
       this.texto.show();
       break;
      case "speed":
       player.speed += 200;
       console.log("mejora de velocidad");
       this.texto.show();
       break;
      case "armor":
       player.resistencia -= 5;
       console.log("mejora de armor");
       this.texto.show();
       break;
    }
  }
}

Chest.prototype.update = function(playerx, playery) {

  var dist = this.distanceToXY(playerx, playery);

  if (this.opened){
    this.animations.play('opened');
    this.e.alpha = 0;
  }
  else {
    this.animations.play('closed');
    if (dist > 50){
      this.e.alpha = 0;
    }
    if(dist < 50) {
      this.e.alpha = 1;
    }
  }
}

Chest.prototype.distanceToXY = function (x, y) {

  var dx =  this.x - x;
  var dy =  this.y - y;

  return Math.sqrt(dx * dx + dy * dy);
}

module.exports = Chest;

