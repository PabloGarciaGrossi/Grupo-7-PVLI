'use strict'
function TextBox(game, text) 
{
    Phaser.Sprite.call(this, game, 0, 0, 'textbox');
    this.txt = text;
    this.width = this.game.camera.width;
    this.height = this.game.camera.height/3;
}

TextBox.prototype = Object.create(Phaser.Sprite.prototype);
TextBox.prototype.constructor = TextBox;

TextBox.prototype.create = function() 
{
    var esto = this;
    this.game.add.existing(this);
    var style = { font: "32px Arial", wordWrap: true, wordWrapWidth: esto.width, align: "left"};

    this.texto = this.game.add.text(0, 0, esto.txt, style);
    this.texto.anchor.x = 0.5;
    this.texto.anchor.y = 0.5;
    this.alpha = 0;
    this.texto.alpha = 0;
}

TextBox.prototype.show = function() {
    this.alpha = 1;
    this.texto.alpha = 1;
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {this.alpha = 0; this.texto.alpha = 0;}, this);
}

TextBox.prototype.update = function() {
    this.x = this.game.camera.x;
    this.y = this.game.camera.y + (this.game.camera.height/3)*2;
    this.texto.x = this.x+100;
    this.texto.y = this.y+50;
}

module.exports = TextBox;
