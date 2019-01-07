'use strict'

var MenuControles = {

    create:function (game) {

        var background;
        background = game.add.sprite(game.world.centerX, game.world.centerY, 'menucontroles');
        background.anchor.setTo(0.5,0.5);
        game.musica = game.add.sound('musicmenu');
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
module.exports = MenuControles;