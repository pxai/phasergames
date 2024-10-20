import { Particle } from "./particle";
import Block from "./block";

export default class Switch extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name, turn = false) {
        super(scene, x + 16, y + 16, name );
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.setOrigin(0.5)
        this.scene.events.on("update", this.update, this);
        if (turn) this.rotation += Math.PI / 2;
        this.setListeners();
    }

  setListeners () {
    this.setInteractive();
    this.on("pointerdown", (pointer) => {
      this.scene.playAudio("switch")
      
      this.setTint(0x306070);
      this.rotation += Math.PI / 2;
      this.scene.updateMoves()
      this.scene.rearrange();
    });

    this.on("pointerover", () => {
      this.scene.playAudio("hover")
      this.setTint(0x306070);
    });

    this.on("pointerout", () => {
      this.clearTint();
    });
  }

    update() {
      if (!this.active) return;
      
    }
}
