import Player from "./player";
import Pot from "./pot";
import StarBurst from "./starburst";
import WeezardSpawn from "./weezard_spawn";

const colors = { pot0: "0x55b700", pot1: "0xffbf00", pot2: "0xff0000", pot3: "0x01156D"};

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
    this.currentPot = "pot0";
    this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 32, tileHeight: 32 });
    this.tileSet = this.tileMap.addTilesetImage("grass_tileset");
    this.platform = this.tileMap.createLayer('scene0', this.tileSet);
    this.objectsLayer = this.tileMap.getObjectLayer('objects');

   // this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platform.setCollisionByExclusion([-1]);


    this.player = new Player(this, 200, 200, 0);
    this.weezardSpawn = new WeezardSpawn(this);
    this.physics.world.enable([ this.player ]);
    this.colliderActivated = true;
    this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);
    this.physics.add.collider(this.player, this.weezardSpawn.weezards, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);
    this.loadAudios();
    this.addObjects();
    this.addPots();
    this.weezardSpawn.generate();
  }

  update () {
    this.player.update()
    this.weezardSpawn.update();
  }

  loadAudios () {
    this.audios = {
      "jump": this.sound.add("jump"),
      "ground": this.sound.add("ground"),
      "pick": this.sound.add("pick"),
      "cast1": this.sound.add("cast1"),
      "cast2": this.sound.add("cast2"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  hitFloor () {
    this.player.hitFloor();
  }

  addObjects () {
    this.potGroup = this.add.group()
    this.objectsLayer.objects.forEach( object => {
      this.potGroup.add(new Pot(this, object.x, object.y, object.name, colors[object.name]))
    })
    this.overlap = this.physics.add.overlap(this.player, this.potGroup, this.pick);
  }

  addPots () {
    this.potScore = {};
    Array(4).fill(0).forEach((e, i) => {
      this.potScore[`pot${i}`] = {
        score: 0,
        x: 15 + (i * 100),
        y: 20,
        color: colors[i],
        image: this.add.image(15 + (i * 100), 20, `pot${i}`).setScale(0.7).setOrigin(0.5),
        text: this.add.bitmapText(50 + (i * 100), 45, "wizardFont", "0", 22).setOrigin(0.5)
      }
    })
  }

  addPot(pot) {
    this.potScore[pot.name].score++;
    this.potScore[pot.name].text.setText(this.potScore[pot.name].score);
    this.player.pots.push(pot);
    const previous = this.currentPot;
    this.currentPot = pot.name;
    this.changeSelectedPot(previous, this.currentPot)
  }

  changeSelectedPot(previous, current) {
        this.potScore[previous].image.setScale(0.7)
        this.potScore[previous].text.setScale(1)
    
        if (current !== "") {
          this.potScore[current].image.setScale(0.9)
          this.potScore[current].text.setScale(1.2)
        }
  }

  removePot(pot) {
    this.potScore[pot.name].score--;
    this.potScore[pot.name].text.setText(this.potScore[pot.name].score);
  }

  pick (player, pot) {
    pot.body.enable = false;
    player.scene.playAudio("pick")
    this.starBurst = new StarBurst(pot.scene, pot.x, pot.y);
    player.scene.tweens.add({
      targets: pot,
      alpha: 0.3,
      angle: 720,
      x: player.scene.potScore[pot.name].x,
      y: 20,
      scaleX: 0.5,
      scaleY: 0.5,
      ease: 'Linear',
      duration: 500,
      onComplete: () => {
          player.scene.addPot(pot);
          pot.disable();
          
      },
    });
    console.log("yeah");
}
}

export default Game;
