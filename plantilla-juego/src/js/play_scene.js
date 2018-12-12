'use strict';
var Player = require('./player.js');
var Enemy = require('./Enemy.js');
var RockRoll = require('./RockRoll.js');
var HealthBar = require('./HealthBar.js');
var Sword = require('./sword.js');
var RangedEnemy = require('./RangedEnemy.js');

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
    this.enemy = new Enemy(this.game, 75, 700,1990,"esqueleto");
    this.sword = new Sword(this.game, -50, 0, 0, 'sword');
    this.sword.create();
    this.jugador = new Player(this.game,300,550,2835,"player",this.cursors, this.sword, "fireball");
    this.rock = new RockRoll(this.game, 80, 700, 2835, "rock", 0, 400);
    this.archer = new RangedEnemy(this.game, 1000, 2835,0, "esqueleto", "fireball");
    this.enemy.create();
    this.jugador.create();
    this.archer.create();
    this.jugador.addChild(this.sword);
    this.attackButton = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
    this.rock.create();
    var barconfig = {x: 200, y: 50};
    var staminaconfig = {x: 162, y: 75, width: 175, height: 15};
    this.stamina = new HealthBar(this.game, staminaconfig);
    this.health = new HealthBar(this.game, barconfig);
    this.health.setFixedToCamera(true);
    this.stamina.setFixedToCamera(true);
    this.enemies = this.game.add.group();
    this.enemies.add(this.enemy);
    this.camera.follow(this.jugador);

  },

  update: function() {
    this.physics.arcade.collide(this.jugador,this.layer);
    this.physics.arcade.collide(this.jugador,this.layer2);
    this.physics.arcade.collide(this.jugador,this.layer3);
    this.physics.arcade.collide(this.jugador,this.layer4);
    this.physics.arcade.collide(this.enemy, this.layer);
    this.physics.arcade.collide(this.enemy,this.layer2);
    this.physics.arcade.collide(this.enemy,this.layer3);
    this.physics.arcade.collide(this.enemy,this.layer4);
    //this.physics.arcade.collide(this.jugador,this.enemy);
    //this.physics.arcade.collide(this.rock, this.layer);
    if (this.jugador.invincible === false)
    {
      this.physics.arcade.collide(this.jugador, this.enemy, this.collision, null, this);
      this.physics.arcade.collide(this.jugador, this.rock, this.collision, null, this);
      this.physics.arcade.collide(this.jugador, this.archer, this.collision, null, this);
    }
    
    this.physics.arcade.collide(this.enemy, this.jugador.sword, this.collision, null, this);
    this.physics.arcade.collide(this.enemy, this.jugador.shoot, this.collision, null, this);
    this.physics.arcade.collide(this.archer, this.jugador.sword, this.collision, null, this);
    this.physics.arcade.collide(this.archer, this.jugador.shoot, this.collision, null, this);

    this.jugador.update();
    this.jugador.sword.update();
    this.archer.update(this.jugador, this.jugador.x, this.jugador.y);
    this.enemy.update(this.jugador.x, this.jugador.y);
    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);
    //this.sword.update(this.jugador);
    this.rock.update(this.jugador.x, this.jugador.y);
  },

  collision : function (jugador, enemy) {
        jugador.col(enemy);
  }

  
};
module.exports = PlayScene;