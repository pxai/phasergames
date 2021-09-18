class Bootloader extends Phaser.Scene {
  constructor () {
    super({ key: 'bootloader' })
  }

  preload () {
    this.load.bitmapFont('squareFont', './assets/fonts/square.png', './assets/fonts/square.xml')

    this.load.on('complete', () => {
      this.scene.start('game')
    })

    this.load.image('ball', './assets/images/ball.png')
    this.load.audio('pong', './assets/sounds/pong.mp3')

    this.load.image('tileset', 'assets/maps/tileset.png');
    this.load.tilemapTiledJSON('scene1', 'assets/maps/scene1.json');


    this.registry.set('ballSpeed', 2)
    this.registry.set('paddleSpeed', 3)
    this.registry.set('winScore', 2)
    this.load.image("player", './assets/images/ninjosu.png')
  }
}

export default Bootloader
