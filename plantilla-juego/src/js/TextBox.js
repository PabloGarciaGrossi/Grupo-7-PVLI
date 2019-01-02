'use strict'
function TextBox(game, x, y, spritename, text) 
{
    Phaser.Sprite.call(this, game, x, y, spritename)
    this.anchor.setTo(0.5,0.5);
    this.txt = text;
}

TextBox.prototype = Object.create(Phaser.Sprite.prototype);
TextBox.prototype.constructor = TextBox;

TextBox.prototype.show = function() 
{
    if (this.msgBox) {
        this.msgBox.destroy();
    }
    //make a group to hold all the elements
    var msgBox = this.game.add.group();
    //make the back of the message box
    var back = this.game.add.sprite(0, 0, this.spritename);
    //make a text field
    var text1 = this.game.add.text(0, 0, this.txt);
    //set the textfeild to wrap if the text is too long
    text1.wordWrap = true;
    //make the width of the wrap 90% of the width 
    //of the message box
    text1.wordWrapWidth = 400 * .9;
    //set the width and height passed
    //in the parameters
    back.width = 400;
    back.height = 300;
    //add the elements to the group
    msgBox.add(back);
    msgBox.add(text1);
    //set the message box in the center of the screen
    msgBox.x = game.width / 2 - msgBox.width / 2;
    msgBox.y = game.height / 2 - msgBox.height / 2;
    //set the text in the middle of the message box
    text1.x = back.width / 2 - text1.width / 2;
    text1.y = back.height / 2 - text1.height / 2;
    //make a state reference to the messsage box
    this.msgBox = msgBox;
    this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {this.msgBox.destroy()}, this);
}

TextBox.prototype.update = function() {}

module.exports = TextBox;
