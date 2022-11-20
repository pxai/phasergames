import { Particle, Debris, Dust } from "./particle";
import Ghost from "./ghost";
import Bat from "./bat";
import Sky from "./sky";

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
      this.score = 0;
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;

      this.cameras.main.setBackgroundColor(0x006fb1);
     // this.rt = this.add.renderTexture(0, 0, 800, 600);
      this.lines = this.add.group();
      this.loadAudios(); 
      this.cloudLayer = this.add.layer();    
      this.pointer = this.input.activePointer;
      this.trailLayer = this.add.layer();

      this.addSky();
      this.addMap();
      this.addBasket();
      this.addBall();
      this.showStage();
      this.showHits();
      this.finished = false;    
       this.physics.world.on('worldbounds', this.onWorldBounds.bind(this));
       this.ready = true;
       //this.input.keyboard.on("keydown-SPACE", () => this.finishScene(), this); // TODO REMOVE
       this.playAudio("start", 0.5)
    }

    addSky() {
      this.sky = new Sky(this);
  }

    addBasket () {
      const {x, y} = this.basketPosition;
      this.basket = new Basket(this, x, y);
    }

    addMap () {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 32, tileHeight: 32 });
      this.tileSet = this.tileMap.addTilesetImage("brick");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);

      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.batGroup = this.add.group();
      this.foesGroup = this.add.group();

      this.playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.basketPosition = this.objectsLayer.objects.find( object => object.name === "basket")
      this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
      this.platform.setCollisionByExclusion([-1]);

      this.objectsLayer.objects.forEach( object => {
        if (object.name === "bat") {
          let bat = new Bat(this, object.x, object.y, object.type);
          this.batGroup.add(bat)
          this.foesGroup.add(bat)
        }
      });
    }

    addBall () {
      const delay = 0; this.number === 1 ? 3000 : 0;
      const { x, y } = this.playerPosition;
      const offset = Phaser.Math.Between(-64, 64)
      this.time.delayedCall(delay, () => {
        this.ball = new Ball(this, x + offset, y, 1);
        this.physics.add.collider(this.ball, this.lines, this.hitLine, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.ball, this.basket, this.hitBasket, ()=>{
          return true;
        }, this);

        this.physics.add.overlap(this.ball, this.basket.entrance, this.gotcha, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.ball, this.physics.world.bounds.bottom, () => {
          this.death();
        }, null, this);

        this.physics.add.collider(this.ball, this.platform, this.hitFloor, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.batGroup, this.platform, this.turnFoe, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.batGroup, this.lines, this.batHitLine, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.ball, this.batGroup, this.hitBat, ()=>{
          return true;
        }, this);  
      })
    }

    hitBat(ball, bat) {
      this.playAudio("boing")
      this.hit(ball.x, ball.y)
      bat.turn();
    }

    batHitLine(bat, line) {
      bat.turn();
      this.playAudio("boing");
      Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => new Debris(this, line.x, line.y, 0xb06f00))
      line.destroy();
    }

    turnFoe (foe, platform) {
      foe.turn();
    }

    hitFloor (ball, platform) {
      this.playRandom("break")
      this.hit(ball.x, ball.y)
      //if (platform.index === 1) {
        Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => new Debris(this, platform.pixelX, platform.pixelY, 0xb95e00))
        new Ghost(this, platform.pixelX, platform.pixelY)
        this.platform.removeTileAt(platform.x, platform.y);
      //}
    } 

    hitLine (ball, line) {
      this.playRandom("boing")
      this.updateHits()
      this.hit(ball.x, ball.y)
      this.ready = true;
     // Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => new Debris(this, line.x, line.y, 0xb06f00))
      this.destroyRectangle();
    }

    hitBasket (ball, basket) {
      this.playAudio("boing")
      this.hit(ball.x, ball.y, 4)
      this.cameras.main.shake(30);
      this.tweens.add({
        targets: [basket],
        x: "-=5",
        yoyo: true,
        duration: 30,
        repeat: 10
      })
    }


    playRandom(key) {
      this.audios[key].play({
        rate: Phaser.Math.Between(9, 11)/10,
        volume: Phaser.Math.Between(5, 10)/10,
        delay: 0
      });
    }

    onWorldBounds (body, part) {
      const name = body.gameObject.constructor.name.toString();
      this.death()
      //if (name === "Ball" && body.onFloor()) { this.death() }


      if (["Ball"].includes(name) ) {
        this.playAudio("boing")
      }
    }

    showStage() {
      this.text1 = this.add.bitmapText(this.width - 128, 50, "daydream", "STAGE " + this.number, 20).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);

      if (this.number === 0) {
        this.text2 = this.add.bitmapText(this.center_width, this.center_height - 128, "daydream", "MOVE BALL TO BASKET!", 25).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.text3 = this.add.bitmapText(this.center_width, this.center_height, "daydream", "CLICK TO ADD BLOCK", 25).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.text4 = this.add.bitmapText(this.center_width, this.center_height + 128, "daydream", "KEEP CLICK TO MOVE BLOCK", 25).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.time.delayedCall(5000, () => {
          this.text2.destroy()
          this.text3.destroy()
          this.text4.destroy()
        });
      }
    }

    showHits() {
      this.textHits = this.add.bitmapText(128, 50, "daydream", "HITS: " + this.registry.get("hits"), 20).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
    }

      loadAudios () {
        this.audios = {
          "boing": this.sound.add("boing"),
          "gotcha": this.sound.add("gotcha"),
          "marble": this.sound.add("marble"),
          "win": this.sound.add("win"),
          "break": this.sound.add("break"),
          "start": this.sound.add("start"),
        };
      }

      playAudio(key, volume = 1) {
        this.audios[key].play({volume});
      }

      playMusic (theme="theme") {
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
      if (this.pointer.isDown) {
        this.destroyRectangle();
        this.paintLine();
      }

      if (this.ball && Phaser.Math.Between(1, 5) > 4) {

        this.trailLayer.add(new Particle(this, this.ball.x, this.ball.y, 0xb95e00));
      }

      if (this.finished) {
        let color =  0xb95e00;
        new Particle(this, Phaser.Math.Between(0, this.width),Phaser.Math.Between(0, this.height), color, Phaser.Math.Between(4, 10));
      }
    }

    hit (x, y, total = 10) {
      Array(Phaser.Math.Between(4, total)).fill(0).forEach((_,i) => {
        x += Phaser.Math.Between(-10, 10);
        y += Phaser.Math.Between(-10, 10);
        new Dust(this, x, y);
      })
    }

    destroyRectangle () {
      if (this.rectangle0) { 
        this.rectangle0.destroy(); 
       }
    }

    paintLine() {
      this.destroyRectangle();
      this.rectangle0 = this.add.sprite(this.pointer.x-1, this.pointer.y, "brick0")
      //this.add.rectangle(this.pointer.x-1, this.pointer.y, 3, 3, 0xb95e00);
      this.physics.add.existing(this.rectangle0);
      this.rectangle0.body.setCircle(15);

      this.rectangle0.body.setAllowGravity(false);
      this.rectangle0.body.immovable = true;
      this.lines.add(this.rectangle0);
    }

    pickRandomMessage () {
      return Phaser.Math.RND.pick(["F* YEAH!", "YUSS!", "YES!!", "COME ON!!"])
    }

    gotcha () {
      this.playAudio("gotcha")
      this.basket.anims.play("basket", true);
      this.ball.destroy();
      this.playAudio("marble")
      this.textYAY = this.add.bitmapText(this.center_width, this.center_height, "daydream", this.pickRandomMessage(), 80).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
      this.tweens.add({
        targets: this.basket,
        duration: 100,
        x: {from: this.basket.x, to: this.basket.x - 8},
        repeat: 4,
        ease: 'Bounce',
        onComplete: () => {
          this.registry.set("score", ""+this.score)
          this.textYAY.destroy();
          this.finishScene()
        }
      })

    }

    finishScene () {
      if (this.number < 9) {
        this.game.sound.stopAll();
        this.number++;
        this.scene.start("transition", {number: this.number});
      } else {        
        this.game.sound.stopAll();
        this.finished = true;
        const totalTime = (Date.now() - +this.registry.get("startTime"))/1000;
        this.playAudio("win")
        const minutes= parseInt(totalTime/60)
        const time = String(minutes).padStart(2, '0') + "m " + String(parseInt(totalTime) % 60).padStart(2, '0') + "s";
        this.text3 = this.add.bitmapText(this.center_width, this.center_height + 50, "daydream", "HITS: " + this.registry.get("hits"), 45).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.text4 = this.add.bitmapText(this.center_width, this.center_height - 50, "daydream", "CONGRATULATIONS!", 35).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 5, 0x222222, 0.9);
        this.time.delayedCall(4000, () => {
          this.text3.destroy()
          this.text4.destroy()
          this.scene.start("outro");
        });
      }
     }

    updateHits () {
      let hits = +this.registry.get("hits");
      hits++;
      this.registry.set("hits", hits)
      this.textHits.setText("HITS: " + this.registry.get("hits"))
    }

    death() {
      this.cameras.main.shake(100);
      this.textBOO = this.add.bitmapText(this.center_width, this.center_height, "daydream", "FAIL", 80).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);

      this.ball.destroy()
      this.time.delayedCall(1000, () => {
        this.textBOO.destroy();
        this.scene.start("game", {number: this.number});
      });
    }
}


