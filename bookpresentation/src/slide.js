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
    //this.scene.add.sprite(this.x + 30, this.y + 64, "shot").setOrigin(0).setScrollFactor(0)
    this.background = this.scene.add.rectangle(this.x, this.y, 900, 800, 0x000000).setAlpha(0.8).setOrigin(0)
    //this.shot = this.scene.add.sprite(this.x + 30, this.y + 64, "shot").setOrigin(0).setScrollFactor(0)
  }

  addElements () {
    this.next = new Ember(this.scene, this.x + 900, this.y + 32).setScale(1.2)
    this.title = this.scene.add.bitmapText(this.x + 100, this.y + 120, "pixelFont", this.elements['title'], 52).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0)
    this.next.setInteractive();
    this.next.on('pointerdown', () => {
        this.scene.playAudio("pick")
        this.scene.closeSlide()
    })
    this.paragraphs = this.scene.add.group();
    switch (this.elements.layout) {
      case "text" : this.layoutText(); break;
      case "text and image" : this.layoutTextImage();break;
      case "image" : this.layoutImage();break;
      case "text and video" : this.layoutTextVideo();break;
      default: this.layoutText(); break;
    }
  }

  layoutText () {
    this.paragraphs = this.scene.add.group();
    this.elements.paragraphs.forEach((paragraph, i) => {
      this.paragraphs.add(this.scene.add.bitmapText(this.x + 100, this.y + 220 + (i * 50), "pixelFont", paragraph, 32))
    })
  }

  layoutTextImage () {
    let lastPosition = 0;
    this.elements.paragraphs.forEach((paragraph, i) => {
      this.paragraphs.add(this.scene.add.bitmapText(this.x + 100, this.y + 220 + (i * 50), "pixelFont", paragraph, 32))
      lastPosition = this.y + 220 + (i * 50);
    })
    this.layoutImage(lastPosition + 50)
  }

  layoutImage (offset = 0) {
    this.image = this.scene.add.sprite(this.x + 100, offset, this.elements.image).setOrigin(0)
    console.log("IMAGE added! ", this.image)
  }

  layoutTextVideo () {
    let lastPosition = 0;
    this.elements.paragraphs.forEach((paragraph, i) => {
      this.paragraphs.add(this.scene.add.bitmapText(this.x + 100, this.y + 220 + (i * 50), "pixelFont", paragraph, 32))
      lastPosition = this.y + 220 + (i * 50);
    })
    this.video = this.scene.add.video(this.x + 100, lastPosition + 50, this.elements.video).setOrigin(0)
    this.video.play(true);
  }

  destroyVideo () {
    if (this.video) {
      this.video.stop();
      this.video.destroy();
    }
  }

  destroy () {
    this.next.destroy();
    this.paragraphs.destroy(true);
    if (this.image )this.image.destroy();
    this.destroyVideo();
    this.title.destroy();
    this.background.destroy();
  }
}