import Particle from "./particle";

const TYPES = {
    "chocolate": { color: 0xAF8057, radius: 16, intensity: 0.4 }, 
    "vanila": { color: 0xfff6d5, radius: 16, intensity: 0.4 },
    "fruit": { color: 0x00ff00, radius: 16, intensity: 0.4 },
    "water": { color: 0x0000cc, radius: 16, intensity: 0.4 },
    "foe": { color: 0xffffff, radius: 16, intensity: 0.4 }
};

class FoeShot extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, type = "water", playerName, velocityX = 0, velocityY = -300) {
        const { color, radius, intensity } = TYPES[type];
        super(scene, x, y, color, radius, intensity)

        this.scene = scene;
        this.playerName = playerName;
        this.spawnShadow(x, y, velocityX, velocityY)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setCircle(10);
        this.body.setOffset(6, 9)

        this.init();
   }

   spawnShadow (x, y, velocityX, velocityY) {
    this.shadow = this.scene.add.circle(x + 20, y + 20, 10, 0x000000).setAlpha(0.4)
    this.scene.add.existing(this.shadow);
    this.scene.physics.add.existing(this.shadow);
   }

    init () {
       this.scene.tweens.add({
            targets: this,
            duration: 200,
            intensity: {from: 0.3, to: 0.7},
            repeat: -1
        });
    }

    destroy () {
        this.shadow.destroy();
        super.destroy();
    }
}

export default FoeShot;
