import { Debris } from "./particle";

export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cameras.main.setBackgroundColor(0x000000);
    this.showInstructions()
    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    this.playMusic();
    this.showTitle();
  }

  startGame() {
    if (this.theme) this.theme.stop();
    this.playMusic("music")
    this.scene.start("game", {
      number: 0,
    });
  }

  /*
    Helper function to show the title letter by letter
    */
  showTitle() {

    let text = this.add
      .bitmapText(this.center_width, 200, "hammerfont", "SLINGSHOT", 170)
      .setTint(0xca6702)
      .setOrigin(0.5)
      .setDropShadow(4, 6, 0xf09937, 0.9);
  }

  /*
    Helper function to play audio randomly to add variety.
    */
  playAudioRandomly(key) {
    const volume = Phaser.Math.Between(0.8, 1);
    const rate = 1;
    this.sound.add(key).play({ volume, rate });
  }

  playMusic(theme = "splash") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.4,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
    Generates the instructions text for the player.
    */
  showInstructions() {
    this.add
      .bitmapText(this.center_width, 450, "pixelFont", "Use the mouse", 30)
      .setOrigin(0.5);
    this.add
      .sprite(this.center_width - 120, 520, "pello")
      .setOrigin(0.5)
      .setScale(0.3);
    this.add
      .bitmapText(this.center_width + 40, 520, "pixelFont", "By PELLO", 15)
      .setOrigin(0.5);
    this.space = this.add
      .bitmapText(
        this.center_width,
        670,
        "pixelFont",
        "Click here to Start.",
        30
      )
      .setOrigin(0.5);
      this.input.on('pointerdown', (pointer) => this.startGame(), this);
    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }
}
