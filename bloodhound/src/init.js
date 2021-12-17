import Phaser from "phaser";
import Game from "./game";


class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;


        this.cameras.main.setBackgroundColor(0x000000);
        //this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("game", {next: "game", name: "STAGE", number: 1, time: 30})
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, -200, "logo").setScale(0.5).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
            y: {
                from: -200,
                to: 130
              },
          })
    }

    showPlayer () {

    }

    playMusic (theme="splash") {
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
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 450, "pixelFont", "WASD/Arrows: move", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "pixelFont", "SPACE: track beam", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "pixelFont", "B: shoot coins", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}

class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "The U.F.I.S.H. recovered the engines.",
            "After a terrible fishing day,",
            "they decided to move to Europa moon,",
            "to fish under the ice",
            "But that is another story..."
        ];
        this.showHistory();
        //this.showPlayer();
        //this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    playMusic (theme="outro") {
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

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "pixelFont", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }


    startSplash () {
        // this.theme.stop();
        this.scene.start("splash");
    }
}


class Bootloader extends Phaser.Scene {
    constructor () {
        super({ key: "bootloader" });
    }

    preload () {
        this.createBars();
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x88d24c, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );
        this.load.on("complete", () => {
           this.scene.start("splash");
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        this.load.image("aim", "assets/images/aim.png");
        this.load.spritesheet("hunter", "assets/images/hunter.png", { frameWidth: 64, frameHeight: 48 });
        // this.load.audio("beam", "assets/sounds/beam.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        //this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });


        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x008483, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}

const config = {
    width: 1000,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "contenedor",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        Bootloader,
        Splash,
        Game,
        Outro,
    ]
};

const game = new Phaser.Game(config);