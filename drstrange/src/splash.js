import { Particle } from "./particle";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.registry.set("score", "0");
        this.load.bitmapFont("celtic", "assets/fonts/celtic.png", "assets/fonts/celtic.xml");
        this.load.image('player', 'assets/images/player.png');
        this.load.image('blackblock', 'assets/images/blackblock.png');
        Array(9).fill(0).forEach((_,i) => {
          this.load.image(`marble${i+1}`,`assets/images/marbles/marble${i+1}.png`)
        });

        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("gotcha", "assets/sounds/gotcha.mp3");
        this.load.audio("fail", "assets/sounds/fail.mp3");
        Array(4).fill(0).forEach((_,i) => {
            this.load.audio(`theme${i}`,`assets/sounds/theme${i}.mp3`)
        });
        this.load.audio("boing", "assets/sounds/boing.mp3");
        this.load.audio("marble", "assets/sounds/marble.mp3");
        this.load.image('walls', 'assets/maps/walls.png');
        this.load.image('tiles', 'assets/maps/tiles.png');

        this.load.spritesheet("wizard", "assets/images/wizard.png", { frameWidth: 32, frameHeight: 32 });

        Array(4).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`stage${i}`, `assets/maps/stage${i}.json`);
        });
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0xfdebb4) //0xfef1ca

        this.text1 = this.add.bitmapText(this.center_width, this.center_height, "celtic", "MARBLE\nSHAKE", 85, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setTint(0x00e1ad).setOrigin(0.5)
        this.text2 = this.add.bitmapText(this.center_width, 450, "celtic", "by Pello", 25).setTint(0x00e1ad).setOrigin(0.5)
        this.text3 = this.add.bitmapText(this.center_width, 500, "celtic", "Click anywhere", 15).setTint(0x00e1ad).setOrigin(0.5)
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        this.playMusic();
        this.addPlayer();
        this.tweens.add({
            targets: this.text1,
            x: {from: this.text1.x, to: this.text1.x + Phaser.Math.Between(-10, 10) },
            duration: 200,
            repeat: -1
        })
    }

    update () {
        new Particle(this, Phaser.Math.Between(0, this.width),Phaser.Math.Between(0, this.height), 0x00e1ad, Phaser.Math.Between(4, 10));
    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.7,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

      addPlayer() {
          const shadow = this.add.image(this.center_width, this.center_height + 100, "player").setTint(0x000000).setScale(2.5).setAlpha(0.7);
          const player = this.add.image(this.center_width, this.center_height, "player").setScale(3);
        
          this.tweens.add({
            targets: [player, shadow],
            duration: 1000,
            y: '-= 5',
            repeat: -1,
            yoyo: true
          })
      }

    startGame () {
        this.tweens.add({
            targets: this.text1,
            y: {from: this.text1, to: -200},
            duration: 1000
        })

        this.tweens.add({
            targets: this.text2,
            y: {from: this.text2, to: -200},
            duration: 1200
        })

        this.tweens.add({
            targets: this.text3,
            y: {from: this.text3, to: -200},
            duration: 1300,
            onComplete: () => {
                this.theme.stop();
                this.registry.set("startTime", Date.now())
                this.scene.start("game", {number: 0});
            }
        })
    }
}
