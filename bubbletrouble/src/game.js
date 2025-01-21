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
      this.gameLayer = this.add.layer();
      this.tvLayer = this.add.layer();

      this.cameras.main.setBackgroundColor(0x62a2bf); //(0x00b140)//(0x62a2bf)
      this.add.tileSprite(0, 1000, 1024 * 10, 512, "landscape").setOrigin(0.5);
      this.createMap();
      //this.loadAudios();
      // this.playMusic();
      this.addTvEffect()
    }

    addTvEffect (lineSpacing = 4, color = 0x000000, alpha = 1) {
      for (let y = 0; y < this.scale.height; y += lineSpacing) {
          this.tvLayer.add(this.add.rectangle(this.center_width, y, this.scale.width, 1, color).setAlpha(alpha));
      }
    }

    createMap() {
      this.tileMap = this.make.tilemap({
        key: "scene" + this.number,
        tileWidth: 64,
        tileHeight: 64,
      });
      this.tileSetBg = this.tileMap.addTilesetImage("background");

      this.gameLayer.add(this.tileMap.createLayer("background", this.tileSetBg));

      this.tileSet = this.tileMap.addTilesetImage("softbricks");

      this.platform = this.tileMap.createLayer(
        "scene" + this.number,
        this.tileSet
      );

      this.gameLayer.add(this.platform);

      this.objectsLayer = this.tileMap.getObjectLayer("objects");

      //this.gameLayer.add(this.objectsLayer);

      this.platform.setCollisionByExclusion([-1]);
      this.addsObjects()
    }

    addsObjects() {
      this.objectsLayer.objects.forEach((object) => {
        if (object.name === "text") {
          this.add
            .bitmapText(object.x, object.y, "pixelFont", object.text.text, 30)
            .setDropShadow(2, 4, 0x222222, 0.9)
            .setOrigin(0);
        }
      });
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
