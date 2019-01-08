(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

var Interactuable = require('./Interactuable.js');

function Bonfire(game, x, y, spritename) {
    Interactuable.call(this, game, x, y, spritename)
    
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    
    this.animations.add('bonfire',[0,1,2,3],4,true);
}

Bonfire.prototype = Object.create(Interactuable.prototype);
Bonfire.prototype.constructor = Bonfire;

Bonfire.prototype.col = function(player) {
    if(this.game.mejoraEstus){
        player.estus = 5;
    } else player.estus = 4;
    player.salud = 100;
    player.stamina = 100;
}


module.exports = Bonfire;
},{"./Interactuable.js":10}],2:[function(require,module,exports){
'use strict';
var Enemy = require('./Enemy.js');
var HealthBar = require('./HealthBar.js');

function Boss (game, speed, x, y, spritename,audio,audioAttack,salud,dmg,bolahielo,rayo,bolafuego,aura)
{
    Enemy.call(this,game,speed,x,y,spritename,audio,audioAttack,salud,dmg);
    this.hielosprite = bolahielo;
    this.rayosprite = rayo;
    this.bolafuegosprite = bolafuego;
    this.lanzafuego = false;
    this.lanzahielo = false;
    this.lanzarayo = false;
    this.cooldown = true;
    this.aura = aura;
}

Boss.prototype = Object.create(Enemy.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.create = function()
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
    this.animations.add('hielo', [9],1,true);
    this.animations.add('rayo', [10],1,true);
    this.animations.add('fuego', [11],1,true);

    this.anchor.setTo(0.5, 0.5);

    this.bolahielo = this.game.add.weapon(5, this.hielosprite);
    this.bolahielo.bulletSpeed = 700;
    this.bolahielo.fireRate = 300;
    this.bolahielo.bulletLifespan = 700;
    this.bolahielo.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.bolahielo.trackSprite(this, 0, 0, false);

    this.rayo = this.game.add.weapon(5, this.rayosprite);
    this.rayo.bulletSpeed = 950;
    this.rayo.fireRate = 600;
    this.rayo.bulletLifespan = 1400;
    this.rayo.bulletAngleVariance = 10;
    this.rayo.bulletAngleOffset = 90;
    this.rayo.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.rayo.trackSprite(this, 0, 0, false);

    this.aura.create();
    this.addChild(this.aura);
    
    this.attacking = true;
    this.attack = 1;

    this.rayoAudio = this.game.add.audio('rayo');
    this.bolaAudio = this.game.add.audio('bola');
    this.fuegoAudio = this.game.add.audio('escudo');
    this.pasoAudio = this.game.add.audio('pasos');

    this.cooldownInicial();
    this.config = {x: 50, y: 500, width: 600, height: 20};
    this.myHealthBar = new HealthBar(this.game, this.config);
    this.myHealthBar.setPosition(400, 550);
    this.myHealthBar.setFixedToCamera(true);
}

Boss.prototype.cooldownInicial = function()
{
    this.game.time.events.add(Phaser.Timer.SECOND * 3, function() {
        this.cooldown = !this.cooldown;
    }, this);
}
Boss.prototype.cargaFuego = function()
{
    this.animations.play('fuego');
    this.moving = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        this.lanzafuego = true;
        this.aura.alpha = 1;
        this.aura.attacking = true;
        this.moving = true;
        this.aura.body.enable = true;
        this.fuegoAudio.play();
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 9.5, function() {
        this.aura.alpha = 0;
        this.aura.attacking = false;
        this.lanzafuego = false;
        this.attack += 1;
        this.cooldown = true;
        this.aura.body.enable = false;
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 10.5, function() {
        this.cooldown = false;
    }, this);
    
}

Boss.prototype.fireCircle = function()
{
    this.aura.update(this.direction);
}

Boss.prototype.iceThrowing = function()
{
    this.animations.play('hielo');
    this.moving = false;
    this.lanzahielo = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 6.5, function() {
        this.moving = true;
        this.lanzahielo = false;
        this.attack += 1;
        this.cooldown = true;
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 8, function() {
        this.cooldown = false;
    }, this);
}

Boss.prototype.thunderThrowing = function()
{
    this.animations.play('rayo');
    this.moving = false;
    this.lanzarayo = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 6.5, function() {
        this.moving = true;
        this.lanzarayo = false;
        this.attack += 1;
        this.cooldown = true;
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 8, function() {
        this.cooldown = false;
    }, this);
}

Boss.prototype.update = function(player,playerx,playery)
{
    this.myHealthBar.setPercent(this.salud);

    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 600 && this.moving)
        {
            this.detectAnimation(playerx, playery);
            this.MoveTo(playerx, playery);
            this.pasoAudio.play('',0,1,false,false);
            if (!this.lanzafuego && !this.lanzahielo && !this.lanzarayo && !this.cooldown)
            {
            this.attack = this.game.rnd.integerInRange(1, 3)
            switch(this.attack)
                {
                    case 1:
                    this.cargaFuego();
                    break;
                    case 2:
                    this.iceThrowing();
                    break;
                    case 3:
                    this.thunderThrowing();
                    break;
                }
            }
            else if (this.lanzafuego)
            {
                this.dmg = 55;
                this.fireCircle();
            }
        }
        else if (this.lanzahielo)
        {
            this.dmg = 22;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.bolahielo.fireAtXY(playerx, playery);
            this.bolaAudio.play('',0,1,false,false);
        }
        else if (this.lanzarayo)
        {
            this.dmg = 25;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.rayo.fireAtXY(playerx, playery);
            this.rayoAudio.play('',0,1,false,false);
        }
        this.hieloHit(player);
        this.rayoHit(player);
    }
    else
    {
        this.animations.play('dead');
        this.body.enable = false;
        this.aura.body.enable = false;
    }
}

