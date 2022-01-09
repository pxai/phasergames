class Bootloader extends Phaser.Scene {
  constructor () {
    super({ key: 'bootloader' })
  }

  preload () {

    this.load.bitmapFont("mario", "assets/fonts/mario.png", "assets/fonts/mario.xml");

    this.load.on('complete', () => {
      this.scene.start('game')
    })


    this.load.image('logo', 'assets/images/logo.png');

    this.load.spritesheet('player', './assets/images/player.png',{ frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('coin', './assets/images/coin.png',{ frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('foe0', './assets/images/foe.png',{ frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('plenny', './assets/images/plenny.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.audio('jump', './assets/sounds/jump.mp3');
    this.load.audio('coin', './assets/sounds/coin.mp3');
    this.load.audio('powerup', './assets/sounds/powerup.mp3');
    this.load.audio('death', './assets/sounds/death.mp3');
    this.load.audio('bump', './assets/sounds/bump.mp3');
    this.load.audio('shrink', './assets/sounds/shrink.mp3');
    this.load.audio('theme', './assets/sounds/theme.mp3');
    this.load.image('brick', 'assets/maps/brick.png');
 
    this.load.image('background', 'assets/maps/background.png');
     this.load.tilemapTiledJSON(`dasher`, `assets/maps/dasher.json`);
  }
}

export default Bootloader
