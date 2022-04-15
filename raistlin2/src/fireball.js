import { Particle } from "./particle";

export default class Fireball extends Phaser.GameObjects.PointLight {
    constructor (scene, x, y, color = 0x00cc00, radius = 15, intensity = 0.7) {
        super(scene, x, y, color, radius, intensity)
        this.name = "fireball";
        scene.add.existing(this)
        scene.physics.add.existing(this);
      
        this.body.setCircle(10);
        this.body.setBounce(1)
        this.body.setAllowGravity(false);
        this.init();
    }
    
    init () {
        this.scene.events.on("update", this.update, this);
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            intensity: {from: 0.3, to: 0.7},
            repeat: -1
        });
    }
  
    update() {
        if (this.scene?.gameOver) return;
        if (Phaser.Math.Between(0,5)> 4)
            this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0x00cc00, 10));
    }
  }