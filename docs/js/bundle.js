(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
function Character(game, speed, x, y, spritename)
  {
    Phaser.Sprite.call(this, game, x, y, spritename)
    this.anchor.setTo(0.5,0.5);
    this.speed = speed;
    this.direction = 0;
    this.invincible = false;
    this.moving = true;
    this.knockback = false;
  }

  Character.prototype = Object.create(Phaser.Sprite.prototype);
  Character.prototype.constructor = Character;
  Character.prototype.moveY = function(speed)
    {
      this.body.velocity.y = speed;
      this.body.velocity.x = 0;
    }
  Character.prototype.moveX = function(speed)
    {
      this.body.velocity.x = speed;
      this.body.velocity.y = 0;
    }
  Character.prototype.knock = function(enemy){
    this.salud -= 10;
    switch(enemy.direction)
    {
      case 0:
        this.body.velocity.y = 500;
        this.body.velocity.x = 0;
        break;
      case 1:
        this.body.velocity.y = 0;
        this.body.velocity.x = -500;
        break;
      case 2:
        this.body.velocity.y = -500;
        this.body.velocity.x = 0;
        break;
      case 3:
        this.body.velocity.y = 0;
        this.body.velocity.x = 500;
        break;
    }
  this.moving = false;
  this.invincible = true;
  this.knockback = true;
  this.alpha = 0.5;
  this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function() { this.invincible = false; this.alpha = 1;this.moving = true;this.knockback = false;}, this);
    }
    module.exports = Character;
},{}],2:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');

function Enemy(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.salud = 100;
    this.reviving = false;
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('idle', [0],1,true);
    this.animations.add('runleft', [2,3],2,true);
    this.animations.add('runright', [6,7],2,true);
    this.animations.add('rundown', [0,1],2,true);
    this.animations.add('runup', [4,5],2,true);
    this.animations.add('dead',[8],1,true);
}
Enemy.prototype.MoveTo = function(x, y){

    var angle = Math.atan2(y - this.y, x - this.x);

   this.body.velocity.x = Math.cos(angle) * this.speed;
   this.body.velocity.y = Math.sin(angle) * this.speed;

    return angle;

}
Enemy.prototype.distanceToXY = function (x, y) {

    var dx =  this.x - x;
    var dy =  this.y - y;

    return Math.sqrt(dx * dx + dy * dy);
}
Enemy.prototype.detectAnimation = function(x,y){
    var cx = this.x -x;
    var cy = this.y -y;
    if (cx > 0 && Math.abs(cx) >= Math.abs(cy))
    {
        this.animations.play('runleft');
        this.direction = 1;
    }
    else if (cx < 0 && Math.abs(cx) >= Math.abs(cy))
    {
        this.animations.play('runright');
        this.direction = 3;
    }
    else if (cy > 0)
    {
        this.animations.play('runup');
        this.direction = 2;
    }
    else{
        this.animations.play('rundown');
        this.direction = 0;
    }
}
Enemy.prototype.update = function(playerx, playery)
{
    if (this.salud > 0)
    {
        this.reviving = false;
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 200 && this.moving)
        {
        this.MoveTo(playerx, playery);
        this.detectAnimation(playerx, playery);
        }
        else if (dist >= 200)
        {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.play('idle');
        }
    }
    else if (!this.reviving)
    {
        this.body.enable = false;
        this.play('dead');
        this.reviving = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {this.body.enable = true;this.salud = 100;}, this);
    }
}
Enemy.prototype.col = function(sword)
{
    if (sword.attacking)
    {
        this.knock(sword);
        this.salud-=25;
    }
}
module.exports = Enemy;

},{"./Character.js":1}],3:[function(require,module,exports){
var HealthBar = function(game, providedConfig) {
    this.game = game;
    this.group = null;

    this.setupConfiguration(providedConfig);
    this.setPosition(this.config.x, this.config.y);
    this.drawBackground();
    this.drawBorder();
    this.drawHealthBar();
    this.setFixedToCamera(this.config.isFixedToCamera);
};
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.setupConfiguration = function (providedConfig) {
    this.config = this.mergeWithDefaultConfiguration(providedConfig);
    this.flipped = this.config.flipped;
};

HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig) {
    var defaultConfig= {
        width: 250,
        height: 20,
        x: 0,
        y: 0,
        bg: {
            color: '#651828'
        },
        bar: {
            color: '#fb3b3b'
        },
        border: {
            color: "#000000",
            width: 1
        },
        animationDuration: 200,
        flipped: false,
        isFixedToCamera: false
    };

    return mergeObjetcs(defaultConfig, newConfig);
};

function mergeObjetcs(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor==Object ? mergeObjetcs(targetObj[p], newObj[p]) : newObj[p];
        } catch(e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

HealthBar.prototype.drawBorder = function() {
    var border = this.config.border.width * 2;

    var bmd = this.game.add.bitmapData(this.config.width + border, this.config.height + border);
    bmd.ctx.fillStyle = this.config.border.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width + border, this.config.height + border);
    bmd.ctx.stroke();
    bmd.update();

    this.borderSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.borderSprite.anchor.set(0.5);
};

HealthBar.prototype.drawBackground = function() {

    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();
    bmd.update();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);

    if(this.flipped){
        this.bgSprite.scale.x = -1;
    }
};

