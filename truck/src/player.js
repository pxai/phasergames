import HealthBar from "./objects/health_bar";

export default class Player extends Phaser.GameObjects.Container {
    constructor (scene, x, y, name, green, red) {
        super(scene, x, y);
        this.startX = x;
        this.startY = y;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.ship = new Phaser.GameObjects.Sprite(this.scene, 32, 32, "ship");
        this.add(this.ship);
        this.defaultVelocity = 100;
        this.hull = 100;
        this.greenBeans = green;
        this.redBeans = red;
        this.init();
        this.right = 1;
        this.dead = false;
        this.containers = [];
        this.containerValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -20, "pixelFont", "SCORE", 20).setAlpha(0).setOrigin(0.5)
        this.add(this.containerValue);
        this.containerNumber = new Phaser.GameObjects.BitmapText(this.scene, 30, 80, "pixelFont", "LENGTH", 40).setAlpha(0).setOrigin(0.5)
        this.add(this.containerNumber);
        this.damageValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -40, "pixelFont", "DAMAGE", 20).setTint(0xff0000).setAlpha(0).setOrigin(0.5)
        this.add(this.damageValue);
        this.healthBar = new HealthBar(this, 64, 64, this.hull);
      }

    init () {
      this.containers = [];
        this.body.setCollideWorldBounds(true);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }

    update () {
      if (this.cursor.left.isDown) {
          this.body.setVelocityX(-100);
      } else if (this.cursor.right.isDown) {
          this.body.setVelocityX(100);
      }

      if (this.cursor.up.isDown) {
          this.body.setVelocityY(-100);
      } else if (this.cursor.down.isDown) {
          this.body.setVelocityY(100);
      }

      if (this.body.x < -5 && this.body.x > 810) {
        this.scene.playerDeath(this);
      }
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

    asteroidHit (asteroid, container) {
      console.log("Hit container: ", container);
     //  this.hit(asteroid)
    }

    pick (container, player) {
      container.pickOverlap.destroy();
      console.log("Picked up!!", container);
      container.free = false;
      container.body.setVelocityX(0);
      container.body.immovable = true
      container.body.setBounce(1);
      this.add(container);

      this.lockContainer(container)
      this.containers.push(container);
      this.body.setSize(this.ship.width + (128 * this.containers.length), this.body.height)
      this.body.setOffset(-(128 * this.containers.length), 0);
      this.show(`+${container.reward}$`,`x${this.containers.length}`);

      this.scene.updateContainers(this.containers.length);

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
      this.healthBar = new HealthBar(this, 64, 64, this.hull);
      this.scene.updateContainers(0);
    }

    animationComplete(animation, frame) {
        if (animation.key === "reappear") {
            console.log("Death complete")
            this.scene.finished = false;
            this.alpha = 1;
            this.anims.play("turn", true)

            this.dead = false;
        }
    }
}
