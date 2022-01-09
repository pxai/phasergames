class ActivatePoint extends Phaser.GameObjects.Rectangle {
  constructor (scene, x, y, name) {
      super(scene, x, y, 32, 32, 0xffffff);
      this.scene = scene;
      this.name = name;
      this.setAlpha(0);
      this.x = x;
      this.y = y;
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.immovable = true;
      this.body.moves = false;
   }

  disable () {
      this.visible = false;
      this.destroy();
  } 

  destroy() {
      super.destroy();
  }
}

export default ActivatePoint;
