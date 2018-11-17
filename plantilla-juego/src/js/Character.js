'use strict';
function Character(game, speed, x, y, spritename)
  {
    Phaser.Sprite.call(this, game, x, y, spritename)
    this.anchor.setTo(0.5,0.5);
    this.speed = speed;
    this.direction = 0;
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
    module.exports = Character;