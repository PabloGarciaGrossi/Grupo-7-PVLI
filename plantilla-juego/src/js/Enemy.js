'use strict';
var Character = require('./Character.js');

function Enemy(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('idle', [0],1,true);
    this.animations.add('runleft', [2,3],2,true);
    this.animations.add('runright', [6,7],2,true);
    this.animations.add('rundown', [0,1],2,true);
    this.animations.add('runup', [4,5],2,true);
}
Enemy.prototype.MoveTo = function(x, y){

    var angle = Math.atan2(y - this.y, x - this.x);

   this.body.velocity.x = Math.cos(angle) * this.speed;
   this.body.velocity.y = Math.sin(angle) * this.speed;

    return angle;
}
Enemy.prototype.distanceToXY = function (x, y) {

    var dx =  this.x - x;
    var dy =  this.y - y;

    return Math.sqrt(dx * dx + dy * dy);
}
Enemy.prototype.update = function(player)
{
    if (this.distanceToXY(player.x,player.y) < 50)
    {
        this.MoveTo(player.x,player.y);
    }
}
module.exports = Enemy;
