import PlayerUnderwater from "./player_underwater";
import Fish from "./objects/fish";
import Coin from "./objects/coin";
import Submarine from "./objects/submarine";
import EndScreen from "./objects/endscreen";


export default class Underwater extends Phaser.Scene {
    constructor (key = "underwater", mapName = "underwater", playerType = PlayerUnderwater, next="depth") {
        super({ key });
        this.mapName = mapName;
        this.playerType = playerType;
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.next = next;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
      this.time = data.time;
  }

    preload () {
      this.registry.set("hull", 10);
    }

    create () {
      this.duration = this.time * 1000;
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.cameras.main.setBounds(0, 0, 10920 * 2, 10080 * 2);
      this.physics.world.setBounds(0, 0, 10920 * 2, 10080 * 2);
      this.finished = false;


      this.tileMap = this.make.tilemap({ key: this.mapName , tileWidth: 32, tileHeight: 32 });
      this.tileSetBackground = this.tileMap.addTilesetImage("background");
      this.tileMap.createLayer('background', this.tileSetBackground)
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new this.playerType(this, playerPosition.x, playerPosition.y )
      this.player.setCoins(this.registry.get("coins"))
      this.tileSet = this.tileMap.addTilesetImage("block");
      this.platform = this.tileMap.createLayer(this.mapName, this.tileSet);
      this.platform.setCollisionByExclusion([-1]);

      this.physics.world.enable([ this.player ]);
      this.colliderActivated = true;
      this.physics.add.collider(this.player, this.platform, this.player.hitPlatform, ()=>{
        return this.colliderActivated;
      }, this);

      this.add.image(60, 16, "redfish").setOrigin(0.5).setScale(0.5).setScrollFactor(0)
      this.scoreText = this.add.bitmapText(100, 16, "pixelFont", "0", 20).setOrigin(0.5).setScrollFactor(0)
      this.add.image(this.center_width, 16, "coin").setOrigin(0.5).setScrollFactor(0)
      this.coinsText = this.add.bitmapText(this.center_width + 40, 16, "pixelFont", "0", 20).setOrigin(0.5).setScrollFactor(0)
      this.add.image(this.width - 150, 16, "heart").setOrigin(0.5).setScrollFactor(0)
      this.hullText = this.add.bitmapText(this.width - 110, 16, "pixelFont", this.player.hull, 20).setOrigin(0.5).setScrollFactor(0)

      this.deathText = this.add.bitmapText(this.center_width, this.center_height, "pixelFont", "YOU WERE HIT!!", 40).setOrigin(0.5).setAlpha(0)
      
      this.cameras.main.setBackgroundColor(0x000000);
      this.cameras.main.startFollow(this.player);
       
        // this.loadAudios();

        this.playMusic();

        this.addObjects()
      }

      addObjects () {
        this.fishGroup = this.add.group()
        this.coinsGroup = this.add.group()
        this.submarinesGroup = this.add.group();
        this.torpedoesGroup = this.add.group();
        this.shootingGroup = this.add.group();

        this.objectsLayer.objects.forEach( object => {
          if (object.name === "f") {
            this.fishGroup.add(new Fish(this, object.x, object.y).setAlpha(1))
          }
          
          if (object.name === "c") {
            this.coinsGroup.add(new Coin(this, object.x, object.y, object.name))
          }

          if (object.name === "s") {
            this.submarinesGroup.add(new Submarine(this, object.x, object.y, 0.7))
          }

          if (object.name === "end") {
            this.theEnd = new EndScreen(this, object.x, object.y).setAlpha(1)
          }
        });

        this.physics.add.collider(this.fishGroup, this.platform, this.turnFish, ()=>{
          return this.colliderActivated;
        }, this);

        this.physics.add.collider(this.submarinesGroup, this.platform, this.turnSubmarine, ()=>{
          return this.colliderActivated;
        }, this);

        this.overlap = this.physics.add.overlap(this.player.beamGroup, this.fishGroup, this.trackFish);
        this.overlapPlayer = this.physics.add.overlap(this.player, this.fishGroup, this.catchFish);
      
        this.physics.add.collider(this.coinsGroup, this.platform, this.coinHitPlatform, ()=>{
          return this.colliderActivated;
        }, this);

        this.physics.add.collider(this.shootingGroup, this.platform, () => void(0), ()=>{
          return this.colliderActivated;
        }, this);

        this.physics.add.collider(this.torpedoesGroup, this.platform, this.torpedoDestroy, ()=>{
          return this.colliderActivated;
        }, this);

        this.physics.add.overlap(this.player.beamGroup, this.submarinesGroup, this.removeBean);
    
        this.overlapBeamCoins = this.physics.add.overlap(this.player.beamGroup, this.coinsGroup, this.trackCoin);
        this.overlapPlayerCoin = this.physics.add.overlap(this.player, this.coinsGroup, this.catchCoin);
        this.physics.add.overlap(this.player, this.theEnd , () => {this.finishScene()});
        this.overlapPlayerFoes = this.physics.add.overlap(this.player, this.submarinesGroup, this.killShips);
        this.overlapFoesCoins = this.physics.add.overlap(this.shootingGroup, this.submarinesGroup, this.killFoe);
      }