HealthBar.prototype.drawHealthBar = function() {
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();
    bmd.update();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if(this.flipped){
        this.barSprite.scale.x = -1;
    }
};

HealthBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined && this.borderSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;

        this.borderSprite.position.x = x;
        this.borderSprite.position.y = y;
    }
};


HealthBar.prototype.setPercent = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;

    this.setWidth(newWidth);
};

/*
 Hex format, example #ad3aa3
 */
HealthBar.prototype.setBarColor = function(newColor) {
    var bmd = this.barSprite.key;
    bmd.update();

    var currentRGBColor = bmd.getPixelRGB(0, 0);
    var newRGBColor = hexToRgb(newColor);
    bmd.replaceRGB(currentRGBColor.r,
        currentRGBColor.g,
        currentRGBColor.b,
        255 ,

        newRGBColor.r,
        newRGBColor.g,
        newRGBColor.b,
        255);

};

HealthBar.prototype.setWidth = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

HealthBar.prototype.setFixedToCamera = function(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
    this.borderSprite.fixedToCamera = fixedToCamera;
};

HealthBar.prototype.setAnchor = function(xAnchor, yAnchor) {
    this.bgSprite.anchor.set(xAnchor, yAnchor);
    this.barSprite.position.x = this.bgSprite.position.x - this.config.width * this.bgSprite.anchor.x;
    this.borderSprite.anchor.set(xAnchor, yAnchor);
    this.barSprite.anchor.y = yAnchor;
    if (this.flipped){
        this.barSprite.anchor.x = 1;
        this.barSprite.position.x = this.bgSprite.position.x;
    }
};


HealthBar.prototype.setToGroup = function(group) {
    group.add(this.bgSprite);
    group.add(this.barSprite);

    this.group = group;
};

HealthBar.prototype.removeFromGroup = function() {
    this.game.world.add(this.bgSprite);
    this.game.world.add(this.barSprite);

    this.group = null;
};

HealthBar.prototype.kill = function() {
    this.bgSprite.kill();
    this.barSprite.kill();
    this.borderSprite.kill();
};

module.exports = HealthBar;
},{}],4:[function(require,module,exports){
'use strict'

var MainMenu = {

    create:function (game) {

        var titlescreen;
        var music;

        music = game.sound.play('musicmenu');

        
        this.createButton(game, game.world.centerX, game.world.centerY + 150, 300, 100,
        function(){
            this.state.start('play');
        });

        titlescreen = game.add.sprite(game.world.centerX, game.world.centerY, 'menu');
        titlescreen.anchor.setTo(0.5,0.5);
        
    },

    update:function (game) {


    },

    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'button', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;

    }



};
module.exports = MainMenu;
},{}],5:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');

function RockRoll(game, speed, x, y, spritename, dir)
{
    Character.call(this,game,speed,x,y,spritename);
    this.active = false;
    this.direction = dir;   //0 derecha, 1 izquierda, 2 abajo, 3 arriba
    this.game = game;
}

RockRoll.prototype = Object.create(Character.prototype);
RockRoll.prototype.constructor = RockRoll;

RockRoll.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
}

RockRoll.prototype.update = function(playerX, playerY){

    var dist = this.distanceToXY(playerX, playerY);

    if (dist < 200){
        if (this.direction == 0) {
            this.moveX(this.speed);
        } else if (this.direction == 1) {
            this.moveX(-this.speed);
        } else if (this.direction == 2) {
            this.moveY(this.speed);
        } else if (this.direction == 3) {
            this.moveY(-this.speed);
        }
    }
}

RockRoll.prototype.distanceToXY = function (x, y) {

    var dx =  this.x - x;
    var dy =  this.y - y;

    return Math.sqrt(dx * dx + dy * dy);
}

