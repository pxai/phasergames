export class Particle extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, color = 0xffffff, size = 4, alpha = 1) {
        super(scene, x, y, size, size, color, alpha);
        this.name = "demon";
        this.scene = scene;
        this.alpha = alpha;
        this.setOrigin(0.5)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(600, 1000),
            scale: { from: 1, to: 3 },
            alpha: { from: this.alpha, to: 0 },
            onComplete: () => { this.destroy() }
        });
    }
}

export class Dust extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, size = 1, alpha = 1) {
        super(scene, x, y, "dust");
        this.name = "dust";
        this.scene = scene;
        this.alpha = alpha;
        this.setOrigin(0.5)
        this.setScale(size)
        scene.add.existing(this);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "dust",
            frames: this.scene.anims.generateFrameNumbers("dust", { start:0, end: 9 }),
            frameRate: 10,
        });

        this.anims.play("dust", true);

        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(600, 1000),
            y: { from: this.y, to: this.y - 32 },
            onComplete: () => { this.destroy() }
        });
    }
}

export class Debris extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, color = 0xffffff,  width, height, gravity = false ) {
        width = width || Phaser.Math.Between(5, 15)
        height = height || Phaser.Math.Between(5, 15)
        super(scene, x, y + 5, width, height, color)
        //this.setStrokeStyle(4, 0x000000);
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setVelocityX(Phaser.Math.Between(-100, 100));
        // this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: {from: 1, to: 0},
            onComplete: () => { this.destroy()  }
        });

    }
}
