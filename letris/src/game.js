import Board from "./board";
import Letter from "./letter";
import LETTERS from "./letters";
import Trie from "./trie";

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
        this.lang = "en";
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.addBoard();
        this.addTrie();
        this.tileMap = this.make.tilemap({ key: "scene", tileWidth: 32, tileHeight: 32 });
        this.tileSetBg = this.tileMap.addTilesetImage("brick");
        // this.tileMap.createLayer('background', this.tileSet)

        this.tileSet = this.tileMap.addTilesetImage("brick");

        this.platform = this.tileMap.createLayer("scene", this.tileSet);
        this.ground = this.tileMap.createLayer("ground", this.tileSet);
        this.objectsLayer = this.tileMap.getObjectLayer("objects");
        this.platform.setCollisionByExclusion([-1]);
        this.ground.setCollisionByExclusion([-1]);

        this.addLetters();
        this.cursor = this.input.keyboard.createCursorKeys();

        // this.loadAudios();
        // this.playMusic();
    }

    addBoard () {
        this.board = new Board(7, 13);
    }

    addTrie () {
      this.trie = new Trie();
      this.trie.load()
    }

    addToBoard (letter) {
        if (this.board.positions[letter.posY][letter.posX]) console.log("We have a problem!!");
        this.board.positions[letter.posY][letter.posX] = letter;
        console.log(this.board.positions);
    }

    addLetters () {
        this.letters = this.add.group();
        this.stoppedLetters = this.add.group();
        this.spawnLetter();
        this.physics.add.collider(this.letters, this.platform, this.hitPlatform, () => {
            return true;
        }, this);

        this.physics.add.collider(this.stoppedLetters, this.platform, this.hitPlatform, () => {
            return true;
        }, this);

        this.physics.add.collider(this.letters, this.ground, this.hitGround, () => {
            return true;
        }, this);

        this.physics.add.collider(this.stoppedLetters, this.ground, this.hitGround, () => {
            return true;
        }, this);

        this.physics.add.collider(this.letters, this.stoppedLetters, this.hitLetter, () => {
            return true;
        }, this);
    }

    hitPlatform (letter, tile) {
        console.log("Hit platfor");
    }

    hitGround (letter, tile) {
        if (letter.fixed) return;
        console.log("Hit ground");
        letter.hitGround();
        this.letters.remove(letter);
        this.stoppedLetters.add(letter);

        this.spawnLetter();
    }

    hitLetter (letter, stoppedLetter) {
        if (letter.fixed) return;
        letter.hitLetter();
        this.letters.remove(letter);
        this.stoppedLetters.add(letter);

        this.spawnLetter();
    }

    randomLetter () {
        const letters = LETTERS[this.lang];
        return letters[Phaser.Math.Between(0, letters.length - 1)];
    }

    spawnLetter () {
        const { letter, points } = this.randomLetter();
        this.letter = new Letter(this, 216, -25, letter, points);
        this.letters.add(this.letter);
    }

    loadAudios () {
        this.audios = {
            beam: this.sound.add("beam")
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

    update (time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {
            if (this.letter.body.touching) console.log("Is touching Right!");
            console.log("RIGHT", this.letter.body.touching);
            this.letter.moveRight();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
            if (this.letter.body.touching) console.log("Is touching LEfT!");
            console.log("LEFT", this.letter.body.touching);
            this.letter.moveLeft();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
            console.log("Down");
            this.letter.dashDown();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
            console.log("Up");
            this.letter.changeLetter();
        }
        this.letter.update(time, delta);
    }

    finishScene () {
        this.sky.stop();
        this.theme.stop();
        this.scene.start("transition", { next: "underwater", name: "STAGE", number: this.number + 1 });
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
