'use strict'

var MainMenu = {

    create:function () {

        var background;
        background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menu');
        background.anchor.setTo(0.5,0.5);
        this.game.musica = this.game.add.sound('musicmenu');
        if(this.game.musicaplaying) {
            this.game.musica.play();
            this.game.musicaplaying = false;
        }
        
        this.createButton(this.game, this.game.world.centerX, this.game.world.centerY - 10, 300, 50,
            function(){
                this.state.start('cueva');
                this.game.musica.stop();
        });
        this.createButton(this.game, this.game.world.centerX, this.game.world.centerY + 80, 300, 50,
            function(){
                this.state.start('levels');
        });
        this.createButton(this.game, this.game.world.centerX, this.game.world.centerY + 170, 300, 50,
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