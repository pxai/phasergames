import Phaser from "phaser";
import Crab from "./crab";
import Block from "./block";
import Shell from "./shell";
import Sky from "./sky";
import FoeGenerator from "./foe_generator";
import Water from "./water";

export default class Stage1 extends Phaser.Scene {
    constructor (key = "stage1", next = "stage2") {
        super({ key });
        this.next = next;
        this.playerLimited = false;
        this.initialPosition = { x: 0, y : 20 }
        this.initial = { x: 0, y: 0 };
    }

    init (data) {
        this.name = data.name;
    }

    preload () {
        this.registry.set("score", 0);
        this.registry.set("health", 100);
        this.registry.set("time", 0);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.clockText = this.add.bitmapText(this.center_width, this.center_height, "arcade", "00:00", 80).setAlpha(0.1).setOrigin(0.5)
        this.cameras.main.setBounds(0, 0, 10920 * 2, 10080 * 2);
        this.cameras.main.setBackgroundColor(0x3E6875);
        this.addSky();
        this.crab = new Crab(this, this.initial.x + 60,  this.initial.y + 20, "crab", this.playerLimited);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.setStartBlock();
        this.setShells();
        this.setKeys();
        //this.playMusic();
        this.addFoes();
        this.addWater();
        //this.loadAudios();
        this.setScores();

        this.showInstructions();
        this.cameras.main.startFollow(this.crab, true);
    }

    addWater() {
        this.water = new Water(this);
        this.colliderActivated = true;
        this.waterCollider = this.physics.add.collider(this.crab, this.water.surface, this.hitSurface, () => {
            return this.colliderActivated;
        }, this);
    }

    addFoes () {
        this.foeGenerator = new FoeGenerator(this);

        this.physics.add.collider(this.crab, this.foeGenerator.foeGroup, this.hitFoe, () => {
            return true;
        }, this);

        this.physics.add.collider(this.shells, this.foeGenerator.foeGroup, this.foeHitShell, () => {
            return true;
        }, this);

        this.time.delayedCall(5000, () => {  this.foeGenerator.generate() })
    }

    setStartBlock () {
        this.blocks = this.add.group();
        const {x, y} = this.initial;
        [0, 1, 2, 3, 4, 5].forEach( (block, i) => {
            this.blocks.add(new Block(this, x + (i * 32), y + 400))
        });
        this.colliderActivated = true;
        this.physics.add.collider(this.crab, this.blocks, this.hitBlock, () => {
            return this.colliderActivated;
        }, this);
        this.time.delayedCall(10000, () => {  this.setFinishBlock() })
    }

    setFinishBlock() {
        [0, 1, 2, 3].forEach( (block, i) => {
            this.blocks.add(new Block(this, this.crab.x + 400 + (i * 32), 400, true))
        });
    }

    setShells () {
        this.shells = this.add.group();
        this.colliderActivated = true;
        this.physics.add.collider(this.crab, this.shells, this.hitShell, () => {
            return this.colliderActivated;
        }, this);
    }

    hitBlock(crab, block) {
        block.touched(crab);
        crab.hitGround()
        if (block.finish) {
            this.stageCompleted()
        }
    }

    hitShell(crab, shell) {
        crab.hitShell(shell);
        shell.touched(crab);
    }

    foeHitShell(shell, foe) {
        foe.turn();
        shell.destroy();
    }

    hitSurface(crab, surface) {
        crab.hit(-1000);
        this.foeGenerator.pause();
        this.time.delayedCall(3000, () => {  this.foeGenerator.generate() })
    }

    hitFoe(crab, foe) {
        crab.hit();
        foe.turn();
        this.foeGenerator.pause();
        this.time.delayedCall(3000, () => {  this.foeGenerator.generate() })
    }

    addSky() {
        this.sky = new Sky(this);
    }

    setBlock (pointer) {
        if (this.shells.children.entries.length === 2) return;
        const shell = new Shell(this, pointer.worldX, pointer.worldY, "shell");
        this.shells.add(shell)
        this.time.delayedCall(1000, () => {  this.shells.remove(shell);shell.destroy(); })
    }

    setKeys () {
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.input.on('pointerdown', (pointer) => this.setBlock(pointer), this);
    }

    setScores() {
        this.scoreText = this.add.bitmapText(this.center_width, 20, "arcade", "SCORE: 0", 20).setOrigin(0.5).setScrollFactor(0)
    }

    showInstructions() {
        this.instructions = this.add.bitmapText(this.center_width, this.center_height - 200, "arcade", "Place a shell with the mouse\nbelow the crab!", 30).setOrigin(0.5).setScrollFactor(0)
        this.tweens.add({
            targets: this.instructions,
            duration: 3000,
            alpha: {from: 1, to: 0},
            onComplete: () => {
                this.instructions.destroy()
                this.showSpaceInstructions()
            }
        });
    }

    showSpaceInstructions() {
        this.spaceInstructions = this.add.bitmapText(this.center_width, this.center_height + 100, "arcade", "Keep on doing it\nuntil the end!", 30).setOrigin(0.5).setScrollFactor(0)
        this.arrow = this.add.image(this.center_width, this.center_height - 100, "arrow").setOrigin(0.5).setScrollFactor(0)

        this.tweens.add({
            targets: [this.spaceInstructions, this.arrow],
            duration: 3000,
            alpha: {from: 1, to: 0},
            onComplete: () => {
                this.spaceInstructions.destroy();
                this.arrow.destroy();
            }
        });
    }

    setGroups () {
        this.sicknessGroup = this.add.group();
        this.blockGroup = this.add.group();
        this.physics.add.overlap(this.sicknessGroup, this.blockGroup, this.blockContact);
    }

    update () {
        if (this.ESC.isDown) {
            this.changeScreen("splash")
        }

        this.sky.update();
        this.crab.update();
    }

    midPoint () {
        return this.cameras.main.midPoint;
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("music0", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.theme.play()
    }

    loadAudios () {
        this.audios = {
          "move": this.sound.add("move"),
          "speed": this.sound.add("speed"),
          "bump": this.sound.add("bump"),
          "cellheart": this.sound.add("cellheart"),
          "destroy": this.sound.add("destroy"),
          "evolve": this.sound.add("evolve"),
        };
      }

    playAudio(key) {
        this.audios[key].play();
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText("SCORE: "+Number(score).toLocaleString());
    }

    stageCompleted () {
        if (this.stageCompletedText) return;
        const {x, y} = this.midPoint();
        this.foeGenerator.stop();
        this.stageCompletedText = this.add.bitmapText(x, y - 200, "arcade", "STAGE COMPLETED!!\nSCORE: " + this.registry.get("score"),40, 0xff0000).setOrigin(0.5)
        this.tweens.add({
            targets: this.stageCompletedText,
            duration: 300,
            alpha: {from: 1, to: 0},
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.stageCompletedText.destroy()
                this.finishScene();
            }
        });
    }

    finishScene () {
        if (this.theme) this.theme.stop();
        this.water.stop();
        this.sky.stop();
        this.scene.start("transition", {next: this.next, name: "STAGE"});
      }
}
