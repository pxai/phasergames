import HealthBar from "./objects/health_bar";
import MarbleShot from "./objects/marble_shot";
import Thrust from "./objects/thrust";
import Lock from "./objects/lock";

export default class Player extends Phaser.GameObjects.Container {
    constructor (scene, x, y, name, green, red) {
        super(scene, x, y);
        this.startX = x;
        this.startY = y;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.ship = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "ship");
        this.add(this.ship);
        this.defaultVelocity = 100;
        this.hull = 100;
        this.greenBeans = green;
        this.redBeans = red;
        this.init();
        this.setBodySize();
        this.dead = false;
        this.body.setDrag(60);
        this.body.setBounce(1)
        this.containerValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -20, "pixelFont", "SCORE", 20).setAlpha(0).setOrigin(0.5)
        this.add(this.containerValue);
        this.containerNumber = new Phaser.GameObjects.BitmapText(this.scene, 30, 80, "pixelFont", "LENGTH", 40).setAlpha(0).setOrigin(0.5)
        this.add(this.containerNumber);
        this.damageValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -40, "pixelFont", "DAMAGE", 20).setTint(0xff0000).setAlpha(0).setOrigin(0.5)
        this.add(this.damageValue);
        this.bump = this.scene.add.image(this.x, this.y, "bump").setOrigin(0.5).setAlpha(0);
        this.healthBar = new HealthBar(this, 64, 64, this.hull);
      }

    init () {
        this.marbles = [];
       this.containers = [];
        this.body.setCollideWorldBounds(true);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.scene.anims.create({
          key: "thrust",
          frames: this.scene.anims.generateFrameNumbers("thrust"),
          frameRate: 5,
          repeat: -1
        });

        this.scene.anims.create({
            key: "shot",
            frames: this.scene.anims.generateFrameNumbers("shot"),
            frameRate: 15
        });

        this.scene.anims.create({
            key: "lock",
            frames: this.scene.anims.generateFrameNumbers("lock"),
            frameRate: 10
        });
    }

    disablePlayer () {
      this.body.setDrag(0);
      this.body.setVelocityY(this.y > 600 ? -10 : 10)
      this.body.setVelocityX(200);
      this.scene.tweens.add({
        targets: this,
        duration: 4000,
        scale: {
          from: 1,
          to: 0
        },
        velocityX: {
          from: 200,
          to: 0
        },
        velocityY: {
          from: 10,
          to: 0
        }
      });
      setTimeout(() => { this.body.setVelocityX(0); this.body.setVelocityY(0);}, 4000);
      this.body.checkCollision.none = true;
      this.scene.input.keyboard.resetKeys();
      this.marbles = [];
      this.scene.showResult();
    }

    update () {
      if (this.scene.stageFinished) return;
      if (this.cursor.left.isDown || this.A.isDown) {
          this.body.setVelocityX(-100);
          this.scene.playAudio("thrust");
          this.showThrust("left");
      } else if (this.cursor.right.isDown || this.D.isDown) {
          this.body.setVelocityX(100);
          this.scene.playAudio("thrust");
          this.showThrust("right");
      }

      if (this.cursor.up.isDown || this.W.isDown) {
          this.body.setVelocityY(-100);
          this.scene.playAudio("thrust");
          this.showThrust("up");
      } else if (this.cursor.down.isDown || this.S.isDown) {
          this.body.setVelocityY(100);
          this.scene.playAudio("thrust");
          this.showThrust("down");
      }

      if (this.body.x < (-128 * (this.containers.length + 1)) || this.body.x > this.scene.physics.world.bounds.width + 10) {
        this.scene.playerDeath(this);
      }

      if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        this.shoot();
      }

    }

    shoot () {
      if (this.marbles.length > 0) {
        const marble = this.marbles.pop();
        const offset = (this.containers.length * 128);
        this.scene.playAudio("shot");
        new MarbleShot(this.scene, this.x + 138, this.y + 32, marble.number);
        this.showMarbles(`=${this.marbles.length}`);
      }
    }

    setBodySize () {
      this.body.setSize(this.ship.width, this.ship.height);
      this.body.setOffset(-(128 * this.containers.length), 0);
    }

    hit (asteroid, player) {
      console.log("Asteroid: ", asteroid.collider);
      this.scene.playAudio(`hit${Phaser.Math.Between(1, 4)}`);
      // this.showBump(player.x, player.y)
      const damage = Math.floor(asteroid.scale * 10);
      this.hull = this.hull - damage;
      this.scene.updateHull(this.hull);
      this.healthBar.decrease(damage);
      this.showHit(`-${damage}`)
      console.log("Is player dead? ", this.hull, this.isPlayerDead(), this.ship);
      if (this.isPlayerDead()) {
        this.shot = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, "shot");
        this.scene.add.existing(this.shot);
        this.shot.anims.play("shot", true);
        asteroid.collider.destroy();
        this.scene.playerDeath(this);
      }
    }

    meow() {
      this.scene.playAudio(`meow${Phaser.Math.Between(1, 7)}`)
    }

    showBump (x, y) {
      console.log(x, y, this.bump)
      this.bump.x = x;
      this.bump.y = y;
      this.bump.rotation = 100 * Math.random();
      this.bump.setAlpha(1);
      this.scene.tweens.add({
        targets: this.bump,
        duration: 4000,
        scale: {
          from: 1,
          to: 0
        },
        alpha: {
          from: 1,
          to: 0
        }
      });
    }

    showThrust(side) {
      const offset = (this.containers.length * 128);
      const position = {
        "up": {x: this.body.x + 32 + offset, y: this.body.y + 96},
        "down": {x: this.body.x + 32 + offset, y: this.body.y - 32},
        "right": {x: this.body.x - 30 + offset, y: this.body.y + 32},
        "left": {x: this.body.x + 158 + offset, y: this.body.y + 32},
      }[side];
      new Thrust(this.scene, position.x, position.y, side);
    }

    showLock(side) {
      // const offset = (this.containers.length * 32);
      const position = {
        "up": {x: this.body.x - 5, y: this.body.y + 90},
        "down": {x: this.body.x - 5, y: this.body.y - 26},
      }[side];
      const lock = new Lock(this.scene, position.x, position.y, side);
      lock.anims.play("lock");
    }
  
    pickMarble (player, marble) {
      this.scene.playAudio("marble");
      this.marbles.push(marble);
      this.showMarbles(`+${this.marbles.length}`);
      console.log("Picked up: ", this.marbles);
      marble.destroy();
    }

    asteroidHit (asteroid, container) {
     //  this.hit(asteroid)
    }

    pick (container, player) {
      container.pickOverlap.destroy();
      this.scene.playAudio("lock");
      container.free = false;
      container.body.setVelocityX(0);
      container.body.immovable = true
      container.body.stop()
      container.body.setBounce(1);
      this.add(container);
      this.recoverHull(container);
      this.lockContainer(container)
      this.containers.push(container);
      this.zoomOut();
      this.adaptBounce();
      // this.body.setCollideWorldBounds(true);
      this.body.setSize(this.ship.width + (128 * this.containers.length), this.body.height)
      this.body.setOffset(-(128 * this.containers.length), 0);
      this.show(`+${container.reward}$`,`x${this.containers.length}`);

      this.scene.updateContainers(this.containers.length);

    }

    recoverHull(container) {
      if (container.type.id === 1 || container.type.id === 8) {
        const recover= (this.hull < 70) ? 30 : (100 - this.hull);
        this.hull += recover;
        this.showHit(`+${recover}`);
      }
    }
  
    zoomOut () {
      if (this.scene.stageFinished) return;
      let amount = 1;
      if (this.containers.length >= 4 && this.containers.length < 9 ) {
         amount = 0.8;
      } else if (this.containers.length >= 9 && this.containers.length < 15 ) {
         amount = 0.6;
      } else if (this.containers.length >= 15) {
        amount = 0.5;
      }

      this.scene.zoomOut(amount);
    }

    adaptBounce () {
      const bounce =  this.containers.length < 8 ? 1 - (this.containers.length * 0.1): 0.2;
      this.body.setBounce(bounce);
    }

    showMarbles (marbleLength) {
      this.containerNumber.setText(marbleLength);
      this.containerNumber.setAlpha(1);
      this.scene.tweens.add({
        targets: this.containerNumber,
        duration:1000,
        alpha: {
          from: 1,
          to: 0
        },
      });
    }

    show (value, containerLength) {
      this.containerValue.setPosition(30, -20);
      this.containerValue.setText(value);
      this.containerValue.setAlpha(1);
      this.containerNumber.setText(containerLength);
      this.containerNumber.setAlpha(1);
      this.scene.tweens.add({
        targets: this.containerValue,
        duration: 500,
        y: {
          from: 0,
          to: -100
        },
        alpha: {
          from: 1,
          to: 0
        },
      });
      this.scene.tweens.add({
        targets: this.containerNumber,
        duration:1000,
        alpha: {
          from: 1,
          to: 0
        },
      });
    }

    showHit (value) {
      this.containerValue.setPosition(30, -20);
      this.containerValue.setText(value);
      this.containerValue.setAlpha(1);
      this.scene.tweens.add({
        targets: this.containerValue,
        duration: 500,
        y: {
          from: 0,
          to: -100
        },
        alpha: {
          from: 1,
          to: 0
        },
      });
      this.scene.tweens.add({
        targets: this.healthBar.bar,
        duration: 1000,
        alpha: {
          from: 1,
          to: 0
        },
      });
    }

    isPlayerDead () {
      return this.hull <= 0;
    }

    lockContainer(container) {
      const x = -60 - (128 * this.containers.length);
      const y = 32;
      container.setPosition(x, y);
      this.showLock("up");
      this.showLock("down");
    }
    
    finish() {
      console.log("Player is finished");
      this.body.stop();
      this.deathTween = this.scene.tweens.add({
        targets: this,
        duration: 100,
        alpha: 0,
        repeat: -1,
      })
    }

    restart () {
      this.deathTween.stop();
      this.setAlpha(1);
      if (this.scene.stageFinished) return;
      this.x = this.startX;
      this.y = this.startY;
      this.containers.forEach(container => container.destroy());
      this.containers = [];
      this.hull = 100;
      this.scene.updateHull(this.hull);
      this.scene.zoomOut(1);
      this.setBodySize();
      this.healthBar = new HealthBar(this, 64, 64, this.hull);
      this.scene.updateContainers(0);
      this.meow();
    }

    animationComplete(animation, frame) {
        if (animation.key === "reappear") {

            this.scene.finished = false;
            this.alpha = 1;
            this.anims.play("turn", true)

            this.dead = false;
        }
    }
}
