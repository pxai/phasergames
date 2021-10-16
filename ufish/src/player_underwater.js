import Player from "./player"
import Beam from "./objects/beam";

const VELOCITY = 150;

export default class PlayerUnderwater extends Player {
    constructor (scene, x, y, name = "ufowater") {
        super(scene, x, y, name);

        this.scene = scene;
        this.beamLayer = this.scene.add.layer();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(true);

        this.defaultVelocity = 100;
        this.hull = 100;
        this.init();

        this.dead = false;

        this.beamGroup = this.scene.add.group()
        this.beam = null;
      }

    init () {
       this.fish = [];
        this.body.setCollideWorldBounds(true);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.scene.anims.create({
          key: "flywater",
          frames: this.scene.anims.generateFrameNumbers("ufowater"),
          frameRate: 5,
          repeat: -1
        });

        this.scene.anims.create({
          key: "death",
          frames: this.scene.anims.generateFrameNumbers("death"),
          frameRate: 5,
          origin: 0.5
        });
        this.on('animationcomplete', this.animationComplete, this);
        this.anims.play("flywater", true)
        this.body.setVelocityX(150);
    }


    update () {
      if (this.dead) return;
      if (this.cursor.left.isDown || this.A.isDown) {
          this.body.setVelocityX(-VELOCITY);
          this.body.rotation = -15;
          this.deactivateBeam();
          //this.scene.playAudio("thrust");
          //this.showThrust("left");
      } else if (this.cursor.right.isDown || this.D.isDown) {
          this.body.setVelocityX(VELOCITY);
          this.body.rotation = 15;
          this.deactivateBeam();
          //this.scene.playAudio("thrust");
          //this.showThrust("right");
      } else if (this.cursor.up.isDown || this.W.isDown) {
          this.body.setVelocityY(-VELOCITY);
          this.body.rotation = 0;
          //this.scene.playAudio("thrust");
          //this.showThrust("up");
      } else if (this.cursor.down.isDown || this.S.isDown) {
          this.body.setVelocityY(VELOCITY);
          //this.scene.playAudio("thrust");
          //this.showThrust("down");
      } else {
        this.body.rotation = 15;
    }


      if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        if (!this.beam || !this.beam.active) this.activateBeam()
      } else if (this.beam && Phaser.Input.Keyboard.JustUp(this.spaceBar)) {
        this.deactivateBeam();
      }

      if (this.isTracking()) {
        this.beam.x = this.x;
        this.beam.y = this.y + 256;
      }

    }

    hit (player, bullet) {
      player.deactivateBeam();
      player.anims.play("death", true)
      bullet.destroy();
    }

    isTracking () {
      return this.beam && this.beam.active;
    }

    activateBeam () {
      this.beam = new Beam(this.scene, this.x, this.y + 250, this.beamLayer)
      this.beamGroup.add(this.beam);
    }

    deactivateBeam () {
      if (this.beam) {
        this.beamGroup.remove(this.beam);
        this.beam.destroy();
      }
    }

    destroyBeam(beam, foe) {
      console.log("Destroy!!")
      beam.scene.player.deactivateBeam();
    }

    animationComplete(animation, frame) {
        if (animation.key === "death") {
            this.anims.play("flywater", true)
        }
    }

    death () {
      this.dead = true;
      this.body.rotation = 15;
      this.anims.stop(null, true)
      this.scene.deathText.setAlpha(1);
      this.scene.tweens.add({
        targets: this,
        duration: 4000,
        y: { from: this.y, to: this.scene.height + 256},
        onComplete: () => { this.scene.finishScene() }
    })   
    }
}
