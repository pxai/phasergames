import Figure from "./figure";
import Enemy from "./enemy";

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
      
      this.addKeys();

      this.addFigure();
      this.addEnemy();
      this.addColliders();
      //this.loadAudios(); 
      // this.playMusic();
    }

    addFigure() {
      this.figures = this.add.group();

      this.figure = new Figure(this, this.center_width, this.center_height + 128);
    }

    addEnemy() {
      this.enemies = this.add.group();
      this.enemy = new Enemy(this, this.center_width, this.center_height - 128);
    }

    addColliders () {


    /*  this.physics.add.collider(this.figures, this.figures, (obj) => {

    });*/

      this.physics.add.collider(this.figure.blocks, this.enemy.blocks, (obj) => {
       
        console.log("Collision!! ", obj)
      });
    }

    hitFigures (figure1, figure2) {

    }

    hitEnemies(figure, enemy) {
      console.log("HIT enemy! ", figure, enemy)
      //figure.freeze();
      enemy.setTint(0x00ff00)
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

    addKeys () {
      this.cursor = this.input.keyboard.createCursorKeys();
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
      if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        this.resolve();
      }

      if (Phaser.Input.Keyboard.JustDown(this.cursor.down) || Phaser.Input.Keyboard.JustDown(this.S)) {
        this.figure.turn();
      } else if (Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) {
        console.log("Up!")
        this.figure.up();
      } else if (Phaser.Input.Keyboard.JustDown(this.cursor.right) || Phaser.Input.Keyboard.JustDown(this.D)) {
        this.figure.right();
      } else if (Phaser.Input.Keyboard.JustDown(this.cursor.left) || Phaser.Input.Keyboard.JustDown(this.A)) {
        this.figure.left();
      } 


    }

    resolve () {

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
