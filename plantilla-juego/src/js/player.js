'use strict';
var Character = require('./Character.js');

function Player(game,speed,x,y,spritename,cursors, sword)
  {
    Character.call(this,game,speed,x,y,spritename);
    this.cursors = cursors;
    this.salud = 100;
    this.attackButton = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
    this.rollButton = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
    this.attacking = false;
    this.sword = sword;
    
    this.invincible = false;
    this.moving = true;
    this.rolling = false;
    this.knockForce = 500;
    this.knockback = false;
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
    this.body.setSize(30, 35, 6, 10);
    this.anchor.setTo(0.5, 0.5);
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
    if (this.body.velocity.x != 0 || this.body.velocity.y != 0)
    {
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
      this.alpha = 0.5;
      this.invincible = true;
      this.rolling = true;
      this.game.time.events.add(Phaser.Timer.SECOND * 0.2, Player.prototype.stopRoll , this);
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
    if (!this.attacking){
        this.attacking = true;
        this.moving = false;
        this.sword.startAttack(this.direction);
        //Start the Timer object that will wait for 1 second and then will triger the inner function.
        this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
            this.animations.play('idle');//Returns the animation to "idle"
            this.attacking = false;//Returns the boolean var to "false"
            this.moving = true;
        }, this);
    }
}
  Player.prototype.playerCol = function(enemy){
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
  Player.prototype.update = function()
  {
  if (this.moving && !this.rolling)
  {
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