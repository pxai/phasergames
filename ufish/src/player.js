import HealthBar from "./objects/health_bar";
import Beam from "./objects/beam";
import Thrust from "./objects/thrust";

const VELOCITY = 300;

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "ufo") {
        super(scene, x, y, name);

        this.scene = scene;
        this.beamLayer = this.scene.add.layer();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.defaultVelocity = 100;
        this.hull = 100;
        this.init();

        this.dead = false;
        this.body.setDrag(0);

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
          key: "fly",
          frames: this.scene.anims.generateFrameNumbers("ufo"),
          frameRate: 5,
          repeat: -1
        });

        this.anims.play("fly", true)
    }


    update () {
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

          //this.scene.playAudio("thrust");
          //this.showThrust("up");
      } else if (this.cursor.down.isDown || this.S.isDown) {
          this.body.setVelocityY(VELOCITY);
          //this.scene.playAudio("thrust");
          //this.showThrust("down");
      } else {
        this.body.rotation = 0;
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
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

    animationComplete(animation, frame) {
        if (animation.key === "reappear") {

            this.scene.finished = false;
            this.alpha = 1;
            this.anims.play("turn", true)

            this.dead = false;
        }
    }
}
