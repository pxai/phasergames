export default class Bootloader extends Phaser.Scene {
  constructor() {
      super({key: "bootloader"})
  }

  preload (){
      this.createBars();

      this.load.on(
        'progress',
        function (value) {
          this.progressBar.clear();
          this.progressBar.fillStyle(0x125555, 1);
          this.progressBar.fillRect(
            this.cameras.main.width / 4,
            this.cameras.main.height / 2 - 16,
            (this.cameras.main.width / 2) * value,
            16
          );
        },
        this
    );
    this.load.on('complete', () => {
              this.scene.start('splash');
          },
          this
      );
    // http://www.stripegenerator.com/
        this.load.image('ground', 'assets/images/platform.png')
        this.load.image('bean', 'assets/images/star.png')
        this.load.image('bomb', 'assets/images/bomb.png');
        this.load.spritesheet('scene1', 'assets/images/scene1.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('grogu', 'assets/images/grogu.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('fullscreen', 'assets/ui/sky.png', { frameWidth: 64, frameHeight: 64 });
        this.load.audio("music", "assets/sounds/muzik.mp3");


        this.load.tilemapTiledJSON("scene1_map", 'assets/scenes/scene1/leafs.json');
        this.load.image("scene1_tileset", 'assets/scenes/scene1/leafs.png');
  }

  create () {
      // this.scene.start("splash")
  }

  createBars() {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0xffffff, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
}
   
}
