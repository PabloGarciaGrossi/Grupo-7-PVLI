'use strict';
var Player = require('./player.js');
var Enemy = require('./Enemy.js');
var RockRoll = require('./RockRoll');

var PlayScene = {

  create: function () {
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('mapa');
    this.map.addTilesetImage('tilesInterior', 'tilesetCastillo');
    //this.map.setCollisionBetween(0,23);
    this.layer = this.map.createLayer('ground');
    this.layer2 = this.map.createLayer('walls');
    this.layer3 = this.map.createLayer('windows');
    this.layer4 = this.map.createLayer('objects');
    this.map.setCollisionBetween(1, 10000, true, 'walls');
    this.map.setCollisionBetween(7192, 7194, false, 'walls');
    this.map.setCollisionBetween(1, 10000, true, 'objects');
    this.layer.resizeWorld();
    this.layer2.resizeWorld();
    this.layer3.resizeWorld();
    this.layer4.resizeWorld();
    //this.layer2.debug = true;
    this.distance = 40;
    
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jugador = new Player(this.game,300,this.game.world.centerX,this.game.world.centerY,"player",this.cursors);
    this.enemy = new Enemy(this.game, 75, 150,150,"esqueleto");
    //this.rock = new RockRoll(this.game, 80, 500, 150, "rock", 0, 400);
  
    this.jugador.create();
    this.enemy.create();
    //this.rock.create();
    
    this.camera.follow(this.jugador);

  },

  update: function() {
    this.physics.arcade.collide(this.jugador,this.layer);
    this.physics.arcade.collide(this.jugador,this.layer2);
    this.physics.arcade.collide(this.jugador,this.layer3);
    this.physics.arcade.collide(this.jugador,this.layer4);
    this.physics.arcade.collide(this.enemy, this.layer);
    //this.physics.arcade.collide(this.rock, this.layer);

    this.physics.arcade.overlap(this.jugador, this.enemy, this.collision, null, this);
    this.jugador.update();
    this.enemy.update(this.jugador.x, this.jugador.y);
    //this.rock.update(this.jugador.x, this.jugador.y);

  },

  collision : function (jugador, enemy) {

    if (enemy.x > jugador.x)
    {
      jugador.x -= 20;
      /*jugador.body.velocity.x = -500;
      jugador.knockback = true;
      jugador.lastposition = jugador.x;*/
    }
    else{
      jugador.x += 20;
    }
    if (enemy.y > jugador.y)
    {
      jugador.y += 20;
    }
    else
    {
      jugador.y -= 20;
    }

    //this.game.state.start(this.game.state.current);

  }

};
module.exports = PlayScene;