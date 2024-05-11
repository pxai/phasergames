import Ember from "./ember";

export default class Slide {
  constructor(scene,  number, elements = {}) {
    this.scene = scene;
    this.x = this.scene.cameras.main.worldView.x;
    this.y = this.scene.cameras.main.worldView.y;
    this.number = number;
    this.elements = elements;
    this.addBackground()
    this.addElements()
  }

  addBackground () {
    console.log("Showing SLIDE ", this.number, this.elements)
    this.scene.add.sprite(this.x + 30, this.y + 64, "shot").setOrigin(0).setScrollFactor(0)
    this.background = this.scene.add.rectangle(this.x, this.y, 900, 800, 0x000000).setAlpha(0.8).setOrigin(0)
    //this.shot = this.scene.add.sprite(this.x + 30, this.y + 64, "shot").setOrigin(0).setScrollFactor(0)
  }

  addElements () {
    this.next = new Ember(this.scene, this.x + 900, this.y + 32).setScale(1.2)
    this.title = this.scene.add.bitmapText(this.x + 100, this.y + 120, "pixelFont", this.elements['title'], 32).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0)
    this.next.setInteractive();
    this.next.on('pointerdown', () => {
        this.scene.sound.add("ember").play()
        this.scene.closeSlide()
    })
  }

  destroy () {
    this.next.destroy();
    this.title.destroy();
    this.background.destroy();
  }
}