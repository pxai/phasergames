import { Debris } from "./particle";

class CustomBrick extends Phaser.GameObjects.Sprite {
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
        this.setListeners();
     }

     setListeners () {
        this.setInteractive();
      this.on("pointerdown", (pointer) => {
        this.scene.onABuiltBlock = true;
        if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = false;
            this.remove();
      });

      this.on("pointerover", () => {
        this.setTint(0xff0000);
        this.scene.onABuiltBlock = true;
        if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = false;
      });
  
      this.on("pointerout", () => {

          this.clearTint();
          this.scene.onABuiltBlock = false;
        if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = true;
      });
    }

    remove () {
        this.scene.playAudioRandomly("stone")
        this.scene.recoverCoins(this.name);
        this.scene.onABuiltBlock = false;
        this.scene.buildTime = 0;
        const {x, y} = this;
        Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this.scene, x, y))
        this.destroy();

    }
  }
  
  export default CustomBrick;