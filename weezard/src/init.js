import Phaser from 'phaser'
import Bootloader from './bootloader'
import Splash from './splash';
import Intro from './intro';
import Game from './game'
import Outro from './outro';
import GameOver from './game_over';

const config = {
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false,
  parent: 'contenedor',
  physics: {
    default: "arcade",
    arcade: {
        gravity: { y: 350 },
        debug: false
    }
},
  scene: [
    Bootloader,
    Splash,
    Intro,
    Game,
    Outro,
    GameOver
  ]
}

new Phaser.Game(config)