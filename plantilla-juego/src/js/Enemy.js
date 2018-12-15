'use strict';
var Character = require('./Character.js');

function Enemy(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.salud = 100;
    this.reviving = false;
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function()
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
    this.animations.add('dead',[8],1,true);
    this.anchor.setTo(0.5, 0.5);
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
Enemy.prototype.detectAnimation = function(x,y){
    var cx = this.x -x;
    var cy = this.y -y;
    if (cx > 0 && Math.abs(cx) >= Math.abs(cy))
    {
        this.animations.play('runleft');
        this.direction = 1;
    }
    else if (cx < 0 && Math.abs(cx) >= Math.abs(cy))
    {
        this.animations.play('runright');
        this.direction = 3;
    }
    else if (cy > 0)
    {
        this.animations.play('runup');
        this.direction = 2;
    }
    else{
        this.animations.play('rundown');
        this.direction = 0;
    }
}
Enemy.prototype.update = function(playerx, playery)
{
    if (this.salud > 0)
    {
        this.reviving = false;
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 200 && this.moving)
        {
        this.MoveTo(playerx, playery);
        this.detectAnimation(playerx, playery);
        }
        else if (dist >= 200)
        {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.play('idle');
        }
    }
    else if (!this.reviving)
    {
        this.body.enable = false;
        this.play('dead');
        this.reviving = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {this.body.enable = true;this.salud = 100;}, this);
    }
}
Enemy.prototype.col = function(sword)
{
    if (sword.attacking)
    {
        this.knock(sword);
        this.salud-=25;
    }
}
module.exports = Enemy;
