'use strict';

var PlayScene = require('./play_scene.js');
var NivelBosque = require('./NivelBosque.js');
var play_sceneCueva = require('./play_sceneCueva.js');
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
    this.game.load.spritesheet('esqueleto', 'images/skeletons2.png',32, 50, 24);
    this.game.load.spritesheet('archer', 'images/Arquero.png',44,52,16);
    this.game.load.spritesheet('player', 'images/SoldadoSouls2.png', 38, 48, 80);
    this.game.load.spritesheet('sword', 'images/ProbandoEspada.png', 51, 57, 32);
    this.game.load.tilemap('primero', 'maps/MapaConEnemigos.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('bosque', 'maps/Bosque.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('cueva', 'maps/Cueva.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tilesetCastillo', 'images/tilesCastillo.png');
    this.game.load.image('tilesetBosque', 'images/tilesBosque.png');
    this.game.load.image('tilesetCueva', 'images/tilesetCueva.png');
    this.game.load.image('tileset', 'images/tileset.png');
    this.game.load.image('menu', 'images/Menu.png');
    this.game.load.image('rock', 'images/Pedrolo.png');
    this.game.load.image('estus', 'images/Estus.png');
    this.game.load.image('cross', 'images/cross.png');
    this.game.load.spritesheet('numbers', 'images/Numbers.png',58,93,6);
    this.game.load.spritesheet('fireball', 'images/fireball.png',35,22,4);
    this.game.load.spritesheet('firecone', 'images/fireCone.png',84,61,10);
    this.game.load.spritesheet('stone', 'images/Pedrolo.png',117,124,4);
    this.game.load.image('sans', 'images/Sans.png');
    this.game.load.image('arrow', 'images/Arrow.png');
    this.game.load.image('poison', 'images/posion.png');
    this.game.load.spritesheet('rat', 'images/Ratitas.png', 32,32,16);
    this.game.load.spritesheet('chest', 'images/chest.png', 122, 131, 2);
    this.game.load.image('textbox', 'images/textbox.png');
    this.game.load.spritesheet('knight', 'images/Caballero.png', 44,52,16);
    this.game.load.image('maza', 'images/maza.png');

    //musica
    this.game.load.audio('musicmenu', 'music/mainmenu.mp3');

  },

  create: function () {
    this.game.state.start('cueva');
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
  game.state.add('cueva', play_sceneCueva);
  game.state.add('mainmenu', MainMenu);

  game.state.start('boot');
};
