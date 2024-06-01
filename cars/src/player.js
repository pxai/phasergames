import Particle from "./particle";
import Shot from "./shot";
import Scenario from "./scenario";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "player") {
        super(scene, x, y, name);
        this.scene = scene;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCircle(24);
        this.body.setOffset(6, 12)
        this.body.setDrag(100);
        this.power = 0;
        this.body.setBounce(0.8)
        this.bullets = 0;

        //this.friction = .95;
        this.accelerating = false;
        this.death = false;
        this.jumping = false
        this.jumpPoint = -1;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "player",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

          this.anims.play("player", true)
        //this.scene.input.on('pointerdown', (pointer) => this.shoot(pointer), this);
        //this.scene.input.on('pointerup', (pointer) => this.release(pointer), this);
        this.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.Z = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
       // this.body.setDrag(300);
        //this.body.setAngularDrag(400);
        this.body.setMaxVelocity(600);
        this.upDelta = 0;
        this.scene.events.on("update", this.update, this);
    }

    shoot () {
        //if (this.power > 0) {
            // this.getSpeeds();
           this.scene.playAudio("shot");
           const bullet = new Shot(this.scene, this.x, this.y);
            this.scene.thrust.add(bullet)
            this.scene.bullets.add(bullet)
            this.bullets--;
            this.scene.updateBullets();
       // }
    }

    release(pointer) {
        if (pointer.leftButtonReleased()) {
            this.shooting = false;
        }
    }

    update (timestep, delta) {
        if (this.death) return;

        if (this.jumping) {
            this.shadow.x = this.x;
            if (this.y >= this.jumpPoint) this.land();
            if (this.body.velocity.y > 0) this.rotation = 0.3;
        } else {
            if (this.cursor.left.isDown || this.A.isDown) {
                this.body.setVelocityX(-100);
                this.body.setDrag(300)
                this.scene.playBrake();
                this.accelerating = false;
             } else if (this.cursor.right.isDown || this.D.isDown) {
                this.body.setDrag(100)
                const velocity = this.y < 224 || this.y > 624 ? 200 : 600
                 this.body.setVelocityX(velocity);
                 if (velocity === 600) {
                    this.scene.playEngine();
                 }
                 this.scene.updateScore(1);
                 this.accelerating = true;
             } else {
                 this.body.setAngularVelocity(0);
                 this.accelerating = false;
             }

             if (this.cursor.up.isDown || this.W.isDown) {
                 this.rotation = -0.2;
                 this.body.setVelocityY(-100);
                 this.scene.playTurn();
             } else if (this.cursor.down.isDown || this.S.isDown) {
                 this.rotation = 0.2;
                 this.body.setVelocityY(100);
                 this.scene.playTurn();
             } else {
                 this.rotation = 0;
             }

             if (Phaser.Math.Between(1, 4) > 1) {
                this.scene.thrust.add(new Particle(this.scene, this.x  , this.y + Phaser.Math.Between(-16, 16), 0xffffff, 10))
                //new Particle(this.scene, this.x , this.y ,  50, -1)
                //new Particle(this.scene, this.x , this.y,  50, -1)
            }

            if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
                this.jump();
            }

            if (Phaser.Input.Keyboard.JustDown(this.Z) && this.bullets > 0) {
                this.shoot();
            }
        }

    }

    jump () {
        this.scene.playAudio("jump")
        this.jumpPoint = this.y;
        this.jumping = true;
        this.shadow = new Shadow(this.scene, this.x, this.y)
        this.scene.thrust.add(this.shadow)
        this.y--;
        this.body.setAllowGravity(true)
        this.body.setVelocityY(-400)
        this.rotation = -0.3;
    }


    land () {
        this.scene.playAudio("land")
        this.jumping = false;
        this.body.setVelocityY(0);
        this.shadow.destroy();
        this.jumpPoint = -1;
        this.body.setAllowGravity(false)
    }

    addBullets(bullets) {
        this.bullets = this.bullets + bullets;
        this.showPoints("+" + bullets)
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "pico", score, 20, 0xfffd37).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 1000,
            alpha: {from: 1, to: 0},
            y: {from: text.y - 10, to: text.y - 100}
        });
    }

    destroy () {
        this.scene.engine.pause()
        this.scene.cameras.main.shake(300);
        this.death = true;
        this.scene.restartScene();
        super.destroy();
    }
}

export default Player;

class Shadow extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "player") {
        super(scene, x, y, name);
        this.scene = scene;
        this.setTint(0x000000);
        this.setAlpha(0.7)
        scene.add.existing(this);

        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            scale: {from: 1, to: 0.5},
            yoyo: true
        })
    }
}