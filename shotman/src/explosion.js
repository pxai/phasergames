export class Explosion extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width, height, chain = false ) {
        width = width || Phaser.Math.Between(80, 115)
        height = height || Phaser.Math.Between(80, 115)
        super(scene, x, y, width, height, 0x000000)
        this.scene = scene;
        this.setAlpha(0)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.chain = false;
       // this.body.setVelocityY(-100);
       this.scene.playRandom("explosion")
       this.scene.waves.add(new Wave(this.scene, x, y))
        this.init();
    }

    init () {
      const light = this.scene.lights.addLight(this.x, this.y, 300).setColor(0xffffff).setIntensity(10.0);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scale: {from: 1, to: 0},
            onComplete: () => { this.destroy();   }
        });
        this.scene.tweens.add({
          targets: light,
          duration: 400,
          scale: {from: 1, to: 0},
          intensity: {from: 10, to: 0},
          onComplete: () => { this.scene.lights.removeLight(light);   }
      });

    }
}

export class Wave extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y ) {
        const width = Phaser.Math.Between(300, 700)
        super(scene, x, y - 32, width, 10, 0x000000)
        this.setAlpha(0)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
  
        this.body.setVelocityY(-800);
        scene.tweens.add({
          targets: this,
          duration: 1000,
          scale: {from: 1, to: 0.9},
          onComplete: () => { this.destroy() }
        })
    }
  }