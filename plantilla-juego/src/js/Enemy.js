'use strict';
var Character = require('./Character.js');
var HealthBar = require('./HealthBar.js');

function Enemy(game, speed, x, y, spritename, audio, audioAttack,salud,dmg)
{
    Character.call(this,game,speed,x,y,spritename, audio);
    this.game = game;
    this.salud = 100;
    this.dmg = dmg;
    this.resistencia = salud;
    this.attacking = false;
    this.attackAudio = this.game.add.audio(audioAttack);
    this.config = {x: 0, y: 0, width: 60, height: 7};
    this.myHealthBar = new HealthBar(this.game, this.config);
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;


//Carga las animaciones básicas de todos los enemigos y las específicas del esqueleto
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
    this.reviving = false;
    this.tackling = false;
}

//Sitúa al enemigo en su pose básica
Enemy.prototype.setIdle = function()
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.animations.play('idle');
}

//Mueve al enemigo a las coordenadas indicadas de acuerdo a su velocidad
Enemy.prototype.MoveTo = function(x, y){

    var angle = Math.atan2(y - this.y, x - this.x);

   this.body.velocity.x = Math.cos(angle) * this.speed;
   this.body.velocity.y = Math.sin(angle) * this.speed;

    return angle;

}

//Propiedad única del esqueleto, padre del resto de enemigos
//Carga un ataque quedándose quieto y apunta a la dirección en la que está mirando
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

//Función única del esqueleto, realiza un dash en la direcciónq ue está mirando e impide cualquier
//otro tipo de movimiento
Enemy.prototype.tackle = function()
{
    this.attackAudio.play();
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

//Según la dirección a la que se encuentre el jugador, selecciona una de las animaciones del enemigo
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

//Update propio del esqueleto, actualiza su barra de vida y si detecta al jugador se mueve hacia él
//Si está muy cerca realizará un placaje.
Enemy.prototype.update = function(playerx, playery)
{
    this.myHealthBar.setPosition(this.x, this.y-30);
    this.myHealthBar.setPercent(this.salud);
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
            if (dist > 40)
                {
                this.MoveTo(playerx, playery);
                }
                this.detectAnimation(playerx, playery);
            }
        }
        else if (dist >= 200)
        {
            this.setIdle();
        }
    }
    //propiedad del esqueleto, revive al cabo de 50 segundos tras morir
    else if (!this.reviving)
    {
        this.body.enable = false;
        this.play('dead');
        this.reviving = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 50, function() {this.body.enable = true;this.salud = 100;}, this);
    }
}

//Función común a todos los enemigos, si detectan una de las armas del jugador atacando
//son empujados y reciben daño, addemás son inmovilizados.
Enemy.prototype.col = function(sword)
{
    if (sword.attacking)
    {
        this.knock(sword, (sword.dmg-this.resistencia),200);
        this.invincible = true;
        this.alpha = 0.5;
        this.hurt.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {this.invincible = false; this.alpha = 1;}, this);
    }
}
module.exports = Enemy;
