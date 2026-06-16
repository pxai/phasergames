export default class Foe extends Phaser.GameObjects.Container {
  constructor (scene, x, y, type = "skeleton") {
      super(scene, x, y);
      this.x = x;
      this.y = y;
      this.scene = scene;
      this.type = type;
      this.opened = false

      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.setImmovable(true)
      this.body.setSize(48, 48)
      this.chestSprite = new Phaser.GameObjects.Sprite(this.scene, 0, -32, "skeleton").setOrigin(0.5).setScale(2)
      this.add(this.chestSprite);
      this.body.collideWorldBounds = true;

      this.letterLength = 1;
      this.change = 0;

        this.scene.tweens.add({
            targets: this.chestSprite,
            duration: 800,
            y: { from: -16, to: -32 },
            repeat: -1,
            yoyo: true
        });
  }

  open () {
    this.opened = true;
  }

  defeated () {

  }

  attack () {

  }
}

