import { Scene, GameObjects, Physics } from 'phaser';

export default class Duck extends Physics.Arcade.Sprite {
    constructor (scene, x, y, type="right") {
        super(scene, x, y, "duck");
        this.name = "duck";
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Physics.Arcade.Body).setAllowGravity(false);
        (this.body as Physics.Arcade.Body).setImmovable(true);
        this.direction = type === "right" ? 1 : -1;

        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: this.name + "death",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 2, end: 5 }),
            frameRate: 5,
          });

          this.anims.play(this.name, true)
          this.body.setVelocityX(this.direction * 150);
          this.flipX = this.direction < 0;
          //this.on('animationcomplete', this.animationComplete, this);
    }


    update () {
        this.body.setVelocityY(0);
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction < 0;
        this.body.setVelocityX(this.direction * 150);
    }
}

