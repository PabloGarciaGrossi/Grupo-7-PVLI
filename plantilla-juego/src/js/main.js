'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(50, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/Fondo.png');
    this.game.load.image('titlesouls', 'images/TextoOldSouls.png');
    this.game.load.spritesheet('esqueleto', 'images/skeletons.png',16, 25, 8);
    this.game.load.spritesheet('player', 'images/SoldadoSouls.png', 92, 114, 32);
    this.game.load.tilemap('map', 'images/MapaPrueba.csv');
    this.game.load.image('tileset', 'images/tileset.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};
var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 600,
  zoom: 2,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
};
window.onload = function () {
  var game = new Phaser.Game(config);

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

// function Position(x, y) {
//   this.posx = x;
//   this.posy = y;
// }

function LivingThing(graphic, speed, health, damage) {
  this._graphic = graphic;
  this._speed = speed;
  this._health = health;
  this._damage = damage;
};
LivingThing.prototype.moveX = function () {
  this._graphic.x += this._speed;
}
LivingThing.prototype.moveY = function () {
  this._graphic.y += this._speed;
}