Boss.prototype.hieloHit = function (player) 
{
    var esto = this;
    this.bolahielo.bullets.forEach(function (bullet) {
        if(esto.game.physics.arcade.collide(bullet, player)) {
            bullet.kill();
            if(!player.invincible)
                player.col(esto);
        }
    }
    );
} 
Boss.prototype.col = function(sword)
{
    if (sword.attacking)
    {
        if (sword.dmg -this.resistencia <= 0)
        {
            this.knock(sword,0.2,200);
        }
        else
        {
        this.knock(sword, (sword.dmg-this.resistencia),200);
        }
        this.invincible = true;
        this.alpha = 0.5;
        this.hurt.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {this.invincible = false; this.alpha = 1;}, this);
    }
}
Boss.prototype.rayoHit = function (player) 
{
    var esto = this;
    this.rayo.bullets.forEach(function (bullet) {
        if(esto.game.physics.arcade.collide(bullet, player)) {
            bullet.kill();
            if(!player.invincible)
                player.col(esto);
        }
    }
    );
}
Boss.prototype.knock = function(enemy, dmg, knockpower){
    this.salud -= dmg;
    this.hurt.play();
} 
module.exports = Boss;
},{"./Enemy.js":6,"./HealthBar.js":9}],3:[function(require,module,exports){
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
},{"./Boss.js":2,"./FireCircle.js":7,"./FireCone.js":8,"./HealthBar.js":9,"./player.js":25,"./sword.js":26}],4:[function(require,module,exports){
'use strict';
function Character(game, speed, x, y, spritename,audio)
  {
    Phaser.Sprite.call(this, game, x, y, spritename)
    this.anchor.setTo(0.5,0.5);
    this.speed = speed;
    this.direction = 0;
    this.invincible = false;
    this.moving = true;
    this.knockback = false;
    this.hurt = this.game.add.audio(audio);
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
  Character.prototype.distanceToXY = function (x, y) {

      var dx =  this.x - x;
      var dy =  this.y - y;
  
      return Math.sqrt(dx * dx + dy * dy);
  }
  Character.prototype.knock = function(enemy, dmg, knockpower){
    this.salud -= dmg;
    this.hurt.play();
    switch(enemy.direction)
    {
      case 0:
        this.body.velocity.y = knockpower;
        this.body.velocity.x = 0;
        break;
      case 1:
        this.body.velocity.y = 0;
        this.body.velocity.x = -knockpower;
        break;
      case 2:
        this.body.velocity.y = -knockpower;
        this.body.velocity.x = 0;
        break;
      case 3:
        this.body.velocity.y = 0;
        this.body.velocity.x = knockpower;
        break;
    }
  this.moving = false;
  this.knockback = true;
  this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function() {this.moving = true;this.knockback = false;}, this);
    }
    module.exports = Character;
},{}],5:[function(require,module,exports){
'use strict'
var TextBox = require('./TextBox.js');
var Interactuable = require('./Interactuable.js');

function Chest(game, x, y, spritename, mejora)
  {
    Interactuable.call(this, game, x, y, spritename)
    this.opened = false;
    this.item = mejora;
    this.width = 50;
    this.height = 50;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    
    this.animations.add('closed', [0], 1, true);
    this.animations.add('opened', [1], 1, true);
    
    if(this.item == "estus"){
      this.texto = new TextBox(this.game, "Mejora de estus, ahora tienes\ncinco frascos de estus");
      this.texto.create();
      this.texto.bringToTop();
      this.texto.texto.bringToTop();
    }
    else if(this.item == "armor"){
      this.texto = new TextBox(this.game, "Mejora de armadura, los enemigos\nte quitan menos vida");
      this.texto.create();
      this.texto.bringToTop();
      this.texto.texto.bringToTop();
    }
    else if(this.item == "speed"){
      this.texto = new TextBox(this.game, "Mejora de velocidad, ahora puedes\ncorrer mas rapido");
      this.texto.create();
      this.texto.bringToTop();
      this.texto.texto.bringToTop();
    }
   
  }

Chest.prototype = Object.create(Interactuable.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.col = function(player) {
  if (this.opened == false) {
    this.animations.play('opened');
    this.opened = true;
    switch(this.item){
      case "estus":
       player.estus += 1;
       console.log("mejora de estus");
       this.game.mejoraEstus = true;
       this.texto.show();
       break;
      case "speed":
       player.speed += 100;
       console.log("mejora de velocidad");
       this.game.mejoraSpeed = true;
       this.texto.show();
       break;
      case "armor":
       player.resistencia += 10;
       console.log("mejora de armor");
       this.game.mejoraArmor = true;
       this.texto.show();
       break;
    }
  }
}

Chest.prototype.update = function(playerx, playery) {

  var dist = this.distanceToXY(playerx, playery);

  if (this.opened){
    this.animations.play('opened');
    this.e.alpha = 0;
  }
  else {
    this.animations.play('closed');
    if (dist > 50){
      this.e.alpha = 0;
    }
    if(dist < 50) {
      this.e.alpha = 1;
    }
  }
}

module.exports = Chest;


},{"./Interactuable.js":10,"./TextBox.js":21}],6:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');
var HealthBar = require('./HealthBar.js');

function Enemy(game, speed, x, y, spritename, audio, audioAttack,salud,dmg)
{
    Character.call(this,game,speed,x,y,spritename, audio);
    this.game = game;
    this.salud = 100;
    this.dmg = dmg;
    this.resistencia = salud;
    this.attacking = false;
    this.attackAudio = this.game.add.audio(audioAttack);
    this.config = {x: 0, y: 0, width: 60, height: 7};
    this.myHealthBar = new HealthBar(this.game, this.config);
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
    this.animations.add('chargedown',[9],1,false);
    this.animations.add('chargeleft',[11],1,false);
    this.animations.add('chargeright',[13],1,false);
    this.animations.add('chargeup',[16],1,false);
    this.animations.add('tackledown',[9,10],false);
    this.animations.add('tackleleft',[11,12],false);
    this.animations.add('tackleright',[13,14],false);
    this.animations.add('tackleup',[16,17],false);
    this.anchor.setTo(0.5, 0.5);
    this.reviving = false;
    this.tackling = false;
}
Enemy.prototype.setIdle = function()
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.animations.play('idle');
}
Enemy.prototype.MoveTo = function(x, y){

    var angle = Math.atan2(y - this.y, x - this.x);

   this.body.velocity.x = Math.cos(angle) * this.speed;
   this.body.velocity.y = Math.sin(angle) * this.speed;

    return angle;

}
Enemy.prototype.charge = function()
{
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    this.charging = true;
    switch (this.direction)
    {
        case 0:
            this.animations.play('chargedown');
            break;
        case 1:
            this.animations.play('chargeleft');
            break;
        case 2:
            this.animations.play('chargeup');
            break;
        case 3:
            this.animations.play('chargeright');
            break;
    }
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {Enemy.prototype.tackle()}, this);
}
Enemy.prototype.tackle = function()
{
    this.attackAudio.play();
    switch (this.direction)
    {
        case 0:
            this.animations.play('tackledown',5);
            this.body.velocity.y += 300;
            this.body.velocity.x = 0;
            break;
        case 1:
            this.animations.play('tackleleft',5);
            this.body.velocity.x -= 300;
            this.body.velocity.y = 0;
            break;
        case 2:
            this.animations.play('tackleup',5);
            this.body.velocity.y -= 300;
            this.body.velocity.x = 0;
            break;
        case 3:
            this.animations.play('tackleright',5);
            this.body.velocity.x += 300;
            this.body.velocity.y = 0;
            break;
    }
    this.moving = false;
    this.tackling = true;
    this.attacking = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.4, function() {this.body.velocity.x = 0; this.body.velocity.y = 0;this.attacking = false;}, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 1.1, function() {this.moving = true;}, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 2.3, function() {this.tackling = false;}, this);
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
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);
    if (this.salud > 0)
    {
        this.reviving = false;
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 260 && this.moving)
        {
            if (dist < 130 && !this.tackling)
            {
                this.tackle();
            }
            else
            {
            if (dist > 40)
                {
                this.MoveTo(playerx, playery);
                }
                this.detectAnimation(playerx, playery);
            }
        }
        else if (dist >= 200)
        {
            this.setIdle();
        }
    }
    else if (!this.reviving)
    {
        this.body.enable = false;
        this.play('dead');
        this.reviving = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 50, function() {this.body.enable = true;this.salud = 100;}, this);
    }
}
Enemy.prototype.col = function(sword)
{
    if (sword.attacking)
    {
        this.knock(sword, (sword.dmg-this.resistencia),200);
        this.invincible = true;
        this.alpha = 0.5;
        this.hurt.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {this.invincible = false; this.alpha = 1;}, this);
    }
}
module.exports = Enemy;

},{"./Character.js":4,"./HealthBar.js":9}],7:[function(require,module,exports){
'use strict';
var mazaCaballero = require('./MazaCaballero.js');
function fireCircle(game, speed, x, y, spritename,dmg)
{
    mazaCaballero.call(this,game,speed,x,y,spritename,dmg);
}
fireCircle.prototype = Object.create(mazaCaballero.prototype);
fireCircle.prototype.constructor = fireCircle;

fireCircle.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.alpha = 0;
    this.anchor.setTo(0.5, 0.6);
    this.body.setCircle(57.5,0,5);
}
fireCircle.prototype.update = function(direction)
{
    this.direction = direction;
    this.rotation += 0.2;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.x = 0;
    this.y = 0;
}
module.exports = fireCircle;
},{"./MazaCaballero.js":13}],8:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');
function FireCone(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.attacking = false;
    this.dmg = 4;
}
FireCone.prototype = Object.create(Character.prototype);
FireCone.prototype.constructor = FireCone;

