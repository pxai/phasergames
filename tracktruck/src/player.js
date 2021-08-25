import HealthBar from "./objects/health_bar";
import MarbleShot from "./objects/marble_shot";

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
        this.right = 1;
        this.dead = false;
        this.body.setDrag(60);
        this.body.setBounce(1)
        this.containerValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -20, "pixelFont", "SCORE", 20).setAlpha(0).setOrigin(0.5)
        this.add(this.containerValue);
        this.containerNumber = new Phaser.GameObjects.BitmapText(this.scene, 30, 80, "pixelFont", "LENGTH", 40).setAlpha(0).setOrigin(0.5)
        this.add(this.containerNumber);
        this.damageValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -40, "pixelFont", "DAMAGE", 20).setTint(0xff0000).setAlpha(0).setOrigin(0.5)
        this.add(this.damageValue);
        this.healthBar = new HealthBar(this, 64, 64, this.hull);
      }

    init () {
        this.marbles = [];
       this.containers = [];
        this.body.setCollideWorldBounds(true);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
      this.body.checkCollision.none = true;
      this.scene.input.keyboard.resetKeys();
      this.marbles = [];
      this.scene.showResult();
    }

    update () {
      if (this.cursor.left.isDown) {
          this.body.setVelocityX(-100);
          this.scene.playAudio("thrust");
      } else if (this.cursor.right.isDown) {
          this.body.setVelocityX(100);
          this.scene.playAudio("thrust");
      }

      if (this.cursor.up.isDown) {
          this.body.setVelocityY(-100);
          this.scene.playAudio("thrust");
      } else if (this.cursor.down.isDown) {
          this.body.setVelocityY(100);
          this.scene.playAudio("thrust");
      }

      if (this.body.x < (-128 * (this.containers.length + 1)) || this.body.x > this.scene.physics.world.bounds.width + 10) {
        this.scene.playerDeath(this);
      }

      if (this.spaceBar.isDown) {
          this.shoot();
      }
    }

    shoot () {
      if (this.marbles.length > 0) {
        const marble = this.marbles.pop();
        new MarbleShot(this.scene, this.x + 64, this.y, marble.number);
      }
    }

    setBodySize () {
      this.body.setSize(this.ship.width, this.ship.height);
      this.body.setOffset(-(128 * this.containers.length), 0);
    }

    hit (asteroid, player) {
      const damage = Math.floor(asteroid.scale * 10);
      this.hull = this.hull - damage;
      this.scene.updateHull(this.hull);
      this.healthBar.decrease(damage);
      this.showHit(`-${damage}`)
      console.log("Is player dead? ", this.hull, this.isPlayerDead(), this.ship);
      if (this.isPlayerDead()) {
        asteroid.collider.destroy();
        this.scene.playerDeath(this);
      }
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

    zoomOut () {
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
    }
    
    finish() {
      console.log("Player is finished");
    }

    restart () {
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
