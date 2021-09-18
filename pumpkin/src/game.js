import Player from "./player";

class Game extends Phaser.Scene {
  constructor (key) {
    super({ key: "game" })
  }

  init (data) {
    this.index = data.index;
    this.scenes = data.scenes;
  }

  create () {
    this.hearts = [];
    console.log("game started")
    this.score = 0
    this.width = this.sys.game.config.width
    this.height = this.sys.game.config.height
    this.center_width = this.width / 2
    this.center_height = this.height / 2

    this.titleText = this.add.bitmapText(this.center_width, 40, "wizardFont", this.scenes[this.index].name, 20).setTint(0x902406).setOrigin(0.5)
    this.tileMap = this.make.tilemap({ key: this.scenes[this.index].map , tileWidth: 16, tileHeight: 16 });
    this.tileSet = this.tileMap.addTilesetImage(this.scenes[this.index].tileset);

    this.tileMap.createLayer('background', this.tileSet);
    this.platform = this.tileMap.createLayer('platform', this.tileSet);
    this.objects = this.tileMap.createLayer('objects', this.tileSet);

    this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platform.setCollisionByExclusion([-1]);
    this.player = new Player(this, 150, this.height-400, 'player').setScale(0.5);
    // this.physics.world.enable([ this.player ]);
    this.physics.add.collider(this.player, this.platform);
    this.objects = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
    this.tileMap.getObjectLayer('objects').objects.forEach((object) => {
      const objectRectangle = this.objects.create(object.x, object.y, 'player').setScale(0.3).setOrigin(0.5);
      objectRectangle.name = object.name;
      objectRectangle.body.setSize(object.width, object.height);
      console.log("Yeah:", object);
  });

    this.physics.add.collider(this.player, this.objects, this.objectHit, null, this)
    this.updateHearts();
  }
  
  objectHit (player, object) {
    console.log("Hit with object: ", object);
    if (object.name === "door") {
      this.loadNext();
    }
  } 
  update(){
    this.player.update();
  }

  loadNext(sceneName) {
    console.log("Loading next! ");
    this.scene.start("transition", {index: this.index, scenes: this.scenes });
  }

  updateHearts() {
    this.hearts.forEach(heart => {
      heart.destroy();
      heart = null;
    });

    Array(+this.registry.get("lives")).fill(0).forEach( (heart, i) => {
      this.hearts.push(this.add.image(20 + (30 * i), 20, "heart1").setOrigin(0.5));
    })
  }
}

export default Game
