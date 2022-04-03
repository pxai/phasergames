export class Steam {
    constructor (scene, x, y, width=12, height=12, type="down") {
        this.scene = scene;
        this.type = type;
        this.x = x + Phaser.Math.Between(-3, 3);
        this.y = y + Phaser.Math.Between(-3, 3);
        const changeSize = Phaser.Math.Between(-5, 0);
        width +=  changeSize;
        height +=  changeSize;

        let rect = this.scene.add.rectangle(x, y, width, height, 0xffffff, 1);
        this.scene.matter.add.gameObject(rect,  {density: 0.01})

        this.scene.tweens.add({
          targets: rect,
          duration: 500,
          scale: { from: 1, to: 2},
          alpha: { from: 1, to: 0},
          onComplete: () => {
            rect.destroy();
          }
        })
     }
  }

  export class Explosion extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width, height, chain = false ) {
        width = width || Phaser.Math.Between(60, 95)
        height = height || Phaser.Math.Between(60, 95)
        super(scene, x, y, width, height, 0x000000)
        this.setAlpha(0)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.chain = false;
       // this.body.setVelocityY(-100);
        this.init();
        this.scene.waves.add(new Wave(this.scene, x, y))
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
      const width = Phaser.Math.Between(200, 400)
      super(scene, x, y, width, 10, 0x000000)
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
 

 
  
  