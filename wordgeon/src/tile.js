import LETTERS from './letters';

export class Tile extends Phaser.GameObjects.Container {
  constructor (scene, x, y, tile) {
      super(scene, x, y);
      this.x = x;
      this.y = y;
      this.scene = scene;
      this.letter = tile.letter;
      this.dungeonTile = tile;
      this.points = LETTERS[this.scene.lang || 'en'][this.letter]
      this.selected = false

      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.setImmovable(true)
      this.body.setSize(48, 48)
      this.square = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 62, 62, 0xffffff).setOrigin(0.5)
      this.add(this.square);
      this.body.collideWorldBounds = true;
      this.singleLetter = new SingleLetter(this.scene, 0, 0, this.letter, this.points)
      this.add(this.singleLetter)
      this.letterLength = 1;
      this.change = 0;
      this.setSize(48, 48)
  }

  setTint (color) {
      this.square.setFillStyle(color);
  }

  setText(text) {
    this.singleLetter.setLetter(text)
  }

  setFoe (foe) {
    this.foe = foe;
  }

  setChest(chest) {
    this.chest = chest;
  }

  toggle () {
    console.log("Log in Tile Class")
    this.selected = !this.selected
  }

  show () {
    return `[${this.x},${this.y}: ${this.letter}] ${this.selected ? 'SELECTED' : 'unselected'}`;
  }

  destroy() {
    if (this.foe) this.killFoe();
    super.destroy();
  }

  killFoe () {

    this.foe.destroy();
  }
}

export class PlayerCard extends Tile {
    constructor (scene, x, y, card, index) {
        super(scene, x, y, card);
        this.type = "playerCard";
        this.index = index;
    }

    blink () {
        this.scene.tweens.add({
            targets: this,
            duration: 50,
            alpha: {from: 1, to: 0.2},
            repeat: 10,
            onComplete: () => { this.destroy()  }
        });
    }
}

export class SingleLetter extends Phaser.GameObjects.Container {
  constructor (scene, x, y, letter = "", points= "", font = "pixelFont") {
      super(scene, x, y);
      this.x = x;
      this.y = y;
      this.scene = scene
      this.letter = letter;
      this.points = points;
      this.name = "SingleLetter";
      this.createCarvedText(this.letter.toUpperCase(), font)
      this.createCarvedPoints(this.points, font)
  }

    createCarvedText(text, font, size = 52) {
    // Upper inner wall of the carving
    const shadow = new Phaser.GameObjects.BitmapText(
        this.scene,
        0,
        -4,
        font,
        text,
        size
    )
        .setOrigin(0.5)
        .setTint(0x111111).setAlpha(0.8);

    // Floor of the carved area
    const main = new Phaser.GameObjects.BitmapText(
        this.scene,
        0,
        0,
        font,
        text,
        size
    )
        .setOrigin(0.5)
        .setTint(0x777777);

    this.add([shadow, main]);

    return main;
    }


    createCarvedPoints(text, font, size = 32) {
    // Upper inner wall of the carving
    const shadow = new Phaser.GameObjects.BitmapText(
        this.scene,
        18,
        10,
        font,
        text,
        size
    )
        .setOrigin(0.5)
        .setTint(0x111111).setAlpha(0.8);

    // Floor of the carved area
    const main = new Phaser.GameObjects.BitmapText(
        this.scene,
        18,
        12,
        font,
        text,
        size
    )
        .setOrigin(0.5)
        .setTint(0x777777);

    this.add([shadow, main]);

    return main;
    }

  setLetter (letter) {
      this.letter = letter;
      this.letterText.setText(this.letter['letter']);
  }
}
