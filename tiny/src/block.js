export default class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction = 0, defaultVelocity=100) {
        super(scene, x, y , "block_red");
        this.scene = scene;
        this.name = "block_red";
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        //this.body.moves = false;
        this.active = false;
        this.setListeners();
        this.setKeys();
        this.defaultVelocity = defaultVelocity;
        this.direction = direction;
        this.scene.events.on("update", this.update, this);
    }

    setKeys() {

      this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.scene.events.on("update", this.update, this);
  }

  setListeners () {
    this.setInteractive();
    this.on("pointerdown", (pointer) => {
      //this.setTint(0x00ff00)
      this.changeDirection();
      this.activate()
    });

    this.on("pointerover", () => {
      //this.setTint(0x3E6875);
      //this.setScale(1.1)
    });

    this.on("pointerout", () => {
        this.setScale(1)
        //if (!this.active) this.sprite.
    });
  }

  changeDirection () {
    this.direction = (this.direction < 3) ? this.direction + 1 : 0; 
    
    console.log(this.direction)
  }

  getDirection () {
    return [
      {x: 0, y: -this.defaultVelocity},
      {x: this.defaultVelocity, y: 0},
      {x: 0, y: this.defaultVelocity},
      {x: -this.defaultVelocity, y: 0}
    ][this.direction]
  }

  activate () {
    if (this.scene.activeBlock) this.scene.activeBlock.deactivate();
    this.active = true;
    this.scene.activeBlock = this;
  }

  deactivate () {
    this.active = false;
  }

    update() {
      if (!this.active) return;
      if (Phaser.Input.Keyboard.JustUp(this.S)) {
          console.log("Move it")
        this.body.y += 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.W)) {
        this.y -= 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.D)) {
        this.x += 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.A)) {
        this.x -= 32;
      }
    }
}
