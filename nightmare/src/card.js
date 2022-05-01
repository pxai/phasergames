import { Particle } from "./particle";
import HealthBar from "./health_bar";

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
        this.healthBar = new HealthBar(this.scene, this, 64, 64, 100);
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
        this.card.on("pointerdown", (pointer) => {
            if (this.canApply()) {
                this.scene.resolveCard(this, pointer);
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
            this.card.setTint(0xffffff);
            this.scene.setDefaultCursor();
        });
    }

    resolve (pointer) {
       // this.removeCardImage();
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
                this.resolveFoe(pointer); break;
            default: this.resolveEmpty(); break;
        }
    }

    resolveEmpty () {
        this.scene.playAudio("blip");
        this.scene.updateAmmo(1);
        this.resolved = true;
    }

    resolveAmmo () {
        this.scene.playAudio("pick");
        this.cardImage.setVisible(false);
        this.scene.updateAmmo(this.tile.ammo.amount);
        this.resolved = true;
    }

    resolveHealth () {
        this.scene.playAudio("pick");
        this.cardImage.setVisible(false);
        this.scene.updateHealth(this.tile.health);
        this.resolved = true;
    }

    resolveArmor () {
        this.scene.playAudio("pick");
        this.cardImage.setVisible(false);
        this.scene.updateArmor(this.tile.armor);
        this.resolved = true;
    }

    resolveWeapon () {
        this.scene.playAudio("weapon");
        this.scene.showtemporaryHelpText("Hit numbers [1..7] to change weapon")
        this.cardImage.setVisible(false);
        this.scene.player.pickWeapon(this.tile.weapon);
        this.scene.updateAmmo(this.tile.weapon.ammo)
        this.scene.weaponImage.setTexture(this.tile.weapon.name)
        this.resolved = true;
    }

    resolveFoe (pointer) {
        const damage = this.scene.player.shoot();
        this.tile.foe.health -= damage;
        this.addDamageEffect(pointer, damage);

        const extraDamage = ["fist", "chainsaw"].includes(this.scene.player.currentWeapon.name) ? 10 : 0;
        this.scene.player.takeDamage(this.tile.foe.damage + extraDamage)

        if (this.tile.foe.health <= 0) {
         //   console.log("FOE KILLED!")
            this.cardImage.setVisible(false);
            this.resolved = true;
        }
    }

    addDamageEffect(pointer, damage) {
        this.scene.tweens.add({
            targets: [this.card],
            duration: 100,
            repeat: 5,
            scale: { from: 1.1, to: 1 },
            alpha: { from: 0.7, to: 1}
        })

        //this.healthBar.decrease(damage)
        /*this.scene.tweens.add({
          targets: this.healthBar.bar,
          duration: 1000,
          alpha: {
            from: 1,
            to: 0
          },
        });*/

        Array(20).fill(0).forEach((_,i) => new Particle(this.scene, pointer.worldX, pointer.worldY, 0x000000));
    }

    resolveExit () {
        // TODO: take damage!
        this.scene.playAudio("teleport");
        this.cardImage.setVisible(false);
        this.scene.time.delayedCall(1000, () => { this.scene.finishScene()}, null, this)
        this.resolved = true;
    }


    animationComplete(animation, frame) {
        if (animation.key === "flip" && !this.resolved) {
            this.card.anims.play("white", true)
            this.card.setTint(0xffffff);
          this.addCardImage();
        }
    }
}

