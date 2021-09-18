import Player from "./player";

class Game extends Phaser.Scene {
  constructor (key) {
    super({ key: "game" })
  }

  preload () {
  }

  create () {
    console.log("game started")
    this.score = 0
    this.width = this.sys.game.config.width
    this.height = this.sys.game.config.height
    this.center_width = this.width / 2
    this.center_height = this.height / 2


    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.tileMap = this.make.tilemap({ key: 'scene1' , tileWidth: 16, tileHeight: 16 });
    this.tileSet = this.tileMap.addTilesetImage('tileset');
    //this.tileMapLayer = this.tileMap.createLayer('sceneLayer', this.tileSet)
    this.tileMap.createLayer('background', this.tileSet);
    this.platform = this.tileMap.createLayer('platform', this.tileSet);
    this.objects = this.tileMap.createLayer('objects', this.tileSet);
   // this.platform.setCollisionByExclusion(-1, true);
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
      objectRectangle.name = "Topotamadre " + object.name;
      objectRectangle.body.setSize(object.width, object.height);
      console.log("Yeah:", object);
  });

    this.physics.add.collider(this.player, this.objects, this.objectHit, null, this)
  }
  
  objectHit (player, object) {
    console.log("Hit with object: ", object);
  } 
  update(){
    this.player.update();
  }
}

export default Game
