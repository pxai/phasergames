import Phaser from 'phaser'
import Bootloader from './bootloader'
import Splash from './splash';
import Intro from './intro';
import Game from './game'

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
        debug: true
    }
},
  scene: [
    Bootloader,
    Splash,
    Intro,
    Game,
  ]
}

new Phaser.Game(config)