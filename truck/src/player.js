

export default class Player extends Phaser.GameObjects.Container {
    constructor (scene, x, y, name, green, red) {
        super(scene, x, y);
        this.startX = x;
        this.startY = y;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.ship = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ship").setOrigin(0.5);
        this.add(this.ship);
        this.defaultVelocity = 100;
        this.hull = 1000;
        this.greenBeans = green;
        this.redBeans = red;
        this.init();
        this.right = 1;
        this.enableAttackFart = true;
        this.dead = false;
        this.containers = [];
        this.containerValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -20, "pixelFont", "SCORE", 20).setAlpha(0).setOrigin(0.5)
        this.add(this.containerValue);
        this.damageValue = new Phaser.GameObjects.BitmapText(this.scene, 30, -20, "pixelFont", "DAMAGE", 20).setTint(0xf00).setAlpha(0).setOrigin(0.5)
        this.add(this.damageValue);
      }

    init () {
      this.containers = [];
        this.body.setCollideWorldBounds(true);
        // this.setOrigin(0.5);
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
    }

    hit (asteroid, player) {
      const damage = Math.floor(asteroid.scale * 10);
      console.log("I was hit!!");
      asteroid.body.setVelocityX(-asteroid.body.velocity.x)
      asteroid.body.setVelocityY(-asteroid.body.velocity.y);
      this.hull = this.hull - damage;
      this.scene.updateHull(this.hull);
      this.show(`-${damage}`)
      if (this.isPlayerDead()) {
        asteroid.collider.destroy();
        this.scene.playerDeath(this);
      }
    }

    pick (container, player) {
      container.pickOverlap.destroy();
      console.log("Picked up!!", container);
      this.show(`+${container.reward}$`);
      container.free = false;
      this.add(container);
      //container.setPosition(0, 0);
      this.lockContainer(container)
      this.containers.push(container);
      // this.scene.playAudio("greenbean");
      this.scene.updateContainers(this.containers.length);
      console.log("Length: ", this.containers.length);
    }

    show (value) {
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
    }

    isPlayerDead () {
      return this.hull <= 0;
    }

    lockContainer(container) {
      const x = -80 - (128 * this.containers.length);
      const y = 0;
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
      this.hull = 1000;
      this.scene.updateHull(this.hull);
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
