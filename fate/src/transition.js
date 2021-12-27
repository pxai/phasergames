import { Scene3D } from '@enable3d/phaser-extension' 
import Utils from "./utils";

export default class Transition extends Scene3D {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
    }

    preload () {
    }

    create () {

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.utils = new Utils(this);
        this.showLogo();
        this.showInstructions();
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.playMusic();
        //setTimeout(() => this.loadNext(), 300);
    }

    playMusic (theme="music") {
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
    
    showLogo () {
        this.logo = this.add.image(this.center_width, 150, "logo").setOrigin(0.5).setScale(0.7).setAlpha(0)
        this.tweens.add({
            targets: this.logo,
            duration: 3000,
            alpha: {from: 0, to: 1}
        })
    }

    showInstructions () {
        let text1, text2;
        text1 = this.utils.typeText("ARROWS + W + S", "computer", this.center_width + 190, this.center_height)
        this.time.delayedCall(2000, () => {
            text2 = this.utils.typeText(" PRESS SPACE", "computer", this.center_width + 190,  this.center_height + 100)
        }, null, this);

        //this.time.delayedCall(7000, () => this.playMusic(), null, this)
        this.time.delayedCall(4000, () => {
            let text3 = this.utils.typeText(" A GAME BY PELLO", "computer", this.center_width + 140, this.center_height + 200)
            let pelloLogo = this.add.image(this.center_width, this.center_height + 300, "pello_logo_old").setScale(0.2).setOrigin(0.5)
        }, null, this)
    }
    update () {
    }

    loadNext () {
        if (this.utils.typeAudio) this.utils.typeAudio.stop();

        this.scene.start("game", { name: this.name, number: this.number, time: this.time });
    }
}
