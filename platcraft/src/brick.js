import { Debris } from "./particle";

class Brick extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="brick0") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0)
        this.setScale(0.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        this.markAsDestroyed = false;
        this.setListeners();
     }

     setListeners () {
        this.setInteractive();
      this.on("pointerdown", (pointer) => {
        if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = false;
            this.remove();
      });

      this.on("pointerover", () => {
        this.setTint(0xff0000);
        if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = false;
      });
  
      this.on("pointerout", () => {

          this.clearTint();
        
        if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = true;
      });
    }

    marked () {
      if (this.markAsDestroyed) return;
      
      this.markAsDestroyed = true;
      this.scene.tweens.add({
        targets: this,
        x: "+=2",
        repeat: 5,
        duration: 200,
        onComplete: () => {
          this.remove();
        }
      })
    }

    remove () {
        this.scene.playAudioRandomly("stone")
        const {x, y} = this;
        Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this.scene, x, y))
        this.destroy();
    }
  }
  
  export default Brick;