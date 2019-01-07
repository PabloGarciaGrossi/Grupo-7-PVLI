'use strict'

var MainMenu = {

    create:function (game) {

        var background;
        background = game.add.sprite(game.world.centerX, game.world.centerY, 'menu');
        background.anchor.setTo(0.5,0.5);
        game.musica = game.add.sound('musicmenu');
        if(game.musicaplaying) {
            game.musica.play();
            game.musicaplaying = false;
        }
        
        this.createButton(game, game.world.centerX, game.world.centerY - 10, 300, 50,
            function(){
                this.state.start('cueva');
                game.musica.stop();
        });
        this.createButton(game, game.world.centerX, game.world.centerY + 80, 300, 50,
            function(){
                this.state.start('levels');
        });
        this.createButton(game, game.world.centerX, game.world.centerY + 170, 300, 50,
            function(){
                this.state.start('controles');
        });
        
    },

    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'vacio', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;
    }

};
module.exports = MainMenu;