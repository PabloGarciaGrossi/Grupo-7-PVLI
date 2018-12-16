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
    this.layer = this.map.createLayer('grounds');
    this.layer2 = this.map.createLayer('walls');
    this.layer3 = this.map.createLayer('windows');
    this.layer4 = this.map.createLayer('objects');
    // this.enemieslayer = this.map.createLayer('enemies');
    this.map.setCollisionBetween(1, 10000, true, 'walls');
    this.map.setCollisionBetween(7192, 7194, false, 'walls');
    this.map.setCollisionBetween(1, 10000, true, 'objects');
    this.layer.resizeWorld();
    this.layer2.resizeWorld();
    this.layer3.resizeWorld();
    this.layer4.resizeWorld();
    //this.layer2.debug = true;
    this.distance = 40;
    
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.skeletons = [];
    for (var ol in this.map.objects)
    {
      for (var o in this.map.objects[ol])
      {
        var enemy = new Enemy(this.game, 75,this.map.objects[ol][o].x,this.map.objects[ol][o].y,"esqueleto");
        this.enemies.add(enemy);
        this.skeletons[o] = enemy;
      }
    }
    for (var i in this.skeletons)
    {
      this.skeletons[i].create();
    }
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.sword = new Sword(this.game, -50, 0, 0, 'sword');
    this.sword.create();
    this.jugador = new Player(this.game,200,1408.24,2916,"player",this.cursors, this.sword, "fireball");
    this.rock = new RockRoll(this.game, 80, 700, 2835, "rock", 0, 400);
    this.jugador.create();
    this.jugador.addChild(this.sword);
    this.attackButton = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
    this.rock.create();
    this.estus = this.game.add.sprite(100, 100, 'estus');
    this.estus.scale.setTo(0.3,0.3);
    this.cross = this.game.add.sprite(140,120,'cross');
    this.cross.scale.setTo(0.05,0.05);
    this.num = this.game.add.sprite(180,113,'numbers');
    this.num.scale.setTo(0.45,0.45);
    this.num.animations.add('cero', [0], 1, false);
    this.num.animations.add('uno', [1], 1, false);
    this.num.animations.add('dos', [2], 1, false);
    this.num.animations.add('tres', [3], 1, false);
    this.num.animations.add('cuatro', [4], 1, false);
    this.num.animations.add('cinco', [5], 1, false);
    var barconfig = {x: 200, y: 50};
    var staminaconfig = {x: 162, y: 75, width: 175, height: 15};
    this.stamina = new HealthBar(this.game, staminaconfig);
    this.health = new HealthBar(this.game, barconfig);
    this.health.setFixedToCamera(true);
    this.stamina.setFixedToCamera(true);
    this.estus.fixedToCamera = true;
    this.cross.fixedToCamera = true;
    this.num.fixedToCamera = true;
    this.camera.follow(this.jugador);

  },

  update: function() {
    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);
    this.physics.arcade.collide(this.jugador,this.layer);
    this.physics.arcade.collide(this.jugador,this.layer2);
    this.physics.arcade.collide(this.jugador,this.layer3);
    this.physics.arcade.collide(this.jugador,this.layer4);
    for (var i in this.skeletons)
    {
      this.physics.arcade.collide(this.skeletons[i], this.layer);
      this.physics.arcade.collide(this.skeletons[i],this.layer2);
      this.physics.arcade.collide(this.skeletons[i],this.layer3);
      this.physics.arcade.collide(this.skeletons[i],this.layer4);
    }
    if (this.jugador.invincible === false)
    {
      for (var i in this.skeletons)
      {
        this.physics.arcade.collide(this.jugador, this.skeletons[i], this.collision, null, this);
      }
      this.physics.arcade.collide(this.jugador, this.rock, this.collision, null, this);
    }
    for (var i in this.skeletons)
    {
      this.physics.arcade.collide(this.skeletons[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.collide(this.skeletons[i], this.jugador.shoot, this.collision, null, this);
    }

    this.jugador.update();
    this.jugador.sword.update();
    for (var i in this.skeletons)
    {
      this.skeletons[i].update(this.jugador.x, this.jugador.y);
    }
    this.rock.update(this.jugador.x, this.jugador.y);
    switch(this.jugador.estus)
    {
      case 0:
      this.num.animations.play('cero');
      break;
      case 1:
      this.num.animations.play('uno');
      break;
      case 2:
      this.num.animations.play('dos');
      break;
      case 3:
      this.num.animations.play('tres');
      break;
      case 4:
      this.num.animations.play('cuatro');
      break;
      case 5:
      this.num.animations.play('cinco');
      break;
    }
  },

  collision : function (jugador, enemy) {
        jugador.col(enemy);
  },
  /*render: function() {

    this.game.debug.body(this.jugador);
    for (var i in this.skeletons)
    {
      this.game.debug.body(this.skeletons[i]);
    }

}*/
};
module.exports = PlayScene;