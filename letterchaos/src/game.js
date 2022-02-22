import Block from "./block";
import BlockGenerator from "./block_generator"
import words from "./words";

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
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.add.tileSprite(0, 0, 3600, 1800, "background").setOrigin(0.5);

      this.addLetters();
      this.addScore();


      this.loadAudios(); 
      this.playMusic();
    }

    addScore () {
      this.scoreText = this.add.bitmapText(this.center_width, this.height - 48, "pixelFont", String(this.registry.get("score")).padStart(6, '0'), 50).setOrigin(0.5).setDropShadow(3, 4, 0x222222, 0.7)
      this.letterText = this.add.bitmapText(this.width - 100, this.height - 48, "pixelFont", "1", 30).setOrigin(0.5).setDropShadow(2, 3, 0x222222, 0.7)
    }

    addLetters() {
      this.letters = this.add.group();
      this.explosions = this.add.group();
      this.leftColliders = this.add.group();
      this.rightColliders = this.add.group();
      this.blockGenerator = new BlockGenerator(this);
      this.input.mouse.disableContextMenu();
      this.physics.add.collider(this.letters, this.blocks, this.hitBlock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.letters, this.breakableBlocks, this.hitBlock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.letters, this.letters, this.hitBalls, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.rightColliders, this.leftColliders, this.joinRightLeftLetter, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.leftColliders, this.rightColliders, this.joinLeftRightLetter, ()=>{
        return true;
      }, this);

      this.blockGenerator.generate();
    }

    joinRightLeftLetter(right, left) {
      if (right.parentContainer.sticky) {
        right.parentContainer.joinRight(left.parentContainer);
        this.playAudio("join");
        left.parentContainer.destroy();
        this.showResolveMessage(right.parentContainer);
      }
    }

    joinLeftRightLetter(right, left) {
      if (right.parentContainer.sticky) {
        right.parentContainer.joinLeft(left.parentContainer);
        this.playAudio("join");
        left.parentContainer.destroy();
        this.showResolveMessage(right.parentContainer);
      }
    }

    explode(ball, explosion) {
      ball.react();
    }

    hitBalls (ball1, ball2) {
      this.playAudio("bump");
    }

    hitBlock (ball, block) {
    }

    createPool() {
      this.blockPool = [];
      this.blockPool = Array(1000).fill(0).map((_,i) => new Block(this, -100, -100, Phaser.Math.Between(0, 1), true, 1))
    }

    freeBlock () {
      return Phaser.Math.RND.pick(this.blockPool.filter(block => block.free))
    }

      loadAudios () {
        this.audios = {
          "bump": this.sound.add("bump"),
          "change": this.sound.add("change"),
          "fail": this.sound.add("fail"),
          "join": this.sound.add("join"),
          "resolve": this.sound.add("resolve"),
          "success": this.sound.add("success"),
          "spawn": this.sound.add("spawn")
        };
      }

      playAudio(key) {
        this.audios[key].play();
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

    update(delta, time) {
    }

    get totalLetters() {
      let total = 0;
      this.letters.children.entries.forEach( letter => {
        total += letter.letterLength;
      });

      return total;
    }

    checkGameOver() {
      if (this.totalLetters > 50) {
        this.gameOver();
      }
    }

    gameOver () {
      if (this.theme) this.theme.stop();
      this.scene.start("outro");
    }

    updateLetterCount () {
      this.letterText.setText(String(this.totalLetters));
  }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(String(score).padStart(6, '0'));
        this.tweens.add({
          targets: this.scoreText,
          duration: 50,
          scale: {from: 1.2, to: 1},
          repeat: 10
        })
    }

    showResolveMessage(letterContainer) {
      const {word, points} = letterContainer.getWord();
      if (words.includes(word.toLowerCase())) {
        const resolveWord = this.add.bitmapText(letterContainer.x, letterContainer.y, "pixelFont", "+" + points, 25).setDropShadow(2, 3, 0x222222, 0.7).setOrigin(0.5);
        this.tweens.add({
          targets: letterContainer,
          scale: { from: 1.2, to: 1 },
          duration: 50,
          repeat: 5,
          onComplete: () => { letterContainer.changeLetterColor(0x77dd77); }
        });
        this.tweens.add({
          targets: resolveWord,
          duration: 1000,
          y: { from: resolveWord.y - 20, to: resolveWord.y - 120},
          alpha: { from: 1, to: 0.2},
          onComplete: () => { resolveWord.destroy(); this.updateLetterCount(); }
        })
      } else {
        letterContainer.changeLetterColor(0xffffff);
      }

    }

    checkWord(letterContainer) {
      const hay = letterContainer.getWord().word.toLowerCase();
      const points = letterContainer.getWord().points;
      this.playAudio("resolve");

      if (words.includes(hay)) {

        this.tweens.add({
          targets: letterContainer,
          duration: 50,
          x: "+=10",
          y: "+=10",
          repeat: 10,
          onComplete: () => {
            this.cameras.main.shake(25 * (hay.length));
            this.playAudio("success");
            this.updateScore(letterContainer.getWord().points);
            letterContainer.clearWord();
            letterContainer.destroy();
          }
        })
        
        const winnerWord = this.add.bitmapText(letterContainer.x, letterContainer.y, "pixelFont", hay + " +" + points, 35).setDropShadow(2, 3, 0x222222, 0.7).setOrigin(0.5);
        this.tweens.add({
          targets: winnerWord,
          duration: 1000,
          y: { from: winnerWord.y - 20, to: winnerWord.y - 120},
          alpha: { from: 1, to: 0.2},
          onComplete: () => { winnerWord.destroy() }
        })
      } else {
        this.tweens.add({
          targets: letterContainer,
          duration: 25,
          x: "+=10",
          y: "+=10",
          repeat: 5,
          onComplete: () => {
            this.playAudio("fail");
          }
        })
        
      }
    }
}
