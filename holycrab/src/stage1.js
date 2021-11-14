import Phaser from "phaser";
import Crab from "./crab";
import Block from "./block";
import Shell from "./shell";
import Sky from "./sky";
import FoeGenerator from "./foe_generator";
import Water from "./water";

const ALIGN_CENTER = Phaser.GameObjects.BitmapText.ALIGN_CENTER;

export default class Stage1 extends Phaser.Scene {
    constructor (key = "stage1", next = "stage2") {
        super({ key });
        this.key = key;
        this.next = next;
        this.playerLimited = true;
        this.initial = { x: 0, y: 0 };
        this.seaInitial = { x: 0, y: 0 };
        this.cameraSize = { w: 10920 * 2, h: 10080 * 2 }
        this.worldBounds = false;
        this.startBlock = { x: 0, y: 400 }
        this.finishBlock = { x: 2000, y: 400 };
        this.finishSize = 20;
        this.arrowAngle = 0;
        this.music = "music0";
    }

    init (data) {
        this.name = data.name;
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBounds(0, 0, this.cameraSize.w, this.cameraSize.h);
        this.cameras.main.setBackgroundColor(0x3E6875);
        this.addSky();
        this.setCrabs();
        this.setWorldBounds();
        this.setStartBlock();
        this.setShells();
        this.setKeys();
        this.playMusic();
        this.addFoes();
        this.addWater();
        this.loadAudios();
        this.setScores();

        this.showInstructions();
        this.cameras.main.startFollow(this.crab, true);
    }

    setCrabs () {
        this.crabs = this.add.group();
        this.crab = new Crab(this, this.initial.x + 60,  this.initial.y + 20, "crab", this.playerLimited);
        this.crabs.add(this.crab);
    }

    setWorldBounds () {
        if (this.worldBounds) {
            this.crab.body.setCollideWorldBounds(true);
            this.crab.body.setBounce(1);
            if (this.crab2) {
                this.crab2.body.setCollideWorldBounds(true);
                this.crab2.body.setBounce(1); 
            }
        }
        this.physics.world.setBoundsCollision(true, true, false, false);
    }

    addWater() {
        this.water = new Water(this);
        this.colliderActivated = true;
        this.waterCollider = this.physics.add.collider(this.crabs, this.water.surface, this.hitSurface, () => {
            return this.colliderActivated;
        }, this);
    }

    addFoes () {
        this.foeGenerator = new FoeGenerator(this);

        this.foeCollider = this.physics.add.collider(this.crabs, this.foeGenerator.foeGroup, this.hitFoe, () => {
            return true;
        }, this);

        this.physics.add.collider(this.shells, this.foeGenerator.foeGroup, this.foeHitShell, () => {
            return true;
        }, this);

        this.time.delayedCall(5000, () => {  this.foeGenerator.generate() })
    }

    setStartBlock () {
        this.blocks = this.add.group();
        const {x, y} = this.startBlock;
        [0, 1, 2, 3, 4, 5].forEach( (block, i) => {
            this.blocks.add(new Block(this, x + (i * 32), y))
        });
        this.colliderActivated = true;
        this.blockCollider = this.physics.add.collider(this.crabs, this.blocks, this.hitBlock, () => {
            return this.colliderActivated;
        }, this);

        this.setFinishBlock();
    }

    setFinishBlock() {
        const { x, y } = this.finishBlock;
        Array(this.finishSize).fill(0).forEach( (block, i) => {
            this.blocks.add(new Block(this, x + (i * 32), y, true))
        });
    }

    setShells () {
        this.shells = this.add.group();
        this.colliderActivated = true;
        this.physics.add.collider(this.crabs, this.shells, this.hitShell, () => {
            return this.colliderActivated;
        }, this);
    }

    hitBlock(crab, block) {
        if (crab.body.speed > 0) {
            crab.hitGround()
            if (block.finish) {
                block.touched(crab);
                console.log("Completed?");
                this.stageCompleted()
            }
        }
    }

    hitShell(crab, shell) {
        this.playAudio("shell");
        crab.hitShell(shell);
        shell.touched(crab);
        this.playAudio("jump");
    }

    foeHitShell(shell, foe) {
        this.playAudio("hit");
        foe.turn();
        shell.destroy();
    }

    hitSurface(crab, surface) {
        this.cameras.main.shake(500);
        this.playAudio("explosion");
        crab.hit(-1000);
        this.foeGenerator.pause();
        this.time.delayedCall(3000, () => {  this.foeGenerator.generate() })
    }

    hitFoe(crab, foe) {
        this.cameras.main.shake(500);
        this.playAudio("hit");
        crab.hit(-500);
        foe.turn();
        this.foeGenerator.pause();
        this.time.delayedCall(3000, () => {  this.foeGenerator.generate() })
    }

    addSky() {
        this.sky = new Sky(this);
    }

    setBlock (pointer) {
        if (this.shells.children.entries.length === 2) return;
        this.playAudio("block");
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
        const {x, y} = this.midPoint;
        this.instructions = this.add.bitmapText(x, y - 200, "arcade", "Click to place a shell\nbelow the crab!", 30, ALIGN_CENTER).setOrigin(0.5).setScrollFactor(0)
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
        const {x, y} = this.midPoint;
        this.spaceInstructions = this.add.bitmapText(x, y + 100, "arcade", "Keep on doing it\nuntil the platform!", 30, ALIGN_CENTER).setOrigin(0.5).setScrollFactor(0)
        this.arrow = this.add.image(x, y - 100, "arrow").setOrigin(0.5).setScrollFactor(0).setAngle(this.arrowAngle).setScale(3)

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


    update () {
        if (this.ESC.isDown) {
            this.changeScreen("splash")
        }

        this.sky.update();
        this.crabs.children.entries.forEach( crab => crab.update() );
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add(this.music, {
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
          "block": this.sound.add("block"),
          "end": this.sound.add("end"),
          "explosion": this.sound.add("explosion"),
          "hit": this.sound.add("hit"),
          "jump": this.sound.add("jump"),
          "shell": this.sound.add("hit"),
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
        this.playAudio("end");
        const {x, y} = this.midPoint;
        this.foeGenerator.stop();
        this.foeCollider.active = false;
        this.stageCompletedText = this.add.bitmapText(x, y - 200, "arcade", "STAGE COMPLETED!!\nSCORE: " + this.registry.get("score"),40, 0xff0000).setOrigin(0.5)
        this.tweens.add({
            targets: this.stageCompletedText,
            duration: 300,
            alpha: {from: 1, to: 0},
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.stageCompletedText.destroy()
                this.finishScene(this.next);
            }
        });
    }

    restartScene () {
        this.finishScene(this.key);
    }

    finishScene (nextScene) {
        if (this.theme) this.theme.stop();
        this.water.stop();
        this.sky.stop();
        this.scene.start("transition", {next: nextScene, name: "STAGE"});
    }

    get midPoint () {
        return{ x: this.cameras.main.worldView.x + this.cameras.main.width / 2,
                y: this.cameras.main.worldView.y + this.cameras.main.height / 2
        };
    }
}
