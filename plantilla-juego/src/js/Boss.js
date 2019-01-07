'use strict';
var Enemy = require('./Enemy.js');

function Boss (game, speed, x, y, spritename,audio,audioAttack,salud,dmg,bolahielo,rayo,bolafuego)
{
    Enemy.call(this,game,speed,x,y,spritename,audio,audioAttack,salud,dmg);
    this.hielosprite = bolahielo;
    this.rayosprite = rayo;
    this.bolafuegosprite = bolafuego;
    this.lanzafuego = false;
    this.lanzahielo = false;
    this.lanzarayo = false;
}

Boss.prototype = Object.create(Enemy.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.create = function()
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
    this.animations.add('hielo', [9],1,true);
    this.animations.add('rayo', [10],1,true);
    this.animations.add('fuego', [11],1,true);

    this.anchor.setTo(0.5, 0.5);

    this.bolahielo = this.game.add.weapon(1, this.hielosprite);
    this.bolahielo.bulletSpeed = 400;
    this.bolahielo.fireRate = 500;
    this.bolahielo.bulletLifespan = 1200;
    this.bolahielo.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.bolahielo.trackSprite(this, 0, 0, false);

    this.rayo = this.game.add.weapon(1, this.rayosprite);
    this.rayo.bulletSpeed = 700;
    this.rayo.fireRate = 1200;
    this.rayo.bulletLifespan = 1200;
    this.rayo.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.rayo.trackSprite(this, 0, 0, false);

    this.aura = this.game.add.sprite(this.x, this.y, this.bolafuegosprite);
    this.aura.alpha = 0;
    this.attacking = true;
}

Boss.prototype.auraFuego = function()
{
    this.animations.play('fuego');
    this.moving = false;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function() {
        this.aura.alpha = 1;
        this.body.setCircle(57.5);
        this.moving = true;
        this.lanzafuego = true;
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 5.6, function() {
        this.aura.alpha = 0;
        this.body.setSize(66,78);
        this.lanzafuego = false;
    }, this);
}

Boss.prototype.iceThrowing = function()
{
    this.animations.play('hielo');
    this.moving = false;
    this.lanzahielo = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 3.5, function() {
        this.moving = true;
        this.lanzahielo = false;
    }, this);
}

Boss.prototype.thunderThrowing = function()
{
    this.animations.play('rayo');
    this.moving = false;
    this.lanzarayo = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 3.5, function() {
        this.moving = true;
        this.lanzarayo = false;
    }, this);
}

Boss.prototype.update = function(player)
{
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);

    if (this.salud > 0)
    {
        if (this.moving)
        {
            this.MoveTo(player.x, player.y);
            if (!this.lanzafuego && !this.lanzahielo && !this.lanzarayo)
            {
            var value = Phaser.Math.Between(1, 3);
            switch(value)
                {
                    case 1:
                    this.auraFuego();
                    break;
                    case 2:
                    this.iceThrowing();
                    break;
                    case 3:
                    this.thunderThrowing();
                    break;
                }
            }
        }
        else if (this.lanzahielo)
        {
            this.bolahielo.fireAtXY(player.x, player.y);
        }
        else if (this.lanzarayo)
        {
            this.rayo.fireAtXY(player.x, player.y);
        }
        this.bulletHit(player);
    }
    else
    {
        this.animations.play('dead');
        this.body.enable = false;
    }
}

Boss.prototype.bulletHit = function (player) 
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
module.exports = Boss;