class SpriteButton extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name, description, action) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.description = description;
        this.action = action;

        this.scene.add.existing(this)

        this.nameText = this.scene.add.bitmapText(this.x, this.y - 64, "pixelFont", this.name, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
        this.nameText.visible = false;

        this.descriptionText = this.scene.add.bitmapText(this.x, this.y + 64, "pixelFont", this.description, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
        this.descriptionText.visible = false;

        this.setListeners();
     }

     setListeners () {
          this.setInteractive();
        this.on("pointerdown", (pointer) => {
            this.action();
        });
      
          this.on("pointerover", () => {
            this.nameText.visible = true;
            this.descriptionText.visible = true;

            this.setTint(0x3E6875);

            if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = false;
          });
      
          this.on("pointerout", () => {
            this.nameText.visible = false;
            this.descriptionText.visible = false;

            if (this.scene.currentBlockSprite) this.scene.currentBlockSprite.visible = true;
            this.clearTint();
          });
     }
  }
  
  export default SpriteButton;