var playerChoice = false;
var menuState = {preload: preload, create: create};

function preload(){
  game.load.image('menuBg', '/assets/menu/menuBackground.png');
  game.load.image('Male', '/assets/menu/chooseMale.png');
  game.load.image('Female', '/assets/menu/chooseFemale.png')
}

function create(){
  game.add.sprite('0', '0', 'menuBg');

  var buttonMale = game.add.button('20', '155', 'Male', maleChosen);
  var buttonFemale = game.add.button('420', '150', 'Female', femaleChosen);

  var text = game.add.text('304', '50', 'Gender Roundup');
  var text = game.add.text('178', '480', 'Boys Chase Girls Chase Boys')
}

function maleChosen(){
  playerChoice = false;
  game.state.start('gameMale');
}

function femaleChosen(){
  playerChoice = true;
  game.state.start('gameFemale');
}
