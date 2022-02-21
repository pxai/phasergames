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
      this.scoreText = this.add.bitmapText(this.center_width, this.height - 48, "pixelFont", String(this.registry.get("score")).padStart(6, '0'), 50).setOrigin(0.5).setScrollFactor(0)
      this.letterText = this.add.bitmapText(this.width - 100, this.height - 48, "pixelFont", "1", 30).setOrigin(0.5)
    }

    addLands () {
      this.shots = this.add.group();
      this.breakableBlocks = this.add.group();
      this.blocks = this.add.group();
      this.growStart = 0;

      this.createPool();

      this.growLand(32);

      this.physics.add.overlap(this.shots, this.breakableBlocks, this.shotBlock, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.boundLayer, this.breakableBlocks, this.destroyBlock, ()=>{
        return true;
      }, this);
      this.physics.add.overlap(this.boundLayer, this.blocks, this.destroyBlock, ()=>{
        return true;
      }, this);
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
      }
    }

    joinLeftRightLetter(right, left) {
      if (right.parentContainer.sticky) {
        right.parentContainer.joinLeft(left.parentContainer);
        this.playAudio("join");
        left.parentContainer.destroy();
      }
    }

    explode(ball, explosion) {
      ball.react();
    }

    hitBalls (ball, player) {
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

    growLand(length = 5) {
      let i = 0;
      for (i = 0; i < length; i++) {
        let block1 = this.freeBlock().reuse(this.growStart + (i * 32), 32, true, 1, false)
        let block2 = this.freeBlock().reuse(this.growStart + (i * 32), 700, true, -1, false)
        this.blocks.add(block1)
        this.blocks.add(block2);
      }

      for (i = 0; i < length; i++) {
        let block1 = this.freeBlock().reuse(0, (i * 32), true, 1, false)
        let block2 = this.freeBlock().reuse(1000, (i * 32), true, -1, false)
        this.blocks.add(block1)
        this.blocks.add(block2);
      }

      this.growStart += length * 32;
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
          volume: 1,
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
        this.playAudio("fail");
      }
    }
}
