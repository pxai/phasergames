import Player from "./player";
import DungeonGenerator from "./dungeon_generator";
import { RockSmoke, Debris, elements } from "./particle";
import Element from "./element";

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
      this.cameras.main.setBackgroundColor(0x222222);
      
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
      this.playMusic();
    }

    addStartGame () {
      this.startButton  = this.add.bitmapText(this.center_width,64, "pusab", "Click here to START", 60).setOrigin(0.5).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7);;

      this.startButton.setInteractive();

        this.tweens.add({
          targets: this.startButton,
          duration: 300,
          alpha: {from: 0, to: 1},
          repeat: -1,
          yoyo: true
      });

      this.startButton.on('pointerdown', () => {
          //this.sound.add("change").play();
          this.player.activate();
          console.log("Click to start")
      })
    }

    addMap() {
      this.dungeon = new DungeonGenerator(this);
    }

    setScore() {
      this.scoreText = this.add.bitmapText(100, 40, "pusab", String(this.registry.get("score")).padStart(6, '0'), 60).setOrigin(0.5).setScrollFactor(0)
    }

    hitFloor(player, platform) {

    }

    drill (player, tile) {
      if (player.drilling && tile && (tile.index > -1 && tile.index < 4)) {

        this.reduceTile(tile)

        if (!this.drillAudio?.isPlaying) this.drillAudio.play({volume: 0.2, rate: 1 });
        const color = 0xffffff;
        const points = 10;
        new RockSmoke(this, tile.pixelX, tile.pixelY + Phaser.Math.Between(-5, 5))
        let stone = this.sound.add("stone");
        stone.play({volume: 0.2, rate: 1, forceRestart: false });
        this.showPoints(tile.pixelX, tile.pixelY, points, color);
        this.updateScore(points)
        new Debris(this, tile.pixelX, tile.pixelY, color)
        //this.spawnElement(tile.pixelX, tile.pixelY, tile.properties.element)
        if (this.isFinished()) {
          this.finishScene()
        }
      }
    }

    reduceTile (tile) {
      if (tile.index === 0) {
        this.dungeon.stuffLayer.removeTileAt(tile.x, tile.y);
      } else {
        this.dungeon.stuffLayer.putTileAt(tile.index - 1, tile.x, tile.y);
      }
    }

    canMove () {
      const point = this.cameras.main.getWorldPoint(this.input.mousePointer.x, this.input.mousePointer.y)
      const tile = this.dungeon.groundLayer.getTileAtWorldXY(point.x, point.y)
      return [0, 1, 2, 3, 7, 8, 9, 10].includes(tile?.index)
    }

    isFinished () {
     return this.dungeon.stuffLayer.getTilesWithin().filter(tile => [0, 1, 2, 3].includes(tile.index)).length === 0
    }

    spawnElement(x, y, name) {
      if (name === "orange") return;

      if (Phaser.Math.Between(0, 31) > 30) {
        this.time.delayedCall(2000, () => { this.elements.add(new Element(this, x, y, name));}, null, this);
      }

      if (Phaser.Math.Between(0, 51) > 50 && +this.registry.get("speed") < 300) {
        this.time.delayedCall(2000, () => { this.elements.add(new Element(this, x, y, "oil"));}, null, this);
      }
    }

    showPoints (x, y, score, color = 0xff0000) {
      let text = this.add.bitmapText(x + 20, y - 80, "pusab", "+"+score, 40).setDropShadow(2, 3, color, 0.7).setOrigin(0.5);
      this.tweens.add({
          targets: text,
          duration: 1000,
          alpha: {from: 1, to: 0},
          x: {from: text.x + Phaser.Math.Between(-10, 10), to: text.x + Phaser.Math.Between(-40, 40)},
          y: {from: text.y - 10, to: text.y - 60},
          onComplete: () => {
              text.destroy()
          }
      });

      this.textUpdateEffect(this.scoreText, color)
  }

   textUpdateEffect (textElement, color) {
    textElement.setTint(color);
    const prev = textElement.y;
    this.tweens.add({
      targets: textElement,
      duration: 100,
      alpha: {from: 1, to: 0.8},
      scale: {from: 1.4, to: 1},
      repeat: 5,
      onComplete: () => {
        textElement.setTint(0xffffff);
        textElement.y = prev;
      }
    });
   }

    addPlayer() {
      this.elements = this.add.group();
      const playerPosition =  this.dungeon.playerPosition;//this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0, +this.registry.get("drill"), +this.registry.get("speed"),+this.registry.get("shield"), +this.registry.get("life"));

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);
  
      this.physics.add.overlap(this.player, this.dungeon.stuffLayer, this.drill, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.elements, this.pickElement, ()=>{
        return true;
      }, this);
  
      this.physics.add.overlap(this.player, this.exit, () => { 
        this.time.delayedCall(1000, () => this.finishScene(), null, this);
      }, ()=>{
        return true;
      }, this);


      this.physics.add.overlap(this.player, this.foeActivators, this.spawnFoe, ()=>{
        return true;
      }, this);

      this.foes = this.add.group();
      this.foeShots = this.add.group();
      this.physics.add.overlap(this.player, this.foes, this.killFoe, ()=>{
        return true;
      }, this);
    }

    addText (object) {
      this.add.bitmapText(object.x, object.y, "pusab", object.properties[0].value, 40).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7).setOrigin(0.5)

    }

    hitPlayer (player, shot) {
      const life = Phaser.Math.Between(10, 20) - this.player.shield;
      this.playAudio("hitplayer");
      shot.showPoints(life)
      this.decreaseLife(life)
      this.addExplosion(shot.x, shot.y, 30)
      shot.destroy()
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

    killFoe(player, foe) {
      this.playAudio("foedestroy");
      foe.dead();
    }

    spawnFoe(player, foeActivator) {
      const {x, y} = foeActivator;
      foeActivator.destroy();
      if (Phaser.Math.Between(0, 3)>2)
        this.time.delayedCall(3000, () => { this.addFoe(x, y) }, null, this);
    }

    addFoe(x, y) {
      const foe = new Foe(this, x, y);
      this.foes.add(foe); 
    }

    pickElement (player, element) {
      const updateItem = {
        "gold": this.updateShield.bind(this),
      }
      this.playAudio("stageclear2");
      const improved = {"gold": "1 shield"}
      const {color, hits, points} = elements[element.name];
      if (element.name === "oil") this.playAudio("yee-haw", {volume: 0.8});
      this.showPoints(this.player.x, this.player.y, improved[element.name], color);
      updateItem[element.name](1);
      element.destroy();
    }

    addExit() {
      const exitPosition = this.objectsLayer.objects.find( object => object.name === "exit")
      this.exit = this.add.rectangle(exitPosition.x, exitPosition.y, 32, 32, 0xffffff).setAlpha(0).setOrigin(0);
      this.physics.add.existing(this.exit);
      this.exit.body.setAllowGravity(false);
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
          "foeshot": this.sound.add("foeshot"),
          "stageclear1": this.sound.add("stageclear1"),
          "stageclear2": this.sound.add("stageclear2"),
          "hitplayer": this.sound.add("hitplayer"),
          "hitwall": this.sound.add("hitwall"),
          "yee-haw": this.sound.add("yee-haw"),
        };
        this.drillAudio = this.sound.add("drill");
      }

      playAudio(key) {
        this.audios[key].play();
      }


    update(time, delta) {
      this.input.mousePointer.updateWorldPoint(this.cameras.main)
      if (!this.player.death) this.player.update(time, delta);
      this.foes.children.entries.forEach(foe => foe.update());
    }

    gameOver () {
      this.registry.set("shield", 0);
      this.sound.stopAll();
      this.scene.start("transition", { number: this.number});
    }

    finishScene () {
      this.sound.stopAll();
      this.playAudio("stageclear1");
      const nextScene = (this.number < 3) ? "transition" : "outro";
      this.scene.start(nextScene, {number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(String(score).padStart(6, '0'));
    }
}
