import Phaser from 'phaser'
import Bootloader from './bootloader'
import Splash from './splash'
import Stage1 from './scenes/stage1'


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
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: [
        Bootloader,
        Splash,
        Stage1
    ]
}

const game = new Phaser.Game(config);
