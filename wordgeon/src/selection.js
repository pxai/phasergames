import { CLASSES } from './player';


export default class Selection extends Phaser.Scene {
    constructor () {
        super({ key: "selection" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.showList();
        this.add.bitmapText(this.center_width, this.center_height + 100, "pixelFont", "Select charecter", 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 200, "pixelFont", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
    }

    showList () {
        this.addBarbarian()
        this.addWizard()
        this.addElf()
    }

    addBarbarian () {
      this.knightContainer = this.add.container(this.center_width - 50, 100);
      const knight = this.add.sprite(0, 0, "knight").setScale(2)
      const knightText = this.add.bitmapText(50, 0, "pixelFont", "Knight", 30).setOrigin(0)
      const knightDescription = this.add.bitmapText(50, 50, "pixelFont", "Can solve short words, less cards", 20).setOrigin(0.5)

      this.knightContainer.add([knight, knightText,knightDescription])
      const bounds = this.knightContainer.getBounds();
      this.knightContainer.setSize(bounds.width, bounds.height);

      this.knightContainer.setInteractive()
        this.knightContainer.on("pointerup", () => {
          console.log("Selected! ");
          this.elfContainer.destroy()
          this.wizardContainer.destroy()
          this.selectedClass = CLASSES.KNIGHT;
          this.loadGame();
        });
        this.knightContainer.on("pointerover", () => {
          console.log("Knight Over! ");
        });
        this.knightContainer.on("pointerout", () => {
          console.log("Knight out! ");
        });
    }


    addWizard () {
      this.wizardContainer = this.add.container(this.center_width - 50, 200);
      const wizard = this.add.sprite(0, 0, "wizard").setScale(2)
      const wizardText = this.add.bitmapText(50, 0, "pixelFont", "Wizard", 30).setOrigin(0)
      const wizardDescription = this.add.bitmapText(50, 50, "pixelFont", "Can solve short words, less cards", 20).setOrigin(0.5)

      this.wizardContainer.add([wizard, wizardText,wizardDescription])
      const bounds = this.knightContainer.getBounds();
      this.wizardContainer.setSize(bounds.width, bounds.height);

      this.wizardContainer.setInteractive()
        this.wizardContainer.on("pointerup", () => {
          console.log("Selected! ");
          this.elfContainer.destroy()
          this.knightContainer.destroy()
          this.selectedClass = CLASSES.WIZARD;
          this.loadGame()
        });
        this.wizardContainer.on("pointerover", () => {
          console.log("Over! ");
        });
        this.wizardContainer.on("pointerout", () => {
          console.log("Wizard out! ");
        });
    }

    addElf () {
      this.elfContainer = this.add.container(this.center_width - 50, 300);
      const elf = this.add.sprite(0, 0, "elf").setScale(2)
      const elfText = this.add.bitmapText(50, 0, "pixelFont", "Elf", 30).setOrigin(0)
      const elfDescription = this.add.bitmapText(50, 50, "pixelFont", "Can solve short words, less cards", 20).setOrigin(0.5)

      this.elfContainer.add([elf, elfText,elfDescription])
      const bounds = this.elfContainer.getBounds();
      this.elfContainer.setSize(bounds.width, bounds.height);

      this.elfContainer.setInteractive()
        this.elfContainer.on("pointerup", () => {
          console.log("Selected! ");
          this.knightContainer.destroy()
          this.wizardContainer.destroy()
          this.selectedClass = CLASSES.ELF;
          this.loadGame()
        });
        this.elfContainer.on("pointerover", () => {
          console.log("Over! ");
        });
        this.elfContainer.on("pointerout", () => {
          console.log("Elf out! ");
        });
    }

    update () {
    }

    loadGame () {
        this.time.delayedCall(1000, () => this.scene.start("game", { playerClass: this.selectedClass }), null, this);
    }
}
