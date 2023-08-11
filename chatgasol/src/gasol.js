export default class Gasol extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, type="right") {
        super(scene, x, y, "gasol");
        this.name = "gasol";
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.scene.add.existing(this);
        this.body.immovable = true;
        this.direction = type === "right" ? 1 : -1;

        this.init();
    }

    init () {

      this.scene.anims.create({
        key: "startidle",
        frames: this.scene.anims.generateFrameNumbers("gasol", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });

    this.scene.anims.create({
        key: "playeridle",
        frames: this.scene.anims.generateFrameNumbers("gasol", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });

    this.scene.anims.create({
        key: "playershot",
        frames: this.scene.anims.generateFrameNumbers("gasol", { start: 2, end: 3 }),
        frameRate: 3,
        repeat: 0
    });

    this.scene.anims.create({
      key: "playercelebrate",
      frames: this.scene.anims.generateFrameNumbers("gasol", { start: 2, end: 3 }),
      frameRate: 3,
      repeat: -1
    });

    this.anims.play("startidle", true);

    this.on('animationcomplete', this.animationComplete, this);
    }

    update () {
    }

    celebrate () {
      this.anims.play("playercelebrate", true);
      this.scene.tweens.add({
        targets: this,
        y: "-=10",
        duration: 150,
        yoyo: true,
        repeat: -1
      })
    }

    death () {
        this.dead = true;
        this.body.enable = false;
        this.body.rotation = 0;
        this.anims.play(this.name + "death")
      }

      animationComplete(animation, frame) {
        if (animation.key === "playershot") {
          this.anims.play("startidle", true);
        }
    }
}

