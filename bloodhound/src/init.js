import Phaser from "phaser";


class Game extends Phaser.Scene {
    constructor () {
        super({ key: "stage" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }
  
    init (data) {
      this.name = data.name;
      this.number = data.number;
      this.timePassed = data.timePassed;
      this.bloodValue = [20, 20, 20, 40, 50][this.number]
      console.log("Blood: ", this.bloodValue, this.number)
  }
  
    preload () {
    }
  
    create () {
      this.duration = this.timePassed * 1000;
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.setBackground();
  
      this.cursor = this.input.keyboard.createCursorKeys();
      this.Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
      this.shoot = 0;
      this.shootSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.foeLayer = this.add.layer()
      this.foes = this.add.group();
      this.shots = this.add.group();
      this.powerups = this.add.group();
      this.aim = new Aim(this, this.center_width, this.center_height, "aimgun")
      this.hunter = new Hunter(this, this.center_width, this.height - 100)
      this.paintBlood();
      this.gunTypes = [ "gun", "gun", "shotgun", "minigun", "gun"]
      this.foeGenerator = new FoeGenerator(this)
      this.physics.add.collider(this.shots, this.foes, this.hitFoe, () => {
        return true;
        }, this);
      this.physics.add.collider(this.hunter, this.powerups, this.pickPowerup, () => {
        return true;
        }, this);
      this.loadAudios(); 
      this.currentGun = 1;
      this.shotSound = null;
      this.stageClear = false;
      this.playMusic();
    }

    hitFoe(shot, foe) {
      if (foe.active && !this.stageClear) {
        this.bloodUpdate(foe.value);
        foe.hit(shot.value);
        shot.destroy();
      }
    }
  
    setBackground () {
      this.image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'stage1')
      let scaleX = this.cameras.main.width / this.image.width
      let scaleY = this.cameras.main.height / this.image.height
      let scale = Math.max(scaleX, scaleY)
      this.image.setScale(scale).setScrollFactor(0)
    }
  
    loadAudios () {
      this.audios = {
        "gun": this.sound.add("gun"),
        "shotgun": this.sound.add("shotgun"),
        "minigun": this.sound.add("minigun"),
        "metal": this.sound.add("metal"),
        "ricochet": this.sound.add("ricochet"),
        "impact0": this.sound.add("impact0"),
        "impact1": this.sound.add("impact1"),
        "impact2": this.sound.add("impact2"),
        "impact3": this.sound.add("impact3"),
        "impact4": this.sound.add("impact4"),
        "impact5": this.sound.add("impact5"),
        "impact6": this.sound.add("impact6"),
        "explosion0": this.sound.add("explosion0"),
        "explosion1": this.sound.add("explosion1"),
        "explosion2": this.sound.add("explosion2"),
      };


    }
  
    playAudio(key) {
      this.audios[key].play();
      return this.audios[key];
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
  
    update(delta, time) {
      this.shoot += time; 
      this.foeGenerator.update();
      
      if (this.hunter.jumping) return;
      if (this.Z.isDown && this.canShoot()) {
        this.shotAnimation()
        this.shootIt();
        this.shoot = 0;
      } 

      if (this.Z.isDown && this.canShoot()) {
        this.shotAnimation()
        this.shootIt();
        this.shoot = 0;
      } 
  
      if (this.cursor.left.isDown) {
        this.aim.x -= 3;
        if (this.shoot > 200) {
          this.hunter.flipX = false;
          this.hunter.anims.play("walk", true);
          this.hunter.x -= 3
        }
      } 
  
      if (this.cursor.right.isDown) {
        this.aim.x += 3;
        if (this.shoot > 200) {
          this.hunter.flipX = true;
          this.hunter.anims.play("walk", true);
          this.hunter.x += 3
        } 
      }
  
      if (!this.cursor.left.isDown && !this.cursor.right.isDown && this.shoot > 200 ) {
        this.hunter.anims.play("idle", true);
      }
    
      if (this.cursor.up.isDown) {
        this.aim.y -= 3;
      } 
  
      if (this.cursor.down.isDown) {  
        this.aim.y += 3;
        if (this.shoot > 400) {
          this.hunter.jump()
        } 
      }
    }

    shootIt () {
      const [w, h, value] = {
        "gun": [32, 32, 1],
        "shotgun": [48, 48, 5],
        "minigun": [64, 32, 1]
      }[this.gunTypes[this.currentGun]];
      new Shot(this, this.aim.x, this.aim.y, w, h, value)
      console.log("A ver: ", this.shotSound?.isPlaying, " o ", this.currentGun, " or ", this.currentGun === 3);
      if (this.shotSound?.isPlaying && this.currentGun === 3) {
        return;
      }

      if (this.shotSound) this.shotSound.stop()
      this.shotSound = this.playAudio(this.gunTypes[this.currentGun]);
    }

    canShoot() {
        return [
            200,
            200, // gun
            200, // shotgun
            50,  // machinegun
        ][this.currentGun] < this.shoot;
    }
  
    shotAnimation () {
      const distance = this.aim.x - this.hunter.x;
      const absDistance = Math.abs(distance);
    
      if (absDistance < 100) {
        this.hunter.anims.play("shoot0", true);
      } else if (absDistance >= 100 && absDistance < 250) {
        this.hunter.anims.play("shoot1", true);
      } else {
        this.hunter.anims.play("shoot2", true);
      }
  
      this.hunter.flipX = distance < 0;
  
    }

    bloodUpdate(value = 0) {
      if (!value) return;
      this.bloodValue -= (value/4);
      console.log("Result blood: ", this.bloodValue)
      if (this.bloodValue <= 0) return this.finishScene();
      if (this.drops) this.drops.forEach(drop => drop.destroy());
      this.paintBlood()
    }

    paintBlood () {
      this.drops = Array(Math.floor(this.bloodValue/4)).fill(0).map((_,i) => this.add.image(this.center_width + (30 * i) , 20, "blood"))
    }
  
    finishScene () {
      this.stageClear = true;
      this.foes.children.entries.forEach( foe => {
        console.log("Status: ", foe)
          this.playAudio(`explosion${Phaser.Math.Between(0, 2)}`)
          foe.destroy();
      })
      this.theme.stop();
      this.shotSound.stop();
      this.time.delayedCall(2000, () => this.scene.start("transition", {next: "stage", name: "STAGE", number: this.number + 1, time: this.timePassed * 2}), null, this);
    }
  
    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    pickPowerup (hunter, powerup) {
      if (powerup.name === "shotgun") {
        this.currentGun = 2;
        this.sound
      } else if (powerup.name === "minigun") {
        this.currentGun = 3;
      }
      if (this.shotSound?.isPlaying) {
        this.shotSound.stop();
      }
      this.setAim(this.gunTypes[this.currentGun]);
      powerup.destroy();
    }

    setAim(current) {
      this.aim.destroy();
      console.log("Change aim: ",  "aim" + current)
      this.aim = new Aim(this, this.center_width, this.center_height, "aim" + current)
    }
  }
  
  class Hunter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, "hunter")
      this.scene = scene;
      this.setScale(2)
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(true);
      this.right = true;
      this.jumping = false;
      this.init();
    }
  
    init () {
      this.body.setCollideWorldBounds(true);
      this.scene.anims.create({
        key: "idle",
        frames: this.scene.anims.generateFrameNumbers("hunter", { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
      });
  
      this.scene.anims.create({
        key: "walk",
        frames: this.scene.anims.generateFrameNumbers("hunter", { start: 2, end: 4 }),
        frameRate: 3,
        repeat: -1
      });
  
      this.scene.anims.create({
        key: "shoot0",
        frames: this.scene.anims.generateFrameNumbers("hunter", { start: 5, end: 6 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.scene.anims.create({
        key: "shoot1",
        frames: this.scene.anims.generateFrameNumbers("hunter", { start: 7, end: 8 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.scene.anims.create({
        key: "shoot2",
        frames: this.scene.anims.generateFrameNumbers("hunter", { start: 9, end: 10 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.scene.anims.create({
        key: "death",
        frames: this.scene.anims.generateFrameNumbers("hunter", { start: 11, end: 13 }),
        frameRate: 5,
      });

      this.scene.anims.create({
        key: "jump",
        frames: this.scene.anims.generateFrameNumbers("hunter", { start: 14, end: 19 }),
        frameRate: 5,
      });
      this.anims.play("idle", true);
      // this.on("animationupdate" , this.castInTime, this);
      // this.on('animationcomplete', this.animationComplete, this);
  
      this.flipX = this.right;
    }

    jump () {
      this.jumping = true;
      const move = this.flipX ? 200 : -200;

      const timeline = this.scene.tweens.createTimeline();
      timeline.add({
        targets: this,
        duration: 1000,
        x: {from: this.x, to: this.x + move},
        onComplete: () => {
          this.jumping = false;
          this.anims.play("idle", true);
        }
      })  
      timeline.play()
      this.anims.play("jump", true);
    }
  }

  class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        console.log("Loading next: "), data.number;
        this.name = "stage1";
        this.number = data.number;
        this.timePassed = data.time;
        this.next = data.next;
    }

    preload () {
    }

    create () {
      const messages = ["ARROWS: move + Z: shoot", "Do you want some more?","The blood is the price!","Kill'em all!!","You did it!!"];
   
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        // this.transition = this.sound.add("transition");
        // this.transition.play();
        this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", messages[this.number], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);

        this.time.delayedCall(3000, () => this.loadNext());
    }

    update () {
    }

    loadNext () {
        this.scene.start(this.next, { name: this.name, number: this.number, timePassed: this.timePassed });
    }
}
  
  class Aim extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "aimgun") {
      super(scene, x, y, name)
      this.name = name;
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(false);
  
      this.init();
    }
  
    init () {
      this.body.setCollideWorldBounds(true);
    }
  } 
  
  class Shot extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y,w = 32, h = 32, value = 1, color = 0xffffff) {
      super(scene, x, y, w, h, color)
      this.setAlpha(0.0)
      this.value = value;
      this.scene = scene;
      this.color = color;
      this.width = w;
      this.height = h;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(false);
      this.scene.shots.add(this)
      new Dust(this.scene, x, y - 10, value)
      this.init();
    }
  
    init () {
      this.scene.tweens.add({
        targets: this.scene.aim,
        duration: 100,
        alpha: {from: 0.8, to: 1},
        repeat: 3,
        onComplete: () => {
          this.destroy()
        }
      })  
    }
  } 


class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;


        this.cameras.main.setBackgroundColor(0x000000);
        //this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "stage", name: "STAGE", number: 0, time: 30})
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, -200, "logo").setScale(0.5).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
            y: {
                from: -200,
                to: 130
              },
          })
    }

    showPlayer () {

    }

    playMusic (theme="splash") {
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
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 450, "pixelFont", "WASD/Arrows: move", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "pixelFont", "SPACE: track beam", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "pixelFont", "B: shoot coins", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}

class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "The U.F.I.S.H. recovered the engines.",
            "After a terrible fishing day,",
            "they decided to move to Europa moon,",
            "to fish under the ice",
            "But that is another story..."
        ];
        this.showHistory();

        //this.showPlayer();
        //this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    playMusic (theme="outro") {
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

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "pixelFont", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }


    startSplash () {
        // this.theme.stop();
        this.scene.start("splash");
    }
}


