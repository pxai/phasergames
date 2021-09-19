import scenes from "./scenes";

class Bootloader extends Phaser.Scene {
  constructor () {
    super({ key: 'bootloader' })
  }

  preload () {
    this.createBars();
    this.load.on(
        "progress",
        function (value) {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xdc5914, 1);
            this.progressBar.fillRect(
                this.cameras.main.width / 4,
                this.cameras.main.height / 2 - 16,
                (this.cameras.main.width / 2) * value,
                16
            );
        },
        this
    );

    this.load.bitmapFont("pixelFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
    this.load.bitmapFont("wizardFont", "assets/fonts/wizard.png", "assets/fonts/wizard.xml");
    this.load.bitmapFont("zxFont", "assets/fonts/zx.png", "assets/fonts/zx.xml");

    this.prepareScenes();

    this.load.on('complete', () => {
      this.scene.start('homage', {index: -1, scenes: this.scenes })
    })

    this.load.image('zx', './assets/images/zx.png')
    this.load.image('heart1', './assets/images/heart1.png')
    this.load.image('heart2', './assets/images/heart2.png')
    this.load.image('key', './assets/images/key.png')
    this.load.spritesheet('ghost', './assets/images/ghost.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('beer', './assets/images/beer.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('player', './assets/images/player.png',{ frameWidth: 32, frameHeight: 64 })
    this.load.audio('pong', './assets/sounds/pong.mp3')

    this.load.image('tileset', 'assets/maps/tileset.png');
    this.load.tilemapTiledJSON('scene1', 'assets/maps/scene1.json');


    this.registry.set('lives', 7)
  }

  prepareScenes () {
    this.scenes = [ 
      scenes[0], 
      ...scenes.slice(1,scenes.length - 2).sort(() => 0.5 - Math.random()),
      scenes[scenes.length - 1]
    ];
    console.log(this.scenes)
  } 


  createBars () {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0x902406, 1);
    this.loadBar.fillRect(
        this.cameras.main.width / 4 - 2,
        this.cameras.main.height / 2 - 18,
        this.cameras.main.width / 2 + 4,
        20
    );
    this.progressBar = this.add.graphics();
}
}

export default Bootloader
