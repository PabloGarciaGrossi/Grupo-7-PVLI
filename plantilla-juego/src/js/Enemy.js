'use strict';
var Character = require('./Character.js');

function Enemy(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.salud = 100;
    this.reviving = false;
    this.tackling = false;
    this.attacking = false;
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
    this.animations.add('chargedown',[9],1,false);
    this.animations.add('chargeleft',[11],1,false);
    this.animations.add('chargeright',[13],1,false);
    this.animations.add('chargeup',[16],1,false);
    this.animations.add('tackledown',[9,10],false);
    this.animations.add('tackleleft',[11,12],false);
    this.animations.add('tackleright',[13,14],false);
    this.animations.add('tackleup',[16,17],false);
    this.anchor.setTo(0.5, 0.5);
}
Enemy.prototype.MoveTo = function(x, y){

    var angle = Math.atan2(y - this.y, x - this.x);

   this.body.velocity.x = Math.cos(angle) * this.speed;
   this.body.velocity.y = Math.sin(angle) * this.speed;

    return angle;

}
Enemy.prototype.charge = function()
{
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    this.charging = true;
    switch (this.direction)
    {
        case 0:
            this.animations.play('chargedown');
            break;
        case 1:
            this.animations.play('chargeleft');
            break;
        case 2:
            this.animations.play('chargeup');
            break;
        case 3:
            this.animations.play('chargeright');
            break;
    }
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {Enemy.prototype.tackle()}, this);
}
Enemy.prototype.tackle = function()
{
    switch (this.direction)
    {
        case 0:
            this.animations.play('tackledown',5);
            this.body.velocity.y += 300;
            this.body.velocity.x = 0;
            break;
        case 1:
            this.animations.play('tackleleft',5);
            this.body.velocity.x -= 300;
            this.body.velocity.y = 0;
            break;
        case 2:
            this.animations.play('tackleup',5);
            this.body.velocity.y -= 300;
            this.body.velocity.x = 0;
            break;
        case 3:
            this.animations.play('tackleright',5);
            this.body.velocity.x += 300;
            this.body.velocity.y = 0;
            break;
    }
    this.moving = false;
    this.tackling = true;
    this.attacking = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.4, function() {this.body.velocity.x = 0; this.body.velocity.y = 0;this.attacking = false;}, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 1.1, function() {this.moving = true;}, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 2.3, function() {this.tackling = false;}, this);
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
        if (dist < 260 && this.moving)
        {
            if (dist < 130 && !this.tackling)
            {
                this.tackle();
            }
            else
            {
            this.MoveTo(playerx, playery);
            this.detectAnimation(playerx, playery);
            }
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
        this.game.time.events.add(Phaser.Timer.SECOND * 30, function() {this.body.enable = true;this.salud = 100;}, this);
    }
}
Enemy.prototype.col = function(sword)
{
    if (sword.attacking)
    {
        this.knock(sword, 25,200);
        this.invincible = true;
        this.alpha = 0.5;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {this.invincible = false; this.alpha = 1;}, this);
    }
}
module.exports = Enemy;
