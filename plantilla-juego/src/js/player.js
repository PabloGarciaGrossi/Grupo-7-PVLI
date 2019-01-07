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
      this.estus = 6;
    } else this.estus = 5;
    if (this.game.mejoraArmor) {
      this.resistencia = 5;
    } else this.resistencia = 10;
  }

  Player.prototype = Object.create(Character.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.create = function()
  {
    this.game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
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
      //this.game.state.start(this.game.state.current);
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