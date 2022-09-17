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
        this.addPlayer();
        this.showTitle();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);

        this.startButton= this.addStartButton("CLICK HERE TO START", 70, 0);

        this.playMusic();
    }

    update () {
    }

    startGame (level) {
        if (this.theme) this.theme.stop();
        this.scene.start("game", {number: 0, mana: level, name: "no name"})
    }

    showTitle() {
        this.gameLogo1 = this.add.bitmapText(this.center_width, 80, "mainFont", "SHOGUN",120).setOrigin(0.5).setTint(0x204631).setDropShadow(3, 4, 0xaec440, 0.7);
        this.gameLogo2 = this.add.bitmapText(this.center_width, 200, "mainFont", "KILLER", 150).setOrigin(0.5).setTint(0xaec440).setDropShadow(3, 4, 0x204631, 0.7).setAlpha(0);
       
        this.tweens.add({
            targets: [this.gameLogo1, this.player],
            duration: 2500,
            alpha: {from: 0, to: 1},
            onComplete: () => {
                this.sound.add("boom").play();
                this.gameLogo2.setAlpha(1);
                new StarBurst(this, this.gameLogo2.x, this.gameLogo2.y-200, "0xaec440", true, true);
                new StarBurst(this, this.gameLogo2.x-100, this.gameLogo2.y-100, "0xaec440", true, true);
                new StarBurst(this, this.gameLogo2.x+100, this.gameLogo2.y-100, "0xaec440", true, true);
                new StarBurst(this, this.gameLogo2.x, this.gameLogo2.y, "0xaec440", true, true);
            }
         })

    }

    addPlayer () {
        this.player = this.add.sprite(this.center_width, 320, "player").setOrigin(0.5).setAlpha(0).setScale(2);
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
        const by = this.add.bitmapText(this.center_width + 20, 400, "mainFont", "by PELLO", 30).setOrigin(0.5).setTint(0xaec440).setDropShadow(2, 3, 0x204631, 0.7).setAlpha(0);
        const logo = this.add.sprite(this.center_width - 100, 390, "pello").setOrigin(0.5).setScale(0.4).setAlpha(0);
        const instructions = this.add.bitmapText(this.center_width, 470, "arcade", "LEFT CLICK: FREEZE/UNFREEZE", 30).setOrigin(0.5).setTint(0xaec440).setDropShadow(2, 3, 0x204631, 0.7).setAlpha(0);
        const mouse = this.add.bitmapText(this.center_width, 510, "arcade", "RIGHT CLICK: SHOOT!", 30).setOrigin(0.5).setTint(0xaec440).setDropShadow(2, 3, 0x204631, 0.7).setAlpha(0);

        this.tweens.add({
            targets: [by, logo, instructions, mouse],
            duration: 3000,
            alpha: {from: 0, to: 1}
        });
    }

    addStartButton (button, level, offset) {
        const startButton = this.add.bitmapText(this.center_width + offset, 560, "arcade", button, 30).setOrigin(0.5).setTint(0xaec440).setDropShadow(2, 3, 0xaec440, 0.7).setAlpha(0);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.startGame(level);
        });
    
        startButton.on('pointerover', () => {
            startButton.setTint(0xb85d08)
        });
    
        startButton.on('pointerout', () => {
            startButton.setTint(0xe5cc18)
        });
        this.tweens.add({
            targets: startButton,
            duration: 3000,
            alpha: {from: 0, to: 1},
        });

        return startButton
    }

}
