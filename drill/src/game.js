import Player from "./player";

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
      

      this.tileMap = this.make.tilemap({ key: "dungeon0" , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("brick");
      this.platform = this.tileMap.createLayer('dungeon0', this.tileSet);
      this.rockLayer = this.tileMap.createDynamicLayer('rock', this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);
      this.rockLayer.setCollisionByExclusion([-1]);
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
  

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 300);
      this.physics.world.enable([ this.player ]);
      this.setScore();
      //this.loadAudios(); 
      // this.playMusic();
    }

    setScore() {
      this.scoreText = this.add.bitmapText(this.center_width, 40, "wendy", String(this.registry.get("score")).padStart(6, '0'), 60).setOrigin(0.5).setScrollFactor(0)
  }

    hitFloor(player, platform) {

    }

    drill (player, rock) {
      console.log("Touching rock?", rock.x, rock.y)
      if (player.drilling) {
        console.log("Touching rock", rock.x, rock.y, rock)
        this.rockLayer.removeTileAt(rock.x, rock.y);

        //rock.visible = false;
      }

    }

    addPlayer() {
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);
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
