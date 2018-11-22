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