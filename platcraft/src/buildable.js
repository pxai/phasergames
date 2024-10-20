class Buildable extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="brick0") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        this.scene.tweens.add({
            targets: this,
            duration: 50,
            x: {from: this.x, to: this.x + Phaser.Math.Between(-7, 7)},
            y: {from: this.y, to: this.y + Phaser.Math.Between(-7, 7)},
            repeat: 5,
        })

        this.setListeners();
     }

     setListeners () {
        this.on("pointerdown", (pointer) => {
            this.setTint(0x00ff00)
          });
      
          this.on("pointerover", () => {
            this.setTint(0x3E6875);
            //this.setScale(1.1)
          });
      
          this.on("pointerout", () => {
            this.clearTint();
              //this.setScale(1)
              //if (!this.active) this.sprite.
          });
     }
  }
  
  export default Buildable;