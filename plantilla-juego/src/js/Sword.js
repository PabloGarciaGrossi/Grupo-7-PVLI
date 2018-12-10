'use strict';
var Character = require('./Character.js');

function Sword(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.rot = 100;
    this.attacking = false;
}
Sword.prototype = Object.create(Character.prototype);
Sword.prototype.constructor = Sword;

Sword.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('slashdown', [0,1,2,3,4,5,6,7],8,false);
    this.animations.add('slashup', [8,9,10,11,12,13,14,15],8,false);
    this.animations.add('slashright', [16,17,18,19,20,21,22,23],8,false);
    this.animations.add('slashleft', [24,25,26,27,28,29,30,31],8,false);
    this.slashAnim = this.animations.add('slash', [0,1,2,3,4,5,6],7,false);
    this. anchor.setTo(0.5,0.5);
}

Sword.prototype.startAttack = function(dir)
{
    this.direction = dir;
    switch(dir){
        case 0:
            this.animations.play('slashdown');
            this.y = 0;
            this.x = 0;
            break;
        case 1:
            this.animations.play('slashleft');
            this.x = -10;
            this.y = 0;
            break;
        case 2:
            this.animations.play('slashup');
            this.y = -17;
            this.x = -6;
            break;
        case 3:
            this.animations.play('slashright');
            this.y = 0;
            this.x = 10;
            break;
    }
}

Sword.prototype.stopAttack = function(player)
{
    this.rotation = 0;
    player.attacking = false;
}

Sword.prototype.update = function(player)
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}
module.exports = Sword;