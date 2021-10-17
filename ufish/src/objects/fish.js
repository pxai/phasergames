class Fish extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, name = "redfish", scale = 0.5) {
        x = x || Phaser.Math.Between(0, scene.width);
        y = y || Phaser.Math.Between(scene.height - 32, scene.height - 200);
        scale = scale || Math.random() + 0.2;
        super(scene, x, y, name);
        this.direction = Phaser.Math.Between(0, 1) > 0 ? 1 : -1;
        this.name = name;
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale);
        this.body.setAllowGravity(false);
        this.setAlpha(0.5)
        this.body.setSize(16,16)
        this.scene.add.existing(this);
        this.tracked = false;
        this.falling = false;
        this.overlap = this.scene.physics.add.overlap(this.scene.player.beamGroup, this, this.up, this.check);
        this.init();
        this.moveIt(this.direction);
    }

    init () {
        this.scene.anims.create({
            key: "swim" + this.name,
            frames: this.scene.anims.generateFrameNumbers("redfish", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });

        this.scene.anims.create({
            key: "choke" + this.name,
            frames: this.scene.anims.generateFrameNumbers("redfish", { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
          });
  
          this.anims.play("swim" + this.name, true)
    }

    up (beam, fish) {
        fish.tracked = true;
        fish.falling = false;
        fish.body.setVelocityX(0);
   
        fish.anims.play("choke" + fish.name, true)

        fish.scene.tweens.add({
            targets: fish,
            duration: 500,
            x: { from: fish.x, to: beam.x},
        })   
 
    }

    goDown () {
        this.falling = false;
        this.body.setAllowGravity(false);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            y: { from: this.y, to: this.y + Phaser.Math.Between(50, 100)},
        })   
    }


    moveIt (x) {
        if (x < 0) {
            this.flipX = true;
            this.body.setVelocityX(Phaser.Math.Between(10, 30));
        } else {
            this.body.setVelocityX(Phaser.Math.Between(-10, -30));
        }
    }

    update () {
        if (this.scene) {
            if (this.scene.player && this.scene.player.isTracking() && this.tracked) {
                this.y -= 5;
            } else if (this.y - 64 < this.scene.water.surface.y) {
                this.falling = true;
                this.tracked = false;
                this.y++;
            } else if (this.y - 16 > this.scene.water.surface.y && this.falling && !this.tracked) {
                this.anims.play("swim" + this.name, true)
                this.y++;
               this.destroy();
            }
        } else {
            console.log("Scene is null??")
        }
    }

    updateWater () {
        if (this.scene) {
            if (this.scene.player && this.scene.player.isTracking() && this.tracked) {
                this.x = this.scene.player.beam.x;
                this.y -= 5;
            } else {
                this.falling = true;
                this.tracked = false;
                this.anims.play("swim" + this.name, true)
            } 
        }
    }

    turn () {
        this.flipX = true;
        this.body.setVelocityX(-this.body.velocity.x);
    }
}

export default Fish;