FireCone.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('fire', [0,1,2,3,4,5,6,7,8,9],10,false);
    this. anchor.setTo(0.5,0.5);
    this.body.setSize(0,0);
}

FireCone.prototype.startAttack = function(dir)
{
    this.body.setSize(84,61);
    this.direction = dir;
    this.animations.play('fire',30);
    switch(dir){
        case 0:
            this.y = 50;
            this.x = 0;
            this.rotation = 140;
            break;
        case 1:
            this.x = -60;
            this.y = 0;
            this.rotation = 85;
            break;
        case 2:
            this.y = -65;
            this.x = 0;
            this.rotation = 30;
            break;
        case 3:
            this.y = 0;
            this.x = 60;
            this.rotation = 0;
            break;
    }
}
FireCone.prototype.stopAttack = function(player)
{
    player.attacking = false;
}
FireCone.prototype.update = function()
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}
module.exports = FireCone;
},{"./Character.js":4}],9:[function(require,module,exports){
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

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
},{}],10:[function(require,module,exports){
'use strict';

function Interactuable(game, x, y,spritename) {
    Phaser.Sprite.call(this, game, x, y, spritename)
}

Interactuable.prototype = Object.create(Phaser.Sprite.prototype);
Interactuable.prototype.constructor = Interactuable;

Interactuable.prototype.create = function() {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.body.moves = false;

    var esto = this;
     
    this.e = this.game.add.sprite(esto.x, esto.y - 50, "e");
    this.e.width = 50;
    this.e.height = 50;
    this.e.anchor.setTo(0.5,0.5);
    this.game.add.existing(this.e);
}

Interactuable.prototype.distanceToXY = function (x, y) {

    var dx =  this.x - x;
    var dy =  this.y - y;
  
    return Math.sqrt(dx * dx + dy * dy);
}

Interactuable.prototype.update = function(playerx, playery) {
    var dist = this.distanceToXY(playerx, playery);

    if (dist > 50){
       this.e.alpha = 0;
     }
     if(dist < 50) {
       this.e.alpha = 1;
     }
}

module.exports = Interactuable;
},{}],11:[function(require,module,exports){
'use strict';
var Enemy = require('./Enemy.js');

function Knight (game, speed, x, y, spritename, maza, audio,audioAttack,salud,dmg)
{
    Enemy.call(this,game,speed,x,y,spritename,audio,audioAttack,salud,dmg);
    this.maza = maza;
}
Knight.prototype = Object.create(Enemy.prototype);
Knight.prototype.constructor = Knight;

Knight.prototype.create = function()
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
    this.anchor.setTo(0.5, 0.5);
    this.maza.create();
    this.addChild(this.maza);
}
Knight.prototype.update = function(playerx, playery)
{
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 300 && this.moving)
        {
            this.attackAudio.play('',0,1,false,false);
            this.detectAnimation(playerx, playery);
            if (dist > 40)
                {
                this.MoveTo(playerx, playery);
                }
            this.maza.update(this.direction);
        }
        else if (dist >= 300)
        {
            this.setIdle();
        }
    }
    else{
        this.animations.play('dead');
        this.body.enable = false;
        this.maza.alpha = 0;
        this.maza.body.enable = false;
    }
}

module.exports = Knight;
},{"./Enemy.js":6}],12:[function(require,module,exports){
'use strict'

var MainMenu = {

    create:function () {
        var background;
        background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menu');
        background.anchor.setTo(0.5,0.5);
        this.game.musica = this.game.add.audio('musicmenu');
        this.game.musica.play();
        this.game.musica.volume = 0.1;
        
        this.createButton(this.game, this.game.world.centerX, this.game.world.centerY - 10, 300, 50,
            function(){
                this.game.musica.stop();
                this.state.start('cueva');
        });
        this.createButton(this.game, this.game.world.centerX, this.game.world.centerY + 80, 300, 50,
            function(){
                this.game.musica.stop();
                this.state.start('levels');
        });
        this.createButton(this.game, this.game.world.centerX, this.game.world.centerY + 170, 300, 50,
            function(){
                this.game.musica.stop();
                this.state.start('controles');
        });
        this.camera.follow(background);
        
    },

    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'vacio', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;
    }

};
module.exports = MainMenu;
},{}],13:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');
function mazaCaballero(game, speed, x, y, spritename,dmg)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.attacking = true;
    this.dmg = dmg;
}
mazaCaballero.prototype = Object.create(Character.prototype);
mazaCaballero.prototype.constructor = mazaCaballero;

