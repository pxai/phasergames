import PlayerUnderwater from "./player_underwater";
import Fish from "./objects/fish";
import FoeGenerator from "./objects/foe_generator";
import Coin from "./objects/coin";


export default class Underwater extends Phaser.Scene {
    constructor () {
        super({ key: "underwater" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
      this.time = data.time;
  }

    preload () {
      console.log("Underwater")
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


      this.tileMap = this.make.tilemap({ key: "underwater" , tileWidth: 32, tileHeight: 32 });
      this.tileSetBackground = this.tileMap.addTilesetImage("background");
      this.tileMap.createLayer('background', this.tileSetBackground)
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.player = new PlayerUnderwater(this, this.center_width, 200 )
      this.tileSet = this.tileMap.addTilesetImage("block");
      this.platform = this.tileMap.createLayer('underwater', this.tileSet);
      this.platform.setCollisionByExclusion([-1]);

      this.physics.world.enable([ this.player ]);
      this.colliderActivated = true;
      this.physics.add.collider(this.player, this.platform, this.player.hitPlatform, ()=>{
        return this.colliderActivated;
      }, this);

      this.scoreText = this.add.bitmapText(100, 16, "pixelFont", "0", 20).setOrigin(0.5)
      this.deathText = this.add.bitmapText(this.center_width, this.center_height, "pixelFont", "YOU WERE HIT!!", 40).setOrigin(0.5).setAlpha(0)
      
      this.cameras.main.setBackgroundColor(0x000000);
      this.cameras.main.startFollow(this.player);
       
        // this.loadAudios();

       // this.playMusic();

        // this.fishGenerator = new FishGenerator(this);
        this.foeGenerator = new FoeGenerator(this);
     //   this.overlap = this.physics.add.overlap(this.player.beamGroup, this.fishGenerator.fishGroup, this.trackFish);

      /* this.overlapFishWater = this.physics.add.overlap(this.water.surface, this.fishGenerator.fishGroup, this.surfaceTouch);
       this.overlapPlayer = this.physics.add.overlap(this.player, this.fishGenerator.fishGroup, this.catchFish);
       this.overlapPlayerFoe = this.physics.add.overlap(this.player, this.foeGenerator.foeGroup, this.player.hit);
       this.overlapFoeBeam = this.physics.add.overlap(this.player.beamGroup, this.foeGenerator.foeGroup, this.player.destroyBeam);
*/    
        this.addObjects()
      }

      addObjects () {
        this.fishGroup = this.add.group()
        this.coinsGroup = this.add.group()
        this.objectsLayer.objects.forEach( object => {
          if (object.name === "f") {
            this.fishGroup.add(new Fish(this, object.x, object.y))
          }
          
          if (object.name === "c") {
            this.coinsGroup.add(new Coin(this, object.x, object.y, object.name))
          }
        });

        this.physics.add.collider(this.fishGroup, this.platform, this.turnFish, ()=>{
          return this.colliderActivated;
        }, this);

        this.overlap = this.physics.add.overlap(this.player.beamGroup, this.fishGroup, this.trackFish);
        this.overlapPlayer = this.physics.add.overlap(this.player, this.fishGroup, this.catchFish);
      
        this.physics.add.collider(this.coinsGroup, this.platform, this.coinHitPlatform, ()=>{
          return this.colliderActivated;
        }, this);
        this.overlapBeamCoins = this.physics.add.overlap(this.player.beamGroup, this.coinsGroup, this.trackCoin);
        this.overlapPlayerCoin = this.physics.add.overlap(this.player, this.coinsGroup, this.catchCoin);
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

      catchFish(player, fish) {
        player.scene.updateScore(1);
        fish.destroy()
      }

      catchCoin(player, coin) {
        player.scene.updateScore(1);
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

    update() {
        this.player.update();
        this.fishGroup.children.entries.forEach( fish => {
          if (fish.x < - 32 || fish.x > this.width + 32) {
              fish.destroy();
              this.fishGroup.remove(fish);
          }
          fish.updateWater();
        })

        this.coinsGroup.children.entries.forEach( coin => {
          coin.update();
        })
        this.foeGenerator.update();
    }

    finishScene () {
      // this.theme.stop();
      this.scene.start("transition", {next: "depth", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateContainers (amount) {
        this.registry.set("containers", amount);
    }

    updateHull (amount = 1) {
      this.registry.set("hull", amount);
    }
}
