'use strict';
var Character = require('./Character.js');

function Player(game,speed,x,y,spritename,cursors)
  {
    Character.call(this,game,speed,x,y,spritename);
    this.cursors = cursors;
    this.salud = 100;
  }

  Player.prototype = Object.create(Character.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.create = function()
  {
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('idle', [17],1,true);
    this.animations.add('runleft', [0,1,2,3,4,5,6,7],8,true);
    this.animations.add('runright', [8,9,10,11,12,13,14,15],8,true);
    this.animations.add('rundown', [16,17,18,19,20,21,22,23],8,true);
    this.animations.add('runup', [24,25,26,27,28,29,30,31],8,true);
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
    if (this.body.velocity.x != 0 && this.body.velocity.y != 0)
    {
      this.speed += this.speed/2;
    }
  }
  Player.prototype.update = function()
  {
    if (this.cursors.left.isDown)
    {
      this.moveX(-this.speed);
      this.animations.play('runleft');
    }
    else if (this.cursors.right.isDown)
    {
      this.moveX(this.speed);
      this.animations.play('runright');
    }
    else if (this.cursors.up.isDown)
    {
      this.moveY(-this.speed);
      this.animations.play('runup');
    }
    else if (this.cursors.down.isDown)
    {
      this.moveY(this.speed);
      this.animations.play('rundown');
    }
    else{
      this.body.velocity.x= 0;
      this.body.velocity.y= 0;
      this.animations.play('idle');
    }

    if (this.salud <= 0){
      this.game.state.start(this.game.state.current);
    }
  }
  module.exports = Player;