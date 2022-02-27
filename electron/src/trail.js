const TYPES = {
    "particle0": { color: 0xd5896f, radius: 8, intensity: 0.8 }, 
    "particle1": { color: 0x70A288, radius: 8, intensity: 0.8 },
    "particle2": { color: 0xdab785, radius: 8, intensity: 0.8 },
    "particle3": { color: 0x04395e, radius: 8, intensity: 0.8 },
    "particle4": { color: 0xd5896f, radius: 8, intensity: 0.8},
    "coin": {color: 0xee9b00, radius: 8, intensity: 0.8}
};

export class Trail extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, type, velocityX = 0, velocityY = 0) {
        const { color, radius, intensity } = TYPES[type];
        super(scene, x, y, color, radius, intensity)
        this.name = "particle";
        this.scene = scene;
        this.type = type;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setVelocityY(velocityY);
        this.body.setVelocityX(velocityX);
        this.body.setAllowGravity(false);

        this.init();
   }


    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 400,
            intensity: {from: 0.7, to: 0.4},
            scale: { from: 1, to: 0},
            onComplete: () => {
                this.destroy()
            }
        });
    }
}

export class Explosion {
    constructor (scene, x, y, type) {
        this.boom(scene, x, y, type)
   }


    boom (scene, x, y, type) {
        Array(20).fill(0).forEach((_,i) => {
            let trail = new Trail(scene, x, y, type, Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
            trail.radius = 6;
        })
    }
}