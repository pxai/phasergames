import { Particle, Explosion, Light } from "./particle";
import Wizard from "./wizard";
import Player from "./player";

const STAGE_NAMES = ["Moonchild Temple", "The Clairvoyant's Lair", "The Seventh Son Covenant", "Infinite Dreams Chamber"]
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
      this.score = 0;
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.addMap();
      this.lines = this.add.group();
      this.loadAudios(); 
    
      this.pointer = this.input.activePointer;
      this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.trailLayer = this.add.layer();
      this.addPlayer();
      this.addWizards();
      this.addExits();
      this.finished = false;    
      this.physics.world.on('worldbounds', this.onWorldBounds.bind(this));
      this.playMusic();
      this.transition();
      this.showStage();
      this.addFireballs()
      this.addMana();
    }

    addMana () {
      this.emptyMana = null;
      this.castSpell = this.sound.add("cast");
      this.checkManaEvent = this.time.addEvent({ delay: 1000, callback: this.recoverMana, callbackScope: this, loop: true });
      this.mana = 100;
      this.manaText = this.add.bitmapText(this.center_width - 150, this.height - 10,  "celtic", "MANA: ", 15).setTint(0x03a062).setOrigin(0.5);
      this.manaBar = this.add.rectangle(this.center_width, this.height - 20, this.mana * 2, 20, 0x03a062).setOrigin(0.5);
    }

    recoverMana () {
      this.emptyMana = null;
      const difference = 100 - this.mana;
      this.mana += difference < 10 ? difference : 10;
      this.updateMana();
    }

    addMap() {
      this.tileMap = this.make.tilemap({ key: `stage${this.number}` , tileWidth: 16, tileHeight: 16 });

      this.tileSetBg = this.tileMap.addTilesetImage("tiles");
      this.tileMap.createLayer('background', this.tileSetBg)
  
 
      this.tileSet = this.tileMap.addTilesetImage("walls");
      this.platform = this.tileMap.createLayer(`stage${this.number}`, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.tileSetItems = this.tileMap.addTilesetImage("tiles");
      this.tileMap.createLayer('items', this.tileSetItems)
  
      this.platform.setCollisionByExclusion([-1]);

    }

    addPlayer () {
      this.playerInitialPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, this.playerInitialPosition.x, this.playerInitialPosition.y);
    }

    addExits () {
      this.exitPositions = this.objectsLayer.objects.filter( object => object.name.startsWith("exit"))
      this.exits = this.add.group();
      this.exitPositions.forEach(exit => {
        this.exits.add(new Exit(this, exit.x, exit.y));
      })
    }

    addWizards () {
      this.wizardPositions = this.objectsLayer.objects.filter( object => object.name.startsWith("wizard"))
      this.wizards = this.add.group();
      this.wizardPositions.forEach(wizard => {
        this.wizards.add(new Wizard(this, wizard.x, wizard.y, wizard.name));
      })
    }

    addFireballs () {
      this.spawnPoints = this.objectsLayer.objects.filter( object => object.name === "spawn")

      this.fireballs = this.add.group();
      const delay = 0;
      const x = this.center_width + (this.player.x < this.center_width ? Phaser.Math.Between(100, 300) : Phaser.Math.Between(-100, -300));
      this.time.delayedCall(3000, () => {
        this.showInstructions();
        Array(this.number + 1).fill().forEach(i => this.addFireball(i));
        this.physics.add.collider(this.fireballs, this.lines, this.hitLine, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.player, this.fireballs, this.death, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.fireballs, this.exits, this.exitBall, ()=>{
          return true;
        }, this);

        this.physics.add.overlap(this.fireballs, this.wizards, this.gotcha, ()=>{
          return true;
        }, this);

        this.physics.add.collider(this.fireballs, this.platform, this.hitFloor.bind(this), ()=>{
          return true;
        }, this);
      })
    }

    hitLine(fireball, line) {
      new Light(this, fireball.x, fireball.y, 0xffa700, 3);
    }

    exitBall(ball, exit) {
      ball.shadow.destroy();
      ball.destroy();
      this.text2.setText("PRESS SPACE\n\nTO SUMMON A FIREBALL").setAlpha(1)
      this.time.delayedCall(3000, () => {
        this.text2.setAlpha(0)
      })
    }

    addFireball(i) {
      const selected = i >= 0 ? i : Phaser.Math.Between(0, this.spawnPoints.length - 1);
      const point = this.spawnPoints[selected]
      this.playAudio("fireball")
      const fireball = new Fireball(this, point.x, point.y);

      this.fireballs.add(fireball);
      this.physics.moveTo(fireball, this.player.x, this.player.y, 200);
    }

    hitPlayer (fireball, player) {
      this.playAudio("boing")
    }

    hitFloor(fireball, platform) {
      this.playAudio("boing")
      new Explosion(this, fireball.x, fireball.y, 0x00cc00)
    }

    onWorldBounds (body, part) {
      const name = body.gameObject.name;
    }

    hitWall(){
      this.playAudio("boing")

    }

    showStage() {
      this.text0 = this.add.bitmapText(this.center_width, this.center_height - 100, "celtic", "Entering: ", 20).setTint(0x03a062).setOrigin(0.5)
      this.text0.setDropShadow(4, 6, 0x000000, 0.7);
      this.text1 = this.add.bitmapText(this.center_width, this.center_height, "celtic", STAGE_NAMES[this.number], 30).setTint(0x03a062).setOrigin(0.5)
      this.text1.setDropShadow(4, 6, 0x000000, 0.7);
      this.time.delayedCall(2500, () => {this.text0.destroy(); this.text1.destroy();});
    }

    showInstructions () {
      if (this.number === 0) {
        this.text2 = this.add.bitmapText(this.center_width, this.center_height - 150, "celtic", "DRAW PROTECTION SPELLS!\n\nREDIRECT BALLS TO WIZARDS!", 25).setTint(0x03a062).setOrigin(0.5)
        this.text2.setDropShadow(4, 6, 0x000000, 0.7);
        this.tweens.add({
          targets: this.wizards,
          alpha: { from: 0, to: 1},
          duration: 200,
          repeat: 20
        })
        this.time.delayedCall(3000, () => {
          this.text2.setText("MANA WILL REGENERATE.\n\nUSE IT WISELY!!")
          this.time.delayedCall(3000, () => {
            this.text2.setText("PRESS SPACE\n\nTO SUMMON A FIREBALL")
            this.time.delayedCall(3000, () => {
              this.text2.setAlpha(0)
            })
          });
        });
      }
    }

      loadAudios () {
        this.audios = {
          "boing": this.sound.add("boing"),
          "fail": this.sound.add("fail"),
          "marble": this.sound.add("marble"),
          "emptymana": this.sound.add("emptymana"),
          "fireball": this.sound.add("fireball"),
          "wizard": this.sound.add("wizard"),
          "player": this.sound.add("player"),
          "line": this.sound.add("line"),
          "cast": this.sound.add("cast"),
          "stageclear": this.sound.add("stageclear"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="theme") {
        this.theme = this.sound.add(theme + this.number );
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    transition () {
      const blocks = this.add.group({ key: 'blackblock', repeat: 191 });
      Phaser.Actions.GridAlign(blocks.getChildren(), {
          width: 16,
          cellWidth: 50,
          cellHeight: 50,
          x: 25,
          y: 25
      });
      let _this = this;
  

      let i = 0;
  
      blocks.children.iterate(function (child) {
          _this.tweens.add({
              targets: child,
              scaleX: 0,
              scaleY: 0,
              alpha: 0,
              y: '+=64',
              angle: 180,
              ease: 'Power3',
              duration: 1000,
              delay: 1000 + (i * 100)
          });
  
          i++;
  
          //  Change the value 32 for different results
          if (i % 16 === 0)  {
              i = 0;
          }
      });
    }

    update(time, delta) {
      this.checkEnding();
  
      if (this.pointer.isDown) {
        if (this.mana > 0) {
          if (!this.castSpell.isPlaying) {
            this.castSpell.play();
          }
          this.paintLine();
          this.mana--;
          this.updateMana()
        } else {
          if (!this.emptyMana) {
            this.emptyMana = this.sound.add("emptymana");
            this.emptyMana.play();
          }
          
          this.tweens.add({
            targets: [this.manaText],
            duration: 200,
            alpha: { from: 0.4, to: 1},
            repeat: 10
          });
        }
      }

      if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        if (this.mana > 50) {
          this.addFireball();
          this.mana = 10;
        } else {
          if (!this.emptyMana) {
            this.emptyMana = this.sound.add("emptymana");
            this.emptyMana.play();
          }
        }
      }

      this.fireballs.children.entries.forEach( fireball => {
        fireball.update();
      })
    }

    paintLine() {
      const rectangle0 = this.add.pointlight(this.pointer.x-1, this.pointer.y, 0xffa700, 8, 0.5);

      const rectangle1 = this.add.pointlight(this.pointer.x, this.pointer.y,  0xffa700, 8, 0.5);
      if (Phaser.Math.Between(1,2)>1) {
        new Light(this, this.pointer.x, this.pointer.y, 0xffa700, 8, 0.7, true)
      }

      const rectangle2 = this.add.pointlight(this.pointer.x+1, this.pointer.y,  0xffa700, 8, 0.5);

      this.physics.add.existing(rectangle0);
      this.physics.add.existing(rectangle1);
      this.physics.add.existing(rectangle2);
      rectangle0.body.setCircle(6);
      rectangle1.body.setCircle(6);
      rectangle2.body.setCircle(6);
      rectangle0.body.setAllowGravity(false);
      rectangle0.body.immovable = true;
      rectangle1.body.setAllowGravity(false);
      rectangle1.body.immovable = true;
      rectangle2.body.setAllowGravity(false);
      rectangle2.body.immovable = true;
      this.time.delayedCall(1000 - (this.number * 110) , () => { 
        rectangle0.destroy();rectangle1.destroy(), rectangle2.destroy() 
      }, null, this);
      this.lines.add(rectangle0);
      this.lines.add(rectangle1);
      this.lines.add(rectangle2);
    }
    
    gotcha (fireball, wizard) {
      this.playAudio("wizard")
      new Explosion(this, wizard.x, wizard.y)
      fireball.shadow.destroy();
      fireball.destroy();
      wizard.death();
      this.mana = 100;
      this.updateMana();
     // this.textYAY = this.add.bitmapText(this.center_width, this.center_height + 200, "celtic", this.wizards.children.entries.length - 1 + " foes left.", 60).setTint(0x03a062).setOrigin(0.5)
      //this.textYAY.setDropShadow(4, 6, 0x000000, 0.7);
      this.tweens.add({
        targets: this.player,
        duration: 100,
        scale: {from: 1.2, to: 1},
        repeat: 4,
        ease: 'Bounce',
        onComplete: () => {
          this.registry.set("score", ""+this.score)
        //  this.textYAY.destroy();
          if (this.wizards.children.entries.length === 0) {
            this.finishScene()
          } else {
            this.addFireball();
          }
        }
      })
    }

    checkEnding() {
      if (this.wizards.children.entries.length === 0 && !this.finished) {
        this.finishScene();
        return;
      } 
    }

    finishScene () {
        this.game.sound.stopAll();
        this.finished = true;
        const totalTime = (Date.now() - +this.registry.get("startTime"))/1000;
        this.registry.set("totalTime", +this.registry.get("totalTime") + totalTime)
        this.playAudio("stageclear")
        this.player.body.enable = false;
        const minutes= parseInt(totalTime/60)
        const time = String(minutes).padStart(2, '0') + "m " + String(parseInt(totalTime) % 60).padStart(2, '0') + "s";
        this.text3 = this.add.bitmapText(this.center_width, this.center_height + 55, "celtic", "TOTAL: " + time, 45).setTint(0x03a062).setOrigin(0.5)
        this.text4 = this.add.bitmapText(this.center_width, this.center_height - 55, "celtic", "DUNGEON CLEARED!", 35).setTint(0x03a062).setOrigin(0.5)
        this.text3.setDropShadow(4, 6, 0x000000, 0.7);
        this.text4.setDropShadow(4, 6, 0x000000, 0.7);
        this.tweens.add({
          targets: this.text4,
          x: {from: this.text4.x, to: this.text4.x + Phaser.Math.Between(-10, 10) },
          duration: 200,
          repeat: -1
        })

      if (this.number < 3) {
        this.time.delayedCall(3000, () => {
          this.text3.destroy()
          this.text4.destroy()
          this.number++;
          this.scene.start("game", {number: this.number});
        });

      } else {
        this.time.delayedCall(5000, () => {
          this.text3.destroy()
          this.text4.destroy()
          this.scene.start("gameover");
        });
      }

     }

    updateScore (points = 1) {
        this.score += points;
        this.scoreText.setText(this.score);
    }

    updateMana () {
      this.manaBar.width = this.mana * 2;
    }

    death(player, fireball) {
      if (this.finished) return;
      fireball.shadow.destroy();
      fireball.destroy()
      player.destroy();
      this.playAudio("player")
      new Explosion(this, player.x, player.y, 0xff0000)
      this.cameras.main.shake(100);
      this.textBOO = this.add.bitmapText(this.center_width, this.center_height, "celtic", "DEAD!", 80).setTint(0xB98B82).setOrigin(0.5)
      this.textBOO.setDropShadow(4, 6, 0x000000, 0.7);

      this.time.delayedCall(1000, () => {
        this.restartScene();
      });
    }

    restartScene() {
      this.finished = true;
      this.textBOO.destroy();
      this.theme.stop();
      this.registry.set("startTime", Date.now())
      this.scene.start("game", {number: this.number});
    }
}


class Fireball extends Phaser.GameObjects.PointLight {
  constructor (scene, x, y, color = 0x00cc00, radius = 15, intensity = 0.7) {
      super(scene, x, y, color, radius, intensity)
      this.name = "fireball";
      this.spawnShadow(x, y)
      scene.add.existing(this)
      scene.physics.add.existing(this);
    
      this.body.setCircle(10);
      this.body.setBounce(1)
      this.body.setAllowGravity(false);
      this.body.setVelocityY(200);
      this.init();
  }

  spawnShadow (x, y) {
    this.shadow = this.scene.add.circle(x + 5, y + 5, 5, 0x000000).setAlpha(0.4)
    this.scene.add.existing(this.shadow);
   }

    init () {
       this.scene.tweens.add({
            targets: this,
            duration: 200,
            intensity: {from: 0.3, to: 0.7},
            repeat: -1
        });
    }

  update() {
    this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0x00cc00, 10));
    this.shadow.x = this.x + 5;
    this.shadow.y = this.y + 5;
  }
}

class Exit extends Phaser.GameObjects.Rectangle {
  constructor (scene, x, y, width = 30, height = 10) {
      super(scene, x, y, width, height)
      this.name = "exit";
      scene.add.existing(this)
      scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
  }
}