mazaCaballero.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.anchor.setTo(0.5,0.5);
    this.body.setCircle(45, 7, -20);
}
mazaCaballero.prototype.update = function(direction)
{
    this.direction = direction;
    switch(direction)
    {
        case 0:
        this.position.x = -20;
        break;
        case 1:
        this.position.x = 10;
        break;
        case 2:
        this.position.x = 20;
        break;
        case 3:
        this.position.x = 0;
        break;
    }
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.x = 0;
    this.y = 0;
    this.rotation += 0.2;
}
module.exports = mazaCaballero;
},{"./Character.js":4}],14:[function(require,module,exports){
'use strict'

var MenuControles = {

    create:function (game) {

        var background;
        background = game.add.sprite(game.world.centerX, game.world.centerY, 'menucontroles');
        background.anchor.setTo(0.5,0.5);
        game.musica = game.add.sound('musicmenu');
        this.createButton(game, 120, game.world.centerY + 240, 150, 50,
            function(){
                this.state.start('mainmenu');
        });
        
        this.camera.follow(background);
        
    },
    
    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'vacio', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;

    }



};
module.exports = MenuControles;
},{}],15:[function(require,module,exports){
'use strict'

var MenuLevels = {

    create:function (game) {

        var background;
        background = game.add.sprite(game.world.centerX, game.world.centerY, 'menulevels');
        background.anchor.setTo(0.5,0.5);
        this.createButton(game, game.world.centerX - 250, game.world.centerY - 100, 200, 200,
            function(){
                game.musica.stop();
                this.state.start('cueva');
        });
        this.createButton(game, game.world.centerX, game.world.centerY - 100, 200, 200,
            function(){
                game.musica.stop();
                this.state.start('bosque');    
        });
        this.createButton(game, game.world.centerX + 250, game.world.centerY - 100, 200, 200,
            function(){
                game.musica.stop();
                this.state.start('play');
        });
        this.createButton(game, 120, game.world.centerY + 240, 150, 50,
            function(){
                this.state.start('mainmenu');
        });
        
        this.camera.follow(background);
        
    },

    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'vacio', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;

    }

};
module.exports = MenuLevels;
},{}],16:[function(require,module,exports){
'use strict';
var Interactuable = require('./Interactuable.js');
var TextBox = require('./TextBox.js');

function NPC(game,x,y,spritename, dialogue)
{
    Interactuable.call(this, game, x, y, spritename)
    this.text = dialogue;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    
    this.texto = new TextBox(this.game, this.text);
    this.texto.create();
}

NPC.prototype = Object.create(Interactuable.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.col = function() {
    this.texto.show();
    this.texto.bringToTop();
    this.texto.texto.bringToTop();
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {this.text = "Ja ja ja ja";}, this);
    this.texto = new TextBox(this.game, this.text);
    this.texto.create();
}

module.exports = NPC;

},{"./Interactuable.js":10,"./TextBox.js":21}],17:[function(require,module,exports){
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
    this.music = this.game.add.audio('woods');
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('bosque');
    this.map.addTilesetImage('Exterior', 'tilesetBosque');
    //this.map.setCollisionBetween(0,23);
    this.layer = this.map.createLayer('grounds');
    this.layer2 = this.map.createLayer('walls');
    this.layer3 = this.map.createLayer('windows');
    this.layer4 = this.map.createLayer('objects');
    this.layer.renderSettings.enableScrollDelta = true;
    this.layer2.renderSettings.enableScrollDelta = true;
    this.layer3.renderSettings.enableScrollDelta = true;
    this.layer4.renderSettings.enableScrollDelta = true;
    // this.enemieslayer = this.map.createLayer('enemies');
    this.map.setCollisionBetween(1, 10000, true, 'walls');
    this.map.setCollisionBetween(1, 10000, true, 'windows');
    //this.map.setCollisionBetween(1, 10000, true, 'objects');
    this.layer.resizeWorld();
    this.layer2.resizeWorld();
    this.layer3.resizeWorld();
    this.layer4.resizeWorld();
    //this.layer2.debug = true;
    this.distance = 40;
    
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.skeletons = [];
    this.archers = [];
    this.rats = [];
    this.knights = [];
    for (var ol in this.map.objects)
    {
      for (var o in this.map.objects[ol])
      {
        if (this.map.objects[ol][o].gid == 7100)
        {
        var enemy = new Enemy(this.game, 75,this.map.objects[ol][o].x,this.map.objects[ol][o].y,"esqueleto","skeletonAudio","tackle",0.7,30);
        this.enemies.add(enemy);
        this.skeletons[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 7099)
        {
          var enemy = new RangedEnemy(this.game, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 0, "archer", "arrow","armor","archer",0,25);
          this.archers[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 5280)
        {
          var enemy = new Rats(this.game, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 90, "rat", "poison","rat","ratAttack",0.5,25);
          this.rats[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 7107)
        {
          var maza = new mazaCaballero(this.game, 0, 0, 0, 'maza',35);
          var enemy = new Knight(this.game, 30, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 'knight', maza,"armor","swing",2,35);
          this.knights[o] = enemy;
        }
      }
    }
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
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.sword = new Sword(this.game, -50, 0, 0, 'sword');
    this.sword.create();
    this.fireCone = new FireCone(this.game, -50, 0, 0, 'firecone');
    this.fireCone.create();
    this.enepece = new NPC(this.game, 855, 209, "thanos", "Yo exterminaria a los esqueletos,\npero solo a la mitad");
    this.enepece.create();
    this.bonfire = new Bonfire (this.game, 910, 1346, "bonfire");
    this.bonfire.create();
    this.chest = new Chest(this.game, 410, 1157, "chest", "estus");
    this.chest.create();
    if (this.game.mejoraSpeed) {
      this.jugador = new Player(this.game,300,869,2174,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    } else this.jugador = new Player(this.game,200,869,2174,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    this.rock = new RockRoll(this.game, 80, 1768, 228, "stone", 2, 400);
    this.jugador.create();
    this.attackButton = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
    this.rock.create();
    this.estus = this.game.add.sprite(100, 100, 'estus');
    this.estus.scale.setTo(0.3,0.3);
    this.cross = this.game.add.sprite(140,120,'cross');
    this.cross.scale.setTo(0.05,0.05);
    //this.sans = this.game.add.sprite(1508,2226,'sans');
    //this.sans.scale.setTo(0.2,0.2);
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
    this.music.play('',0,0.2,false,false);
    if (this.jugador.x > 1360 && this.jugador.x < 1400 && this.jugador.y < 350){
         this.music.pause();
        this.game.state.start('play');
    }

    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);
    this.physics.arcade.collide(this.jugador,this.layer);
    this.physics.arcade.collide(this.jugador,this.layer2);
    this.physics.arcade.collide(this.jugador,this.layer3);
    this.physics.arcade.collide(this.jugador,this.layer4);
    this.physics.arcade.collide(this.jugador,this.chest);
    this.physics.arcade.collide(this.jugador,this.bonfire);
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
    this.chest.update(this.jugador.x, this.jugador.y);
    this.bonfire.update(this.jugador.x, this.jugador.y);
    this.enepece.update(this.jugador.x, this.jugador.y);
    this.jugador.update();
    this.jugador.interact(this.chest);
    this.jugador.interact(this.enepece);
    this.jugador.interact(this.bonfire);
    this.jugador.sword.update();
    this.jugador.fireCone.update();
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
    this.game.debug.body(this.knight);
    this.game.debug.body(this.knight.maza);
    for (var i in this.rats)
    {
      this.game.debug.body(this.rats[i]);
    }
    for (var i in this.skeletons)
    {
      this.game.debug.body(this.skeletons[i]);
    }*/

}
};
module.exports = PlayScene;
},{"./Bonfire.js":1,"./Chest.js":5,"./Enemy.js":6,"./FireCone.js":8,"./HealthBar.js":9,"./Knight.js":11,"./MazaCaballero.js":13,"./NPC.js":16,"./RangedEnemy.js":18,"./Rats.js":19,"./RockRoll.js":20,"./player.js":25,"./sword.js":26}],18:[function(require,module,exports){
'use strict'
var Enemy = require('./Enemy.js');

function RangedEnemy(game, x, y,speed, spritename, spriteweapon, audio, audioAttack,salud,dmg) 
{
    Enemy.call(this, game, speed, x, y, spritename, audio, audioAttack,salud,dmg);
    this.spriteshoot = spriteweapon;
    this.attacking = true;
}
RangedEnemy.prototype = Object.create(Enemy.prototype);
RangedEnemy.prototype.constructor = RangedEnemy;

RangedEnemy.prototype.create = function ()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;

    this.animations.add('idle', [0],1,true);
    this.animations.add('runleft', [2,3],1,true);
    this.animations.add('runright', [6,7],1,true);
    this.animations.add('rundown', [0,1],1,true);
    this.animations.add('runup', [4,5],1,true);
    this.animations.add('dead',[8],1,true);

    this.shoot = this.game.add.weapon(1, this.spriteshoot);
    this.shoot.bulletSpeed = 300;
    this.shoot.fireRate = 3500;
    this.shoot.bulletLifespan = 800;
    this.shoot.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.shoot.trackSprite(this, 0, 0, false);

}

RangedEnemy.prototype.update = function(player, playerx, playery)
{
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 270 && this.moving)
        {
            this.MoveTo(playerx, playery);
            this.shoot.fireAtXY(player.x, player.y);
            this.detectAnimation(player.x, player.y);
        }
        else if (dist >= 500)
        {
            this.setIdle();
        }
        this.bulletHit(player);
    }
    else{
        this.animations.play('dead');
        this.body.enable = false;
    }
}

RangedEnemy.prototype.bulletHit = function (player) 
{
    var esto = this;
    this.shoot.bullets.forEach(function (bullet) {
        if(esto.game.physics.arcade.collide(bullet, player)) {
            bullet.kill();
            if(!player.invincible)
                player.col(esto);
        }
    }
    );
}   
module.exports = RangedEnemy;

},{"./Enemy.js":6}],19:[function(require,module,exports){
'use strict'
var RangedEnemy = require('./RangedEnemy.js');

function Rats (game, x, y,speed, spritename, spriteweapon, audio, audioAttack,salud,dmg)
{
    RangedEnemy.call(this, game, x, y, speed, spritename, spriteweapon, audio, audioAttack,salud,dmg);
    this.spitting = false;
}
Rats.prototype = Object.create(RangedEnemy.prototype);
Rats.prototype.constructor = Rats;

Rats.prototype.create = function ()
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
    this.animations.add('spitleft',[9],1,true);
    this.animations.add('spitdown',[10],1,true);
    this.animations.add('spitright',[11],1,true);
    this.animations.add('spitup',[12],1,true);

    this.shoot = this.game.add.weapon(1, this.spriteshoot);
    this.shoot.bulletSpeed = 130;
    this.shoot.fireRate = 1000;
    this.shoot.bulletLifespan = 700;
    this.shoot.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.shoot.trackSprite(this, 0, 0, false);
}
Rats.prototype.attack = function(player)
{
    this.spitting = true;
    this.moving = false;
    this.shoot.fireAtXY(player.x, player.y);
    this.attackAudio.play();
    switch (this.direction)
    {
        case 0:
            this.animations.play('spitdown');
            break;
        case 1:
            this.animations.play('spitleft');
            break;
        case 2:
            this.animations.play('spitup');
            break;
        case 3:
            this.animations.play('spitright');
            break;
    }
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {this.moving = true;}, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 3.5, function() {this.spitting = false;}, this);
}
Rats.prototype.update = function(player, playerx, playery)
{
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 230 && this.moving)
        {
            this.detectAnimation(playerx, playery);
            if (dist > 40)
                {
                this.MoveTo(playerx, playery);
                }
            if (!this.spitting && dist < 90)
                this.attack(player);
        }
        else if (dist >= 500)
        {
            this.setIdle();
        }
        this.bulletHit(player);
    }
    else{
        this.animations.play('dead');
        this.body.enable = false;
    }
}
module.exports = Rats;
},{"./RangedEnemy.js":18}],20:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');

