import Player from "./player";
import { RockSmoke, Debris, elements } from "./particle";


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
      

      
      this.createMap();

      this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);

      this.colliderActivated = true;
      this.addPlayer();

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);
  
      this.physics.add.collider(this.player, this.rockLayer, this.drill, ()=>{
        return true;
      }, this);
  

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.physics.world.enable([ this.player ]);
      this.setScore();
      //this.loadAudios(); 
      //this.playMusic();
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "dungeon0" , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("brick");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("brick");
      this.platform = this.tileMap.createLayer('dungeon0', this.tileSet);
      this.rockLayer = this.tileMap.createLayer('rock', this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);
      this.rockLayer.setCollisionByExclusion([-1]);

      this.rocks = {};
      console.log(this.rockLayer)
      for(let y = 0; y < this.rockLayer.height; ++y){   
        for(let x = 0; x < this.rockLayer.width; ++x){
          let rock = this.rockLayer.getTileAt(x, y);
          if (rock) {
            this.rocks[`${rock.x}:${rock.y}`] = elements[rock.properties.element].hits;
            console.log("Touching rock?", rock.x, rock.y, rock.properties.element)
          }
        }
        //
      };
      console.log(this.rocks)
      this.addExit();
    }

    setScore() {
      this.drillImage = this.add.image(this.center_width, 40, "lightning").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
      //this.shieldText 
      this.shieldImage = this.add.image(this.center_width + 128, 40, "shield").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
      this.lightningImage = this.add.image(this.center_width + 256, 40, "lightning").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
      this.scoreText = this.add.bitmapText(this.center_width - 256, 40, "wendy", String(this.registry.get("score")).padStart(6, '0'), 60).setOrigin(0.5).setScrollFactor(0)
    }

    hitFloor(player, platform) {

    }

    drill (player, rock) {
      //console.log("Touching rock?", rock.x, rock.y, rock.properties.element)
      if (player.drilling) {
        const {color, hits, points} = elements[rock.properties.element];
        this.rocks[`${rock.x}:${rock.y}`] -= this.player.attack;
        //console.log("Touching rock", rock.x, rock.y, color, hits, points)
        new RockSmoke(this, rock.pixelX, rock.pixelY + Phaser.Math.Between(-5, 5))
        if (this.rocks[`${rock.x}:${rock.y}`] < 1) {
          this.showPoints(rock, points, color);
          this.updateScore(points)
          new Debris(this, rock.pixelX, rock.pixelY, color)
          this.rockLayer.removeTileAt(rock.x, rock.y);
        }

        //rock.visible = false;
      }

    }

    showPoints (rock, score, color = 0xff0000) {
      console.log("ShowPoints: ", rock.x, rock.y, score, color)
      let text = this.add.bitmapText(rock.pixelX + 20, rock.pixelY - 80, "wendy", "+"+score, 40).setDropShadow(2, 3, color, 0.7).setOrigin(0.5);
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

      this.scoreText.setTint(color);
      const prev = this.scoreText.y;
      this.tweens.add({
        targets: this.scoreText,
        duration: 100,
        alpha: {from: 1, to: 0.8},
        scale: {from: 1.4, to: 1},
        repeat: 5,
        onComplete: () => {
            this.scoreText.setTint(0xffffff);
            this.scoreText.y = prev;
        }
    });
  }

    addPlayer() {
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);
    }

    addExit() {
      const exitPosition = this.objectsLayer.objects.find( object => object.name === "exit")
      this.exit = this.add.rectangle(exitPosition.x, exitPosition.y, 64, 64, 0xffffff).setOrigin(0.5).setAlpha(0);
      this.physics.add.existing(this.exit);
    }

      loadAudios () {
        this.audios = {
          "beam": this.sound.add("beam"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }


    update(time, delta) {
      this.player.update(time, delta);
    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(String(score).padStart(6, '0'));
    }
}
