import Player from "./player";
import BeanGenerator from "./objects/bean _generator";
import FoeGenerator from "./objects/foe_generator";
import Bullet from "./objects/bullet";
import Albat from "./objects/albat";

export default class Game extends Phaser.Scene {
    constructor ({ key }) {
        super({ key });
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;

        console.log("Game constructor");
    }

    preload () {
      console.log("Game preload!", this.finished)
    }

    create () {
      this.add.tileSprite(0, 0, 800, 600, 'background1').setOrigin(0,0);
      this.finished = false;
      console.log("Game create: ", this.finished)
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2

        const greenBeans = +this.registry.get("green");
        const redBeans = +this.registry.get("red");
        this.player = new Player(this, 100, this.height - 32, "aki", greenBeans, redBeans).setOrigin(0.5); // this.physics.add.sprite(100, 450, 'dude');

        this.platformsLayer = this.add.layer();
        this.beanGenerator = new BeanGenerator(this);
        this.foeGenerator = new FoeGenerator(this);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.ground = this.add.rectangle(this.center_width, this.height, this.width, 1, 0x000000, 0);
        this.physics.world.enable(this.ground, 1);
        this.scoreText = this.add.bitmapText(this.center_width, 16, "pixelFont", "SCORE", 20).setOrigin(0.5)
        this.greenText = this.add.bitmapText(this.center_width - 200, 16, "pixelFont", this.registry.get("green"), 20).setOrigin(0.5);
        this.add.sprite(this.center_width - 200 + 22, 16, "single-bean").setScale(0.8).setAngle(25);
        this.redText = this.add.bitmapText(this.center_width + 200, 16, "pixelFont", this.registry.get("red"), 20).setOrigin(0.5);
        this.add.sprite(this.center_width + 200 + 22, 16, "single-redbean").setScale(0.8).setAngle(25);
        this.loadAudios();
        this.updateScore();
        this.playMusic();
      }

      createPlatforms (platforms) {
        this.platforms = this.physics.add.staticGroup();
        this.platformLimits = this.physics.add.staticGroup();
        platforms.forEach(platform => {
            this.platformsLayer.add(this.platformLimits.create(platform.x - platform.offset, platform.y - 8, "limit"));
            console.log("PlatformX: ", platform.x);
            this.platformsLayer.add(this.platforms.create(platform.x, platform.y, platform.type));
            this.platformsLayer.add(this.platformLimits.create(platform.x + platform.offset, platform.y - 8, "limit"));
        });
      }

      loadAudios () {
        this.audios = {
          "albatdeath": this.sound.add("albatdeath"),
          "carrot1": this.sound.add("carrot1"),
          "carrot2": this.sound.add("carrot2"),
          "fall": this.sound.add("fall"),
          "farthit": this.sound.add("farthit"),
          "greenbean": this.sound.add("greenbean"),
          "kill": this.sound.add("kill"),
          "playerplatform": this.sound.add("playerplatform"),
          "playerreturn": this.sound.add("playerreturn"),
          "redbean": this.sound.add("redbean"),
          "playerdeath": this.sound.add("playerdeath"),
          "marble": this.sound.add("marble"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="music") {

        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    update() {
      if (!this.finished) {
        this.player.update();
        this.foeGenerator.update();
      }
      if (this.albat) this.albat.update();
      if (this.allFoesAreDead()) {
        this.door.setTexture("door");
      }
    }

    setPlayerCollider (player) {
      this.playerCollider.active = true;
    }

    removePlayerCollider () {
        this.playerCollider.active = false;
    }

    createDoor(x, y) {
      this.door = this.add.sprite(x, y, "closed_door");
      this.physics.add.existing(this.door)
      this.door.body.immovable = true;
      this.door.body.moves = false;
      this.doorOverlap = this.physics.add.overlap(this.player, this.door, this.finishScene, null, this);
    }

    playerDeath (player, star) {
      this.finished = true;
      console.log("Death!!", player);
      this.playAudio("playerdeath");
      player.finish();

      this.playerRestartId = setTimeout(() => this.playerRestart(), 2000);
    }

    playerRestart () {
      this.player.restart();
      this.playAudio("playerreturn");
      console.log("Come from death: ", this.player.body.y, this.player.body.y + 100 < this.height);
      if (this.player.body.y + 100 < this.height) {
        this.player.y += 100;
      }
    }

    finishScene (player, door) {
      if (this.allFoesAreDead()) {
        this.finished = true;
        console.log("Finished!!", player, door);
        this.doorOverlap.active = false;
        this.theme.stop();
        player.body.stop();
        if (this.albat && this.albat.dead) {
          this.nextSceneId = setTimeout(() => this.scene.start("outro"), 3000)
        } else {
          this.nextSceneId = setTimeout(() => this.scene.start("transition", {name: this.nextScene, nextScene: this.nextScene}), 3000);
        }
      }
    }

    allFoesAreDead() {
      return (this.foeGenerator.areAllDead() && !this.albat) || 
        (this.foeGenerator.areAllDead() && this.albat && this.albat.dead);
    }

    shoot (avocado, direction) {
      new Bullet(this, avocado.x, avocado.y, direction);
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText("SCORE " +  String(score).padStart(6, '0'));
    }

    updateGreenBeans (amount) {
        this.registry.set("green", amount);
        this.greenText.setText(amount);
    }

    updateRedBeans (amount = 1) {
      this.registry.set("red", amount);
      this.redText.setText(amount);
    }

    setCollidersWithFoes (fart, type) {
      if (type === "normal") {
        this.foeGenerator.setFartCollider(fart);
        if (this.albat && !this.albat.dead) this.albat.setFartCollider(fart);
      } else {
        this.foeGenerator.setRedFartCollider(fart);
        if (this.albat && !this.albat.dead) this.albat.setRedFartCollider(fart);
      }
    }

    playFart(volume = 0.7) {
      this.fart = this.sound.add(`fart${Phaser.Math.Between(1,9)}`, {volume});
      this.fart.play();
    }

    addAlbat () {
      this.albat = new Albat(this, 450, 580);
      this.albatText = this.add.bitmapText(this.center_width, 36, "pixelFont", `ALBAT ${this.albat.life}`, 20).setOrigin(0.5)
    }

    updateAlbatLife (points) {
        this.albatText.setText(`ALBAT ${points}`);
    }
}
