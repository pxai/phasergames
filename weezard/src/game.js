import Player from "./player";
import Pot from "./pot";

class Game extends Phaser.Scene {
  constructor () {
    super({ key: 'game' })
  }

  preload () {

  }

  create () {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.player = new Player(this, 200, 200);
    this.pot = new Pot(this, 300, this.height - 50, "pot0")
  }

  update () {
   this.player.update()
  }
}

export default Game;
