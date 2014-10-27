var cursors;
var gameState = {preload: preload, create: create, update: update};
var jumpButton;
var platforms;
var player;
var ground;
function preload(){
  game.load.spritesheet('malePlayer', 'assets/mains/guyHero.png', 64, 64, 177);
  game.load.spritesheet('femaleHero', 'assets/mains/ladyHero.png', 64, 64);
  game.load.spritesheet('uglyGirl', 'assets/variants/fugly_female.png', 64, 64);
  game.load.spritesheet('hotGirl', 'assets/variants/hot_female.png', 64, 64);
  game.load.spritesheet('uglyGuy', 'assets/variants/uglyman.png', 64, 64);
  game.load.spritesheet('hotGuy', 'assets/variants/hotguy.png', 64, 64);
}
function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //var playerbmd = game.add.bitmapData(32, 32);
  //playerbmd.ctx.rect(0, 0, 32, 32);
  //playerbmd.ctx.fillStyle = "#0f0";
  //playerbmd.ctx.fill();
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'malePlayer');
  player.animations.add('right', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);
  player.animations.add('left', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
  player.animations.add('still', [130, 131, 132, 133, 134, 135, 136, 137, 138], 10, true);

  var enemybmd = game.add.bitmapData(32, 32);
  enemybmd.ctx.rect(0, 0, 32, 32);
  enemybmd.ctx.fillStyle = "#ada";
  enemybmd.ctx.fill();

  var platformbmd = game.add.bitmapData(80, 16);
  platformbmd.ctx.rect(0, 0, 80, 16);
  platformbmd.ctx.fillStyle = "#f8a34b";
  platformbmd.ctx.fill();

  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.set(0.5, 0.5);
  player.body.collideWorldBounds = true;
  player.body.gravity.y = 900;
  platforms = game.add.group();
  platforms.enableBody = true;
  platforms.physicsBodyType = Phaser.Physics.ARCADE;
  platforms.createMultiple(7, platformbmd);
  platforms.forEach(function(p){
    var x = Math.floor(Math.random()*720) + 1;
    var y = Math.floor(Math.random()*504) + 96;
    p.reset(x, y);
    p.body.immovable = true;
  }, this);
  ground = platforms.create(0, game.world.height - 64, platformbmd);
  ground.scale.setTo(12, 4);
  ground.body.immovable = true;
  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.createMultiple(6, enemybmd);
  enemies.forEach(function(e){
    var x = Math.floor(Math.random()*720) + 1;
    var y = Math.floor(Math.random()*472) + 128;
    e.reset(x, y);
    e.body.collideWorldBounds  = true;
    e.body.gravity.y = 900;
  }, this);
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}
function update(){
  game.physics.arcade.collide(player, ground);
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(enemies, ground);
  game.physics.arcade.collide(enemies, platforms);
  movePlayer();
}
function movePlayer(){
  player.body.velocity.x = 0;
  if(cursors.left.isDown){
    player.scale.x = -1;
    player.body.velocity.x = -150;
    player.animations.play('left');
    if(jumpButton.isDown && player.body.touching.down){
      player.body.velocity.y = -550;
      //jumpTimer = game.time.now + 750;
    }
  }else if(cursors.right.isDown){
    player.body.velocity.x = 150;
    player.animations.play('right');
    if(jumpButton.isDown && player.body.touching.down){
      player.body.velocity.y = -550;
      //jumpTimer = game.time.now + 750;
    }
  }else if(jumpButton.isDown && player.body.touching.down){
    player.body.velocity.y = -550;
  }else{
    player.animations.stop();
    player.frame = 78;
  }
}
