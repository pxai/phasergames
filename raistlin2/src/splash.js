import StarBurst from "./starburst";

export default class Splash extends Phaser.Scene {

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
        this.showTitle();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.addStartButton();
        //this.playMusic();
    }

    update () {
    }

    startGame () {
        if (this.theme) this.theme.stop();
        //this.sound.add("gold").play();
        this.scene.start("game", {number: 0, mana: 100, name: "no name"})
    }

    showTitle() {
        this.gameLogo1 = this.add.bitmapText(this.center_width, 130, "mainFont", "RAISTLIN", 90).setOrigin(0.5).setTint(0xbf2522).setDropShadow(3, 4, 0xffe066, 0.7);
        this.gameLogo2 = this.add.bitmapText(this.center_width, 360, "mainFont", "2", 200).setOrigin(0.5).setTint(0xffe066).setDropShadow(3, 4, 0xbf2522, 0.7).setAlpha(0);
       
        this.tweens.add({
            targets: [this.gameLogo1],
            duration: 2500,
            alpha: {from: 0, to: 1},
            onComplete: () => {
                this.sound.add("boom").play();
                this.gameLogo2.setAlpha(1);
                new StarBurst(this, this.gameLogo2.x, this.gameLogo2.y-200, "0xffe066", true, true);
                new StarBurst(this, this.gameLogo2.x-100, this.gameLogo2.y-100, "0xffe066", true, true);
                new StarBurst(this, this.gameLogo2.x+100, this.gameLogo2.y-100, "0xffe066", true, true);
                new StarBurst(this, this.gameLogo2.x, this.gameLogo2.y, "0xffe066", true, true);
            }
         })

    }

    showPlayer () {

    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.4,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
        const by = this.add.bitmapText(this.center_width + 20, 500, "mainFont", "by PELLO", 35).setOrigin(0.5).setTint(0xbf2522).setDropShadow(3, 4, 0xffe066, 0.7).setAlpha(0);
        const logo = this.add.sprite(this.center_width - 200, 470, "pello").setOrigin(0.5).setScale(0.6).setAlpha(0);
        const instructions = this.add.bitmapText(this.center_width, 570, "arcade", "WASD/ARROWS", 30).setOrigin(0.5).setTint(0xbf2522).setDropShadow(3, 4, 0xffe066, 0.7).setAlpha(0);
        const mouse = this.add.bitmapText(this.center_width, 640, "arcade", "MOUSE LEFT/RIGHT", 30).setOrigin(0.5).setTint(0xbf2522).setDropShadow(3, 4, 0xffe066, 0.7).setAlpha(0);

        this.tweens.add({
            targets: [by, logo, instructions, mouse],
            duration: 3000,
            alpha: {from: 0, to: 1}
        });
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 720, "arcade", "Click HERE to start", 30).setOrigin(0.5).setTint(0xbf2522).setDropShadow(3, 4, 0xffe066, 0.7).setAlpha(0);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.startGame();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0xb85d08)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xe5cc18)
        });
        this.tweens.add({
            targets: this.startButton,
            duration: 3000,
            alpha: {from: 0, to: 1},
        });
    }

    showPlayer() {
        this.player = this.add.sprite(this.center_width, this.center_height - 100, "moriarty").setScale(3).setOrigin(0.5);
        this.anims.create({
            key: "moriartyidle",
            frames: this.anims.generateFrameNumbers("moriarty", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
          });
          this.player.anims.play("moriartyidle", true);
    }
}