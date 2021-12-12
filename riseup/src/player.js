import Die from "./die";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number, health = 10) {
      super(scene, x, y, "wizard")
      this.setOrigin(0.5)
      this.scene = scene;
      this.number = number; 
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.right = false;
      this.init();
      this.jumping = false;
      this.health = health;
      this.currentDie = null;
    }

    init () {
        this.scene.anims.create({
            key: "playeridle" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalkidle" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 5, end: 5 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerwalk" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 5, end: 8 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerjump" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 14, end: 15 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerdead" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 16, end: 20 }),
            frameRate: 5,
        });

        this.anims.play("playeridle" + this.number, true);
       // this.on("animationupdate" , this.castInTime, this);
        this.on('animationcomplete', this.animationComplete, this);
        if (this.number > 0) { 
            const initMove = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
            this.right = initMove === 1;
            this.body.setVelocityX(initMove * 160);
            this.flipX = (this.body.velocity.x < 0);
        }
    }    
  

    update () {
        //if (Phaser.Input.Keyboard.JustDown(this.down)) {
        if (this.cursor.up.isDown && this.body.blocked.down) {
            this.body.setVelocityY(-350);
            this.anims.play("playerjump" + this.number, true);
            // this.scene.playAudio("jump")
            this.spawnDie();
            this.jumping = true;
        } else if (this.cursor.right.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk" + this.number, true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(160);
        } else if (this.cursor.left.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk" + this.number, true); }
            this.right = false;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(-160);  
        } else {
            if (this.body.blocked.down) { this.anims.play("playerwalkidle" + this.number, true); }
            this.body.setVelocityX(0);
        }

        //const scrol_x = this.x - this.scene.center_width;     
 ///  scrollX - Х top left point of camera
      //  this.scene.cameras.main.x = scrol_x;
    }

    spawnDie() {
        if (this.currentDie) this.currentDie.destroy();
      
        this.currentDie = new Die(this.scene, this, `d${this.scene.die}`)
        this.scene.dice.add(this.currentDie);
    }

    turn () {
        this.right = !this.right;
    }

    animationComplete (animation, frame) {
        if (animation.key === "playerdead" + this.number) {
            //this.scene.scene.start('game_over')
        }
    }

    hitDie(die) {
        if (die.name === "d1") {
            die.delayedDestroy(this.scene, die);
        }
    }

    hitFloor() {
        if (this.jumping) {
            //this.scene.playAudio("ground")

            this.jumping = false;
        }
    }

    hit () {
        this.health--;
        console.log("HERE WE GO")
        this.anims.play("playerdead" + this.number, true);
        this.body.enable = false;
        if (this.health === 0) {
            this.die();
        }

    }

    die () {
        this.body.immovable = true;
        this.body.moves = false;
        this.scene.updateHealth(0)
        this.scene.gameOver();
        //this.anims.play("playerdead" + this.number)
       // this.scene.playAudio("gameover")
    }

}

export default Player;
  