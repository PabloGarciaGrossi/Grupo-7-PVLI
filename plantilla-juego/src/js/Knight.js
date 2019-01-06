'use strict';
var Enemy = require('./Enemy.js');

function Knight (game, speed, x, y, spritename, maza, audio,audioAttack,salud,dmg)
{
    Enemy.call(this,game,speed,x,y,spritename,audio,audioAttack,salud,dmg);
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
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 300 && this.moving)
        {
            this.attackAudio.play('',0,1,false,false);
            this.detectAnimation(playerx, playery);
            if (dist > 40)
                {
                this.MoveTo(playerx, playery);
                }
            this.maza.update(this.direction);
        }
        else if (dist >= 300)
        {
            this.setIdle();
        }
    }
    else{
        this.animations.play('dead');
        this.body.enable = false;
        this.maza.alpha = 0;
        this.maza.body.enable = false;
    }
}

module.exports = Knight;