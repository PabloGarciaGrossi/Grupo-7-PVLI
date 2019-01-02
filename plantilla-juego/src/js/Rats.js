'use strict'
var RangedEnemy = require('./RangedEnemy.js');

function Rats (game, x, y,speed, spritename, spriteweapon)
{
    RangedEnemy.call(this, game, speed, x, y, spritename);
    this.spitting = false;
}
Rats.prototype = Object.create(RangedEnemy.prototype);
Rats.prototype.constructor = Rats;

/*Rats.prototype.create = function ()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;

    this.animations.add('idle', [0],1,true);
    this.animations.add('left', [2,3],1,true);
    this.animations.add('right', [6,7],1,true);
    this.animations.add('down', [0,1],1,true);
    this.animations.add('up', [4,5],1,true);
    this.animations.add('dead',[8],1,true);
    this.animations.add('spitleft',[9],1,true);
    this.animations.add('spitdown',[10],1,true);
    this.animations.add('spitright',[11],1,true);
    this.animations.add('spitup',[12],1,true);

    this.shoot = this.game.add.weapon(1, this.spriteshoot);
    this.shoot.bulletSpeed = 250;
    this.shoot.fireRate = 7000;
    this.shoot.bulletLifespan = 400;
    this.shoot.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.shoot.trackSprite(this, 0, 0, false);
}*/
Rats.prototype.attack = function()
{
    var saveSpeed = this.speed;
    this.speed = 0;
    this.spitting = true;
    this.shoot.fireAtXY(player.x, player.y);
    switch (this.direction)
    {
        case 0:
            this.animations.play('spitdown');
            break;
        case 1:
            this.animations.play('spitleft');
            break;
        case 2:
            this.animations.play('spitup');
            break;
        case 3:
            this.animations.play('spitright');
            break;
    }
    this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {this.speed = saveSpeed; this.spitting = false;}, this);
}
Rats.prototype.update = function(player, playerx, playery)
{
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 330 && this.moving)
        {
            this.MoveTo(playerx, playery);
            if (dist < 150 && this.moving && !this.spitting)
            {
            this.attack();
            }
            if (!this.spitting)
            {
            this.detectAnimation(player.x, player.y);
            }
        }
        else if (dist >= 500)
        {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.play('idle');
        }
        this.bulletHit(player);
    }
    else{
        this.animations.play('dead');
        this.body.enable = false;
    }
}
module.exports = Rats;