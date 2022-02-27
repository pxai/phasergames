import { Trail } from "./trail";

const TYPES = {
    "particle0": { color: 0xd5896f, radius: 20, intensity: 0.4 }, 
    "particle1": { color: 0x70A288, radius: 20, intensity: 0.4 },
    "particle2": { color: 0xdab785, radius: 20, intensity: 0.4 },
    "particle3": { color: 0x04395e, radius: 40, intensity: 0.8 },
    "particle4": { color: 0xd5896f, radius: 40, intensity: 0.8}
};

export const particleTypes = Object.keys(TYPES);

export class Particle extends Phaser.GameObjects.Container {
    constructor (scene, x, y, velocityX = 0, velocityY = 300, startType) {
        super(scene, x, y)
        this.x = x;
        this.y = y;
        this.scene = scene;
          this.name = "particle";


        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setVelocityY(velocityY);
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setCircle(16);
        this.body.setOffset(-16, -16)

        const type = startType ? startType : Object.keys(TYPES)[Phaser.Math.Between(0, Object.keys(TYPES).length - 3)]

        const { color, radius, intensity } = TYPES[type];
        this.type = type;

        this.light = new Phaser.GameObjects.PointLight(scene, 0, 0, color, radius, intensity)
        this.add(this.light)
        this.face = new Phaser.GameObjects.Sprite(scene, 0, 0, type)
        this.add(this.face)


        this.init();
   }

   getTypes () {
       return Object.keys(TYPES);
   }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            intensity: {from: 0.3, to: 0.7},
            repeat: -1
        });
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "visitor", score, 30).setDropShadow(0, 3, 0x222222, 0.9).setTint(color).setOrigin(0.5).setDropShadow(2, 3, 0xffffff, 0.7);;
        this.scene.tweens.add({
            targets: text,
            duration: 800,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 20, to: this.y - 80},
            onComplete: () => {
                text.destroy()
            }
        });
    }

    update() {
        if (Phaser.Math.Between(0, 6) > 5)
            this.scene.trailLayer.add(new Trail(this.scene, this.x, this.y, this.type))
    }
}
