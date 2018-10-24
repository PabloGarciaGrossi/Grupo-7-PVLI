'use strict';
var map;
var layer;
  var PlayScene = {
  create: function () {
    map = this.add.tilemap('map',32,32);
    map.addTilesetImage('tileset');
    layer = map.createLayer(0);
    layer.resizeWorld();
    map.setCollisionBetween(16,24);
   /* var monedo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'monedo');
    monedo.anchor.setTo(0,0);
    monedo.scale.setTo(1,1);*/
   /* var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);*/
    function coso(sprite,speed){
      this.sprite = sprite;
      this.velocity = speed;
    }
    coso.prototype.moveY = function(speed)
    {
      this.sprite.y += speed;
    }
    coso.prototype.moveX = function(speed)
    {
      this.sprite.x += speed;
    }
    this.hero = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player',5);
    this.hero.animations.add('idle', [17],1,true);
    this.TextoSouls = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'titlesouls');
    this.TextoSouls.anchor.setTo(0.5, 0.5);
    this.TextoSouls.scale.setTo(2.5,2.5);
    this.cosa = new coso(this.TextoSouls, 15);
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },

  update: function() {
    this.cosa.sprite.rotation += 0.01;
    if (this.cursors.left.isDown)
    {
      this.cosa.moveX(-this.cosa.velocity);
    }
    else if (this.cursors.right.isDown)
    {
      this.cosa.moveX(this.cosa.velocity);
    }

    if (this.cursors.up.isDown)
    {
      this.cosa.moveY(-this.cosa.velocity);
    }
    else if (this.cursors.down.isDown)
    {
      this.cosa.moveY(this.cosa.velocity);
    }

    console.log(this.TextoSouls);
  }
};
module.exports = PlayScene;
