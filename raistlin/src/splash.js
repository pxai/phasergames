import { Particle } from "./particle";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.registry.set("score", "0");
        this.load.bitmapFont("celtic", "assets/fonts/celtic.png", "assets/fonts/celtic.xml");
        this.load.image('player', 'assets/images/player.png');
        this.load.image('playerlogo', 'assets/images/playerlogo.png');
        this.load.image('pellologo', 'assets/images/pellologo.png');
        this.load.image('blackblock', 'assets/images/blackblock.png');
        Array(9).fill(0).forEach((_,i) => {
          this.load.image(`marble${i+1}`,`assets/images/marbles/marble${i+1}.png`)
        });

        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("gotcha", "assets/sounds/gotcha.mp3");
        this.load.audio("fail", "assets/sounds/fail.mp3");
        this.load.audio("emptymana", "assets/sounds/emptymana.mp3");
        this.load.audio("fireball", "assets/sounds/fireball.mp3");
        this.load.audio("wizard", "assets/sounds/wizard.mp3");
        this.load.audio("player", "assets/sounds/player.mp3");
        this.load.audio("exit", "assets/sounds/exit.mp3");
        this.load.audio("line", "assets/sounds/line.mp3");
        this.load.audio("start", "assets/sounds/stageclear1.mp3");
        this.load.audio("stageclear", "assets/sounds/stageclear2.mp3");
        this.load.audio("cast", "assets/sounds/cast.mp3");

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
        this.cameras.main.setBackgroundColor(0x111111) //0xfef1ca

        this.text1 = this.add.bitmapText(this.center_width, -200, "celtic", "RAISTLIN", 85, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setTint(0x03a062).setOrigin(0.5)
        this.text1.setDropShadow(4, 6, 0xBAD978, 0.7);
        this.pelloLogo = this.add.image(this.center_width - 110, 480, "pellologo").setOrigin(0.5).setScale(0.3)
        this.text2 = this.add.bitmapText(this.center_width + 40, 500, "celtic", "by Pello", 25).setTint(0x03a062).setOrigin(0.5)
        this.text2.setDropShadow(2, 3, 0xBAD978, 0.7);
        this.text3 = this.add.bitmapText(this.center_width, 550, "celtic", "Click anywhere", 15).setTint(0x03a062).setOrigin(0.5)
        this.text3.setDropShadow(1, 2, 0xBAD978, 0.7);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        this.playMusic();
        this.addPlayer();
        this.tweens.add({
            targets: this.text1,
            y: {from: -200, to: 200 },
            duration: 200,
        })
    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

      addPlayer() {
          this.shadow = this.add.image(this.center_width, this.center_height + 120, "playerlogo").setTint(0x000000).setScale(0.8).setAlpha(0.7);
          this.player = this.add.image(this.center_width, this.center_height - 10, "playerlogo");
        
          this.tweens.add({
            targets: [this.player, this.shadow],
            duration: 1000,
            y: '-= 5',
            repeat: -1,
            yoyo: true
          })
      }

    startGame () {
        this.start = this.sound.add("start");
        this.shadow.destroy();
        this.start.play()
        this.tweens.add({
            targets: this.player,
            y: {from: this.player.y, to: -200},
            duration: 1300,
            onComplete: () => {
                this.theme.stop();
                this.registry.set("startTime", Date.now())
                this.registry.set("totalTime", 0);
                this.scene.start("game", {number: 0});
            }
        })
    }
}
