export default class Object extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, type, description) {
        super(scene, x, y, 64 * 3, 64 * 3)
        this.setOrigin(0)
        this.type = type;
        this.description = description;
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.activated = false;
        //this.scene.events.on("update", this.update, this);
        console.log("So: ", !this.body.touching.none && !this.body.wasTouching.none)
    }

    showNote () {
        console.log("This is name;: ", !this.body.touching.none && !this.body.wasTouching.none, this.body , this.name, this.description)
    }

    exitScene () {
        console.log("Exit!;: ", this.name, this.description)
        this.scene.finishScene();
    }

    update () {

    }

    touch () {
        switch (this.type) {
            case "note":
                this.showNote();
                break;
            case "exit":
                this.exitScene();
                break;
            default:
                break;
        }
    }
  }