      removeBean(beam, submarine) {
         beam.destroy();
      }

      torpedoDestroy (torpedo, platform) {
        torpedo.explode();
      }

      killFoe (coin, submarine) {
        coin.destroy()
        submarine.death()
      }

      killShips (player, submarine) {
        player.hitPlatform(player)
        submarine.death()
      }

      coinHitPlatform () {

      }

      hitFloor() {

      }

      addSky() {
        this.sky = new Sky(this);
      }

      finishStage () {
          this.stageFinished = true;
      }

      trackFish (beam, fish) {

        fish.up(beam, fish);
      }

      trackCoin (beam, coin) {
        coin.up(beam, coin);
      }

      turnFish (fish) {
        fish.turn();
      }

      turnSubmarine (submarine, collision) {
        const direction = collision.faceRight ? 1 : -1;
        submarine.turn(direction)
      }

      catchFish(player, fish) {
        player.scene.updateScore(1);
        fish.destroy()
      }

      catchCoin(player, coin) {
        player.scene.updateCoinScore(1);
        player.addCoin();
        coin.destroy()
      }

      playerSurface (surface, player) {

      }

      death () {
        this.fishGenerator.stop()
        this.foeGenerator.stop()
        this.water.stop();
          new Bullet(this, this.width, this.player.y, "missile", 1000, 1)
          this.player.death()
      }

      surfaceTouch(surface, fish) {
        if (fish.body.velocity.y < 0) {
          fish.setAlpha(1)
        } else {
          fish.setAlpha(0.5)
        }
      }

      loadAudios () {
        this.audios = {
          "lock": this.sound.add("lock"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme) {
        if (this.theme) this.theme.stop();
        this.theme = this.sound.add(this.mapName);
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
        this.player.update();
        this.fishGroup.children.entries.forEach( fish => {
          fish.updateWater();
        })

        this.coinsGroup.children.entries.forEach( coin => {
          coin.update();
        })
        this.submarinesGroup.children.entries.forEach( submarine => {
          submarine.update();
        })
        this.torpedoesGroup.children.entries.forEach( torpedo => {
          torpedo.update();
        })
        this.shootingGroup.children.entries.forEach( coin => {
          coin.updateShot();
        })
    }

    finishScene () {
      this.theme.stop();
      this.scene.start("transition", {next: this.next, name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    restartScene () {
      this.theme.stop();
      this.scene.start("transition", {next: this.mapName, name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateCoinScore (points = 0) {
      const coins = +this.registry.get("coins") + points;
      this.registry.set("coins", coins);
      this.coinsText.setText(Number(coins).toLocaleString());
  }

    updateContainers (amount) {
        this.registry.set("containers", amount);
    }

    updateHull (amount) {
      const hull = +this.registry.get("hull") + amount;
      if (hull < 0) return;
      this.registry.set("hull", hull);
      this.hullText.setText(Number(hull).toLocaleString());
    }
}
