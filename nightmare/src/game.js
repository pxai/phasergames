import Stage from "./stage";
import sounds from "./sounds";
import Card from "./card";
import Player from "./player";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
    }

    preload () {
        this.ammo = +this.registry.get("ammo");
        this.health = +this.registry.get("health");
        this.armor = +this.registry.get("armor");
        this.primaryColor = this.registry.get("primaryColor");
        this.secondaryColor = this.registry.get("secondaryColor");
        this.tertiaryColor = this.registry.get("tertiaryColor");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(this.secondaryColor); // - 0x2f2f2f);
        this.addPointer();
        this.addPlayer();
        this.addDeck();
        this.addStage();
        this.addStatus();
        this.setKeys();
        this.loadAudios();
        // this.playMusic();
        this.playAudio("door_open")
        this.showtemporaryHelpText("Click all cards to clear the room")
    }

    setKeys() {
        this.ONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.TWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO); // gun
        this.THREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE); // shotgun
        this.FOUR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR); // minigun
        this.FIVE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE); // rocketlauncher
        this.SIX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX); // bfg
        this.SEVEN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN); // chainsaw
    }

    addPlayer () {
        this.player = new Player(this, this.health, this.ammo, this.armor)
    }

    addStage () {
        this.totalResolved = 0;
        this.stage = new Stage("Sample stage")
        this.tiles = {};
        this.currentCard = null;
        for (let x = 0; x < this.stage.width; x++) {
            this.tiles =  {[x]: {}, ...this.tiles};
            for (let y = 0; y < this.stage.height; y++) {
                let card = new Card(this, 64, 64, this.stage.tiles[x][y])

                this.tiles[x] =  {[y]: card, ...this.tiles[x] };
                this.currentCard = card;
            }
        }

        const timeline = this.tweens.createTimeline();
        timeline.add({
            targets: [this.tiles[this.stage.width-1][this.stage.height-1]],
            scale: {from: 1.1, to: 1},
            duration: 500
        })

        for (let x = 0; x < this.stage.width; x++) {
            for (let y = 0; y < this.stage.height; y++) {
                timeline.add({
                    targets: [this.tiles[x][y]],
                    duration: 200,
                    x: {from: 64, to: 256 + (x * 100) },
                    y: {from: 64, to: 128 + (y * 128)},
                    onComplete: () => {
                        this.tiles[x][y].card.play("flip", true);
                        this.playAudio("flip", 1)
                    }
                })
            }
        }

        timeline.play();
    }

    addStatus() {
        this.temporaryHelpText = this.add.bitmapText(this.center_width, this.height - 120, "doomed", "", 24).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.currentCardHelp = this.add.bitmapText(this.center_width, 32, "doomed", this.registry.get("name"), 26).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.blockAmmo = this.add.sprite(190, this.height - 32, "block").setOrigin(0.5).setScale(1.2, 0.8).setTint(this.primaryColor);
        this.ammoText = this.add.bitmapText(190, this.height - 64, "doomed", this.player.ammo, 28).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.ammoTextHelp = this.add.bitmapText(190, this.height - 24, "doomed", "AMMO", 14).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.blockHeatlh = this.add.sprite(190 + 120, this.height - 32, "block").setOrigin(0.5).setScale(1.2, 0.8).setTint(this.primaryColor);
        this.healthText = this.add.bitmapText(190 + 120, this.height - 64, "doomed", this.player.health+"%", 28).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.healthTextHelp = this.add.bitmapText(190 + 120, this.height - 24, "doomed", "HEALTH", 14).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.blockWeapon = this.add.sprite(190 + 120 + 120, this.height - 32, "block").setOrigin(0.5).setScale(1.2, 0.8).setTint(this.primaryColor);
        //this.weaponText = this.add.bitmapText(190 + 120 + 120, this.height - 64, "doomed", "FIST", 20).setOrigin(0.5).setTint(this.primaryColor);
        this.weaponTextHelp = this.add.bitmapText(190 + 120 + 120, this.height - 24, "doomed", "WEAPON", 14).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.weaponImage = this.add.sprite(190 + 120 + 120, this.height - 48, this.registry.get("currentWeapon")).setOrigin(0.5).setTint(this.primaryColor).setScale(0.5);
        this.addDoomguy();
        this.blockArmor = this.add.sprite(190 + 120 + 120 + 96 + 124, this.height - 32, "block").setOrigin(0.5).setScale(1.2, 0.8).setTint(this.primaryColor)
        this.armorText = this.add.bitmapText(190 + 120 + 120 + 96 + 124, this.height - 64, "doomed", this.player.armor+"%", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);
        this.armorTextHelp = this.add.bitmapText(190 + 120 + 120 + 96 + 124, this.height - 24, "doomed", "ARMOR", 14).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(1, 2, this.tertiaryColor, 0.8);

        this.blockCards = this.add.sprite(190 + 120 + 120 + 96 + 124 + 120, this.height - 32, "block").setOrigin(0.5).setScale(1.2, 0.8).setTint(this.primaryColor);
    }

    addDoomguy () {
        this.blockFace = this.add.sprite(190 + 120 + 120 + 110, this.height - 48, "doom_heads").setOrigin(0.5).setScale(2.3).setTint(this.primaryColor)
        this.anims.create({
            key: "doomguy100",
            frames: this.anims.generateFrameNumbers("doom_heads", { frames: [ 1, 2, 1, 0 ] }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "doomguy80",
            frames: this.anims.generateFrameNumbers("doom_heads", { frames: [ 10, 11, 10, 9 ] }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "doomguy50",
            frames: this.anims.generateFrameNumbers("doom_heads", { frames: [ 19, 20, 19, 18 ] }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "doomguy25",
            frames: this.anims.generateFrameNumbers("doom_heads", { frames: [ 28, 29, 28, 27 ] }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "doomguy10",
            frames: this.anims.generateFrameNumbers("doom_heads", { frames: [ 37, 38, 37, 36 ] }),
            frameRate: 1,
            repeat: -1
        });
        this.blockFace.anims.play("doomguy100", true)
    }

    updatePlayerHead() {
        if (this.player.health >= 80) {
            this.blockFace.anims.play("doomguy100", true)
        } else if (this.player.health >= 50 && this.player.health < 80) {
            this.blockFace.anims.play("doomguy80", true)
        } else if (this.player.health >= 25 && this.player.health < 50) {
            this.blockFace.anims.play("doomguy50", true)
        } else if (this.player.health >= 10 && this.player.health < 25) {
            this.blockFace.anims.play("doomguy25", true)
        } else if (this.player.health < 10) {
            this.blockFace.anims.play("doomguy10", true)
        }
    }

    showtemporaryHelpText(message) {
        this.temporaryHelpText.setText(message);

        this.tweens.add({
            targets: [this.temporaryHelpText],
            duration: 400,
            repeat: 20,
            alpha: {from: 0.8, to: 1},
            onComplete: () =>{
                this.temporaryHelpText.setText("");
            }
        })
    }

    resolveCard (card, pointer, auto = false) {

        card.resolve(pointer, auto)
        if (card.resolved) {
            this.totalResolved++;
            this.playAudio("flop")
            this.currentCard = card;
            card.card.playReverse("flip", true)
            const destinyX = this.width - 100;
            const destinyY = this.height - 128;
            card.removeInteractive();
    
            this.tweens.add({
                targets: [card],
                x: {from: card.x, to: destinyX},
                y: {from: card.y, to: destinyY},
                duration: 500
            })
    
            if (this.totalResolved === this.stage.length) {
                this.playAudio("door_close")
                this.time.delayedCall(1000, () => { this.finishScene() }, null, this);
            }
        }

        if (this.stageIsSolved()) {
            /*console.log("Stage is solved!")*/
            this.solveIt();
        }

    }

    stageIsSolved () {
        const isAFoe = card => card.tile.foe;
        for (let x = 0; x < this.stage.width; x++) {
            for (let y = 0; y < this.stage.height; y++) {
                if (!this.tiles[x][y].resolved && isAFoe(this.tiles[x][y])) {
                    return false;
                }
            }
        }
        return true;
    }

    solveIt () {
        for (let x = 0; x < this.stage.width; x++) {
            for (let y = 0; y < this.stage.height; y++) {
                if (!this.tiles[x][y].resolved) {
                    this.resolveCard(this.tiles[x][y]);
                }
            }
        }
    }

    addDeck() {
        this.deck = null;
        this.add.sprite(64, 64, "cards").setOrigin(0.5).setTint(this.primaryColor)

        Array(3).fill().forEach((_, i) => {
            this.deck = this.add.sprite(64 + ((i+1) *8), 64 + ((i+1) * 8), "cards", 3).setOrigin(0.5).setTint(this.primaryColor)
        })
    }

    addPointer() {
        this.pointer = this.input.activePointer;
        this.input.mouse.disableContextMenu();
        this.setPickCursor();
    }

    setDefaultCursor() {
        this.input.setDefaultCursor('default');
    }

    setPickCursor() {
        this.input.setDefaultCursor('url(assets/images/pick.png), pointer');
    }

    setForbiddenCursor() {
        this.input.setDefaultCursor('url(assets/images/forbidden.png), pointer');
    }

    loadAudios () {
        this.audios = {};
        sounds.forEach(sound => {
            this.audios[sound] = this.sound.add(sound)
        });
    }

    playAudio (key, volume = 0.7) {
        this.audios[key].play({volume});
    }

    playRandom(key) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          volume: Phaser.Math.Between(0.5, 0.9),
          delay: 0
        });
      }

    playMusic (theme = "game") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
            mute: false,
            volume: 0.7,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
    }

    update () {
        this.updatePointer();

        if (Phaser.Input.Keyboard.JustDown(this.ONE)) {
            this.player.setWeapon("fist");
            this.weaponImage.setTexture("gun");
        } else if (Phaser.Input.Keyboard.JustDown(this.TWO)) {
            this.player.setWeapon("gun");
            this.weaponImage.setTexture("gun");
        } else if (Phaser.Input.Keyboard.JustDown(this.THREE)) {
            this.weaponImage.setTexture(this.player.setWeapon("shotgun") ? "shotgun": "gun");
        } else if (Phaser.Input.Keyboard.JustDown(this.FOUR)) {
            this.weaponImage.setTexture(this.player.setWeapon("minigun") ? "minigun": "gun");
        } else if (Phaser.Input.Keyboard.JustDown(this.FIVE)) {
            this.weaponImage.setTexture(this.player.setWeapon("rocketlauncher") ? "rocketlauncher": "gun");
        } else if (Phaser.Input.Keyboard.JustDown(this.SIX)) {
            this.weaponImage.setTexture(this.player.setWeapon("bfg") ? "bfg": "gun");
        } else if (Phaser.Input.Keyboard.JustDown(this.SEVEN)) {
            this.weaponImage.setTexture(this.player.setWeapon("chainsaw") ? "chainsaw": "gun");
        } 
    }

    updatePointer() {

    }

    finishScene () {
        // this.theme.stop();
        this.scene.start("transition", { next: "underwater", name: "STAGE", number: this.number + 1 });
    }

    gameOver () {
        // this.theme.stop();
        this.game.sound.stopAll();
        this.scene.start("outro", { next: "underwater", name: "STAGE", number: this.number + 1 });
    }

    updateHealth (points = 0) {
        const currentHealth = +this.registry.get("health");
        const pointsToAdd = (currentHealth + points) > 100 ? 100 - currentHealth : points;

        const health = +this.registry.get("health") + pointsToAdd;
        this.player.health = health;
        this.registry.set("health", health);
        this.healthText.setText(health + "%");
        this.tweens.add({
            targets: [this.healthText],
            duration: 100,
            repeat: 5,
            scale: {from: 1.2, to: 1}
        })
    }

    updateAmmo (points = 0) {
        const ammo = +this.registry.get("ammo") + points;
        this.player.ammo = ammo;
        this.registry.set("ammo", ammo);
        this.ammoText.setText(ammo);
        this.tweens.add({
            targets: [this.ammoText],
            duration: 100,
            repeat: 5,
            scale: {from: 1.2, to: 1}
        })
    }

    updateArmor (points = 0) {
        const armor = +this.registry.get("armor");
        const armorToAdd = armor + points > 0 ? points : -armor;

        this.player.armor = armor + armorToAdd;
     //   console.log("Update armor! current: ", armor, " add: ", armorToAdd, " total: ", this.player.armor)
        this.registry.set("armor", armor + armorToAdd);
        this.armorText.setText(+this.registry.get("armor") + "%");
        this.tweens.add({
            targets: [this.armorText],
            duration: 100,
            repeat: 5,
            scale: {from: 1.2, to: 1}
        })
    }

    updateWeapons (weapons) {

        this.registry.set("weapons", weapons);
    }
}
