'use strict'

var MenuLevels = {

    create:function (game) {

        var background;
        background = game.add.sprite(game.world.centerX, game.world.centerY, 'menulevels');
        background.anchor.setTo(0.5,0.5);
        this.createButton(game, game.world.centerX - 250, game.world.centerY - 100, 200, 200,
            function(){
                game.musica.stop();
                this.state.start('cueva');
        });
        this.createButton(game, game.world.centerX, game.world.centerY - 100, 200, 200,
            function(){
                game.musica.stop();
                this.state.start('bosque');    
        });
        this.createButton(game, game.world.centerX + 250, game.world.centerY - 100, 200, 200,
            function(){
                game.musica.stop();
                this.state.start('play');
        });
        this.createButton(game, 120, game.world.centerY + 240, 150, 50,
            function(){
                this.state.start('mainmenu');
        });
        
    },

    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'vacio', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;

    }

};
module.exports = MenuLevels;