import Utils from "./utils";
import Hole from "./hole";

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
        //this.scene.events.on("update", this.update, this);
        console.log("So: ", !this.body.touching.none && !this.body.wasTouching.none)
    }

    showNote (note) {
        const objectText = this.scene.add.bitmapText(this.x, this.y, "pico", note, 15 )
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
        const objectText = this.scene.add.bitmapText(this.x - 128, this.y - 64, "pico", note, 25 )
        this.scene.tweens.add({
            targets: objectText,
            alpha: {from: 0.8, to: 1},
            duration: 100,
            repeat: 5
        })
    }

    useRadio() {
        console.log("Playing : ", this.description, this.extra)
        this.officerAudio = this.scene.sound.add(this.description)
        this.officerAudio.play();
        this.officerAudio.on('complete', function () {
            if (!this.extra)
                this.scene.sound.add(this.extra).play();
        }.bind(this))
    }

    exitScene () {
        this.showExit(this.description)
        this.showNote(this.extra)
        console.log("Exit!;: ", this.name, this.description)
        this.scene.finishScene();
    }

    update () {

    }

    activateHole () {
        this.scene.holes.add(new Hole(this.scene, this.x + 64, this.y + 64))
    }

    touch () {
        switch (this.type) {
            case "note":
                this.showNote(this.description);
                break;
            case "radio":
                this.useRadio();
                break;
            case "exit":
                this.exitScene();
                break;
            case "hole":
                this.activateHole();
                break;
            default:
                break;
        }
    }
  }