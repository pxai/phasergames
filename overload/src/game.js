import Block from "./block";
import Player from "./player";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      
      this.addLands();
      this.addPlayer();
      //this.loadAudios(); 
      // this.playMusic();
    }

    addLands () {
      this.shots = this.add.group();
      this.breakableBlocks = this.add.group();
      this.blocks = this.add.group();
      for (let i = 0; i < 16; i++) {
        let block1 = new Block(this, i * 64, 64, Phaser.Math.Between(0, 1), true)
        let block2 = new Block(this, i * 64, 700, Phaser.Math.Between(0, 1), true)
        this.blocks.add(block1)
        this.blocks.add(block2);
      }

      this.physics.add.overlap(this.shots, this.breakableBlocks, this.shotBlock, ()=>{
        return true;
      }, this);

    }

    shotBlock(shot, block) {
      console.log("Hit block")
      shot.destroy();
      block.destroy();
    }

    addPlayer () {
      this.player = new Player(this, 200, 200, "player");
      this.physics.add.collider(this.player, this.breakableBlocks, this.crashPlayer, ()=>{
        return true;
      }, this);
    }

      loadAudios () {
        this.audios = {
          "beam": this.sound.add("beam"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="game") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    update() {
      this.player.update();
    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
