'use strict';

  var PlayScene = {
  create: function () {
    var monedo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'monedo');
    monedo.anchor.setTo(0,0);
    monedo.scale.setTo(1,1);
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
    function coso(sprite){
      this.sprite = sprite;
    }
    this.TextoSouls = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'titlesouls');
    this.TextoSouls.anchor.setTo(0.5, 0.5);
    this.TextoSouls.scale.setTo(2.5,2.5);
    this.cosa = new coso(this.TextoSouls);
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },

  update: function() {
    this.cosa.sprite.rotation += 0.2;
    
    if (this.cursors.left.isDown)
    {
      this.cosa.sprite.x -= 40;
    }
    else if (this.cursors.right.isDown)
    {
      this.cosa.sprite.x += 40;
    }

    if (this.cursors.up.isDown)
    {
      this.cosa.sprite.y -= 40;
    }
    else if (this.cursors.down.isDown)
    {
      this.cosa.sprite.y += 40;
    }

    console.log(this.TextoSouls);
  }
};
module.exports = PlayScene;
