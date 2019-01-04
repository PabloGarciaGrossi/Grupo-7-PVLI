'use strict';
var Enemy = require('./Enemy.js');

function Knight (game, speed, x, y, spritename, maza)
{
    Enemy.call(this,game,speed,x,y,spritename);
    this.maza = maza;
}
Knight.prototype = Object.create(Enemy.prototype);
Knight.prototype.constructor = Knight;

Knight.prototype.create = function()
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
    this.maza.create();
    this.addChild(this.maza);
}
Knight.prototype.update = function(playerx, playery)
{
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 300 && this.moving)
        {
            this.detectAnimation(playerx, playery);
            if (dist > 40)
                {
                this.MoveTo(playerx, playery);
                }
            this.maza.update(this.direction);
        }
        else if (dist >= 500)
        {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.play('idle');
        }
    }
    else{
        this.animations.play('dead');
        this.body.enable = false;
        this.maza.alpha = 0;
        this.maza.body.setSize(0,0);
    }
}

module.exports = Knight;