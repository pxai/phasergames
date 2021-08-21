import configScene1 from "./scenes/stage1/config";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        console.log("splash");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "Bla bla bla bla bla bla",
            "bla bla bla bla bla bla"
        ];
        this.time.delayedCall(1000, () => this.showLogo(), null, this); 
        //this.scene.start("transition", {name: "STAGE1", nextScene: "stage1"})
        this.redbean = this.sound.add("redbean");
        this.input.keyboard.on("keydown-ENTER", () => this.scene.start("transition", {name: "STAGE1", nextScene: "stage1"}), this);
    }

    showLogo() {
         this.logo = this.splashLayer.add(this.add.sprite(this.center_width, 1000, "logo").setOrigin(0.5));

         this.tweens.add({
            targets: this.splashLayer.getChildren(),
            duration: 2000,
            y: { from: 800, to: 160 },
            onComplete: this.showHelp,
            onCompleteScope: this,
         });
    }

    showHelp() {
        this.redbean.play();
        console.log("Show help");
        this.add.bitmapText(this.center_width, 420, "pixelFont", "A FARTASTIC ADVENTURE!!", 30).setOrigin(0.5);
        this.add.sprite(this.center_width -40, 460, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 460, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.player = this.add.sprite(this.center_width, 360, "aki").setOrigin(0.5).setScale(2);
        this.anims.create({
            key: "idlesplash",
            frames: this.anims.generateFrameNumbers("aki", { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: "crouch",
            frames: this.anims.generateFrameNumbers("aki", { start: 2, end: 3 }),
            frameRate: 5
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("aki", { start: 2, end: 5 }),
            frameRate: 5
        });
        this.player.anims.play("jump")
        this.anims.on('animationcomplete', this.animationComplete, this);
        const helpText = "Arrows to move. Down to FART";

        this.add.bitmapText(this.center_width, 500, "pixelFont", helpText, 20).setOrigin(0.5);
        this.add.sprite(this.center_width - 180, 530, "single-bean").setScale(0.8).setAngle(25);
        this.redText = this.add.bitmapText(this.center_width - 150, 520, "pixelFont", "Extra JUMP", 20);
        this.add.sprite(this.center_width + 20, 530, "single-redbean").setScale(0.8).setAngle(25);
        this.redText = this.add.bitmapText(this.center_width + 40, 520, "pixelFont", "Killer FART", 20);
        this.pressEnter = this.add.bitmapText(this.center_width, 580, "pixelFont", "PRESS ENTER TO BEGIN", 30).setOrigin(0.5).setVisible(true);
        this.tweens.add({
            targets: this.pressEnter,
            duration: 1000,
            visible: false,
            repeat: -1
        })
    }

    animationComplete(animation, frame) {
        const next = (animation.key === "crouch") ? "jump" : "crouch";
        this.player.anims.play(next, true)
    }
}
