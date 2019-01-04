'use strict';
var Character = require('./Character.js');
function mazaCaballero(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.attacking = true;
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