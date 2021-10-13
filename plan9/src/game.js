import Player from "./player";
import Ufo from "./ufo";
import Tile from "./tile";
import Button from "./button";

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
    this.selectedTile = null;

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
    this.loadButtons();
    this.loadUfos()
   
  }

  update () {
    // this.player.update()
  }

  loadMap() {
    /*this.add.image(290, 200, "2");
    this.add.image(195, 200, "2");
    this.add.image(100, 200, "2");
    this.add.image(145, 250, "2");
    this.add.image(245, 250, "2");*/


    Array(15).fill(0).forEach( (e, i) => {
      Array(15).fill(0).forEach( (a, j) => {
        let offset = (i % 2 === 0)? 0: 33;
        new Tile(this, 200 + (j * 64) + offset, 200 + (i * 40), "3");
      })
    })

  }

  loadButtons () {
    this.addButton = new Button(this, this.center_width - 128, this.height - 164, "add", 1);
    this.del = new Button(this, this.center_width - 128, this.height - 96, "del", 1);
    this.move = new Button(this, this.center_width, this.height - 128, "move");
    this.attack = new Button(this, this.center_width + 128, this.height - 128, "attack");
    this.cancel = new Button(this, this.center_width + 256, this.height - 128, "cancel");
  }

  changeSelection (tile) {
    if (this.selectedTile) { this.selectedTile.unSelect(); }
    this.selectedTile = tile;
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
