import Player from "./player";
import Pot from "./pot";
import StarBurst from "./starburst";
import WeezardSpawn from "./weezard_spawn";
import BatSwarm from "./bat_swarm";
import JumpPoint from "./jump_point";

const colors = { pot0: "0x55b700", pot1: "0xffbf00", pot2: "0xff0000", pot3: "0x01156D"};

class Game extends Phaser.Scene {
  constructor () {
    super({ key: 'game' })
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
    this.jumpsLayer = this.tileMap.getObjectLayer('jumppoints');

   // this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platform.setCollisionByExclusion([-1]);

    this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
    this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);
    this.player = new Player(this, 200, 200, 0);
    this.weezardSpawn = new WeezardSpawn(this);
    this.physics.world.enable([ this.player ]);
    this.colliderActivated = true;
    this.jumpGroup = this.add.group()
    this.turnGroup = this.add.group()
    this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);

    this.physics.add.collider(this.player, this.weezardSpawn.weezards, this.hitPlayer, ()=>{
      return this.colliderActivated;
    }, this);

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 250);

    this.hearts = this.add.image(this.width - 100, 20, "heart").setScale(0.9).setOrigin(0.5).setScrollFactor(0),
    this.heartsText = this.add.bitmapText(this.width - 60, 45, "wizardFont", this.player.health, 22).setOrigin(0.5).setScrollFactor(0)

    this.loadAudios();
    this.addObjects();
    this.addPots();
    this.addMirror();
    this.weezardSpawn.generate();
    this.addJumpPoints();
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
      "inception": this.sound.add("inception")
    };
  }

  addMirror() {
    this.mirror = this.add.sprite(this.width - 100 , 75, "mirror").setOrigin(0.5).setAlpha(0);
    this.anims.create({
        key: "mirror",
        frames: this.anims.generateFrameNumbers("mirror", { start: 0, end: 14 }),
        frameRate: 2,
        repeat: -1
    });
  }

  playAudio(key) {
    this.audios[key].play();
  }

  hitFloor () {
    this.player.hitFloor();
  }

  hitPlayer () {
    this.player.hitPlayer();
    if (this.player.health === 0) {
      console.log("GAME OVER")
    } 
  }

  updateHealth() {
    this.heartsText.setText(this.player.health);
    this.tweens.add({
      targets: this.hearts,
      scale: { from: 0.5, to: 1},
      duration: 100,
      alpha: { from: 0, to: 1},
      repeat: 10,
      yoyo: true,
      onComplete: () => {
        this.hearts.setAlpha(1)
        this.hearts.setScale(0.9)
    },
    });
  }


  addObjects () {
    this.potGroup = this.add.group()
    this.objectsLayer.objects.forEach( object => {
      this.potGroup.add(new Pot(this, object.x, object.y, object.name, colors[object.name]))
    })
    this.overlap = this.physics.add.overlap(this.player, this.potGroup, this.pick);
  }

  addJumpPoints() {
    this.jumpsLayer.objects.forEach( object => {
      if (object.name === "jump")
        this.jumpGroup.add(new JumpPoint(this, object.x, object.y))
      if (object.name === "turn")
        this.turnGroup.add(new JumpPoint(this, object.x, object.y))
    })
    this.jumpOverlap = this.physics.add.overlap(this.weezardSpawn.weezards, this.jumpGroup, this.jumpWeezard.bind(this));
    this.turnOverlap = this.physics.add.overlap(this.weezardSpawn.weezards, this.turnGroup, this.turnWeezard.bind(this));
  }

  jumpWeezard (weezard, point) {
    point.body.enable = false;
    if (Phaser.Math.Between(0, 3) > 2) weezard.jumpPoint()
    this.time.delayedCall(3000, () => {  point.body.enable = true; })
  }

  turnWeezard (weezard, point) {
    point.body.enable = false;
    weezard.turn()
    this.time.delayedCall(1000, () => {  point.body.enable = true; })
  }

  addPots () {
    this.potScore = {};
    Array(5).fill(0).forEach((e, i) => {
      this.potScore[`pot${i}`] = {
        score: 0,
        x: 15 + (i * 100),
        y: 20,
        color: colors[i],
        image: this.add.image(15 + (i * 100), 20, `pot${i}`).setScale(0.7).setOrigin(0.5).setScrollFactor(0),
        text: this.add.bitmapText(50 + (i * 100), 45, "wizardFont", "0", 22).setOrigin(0.5).setScrollFactor(0)
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

  applyPot(pot) {
    console.log("Apply pot: ", pot.name);
    switch (pot.name) {
        case "pot0":
          this.player.startFloat()
          this.time.delayedCall(6000, () => this.player.stopFloat(), null, this);
          break;
        case "pot1":          
          new BatSwarm(this, this.player.x, this.player.y)
          this.weezardSpawn.batSwarm();          
          this.time.delayedCall(6000, () => this.weezardSpawn.stopEscape(), null, this);
          break;
        case "pot2":
          this.player.startInvincible()
          this.time.delayedCall(6000, () => this.player.stopInvincible(), null, this);
          break;
        case "pot3":
          this.weezardSpawn.freeze();
          this.time.delayedCall(4000, () => this.weezardSpawn.unfreeze(), null, this);
          break;
        case "pot4":
          this.inception();
          this.time.delayedCall(20000, () => this.inception(3.14, 0), null, this);
            break;
        default: break;
    }
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
  }

  inception (from = 0, to = 3.14) {
    this.playAudio("inception")
    this.tweens.add({
      targets: this.cameras.main,
      rotation: { from , to },
      duration: 10000,
    });
  }
}

export default Game;
