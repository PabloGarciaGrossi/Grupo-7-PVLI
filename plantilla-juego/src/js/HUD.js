'use strict';
var HealthBar = require('./HealthBar.js');
function HUD(game,x,y,spritename)
{
    Phaser.Sprite.call(this, game, x, y, spritename)
    this.game = game;
}
HUD.prototype = Object.create(Phaser.Sprite.prototype);
HUD.prototype.constructor = HUD;

HUD.prototype.create = function()
{
    this.estus = this.game.add.sprite(100, 100, 'estus');
    this.estus.scale.setTo(0.3,0.3);
    this.cross = this.game.add.sprite(140,120,'cross');
    this.cross.scale.setTo(0.05,0.05);
    this.barconfig = {x: 200, y: 50};
    this.staminaconfig = {x: 162, y: 75, width: 175, height: 15};
    this.stamina = new HealthBar(this.game, staminaconfig);
    this.health = new HealthBar(this.game, barconfig);
    this.health.setFixedToCamera(true);
    this.stamina.setFixedToCamera(true);
    this.estus.fixedToCamera = true;
    this.cross.fixedToCamera = true;
}

HUD.prototype.update(player)
{
    this.stamina.setPercent(player.stamina);
    this.health.setPercent(player.salud);
}
module.exports = HUD;