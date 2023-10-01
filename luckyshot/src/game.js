import Ball from './ball';
import Exit from './exit';

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
      this.addPointer();
      this.addBall();
      this.addMap();
      this.addExit();
      this.addCollisions()
      //this.loadAudios(); 
      // this.playMusic();
    }

    addPointer() {
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
    }

    addBall() {
    //  const { x, y } = this.map.findObject("Spawn", obj => obj.name === "Spawn Point");
      this.ball = new Ball(this, 200, 600);
    }

    addExit() {
      this.exit = new Exit(this, 200, 200);
    }

    
    addMap() {    
      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("map");
      this.tileMap.createLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("map");
      this.dangerousLayer = this.add.layer();
      this.groundLayer = this.tileMap.createLayer('scene0', this.tileSet);
      this.damageLayer = this.tileMap.createLayer('damage', this.tileSet);

      //this.groundLayer.setCollisionByExclusion([-1]);
      //this.deadly.setCollisionByProperty({ collides: true });
      //this.damageLayer.setCollisionByExclusion([-1]);
      // this.platform.setCollisionByProperty({ collides: true });
      //this.matter.world.convertTilemapLayer(this.groundLayer);
      //this.matter.world.convertTilemapLayer(this.ddamageLayereadly);

      //this.tileMap.getObjectLayer("objects").objects.forEach(crateObject => {
       // const { x, y, width, height } = crateObject;
  
        // Tiled origin for its coordinate system is (0, 1), but we want coordinates relative to an
        // origin of (0.5, 0.5)
       // new Block(this, x + width / 2, y - height / 2)
        //new Platform(this, x + Phaser.Math.Between(-128, 128), y)
        // this.matter.add.image(x + width / 2, y - height / 2, "block").setBody({ shape: "rectangle", density: 0.001 });
      //});
  }

    addCollisions () {
      this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
        objectA: this.ball.fireball,
        callback: this.onPlayerCollide,
        context: this
      });
  
      this.matter.world.on('collisionstart', (event) => {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
        });
      });
    }
  
    onPlayerCollide({ gameObjectA, gameObjectB }) {
      console.log("Ball collide: ", gameObjectA, gameObjectB)
      if (!gameObjectB) return;
      if (gameObjectB.label === "exit") { this.playerHitsExit(gameObjectB); return;} 
      if (gameObjectB.label === "keys") this.playerHitsExit(gameObjectB);
      if (gameObjectB.label === "bat") this.playerHitsExit(gameObjectB);
      if (gameObjectB.name === "block") this.playerHitsExit(gameObjectB);
      //if (gameObjectB instanceof Platform) this.playerOnPlatform(gameObjectB);
      //if (!(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
  
      const tile = gameObjectB;
  
      // Check the tile property set in Tiled (you could also just check the index if you aren't using
      // Tiled in your game)
      if (tile.properties.isLethal) {
        // Unsubscribe from collision events so that this logic is run only once
        this.unsubscribePlayerCollide();
  
        //this.player.freeze();
        this.restartScene();
      }
    }

    playerHitsExit(exit) {
      console.log("YEAH")
      this.ball.dead = true;
      this.finishScene();
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

    restartScene() {
      this.ball.fireball.sprite.visible = false;
      this.cameras.main.shake(100);
      this.cameras.main.fade(250, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.restart());
    }

    finishScene () {

      this.cameras.main.fade(250, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("game");
      });
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
