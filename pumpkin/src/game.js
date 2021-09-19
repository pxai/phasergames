import Player from "./player";
import GhostGenerator from "./ghost_generator";
import BeerGenerator from "./beer_generator";
import Lights from "./lights";
import Key from "./key";
import CustomPipeline from "./glow";

class Game extends Phaser.Scene {
  constructor (key) {
    super({ key: "game" })
  }

  init (data) {
    this.index = data.index;
    this.scenes = data.scenes;
  }

  create () {
    this.hearts = [];

    console.log("game started")
    this.score = 0
    this.width = this.sys.game.config.width
    this.height = this.sys.game.config.height
    this.center_width = this.width / 2
    this.center_height = this.height / 2

    this.titleText = this.add.bitmapText(this.center_width, 40, "wizardFont", this.scenes[this.index].name, 20).setTint(0x902406).setOrigin(0.5)
    this.tileMap = this.make.tilemap({ key: this.scenes[this.index].map , tileWidth: 16, tileHeight: 16 });
    this.tileSet = this.tileMap.addTilesetImage(this.scenes[this.index].tileset);

    this.tileMap.createLayer('background', this.tileSet);
    this.platform = this.tileMap.createLayer('platform', this.tileSet);
    this.objects = this.tileMap.createLayer('objects', this.tileSet);

    this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platformHighTop = this.tileMap.createLayer('platformhightop', this.tileSet);
    this.platform.setCollisionByExclusion([-1]);
    this.player = new Player(this, 150, this.height-400, 'player');
    this.platformHigh = this.tileMap.createLayer('platformhigh', this.tileSet);

    // this.physics.world.enable([ this.player ]);
    this.physics.add.collider(this.player, this.platform);
  
    this.objects = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
  
    this.foes = this.physics.add.group({
      allowGravity: false,
      mass: 0,
      immovable: false
    })

    this.tileMap.getObjectLayer('objects').objects.forEach((object) => {
      const objectRectangle = this.objects.create(object.x, object.y, 'player').setScale(0.3).setOrigin(0.5);
      objectRectangle.name = object.name;
      objectRectangle.body.setSize(object.width, object.height);
    });

    this.physics.add.collider(this.player, this.objects, this.objectHit, null, this)
    this.lightsOut = this.add.rectangle(0, 40, this.width, this.height - 50, 0x0).setOrigin(0)
    this.lightsOut.setAlpha(0);
    this.updateHearts();
    this.addKey();
    this.ghostGenerator = new GhostGenerator(this);
    this.ghostGenerator.generate();
    this.beerGenerator = new BeerGenerator(this);
    this.beerGenerator.generate();
    this.lights = new Lights(this);
    this.physics.add.overlap(this.player, this.foes, this.foeHit, null, this)
    this.loadAudios();
    this.playMusic();
  }
  
  objectHit (player, object) {
    console.log("Hit with object: ", object);
    if (object.name === "door" && this.player.hasKey) {
      this.loadNext();
    } else if (object.name === "door" && !this.player.hasKey) {
      this.needTheKey = this.add.bitmapText(this.center_width, 60, "wizardFont", "You need the key!!", 15).setTint(0x902406).setOrigin(0.5)
    }
  } 

  foeHit (player, foe) {
    console.log("Hit by FOEEEEEE: ", foe);
    this.foes.remove(foe)
    this.lives = +this.registry.get("lives");
    this.lives--;
    this.registry.set("lives", this.lives);
    this.updateHearts();
    if (this.lives === 0) this.isDead();
  } 
  
  recover (player) {
    this.lives = +this.registry.get("lives");
    this.lives++;
    this.registry.set("lives", this.lives);
    this.updateHearts();
  } 

  update(){
    this.player.update();
    this.ghostGenerator.update();
    this.lights.update();
  }

  addKey () {
    const {x, y} = this.scenes[this.index].key;
    this.key = new Key(this, x, y,"key");
  }

  isDead () {
    this.scene.start("game_over", {index: this.index, scenes: this.scenes });
  }

  loadNext(sceneName) {
    console.log("Loading next! ");
    this.tweens.add({ targets: this.theme, volume: 0, duration: 1000 });
    //this.theme.stop();
    if (this.scenes[this.index].name === "End") {
      this.scene.start("outro", {index: this.index, scenes: this.scenes });
    } else {
      this.scene.start("transition", {index: this.index, scenes: this.scenes });
    }
  }

  updateHearts() {
    this.hearts.forEach(heart => {
      heart.destroy();
      heart = null;
    });

    Array(+this.registry.get("lives")).fill(0).forEach( (heart, i) => {
      this.hearts.push(this.add.image(20 + (30 * i), 20, "heart1").setOrigin(0.5));
    })
  }

  loadAudios () {
    this.audios = {
      "step0": this.sound.add("step0"),
      "step1": this.sound.add("step1"),
      "step2": this.sound.add("step2"),
      "step3": this.sound.add("step3"),
    };
  }


  playMusic (theme="muzik0") {
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

  playAudio(key) {
    this.audios[key].play();
  }

  playStep(key) {
    this.audios[key].play({
      rate: Phaser.Math.Between(1, 1.5),
      detune: Phaser.Math.Between(-1000, 1000),
      delay: 0
    });
  }
}

export default Game
