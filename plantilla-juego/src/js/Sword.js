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
    this.animations.add('slash', [0,1,2,3,4,5,6],7,false);
    this.slashAnim = this.animations.add('slash', [0,1,2,3,4,5,6],7,false);
    this. anchor.setTo(0.5,0.5);
}

Sword.prototype.startAttack = function(dir)
{
    this.direction = dir;
    switch(dir){
        case 0:
            this.scale.setTo(1, 1);
            this.y = 25;
            this.x = 0;
            break;
        case 1:
            this.scale.setTo(1, -1);
            this.x = -25;
            this.y = 0;
            break;
        case 2:
            this.scale.setTo(-1, -1);
            this.y = -25;
            this.x = 0;
            break;
        case 3:
            this.scale.setTo(-1, 1);
            this.y = 0;
            this.x = 25;
            break;
    }
    this.animations.play('slash');
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