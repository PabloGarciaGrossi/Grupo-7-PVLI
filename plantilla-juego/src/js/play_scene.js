'use strict';
  var PlayScene = {
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('map',32,32);
    this.map.addTilesetImage('tileset');
    this.map.setCollisionBetween(0,23);
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();
    this.layer.debug = true;
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
    function Player(sprite,speed)
    {
      this.sprite = sprite;
      this.speed = speed;
      this.direction = 0;
      //this.cursors = this.game.input.keyboard.createCursorKeys();
    }
    Player.prototype.moveY = function(speed)
    {
      this.sprite.body.velocity.y = speed;
    }
    Player.prototype.moveX = function(speed)
    {
      this.sprite.body.velocity.x = speed;
    }
    /*coso.prototype.moveY = function(speed)
    {
      this.sprite.y += speed;
    }
    coso.prototype.moveX = function(speed)
    {
      this.sprite.x += speed;
    }*/
    this.hero = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player',5);
    this.hero.anchor.setTo(0.5, 0.5);
    this.hero.animations.add('idle', [17],1,true);
    this.hero.animations.add('runleft', [0,1,2,3,4,5,6,7],8,true);
    this.hero.animations.add('runright', [8,9,10,11,12,13,14,15],8,true);
    this.hero.animations.add('rundown', [16,17,18,19,20,21,22,23],8,true);
    this.hero.animations.add('runup', [24,25,26,27,28,29,30,31],8,true);
    this.physics.arcade.enable(this.hero);
    this.camera.follow(this.hero);
    this.TextoSouls = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'titlesouls');
    this.TextoSouls.anchor.setTo(0.5, 0.5);
    this.TextoSouls.scale.setTo(2.5,2.5);
    //this.cosa = new coso(this.hero, 15);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.playerino = new Player(this.hero,15);
    this.game.physics.enable([this.hero]);
   // this.game.physics.arcade.gravity.y = 250;
    this.hero.body.collideWorldBounds = true;
    this.hero.body.bounce.set(0.2);
  },

  update: function() {
    this.physics.arcade.collide(this.hero,this.layer);

    //this.cosa.sprite.rotation += 0.01;
    if (this.cursors.left.isDown)
    {
      this.playerino.moveX(-100);
      this.hero.animations.play('runleft');
    }
    else if (this.cursors.right.isDown)
    {
      this.playerino.moveX(100);
      this.hero.animations.play('runright');
    }
    else if (this.cursors.up.isDown)
    {
      this.playerino.moveY(-100);
      this.hero.animations.play('runup');
    }
    else if (this.cursors.down.isDown)
    {
      this.playerino.moveY(100);
      this.hero.animations.play('rundown');
    }
    else{
      this.playerino.sprite.body.velocity.x= 0;
      this.playerino.sprite.body.velocity.y= 0;
    }

    console.log(this.TextoSouls);
  }
};
module.exports = PlayScene;
