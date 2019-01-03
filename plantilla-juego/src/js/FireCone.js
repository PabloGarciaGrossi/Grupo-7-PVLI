'use strict';
var Character = require('./Character.js');
function FireCone(game, speed, x, y, spritename)
{
    Character.call(this,game,speed,x,y,spritename);
    this.game = game;
    this.attacking = false;
}
FireCone.prototype = Object.create(Character.prototype);
FireCone.prototype.constructor = FireCone;

FireCone.prototype.create = function()
{
    this.game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;
    this.animations.add('fire', [0,1,2,3,4,5,6,7,8,9],10,false);
    this. anchor.setTo(0.5,0.5);
    this.body.setSize(0,0);
}

FireCone.prototype.startAttack = function(dir)
{
    this.body.setSize(84,61);
    this.direction = dir;
    this.animations.play('fire',30);
    switch(dir){
        case 0:
            this.y = 50;
            this.x = 0;
            this.rotation = 140;
            break;
        case 1:
            this.x = -60;
            this.y = 0;
            this.rotation = 85;
            break;
        case 2:
            this.y = -65;
            this.x = 0;
            this.rotation = 30;
            break;
        case 3:
            this.y = 0;
            this.x = 60;
            this.rotation = 0;
            break;
    }
}
FireCone.prototype.stopAttack = function(player)
{
    player.attacking = false;
}
FireCone.prototype.update = function()
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}
module.exports = FireCone;