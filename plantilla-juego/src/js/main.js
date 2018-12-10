'use strict';

var PlayScene = require('./play_scene.js');
var MainMenu = require('./MainMenu.js');


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

    //imagenes
    this.game.load.image('logo', 'images/Fondo.png');
    this.game.load.image('titlesouls', 'images/TextoOldSouls.png');
    this.game.load.spritesheet('esqueleto', 'images/skeletons2.png',32, 50, 16);
    this.game.load.spritesheet('player', 'images/SoldadoSouls2.png', 38, 48, 72);
    this.game.load.spritesheet('sword', 'images/ProbandoEspada.png', 51, 57, 32);
    this.game.load.tilemap('map', 'images/MapaPrueba.csv');
    this.game.load.tilemap('mapa', 'maps/ElMapa.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tilesetCastillo', 'images/tilesCastillo.png');
    this.game.load.image('tileset', 'images/tileset.png');
    this.game.load.image('menu', 'images/Menu.png');
    this.game.load.spritesheet('fireball', 'images/fireball.png',35,22,4);

    //musica
    this.game.load.audio('musicmenu', 'music/mainmenu.mp3');

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
  game.state.add('mainmenu', MainMenu);

  game.state.start('boot');
};

// function LivingThing(graphic, speed, health, damage) {
//   this._graphic = graphic;
//   this._speed = speed;
//   this._health = health;
//   this._damage = damage;
// };
// LivingThing.prototype.moveX = function () {
//   this._graphic.x += this._speed;
// }
// LivingThing.prototype.moveY = function () {
//   this._graphic.y += this._speed;
// }