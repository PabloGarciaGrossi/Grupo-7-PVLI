'use strict'
var Enemy = require('./Enemy.js');

function RangedEnemy(game, x, y,speed, spritename, spriteweapon, audio, audioAttack,salud,dmg) 
{
    Enemy.call(this, game, speed, x, y, spritename, audio, audioAttack,salud,dmg);
    this.spriteshoot = spriteweapon;
    this.attacking = true;
}
RangedEnemy.prototype = Object.create(Enemy.prototype);
RangedEnemy.prototype.constructor = RangedEnemy;

RangedEnemy.prototype.create = function ()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;

    this.animations.add('idle', [0],1,true);
    this.animations.add('runleft', [2,3],1,true);
    this.animations.add('runright', [6,7],1,true);
    this.animations.add('rundown', [0,1],1,true);
    this.animations.add('runup', [4,5],1,true);
    this.animations.add('dead',[8],1,true);

    this.shoot = this.game.add.weapon(1, this.spriteshoot);
    this.shoot.bulletSpeed = 300;
    this.shoot.fireRate = 3500;
    this.shoot.bulletLifespan = 800;
    this.shoot.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.shoot.trackSprite(this, 0, 0, false);

}

RangedEnemy.prototype.update = function(player, playerx, playery)
{
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 270 && this.moving)
        {
            this.MoveTo(playerx, playery);
            this.shoot.fireAtXY(player.x, player.y);
            this.detectAnimation(player.x, player.y);
        }
        else if (dist >= 500)
        {
            this.setIdle();
        }
        this.bulletHit(player);
    }
    else{
        this.animations.play('dead');
        this.body.enable = false;
    }
}

RangedEnemy.prototype.bulletHit = function (player) 
{
    var esto = this;
    this.shoot.bullets.forEach(function (bullet) {
        if(esto.game.physics.arcade.collide(bullet, player)) {
            bullet.kill();
            if(!player.invincible)
                player.col(esto);
        }
    }
    );
}   
module.exports = RangedEnemy;
