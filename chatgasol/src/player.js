import { Particle } from "./particle";

class Player extends Phaser.GameObjects.Container {
    constructor (scene, x, y, name, health = 10, tnt = 1, velocity = 200, remote = false) {
        super(scene, x, y);

        this.scene = scene;
        this.name = name;

        this.sprite = this.scene.add.sprite(0, 0, "ball");
        this.sprite.setOrigin(0);
        this.add(this.sprite);
        console.log("Added name!; ", this.name)
        this.nameText = this.scene.add.bitmapText(16, 40, "mainFont", this.name, 20).setOrigin(0.5).setTint(0xffffff).setDropShadow(1, 1, 0x75b947, 0.7);
        this.add(this.nameText);

        this.setScale(0.8)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setCircle(15);
        this.body.setBounce(1)
        //this.body.setOffset(6, 9)
        this.body.setAllowGravity(true);
        this.init();
        this.points = 0;

        this.dead = false;
        this.scene.events.on("update", this.update, this);
    }

    init () {
        this.scene.anims.create({
            key: "ball",
            frames: this.scene.anims.generateFrameNumbers("ball", { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
          });

          this.sprite.anims.play("ball", true);

        //   this.scene.tweens.add({
        //       targets: this.sprite,
        //       duration: 200,
        //       rotation: "+=1",
        //       repeat: -1
        //   });
    }

    update () {
        if (!this.active || this.dead || this.finished) return;

        if (Phaser.Math.Between(1, 5) > 4) {
            new Particle(this.scene, this.x, this.y, 0xb95e00)
        }
    }

    die () {
        this.visible = false;
        this.body.enable = false;
        this.dead = true;
    }

    reborn () {
        this.visible = true;
        this.body.enable = true;
        this.dead = false;
        this.x = this.scene.gasol.x;
        this.y = this.scene.gasol.y;
    }

    addPoints() {
        this.points = this.points + 3;
    }
}

export default Player;
