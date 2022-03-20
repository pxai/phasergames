import Turn from "./turn";
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
      this.cameras.main.setBackgroundColor(0x210707);
      this.createMap();
      this.addPlayer();
     // this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      //this.loadAudios(); 
      // this.playMusic();
    }
    addPlayer() {
      const { x, y } = this.objectsLayer.objects.find( object => object.name === "player")
      console.log("Setting playe!", x ,y )
      this.player = new Player(this, x, y);
  
      // Smoothly follow the player
      this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

      console.log("See: ", this.matterCollision)
      this.matterCollision.addOnCollideStart({
        objectA: this.player.sprite,
        callback: ({ gameObjectA, gameObjectB }) => {
          console.log(gameObjectB)
          if (gameObjectB?.layer["name"] === "deadly") {
            this.hitDeadlyLayer(gameObjectB)
          } else {
            console.log("Domething else, ", gameObjectA, gameObjectB)
          }
        }
      });
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("bricks");
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
        if (object.name === "bat") {
          let bat = new Bat(this, object.x, object.y, object.type);
          this.batGroup.add(bat)
          this.foesGroup.add(bat)
        }


        if (object.name === "exit") {
          new Turn(this, object.x, object.y, object.width, object.height, object.type)
        }
      });
    }

    hitDeadlyLayer(tile) {
      console.log("Death")
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
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
