import Phaser from 'phaser'
import Bootloader from './bootloader'
import Game from './game'
import Transition from './transition'
import Intro from './intro'
import Outro from './outro'
import GameOver from './game_over'
import Homage from './homage'
import Splash from './splash'

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
    Transition,
    Intro,
    Outro,
    GameOver,
    Homage,
    Splash
  ]
}

new Phaser.Game(config)