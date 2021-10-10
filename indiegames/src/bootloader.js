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
            this.progressBar.fillStyle(0x7500ba, 1);
            this.progressBar.fillRect(
                this.cameras.main.width / 4,
                this.cameras.main.height / 2 - 16,
                (this.cameras.main.width / 2) * value,
                16
            );
        },
        this
    );

    this.load.bitmapFont("mario", "assets/fonts/mario.png", "assets/fonts/mario.xml");

    this.load.on('complete', () => {
      this.scene.start('game')
    })

    this.load.image('logopx', 'assets/images/logopx.png');
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('galaga', 'assets/images/galaga.png');
    this.load.image('canvashowto', 'assets/images/canvashowto.png');
    this.load.image('alvamajo', 'assets/images/alvamajo.png');
    this.load.spritesheet('player', './assets/images/player.png',{ frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('coin', './assets/images/coin.png',{ frameWidth: 64, frameHeight: 64 })

    this.load.audio('jump', './assets/sounds/jump.mp3');
    this.load.audio('coin', './assets/sounds/coin.mp3');

    this.load.image('brick', 'assets/maps/brick.png');
 
    this.load.image('background', 'assets/maps/background.png');
     this.load.tilemapTiledJSON(`indie`, `assets/maps/indie.json`);
  }

  createBars () {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0x420069, 1);
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