module.exports = RockRoll;
},{"./Character.js":1}],6:[function(require,module,exports){
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
    this.game.load.tilemap('mapa', 'images/ElMapa.json', null, Phaser.Tilemap.TILED_JSON);
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
//a
// LivingThing.prototype.moveX = function () {
//   this._graphic.x += this._speed;
// }
// LivingThing.prototype.moveY = function () {
//   this._graphic.y += this._speed;
// }
},{"./MainMenu.js":4,"./play_scene.js":7}],7:[function(require,module,exports){
'use strict';
var Player = require('./player.js');
var Enemy = require('./Enemy.js');
var RockRoll = require('./RockRoll.js');
var HealthBar = require('./HealthBar.js');
var Sword = require('./sword.js');

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
    //this.vidaconfigEnemy = {x: 50, y: 10};
    //this.enemyhealth = new HealthBar(this.game, this.vidaconfigEnemy);
    this.enemy = new Enemy(this.game, 75, 700,1990,"esqueleto");
    this.sword = new Sword(this.game, -50, 0, 0, 'sword');
    this.sword.create();
    this.jugador = new Player(this.game,300,545,2835,"player",this.cursors, this.sword, "fireball");
    //this.rock = new RockRoll(this.game, 80, 500, 150, "rock", 0, 400);
    this.enemy.create();
    this.jugador.create();
    this.jugador.addChild(this.sword);
    //this.enemy.addChild(this.enemyhealth);
    this.attackButton = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
    //this.rock.create();
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
    this.physics.arcade.collide(this.jugador, this.enemy, this.collision, null, this);
    this.physics.arcade.overlap(this.enemy, this.jugador.sword, this.collision, null, this);
    this.physics.arcade.collide(this.enemy, this.jugador.shoot, this.collision, null, this);
    //this.physics.arcade.overlap(this.jugador, this.rock, this.collision, null, this);
    //this.game.physics.arcade.overlap(this.jugador, this.enemy,this.jugador.playercol,null,this);

    //this.cosa.sprite.rotation += 0.01;
    this.jugador.update();
    this.jugador.sword.update();
    this.enemy.update(this.jugador.x, this.jugador.y);
    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);
    //this.sword.update(this.jugador);
    //this.rock.update(this.jugador.x, this.jugador.y);
  },

  collision : function (jugador, enemy) {
        jugador.col(enemy);
  }
};
module.exports = PlayScene;
},{"./Enemy.js":2,"./HealthBar.js":3,"./RockRoll.js":5,"./player.js":8,"./sword.js":9}],8:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');

