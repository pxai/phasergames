export class Particle extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, color = 0xffffff, size = 1, alpha = 0.5) {
        super(scene, x, y, size, size, color, alpha);
        this.name = "celtic";
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

export class Light extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, color = 0x00cc00, radius = 15, intensity = 0.7) {
        super(scene, x, y, color, radius, intensity)
        this.name = "fireball";
        scene.add.existing(this)
        scene.physics.add.existing(this);
    
        this.body.setAllowGravity(true);
        this.body.setVelocityX(Phaser.Math.Between(-10, 10));
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scale: { from: 1, to: 0 },
            onComplete: () => { this.destroy() }
        });
    }
}

export class Explosion {
    constructor (scene, x, y, color = 0x00cc00 ) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.color = color;
        this.boom();
    }

    boom () {
        Array(Phaser.Math.Between(10, 11)).fill().forEach(bit => {
            new Light(this.scene, this.x, this.y, this.color, 2);
        })
    }
}