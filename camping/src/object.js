import Hole from "./hole";
import Braun from "./braun";

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
            this.scene.add.sprite(x, y, "player", 3)
            console.log("Added bobby!", x, y)
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
            alpha: {from: 0.8, to: 1},
            duration: 100,
            repeat: 5
        })
    }

    useRadio() {
        this.officerAudio = this.scene.sound.add(this.description)
        this.officerAudio.play();
        this.officerAudio.on('complete', function () {
            this.scene.playRandomStatic();
            if (this.extra)
                this.scene.sound.add(this.extra).play();
        }.bind(this))
    }

    exitScene () {
        this.showExit(this.description)
        this.showNote(this.extra)
        this.scene.finishScene();
    }

    useOxygen () {
        this.showNote("Oxygen supplies!")
        this.scene.player.oxygen = 100;
        this.scene.updateOxygen();
        this.scene.playAudio("oxygen")
    }

    revealEnding () {
        const ohmy = this.scene.sound.add("ohmygod")
        ohmy.play();
        this.scene.cameras.main.shake(3000)
        //this.showExit(this.description)
        this.scene.sound.add("monster").play({volume: 1.5, rate: 0.8})
        const monster = this.scene.add.sprite(this.x + 128, this.y + 128, "monster").setOrigin(0.5)
        this.scene.anims.create({
            key: "monster",
            frames: this.scene.anims.generateFrameNumbers("monster", { start: 0, end: 5 }),
            frameRate: 3
          });
          monster.anims.play("monster", true)
        ohmy.on('complete', function () {
            //log("Dale fin")
            this.scene.playAudio("holeshout")
            this.scene.finishScene("transition",false);
        }.bind(this))
    }

    update () {

    }

    activateHole () {
        this.scene.holes.add(new Hole(this.scene, this.x + 64, this.y + 64))
    }

    activateBraun () {
        this.showExit(this.description)
        this.scene.playAudio("shock")
        new Braun(this.scene, this.x + 128, this.y + 64).setPipeline('Light2D');
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
            case "oxygen":
                this.useOxygen();
                break;
            case "braun":
                this.activateBraun();
                break;
            case "ending":
                this.revealEnding();
                break;
            case "bobby":
                this.revealEnding();
                break;
            default:
                break;
        }
    }
  }