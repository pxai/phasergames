export class Particle extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, color = 0xffffff, radius = 5, intensity = 0.5) {
        super(scene, x, y, color, radius, intensity)
        this.name = "celtic";
        this.scene = scene;
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
    constructor (scene, x, y, color = 0x00cc00, radius = 15, intensity = 0.7, gravity = false) {
        super(scene, x, y, color, radius, intensity)
        this.name = "fireball";
        scene.add.existing(this)
        scene.physics.add.existing(this);
    
        this.body.setAllowGravity(gravity);
        this.body.setVelocityX(Phaser.Math.Between(-30, 30));
        this.body.setVelocityY(Phaser.Math.Between(-30, 30));
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: { from: 1, to: 0 },
            onComplete: () => { this.destroy() }
        });
    }
}

export class Explosion {
    constructor (scene, x, y, color = 0x00cc00, size = 5, gravity = false ) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.color = color;
        this.gravity = gravity;
        this.size = size;
        this.boom();
    }

    boom () {
        Array(Phaser.Math.Between(14, 20)).fill().forEach(bit => {
            new Light(this.scene, this.x, this.y, this.color, this.size, 0.7, this.gravity);
        })
    }
}