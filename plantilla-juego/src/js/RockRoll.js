'use strict';
var Character = require('./Character.js');

function RockRoll(game, speed, x, y, spritename, dir, dist)
{
    Character.call(this,game,speed,x,y,spritename);
    this.active = false;
    this.direction = dir;
    this.distancia = dist;
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
    if(this.direction == 0 || this.direction == 1)
        activarX(playerX, this.distancia);
    else activarY(playerY, this.distancia);

    if (active){
        if (this.direction == 0) {
            this.moveX(speed);
        } else if (this.direction == 1) {
            this.moveX(-speed);
        } else if (this.direction == 2) {
            this.moveY(speed);
        } else if (this.direction == 3) {
            this.moveY(-speed);
        }
    }
}

RockRoll.prototype.activarX(x, distx) {

    if(x = this.x + distx) this.active = true;

}

RockRoll.prototype.activarY(y, disty) {

    if(y = this.y + disty) this.active = true;

}
