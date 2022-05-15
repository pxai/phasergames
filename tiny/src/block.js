import { Particle } from "./particle";

export default class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction = 3, defaultVelocity=100) {
        super(scene, x, y , "block");
        this.scene = scene;
        this.name = "block_red";
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.setSize(32, 32)
        //this.body.moves = false;
        this.active = false;
        this.setListeners();
        this.setKeys();
        this.init();
        this.defaultVelocity = defaultVelocity;
        this.direction = direction;
        this.scene.events.on("update", this.update, this);

    }

    init () {
      this.scene.anims.create({
        key: "block",
        frames: this.scene.anims.generateFrameNumbers("block", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });

      this.anims.play("block", true)
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
    this.angle += 90;
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
    this.scene.playRandom("change")
    if (this.scene.activeBlock) this.scene.activeBlock.deactivate();
    this.active = true;
    this.scene.activeBlock = this;
  }

  deactivate () {
    this.active = false;
  }

    update() {
      if (!this.active) return;
      if (Phaser.Input.Keyboard.JustUp(this.S) && this.canMoveDown()) {
        this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.y += 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.W) && this.canMoveUp()) {
        this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.y -= 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.D) && this.canMoveRight()) {
        this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.x += 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.A) && this.canMoveLeft()) {
        this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.x -= 32;
      }
    }

    canMoveDown() {
      const tile = this.scene.platform.getTileAtWorldXY(this.x, this.y + 32);
      console.log("Is there any tile DOWN?", tile)
      return !tile;
    }

    canMoveUp() {
      const tile = this.scene.platform.getTileAtWorldXY(this.x, this.y - 32);
      console.log("Is there any tile Up?", tile)

      return !tile;
    }

    canMoveLeft() {      
      const tile = this.scene.platform.getTileAtWorldXY(this.x - 32, this.y );
      console.log("Is there any tile left?", tile)
      return !tile;
    }

    canMoveRight() {
      const tile = this.scene.platform.getTileAtWorldXY(this.x + 32, this.y );
      console.log("Is there any tile right?", tile)
      return !tile;
    }
}
