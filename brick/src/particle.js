export class Particle extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, color = 0xffffff, size = 4, alpha = 1) {
        super(scene, x, y, size, size, color, alpha);
        this.name = "mario";
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

export class Debris extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, color = 0xb03e00,  width, height, gravity = false ) {
        width = width || Phaser.Math.Between(5, 15)
        height = height || Phaser.Math.Between(5, 15)
        super(scene, x, y + 5, width, height, color)
        this.setStrokeStyle(1, 0x000000);
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
