'use strict';
var Player = require('./player.js');
var Enemy = require('./Enemy.js');
var RockRoll = require('./RockRoll.js');
var HealthBar = require('./HealthBar.js');

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
    this.jugador = new Player(this.game,300,545,2835,"player",this.cursors);
    this.enemy = new Enemy(this.game, 75, 700,1990,"esqueleto");
    //this.rock = new RockRoll(this.game, 80, 500, 150, "rock", 0, 400);
    this.jugador.create();
    this.enemy.create();
    //this.rock.create();
    var barconfig = {x: 200, y: 50};
    this.health = new HealthBar(this.game, barconfig);
    this.health.setFixedToCamera(true);

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
    this.physics.arcade.overlap(this.jugador, this.rock, this.collision, null, this);

    //this.cosa.sprite.rotation += 0.01;
    this.jugador.update();
    this.enemy.update(this.jugador.x, this.jugador.y);
    //this.rock.update(this.jugador.x, this.jugador.y);
  },

  collision : function (jugador, enemy) {

    if (enemy.x > jugador.x)
    {
      jugador.x -= 100;
      jugador.salud -= 5;
      this.health.setPercent(jugador.salud);
    }
    else if (enemy.x <= jugador.x) {
      jugador.x += 100;
      jugador.salud -= 5;
      this.health.setPercent(jugador.salud);
      
    } else if (enemy.y > jugador.y)
    {
      jugador.y += 100;
      jugador.salud -= 5;
      this.health.setPercent(jugador.salud);
    }
    else if (enemy.y <= jugador.y)
    {
      jugador.y -= 100;
      jugador.salud -= 5;
      this.health.setPercent(jugador.salud);
    }

    //this.game.state.start(this.game.state.current);

  }

};
module.exports = PlayScene;