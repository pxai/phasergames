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
        this.locked = false;
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

    }

    update(time, delta) {
        if (this.dead) return;
        if (this.locked) return;
        this.stepDelta += delta;
        this.moveDelta += delta;

        if ((Phaser.Input.Keyboard.JustDown(this.W) || Phaser.Input.Keyboard.JustDown(this.cursor.up)) && this.canMoveUp()) {
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.scene.tweens.add({ targets: this, y: "-=64", duration: 200, onComplete: () => { this.locked= false; }})
            //this.y -= 64;
            this.step(x, y);
        } else if ((Phaser.Input.Keyboard.JustDown(this.D) || Phaser.Input.Keyboard.JustDown(this.cursor.right)) && this.canMoveRight()) {
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.scene.tweens.add({ targets: this, x: "+=64", duration: 200, onComplete: () => { this.locked= false; }})
            //this.x += 64;

            this.step(x, y);
        } else if ((Phaser.Input.Keyboard.JustDown(this.A) || Phaser.Input.Keyboard.JustDown(this.cursor.left)) && this.canMoveLeft()) {
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.scene.tweens.add({ targets: this, x: "-=64", duration: 200, onComplete: () => { this.locked= false; }})
            //this.x -= 64;

            this.step(x, y);
        } else if ((Phaser.Input.Keyboard.JustDown(this.S) || Phaser.Input.Keyboard.JustDown(this.cursor.down)) && this.canMoveDown())  {            
            this.moveDelta = 0;
            const {x, y} = this;
            this.locked = true;
            this.scene.tweens.add({ targets: this, y: "+=64", duration: 200, onComplete: () => { this.locked= false; }})
            //this.y += 64;
            this.step(x, y);
        }
        this.scene.playerLight.x = this.x + (this.right ? 1 : -1) * 50;
        this.scene.playerLight.y = this.y;
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
        //this.scene.updatePosition(this.x/64, this.y/64)
        /*const {x, y} = [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 0},
        ][this.lastDirection];

        this.scene.smokeLayer.add(new JumpSmoke(this.scene, this.x + (20 * -x) , this.y + 32 + (20 * -y))) */
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