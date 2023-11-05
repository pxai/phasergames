
import color from "./color.js"
import { Dust } from "./dust.js";
const FLAG = 13;
export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number = 1) {
        super(scene, x, y, "die", number)
        console.log("Number: ", number)
        this.scene = scene;
        this.setOrigin(0)
        this.setScale(1)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.steps = 0;
        this.stepDelta = 0;
        this.moveDelta = 0;
        this.rate = 0.2;
        this.previousRate = 0.2;
        this.locked = false;

        this.currentDie = number;
        this.sorrounding = [];
        this.init();
    }

    init () {
        this.addControls();
        this.scene.events.on("update", this.update, this);
        this.setTint(color(this.currentDie))
        this.setSorrounds()
    }

    addControls() {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        if (this.scene && this.scene.stageCompleted) return;
        if (this.locked) return;
        this.stepDelta += delta;
        this.moveDelta += delta;

        if ((Phaser.Input.Keyboard.JustDown(this.W) || Phaser.Input.Keyboard.JustDown(this.cursor.up)) && this.canMoveUp()) {
            this.previousTile = this.scene.platform.getTileAtWorldXY(this.x, this.y);
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.setFrame(7)
            this.scene.tweens.add({ targets: this, y: "-=64", duration: 200, onComplete: () => {
                this.locked= false;
                this.step(0);
            }})
            //this.y -= 64;

        } else if ((Phaser.Input.Keyboard.JustDown(this.D) || Phaser.Input.Keyboard.JustDown(this.cursor.right)) && this.canMoveRight()) {
            this.previousTile = this.scene.platform.getTileAtWorldXY(this.x, this.y);
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.setFrame(8)
            this.scene.tweens.add({ targets: this, x: "+=64", duration: 200, onComplete: () => {
                this.locked= false;
                this.step(1);
            }})
            //this.x += 64;


        } else if ((Phaser.Input.Keyboard.JustDown(this.A) || Phaser.Input.Keyboard.JustDown(this.cursor.left)) && this.canMoveLeft()) {
            this.previousTile = this.scene.platform.getTileAtWorldXY(this.x, this.y);
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.setFrame(9)
            this.scene.tweens.add({ targets: this, x: "-=64", duration: 200, onComplete: () => {
                this.locked= false;
                this.step(3);
            }})
            //this.x -= 64;


        } else if ((Phaser.Input.Keyboard.JustDown(this.S) || Phaser.Input.Keyboard.JustDown(this.cursor.down)) && this.canMoveDown())  {
            this.previousTile = this.scene.platform.getTileAtWorldXY(this.x, this.y);
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.setFrame(6)
            this.scene.tweens.add({ targets: this, y: "+=64", duration: 200, onComplete: () => {
                this.locked= false;
                this.step(2);
            }})
        } else if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
            this.scene.finishScene()
            //this.scene.help.rotate(this.currentDie);
            //this.scene.playAudio("blip")
            //this.scene.updateSteps(2);
        }
    }

    canMoveUp() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x, this.y - 1);
        if (nextTile) console.log(nextTile, nextTile?.index, this.currentDie >= nextTile.index - 1 )
        const result = nextTile && nextTile.index > 0 && (this.currentDie >= nextTile.index - 1 || nextTile.index === FLAG) && this.moveDelta > 200;
        if (!result) { this.scene.playAudioRandomly("fail"); return }
        this.pointsWon = nextTile.index;
        return result;
    }

    canMoveRight() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x + 64, this.y);
        console.log(nextTile, nextTile?.index, this.currentDie >= nextTile)
        const result = nextTile && nextTile.index > 0 && (this.currentDie >= nextTile.index - 1 || nextTile.index === FLAG) && this.moveDelta > 200;
        if (!result) { this.scene.playAudioRandomly("fail"); return }
        this.pointsWon = nextTile.index;
       return result;
    }

    canMoveDown() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x, this.y + 64);
        console.log(nextTile, nextTile?.index, this.currentDie >= nextTile)
        const result = nextTile && nextTile.index > 0 && (this.currentDie >= nextTile.index - 1 || nextTile.index === FLAG) && this.moveDelta > 200;
        if (!result) { this.scene.playAudioRandomly("fail"); return }
        this.pointsWon = nextTile.index;
        return result;
    }

    canMoveLeft() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x - 1, this.y);
        console.log(nextTile, nextTile?.index, this.currentDie >= nextTile)
        const result = nextTile && nextTile.index > 0 && (this.currentDie >= nextTile.index - 1 || nextTile.index === FLAG) && this.moveDelta > 200;
        if (!result) { this.scene.playAudioRandomly("fail"); return }
        this.pointsWon = nextTile.index;
        return result;
    }

    step (direction) {
        this.previousTile.setAlpha(0.5);
        this.previousTile.index = 1;
        this.currentDie = this.scene.help.positions[this.currentDie][direction]

        this.setFrame(this.currentDie);
        this.scene.help.setCurrent(this.currentDie);
        this.setTint(this.scene.help.color(this.currentDie))
        //this.steps++;
        //this.scene.smokeLayer.add(new Step(this.scene, x , y))

        this.scene.playStep(this.pointsWon - 1)
        this.scene.updateSteps();
        this.scene.updatePoints(this.pointsWon - 1);
        if (this.pointsWon - 1 > 0)  {
            this.scene.playAudioRandomly("step")
            this.showPoints(`+${this.pointsWon - 1}`, this.scene.help.color(this.pointsWon - 1))
            this.land()
        } else {
            this.scene.playAudio("blip")
        }
        this.setSorrounds()
        //this.scene.smokeLayer.add(new JumpSmoke(this.scene, this.x + (20 * -x) , this.y + 32 + (20 * -y)))
    }

    land () {
        let x = Phaser.Math.Between(-10, 10);
        let y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x +  y, this.y - 16 + y);
        x = Phaser.Math.Between(-10, 10);
        y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x + 32 +y, this.y + y);
        x = Phaser.Math.Between(-10, 10);
        y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x + y, this.y + 32 + y);
        x = Phaser.Math.Between(-10, 10);
        y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x - 32 +y, this.y + y);
      }

    setSorrounds () {
        this.clearSorrounds();
        this.trySetColor(this.scene.platform.getTileAtWorldXY(this.x, this.y - 1)); // up
        this.trySetColor(this.scene.platform.getTileAtWorldXY(this.x + 64, this.y)); // right
        this.trySetColor(this.scene.platform.getTileAtWorldXY(this.x, this.y + 64)); // down
        this.trySetColor(this.scene.platform.getTileAtWorldXY(this.x - 1, this.y)); // left
    }

    clearSorrounds () {
        this.sorrounding.forEach(tile => { tile.tint = 0xffffff })
    }

    trySetColor (tile) {
        if (!tile) return;
        if (tile.index > 0 && tile.index < 7) {
            tile.tint = color(tile.index);
            this.sorrounding.push(tile);
        }
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y, "wendy", score, 40, 0xfffd37).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 1000,
            alpha: {from: 1, to: 0},
            y: {from: text.y - 10, to: text.y - 100}
        });
    }

    death () {
       // this.scene.playAudio("dead");
        this.dead = true;
        this.body.stop();
        this.body.enable = false;
        this.scene.restartScene();
        //this.anims.play("playerdead", true)
    }
}