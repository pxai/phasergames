import { Particle } from "./particle";
import Block from "./block";

export default class BlockGroup extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width=2, height=3, defaultVelocity=100) {
        super(scene, x, y );
        this.scene = scene;
        this.id = Math.random();
        this.name = "block_blue";
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.width = width;
        this.height = height;
        //this.body.setSize(32, 32)
        //this.body.moves = false;
        this.active = false;
          this.setKeys();
        this.defaultVelocity = defaultVelocity;
        this.createBlock()

        this.allowChangeDirection = true;
        this.scene.events.on("update", this.update, this);
        this.setListeners();
    }

    createBlock () {
      this.body.setSize(this.width * 32, this.height * 32)

      for(let i=0;i<this.width; i++) {
        for(let j=0;j< this.height; j++) {
          this.add(new Block(this.scene, i * 32, j * 32, this.name))
        }
      }
    }

    setKeys() {

      this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.scene.events.on("update", this.update, this);
  }

  setListeners () {
    this.setInteractive(new Phaser.Geom.Rectangle(0,0,64, 96), Phaser.Geom.Rectangle.Contains);
    this.on("pointerdown", (pointer) => {
      console.log("Click")
      //this.setTint(0x00ff00)
      this.activate()
    });

    this.on("pointerover", () => {
      console.log("OVER")
      //this.setTint(0x3E6875);
      //this.setScale(1.1)
    });

    this.on("pointerout", () => {
      console.log("OUT")
      //this.clearTint();
        this.setScale(1)
        //if (!this.active) this.sprite.
    });
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
        //this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.y += 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.W) && this.canMoveUp()) {
        //this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.y -= 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.D) && this.canMoveRight()) {
        //this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.x += 32;
      } else if (Phaser.Input.Keyboard.JustUp(this.A) && this.canMoveLeft()) {
        //this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y));
        this.x -= 32;
      }
    }

    isOverlap (x = 0, y = 0) {
      const overlaps = this.scene.blocks.children.entries.map((block) => {
        if (block.id === this.id) return false;

        let myBounds = this.getBounds();
        let otherBounds = block.getBounds();
        /*myBounds.x += x;
        myBounds.y += y;*/
        const intersect = Phaser.Geom.Intersects.RectangleToRectangle(myBounds, otherBounds);
        console.log("ET SEE: ", intersect, myBounds, otherBounds, block.name, this.name)
        return intersect;
      })
      return !overlaps.every(block => !block)
    }

    canMoveDown(distance = 32) {
      if (this.isOverlap(0, 1)) return false;
      distance = this.height * 32;
      const blocks = Array(this.width).fill(0).map( (_, i) => {
        return this.scene.platform.getTileAtWorldXY(this.x + (i*32), this.y + distance)
      })

      return blocks.every(block => !block)
    }

    canMoveUp(distance = 32) {
      if (this.isOverlap(0, -1)) return false;
      const tile = this.scene.platform.getTileAtWorldXY(this.x, this.y - distance);

      return !tile;
    }

    canMoveLeft(distance = 32) {   
      if (this.isOverlap(-1, 0)) return false;   

      const tile = this.scene.platform.getTileAtWorldXY(this.x - distance, this.y );
      return !tile;
    }

    canMoveRight(distance = 32) {
      if (this.isOverlap(1, 0)) return false;
      distance = this.width * 32;
      const tile = this.scene.platform.getTileAtWorldXY(this.x + distance, this.y );
      return !tile;
    }
}
