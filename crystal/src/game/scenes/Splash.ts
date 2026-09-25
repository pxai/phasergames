import { Scene, Math } from 'phaser';

export default class Splash extends Scene {
    private width: number;
    private height: number;
    private center_width: number;
    private center_height: number;
    private title1: any;
    private title2: any;
    private theme: any;

    constructor () {
        super('Splash');
    }

    preload () {
    }

    create ()
    {
        this.width = Number(this.sys.game.config.width);
        this.height = Number(this.sys.game.config.height);
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x000000) //0xfef1ca
        this.title1 = this.add.bitmapText(-1024, 128, "default", "Crystal", 130).setOrigin(0.5).setTint(0xffffff).setDropShadow(8, 8, 0x72751b, 0.7);
        //this.title2 = this.add.bitmapText(this.width + 1024, 346, "default", "Ship", 148).setOrigin(0.5).setTint(0xf1f1f1).setDropShadow(8, 8, 0x807f72, 0.7);

        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.input.on('pointerdown', () => this.startGame(), this);

        this.sound.add(`sheep${Math.Between(0, 2)}`).play({ volume: 0.5 });
        this.showInstructions();
        this.addScanlines();
        this.showTitle()
        this.showPlayers();
        this.playMusic();

    }

    showTitle () {
        this.tweens.add({
            targets: this.title1,
            duration: 2000,
            alpha: {from: 0, to: 1},
            x: {from: -1024, to: this.center_width}
        });

         this.tweens.add({
            targets: this.title2,
            duration: 2000,
            alpha: {from: 0, to: 1},
            x: {from: this.width + 1024, to: this.center_width}
        });

        this.tweens.add({
            targets: [this.title1, this.title2],
            duration: 200,
            scaleY: {from: 0.6, to: 1},
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.title1.setScale(1);
            }
        });
    }

    showPlayers () {
        this.add.sprite(this.center_width - 128, 600, "doge").setOrigin(0.5).setScale(3);
        this.add.sprite(this.center_width + 128, 600, "sheep").setOrigin(0.5).setScale(3);
    }


    showInstructions() {
        this.add.sprite(this.center_width - 120, 760, "pello").setOrigin(0.5).setScale(0.5)
        this.add.bitmapText(this.center_width + 46, 760, "default", "By PELLO", 35).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 830, "default", "Click to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true,
        });
    }

    addScanlines() {
        for (let y = 0; y < this.height; y += 4) {
            let line = this.add.rectangle(this.center_width, y, this.width, 2, 0x000000)
            line.alpha = 1;
            line.depth = 1000;
        }
    }

    startGame () {
        this.sound.add("bark").play({ volume: 0.5 });
        this.scene.start('Transition', {number: 0, name: "", seconds: 30});
    }

    playMusic (theme="music") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.6,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
}
