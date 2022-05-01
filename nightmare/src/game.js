import Stage from "./stage";
import sounds from "./sounds";
import Card from "./card";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
    }

    preload () {
        this.primaryColor = this.registry.get("primaryColor");
        this.secondaryColor = this.registry.get("secondaryColor");
        this.tertiaryColor = this.registry.get("tertiaryColor");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(this.secondaryColor - 0x2f2f2f);
        this.addPointer();
        this.addDeck();
        this.addStage();
        // this.loadAudios();
        // this.playMusic();
    }

    addStage () {
        this.totalResolved = 0;
        this.stage = new Stage("Sample stage")
        this.tiles = {};
        this.currentCard = null;
        for (let x = 0; x < this.stage.width; x++) {
            this.tiles =  {[x]: {}, ...this.tiles};
            for (let y = 0; y < this.stage.height; y++) {
                //let card = this.add.sprite(196 + (x * 100), 196 + (y * 128), "cards").setOrigin(0.5).setTint(this.primaryColor)
                let card = new Card(this, 64, 64, this.stage.tiles[x][y])

                this.tiles[x] =  {[y]: card, ...this.tiles[x] };
                this.currentCard = card;
            }
        }
        console.log(this.tiles)
        const timeline = this.tweens.createTimeline();
        timeline.add({
            targets: [this.tiles[this.stage.width-1][this.stage.height-1]],
            scale: {from: 1.1, to: 1},
            duration: 500
        })

        for (let x = 0; x < this.stage.width; x++) {
            for (let y = 0; y < this.stage.height; y++) {
                timeline.add({
                    targets: [this.tiles[x][y]],
                    duration: 200,
                    x: {from: 64, to: 256 + (x * 100) },
                    y: {from: 64, to: 128 + (y * 128)},
                    onComplete: () => {
                        console.log("Completed! ", this.tiles[x][y].card)
                        this.tiles[x][y].card.play("flip", true);
                    }
                })
            }
        }

        timeline.play();
    }

    resolveCard (card) {
        this.totalResolved++;
        console.log("Resolved?", this.totalResolved, this.stage.length)
        this.currentCard = card;
        card.card.playReverse("flip", true)
        const destinyX = this.width - (64 + 100);
        const destinyY = this.height - (64 + 128);
        card.removeInteractive();

        this.tweens.add({
            targets: [card],
            x: {from: card.x, to: destinyX},
            y: {from: card.y, to: destinyY},
            duration: 500
        })

        if (this.totalResolved === this.stage.length) {
            console.log("Stage resolved!!", this.totalResolved, this.stage.length)
            this.time.delayedCall(1000, () => { this.finishScene() }, null, this);
        }
    }

    addDeck() {
        this.deck = null;
        this.add.sprite(64, 64, "cards").setOrigin(0.5).setTint(this.primaryColor)

        Array(3).fill().forEach((_, i) => {
            this.deck = this.add.sprite(64 + ((i+1) *8), 64 + ((i+1) * 8), "cards", 3).setOrigin(0.5).setTint(this.primaryColor)
        })
    }

    addPointer() {
        this.pointer = this.input.activePointer;
        this.input.mouse.disableContextMenu();
        this.setPickCursor();
    }

    setDefaultCursor() {
        this.input.setDefaultCursor('default');
    }

    setPickCursor() {
        this.input.setDefaultCursor('url(assets/images/pick.png), pointer');
    }

    setForbiddenCursor() {
        this.input.setDefaultCursor('url(assets/images/forbidden.png), pointer');
    }

    loadAudios () {
        this.audios = {};
        sounds.forEach(sound => {
            this.audios[sound] = this.sound.add(sound)
        });
    }

    playAudio (key) {
        this.audios[key].play();
    }

    playMusic (theme = "game") {
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
        });
    }

    update () {
        this.updatePointer();
        if (this.pointer.isDown) {
            if (this.pointer.rightButtonDown()) {
                console.log("Right clicky")
            } else {
                console.log("Left clicky")
            }
    
          }
    }

    updatePointer() {

    }

    finishScene () {
        // this.theme.stop();
        this.scene.start("transition", { next: "underwater", name: "STAGE", number: this.number + 1 });
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
