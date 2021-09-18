import scenes from "./scenes";

class Bootloader extends Phaser.Scene {
  constructor () {
    super({ key: 'bootloader' })
  }

  preload () {
    this.load.bitmapFont("pixelFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
    this.load.bitmapFont("wizardFont", "assets/fonts/wizard.png", "assets/fonts/wizard.xml");

    this.prepareScenes();

    this.load.on('complete', () => {
      this.scene.start('transition', {index: -1, scenes: this.scenes })
    })


    this.load.image('heart1', './assets/images/heart1.png')
    this.load.image('heart2', './assets/images/heart2.png')
    this.load.spritesheet('ghost', './assets/images/ghost.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('beer', './assets/images/beer.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.audio('pong', './assets/sounds/pong.mp3')

    this.load.image('tileset', 'assets/maps/tileset.png');
    this.load.tilemapTiledJSON('scene1', 'assets/maps/scene1.json');


    this.registry.set('lives', 7)
    this.load.image("player", './assets/images/ninjosu.png')
  }

  prepareScenes () {
    this.scenes = [ 
      scenes[0], 
      ...scenes.slice(1,scenes.length - 2).sort(() => 0.5 - Math.random()),
      scenes[scenes.length - 1]
    ];
    console.log(this.scenes)
  } 
}

export default Bootloader
