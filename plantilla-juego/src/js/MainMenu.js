'use strict'

var MainMenu = {

    create:function (game) {

        var titlescreen;
        var music;

        music = game.sound.play('musicmenu');

        
        this.createButton(game, game.world.centerX, game.world.centerY + 150, 300, 100,
        function(){
            this.state.start('play');
        });

        titlescreen = game.add.sprite(game.world.centerX, game.world.centerY, 'menu');
        titlescreen.anchor.setTo(0.5,0.5);
        
    },

    update:function (game) {


    },

    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'button', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;

    }



};
module.exports = MainMenu;