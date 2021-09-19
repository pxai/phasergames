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

    this.load.on('complete', () => {
      this.scene.start('homage')
    })

    this.load.image('zx', './assets/images/zx.png')
    this.load.image('heart1', './assets/images/heart1.png')
    this.load.image('heart2', './assets/images/heart2.png')
    this.load.image('key', './assets/images/key.png')
    this.load.spritesheet('ghost', './assets/images/ghost.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('beer', './assets/images/beer.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('player', './assets/images/player.png',{ frameWidth: 32, frameHeight: 64 })
    
    this.load.audio('step0', './assets/sounds/step0.mp3');
    this.load.audio('step1', './assets/sounds/step1.mp3');
    this.load.audio('step2', './assets/sounds/step2.mp3');
    this.load.audio('step3', './assets/sounds/step3.mp3');
    this.load.audio('door', './assets/sounds/door.mp3');
    this.load.audio('muzik0', './assets/sounds/muzik0.mp3');
    this.load.audio('muzik1', './assets/sounds/muzik1.mp3');
    this.load.audio('muzik2', './assets/sounds/muzik2.mp3');
    this.load.audio('spooky0', './assets/sounds/spooky0.mp3');
    this.load.audio('spooky1', './assets/sounds/spooky1.mp3');
    this.load.audio('spooky2', './assets/sounds/spooky2.mp3');
    this.load.audio('spooky3', './assets/sounds/spooky3.mp3');
    this.load.audio('spooky4', './assets/sounds/spooky4.mp3');
    this.load.audio('zx', './assets/sounds/zx.mp3');
    this.load.image('tileset', 'assets/maps/tileset.png');
    this.load.tilemapTiledJSON('scene1', 'assets/maps/scene1.json');

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
