import Letter from "./letter";

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
      console.log("Hello?")
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      
     /* this.tileMap = this.make.tilemap({ key: "scene" , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("brick");
      this.tileMap.createLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("brick");
      this.platform = this.tileMap.createLayer('scene', this.tileSet);
  
      this.objectsLayer = this.tileMap.getObjectLayer('objects');*/
      // this.activators = this.tileMap.getObjectLayer('activate');
      this.letter = new Letter(this, 200, 200, "A")
      //this.loadAudios(); 
      // this.playMusic();
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