function RockRoll(game, speed, x, y, spritename, dir, dmg)
{
    Character.call(this, game, speed,x,y,spritename);
    this.dmg = dmg;
    this.active = false;
    this.direction = dir;   //0 derecha, 1 izquierda, 2 abajo, 3 arriba
    this.game = game;
    this.attacking = false;
}

RockRoll.prototype = Object.create(Character.prototype);
RockRoll.prototype.constructor = RockRoll;

RockRoll.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('rollForward',[0,1,2,3],true);
}

RockRoll.prototype.update = function(playerX, playerY){

    var dist = this.distanceToXY(playerX, playerY);

    if (dist < 200){
        this.attacking = true;
        if (this.direction == 0) {
            this.moveX(this.speed);
            this.active = true;
        } else if (this.direction == 1) {
            this.moveX(-this.speed);
            this.active = true;
        } else if (this.direction == 2) {
            this.moveY(this.speed);
            this.active = true;
        } else if (this.direction == 3) {
            this.moveY(-this.speed);
            this.active = true;
        }
    }

    if(this.active)
    {
        this.animations.play('rollForward',10);  
    } 
}

RockRoll.prototype.distanceToXY = function (x, y) {

    var dx =  this.x - x;
    var dy =  this.y - y;

    return Math.sqrt(dx * dx + dy * dy);
}

