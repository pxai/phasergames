import Phaser from 'phaser'
import Bootloader from './bootloader'
import Game from './game'

const config = {
  width: 800,
  height: 500,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false,
  parent: 'contenedor',
  physics: {
    default: 'arcade',
    gravity: { y: 10 },
    debug: true
  },
  scene: [
    Bootloader,
    Game,
  ]
}

new Phaser.Game(config)