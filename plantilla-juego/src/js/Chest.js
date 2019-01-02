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
    this.texto = new TextBox(this.game, this.x, this.y - 100, "fireball", "holi");
  }

Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;

    this.animations.add('closed', [0], 1, true);
    this.animations.add('opened', [1], 1, true);
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

Chest.prototype.update = function() {
  if (this.opened){
    this.animations.play('opened');
  }
  else this.animations.play('closed');
}

module.exports = Chest;

