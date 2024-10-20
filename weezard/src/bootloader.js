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

    this.load.bitmapFont("wizardFont", "assets/fonts/wizard.png", "assets/fonts/wizard.xml");

    this.load.on('complete', () => {
      this.scene.start('splash')
    })

    this.load.image('heart', './assets/images/heart.png');
    this.load.image('star', './assets/images/star.png');
    this.load.image('logopx', 'assets/images/logopx.png');
    this.load.spritesheet('wizard', './assets/images/wizard.png',{ frameWidth: 32, frameHeight: 64 })
    this.load.spritesheet('mirror', './assets/images/mirror.png',{ frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('bat', './assets/images/bat.png',{ frameWidth: 32, frameHeight: 32 })
    Array(5).fill(0).forEach((e, i) => { this.load.spritesheet(`pot${i}`, `./assets/images/pot${i}.png`,{ frameWidth: 40, frameHeight: 40 });})
    this.load.audio('ground', './assets/sounds/ground.mp3');
    this.load.audio('jump', './assets/sounds/jump.mp3');
    this.load.audio('pick', './assets/sounds/pick.mp3');
    this.load.audio('cast1', './assets/sounds/cast1.mp3');
    this.load.audio('cast2', './assets/sounds/cast2.mp3');
    this.load.audio('inception', './assets/sounds/inception.mp3');
    this.load.audio('appear', './assets/sounds/appear.mp3');
    this.load.audio('hit', './assets/sounds/hit.mp3');
    this.load.audio('foejump', './assets/sounds/foejump.mp3');
    this.load.audio('gameover', './assets/sounds/gameover.mp3');
    this.load.audio('boom', './assets/sounds/boom.mp3');
    this.load.audio('intro', './assets/sounds/intro.mp3');
    this.load.audio('muzik', './assets/sounds/muzik.mp3');
    this.load.image('grass_tileset', 'assets/maps/grass.png');
    this.load.image('weezard_tileset_bg', 'assets/maps/weezard_tileset_bg.png');
    this.load.image('weezard_tileset_fg', 'assets/maps/weezard_tileset_fg.png');
    // Array(1).fill(0).forEach((e, i) => {this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`); })
    this.load.tilemapTiledJSON(`scene0`, `assets/maps/weezard.json`);
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