module.exports = RockRoll;
},{"./Character.js":4}],21:[function(require,module,exports){
'use strict'
function TextBox(game, text) 
{
    Phaser.Sprite.call(this, game, 0, 0, 'textbox');
    this.txt = text;
    this.width = this.game.camera.width;
    this.height = this.game.camera.height/3;
}

TextBox.prototype = Object.create(Phaser.Sprite.prototype);
TextBox.prototype.constructor = TextBox;

TextBox.prototype.create = function() 
{
    var esto = this;
    this.game.add.existing(this);
    var style = { font: "32px Arial", wordWrap: true, wordWrapWidth: esto.width, align: "left"};

    this.texto = this.game.add.text(0, 0, esto.txt, style);
    this.alpha = 0;
    this.texto.alpha = 0;
}

TextBox.prototype.show = function() {
    this.alpha = 1;
    this.texto.alpha = 1;
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {this.alpha = 0; this.texto.alpha = 0;}, this);
}

TextBox.prototype.update = function() {
    this.x = this.game.camera.x;
    this.y = this.game.camera.y + (this.game.camera.height/3)*2;
    this.texto.x = this.x+100;
    this.texto.y = this.y+50;
}

module.exports = TextBox;

},{}],22:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var NivelBosque = require('./NivelBosque.js');
var play_sceneCueva = require('./play_sceneCueva.js');
var MainMenu = require('./MainMenu.js');
var BossScene = require('./BossScene.js');
var MenuLevels = require('./MenuLevels.js');
var MenuControles = require('./MenuControles.js');


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
    this.game.load.image('vacio', 'images/vacio.png');
    this.game.load.image('titlesouls', 'images/TextoOldSouls.png');
    this.game.load.spritesheet('esqueleto', 'images/skeletons2.png',32, 50, 24);
    this.game.load.spritesheet('archer', 'images/Arquero.png',44,52,16);
    this.game.load.spritesheet('player', 'images/SoldadoSouls2.png', 38, 48, 80);
    this.game.load.spritesheet('sword', 'images/ProbandoEspada.png', 51, 57, 32);
    this.game.load.tilemap('primero', 'maps/MapaConEnemigos.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('bosque', 'maps/Bosque.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('cueva', 'maps/Cueva.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('boss', 'maps/Boss.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tilesetCastillo', 'images/tilesCastillo.png');
    this.game.load.image('tilesetBosque', 'images/tilesBosque.png');
    this.game.load.image('tilesetCueva', 'images/tilesetCueva.png');
    this.game.load.image('tileset', 'images/tileset.png');
    this.game.load.image('menu', 'images/Menu.png');
    this.game.load.image('menulevels', 'images/MenuLevels.png');
    this.game.load.image('menucontroles', 'images/MenuControles.png');
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
    this.game.load.image('e', 'images/e.png');
    this.game.load.spritesheet('bonfire', 'images/Hoguera.png',36,40,4);
    this.game.load.image('jose', 'images/Joselillo.png');
    this.game.load.image('solaire', 'images/Solaire.png');
    this.game.load.image('thanos', 'images/Thanos.png');
    this.game.load.image('youdied', 'images/youdied.png');
    this.game.load.spritesheet('boss', 'images/Boss.png',66,78,16);
    this.game.load.image('hielo', 'images/bolahielo.png');
    this.game.load.image('fuego', 'images/bola.png');
    this.game.load.image('rayo', 'images/rayo.png');
    this.game.load.image('victory', 'images/victory.png');

    //musica
    this.game.load.audio('musicmenu', 'music/mainmenu.mp3');
    this.game.load.audio('hurt', 'music/hurt.mp3');
    this.game.load.audio('skeletonAudio', 'music/skeleton.wav');
    this.game.load.audio('heal', 'music/heal.wav');
    this.game.load.audio('tackle', 'music/tackle.wav');
    this.game.load.audio('sword', 'music/sword.mp3');
    this.game.load.audio('rat', 'music/rat.wav');
    this.game.load.audio('ratAttack', 'music/ratAttack.wav');
    this.game.load.audio('archer', 'music/archer.mp3');
    this.game.load.audio('armor', 'music/armor.mp3');
    this.game.load.audio('swing', 'music/swing.wav');
    this.game.load.audio('cave', 'music/cave.mp3');
    this.game.load.audio('woods', 'music/woods.mp3');
    this.game.load.audio('castle', 'music/PraiseJoselillo.mp3');
    this.game.load.audio('fire', 'music/fire.mp3');
    this.game.load.audio('step', 'music/step.ogg');
    this.game.load.audio('die', 'music/You Died.mp3');
    this.game.load.audio('escudo', 'music/escudo.wav');
    this.game.load.audio('pasos', 'music/pasoboss.wav');
    this.game.load.audio('rayo', 'music/alien.wav');
    this.game.load.audio('bola', 'music/bolahielo.wav');
    this.game.load.audio('boss', 'music/boss.mp3');
    this.game.load.audio('victory', 'music/victory.mp3');

  },

  create: function () {
    this.game.state.start('mainmenu');

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
  game.state.add('bosque', NivelBosque);
  game.state.add('cueva', play_sceneCueva);
  game.state.add('boss', BossScene);
  game.state.add('mainmenu', MainMenu);
  game.state.add('levels', MenuLevels);
  game.state.add('controles', MenuControles);

  game.musicaplaying = true;

  game.state.start('boot');
};

},{"./BossScene.js":3,"./MainMenu.js":12,"./MenuControles.js":14,"./MenuLevels.js":15,"./NivelBosque.js":17,"./play_scene.js":23,"./play_sceneCueva.js":24}],23:[function(require,module,exports){
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
    this.music = this.game.add.audio('castle');
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('primero');
    this.map.addTilesetImage('tilesInterior', 'tilesetCastillo');
    //this.map.setCollisionBetween(0,23);
    this.layer = this.map.createLayer('grounds');
    this.layer2 = this.map.createLayer('walls');
    this.layer3 = this.map.createLayer('windows');
    this.layer4 = this.map.createLayer('objects');
    this.layer.renderSettings.enableScrollDelta = true;
    this.layer2.renderSettings.enableScrollDelta = true;
    this.layer3.renderSettings.enableScrollDelta = true;
    this.layer4.renderSettings.enableScrollDelta = true;
    // this.enemieslayer = this.map.createLayer('enemies');
    this.map.setCollisionBetween(1, 10000, true, 'walls');
    this.map.setCollisionBetween(1, 10000, true, 'windows');
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
        this.enemies.add(enemy);
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
    if (this.game.mejoraSpeed) {
      this.jugador = new Player(this.game,300,1312.24, 3072,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    } else this.jugador = new Player(this.game,200,1312.24, 3072,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    this.bonfire2 = new Bonfire (this.game, 1250, 3072, "bonfire");
    this.bonfire2.create();
    this.rock = new RockRoll(this.game, 200, 1768, 228, "stone", 2, 400);
    this.jugador.create();
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
    if (this.jugador.x > 1729 && this.jugador.x < 1814 && this.jugador.y < 119){
      this.music.pause();
      this.game.state.start('boss');
 }
    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);
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
    this.game.debug.body(this.bonfire);
    this.game.debug.body(this.jugador.sword);
    this.game.debug.body(this.jugador.fireCone);
    for (var i in this.rats)
    {
      this.game.debug.body(this.rats[i]);
    }
    for (var i in this.skeletons)
    {
      this.game.debug.body(this.skeletons[i]);
    }*/

}
};
module.exports = PlayScene;
},{"./Bonfire.js":1,"./Chest.js":5,"./Enemy.js":6,"./FireCone.js":8,"./HealthBar.js":9,"./Knight.js":11,"./MazaCaballero.js":13,"./NPC.js":16,"./RangedEnemy.js":18,"./Rats.js":19,"./RockRoll.js":20,"./player.js":25,"./sword.js":26}],24:[function(require,module,exports){
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
var Boss = require('./Boss.js');

var PlayScene = {

  create: function () {
    this.music = this.game.add.audio('cave');
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('cueva');
    this.map.addTilesetImage('Cueva', 'tilesetCueva');
    //this.map.setCollisionBetween(0,23);
    this.layer = this.map.createLayer('grounds');
    this.layer2 = this.map.createLayer('walls');
    this.layer3 = this.map.createLayer('windows');
    this.layer4 = this.map.createLayer('objects');
    this.layer.renderSettings.enableScrollDelta = true;
    this.layer2.renderSettings.enableScrollDelta = true;
    this.layer3.renderSettings.enableScrollDelta = true;
    this.layer4.renderSettings.enableScrollDelta = true;
    // this.enemieslayer = this.map.createLayer('enemies');
    this.map.setCollisionBetween(1, 10000, true, 'walls');
    //this.map.setCollisionBetween(1, 10000, true, 'windows');
    this.map.setCollisionBetween(1, 10000, true, 'objects');
    this.layer.resizeWorld();
    this.layer2.resizeWorld();
    this.layer3.resizeWorld();
    this.layer4.resizeWorld();
    //this.layer2.debug = true;
    this.distance = 40;
    
    this.skeletons = [];
    this.archers = [];
    this.rats = [];
    this.knights = [];
    for (var ol in this.map.objects)
    {
      for (var o in this.map.objects[ol])
      {
        if (this.map.objects[ol][o].gid == 361)
        {
        var enemy = new Enemy(this.game, 75,this.map.objects[ol][o].x,this.map.objects[ol][o].y,"esqueleto","skeletonAudio","tackle",0.6,30);
        this.skeletons[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 377)
        {
          var enemy = new RangedEnemy(this.game, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 0, "archer", "arrow","armor","archer",0.5,25);
          this.archers[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 337)
        {
          var enemy = new Rats(this.game, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 90, "rat", "poison","rat","ratAttack",-2,25);
          this.rats[o] = enemy;
        }
        else if (this.map.objects[ol][o].gid == 5264)
        {
          var maza = new mazaCaballero(this.game, 0, 0, 0, 'maza',35);
          var enemy = new Knight(this.game, 30, this.map.objects[ol][o].x,this.map.objects[ol][o].y, 'knight', maza,"armor","swing",2,35);
          this.knights[o] = enemy;
        }
      }
    }
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
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.sword = new Sword(this.game, -50, 0, 0, 'sword');
    this.sword.create();
    this.fireCone = new FireCone(this.game, -50, 0, 0, 'firecone');
    this.fireCone.create();
    this.bonfire = new Bonfire(this.game, 822, 1768, 'bonfire');
    this.bonfire.create();
    this.chest = new Chest(this.game, 1785, 230, "chest", "armor");
    this.chest.create();
    if (this.game.mejoraSpeed) {
      this.jugador = new Player(this.game,300,124, 2468,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    } else this.jugador = new Player(this.game,200,124, 2468,"player",this.cursors, this.sword,this.fireCone, "fireball","hurt");
    this.jugador.create();
    this.enepece = new NPC(this.game, 1538, 2226, "jose", "Llevo siglos aqui en esta cueva\ny todavia tengo que hacer TPV");
    this.enepece.create();
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
    if (this.jugador.x > 576 && this.jugador.x < 670 && this.jugador.y < 476 && this.jugador.y > 354){
      this.music.pause();
     this.game.state.start('bosque');
    }
    this.stamina.setPercent(this.jugador.stamina);
    this.health.setPercent(this.jugador.salud);
    this.physics.arcade.collide(this.jugador,this.layer);
    this.physics.arcade.collide(this.jugador,this.layer2);
    this.physics.arcade.collide(this.jugador,this.layer3);
    this.physics.arcade.collide(this.jugador,this.layer4);
    this.physics.arcade.collide(this.jugador,this.chest);
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
    }
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
      this.physics.arcade.overlap(this.knights[i], this.jugador.sword, this.collision, null, this);
      this.physics.arcade.overlap(this.knights[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.knights[i], this.jugador.fireCone, this.collision, null, this);
      this.physics.arcade.collide(this.knights[i], this.jugador.shoot, this.collision, null, this);
    }
    this.chest.update(this.jugador.x, this.jugador.y);
    this.enepece.update(this.jugador.x, this.jugador.y);
    this.bonfire.update(this.jugador.x, this.jugador.y);
    this.jugador.update();
    this.jugador.interact(this.chest);
    this.jugador.interact(this.enepece);
    this.jugador.interact(this.bonfire);
    this.jugador.sword.update();
    this.jugador.fireCone.update();
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
    //this.game.debug.body(this.knight);
    //this.game.debug.body(this.knight.maza);
    this.game.debug.body(this.boss);
    for (var i in this.rats)
    {
      this.game.debug.body(this.rats[i]);
    }
    for (var i in this.skeletons)
    {
      this.game.debug.body(this.skeletons[i]);
    }*/

}
};
module.exports = PlayScene;
},{"./Bonfire.js":1,"./Boss.js":2,"./Chest.js":5,"./Enemy.js":6,"./FireCone.js":8,"./HealthBar.js":9,"./Knight.js":11,"./MazaCaballero.js":13,"./NPC.js":16,"./RangedEnemy.js":18,"./Rats.js":19,"./RockRoll.js":20,"./player.js":25,"./sword.js":26}],25:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');

function Player(game,speed,x,y,spritename,cursors, sword, fireCone, spriteweapon, audio)
  {
    Character.call(this,game,speed,x,y,spritename, audio);
    this.cursors = cursors;
    this.spriteshoot = spriteweapon;
    this.salud = 100;
    this.attackButton = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
    this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.rollButton = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
    this.drinkButton = this.game.input.keyboard.addKey(Phaser.KeyCode.C);
    this.interactButton = this.game.input.keyboard.addKey(Phaser.KeyCode.E);
    this.blockButton = this.game.input.keyboard.addKey(Phaser.KeyCode.V);
    this.attacking = false;
    this.sword = sword;
    this.fireCone = fireCone;
    this.invincible = false;
    this.moving = true;
    this.blocking = false;
    this.rolling = false;
    this.knockback = false;
    this.stamina = 100;
    if (this.game.mejoraEstus) {
      this.estus = 5;
    } else this.estus = 4;
    if (this.game.mejoraArmor) {
      this.resistencia = 20;
    } else this.resistencia = 10;
  }

  Player.prototype = Object.create(Character.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.create = function()
  {
    this.game.add.existing(this);
    this.game.physics.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('idledown', [17],1,true);
    this.animations.add('idleleft', [2],1,true);
    this.animations.add('idleup', [24],1,true);
    this.animations.add('idleright', [9],1,true);
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
    this.animations.add('drinking', [72,73,74],3,false);
    this.animations.add('dead',[75],1,false);
    this.animations.add('block',[76],1,false);
    this.body.setSize(30, 35, 6, 10);
    this.anchor.setTo(0.5, 0.5);

    this.addChild(this.sword);
    this.addChild(this.fireCone);
    this.healAudio = this.game.add.audio('heal');
    this.swordAudio = this.game.add.audio('sword');
    this.fireAudio = this.game.add.audio('fire');
    this.stepAudio = this.game.add.audio('step');
    this.dieAudio = this.game.add.audio('die');
    this.body.mass = 3;

    this.deathimage = this.game.add.sprite(400, 300,"youdied");
    this.deathimage.width = 800;
    this.deathimage.height = 250;
    this.deathimage.anchor.setTo(0.5,0.5);
    this.deathimage.alpha = 0;
    this.game.add.existing(this.deathimage);
    this.deathimage.fixedToCamera = true;
  }
  Player.prototype.setIdle = function()
  {
    switch(this.direction)
    {
      case 0:
      this.animations.play("idledown");
      break;
      case 1:
      this.animations.play("idleleft");
      break;
      case 2:
      this.animations.play("idleup");
      break;
      case 3:
      this.animations.play("idleright");
      break;
    }
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
    if (this.stamina >= 20)
    {
      if (this.body.velocity.x != 0 || this.body.velocity.y != 0)
      {
        this.stamina = this.stamina - 25;
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
  Player.prototype.block = function()
  {
    if (this.stamina > 30)
    {
    this.blocking = true;
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    this.animations.play("block");
    this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function(){this. blocking = false;} , this);
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
  Player.prototype.drink = function()
  {
    if (this.estus > 0)
    {
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    this.moving = false;
    this.animations.play('drinking',5);
    this.healAudio.play();
    this.estus--;
    if (this.salud <= 50)
      this.salud += 50;
    else
      this.salud = 100;
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){this.animations.play('idle'); this.moving = true;} , this);
    }
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
          this.swordAudio.play();
          switch(this.direction)
          {
            case 0:
            this.animations.play('attackdown',30);
            break;
            case 1:
            this.animations.play('attackleft',30);
            break;
            case 2:
            this.animations.play('attackup',30);
            break;
            case 3:
            this.animations.play('attackright',30);
            break;
          }
          this.game.time.events.add(Phaser.Timer.SECOND * 0.25, function(){
            this.attacking = false;//Returns the boolean var to "false"
            this.sword.attacking = false;
            this.sword.body.setSize(0,0);
        }, this);
          //Start the Timer object that will wait for 1 second and then will triger the inner function.
          this.game.time.events.add(Phaser.Timer.SECOND * 0.75, function(){
              this.setIdle();//Returns the animation to "idle"
              this.moving = true;
          }, this);
      }
    }
}

Player.prototype.attackFire = function(){
  //We use a boolean var to check if the player is currently attacking to prevent a new attack mid animation.
  //(May not be necessary in your game.)
  if (this.stamina >= 75)
  {
    if (!this.attacking){
        this.stamina = this.stamina - 75;
        this.attacking = true;
        this.moving = false;
        this.fireCone.attacking = true;
        this.fireCone.startAttack(this.direction);
        this.fireAudio.play();
        switch(this.direction)
        {
          case 0:
          this.animations.play('attackdown',0.1);
          break;
          case 1:
          this.animations.play('attackleft',0.1);
          break;
          case 2:
          this.animations.play('attackup',0.1);
          break;
          case 3:
          this.animations.play('attackright',0.1);
          break;
        }
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function(){
          this.attacking = false;//Returns the boolean var to "false"
          this.fireCone.attacking = false;
          this.fireCone.body.setSize(0,0);
      }, this);
        //Start the Timer object that will wait for 1 second and then will triger the inner function.
        this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
            this.setIdle();//Returns the animation to "idle"
            this.moving = true;
        }, this);
    }
  }
}

