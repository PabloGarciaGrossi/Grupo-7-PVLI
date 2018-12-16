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
    this.drinkButton = this.game.input.keyboard.addKey(Phaser.KeyCode.C);
    this.attacking = false;
    this.sword = sword;
    this.invincible = false;
    this.moving = true;
    this.rolling = false;
    this.knockForce = 500;
    this.knockback = false;
    this.stamina = 100;
    this.estus = 5;
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
    this.animations.add('drinking', [72,73,74],3,false);
    this.animations.add('dead',[75],1,false);
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
  Player.prototype.drink = function()
  {
    if (this.estus > 0)
    {
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    this.moving = false;
    this.animations.play('drinking',5);
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
          this.game.time.events.add(Phaser.Timer.SECOND * 0.75, function(){
              this.animations.play('idle');//Returns the animation to "idle"
              this.moving = true;
          }, this);
      }
    }
}

Player.prototype.col = function(enemy)
{
  if (enemy.attacking)
  {
    this.knock(enemy);
  }
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
    else if (this.drinkButton.isDown)
    {
      this.drink();
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
      this.animations.play('dead');
      this.moving = false;
      this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){ this.game.state.start(this.game.state.current)},this);
      this.game.state.start(this.game.state.current);
    }
  }

  Player.prototype.bulletHit = function (enemy) 
  {
      var esto = this;
      this.shoot.bullets.forEach(function (bullet) {
          if(esto.game.physics.arcade.collide(bullet, enemy)) {
              bullet.kill();
              enemy.col(esto);
          }
      }
      );
  } 

  module.exports = Player;