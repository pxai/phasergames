import { Scene, Actions, Math, Tilemaps, GameObjects, Time , Sound} from 'phaser';
import Player from './Player';
import CrystalGenerator from './CystalGenerator';
import Flag from './Flag';
import Duck from './Crystal';

export class Game extends Scene {
  private width: number;
  private height: number;
  private center_width: number;
  private center_height: number;
  private player: Player;
  private crystalGenerator: CrystalGenerator;
  private name: string;
  private number: number;
    private tileMap!: Tilemaps.Tilemap;
    private tileSet!: Tilemaps.Tileset;
    private platform!: Tilemaps.TilemapLayer;
    private border!: Tilemaps.TilemapLayer;
  private flag: Flag;
  private shipCountText: GameObjects.BitmapText;
  private shipCount: number = 0;
  private audios: Record<string, Sound.BaseSound>;

  constructor() {
    super('Game');
  }

  init(data: any) {
    this.name = data.name;
    this.number = data.number || 0;
    this.seconds = data.seconds || 30;
  }

  preload() {
    console.log("Starting scene: " + this.number)
  }

  create() {
    this.width = Number(this.sys.game.config.width);
    this.height = Number(this.sys.game.config.height);
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(0x000000) //0xfef1ca
    this.crystalGenerator = new CrystalGenerator(this);
    this.createMap();
    this.addShipCount();
    this.loadAudios();
    this.transition();
    if (this.number === 0) this.addTutorial();
    this.addScanlines();

    //this.input.keyboard.on("keydown-SPACE", this.finishScene, this);
    this.addCollissions();
  }

  addShipCount() {
    this.add.sprite(128, 32, "sheep").setScale(0.8)
    this.shipCountText = this.add.bitmapText(128 + 42, 32, "default", "0", 30).setOrigin(0.5).setTint(0xfffd00).setDropShadow(3, 4, 0xb95e00, 0.7);
    this.shipCount = 0;
  }


  addScanlines() {
    for (let y = 0; y < this.height; y += 4) {
      let line = this.add.rectangle(this.center_width, y, this.width, 2, 0x000000)
      line.alpha = 1;
      line.depth = 1000;
    }
  }

  createMap() {
    this.tileMap = this.make.tilemap({ key: "scene" + this.number, tileWidth: 64, tileHeight: 64 });
    console.log("tileMap: ", typeof this.tileMap)
    const tileSetBg = this.tileMap.addTilesetImage("grasstileset");
    //this.tileMap.createStaticLayer('background', this.tileSetBg).setPipeline('Light2D');

    this.tileSet = this.tileMap.addTilesetImage("grasstileset");
    this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet)
    this.border = this.tileMap.createLayer('border', this.tileSet)
    const objectsLayer = this.tileMap.getObjectLayer('objects');
    this.border.setCollisionByExclusion([-1]);
    this.platform.setCollisionByExclusion([-1]);


