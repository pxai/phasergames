export default class DiamondBlock extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = 0) {
        super(scene, x, y , "block_blue");
        this.scene = scene;
        this.name = "block_blue";
        this.setOrigin(0.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        this.defaultRotation = 15;
        this.body.setAllowRotation();
        this.active = false;
        this.setListeners();
        this.setKeys();
        this.scene.events.on("update", this.update, this);
    }

    setKeys() {
      this.scene.events.on("update", this.update, this);
  }

  setListeners () {
    this.setInteractive();
    this.on("pointerdown", (pointer) => {
      this.setTint(0x00ff00)
      this.angle = 15
      this.body.angle = 45;
      console.log("Rota!", this.rotation, this.angle, this.body.rotation, this.body.angle)
      this.activate()
    });

    this.on("pointerover", () => {
      this.setTint(0x3E6875);
      this.activate();
      this.setScale(1.1)
    });

    this.on("pointerout", () => {
        this.setScale(1)
        this.deactivate();
        //if (!this.active) this.sprite.
    });
  }

  activate () {
    this.active = true;
    this.scene.activeBlock = this;
  }

  deactivate () {
    this.scene.activeBlock = null;
    this.active = false;
  }

    update() {
      if (this.active) {
        this.body.angle = 30;
        console.log("Here we are!", this.body.rotation)
      }

    }
}
