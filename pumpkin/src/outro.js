export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    init (data) {
        console.log("outro", data);
        this.index = data.index;
        this.scenes = data.scenes;
    }

    preload () {
        console.log("transition to ", this.scenes);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.titleTest = this.add.bitmapText(this.center_width, 40, "wizardFont", "THE END", 25).setTint(0x902406).setOrigin(0.5)
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "Finally Jack got out.",
            "\"It was dark in there\"",
            "He walked back to the tavern",
            "but he was so drunk that he couldn't recall",
            "\"I think I saw somebody in\"",
            "...",
            "\"Did I? Well, maybe not. Hics!\""
        ];
        this.showHistory();
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.time.delayedCall(20000, () => this.loadNext());
    }

    update () {
    }

    loadNext(sceneName) {
        this.scene.start("splash", {index: -1, scenes: this.scenes });
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
    }

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "wizardFont", text, 20).setTint(0xdc5914).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 1000,
            alpha: 1
        })
    }
}