class Bootloader extends Phaser.Scene {
    constructor () {
        super({ key: "bootloader" });
    }

    preload () {
        this.createBars();
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x88d24c, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );
        this.load.on("complete", () => {
           this.scene.start("splash");
        },this);

        Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`impact${i}`,`assets/sounds/impact${i}.mp3`)
        });
        Array(3).fill(0).forEach((_,i) => {
          this.load.audio(`explosion${i}`,`assets/sounds/explosion${i}.mp3`)
      });

        this.load.image("aimgun", "assets/images/aimgun.png");
        this.load.image("aimminigun", "assets/images/aimminigun.png");
        this.load.image("aimshotgun", "assets/images/aimshotgun.png");
        this.load.image("stage1", "assets/images/stage1.jpg");
        this.load.spritesheet("hunter", "assets/images/hunter.png", { frameWidth: 48, frameHeight: 64 });
        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("gun", "assets/sounds/gun.mp3");
        this.load.audio("shotgun", "assets/sounds/shotgun.mp3");
        this.load.audio("minigun", "assets/sounds/minigun.mp3");
        this.load.audio("metal", "assets/sounds/metal.mp3");
        this.load.audio("ricochet", "assets/sounds/ricochet.mp3");
        this.load.image("blood", "assets/images/blood.png");

        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("duck", "assets/images/duck.png", { frameWidth: 74, frameHeight: 48 });
        this.load.spritesheet("shotgun", "assets/images/shotgun.png", { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet("minigun", "assets/images/minigun.png", { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("seagull", "assets/images/seagull.png", { frameWidth: 64, frameHeight: 48 });
        this.load.spritesheet("bunny", "assets/images/bunny.png", { frameWidth: 64, frameHeight: 64 });
        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x008483, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}

class FoeGenerator {
    constructor(scene, level) {
        this.scene = scene;
        this.level = level;
        this.init();
    }

    init () {

    }

    update () {
        if (Phaser.Math.Between(1, 401) > 400) {
            this.addFoe(new Chopper(this.scene));

        }

        if (Phaser.Math.Between(1, 101) > 100) {
            this.addFoe(new Seagull(this.scene));
        }

        if (Phaser.Math.Between(1, 101) > 100) {
          this.addFoe(new Duck(this.scene));
        }

        if (Phaser.Math.Between(1, 101) > 100) {
          this.addFoe(new Bunny(this.scene));
        }
    }

    addFoe(foe) {
        this.scene.foeLayer.add(foe)
        this.scene.foes.add(foe);
    }
}

class Seagull extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        const x = Phaser.Math.Between(0, 1) ? - 64 : scene.width + 64;
        const y = Phaser.Math.Between(scene.height - 210, 32);
        const direction = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
        super(scene, x, y, "seagull");
        this.name = "seagull";
        this.scene = scene;
        this.value = 1;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setSize(64, 20)
        this.direction = direction;
        this.scene.add.existing(this);
        this.dead = false;
        this.init();
    }

    init () {
      if (this.direction > 0) this.flipX = true;
      this.scene.anims.create({
          key: this.name,
          frames: this.scene.anims.generateFrameNumbers(this.name),
          frameRate: 5,
          repeat: -1
        });

        this.scene.anims.create({
          key: this.name + "death",
          frames: this.scene.anims.generateFrameNumbers(this.name),
          frameRate: 5,
        });

        this.anims.play(this.name, true)
        this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
        this.on('animationcomplete', this.animationComplete, this);
    }


    update () {
    }

    hit (value) {
      this.value -= value;
      new Dust(this.scene, this.x, this.y, 5);
      this.scene.playAudio(`impact${Phaser.Math.Between(0, 6)}`)

      if (this.value <= 0) { this.death();}
    }

    turn () {
        this.flipX = this.direction < 0;
        this.direction = -this.direction;
        this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
    }

    death () {
      this.dead = true;
      Array(30).fill().forEach(i => new Blood(this.scene, this.x, this.y));
      this.body.rotation = 15;
      this.scene.tweens.add({
        targets: this,
        duration: 250,
        y: {from: this.y, to: this.scene.aim.y + 100},
      })  
        this.dead = true;
        this.body.enable = false;
        this.anims.play(this.name + "death")
      }

      animationComplete(animation, frame) {
        console.log("completed", animation.key)
        if (animation.key === this.name + "death") {
          console.log("DEATH")
          this.destroy()
        }
    }
}


class Duck extends Phaser.Physics.Arcade.Sprite {
  constructor (scene) {
      const x = Phaser.Math.Between(0, 1) ? - 64 : scene.width + 64;
      const y = Phaser.Math.Between(200, 300);
      const direction = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
      super(scene, x, y, "duck");
      this.name = "duck";
      this.scene = scene;
      this.value = 1;
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(false);
      this.body.setSize(74, 20)
      this.direction = direction;
      this.scene.add.existing(this);
      this.dead = false;
      this.init();
  }

  init () {
    if (this.direction > 0) this.flipX = true;
    this.scene.anims.create({
        key: this.name,
        frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
      });

      this.scene.anims.create({
        key: this.name + "death",
        frames: this.scene.anims.generateFrameNumbers(this.name, { start: 3, end: 4 }),
        frameRate: 5,
      });

      this.anims.play(this.name, true)
      this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
      this.on('animationcomplete', this.animationComplete, this);
  }


  update () {
  }

  hit (value) {
    this.value -= value;
    new Dust(this.scene, this.x, this.y, 5);
    this.scene.playAudio(`impact${Phaser.Math.Between(0, 6)}`)

    if (this.value <= 0) { this.death();}
  }

  turn () {
      this.flipX = this.direction < 0;
      this.direction = -this.direction;
      this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
  }

  death () {
    this.dead = true;
    Array(30).fill().forEach(i => new Blood(this.scene, this.x, this.y));
    this.body.rotation = 15;
    this.scene.tweens.add({
      targets: this,
      duration: 250,
      y: {from: this.y, to: this.scene.aim.y + 100},
    })  
      this.dead = true;
      this.body.enable = false;
      this.anims.play(this.name + "death")
    }

    animationComplete(animation, frame) {
      console.log("completed", animation.key)
      if (animation.key === this.name + "death") {
        console.log("DEATH")
        this.destroy()
      }
  }
}

class Bunny extends Phaser.Physics.Arcade.Sprite {
  constructor (scene) {
      const x = Phaser.Math.Between(0, 1) ? - 64 : scene.width + 64;
      const y = Phaser.Math.Between(scene.height - 20, scene.height - 400);
      const direction = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

      super(scene, x, y, "bunny");
      this.name = "bunny";
      this.setScale(0.7)
      this.scene = scene;
      this.value = 3;
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(false);
      this.body.setSize(74, 20)
      this.direction = direction;
      this.scene.add.existing(this);
      this.dead = false;
      this.init();
  }

  init () {
    if (this.direction > 0) this.flipX = true;
    this.scene.anims.create({
        key: this.name,
        frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
      });

      this.scene.anims.create({
        key: this.name + "death",
        frames: this.scene.anims.generateFrameNumbers(this.name, { start: 3, end: 4 }),
        frameRate: 5,
      });

      this.anims.play(this.name, true)
      this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
      this.on('animationcomplete', this.animationComplete, this);
      this.scene.tweens.add({
        targets: this,
        duration: Phaser.Math.Between(300, 400),
        y: {from: this.y, to: this.y - Phaser.Math.Between(150, 200)},
        repeat: -1,
        yoyo: true
      })  
  }


  update () {
  }

  hit (value) {
    this.value -= value;
    Array(5).fill().forEach(i => new Blood(this.scene, this.x, this.y));
    this.scene.playAudio(`impact${Phaser.Math.Between(0, 6)}`)

    if (this.value <= 0) { this.death();}
  }

  turn () {
      this.flipX = this.direction < 0;
      this.direction = -this.direction;
      this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
  }

  death () {
    this.dead = true;
    Array(40).fill().forEach(i => new Blood(this.scene, this.x, this.y));

      this.dead = true;
      this.body.enable = false;
      this.anims.play(this.name + "death")
    }

    animationComplete(animation, frame) {
      console.log("completed", animation.key)
      if (animation.key === this.name + "death") {
        console.log("DEATH")
        this.destroy()
      }
  }
}

class Chopper extends Phaser.Physics.Arcade.Sprite {
    constructor (scene,  name = "chopper", scale = 0.5) {
        const x = Phaser.Math.Between(0, 1) ? - 64 : scene.width + 64;
        const y = Phaser.Math.Between(scene.height - 210, 32);

        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.value = 10;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale);
        this.body.setAllowGravity(false);

        this.scene.add.existing(this);
        this.dead = false;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "chopper",
            frames: this.scene.anims.generateFrameNumbers("chopper", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play("chopper", true)
          this.direction = Phaser.Math.Between(0, 1) ? -1 : 1;
          this.body.setVelocityX(100 * this.direction)
          this.flipX = this.direction < 0;
    }


    update () {
        if (Phaser.Math.Between(1, 1001) > 1000) {
            //new Bullet(this.scene, this.x, this.y)
        }
    }

    hit (value) {
      if (this.dead) return
      if (this.scene) {
        this.scene.playAudio(Math.random() > 0.5 ? "metal" : "ricochet")
        new Dust(this.scene, this.x, this.y);
        if (Phaser.Math.Between(0, 11) > 10) {
          this.scene.powerups.add(new PowerUp(this.scene, this.x, this.y));
        }
        console.log("Hit value to choppah ", this.value, value, this.value - value);
        this.value -= value;
        if (this.value <= 0) { this.death();}
      }
    }

    death () {
      this.dead = true;
      this.scene.playAudio(`explosion${Phaser.Math.Between(0, 2)}`)
      new Dust(this.scene, this.x, this.y, 20);
      this.destroy();
    }
}


class Dust {
  constructor (scene, x, y, size=10, color = "0xffffff") {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.color = Phaser.Display.Color.HexStringToColor(color).color;
      this.dust = Array(11).fill(0).map(i => {
          let rectangle = this.scene.add.rectangle(this.x, this.y, size, size, this.color);
          return rectangle;
      })

      this.tweenStar(0, -20);
      this.tweenStar(1, -15)
      this.tweenStar(2);
      this.tweenStar(3, 15);
      this.tweenStar(4, 30);
      this.tweenStar(5, -15, 0);
      this.tweenStar(6, 15, 0)
      this.tweenStar(7, -17.5, 3);
      this.tweenStar(8, 17.5, 3)
      this.tweenStar(9, -20, 7);
      this.tweenStar(10, 20, 7)
  }

  tweenStar(i, x = 0, y = -10) {
      this.scene.tweens.add({
          targets: this.dust[i],
          duration: Phaser.Math.Between(1000, 800),
          y: {from: this.y + 20, to: this.y + 20 - y},
          x: {from: this.x, to: this.x + x},
          alpha: { from: 1, to: 0 }
      });
  }
}

class Blood extends Phaser.GameObjects.Rectangle {
  constructor (scene, x, y) {
    super(scene, x, y, 5, 5, 0xff0000);
      this.scene = scene;
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(true);
      this.scene.add.existing(this);
      this.body.setCollideWorldBounds(true);
      this.body.setVelocityY(Math.random() * Phaser.Math.Between(-20, -100));
      if (Math.random() > 0.5)
      this.body.setVelocityX((Math.random() > 0.5 ? 1 : -1) * Phaser.Math.Between(10, 30));
      this.body.setDrag(10);
  }
}

class PowerUp extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
      const name = (Math.random() > 0.5) ? "minigun" : "shotgun";
    super(scene, x, y, name);
      this.name = name;
      this.scene = scene;
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(true);
      this.scene.add.existing(this);
      this.body.setCollideWorldBounds(true);
      this.body.setVelocityY(-100);
      this.body.setDrag(10);
      this.init();
  }

  init () {
    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.play(this.name, true)
  }
}


const config = {
    width: 1000,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "contenedor",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        Bootloader,
        Splash,
        Transition,
        Game,
        Outro,
    ]
};

const game = new Phaser.Game(config);