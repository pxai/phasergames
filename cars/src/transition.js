import {readData, saveData } from "./store";

export default class Transition extends Phaser.Scene {
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

    async create () {

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x354e61);
        await this.saveScore();
        await this.loadScores();
        this.add.bitmapText(this.center_width,70, "race", "SCOREBOARD", 120).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.space = this.add.bitmapText(this.center_width, 780, "race", "Press SPACE to start", 40).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    update () {
    }

    async saveScore () {
        const collection = document.getElementsByClassName("user_name");
        console.log("Username?", collection)
        this.userName = 'ANONYMOUS';
        try {
            this.userName = collection[0].innerHTML || 'ANONYMOUS';
        } catch (er) {

        }

        this.currentId = await saveData(+this.registry.get("score"), this.userName)
    }

    async loadScores () {
        const scores = await readData();
        const makeWayScores = scores.filter(score => score.game === "Make Way!!!").sort((a, b) => b.score - a.score);
        let amongFirst10 = false;

        makeWayScores.splice(0, 10).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 170 + (i * 60), "race", `${i+1}`, 60).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 170 + (i * 60), "race", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 60).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 170 + (i * 60), "race", `${String(score.score).padStart(10, '0')}`, 60).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            
            if (score.id === this.currentId) {
                console.log("Current ID: ", this.currentId)
                amongFirst10 = true;
                this.tweens.add({
                    targets: [text0, text1, text2],
                    duration: 300,
                    alpha: {from: 0, to: 1},
                    repeat: -1,
                    yoyo: true
                })
            }
        })
    }

    loadNext () {
        this.registry.set("score", 0);
        this.scene.start("game");
    }
}
