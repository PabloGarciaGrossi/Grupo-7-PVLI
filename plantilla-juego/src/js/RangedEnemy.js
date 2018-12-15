'use strict'
var Enemy = require('./Enemy.js');

function RangedEnemy(game, x, y,speed, spritename, spriteweapon) 
{
    Enemy.call(this, game, speed, x, y, spritename);
    this.spriteshoot = spriteweapon;
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
    this.animations.add('left', [3],1,true);
    this.animations.add('right', [6],1,true);
    this.animations.add('down', [0],1,true);
    this.animations.add('up', [4],1,true);
    this.animations.add('dead',[8],1,true);

    this.shoot = this.game.add.weapon(1, this.spriteshoot);
    this.shoot.bulletSpeed = 300;
    this.shoot.fireRate = 3500;
    this.shoot.bulletLifespan = 800;
    this.shoot.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.shoot.trackSprite(this, 0, 0, false);

}

RangedEnemy.prototype.distanceToXY = function(x, y) 
{

    var dx =  this.x - x;
    var dy =  this.y - y;

    return Math.sqrt(dx * dx + dy * dy);
}

RangedEnemy.prototype.update = function(player, playerx, playery)
{
    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 200 && this.moving)
        {
            this.MoveTo(playerx, playery);
            this.shoot.fireAtXY(player.x, player.y);
            this.detectAnimation(player.x, player.y);
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

RangedEnemy.prototype.detectAnimation = function(x,y){
    var cx = this.x -x;
    var cy = this.y -y;
    if (cx > 0 && Math.abs(cx) >= Math.abs(cy))
    {
        this.animations.play('left');
        this.direction = 1;
    }
    else if (cx < 0 && Math.abs(cx) >= Math.abs(cy))
    {
        this.animations.play('right');
        this.direction = 3;
    }
    else if (cy > 0)
    {
        this.animations.play('up');
        this.direction = 2;
    }
    else{
        this.animations.play('down');
        this.direction = 0;
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