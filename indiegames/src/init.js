import Phaser from 'phaser'
import Bootloader from './bootloader'
import Game from './game'


const config = {
  width: 1200,
  height: 1000,
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
    Game,
  ]
}

new Phaser.Game(config)