'use strict';

  var PlayScene = {
  create: function () {
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
    var TextoSouls = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY-150,'titlesouls');
    TextoSouls.anchor.setTo(0.5, 0.5);
    TextoSouls.scale.setTo(2.5,2.5);
  },
 /* update: function() {
    this.TextoSouls.angle += 0.5;
  },*/
};
module.exports = PlayScene;
