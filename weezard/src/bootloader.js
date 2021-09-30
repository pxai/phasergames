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
    this.load.image('pellopx', './assets/images/pellopx.png')
    this.load.image('splash', './assets/images/splash.png')
    this.load.image('devil', './assets/images/devil.png')
    this.load.spritesheet('ghost', './assets/images/ghost.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('beer', './assets/images/beer.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('coin', './assets/images/coin.png',{ frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('player', './assets/images/player.png',{ frameWidth: 32, frameHeight: 64 })
    
    Array(4).fill(0).forEach((e, i) => { this.load.audio(`step${i}`, `./assets/sounds/step${i}.mp3`);})
    Array(3).fill(0).forEach((e, i) => { this.load.audio(`muzik${i}`, `./assets/sounds/muzik${i}.mp3`);})
    Array(5).fill(0).forEach((e, i) => { this.load.audio(`spooky${i}`, `./assets/sounds/spooky${i}.mp3`);})
    Array(4).fill(0).forEach((e, i) => { this.load.audio(`thunder${i}`, `./assets/sounds/thunder${i}.mp3`);})
    this.load.audio('door', './assets/sounds/door.mp3');
    this.load.audio('zx', './assets/sounds/zx.mp3');
    this.load.audio('key', './assets/sounds/key.mp3');
    this.load.audio('beer', './assets/sounds/beer.mp3');
    this.load.audio('coin', './assets/sounds/coin.mp3');
    this.load.audio('hit', './assets/sounds/hit.mp3');

    this.load.image('spooky_tileset', 'assets/maps/spooky_tileset.png');
    Array(4).fill(0).forEach((e, i) => {this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`); })
    
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