Player.prototype.col = function(enemy)
{
  if (!this.blocking)
  {
    if (enemy.attacking)
    {
      this.knock(enemy, (enemy.dmg)-(this.resistencia), 300);
      this.invincible = true;
      this.alpha = 0.5;
      this.hurt.play();
      this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {this.invincible = false; this.alpha = 1;}, this);
    }
  }
  else
  {
    if (enemy.attacking)
    {
      this.stamina -= 30;
      enemy.knock(this, 0, 0);
    }
  }
}

Player.prototype.update = function()
  {
  if (this.stamina < 0)
  {
    this.stamina = 0;
  }
  if (this.moving && !this.rolling && !this.blocking)
  {
    if (this.stamina < 100)
    {
      this.stamina = this.stamina + 0.2;
    }
    if (this.attackButton.isDown)
        this.attack();
    else if (this.blockButton.isDown)
    {
        this.block();
    }
    else if (this.rollButton.isDown)
      {
        this.roll();
      }
    else if (this.cursors.left.isDown)
    {
      this.stepAudio.play('',0,1,false,false);
      this.direction = 1;
      this.moveX(-this.speed);
      this.animations.play('runleft');
    }
    else if (this.cursors.right.isDown)
    {
      this.stepAudio.play('',0,1,false,false);
      this.direction = 3;
      this.moveX(this.speed);
      this.animations.play('runright');
    }
    else if (this.cursors.up.isDown)
    {
      this.stepAudio.play('',0,1,false,false);
      this.direction = 2;
      this.moveY(-this.speed);
      this.animations.play('runup');
    }
    else if (this.cursors.down.isDown)
    {
      this.stepAudio.play('',0,1,false,false);
      this.direction = 0;
      this.moveY(this.speed);
      this.animations.play('rundown');
    }
    else if (this.fireButton.isDown){
      this.attackFire();
    }
    else if (this.drinkButton.isDown)
    {
      this.drink();
    }
    else{
      this.body.velocity.x= 0;
      this.body.velocity.y= 0;
      this.setIdle();
    }
  }
  else if (this.blockButton.isDown)
  {
    this.body.velocity.x= 0;
    this.body.velocity.y= 0;
  }
  else if (this.attacking && !this.knockback && !this.rolling && !this.blocking)
  {
    this.body.velocity.x= 0;
    this.body.velocity.y= 0;
  }

    if (this.salud <= 0){
      this.animations.play('dead');
      this.hurt.pause();
      if (this.deathimage.alpha < 1)
        this.deathimage.alpha += 0.005;
      this.body.moves = false;
      this.dieAudio.play('',0,1,false,false);
      this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){ this.game.state.start(this.game.state.current)},this);
    }
  }

  Player.prototype.interact = function(objeto){
    if (objeto!=undefined && this.interactButton.isDown){
      if (Phaser.Rectangle.intersects(this.getBounds(), objeto.getBounds())){
       objeto.col(this);
      }
    }
  }

  module.exports = Player;
},{"./Character.js":4}],26:[function(require,module,exports){
'use strict';
var Character = require('./Character.js');

function Sword(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.rot = 100;
    this.attacking = false;
    this.dmg = 8;
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
    this.body.setSize(0,0);
}

Sword.prototype.startAttack = function(dir)
{
    this.direction = dir;
    switch(dir){
        case 0:
            this.animations.play('slashdown',30);
            this.y = 15;
            this.x = 0;
            this.body.setSize(50,10,0,55);
            break;
        case 1:
            this.animations.play('slashleft',30);
            this.x = -10;
            this.y = 0;
            this.body.setSize(10,50,-10,0);
            break;
        case 2:
            this.animations.play('slashup',30);
            this.y = -17;
            this.x = -6;
            this.body.setSize(50,10,0,0);
            break;
        case 3:
            this.animations.play('slashright',30);
            this.y = 0;
            this.x = 10;
            this.body.setSize(10,50,45,0);
            break;
    }
}

Sword.prototype.stopAttack = function(player)
{
    this.rotation = 0;
    player.attacking = false;
}

Sword.prototype.update = function()
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}
module.exports = Sword;
},{"./Character.js":4}]},{},[22]);
