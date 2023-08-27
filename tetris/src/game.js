import Tetronimo from "./tetronimo";
import Enemy from "./enemy";
import Board from "./board";

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
        this.speed = 300;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.loadAudios();
        this.addKeys();
        this.figures = this.add.group();
        this.board = new Board();
        this.tetronimosLayer = this.add.layer();
        this.addFigure();
        this.addBorders();
        this.moveThisShit(this.speed);
        this.gameOver = false;
        // this.playMusic();
    }   

    addBorders () {
        this.add.rectangle(320, 0, 200, this.height, 0x222222).setOrigin(0)
        this.add.rectangle(0, 32 * this.board.height, this.width/2, 200, 0x222222).setOrigin(0)

    }

    addFigure () {
        const figure = this.figure = new Tetronimo(4, 0, "L", Phaser.Math.RND.pick(["red", "green", "blue", "yellow", "grey", "black", "purple", "orange"]));
        this.board.add(figure);
        this.playAudio("appear")
        // this.figure = new Figure(this, this.center_width, this.center_height + 128);
    }

    moveThisShit (delay = 5000) {
        this.time.addEvent({
            delay,
            callback: () => {
                if (this.gameOver) return;
                this.render(this.board);
                this.board.move();
                //console.log(this.board.print());
                //this.moveThisShit();
            },
            callbackScope: this,
            loop: true
          });
        // this.figure = new Figure(this, this.center_width, this.center_height + 128);
    }

    render (board) {
        this.tetronimosLayer.removeAll();
        console.log("Rendering tetronimos!: ", board.tetronimos)
        board.tetronimos.forEach(tetronimo => {
            tetronimo.current.forEach(({x, y}) => {
                this.tetronimosLayer.add(this.add.sprite((tetronimo.x + x) * 32, (tetronimo.y + y) * 32, tetronimo.color).setOrigin(0))
            });
        });
    }

    loadAudios () {
        this.audios = {
            clear: this.sound.add("clear"),
            rotate: this.sound.add("rotate"),
            move: this.sound.add("move"),
            gameOver: this.sound.add("gameOver"),
            appear: this.sound.add("appear"),
            push: this.sound.add("push"),
            land: this.sound.add("land"),
        };
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

    addKeys () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update () {
        if (this.gameOver) return;
        if (this.board.touchdown) {
            this.playAudio("land");
            console.log("ADD FIGURE!", new Date().toDateString())
            this.render(this.board);
            this.board.removeLines();
            this.addFigure();
            if (this.board.gameOver()) {
                this.finishScene();
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.addFigure()
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.down) || Phaser.Input.Keyboard.JustDown(this.S)) {
            this.board.pushDown(this.board.activeTetronimo)
            this.playAudio("push");
            this.render(this.board);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) {
            console.log("Up!");
            this.board.activeTetronimo.rotateRight();
            this.playAudio("rotate");
            this.render(this.board);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.right) || Phaser.Input.Keyboard.JustDown(this.D)) {
            this.board.right(this.board.activeTetronimo);
            this.playAudio("move");
            this.render(this.board);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.left) || Phaser.Input.Keyboard.JustDown(this.A)) {
            this.board.left(this.board.activeTetronimo);
            this.render(this.board);
            this.playAudio("move");
        }
    }

    resolve () {

    }

    finishScene () {
        this.gameOver = true;
        this.playAudio("gameOver");
        console.log("GAME OVER")
        this.add.bitmapText(this.center_width, this.center_height, "pixelFont", "GAME OVER", 40).setOrigin(0.5);
        // this.theme.stop();
       // this.scene.start("transition", { next: "underwater", name: "STAGE", number: this.number + 1 });
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
