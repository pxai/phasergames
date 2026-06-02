import Dungeon from './dungeon';
import { Tile, PlayerCard } from './tile';
import Word from './word';
import words from './words';


export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
      this.playerClass = data.playerClass;
      this.lang = "en";
      console.log("Player class: ", this.playerClass, words)
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;

      this.wordService = new Word(words["en"])
      this.addTitle();
      this.addScore();
      this.generateDungeon();
      //this.loadAudios();
      // this.playMusic();
    }

    addTitle () {
      this.title = this.add.bitmapText(this.center_width, 32, "pixelFont", "Wordgeon", 96)
        .setOrigin(0.5)
        .setTint(0x88d24c)
        .setDropShadow(2, 3, 0xbf2522, 0.7);
    }

    addScore () {
      this.scoreText = this.add.bitmapText(this.center_width,  128, "pixelFont", this.s, 64)
        .setOrigin(0.5)
        .setTint(0x88d24c)
        .setDropShadow(2, 3, 0xbf2522, 0.7);
    }

    generateDungeon () {
      this.dungeon = new Dungeon();
      this.paintDungeon();
      this.playedLetters = [] //this.dungeon.generatePlayerCards();
      this.paintUserCards();
    }

    paintDungeon () {
      // give me initial horizontal position considering each tile is 64x64
      const initialX = this.center_width - (this.dungeon.width * 64) / 2;
      const initialY = 64
      this.dungeon.tiles.forEach((row, i) => {
        row.forEach((tile, j) => {
          const x = initialX + (j * 64) + 32;
          const y = initialY + (i * 64 + 128);
          const tileSprite = new Tile(this, x, y, tile.letter);

          tileSprite.setInteractive();
          tileSprite.on("pointerup", () => {
            if (!tileSprite.selected) {
              tileSprite.setTint(0xFF0000);
              this.playedLetters.push(tileSprite);
            } else {
              tileSprite.setTint(0xffffff);
              this.playedLetters.splice(this.playedLetters.indexOf(tileSprite), 1);
            }
            tileSprite.toggle();
            this.paintUserCards();
            console.log(tileSprite.show());
            console.log("Result player letters: ", this.playedLetters)
          });
          tileSprite.on("pointerover", () => {
            if (!tileSprite.selected)
              tileSprite.setTint(0xFF00FF);
          });
          tileSprite.on("pointerout", () => {
            if (!tileSprite.selected)
              tileSprite.setTint(0xffffff)
          });
        });
      });
    }

    paintUserCards () {
      const initialX = this.center_width - (this.playedLetters.length * 64) / 2;
      const initialY = 312
      this.selectedPoints = 0;
      if (this.playerCards) { this.playerCards.children.each((card) => {
        card.destroy();
      }); }
      if (this.solveButton) {
        this.solveButton.destroy()
        this.pointsText.destroy()
      }

      this.playerCards = this.add.group();
      console.log(this.playedLetters)
      let word = "";
      this.playedLetters.forEach((card, i) => {
        console.log(card)
        const x = initialX + (i * 64 + 32);
        const y = initialY + (this.dungeon.height * 64 + 64);
        const playerCard = new PlayerCard(this, x, y, card, i)
        this.playerCards.add(playerCard);
        playerCard.setInteractive();
        this.selectedPoints += card.points;
        playerCard.on("pointerup", () => {
          card.setTint(0xFFffff);
          this.selectedUserCard = null;
          this.selectedUserCard = playerCard;
          console.log("Selected! ", playerCard.letter);
          this.playedLetters.splice(i, 1);
          this.paintUserCards()
          card.toggle();
        });
        playerCard.on("pointerover", () => {
          playerCard.setTint(0xFF00FF);
        });
        playerCard.on("pointerout", () => {
          playerCard.setTint(0x88d24c);
        });

        word = word + card.letter
      });

      if (word.length > 0 && this.wordService.isValid(word)) {
        this.addSolveButton ()
      } else if(this.solveButton) {
        this.solveButton.destroy()
        this.pointsText.destroy()
      }
    }

    addSolveButton () {
      const x = this.center_width;
      const y = 100 + (this.dungeon.height * 64 + 128);
      this.solveButton = this.add.bitmapText(this.center_width, y, "pixelFont", "Solve!", 96)
        .setOrigin(0.5)
      this.pointsText = this.add.bitmapText(this.center_width, y + 64, "pixelFont", `+${this.selectedPoints}`, 96)
        .setOrigin(0.5)

      this.solveButton.setInteractive();
       this.solveButton.on("pointerup", () => {
          this.solve()
        });
        this.solveButton.on("pointerover", () => {
          this.solveButton.setTint(0xFF00FF);
        });
        this.solveButton.on("pointerout", () => {
          this.solveButton.setTint(0x88d24c);
        });
    }

    solve() {
      let word = "";
      this.updateScore(this.selectedPoints)
      this.playedLetters.forEach((card, i) => {
        card.destroy();

        word = word + card.letter
      });
      this.playedLetters = []
      this.playerCards.children.each((card) => {
        card.destroy();
      });
      console.log("Solving!!", word)
      this.solveButton.destroy()
      this.pointsText.destroy()
    }

      loadAudios () {
        this.audios = {
          "beam": this.sound.add("beam"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="game") {
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
      })
      }

    update() {

    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString().padStart(5, '0'));
    }
}
