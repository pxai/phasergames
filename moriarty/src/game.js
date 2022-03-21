import Turn from "./turn";
import Player from "./player";
import Lightning from "./lightning";
import SteamTube from "./steam_tube";
import FireTube from "./fire_tube";
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
      this.cameras.main.setBackgroundColor(0x210707);
      this.createMap();
      this.addPlayer();
     // this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.loadAudios(); 
       this.playMusic();
      this.addLightning();
    }

    addLightning() {
      this.lightningEffect = this.add.rectangle(0, 40, this.tileMap.widthInPixels, this.tileMap.heightInPixels, 0xffffff).setOrigin(0)
      this.lightningEffect.setAlpha(0);
      this.lightning = new Lightning(this)
    }

    addPlayer() {
      const { x, y } = this.objectsLayer.objects.find( object => object.name === "player")
      console.log("Setting playe!", x ,y )
      this.player = new Player(this, x, y);
  
      // Smoothly follow the player
      this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5, 0, -300);

      this.matterCollision.addOnCollideStart({
        objectA: this.player.sprite,
        callback: ({ gameObjectA, gameObjectB }) => {
          if (gameObjectB?.layer && gameObjectB?.layer["name"] === "deadly" && !this.player.dead) {
            this.hitDeadlyLayer(gameObjectB)
          } 
        }
      });
    }

    createMap() {

      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("bricks");
      this.dangerousLayer = this.add.layer();
      this.platform = this.tileMap.createLayer('scene0', this.tileSet);
      this.deadly = this.tileMap.createLayer('deadly', this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);
      //this.deadly.setCollisionByProperty({ collides: true });
      this.deadly.setCollisionByExclusion([-1]);
      // this.platform.setCollisionByProperty({ collides: true });
      this.matter.world.convertTilemapLayer(this.platform);
      this.matter.world.convertTilemapLayer(this.deadly);
      

      this.matter.world.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
      this.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
  

      
      this.exitGroup = this.add.group();
      this.killingBlock = this.add.group();

      this.objectsLayer.objects.forEach( object => {
        if (object.name === "steam") {
          this.dangerousLayer.add(new SteamTube(this, object.x, object.y, object.type));
        }

        if (object.name === "exit") {
          new Turn(this, object.x, object.y, object.width, object.height, object.type)
        }
      });
    }

    hitDeadlyLayer(tile) {
      console.log("Death")
      if (!this.player.dead) {
        this.lightning.lightning();
        this.player.death();
      }
    }

      loadAudios () {
        this.audios = {
          "stage": this.sound.add("stage"),
          "player": this.sound.add("player"),
          "steam": this.sound.add("steam"),
          "thunder0": this.sound.add("thunder0"),
          "thunder1": this.sound.add("thunder1"),
          "thunder2": this.sound.add("thunder2"),
          "thunder3": this.sound.add("thunder3"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playRandom(key) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0
        });
      }

      playMusic (theme="music") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.6,
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
      this.theme.stop();
      this.playAudio("stage");
      this.time.delayedCall(500, () => {
        this.scene.start("outro");
      }, null, this)
    }

    showStatus (direction, x, y) {
      const text = direction === "up" ? "YOU'RE DEAD!\nNOW CLIMB UP!!!" : "YOU'RE ALIVE!\nNOW GO DOWN!!!"
      //const {x, y} = this.midPoint;
      this.statusText = this.add.bitmapText(x, y, "moriartyFont", text, 60).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);
      this.tweens.add({
        targets: this.statusText,
        duration: 300,
        alpha: {from: 0, to: 1},
        repeat: 10,
        yoyo: true,
        onComplete: () => {
          this.statusText.destroy()
        }
    });
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    get midPoint () {
      return{ x: this.cameras.main.worldView.x + this.cameras.main.width / 2,
              y: this.cameras.main.worldView.y + this.cameras.main.height / 2
      };
  }
}
