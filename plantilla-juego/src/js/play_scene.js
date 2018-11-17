'use strict';
var map;
var layer;
var Player = require('./player.js');
var jugador;
  var PlayScene = {
  create: function () {
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('map',32,32);
    this.map.addTilesetImage('tileset');
    this.map.setCollisionBetween(0,23);
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();
    this.layer.debug = true;
    
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jugador = new Player(this.game,300,this.game.world.centerX,this.game.world.centerY,"player",this.cursors);
    this.jugador.create();
    this.camera.follow(this.jugador);

  },

  update: function() {
    this.physics.arcade.collide(this.jugador,this.layer);

    //this.cosa.sprite.rotation += 0.01;
    this.jugador.update();

    console.log(this.TextoSouls);
  }
};
module.exports = PlayScene;