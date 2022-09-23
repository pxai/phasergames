export class Bubble extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity = 1, direction, duration = 600, tint = 0xffffff) {
        super(scene, x, y, "bubble");
        this.name = "bubble";
        this.scene = scene;
        this.setOrigin(0.5)
        this.setTint(tint)
        this.duration = duration;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.direction = direction || Phaser.Math.Between(0, 1) ? -1 : 1;
        this.body.setVelocityY(this.direction * velocity);
        this.flipX = this.direction < 0;
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(this.duration, this.duration + 400),
            y: {from: this.y, to: this.y + (this.direction * Phaser.Math.Between(20, 40))},
            scale: {from: Phaser.Math.Between(0.8, 1.2), to: 0.1},
            alpha: { from: 1, to: 0 },
            onComplete: () => { this.destroy() }
        });
    }
}

export class MovingBubble extends Bubble {
    constructor (scene, x, y, velocity = 1, direction, duration = 600) {
        super(scene, x, y, velocity, direction, duration);
    }

    init () {
        const size = Phaser.Math.Between(0.8, 1.2)
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(this.duration, this.duration + 400),
            scale: {from: Phaser.Math.Between(0.8, 1.2), to: 0.1},
            alpha: { from: 1, to: 0 },
            onComplete: () => { this.destroy() }
        });

        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(50, 400),
            scale: {from: size - 0.1, to: size},
           repeat: -1
        })
    }
}

