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