import FoeGenerator from "./foe_generator";
import ObstacleGenerator from "./obstacle_generator";
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
      this.addScenario();
      this.addFoes();
      this.addPlayer();
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -300, -50);
      //this.loadAudios(); 
      //this.playMusic();
    }

    addScenario () {
      this.background = this.add.tileSprite(0, 0, 0, 0, "road").setOrigin(0).setScrollFactor(0, 1);
      this.trees = this.add.group();
      this.obstacles = this.add.group();
    }

    addFoes () {
      this.foes = this.add.group();
      this.foeGenerator = new FoeGenerator(this);
      this.obstacleGenerator = new ObstacleGenerator(this)
    }

    addPlayer() {
      this.thrust = this.add.layer();
      this.player = new Player(this, 50, this.center_height)

      this.physics.add.collider(this.player, this.foes, this.hitFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.trees, this.hitTree, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, ()=>{
        return true;
      }, this);
    }

    hitFoe (player, foe) {
      if (player.jumping) return;
      player.destroy();
      foe.destroy();
    }

    hitTree (player, tree) {
      if (player.jumping) return;
      player.destroy();
    }

    hitObstacle (player, obstacle) {
      if (player.jumping) return;
      player.destroy();
      obstacle.destroy();
    }

      loadAudios () {
        this.audios = {
          "beam": this.sound.add("beam"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="music") {
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
      this.background.setTilePosition(this.cameras.main.scrollX);
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
