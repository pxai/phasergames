import Player from "./player";
import Coin from "./coin";
import texts  from "./texts";

class Game extends Phaser.Scene {
  constructor () {
    super({ key: 'game' })
  }

  create () {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    /*this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 32, tileHeight: 32 });
    this.tileSet = this.tileMap.addTilesetImage("grass_tileset");
    this.platform = this.tileMap.createLayer('scene0', this.tileSet);
    this.objectsLayer = this.tileMap.getObjectLayer('objects');
    this.jumpsLayer = this.tileMap.getObjectLayer('jumppoints');*/

    this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 32, tileHeight: 32 });
    this.tileSetBg = this.tileMap.addTilesetImage("background");
    this.tileMap.createStaticLayer('background', this.tileSetBg)

    this.tileSet = this.tileMap.addTilesetImage("brick");
    this.platform = this.tileMap.createLayer('scene0', this.tileSet);

    this.objectsLayer = this.tileMap.getObjectLayer('objects');

    const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")

   this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platform.setCollisionByExclusion([-1]);

    this.cameras.main.setBounds(0, 0, 10920 * 2, 10080 * 2);
    this.physics.world.setBounds(0, 0, 10920 * 2, 10080 * 2);
    this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

    this.physics.world.enable([ this.player ]);
    this.colliderActivated = true;

    this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 50);

    this.loadAudios();
    this.addObjects();
  }

  update () {
    this.player.update()
  }

  loadAudios () {
    this.audios = {
      "jump": this.sound.add("jump"),
      "coin": this.sound.add("coin"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  addObjects () {
    this.coinsGroup = this.add.group()
    this.objectsLayer.objects.forEach( object => {
      if (object.name === "coin")
        this.coinsGroup.add(new Coin(this, object.x, object.y, object.name))
      if (object.name.startsWith("text")) {
        this.add.bitmapText(object.x, object.y, "mario", texts[object.name].title, texts[object.name].size);
      }
    })
    this.overlap = this.physics.add.overlap(this.player, this.coinsGroup, this.pick);
  }

  pick (player, coin) {
    player.scene.playAudio("coin")
    coin.destroy();
  }

}

export default Game;
