import { JumpSmoke, ShotSmoke } from "./particle";
import Step from "./step";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, oxygen = 100) {
        super(scene, x, y, "player")
        this.scene = scene;
        this.setOrigin(0)
        this.setScale(1)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        //this.body.setSize(45, 45)

        this.dead = false;
        this.init();
        this.shells = 0;
        this.lastDirection = 0;
        this.steps = 0;
        this.stepDelta = 0;
        this.moveDelta = 0;
        this.rate = 0.2;
        this.previousRate = 0.2;
        this.oxygen = oxygen;
    }

    init () {
        this.addControls();
        this.scene.events.on("update", this.update, this);
    }

    addControls() {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        if (this.dead) return;
        this.stepDelta += delta;
        this.moveDelta += delta;

        if ((Phaser.Input.Keyboard.JustDown(this.W) || Phaser.Input.Keyboard.JustDown(this.cursor.up)) && this.canMoveUp()) {
            this.moveDelta = 0;
            const {x, y} = this;
            this.scene.tweens.add({ targets: this, y: "-=64", duration: 200})
            //this.y -= 64;
            this.step(x, y);
        } else if ((Phaser.Input.Keyboard.JustDown(this.D) || Phaser.Input.Keyboard.JustDown(this.cursor.right)) && this.canMoveRight()) {
            this.moveDelta = 0;
            const {x, y} = this;
            this.scene.tweens.add({ targets: this, x: "+=64", duration: 200})
            //this.x += 64;

            this.step(x, y);
        } else if ((Phaser.Input.Keyboard.JustDown(this.A) || Phaser.Input.Keyboard.JustDown(this.cursor.left)) && this.canMoveLeft()) {
            this.moveDelta = 0;
            const {x, y} = this;
            this.scene.tweens.add({ targets: this, x: "-=64", duration: 200})
            //this.x -= 64;

            this.step(x, y);
        } else if ((Phaser.Input.Keyboard.JustDown(this.S) || Phaser.Input.Keyboard.JustDown(this.cursor.down)) && this.canMoveDown())  {            
            this.moveDelta = 0;
            const {x, y} = this;
            this.scene.tweens.add({ targets: this, y: "+=64", duration: 200})
            //this.y += 64;
            this.step(x, y);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) ) {
            if (this.shells > 0) {
                this.scene.playAudio("shot");
                this.shooting = true;
                this.shoot();
            } else {
                this.scene.playAudio("empty");
            }
        }

        this.adaptBreath()
       /* this.scene.playerLight.x = this.x;
        this.scene.playerLight.y = this.y;*/
    }

    canMoveUp() {
        return !this.scene.platform.getTileAtWorldXY(this.x, this.y - 1) && this.moveDelta > 200
    }

    canMoveRight() {
        return !this.scene.platform.getTileAtWorldXY(this.x + 64, this.y) && this.moveDelta > 200
    }

    canMoveDown() {
        return !this.scene.platform.getTileAtWorldXY(this.x, this.y + 64) && this.moveDelta > 200
    }

    canMoveLeft() {
        return !this.scene.platform.getTileAtWorldXY(this.x - 1, this.y) && this.moveDelta > 200
    }

    step (x, y) {
        this.steps++;
        this.scene.smokeLayer.add(new Step(this.scene, x , y))
        this.scene.playRandom("step", 1)//Phaser.Math.Between(8, 12) / 10);
        this.scene.updatePosition(this.x/64, this.y/64)
        /*const {x, y} = [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 0},
        ][this.lastDirection];

        this.scene.smokeLayer.add(new JumpSmoke(this.scene, this.x + (20 * -x) , this.y + 32 + (20 * -y))) */
    }

    adaptBreath() {
        if (this.stepDelta > 2000) {
            console.log("Steps: ", this.stepDelta, this.steps, this.rate)
            if (this.steps > 2) {
                this.previousRate = this.rate;
                this.rate = this.steps < 11 ? this.steps / 10: 1
                this.scene.breath(this.rate)
                this.updateOxygen(this.steps + Math.round(this.steps/2));
            } else if (this.rate !== this.previousRate) {
                this.previousRate = this.rate;
                this.rate = this.rate > 0.2 ? this.rate - 0.1 : 0.2;
                this.scene.breath(this.rate)
                this.scene.updateOxygen(this.steps)
            } else {
                this.scene.updateOxygen(this.steps)
            }
            this.steps = this.stepDelta = 0;
        }
    }

    updateOxygen (waste) {
        if (waste >= this.oxygen) {
            this.oxygen = 0;
            this.death();
        } else {
            this.oxygen -= waste;
        }
        console.log("waste: ", waste, " Oxygen: ", this.oxygen)
        this.scene.updateOxygen()
    }


    death () {
        console.log("Player dead")
       // this.scene.playAudio("dead");
        this.dead = true;
        this.body.stop();
        this.body.enable = false;
        this.scene.restartScene();
        //this.anims.play("playerdead", true)
    }
}