'use strict'
var TextBox = require('./TextBox.js');
var Interactuable = require('./Interactuable.js');

function Chest(game, x, y, spritename, mejora)
  {
    Interactuable.call(this, game, x, y, spritename)
    this.opened = false;
    this.item = mejora;
    this.width = 50;
    this.height = 50;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    
    this.animations.add('closed', [0], 1, true);
    this.animations.add('opened', [1], 1, true);
    
    if(this.item == "estus"){
      this.texto = new TextBox(this.game, "Mejora de estus, ahora tienes\n seis frascos de estus");
      this.texto.create();
    }
    else if(this.item == "armor"){
      this.texto = new TextBox(this.game, "Mejora de armadura, los enemigos\nte quitan menos vida");
      this.texto.create();
    }
    else if(this.item == "speed"){
      this.texto = new TextBox(this.game, "Mejora de velocidad, ahora puedes\ncorrer mas rapido");
      this.texto.create();
    }
   
  }

Chest.prototype = Object.create(Interactuable.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.col = function(player) {
  if (this.opened == false) {
    this.animations.play('opened');
    this.opened = true;
    switch(this.item){
      case "estus":
       player.estus += 1;
       console.log("mejora de estus");
       this.game.mejoraEstus = true;
       this.texto.show();
       break;
      case "speed":
       player.speed += 200;
       console.log("mejora de velocidad");
       this.game.mejoraSpeed = true;
       this.texto.show();
       break;
      case "armor":
       player.resistencia -= 5;
       console.log("mejora de armor");
       this.game.mejoraArmor = true;
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

module.exports = Chest;

