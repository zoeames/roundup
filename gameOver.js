var gameOverState = {preload: preload, create: create};

function preload(){
  game.load.image('overBg', '/assets/over/overBg.png');
  game.load.image('playAgain', '/assets/over/playAgain.png');
}

function create(){
  game.add.sprite('0', '0', 'overBg');

  var playAgain = game.add.button(230, 150, 'playAgain', restartGame);

  var text = game.add.text('340', '50', 'Game Over');
  var text = game.add.text('340', '80', 'Score: ' + score);
}

function restartGame (){
  score = 0;
  countDown = 30;
  game.state.start('menu');
}
