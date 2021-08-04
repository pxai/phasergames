export default class Bootloader extends Phaser.Scene {
  constructor() {
      super({key: "bootloader"})
  }

  preload (){
        this.load.image('sky', 'assets/images/starfield.png')
        this.load.image('ground', 'assets/images/platform.png')
        this.load.image('star', 'assets/images/star.png')
        this.load.image('bomb', 'assets/images/bomb.png');
        this.load.spritesheet('grogu', 'assets/images/grogu.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('fullscreen', 'assets/ui/sky.png', { frameWidth: 64, frameHeight: 64 });
        this.load.audio("music", "assets/sounds/muzik.mp3");
  }

  create () {
      this.scene.start("splash")
  }
   
}
