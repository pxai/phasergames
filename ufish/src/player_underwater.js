import Player from "./player"
import Beam from "./objects/beam";
import Bubble from "./objects/bubble";
import Coin from "./objects/coin";

const VELOCITY = 250;

export default class PlayerUnderwater extends Player {
    constructor (scene, x, y, name = "ufowater", velocity = 250, rotation = 15 ) {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.beamLayer = this.scene.add.layer();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(true);

        this.body.setSize(128, 50)
        this.defaultVelocity = velocity;
        this.defaultRotation = rotation;
        this.body.setBounce(0.5)
        this.hull = 10;
        this.init();

        this.dead = false;
        this.coins = [];

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
        this.B = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

        this.scene.anims.create({
          key: this.name,
          frames: this.scene.anims.generateFrameNumbers(this.name),
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
        this.anims.play(this.name, true)
        this.body.setVelocityX(this.defaultVelocity);
    }


    update () {
      if (this.dead) return;
      if (this.cursor.left.isDown || this.A.isDown) {
          this.x -= 5;
          this.body.rotation = -15;
          this.deactivateBeam();
          //this.scene.playAudio("thrust");
          //this.showThrust("left");
      } else if (this.cursor.right.isDown || this.D.isDown) {
          this.x += 5;
          this.body.rotation = 15;
          this.deactivateBeam();
          //this.scene.playAudio("thrust");
          //this.showThrust("right");
      } else if (this.cursor.up.isDown || this.W.isDown) {
          this.body.setDrag(0)
          this.body.setVelocityY(-VELOCITY);
          this.body.rotation = 0;
          new Bubble(this.scene, this.x + (Phaser.Math.Between(-32, 32)) , this.y + 33,  50, 1)

          //this.scene.playAudio("thrust");
          //this.showThrust("up");
      } else if (this.cursor.down.isDown || this.S.isDown) {
          this.body.setVelocityY(VELOCITY);
          //this.scene.playAudio("thrust");
          //this.showThrust("down");
      } else {
        this.body.rotation = this.defaultRotation;
        this.body.setVelocityX(this.defaultVelocity);
    }


      if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        if (!this.beam || !this.beam.active) this.activateBeam()
      } else if (this.beam && Phaser.Input.Keyboard.JustUp(this.spaceBar)) {
        this.deactivateBeam();
      }

      if (Phaser.Input.Keyboard.JustDown(this.B) && this.coins.length > 0) {
        this.shoot();
      }

      if (this.isTracking()) {
        this.beam.x = this.x;
        this.beam.y = this.y + 275;
      }

    }

    setCoins(coins) {
      this.coins = Array(coins).fill(1)
    }

    shoot () {
      const direction = this.body.velocity.x > 0 ? 1 : -1;
      this.scene.shootingGroup.add(new Coin(this.scene, this.x + (direction * 69), this.y, "coin", 400, direction))
      this.coins.pop();
      this.scene.updateCoinScore(-1);
    }

    hitPlatform (player, platform) {
      // this.scene.playAudio(`hit${Phaser.Math.Between(1, 4)}`);

      const damage = 1;
      player.hull = player.hull - damage;
      player.scene.updateHull(-damage);
      player.scene.tweens.add({
        targets: player,
        duration: 100,
        alpha: { from: 0, to: 1 },
        repeat: 5
      });
      player.body.setDrag(60)
      if (player.isPlayerDead()) {
        player.anims.play("death", true)
      }
    }

    isPlayerDead () {
      return this.hull <= 0;
    }

    hit (player, bullet) {
      player.deactivateBeam();
      player.death();
      bullet.destroy();
    }

    isTracking () {
      return this.beam && this.beam.active;
    }

    activateBeam () {
      this.beam = new Beam(this.scene, this.x, this.y + 270, this.beamLayer)
      this.beamGroup.add(this.beam);
    }

    deactivateBeam () {
      if (this.beam) {
        this.beamGroup.remove(this.beam);
        this.beam.destroy();
      }
    }

    destroyBeam(beam, foe) {
      beam.scene.player.deactivateBeam();
    }

    animationComplete(animation, frame) {
        if (animation.key === "death") {
          this.scene.restartScene()
        }
    }

    death () {
      this.dead = true;
      this.body.enable = false;
      this.body.rotation = 0;
      this.anims.play("death")
    }

    addCoin() {
      this.coins.push(1);
    }
}