    objectsLayer.objects.forEach(object => {
      if (object.name.startsWith("flag")) {
        this.flag = new Flag(this, object.x + 32, object.y);
      }

      if (object.name.startsWith("sheep")) {
        this.crystalGenerator.spawn(object.x + 16, object.y + 32);
      }

      if (object.name.startsWith("doge")) {
        this.player = new Player(this, object.x + 32, object.y + 32);
      }

    //  if (object.name.startsWith("duck")) {
      //  this.ducks.add(new Duck(this, object.x, object.y));
      //}

    });

  }

  addCollissions() {
    this.physics.add.overlap(this.player, this.crystalGenerator.crystals, this.frighten, () => {
      return true;
    }, this);


    this.physics.add.collider(this.player, this.border, this.hitBorder, () => {
      return true;
    }, this);

    this.physics.add.collider(this.crystalGenerator.crystals, this.border, this.hitBorder, () => {
      return true;
    }, this);

  }

  frighten(doge: Doge, sheep: Sheep) {

  }

  hitFlag(sheep: Sheep, flag: Flag) {
    if (sheep.touched) return;
    console.log("Sheep touched the flag: ", sheep, flag)
    sheep.setTouched();
    this.updateShipCount();
    this.playRandom(`sheep${Math.Between(0, 2)}`)
    this.checkSceneEnd();
  }

  hitBorder(somebody: Doge | Sheep, border: any) {

  }

  turnDuck(duck: Duck, border: any) {
    duck.turn();
  }

  sheepHitDuck(sheep: Sheep, duck: Duck) {
    sheep.walk(Math.RND.pick(["left", "right", "up", "down"]))
    duck.turn();
    this.playRandom(`duck${Math.Between(0, 2)}`)
  }

  checkSceneEnd() {
    if (this.herd.totalShip == this.shipCount) {
      console.log("Scene over!!")
      this.finishScene();
    } else {
      this.updateTimer(5);
    }
  }

  updateShipCount() {
    this.shipCount++;
    this.shipCountText.setText(`${this.shipCount}`);
    this.tweens.add({
      targets: [this.shipCountText],
      duration: 200,
      alpha: { from: 0.6, to: 1 },
      repeat: 2
    })
  }

  updateTimer(qty: number = -1) {
    this.seconds = this.seconds + qty;
    this.secondsText.setText(`${this.seconds}`);
    this.tweens.add({
      targets: [this.shipCountText],
      duration: 200,
      alpha: { from: 0.6, to: 1 },
      repeat: 2
    })
    if (this.seconds === 0) {
      this.timer.remove()
      this.gameOver();
    }
  }

  gameOver() {
    this.playAudio("duck1")
    this.showResult("You Failed!", "Bad doge...")
    this.cameras.main.shake(30);
    this.input.on('pointerdown', () => this.restartScene(), this);
  }

  showResult(word1: string, word2: string) {
    const winText1 = this.add.bitmapText(this.center_width, this.center_height - 96, "default", word1, 64).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 2, 0xb95e00, 0.7);
    const winText2 = this.add.bitmapText(this.center_width, this.center_height + 96, "default", word2, 64).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 2, 0xb95e00, 0.7);

    this.add.bitmapText(this.center_width, this.center_height + 256, "default", "Click to continue", 32).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 2, 0xb95e00, 0.7);
  }

  restartScene() {
    this.scene.start("Transition", { next: "underwater", name: "STAGE", number: this.number, seconds: 30 })
  }

  addTutorial() {

    const tutorial1 = this.add.bitmapText(this.center_width, this.center_height + 128, "default", "Use the mouse/finger!", 36).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 2, 0xb95e00, 0.7);
    const tutorial2 = this.add.bitmapText(this.center_width, this.center_height + 196, "default", "Push each sheep to the flag", 36).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 2, 0xb95e00, 0.7);
    this.time.delayedCall(4000, () => { tutorial1.destroy(); tutorial2.destroy() }, null, this);
  }

  finishScene() {
    this.bark();
    this.timer.remove();
    this.player.block();
    this.showResult("Stage", "Clear!")
    const previousScore = +this.registry.get("score");
    this.registry.set("score", previousScore + this.seconds)
    //this.player.anims.play("playerwin", true);
    //this.playAudio("yee-haw");
    //this.playAudio("win");
    //this.theme.stop();
    this.input.on('pointerdown', () => this.scene.start("Transition", { seconds: 20, name: "STAGE", number: this.number + 1 }), this);
  }

  bark() {
    const barkSound = this.sound.add("bark");

    barkSound.once("complete", () => {
      barkSound.play({ volume: 0.5 });
    });

    // 3. Reproducimos el primer ladrido
    barkSound.play({ volume: 0.5 })
  }


  transition() {
    const blocks = this.add.group({ key: 'blackblock', repeat: 63 });

    blocks.getChildren().forEach((child: any) => {
      child.setOrigin(0, 0);
    });

    Actions.GridAlign(blocks.getChildren(), {
      width: 8,
      cellWidth: 128,
      cellHeight: 128,
      x: 0,
      y: 0
    });

    let i = 0;

    blocks.getChildren().forEach((child: Phaser.GameObjects.GameObject) => {
      this.tweens.add({
        targets: child,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        y: '+=64',
        angle: 180,
        ease: 'Power3',
        duration: 500,
        delay: 200 + (i * 30)
      });

      i++;

      if (i % 8 === 0) {
        i = 0;
      }
    });
  }

  loadAudios() {
    this.audios = {
      "duck0": this.sound.add("duck0"),
      "duck1": this.sound.add("duck1"),
      "duck2": this.sound.add("duck2"),
      "sheep0": this.sound.add("sheep0"),
      "sheep1": this.sound.add("sheep1"),
      "sheep2": this.sound.add("sheep2"),
      "bark": this.sound.add("bark"),
    };
  }

  playAudio(key) {
    this.audios[key].play({
      volume: 0.5,
    });
  }

  playRandom(key: string, volume = 1) {
    this.audios[key].play({
      rate: Math.FloatBetween(1, 1.3),
      detune: Math.Between(-200, 200),
      delay: 0,
      volume: Math.FloatBetween(0.5, 0.9) * volume
    });
  }

}
