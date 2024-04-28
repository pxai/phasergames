import Player from "./player";
import DungeonGenerator from "./dungeon_generator";
import { RockSmoke, Debris } from "./particle";
import { Tnt } from "./tnt";
import Blow from "./blow";

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
      this.cameras.main.setBackgroundColor(0x000000);
      this.addMap();

      this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.pointer = this.input.activePointer;
      this.colliderActivated = true;
      this.addPlayer();

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.physics.world.enable([ this.player ]);
      this.setScore();
      this.addStartGame();
      this.loadAudios();
      //this.playMusic();
      this.input.keyboard.on("keydown-SPACE", () => this.finishScene(), this);
    }

    addStartGame () {
      this.startButton  = this.add.bitmapText(this.center_width, this.center_height, "pusab", "Click to START", 60).setOrigin(0.5).setTint(0xffffff)
        this.tweens.add({
          targets: this.startButton,
          duration: 100,
          alpha: {from: 0, to: 1},
          repeat: 10,
          yoyo: true,
          onComplete: () => { this.startButton.destroy() }
      });
    }

    addMap() {
      this.mapReady = false;
      this.foes = this.add.group();
      this.tntActivators = this.add.group();
      this.tnts = this.add.group();
      this.blows  = this.add.group();
      this.dungeon = new DungeonGenerator(this);
      this.mapReady = true;
    }

    setScore() {
      this.scoreText = this.add.bitmapText(this.center_width, 40, "pusab", String(this.registry.get("score")).padStart(6, '0'), 60).setOrigin(0.5).setScrollFactor(0)
    }

    hitFloor(player, platform) {

    }

    drill (player, tile) {
      if (player.drilling && tile && (tile.index > -1 && tile.index < 16)) {
        this.destroyTile(tile)
      }
    }

    destroyTile (tile) {
      this.reduceTile(tile)

      if (!this.drillAudio?.isPlaying) this.drillAudio.play({volume: 0.2, rate: 1 });
      const color = 0xffffff;
      const points = 10;
      new RockSmoke(this, tile.pixelX, tile.pixelY + Phaser.Math.Between(-5, 5))
      let stone = this.sound.add("stone");
      //stone.play({volume: 0.2, rate: 1, forceRestart: false });
      this.showPoints(tile.pixelX, tile.pixelY, points, color);
      this.updateScore(points)
      new Debris(this, tile.pixelX, tile.pixelY, color)

      if (this.isFinished()) {
        this.finishScene()
      }
    }

    reduceTile (tile) {
      if (tile.index < 0) return;
      if (tile.index === 0) {
        this.dungeon.stuffLayer.removeTileAt(tile.x, tile.y);
      } else {
        this.dungeon.stuffLayer.putTileAt(tile.index - 1, tile.x, tile.y);
      }
    }

    canMove () {
      const point = this.cameras.main.getWorldPoint(this.input.mousePointer.x, this.input.mousePointer.y)
      const tile = this.dungeon.groundLayer.getTileAtWorldXY(point.x, point.y)
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20].includes(tile?.index)
    }

    isFinished () {
     return this.dungeon.stuffLayer.getTilesWithin().filter(tile => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(tile.index)).length === 0
    }

    showPoints (x, y, score, color = 0xFF8700) {
      let text = this.add.bitmapText(x + 20, y - 80, "pusab", "+"+score, 20).setOrigin(0.5);
      this.tweens.add({
          targets: text,
          duration: 1000,
          x: {from: text.x + Phaser.Math.Between(-10, 10), to: text.x + Phaser.Math.Between(-40, 40)},
          y: {from: text.y - 10, to: text.y - 60},
          onComplete: () => {
              text.destroy()
          }
      });

      this.textUpdateEffect(this.scoreText, 0xffffff)
  }

   textUpdateEffect (textElement, color) {
    textElement.setTint(color);
    const prev = textElement.y;
    this.tweens.add({
      targets: textElement,
      duration: 100,
      alpha: {from: 1, to: 0.8},
      repeat: 5,
      onComplete: () => {
        textElement.setTint(0xffffff);
        textElement.alpha = 1;
        textElement.y = prev;
      }
    });
   }

    addPlayer() {
      const playerPosition =  this.dungeon.playerPosition;//this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, this.number, +this.registry.get("drill"), +this.registry.get("speed"),+this.registry.get("shield"), +this.registry.get("life"));

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.dungeon.stuffLayer, this.drill, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.foes, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.tntActivators, this.spawnTnt, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.tnts, this.blowTnt, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blows, this.foes, this.blowHitFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blows, this.dungeon.stuffLayer, this.blowHitPlatform, ()=>{
        return true;
      }, this);
    }


    addText (object) {
      this.add.bitmapText(object.x, object.y, "pusab", object.properties[0].value, 40).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7).setOrigin(0.5)

    }

    hitPlayer (player, foe) {
      if (player.death) return
      this.addExplosion(foe.x, foe.y, 30)
      this.playAudio("foedestroy");
      foe.death();
      player.dead();
      this.gameOver()
    }

    addExplosion (x, y, radius = 30) {
      const explosion = this.add.circle(x, y, 5).setStrokeStyle(20, 0xffffff);
      this.tweens.add({
          targets: explosion,
          radius: {from: 10, to: 30},
          alpha: { from: 1, to: 0.3},
          duration: 250,
          onComplete: () => {  explosion.destroy()}
      })
    }

    spawnTnt(player, tntActivator) {
      const {x, y} = tntActivator;
      tntActivator.destroy();
      this.time.delayedCall(1000, () => { this.addTnt(x, y) }, null, this);
    }

    addTnt(x, y) {
      const tnt = new Tnt(this, x, y);
      this.tnts.add(tnt);
    }

    blowHitFoe (blow, foe) {
      this.playAudio("foedestroy");
      foe.death();
    }

    blowTnt (player, tnt) {
      this.blows.add(new Blow(this, tnt.x, tnt.y));
      this.playAudio("explosion");
      this.cameras.main.shake(100, 0.01);
      tnt.destroy();
    }

    blowHitPlatform (blow, tile) {
      this.destroyTile(tile)
    }

    playMusic (theme="engine") {
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

      loadAudios () {
        this.audios = {
          "explosion": this.sound.add("explosion"),
          "foedestroy": this.sound.add("foedestroy"),
          "stageclear1": this.sound.add("stageclear1"),
          "stageclear2": this.sound.add("stageclear2"),
          "hitplayer": this.sound.add("hitplayer"),
          "hitwall": this.sound.add("hitwall")
        };
        this.drillAudio = this.sound.add("drill");
      }

      playAudio(key) {
        this.audios[key].play();
      }


    update(time, delta) {
      this.input.mousePointer.updateWorldPoint(this.cameras.main)
      if (!this.player.death) this.player.update(time, delta);
    }

    gameOver () {
      this.sound.stopAll();
      this.scene.start("outro", { number: this.number});
    }

    finishScene () {
      this.sound.stopAll();
      this.playAudio("stageclear1");

      this.scene.start("transition", {number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(String(score).padStart(6, '0'));
    }
}
