import Player from "./player";
import Coin from "./coin";
import texts  from "./texts";
import images from "./images";
import ActivatePoint from "./activate_point";

class Game extends Phaser.Scene {
  constructor () {
    super({ key: 'game' })
  }

  create () {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;


    this.tileMap = this.make.tilemap({ key: "indie" , tileWidth: 32, tileHeight: 32 });
    this.tileSetBg = this.tileMap.addTilesetImage("background");
    this.tileMap.createStaticLayer('background', this.tileSetBg)

    this.tileSet = this.tileMap.addTilesetImage("brick");
    this.platform = this.tileMap.createLayer('scene0', this.tileSet);

    this.objectsLayer = this.tileMap.getObjectLayer('objects');
    this.activators = this.tileMap.getObjectLayer('activate');

    const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")

   this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platform.setCollisionByExclusion([-1]);

    this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

    this.physics.world.enable([ this.player ]);
    this.colliderActivated = true;

    this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);

    this.physics.add.overlap(this.player, this.activators, this.activate, ()=>{
      return true;
    }, this);

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 300);
    this.texts = {};
    this.loadAudios();
    this.addObjects();
    this.addActivatePoints();
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
        this.addText(object);
       }

      if (object.name.startsWith("image")) {
        this.add.image(object.x, object.y, images[object.name].name).setScale(images[object.name].scale);
      }
    })
    this.overlap = this.physics.add.overlap(this.player, this.coinsGroup, this.pick);
  }

  addText (object) {
    this.texts[object.name] = this.add.group();
    this.texts[object.name].add(this.add.bitmapText(object.x, object.y, "mario", texts[object.name].title, texts[object.name].size).setAlpha(0))
    texts[object.name].items.forEach( (item, i) => {
      this.texts[object.name].add(this.add.bitmapText(object.x + 20, object.y + ((i+1) * 60), "mario", item.text, 30).setAlpha(0)); 
    })
  }
  
  addActivatePoints() {
    this.activateGroup = this.add.group();
    this.activators.objects.forEach( object => {
        this.activateGroup.add(new ActivatePoint(this, object.x, object.y, object.name))
    })
    this.activateOverlap = this.physics.add.overlap(this.player, this.activateGroup, this.activate.bind(this));
  }

  activate(player, activation) {
    console.log("Touched ", activation.name, this.texts[activation.name]);
    this.tweens.add({
      targets: this.texts[activation.name].children.entries,
      duration: 3000,
      alpha: { from: 0, to: 1},
  })
    activation.destroy();
  }

  pick (player, coin) {
    player.scene.playAudio("coin")
    coin.destroy();
  }

}

export default Game;