function Player(game,speed,x,y,spritename,cursors, sword, spriteweapon)
  {
    Character.call(this,game,speed,x,y,spritename);
    this.cursors = cursors;
    this.spriteshoot = spriteweapon;
    this.salud = 100;
    this.attackButton = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
    this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.rollButton = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
    this.attacking = false;
    this.sword = sword;
    this.invincible = false;
    this.moving = true;
    this.rolling = false;
    this.knockForce = 500;
    this.knockback = false;
    this.stamina = 100;
  }

  Player.prototype = Object.create(Character.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.create = function()
  {
    this.game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('idle', [17],1,true);
    this.animations.add('runleft', [0,1,2,3,4,5,6,7],8,true);
    this.animations.add('runright', [8,9,10,11,12,13,14,15],8,true);
    this.animations.add('rundown', [16,17,18,19,20,21,22,23],8,true);
    this.animations.add('runup', [24,25,26,27,28,29,30,31],8,true);
    this.animations.add('attackdown', [32,33,34,35,36,37],6,false);
    this.animations.add('attackup', [40,41,42,43,44],5,false);
    this.animations.add('attackright', [48,49,50,51,52],5,false);
    this.animations.add('attackleft', [56,57,58,59,60],5,false);
    this.animations.add('rollleft', [66,67,68],3,true);
    this.animations.add('rollright', [64,65,68],3,true);
    this.body.setSize(30, 35, 6, 10);
    this.anchor.setTo(0.5, 0.5);

    this.shoot = this.game.add.weapon(1, this.spriteshoot);
    this.shoot.bulletSpeed = 300;
    this.shoot.fireRate = 1000;
    this.shoot.bulletLifespan = 2000;
    this.shoot.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.shoot.trackSprite(this, 0, 0, false);
  }

  Player.prototype.moveY = function(speed)
    {
      this.body.velocity.y = speed;
      this.body.velocity.x = 0;
    }
  Player.prototype.moveX = function(speed)
    {
      this.body.velocity.x = speed;
      this.body.velocity.y = 0;
    }
  Player.prototype.roll = function()
  {
    if (this.stamina >= 35)
    {
      if (this.body.velocity.x != 0 || this.body.velocity.y != 0)
      {
        this.stamina = this.stamina - 50;
        switch(this.direction)
        {
          case 0:
            this.body.velocity.y = 500;
            this.body.velocity.x = 0;
            break;
          case 1:
            this.body.velocity.y = 0;
            this.body.velocity.x = -500;
            break;
          case 2:
            this.body.velocity.y = -500;
            this.body.velocity.x = 0;
            break;
          case 3:
            this.body.velocity.y = 0;
            this.body.velocity.x = 500;
            break;
        }
        switch(this.direction)
        {
          case 1:
          this.animations.play('rollleft',10);
          break;
          case 3:
          this.animations.play('rollright',10);
          break;
        }
        this.alpha = 0.5;
        this.invincible = true;
        this.rolling = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.2, Player.prototype.stopRoll , this);
      }
    }
  }
  Player.prototype.stopRoll = function()
  {
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    this.alpha = 1;
    this.invincible = false;
    this.rolling = false;
  }
  Player.prototype.attack = function(){
    //We use a boolean var to check if the player is currently attacking to prevent a new attack mid animation.
    //(May not be necessary in your game.)
    if (this.stamina >= 35)
    {
      if (!this.attacking){
          this.stamina = this.stamina - 50;
          this.attacking = true;
          this.moving = false;
          this.sword.attacking = true;
          this.sword.startAttack(this.direction);
          switch(this.direction)
          {
            case 0:
            this.animations.play('attackdown',15);
            break;
            case 1:
            this.animations.play('attackleft',15);
            break;
            case 2:
            this.animations.play('attackup',15);
            break;
            case 3:
            this.animations.play('attackright',15);
            break;
          }
          this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function(){
            this.attacking = false;//Returns the boolean var to "false"
            this.sword.attacking = false;
        }, this);
          //Start the Timer object that will wait for 1 second and then will triger the inner function.
          this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
              this.animations.play('idle');//Returns the animation to "idle"
              this.moving = true;
          }, this);
      }
    }
}
Player.prototype.col = function(enemy)
{
  this.salud -= 10;
  this.knock(enemy);
}
  Player.prototype.update = function()
  {
  if (this.moving && !this.rolling)
  {
    if (this.stamina < 100)
    {
      this.stamina = this.stamina + 0.2;
    }
    if (this.attackButton.isDown)
        this.attack();
    else if (this.rollButton.isDown)
      {
        this.roll();
      }
    else if (this.cursors.left.isDown)
    {
      this.direction = 1;
      this.moveX(-this.speed);
      this.animations.play('runleft');
    }
    else if (this.cursors.right.isDown)
    {
      this.direction = 3;
      this.moveX(this.speed);
      this.animations.play('runright');
    }
    else if (this.cursors.up.isDown)
    {
      this.direction = 2;
      this.moveY(-this.speed);
      this.animations.play('runup');
    }
    else if (this.cursors.down.isDown)
    {
      this.direction = 0;
      this.moveY(this.speed);
      this.animations.play('rundown');
    }
    else if (this.fireButton.isDown){
      switch (this.direction)
      {
        case 0:
          this.shoot.fireAtXY(this.x, this.y + 100);
          break;
        case 1: 
          this.shoot.fireAtXY(this.x - 100, this.y);
          break;
        case 2: 
          this.shoot.fireAtXY(this.x, this.y - 100);
          break;
        case 3: 
          this.shoot.fireAtXY(this.x + 100, this.y);
          break;
      }
    }
    else{
      this.body.velocity.x= 0;
      this.body.velocity.y= 0;
      this.animations.play('idle');
    }
  }
  else if (this.attacking && !this.knockback && !this.rolling)
  {
    this.body.velocity.x= 0;
    this.body.velocity.y= 0;
  }

    if (this.salud <= 0){
      this.game.state.start(this.game.state.current);
    }
  }
  module.exports = Player;
},{"./Character.js":1}],9:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');

function Sword(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.rot = 100;
    this.attacking = false;
}
Sword.prototype = Object.create(Character.prototype);
Sword.prototype.constructor = Sword;

Sword.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('slashdown', [0,1,2,3,4,5,6,7],8,false);
    this.animations.add('slashup', [8,9,10,11,12,13,14,15],8,false);
    this.animations.add('slashright', [16,17,18,19,20,21,22,23],8,false);
    this.animations.add('slashleft', [24,25,26,27,28,29,30,31],8,false);
    this.slashAnim = this.animations.add('slash', [0,1,2,3,4,5,6],7,false);
    this. anchor.setTo(0.5,0.5);
}

Sword.prototype.startAttack = function(dir)
{
    this.direction = dir;
    switch(dir){
        case 0:
            this.animations.play('slashdown',15);
            this.y = 0;
            this.x = 0;
            break;
        case 1:
            this.animations.play('slashleft',15);
            this.x = -10;
            this.y = 0;
            break;
        case 2:
            this.animations.play('slashup',15);
            this.y = -17;
            this.x = -6;
            break;
        case 3:
            this.animations.play('slashright',15);
            this.y = 0;
            this.x = 10;
            break;
    }
}

Sword.prototype.stopAttack = function(player)
{
    this.rotation = 0;
    player.attacking = false;
}

Sword.prototype.update = function(player)
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}
module.exports = Sword;
},{"./Character.js":1}]},{},[6]);
