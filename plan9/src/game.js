import Player from "./player";
import Ufo from "./ufo";

class Game extends Phaser.Scene {
  constructor () {
    super({ key: 'game' })
  }

  create () {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cursors = this.input.keyboard.createCursorKeys();

   /* this.controlConfig = {
        camera: this.cameras.main,
        left: this.cursors.left,
        right: this.cursors.right,
        up: this.cursors.up,
        down: this.cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(this.controlConfig);
*/

    this.loadMap()
    this.loadUfos()
   
  }

  update () {
    // this.player.update()
  }

  loadMap() {
    this.add.image(290, 200, "2");
    this.add.image(195, 200, "2");
    this.add.image(100, 200, "2");
    this.add.image(145, 250, "2");
    this.add.image(245, 250, "2");
  }


  loadUfos() {
    new Ufo(this, 400, 300)
  }

  loadAudios () {
    this.audios = {
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

 

}

export default Game;
