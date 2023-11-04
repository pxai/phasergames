

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
        this.init();
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
            //this.y += 64;

        }
       /* this.scene.playerLight.x = this.x;
        this.scene.playerLight.y = this.y;*/
    }

    canMoveUp() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x, this.y - 1);
        console.log(nextTile, nextTile.index, this.currentDie >= nextTile)
        return nextTile && extTile.index - 1 > 0 && this.currentDie >= nextTile && this.moveDelta > 200;
        //return !this.scene.platform.getTileAtWorldXY(this.x, this.y - 1) && this.moveDelta > 200
    }

    canMoveRight() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x + 64, this.y);
        console.log(nextTile, nextTile.index, this.currentDie >= nextTile)
        return nextTile && nextTile.index - 1 > 0 && this.currentDie >= nextTile.index - 1 && this.moveDelta > 200;
       // return !this.scene.platform.getTileAtWorldXY(this.x + 64, this.y) && this.moveDelta > 200
    }

    canMoveDown() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x, this.y + 64);
        console.log(nextTile, nextTile.index, this.currentDie >= nextTile)
        return nextTile && nextTile.index - 1 > 0 && this.currentDie >= nextTile.index - 1 && this.moveDelta > 200;
        //return !this.scene.platform.getTileAtWorldXY(this.x, this.y + 64) && this.moveDelta > 200
    }

    canMoveLeft() {
        const nextTile = this.scene.platform.getTileAtWorldXY(this.x - 1, this.y);
        console.log(nextTile, nextTile.index, this.currentDie >= nextTile)
        return nextTile && nextTile.index - 1 > 0 && this.currentDie >= nextTile.index - 1 && this.moveDelta > 200;
       // return !this.scene.platform.getTileAtWorldXY(this.x - 1, this.y) && this.moveDelta > 200
    }

    step (direction) {
        this.previousTile.setAlpha(0.5);
        this.currentDie = this.scene.help.positions[this.currentDie][direction]
        this.setFrame(this.currentDie);
        this.scene.help.setCurrent(this.currentDie);
        //this.steps++;
        //this.scene.smokeLayer.add(new Step(this.scene, x , y))
        this.scene.playAudio("blip")//Phaser.Math.Between(8, 12) / 10);
        this.scene.updateSteps();

        //this.scene.smokeLayer.add(new JumpSmoke(this.scene, this.x + (20 * -x) , this.y + 32 + (20 * -y)))
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