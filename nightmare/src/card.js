export default class Card extends Phaser.GameObjects.Container {
    constructor (scene, x, y, tile, index = 0) {
        super(scene, x, y) //"cards", index);

        this.scene = scene;

        this.tile = tile;
        this.index = index;

        this.scene.add.existing(this);

        this.card = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cards", index).setTint(this.scene.primaryColor).setOrigin(0.5);
        this.scene.add.existing(this.card) // Apparently mecessary if you want to animate
        this.add(this.card)
        this.init();
        this.addListeners();
        this.resolved = false;
    }

    init () {
        this.scene.anims.create({
            key: "back",
            frames: this.scene.anims.generateFrameNumbers("cards", { start: 0, end: 0 }),
            frameRate: 1,
        });
        this.scene.anims.create({
            key: "white",
            frames: this.scene.anims.generateFrameNumbers("cards", { start: 2, end: 2 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "flip",
            frames: this.scene.anims.generateFrameNumbers("cards", { start: 4, end: 10 }),
            frameRate: 10,
        });

        this.card.anims.play("back", true);
        this.card.on('animationcomplete', this.animationComplete, this);
    }

    addCardImage() {
       if (this.tile.name === "empty") return;

       this.cardImage =  new Phaser.GameObjects.Sprite(this.scene, 0, 0, this.tile.sprite).setScale(0.5).setTint(this.scene.primaryColor).setOrigin(0.5);

       this.add(this.cardImage)

    }

    removeCardImage () {
        if (this.tile.name === "empty") return;

        this.cardImage.destroy();
    }

    canApply () {
        return true;
        // This is hard because player may create islands
        /*return Math.abs(this.tile.x - this.scene.currentCard.tile.x) < 2 &&
              Math.abs(this.tile.y - this.scene.currentCard.tile.y) < 2;*/
    }

    addListeners () {
        this.card.setInteractive();
        this.card.on("pointerdown", () => {
            if (this.canApply()) {
                this.scene.resolveCard(this);
            } else {
                this.scene.setForbiddenCursor();
            }
        });

        this.card.on("pointerover", () => {
            this.scene.currentCardHelp.setText(this.tile.name)
            if (this.canApply()) {
                this.scene.setPickCursor();
                this.card.setTint(0x3E6875);
                this.card.setScale(1.1)
            } else {
                this.scene.setForbiddenCursor();
            }
        });

        this.card.on("pointerout", () => {
            this.scene.currentCardHelp.setText("")
            this.card.setScale(1)
            this.card.setTint(this.scene.primaryColor);
            this.scene.setDefaultCursor();
        });
    }

    resolve () {
        console.log("Name? ", this.tile.name)
        this.removeCardImage();
        switch (this.tile.name) {
            case "empty": this.resolveEmpty(); break;
            case "ammo": this.resolveAmmo(); break;
            case "health": this.resolveHealth(); break;
            case "armor": this.resolveArmor(); break;
            case "exit": this.resolveExit(); break;
            case "shotgun": 
            case "minigun":
            case "chainsaw":
            case "bfg":
            case "rocketlauncher":
                this.resolveWeapon(); break;
            case "grunt":
            case "shotgun_guy":
            case "minigun_guy":
            case "imp":
            case "demon":
            case "cacodemon":
            case "knight":
            case "mancubus":
            case "cyberdemon":
                this.resolveFoe(); break;
            default: break;
        }
    }

    resolveEmpty () {
        console.log("REsolve emtpy")
        this.scene.updateAmmo(1);
        this.resolved = true;
    }

    resolveAmmo () {
        this.cardImage.setVisible(false);
        console.log("REsolve ammo", this.tile.ammo)
        this.scene.updateAmmo(this.tile.ammo.amount);
        this.resolved = true;
    }

    resolveHealth () {
        this.cardImage.setVisible(false);
        console.log("REsolve health", this.tile.health)
        this.scene.updateHealth(this.tile.health);
        this.resolved = true;
    }

    resolveArmor () {
        this.cardImage.setVisible(false);
        console.log("REsolve armor", this.tile.armor)
        this.scene.updateArmor(this.tile.armor);
        this.resolved = true;
    }

    resolveWeapon () {
        this.cardImage.setVisible(false);
        console.log("REsolve weapon", this.tile.weapon.name)
        this.scene.player.pickWeapon(this.tile.weapon);
        this.scene.weaponImage.setTexture(this.tile.weapon.name)
        this.resolved = true;
    }

    resolveFoe () {
        console.log("REsolve foe", this.tile.foe.name)

        if (this.tile.foe.health <= 0) {
            this.cardImage.setVisible(false);
            this.resolved = true;
        }
    }

    resolveExit () {
        this.cardImage.setVisible(false);
        console.log("REsolve exit", this.tile.name)
        this.scene.time.delayedCall(1000, () => { this.scene.finishScene()}, null, this)
        this.resolved = true;
    }


    animationComplete(animation, frame) {
        if (animation.key === "flip" && !this.resolved) {
            this.card.anims.play("white", true)
          this.addCardImage();
        }
    }
}

