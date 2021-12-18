import Phaser from "phaser";


class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }
  
    init (data) {
      this.name = data.name;
      this.number = data.number;
      this.time = data.time;
  }
  
    preload () {
    }
  
    create () {
      console.log("Created GAME!")
      this.duration = this.time * 1000;
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

      this.aim = new Aim(this, this.center_width, this.center_height)
      this.hunter = new Hunter(this, this.center_width, this.center_height)
      this.foes = this.add.group();
      this.shots = this.add.group();
      this.foeGenerator = new FoeGenerator(this)
      this.physics.add.collider(this.shots, this.foes, this.hitFoe, () => {
        return true;
        }, this);
      //this.loadAudios(); 
      this.currentGun = 1;
      this.playMusic();
    }

    hitFoe(shot, foe) {
        shot.destroy();
        foe.destroy();
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
  
    update(delta, time) {
      this.shoot += time; 
      this.foeGenerator.update();
      
      if (this.Z.isDown && this.canShoot()) {
        console.log("FIRE!!", delta, this.shoot);
        this.shotAnimation()
        new Shot(this, this.aim.x, this.aim.y)
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
      }
    }

    canShoot() {
        console.log(">", this.currentGun, [200, 200, 200, 50][this.currentGun], this.shoot ,[200,200,200,50][this.currentGun] > this.shoot)
        return [
            200,
            50, // gun
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
  
    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }
  
    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
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
  
      this.anims.play("idle", true);
      // this.on("animationupdate" , this.castInTime, this);
      // this.on('animationcomplete', this.animationComplete, this);
  
      this.flipX = this.right;
    }
  }
  
  class Aim extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, "aim")
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
    constructor(scene, x, y, power = 1,w = 32, h = 32, color = 0xffffff) {
      super(scene, x, y, w, h, color)
      this.setAlpha(0.0)
      this.scene = scene;
      this.color = color;
      this.width = w;
      this.height = h;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setAllowGravity(false);
      this.scene.shots.add(this)
      this.init();
    }
  
    init () {
      this.scene.tweens.add({
        targets: this.scene.aim,
        duration: 100,
        alpha: {from: 0.3, to: 1},
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
        this.scene.start("game", {next: "game", name: "STAGE", number: 1, time: 30})
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

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        this.load.image("aim", "assets/images/aim.png");
        this.load.image("stage1", "assets/images/stage1.jpg");
        this.load.spritesheet("hunter", "assets/images/hunter.png", { frameWidth: 48, frameHeight: 64 });
        this.load.audio("music", "assets/sounds/music.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("seagull", "assets/images/seagull.png", { frameWidth: 64, frameHeight: 48 });
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
        if (Phaser.Math.Between(1, 1001) > 1000) {
            this.addFoe(new Chopper(this.scene));

        }

        if (Phaser.Math.Between(1, 101) > 100) {
            this.addFoe(new Seagull(this.scene));
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
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setSize(64, 20)
        this.direction = direction;
        this.scene.add.existing(this);

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

        this.anims.play(this.name, true)
        this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
        this.on('animationcomplete', this.animationComplete, this);
    }


    update () {
    }

    turn () {
        this.flipX = this.direction < 0;
        this.direction = -this.direction;
        this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
    }

    death () {
        this.dead = true;
        this.body.enable = false;
        this.body.rotation = 0;
        this.anims.play("death")
      }

      animationComplete(animation, frame) {
        if (animation.key === "death") {
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
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale);
        this.body.setAllowGravity(false);

        this.scene.add.existing(this);

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
        Game,
        Outro,
    ]
};

const game = new Phaser.Game(config);