export class Ball extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, scale = 0.8) {
      super(scene, x, y, "ball")
      this.setScale(0.8)
      scene.add.existing(this)
      scene.physics.add.existing(this);
      this.body.setCollideWorldBounds(true);
      this.body.onWorldBounds = true;
      this.body.setCircle(15);
      this.body.setBounce(1)
      //this.body.setOffset(6, 9)
      this.body.setAllowGravity(true);
      this.init();
  }

  init () {

    this.scene.anims.create({
      key: "ball",
      frames: this.scene.anims.generateFrameNumbers("ball", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.play("ball", true);
    this.scene.tweens.add({
        targets: this,
        duration: 200,
        rotation: "+=1",
        repeat: -1
    });
  }
}

class Basket extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, bounce = 0.5) {
      super(scene, x, y, "basket")
      scene.add.existing(this)
      scene.physics.add.existing(this);
      this.body.setCollideWorldBounds(true);
      this.body.onWorldBounds = true;
      this.body.setSize(48, 6)
      const offset = scene.number === 1 ? -20 : 5
      this.entrance = this.scene.add.rectangle(x, this.body.y + 32, 40, 6, 0xffffff).setAlpha(0);
      scene.physics.add.existing(this.entrance);
      this.body.setImmovable(true)
      this.body.setAllowGravity(false);
      this.entrance.body.setAllowGravity(false);
      this.init();
    }
  
    init () {
  
      this.scene.anims.create({
        key: "basket",
        frames: this.scene.anims.generateFrameNumbers("basket", { start: 0, end: 8 }),
        frameRate: 15,
      });
    }
}

