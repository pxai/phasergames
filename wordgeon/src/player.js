

export class Player  extends Phaser.GameObjects.Container {
  constructor (scene, x, y, name = "") {
      super(scene, x, y);
      this.x = x;
      this.y = y;
      this.scene = scene;
      this.letter = letter;

      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.setImmovable(true)
      this.body.setSize(48, 48)
      this.square = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 62, 62, 0xffffff).setOrigin(0.5)
      this.add(this.square);
      this.body.collideWorldBounds = true;
      this.singleLetter = new SingleLetter(this.scene, 0, 0, this.letter)
      this.add(this.singleLetter)
      this.letterLength = 1;
      this.change = 0;
      this.setSize(48, 48)
  }
}

export class Knight extends Player {
  constructor (scene, x, y, name = "") {
    this.class = "Knight"
  }
}

export class Wizard extends Player {
  constructor (scene, x, y, name = "") {
    this.class = "Wizard"
  }
}

export class Elf extends Player {
  constructor (scene, x, y, name = "") {
    this.class = "Elf"
  }
}

export const CLASSES = {
  ELF: "Elf",
  WIZARD: "Wizard",
  KNIGHT: "Knight"
};