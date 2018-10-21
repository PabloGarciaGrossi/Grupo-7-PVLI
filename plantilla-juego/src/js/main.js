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
    this.game.load.image('titlesouls', 'images/TextoOldSouls.png')
  },

  create: function () {
    this.game.state.start('play');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

function Position(x,y)
{
  this.posx = x;
  this.posy = y;
}

function LivingThing(graphic, position, speed, health, damage){
this._graphic = graphic;
this._position = position;
this._speed = speed;
this._health = health;
this._damage = damage;
};

function Enemy (graphic, position, speed, health, damage)
{
  LivingThing.apply(this, [graphic, position, speed, health, damage]);
}

function Player (graphic, position, speed, health, damage, defense, magicDmg)
{
  LivingThing.apply(this, [graphic, position, speed, health, damage]);
  this._estus = 3;
  this._defense = defense;
  this._magicDmg = magicDmg;
  this._currenthealth = health;
}
Player.prototype.drink = function(){
  this._estus -= 1;
  this._currenthealth += 50;
}
