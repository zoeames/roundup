var game = new Phaser.Game(800, 600, Phaser.AUTO, 'roundup');

game.state.add('menu', menuState);
game.state.add('game', gameState);
game.state.add('gameMale', gameMaleState);
game.state.add('gameFemale', gameFemaleState);
game.state.start('menu');
