import Hole from "./hole";
import Braun from "./braun";
import Monster from "./monster";

export default class Object extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, type, description, extra = "") {
        super(scene, x, y, 64 * 3, 64 * 3)
        this.scene = scene;
        this.setOrigin(0)
        this.type = type;
        this.description = description;
        this.extra = extra;
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.activated = false;
        if (this.type === "bobby") {
            this.bobbySprite = this.scene.add.sprite(x + 64, y + 64, "player", 3)
           // console.log("Added bobby!", x, y)
        }

    }

    showNote (note) {
        const objectText = this.scene.add.bitmapText(this.x, this.y, "dark", note, 15 )
        this.scene.tweens.add({
            targets: objectText,
            alpha: {from: 1, to: 0},
            duration: 6000,
            ease: 'Sine',
            onComplete: () => {
                objectText.destroy();
            }
        })
    }

    showExit (note) {
        const objectText = this.scene.add.bitmapText(this.x - 128, this.y - 64, "dark", note, 25 )
        this.scene.tweens.add({
            targets: objectText,
            alpha: {from: 1, to: 0},
            duration: 2000,
        })
    }

    foundBobby() {
        this.showExit("Go back to the tent!")
        this.scene.bobbyIsFound();
        this.bobbySprite.setAlpha(0)
    }

    exitScene () {
        this.showExit(this.description)
        this.showNote(this.extra)
        this.scene.finishScene();
    }


    update () {

    }

    activateHole () {
        this.scene.holes.add(new Hole(this.scene, this.x + 64, this.y + 64))
    }

    activateMonster () {
        this.scene.monsters.add(new Monster(this.scene, this.x + 64, this.y + 64))
    }

    activateBraun () {
        this.showExit(this.description)
        this.scene.playAudio("shock")
        new Braun(this.scene, this.x + 128, this.y + 64).setOrigin(0.5).setPipeline('Light2D').setRotation(Phaser.Math.Between(1, 10));
    }

    touch () {
        switch (this.type) {
            case "note":
                this.showNote(this.description);
                break;
            case "exit":
                this.exitScene();
                break;
            case "hole":
                this.activateHole();
                break;
            case "braun":
                this.activateBraun();
                break;
            case "ending":
                this.activateMonster();
                break;
            case "bobby":
                this.foundBobby();
                break;
            case "tent":
                if (this.scene.foundBobby)
                    this.scene.revealEnding("outro");
                break;
            default:
                break;
        }
    }
  }