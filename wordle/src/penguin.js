class Penguin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10) {
      super(scene, x, y, "penguin")
      this.setOrigin(0.5)
      this.scene = scene;

      this.scene.add.existing(this);
      this.setScale(0.8);
      this.right = true;
      this.init();
      this.jumping = false;
      this.walking = false;
      this.slippery = false;
      this.wobble = null;
      this.health = health;
      this.currentIce = null;
      this.dead = false;
    }

    init () {

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerground",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 6, end: 6 }),
            frameRate: 1,
        });

        this.anims.play("playeridle", true);

        this.on('animationcomplete', this.animationComplete, this);
    }    
  
    addWobble() {
        if (this.wobble !== null) return;
        this.wobble = this.scene.tweens.add({
            targets: this,
            rotation: "+=0.08",
            yoyo: true,
            duration: 100,
            repeat: -1
        })
    }

    moveIt() {
        const from = this.x;
        if (this.x > 320 || (!this.right && this.x < 140)) {
            this.turn();
        } 
        let to = this.x + (this.right ? 64 : -64);
        this.anims.play("playerwalk", true);
        this.addWobble();
        this.scene.tweens.add({
            targets: this,
            x: {from, to},
            duration: 500,
            onComplete: () => {
                this.stopWobble();
                this.anims.play("playeridle")
            }
        })
    }

    update () {
        if (this.dead) return;
    }

    stopWobble () {
        if (this.wobble) {this.wobble.remove(); this.rotation = 0;this.wobble = null;}
    }

    turn () {
        this.right = !this.right;
        this.flipX = !this.right;
    }

    animationComplete (animation, frame) {
        if (animation.key === "playerground") {
            this.anims.play("playeridle", true)
        }
    }
}

export default Penguin;
  