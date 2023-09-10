import Shot from "./shot";
import { JumpSmoke, ShotSmoke } from "./particle";
import HealthBar from "./health_bar";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "willie")
        this.setOrigin(0.5)
        this.scene = scene;
        this.setScale(1)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(45, 45)
        //this.body.setDrag(300);
        this.velocity = 200;
        this.dead = false;
        this.init();
        this.shells = 0;
        this.lastDirection = 0;
        this.shooting = false;
        this.health = 100;
        this.healthBar = new HealthBar(this, 32, -32, 10);
    }

    init () {
        this.scene.anims.create({
            key: "startidle",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "walkdown",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 2, end: 4 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "walkup",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 5, end: 7 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "walkside",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 10, end: 11 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "playerdead",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 12, end: 15 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerwin",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 16, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "shoot0",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 9, end: 9 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "shoot1",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 11, end: 11 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "shoot2",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 8, end: 8 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "shoot3",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 11, end: 11 }),
            frameRate: 10,
        });

        this.anims.play("startidle", true);

        this.on('animationcomplete', this.animationComplete, this);
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

    update () {
        if (this.dead) return;
        if (this.shooting) return;

        if (this.W.isDown || this.cursor.up.isDown) {
            this.body.setVelocityY(-this.velocity);
            this.body.setVelocityX(0);
            this.lastDirection = 0;
            this.anims.play("walkup", true);
        } else if (this.D.isDown || this.cursor.right.isDown) {
            //this.anims.play("playerwalk" + this.number, true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.anims.play("walkside", true);
            this.body.setVelocityX(this.velocity);
            this.body.setVelocityY(0);
            this.lastDirection = 1;
        } else if (this.A.isDown || this.cursor.left.isDown) {
            this.right = false;
            this.flipX = (this.body.velocity.x < 0);
            this.anims.play("walkside", true);
            this.body.setVelocityX(-this.velocity);
            this.body.setVelocityY(0);
            this.lastDirection = 3;
        } else if (this.S.isDown || this.cursor.down.isDown)  {
            this.body.setVelocityY(this.velocity);
            this.body.setVelocityX(0);
            this.anims.play("walkdown", true);
            this.lastDirection = 2;
        } else {

            this.body.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) ) {
           // if (this.shells > 0) {
                this.scene.playAudio("shot");
                this.shooting = true;
                this.shoot();
           // } else {
             //   this.scene.playAudio("empty");
            //}
        }

        this.healthBar.updatePosition(this.x, this.y)

        //this.scene.playerLight.x = this.x;
        //this.scene.playerLight.y = this.y;
    }

    shoot () {
        const {x, y} = [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 0},
        ][this.lastDirection];
        this.anims.play("shoot" + this.lastDirection, true);

        this.scene.cameras.main.shake(20);
        Array(Phaser.Math.Between(6, 10)).fill(0).forEach( i => { this.scene.smokeLayer.add(new ShotSmoke(this.scene,  this.x + (x * 64), this.y + (y * 64), x, y))});
        this.scene.shots.add(new Shot(this.scene, this.x + (x * 64), this.y + (y * 64), x, y))
        this.shells--;
       // this.scene.showPoints(this.x, this.y, "-1")
        //his.scene.updateShells();
        this.body.setVelocityX(200 * -x);
        this.body.setVelocityY(200 * -y)
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0.8, to: 1},
            repeat: 5,
            duration: 20 ,
            onComplete: () => {
                Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => { this.scene.smokeLayer.add(new JumpSmoke(this.scene, this.x , this.y + 32))});
                this.shooting = false;
                this.scene.playAudio("cock");
                this.initialAnimation();
            }
        })


    }

    initialAnimation () {
        switch (this.lastDirection) {
            case 0: this.anims.play("walkup", true);break;
            case 1: this.anims.play("walkside", true); break;
            case 2: this.anims.play("startidle", true);break;
            case 3: this.anims.play("walkside", true); break;
            default: break;
        }
    }

    hit (x, y, points = 1) {
        this.health -= points;
        if (this.health <= 0) {
            // this.scene.addKill(this.name, shooter)
            this.death();
        }

        const diffX = this.x - x > 0 ? 1 : -1;
        const diffY = this.y - y > 0 ? 1 : -1;
        this.body.setVelocityX(200 * diffX)
        this.body.setVelocityY(200 * diffY)

        this.healthBar.decrease(points)
        this.scene.tweens.add({
          targets: this.healthBar.bar,
          duration: 1000,
          alpha: {
            from: 1,
            to: 0
          },
        });

        this.scene.tweens.add({
            targets: this,
            duration: 100,
            alpha: {
              from: 0,
              to: 1
            },
            repeat: 5
          });

    }

    death () {
        this.scene.playAudio("dead");
        this.dead = true;
        this.body.stop();
        this.body.enable = false;
        this.anims.play("playerdead", true)
        this.scene.finishScene()
    }

    animationComplete (animation, frame) {
        const {x, y} = [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 0},
        ][this.lastDirection];
        if(animation.key.startsWith("walk")) {
            //this.scene.playRandom("step", Phaser.Math.Between(2, 7) / 10);
            //this.scene.smokeLayer.add(new JumpSmoke(this.scene, this.x + (20 * -x) , this.y + 32 + (20 * -y)))
        }
    }

}