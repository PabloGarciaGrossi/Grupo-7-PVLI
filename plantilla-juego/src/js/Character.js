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
  Character.prototype.knock = function(enemy, dmg, knockpower){
    this.salud -= dmg;
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
  //this.invincible = true;
  this.knockback = true;
  //this.alpha = 0.5;
  this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function() {this.moving = true;this.knockback = false;}, this);
    }
    module.exports = Character;