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

  //  this.load.bitmapFont("wizardFont", "assets/fonts/wizard.png", "assets/fonts/wizard.xml");

    this.load.on('complete', () => {
      this.scene.start('game')
    })

    this.load.image('star', './assets/images/star.png');

    this.load.spritesheet('wizard', './assets/images/wizard.png',{ frameWidth: 32, frameHeight: 64 })
    Array(1).fill(0).forEach((e, i) => { this.load.spritesheet(`pot${i}`, `./assets/images/pot${i}.png`,{ frameWidth: 40, frameHeight: 40 });})
    //  this.load.audio('hit', './assets/sounds/hit.mp3');

    // this.load.image('spooky_tileset', 'assets/maps/spooky_tileset.png');
    // Array(4).fill(0).forEach((e, i) => {this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`); })
    
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
