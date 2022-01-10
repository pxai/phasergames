import { Particle } from "./particle";

export default class GameOver extends Phaser.Scene {
    constructor () {
        super({ key: "gameover" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x111111) //0xfef1ca

        this.add.bitmapText(this.center_width, this.center_height - 160, "celtic", "YOU CLEANED THE DUNGEONS!!", 25).setTint(0x03a062).setOrigin(0.5).setDropShadow(2, 3, 0xBAD978, 0.7)
        
        const totalTime = +this.registry.get("totalTime");
        const minutes= parseInt(totalTime/60)
        const time = String(minutes).padStart(2, '0') + "m " + String(parseInt(totalTime) % 60).padStart(2, '0') + "s";
        this.add.bitmapText(this.center_width, this.center_height - 75, "celtic", "TOTAL: " + time, 35).setTint(0x03a062).setOrigin(0.5).setDropShadow(2, 3, 0xBAD978, 0.7)

        this.add.bitmapText(this.center_width, 90, "celtic", "GAME OVER", 45).setTint(0x03a062).setOrigin(0.5).setDropShadow(4, 6, 0xBAD978, 0.7)
        this.add.bitmapText(this.center_width, this.height - 100, "celtic", "Clic anywhere", 15).setTint(0x03a062).setOrigin(0.5).setDropShadow(1, 2, 0xBAD978, 0.7)
        this.input.on('pointerdown', (pointer) => this.startSplash(), this);

        this.addPlayer();
    }

    addPlayer() {
        const shadow = this.add.image(this.center_width, this.center_height + 130, "playerlogo").setTint(0x000000).setScale(0.8).setAlpha(0.7);
        const player = this.add.image(this.center_width, this.center_height, "playerlogo");
      
        this.tweens.add({
          targets: [player, shadow],
          duration: 1000,
          y: '-= 5',
          repeat: -1,
          yoyo: true
        })
    }

    update () {
        new Particle(this, Phaser.Math.Between(0, this.width),Phaser.Math.Between(0, this.height), 0x03a062, Phaser.Math.Between(4, 10));
    }

    startSplash () {
        this.scene.start("splash");
    }
}
