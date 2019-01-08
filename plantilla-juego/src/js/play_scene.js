'use strict';
var Player = require('./player.js');
var Enemy = require('./Enemy.js');
var RockRoll = require('./RockRoll.js');
var HealthBar = require('./HealthBar.js');
var Sword = require('./sword.js');
var RangedEnemy = require('./RangedEnemy.js');
var Rats = require('./Rats.js');
var Chest = require('./Chest.js');
var NPC = require('./NPC.js');
var FireCone = require ('./FireCone.js');
var Knight = require('./Knight.js');
var mazaCaballero = require('./MazaCaballero.js');
var Bonfire = require('./Bonfire.js');

var PlayScene = {

  create: function () {
    //Inicialización de todos los elementos del mapa
    this.music = this.game.add.audio('castle');
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('primero');
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
    

    //Inicialización de los enemigos: Se leen del JSON del mapa y se guardan en sus respectivos arrays
    this.skeletons = [];
    this.archers = [];
    this.rats = [];
    this.knights = [];
    for (var ol in this.map.objects)
    {
      for (var o in this.map.objects[ol])
      {
        if (this.map.objects[ol][o].gid == 5505)
        {
        var enemy = new Enemy(this.game, 75,this.map.objects[ol][o].x,this.map.objects[ol][o].y,"esqueleto","skeletonAudio","tackle",0.8,35);
        this.skeletons[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 5824)
        {
          var enemy = new RangedEnemy(this.game, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 0, "archer", "arrow","armor","archer",0.8,30);
          this.archers[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 5280)
        {
          var enemy = new Rats(this.game, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 90, "rat", "poison","rat","ratAttack",0.6,25);
          this.rats[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 5264)
        {
          var maza = new mazaCaballero(this.game, 0, 0, 0, 'maza',40);
          var enemy = new Knight(this.game, 30, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 'knight', maza,"armor","swing",2.3,40);
          this.knights[o] = enemy;
        }
      }
    }

    //Creación de los enemigos
    for (var i in this.skeletons)
    {
      this.skeletons[i].create();
    }
    for (var i in this.archers)
    {
      this.archers[i].create();
    }
    for (var i in this.rats)
    {
      this.rats[i].create();
    }
    for (var i in this.knights)
    {
      this.knights[i].create();
    }

    //Elementos que utiliza el jugador
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.sword = new Sword(this.game, -50, 0, 0, 'sword');
    this.sword.create();
    this.fireCone = new FireCone(this.game, -50, 0, 0, 'firecone');
    this.fireCone.create();
    this.enepece = new NPC(this.game, 600, 350, "solaire", "Tanto alabar al sol, que al final\nse me han quedado los brazos asi");
    this.enepece.create();
    this.chest = new Chest(this.game, 1980, 1895, "chest", "speed");
    this.chest.create();
    this.bonfire = new Bonfire (this.game, 49, 1095, "bonfire");
    this.bonfire.create();
    this.bonfire2 = new Bonfire (this.game, 1250, 3072, "bonfire");
    this.bonfire2.create();
    //Creación del jugador
    if (this.game.mejoraSpeed) {
      this.jugador = new Player(this.game,300,1312.24, 3072,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    } else this.jugador = new Player(this.game,200,1312.24, 3072,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    this.jugador.create();

    //Creación de la roca
    this.rock = new RockRoll(this.game, 200, 1768, 228, "stone", 2, 400);
    this.rock.create();

     //Iinicialización del HUD
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

  },

  update: function() {
    this.music.play('',0,1,false,false);

    //Comprueba que el jugador está en la zona de pasar de nivel, si es así, cambia de escena.
    if (this.jugador.x > 1729 && this.jugador.x < 1814 && this.jugador.y < 119){
      this.music.pause();
      this.game.state.start('boss');
 }

    //Actualización de las barras de vida y estamina
    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);

    //Colisión de los Characters del mapa con el propio mapa
    this.physics.arcade.collide(this.jugador,this.layer);
    this.physics.arcade.collide(this.jugador,this.layer2);
    this.physics.arcade.collide(this.jugador,this.layer3);
    this.physics.arcade.collide(this.jugador,this.layer4);
    this.physics.arcade.collide(this.jugador,this.chest);
    this.physics.arcade.collide(this.jugador,this.bonfire);
    this.physics.arcade.collide(this.jugador,this.bonfire2);
    this.physics.arcade.collide(this.jugador,this.enepece);
    for (var i in this.skeletons)
    {
      this.physics.arcade.collide(this.skeletons[i], this.layer);
      this.physics.arcade.collide(this.skeletons[i],this.layer2);
      this.physics.arcade.collide(this.skeletons[i],this.layer3);
      this.physics.arcade.collide(this.skeletons[i],this.layer4);
    }
    for (var i in this.archers)
    {
      this.physics.arcade.collide(this.archers[i], this.layer);
      this.physics.arcade.collide(this.archers[i], this.layer2);
      this.physics.arcade.collide(this.archers[i], this.layer3);
      this.physics.arcade.collide(this.archers[i], this.layer4);
    }
    for (var i in this.rats)
    {
      this.physics.arcade.collide(this.rats[i], this.layer);
      this.physics.arcade.collide(this.rats[i], this.layer2);
      this.physics.arcade.collide(this.rats[i], this.layer3);
      this.physics.arcade.collide(this.rats[i], this.layer4);
    }
    for (var i in this.knights)
    {
      this.physics.arcade.collide(this.knights[i], this.layer);
      this.physics.arcade.collide(this.knights[i], this.layer2);
      this.physics.arcade.collide(this.knights[i], this.layer3);
      this.physics.arcade.collide(this.knights[i], this.layer4);
    }

//Comprueba la colisión del jugador con los enemigos si no es invencible.
    if (this.jugador.invincible === false)
    {
      for (var i in this.skeletons)
      {
        this.physics.arcade.collide(this.jugador, this.skeletons[i], this.collision, null, this);
      }
      for (var i in this.archers)
      {
        this.physics.arcade.collide(this.jugador, this.archers[i], this.collision, null, this);
      }
      for (var i in this.rats)
      {
        this.physics.arcade.collide(this.jugador, this.rats[i], this.collision, null, this);
      }
      for (var i in this.knights)
      {
        this.physics.arcade.collide(this.jugador, this.knights[i], this.collision, null, this);
        this.physics.arcade.collide(this.jugador, this.knights[i].maza, this.collision, null, this);
      }
      this.physics.arcade.collide(this.jugador, this.rock, this.collision, null, this);
    }

    //Comprueba la colisión de los enemigos con las armas del jugador
    for (var i in this.skeletons)
    {
      this.physics.arcade.overlap(this.skeletons[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.collide(this.skeletons[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.skeletons[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.skeletons[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.skeletons[i], this.jugador.shoot, this.collision, null, this);
    }
    for (var i in this.archers)
    {
      this.physics.arcade.collide(this.archers[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.archers[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.archers[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.archers[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.archers[i], this.jugador.shoot, this.collision, null, this);
    }
    for (var i in this.rats)
    {
      this.physics.arcade.collide(this.rats[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.rats[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.rats[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.rats[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.rats[i], this.jugador.shoot, this.collision, null, this);
    }
    for (var i in this.knights)
    {
      this.physics.arcade.collide(this.knights[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.collide(this.knights[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.knights[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.knights[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.knights[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.knights[i], this.jugador.shoot, this.collision, null, this);
    }

    //Actualización de elementos únicos del mapa
    this.chest.update(this.jugador.x, this.jugador.y);
    this.enepece.update(this.jugador.x, this.jugador.y);
    this.bonfire.update(this.jugador.x, this.jugador.y);
    this.bonfire2.update(this.jugador.x, this.jugador.y);
    this.jugador.update();
    this.jugador.interact(this.chest);
    this.jugador.interact(this.enepece);
    this.jugador.interact(this.bonfire);
    this.jugador.interact(this.bonfire2);
    this.jugador.sword.update();
    this.jugador.fireCone.update();

      //Actualización de los enemigos
    for (var i in this.skeletons)
    {
      this.skeletons[i].update(this.jugador.x, this.jugador.y);
    }
    for (var i in this.archers)
    {
      this.archers[i].update(this.jugador, this.jugador.x, this.jugador.y);
    }
    for (var i in this.rats)
    {
      this.rats[i].update(this.jugador, this.jugador.x, this.jugador.y);
    }
    for (var i in this.knights)
    {
      this.knights[i].update(this.jugador.x, this.jugador.y);
    }
    this.rock.update(this.jugador.x, this.jugador.y);

    //Actualización del HUD de Estus
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
//Función que llama a la función de colision del Character en concreto que la llama
  collision : function (jugador, enemy) {
        jugador.col(enemy);
  }
};
module.exports = PlayScene;