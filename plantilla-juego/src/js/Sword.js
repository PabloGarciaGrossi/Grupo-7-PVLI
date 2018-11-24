'use strict';
var Character = require('./Character.js');

function Sword(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.direction = 0;
    this.rot = 1;
}
Sword.prototype = Object.create(Character.prototype);
Sword.prototype.constructor = Enemy;

Sword.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.slashAnim = this.animations.add('slash', [6,0,1,2,3,4,5],7,false);
    this.slashAnim.onStart.add(function(){slash.visible = true}, this);
    this.slashAnim.onComplete.add(function () {slash.visible = false}, this);
    this. anchor.setTo(0.5,0.5);
}

Sword.prototype.startAttack() = function(dir)
{
    this.direction = dir;
    switch(this.direction)
    {
        case 0:
            this.angle = 45;
            break;
        case 1:
            this.angle = 135;
            break;
        case 2:
            this.angle = 225;
            break;
        case 3:
            this.angle = 315;
            break;
    }
    this.rotation = this.rot;
    this.animations.play('slash');
}

Sword.prototype.stopAttack() = function()
{
    this.rotation = 0;
}
module.exports = Sword;