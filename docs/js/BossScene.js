'use strict';
var Player = require('./player.js');
var HealthBar = require('./HealthBar.js');
var Sword = require('./sword.js');
var FireCone = require ('./FireCone.js');
var Boss = require('./Boss.js');
var fireCircle = require('./FireCircle.js');

var BossScene = 
{
    create: function () 
    {
    this.defeated = false;
    this.music = this.game.add.audio('boss');
    this.map = this.game.add.tilemap('boss');
    this.map.addTilesetImage('tilesInterior', 'tilesetCastillo');
    this.layer = this.map.createLayer('grounds');
    this.layer2 = this.map.createLayer('walls');
    this.layer3 = this.map.createLayer('windows');
    this.layer4 = this.map.createLayer('objects');
    this.layer.renderSettings.enableScrollDelta = true;
    this.layer2.renderSettings.enableScrollDelta = true;
    this.layer3.renderSettings.enableScrollDelta = true;
    this.layer4.renderSettings.enableScrollDelta = true;
    this.map.setCollisionBetween(1, 10000, true, 'walls');
    this.map.setCollisionBetween(1, 10000, true, 'windows');
    this.map.setCollisionBetween(1, 10000, true, 'objects');
    this.layer.resizeWorld();
    this.layer2.resizeWorld();
    this.layer3.resizeWorld();
    this.layer4.resizeWorld();

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.sword = new Sword(this.game, -50, 0, 0, 'sword');
    this.sword.create();
    this.fireCone = new FireCone(this.game, -50, 0, 0, 'firecone');
    this.fireCone.create();


    this.fireAura = new fireCircle(this.game, 0, 0, 0, "fuego", 40);
    this.fireAura.create();
    this.boss = new Boss(this.game, 30, 480,552,"boss",'','',7.5,40,"hielo","rayo","fuego",this.fireAura);
    this.boss.create();
    if (this.game.mejoraSpeed) {
        this.jugador = new Player(this.game,300,480, 800,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
      } else this.jugador = new Player(this.game,200,480, 900,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    this.jugador.create();

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
    this.stamina.setBarColor('#109510');
    this.health = new HealthBar(this.game, barconfig);
    this.health.setFixedToCamera(true);
    this.stamina.setFixedToCamera(true);
    this.estus.fixedToCamera = true;
    this.cross.fixedToCamera = true;
    this.num.fixedToCamera = true;
    this.camera.follow(this.jugador);
    this.victory = this.game.add.sprite(0, 100, 'victory');
    this.victory.scale.setTo(1.5,1.5);
    this.victory.alpha = 0;
    this.victory.fixedToCamera = true;

    },
    update: function() 
    {
    this.music.play('',0,0.1,false,false);
    if(this.boss.salud <= 0 && !this.defeated)
    {
        this.music.stop();
        this.music = this.game.add.audio('victory');
        this.music.play();
        this.defeated = true;
    }
    if (this.defeated)
    {
        if (this.victory.alpha < 1)
        {
            this.victory.alpha += 0.0024;
        }
        else
        {
            this.music.stop();
            this.game.state.start('mainmenu');
        }
    }
    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);
    this.physics.arcade.collide(this.jugador,this.layer);
    this.physics.arcade.collide(this.jugador,this.layer2);
    this.physics.arcade.collide(this.jugador,this.layer3);
    this.physics.arcade.collide(this.jugador,this.layer4);

    this.physics.arcade.collide(this.boss, this.layer);
    this.physics.arcade.collide(this.boss,this.layer2);
    this.physics.arcade.collide(this.boss,this.layer3);

    this.physics.arcade.collide(this.boss, this.jugador.sword, this.collision, null, this);
    this.physics.arcade.overlap(this.boss, this.jugador.sword, this.collision, null, this);
    this.physics.arcade.overlap(this.boss, this.jugador.fireCone, this.collision, null, this);
    this.physics.arcade.collide(this.boss, this.jugador.fireCone, this.collision, null, this);

    this.physics.arcade.collide(this.jugador, this.boss, this.collision, null, this);
    this.physics.arcade.collide(this.jugador, this.boss.aura, this.collision, null, this);

    this.jugador.update();
    this.boss.update(this.jugador, this.jugador.x, this.jugador.y);

    this.jugador.sword.update();
    this.jugador.fireCone.update();

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
  render: function() {

    /*this.game.debug.body(this.jugador);
    this.game.debug.body(this.jugador.sword);
    this.game.debug.body(this.jugador.fireCone);
    this.game.debug.body(this.boss);
    this.game.debug.body(this.boss.aura);*/
}
};
module.exports = BossScene;