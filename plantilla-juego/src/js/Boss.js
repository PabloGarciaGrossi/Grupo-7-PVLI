'use strict';
var Enemy = require('./Enemy.js');

function Boss (game, speed, x, y, spritename,audio,audioAttack,salud,dmg,bolahielo,rayo,bolafuego,aura)
{
    Enemy.call(this,game,speed,x,y,spritename,audio,audioAttack,salud,dmg);
    this.hielosprite = bolahielo;
    this.rayosprite = rayo;
    this.bolafuegosprite = bolafuego;
    this.lanzafuego = false;
    this.lanzahielo = false;
    this.lanzarayo = false;
    this.cooldown = true;
    this.aura = aura;
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

    this.bolahielo = this.game.add.weapon(5, this.hielosprite);
    this.bolahielo.bulletSpeed = 700;
    this.bolahielo.fireRate = 300;
    this.bolahielo.bulletLifespan = 700;
    this.bolahielo.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.bolahielo.trackSprite(this, 0, 0, false);

    this.rayo = this.game.add.weapon(5, this.rayosprite);
    this.rayo.bulletSpeed = 950;
    this.rayo.fireRate = 600;
    this.rayo.bulletLifespan = 1400;
    this.rayo.bulletAngleVariance = 10;
    this.rayo.bulletAngleOffset = 90;
    this.rayo.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.rayo.trackSprite(this, 0, 0, false);

    this.aura.create();
    this.addChild(this.aura);
    
    this.attacking = true;
    this.attack = 1;

    this.rayoAudio = this.game.add.audio('rayo');
    this.bolaAudio = this.game.add.audio('bola');
    this.fuegoAudio = this.game.add.audio('escudo');
    this.pasoAudio = this.game.add.audio('pasos');

    this.cooldownInicial();
}

Boss.prototype.cooldownInicial = function()
{
    this.game.time.events.add(Phaser.Timer.SECOND * 3, function() {
        this.cooldown = !this.cooldown;
    }, this);
}
Boss.prototype.cargaFuego = function()
{
    this.animations.play('fuego');
    this.moving = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        this.lanzafuego = true;
        this.aura.alpha = 1;
        this.aura.attacking = true;
        this.moving = true;
        this.aura.body.enable = true;
        this.fuegoAudio.play();
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 9.5, function() {
        this.aura.alpha = 0;
        this.aura.attacking = false;
        this.lanzafuego = false;
        this.attack += 1;
        this.cooldown = true;
        this.aura.body.enable = false;
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 10.5, function() {
        this.cooldown = false;
    }, this);
    
}

Boss.prototype.fireCircle = function()
{
    this.aura.update(this.direction);
}

Boss.prototype.iceThrowing = function()
{
    this.animations.play('hielo');
    this.moving = false;
    this.lanzahielo = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 6, function() {
        this.moving = true;
        this.lanzahielo = false;
        this.attack += 1;
        this.cooldown = true;
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 8, function() {
        this.cooldown = false;
    }, this);
}

Boss.prototype.thunderThrowing = function()
{
    this.animations.play('rayo');
    this.moving = false;
    this.lanzarayo = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 8, function() {
        this.moving = true;
        this.lanzarayo = false;
        this.attack += 1;
        this.cooldown = true;
    }, this);
    this.game.time.events.add(Phaser.Timer.SECOND * 8, function() {
        this.cooldown = false;
    }, this);
}

Boss.prototype.update = function(player,playerx,playery)
{
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);

    if (this.salud > 0)
    {
        var dist = this.distanceToXY(playerx, playery);
        if (dist < 600 && this.moving)
        {
            this.detectAnimation(playerx, playery);
            this.MoveTo(playerx, playery);
            this.pasoAudio.play('',0,1,false,false);
            if (!this.lanzafuego && !this.lanzahielo && !this.lanzarayo && !this.cooldown)
            {
            if (this.attack > 3)
            {
                this.attack = 1;
            }
            switch(this.attack)
                {
                    case 1:
                    this.cargaFuego();
                    break;
                    case 2:
                    this.iceThrowing();
                    break;
                    case 3:
                    this.thunderThrowing();
                    break;
                }
            }
            else if (this.lanzafuego)
            {
                this.dmg = 40;
                this.fireCircle();
            }
        }
        else if (this.lanzahielo)
        {
            this.dmg = 30;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.bolahielo.fireAtXY(playerx, playery);
            this.bolaAudio.play('',0,1,false,false);
        }
        else if (this.lanzarayo)
        {
            this.dmg = 35;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.rayo.fireAtXY(playerx, playery);
            this.rayoAudio.play('',0,1,false,false);
        }
        this.hieloHit(player);
        this.rayoHit(player);
    }
    else
    {
        this.animations.play('dead');
        this.body.enable = false;
    }
}

Boss.prototype.hieloHit = function (player) 
{
    var esto = this;
    this.bolahielo.bullets.forEach(function (bullet) {
        if(esto.game.physics.arcade.collide(bullet, player)) {
            bullet.kill();
            if(!player.invincible)
                player.col(esto);
        }
    }
    );
} 
Boss.prototype.col = function(sword)
{
    if (sword.attacking)
    {
        if (sword.dmg -this.resistencia <= 0)
        {
            this.knock(sword,0.1,200);
        }
        else
        {
        this.knock(sword, (sword.dmg-this.resistencia),200);
        }
        this.invincible = true;
        this.alpha = 0.5;
        this.hurt.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {this.invincible = false; this.alpha = 1;}, this);
    }
}
Boss.prototype.rayoHit = function (player) 
{
    var esto = this;
    this.rayo.bullets.forEach(function (bullet) {
        if(esto.game.physics.arcade.collide(bullet, player)) {
            bullet.kill();
            if(!player.invincible)
                player.col(esto);
        }
    }
    );
} 
module.exports = Boss;