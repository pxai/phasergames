import Player from "./player";
import Pot from "./pot";
import StarBurst from "./starburst";
const colors = { pot0: "0x55b700", pot1: "0xffbf00", pot2: "0xff0000", pot3: "0x01156D"};

class Game extends Phaser.Scene {
  constructor () {
    super({ key: 'game' })
  }

  preload () {

  }

  create () {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    
    this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 32, tileHeight: 32 });
    this.tileSet = this.tileMap.addTilesetImage("grass_tileset");
    this.platform = this.tileMap.createLayer('scene0', this.tileSet);
    this.objectsLayer = this.tileMap.getObjectLayer('objects');

    this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platform.setCollisionByExclusion([-1]);


    this.player = new Player(this, 200, 200);

    this.physics.world.enable([ this.player ]);
    this.physics.add.collider(this.player, this.platform);
    this.addObjects();
    this.addPots();
  }

  addObjects () {
    this.potGroup = this.add.group()
    this.objectsLayer.objects.forEach( object => {
      this.potGroup.add(new Pot(this, object.x, object.y, object.name, colors[object.name]))
    })
    this.overlap = this.physics.add.overlap(this.player, this.potGroup, this.pick);
  }

  addPots () {
    this.potScore = {};
    Array(4).fill(0).forEach((e, i) => {
      this.potScore[`pot${i}`] = {
        score: 0,
        x: 15 + (i * 100),
        y: 20,
        color: colors[i],
        image: this.add.image(15 + (i * 100), 20, `pot${i}`).setScale(0.8).setOrigin(0.5),
        text: this.add.bitmapText(50 + (i * 100), 45, "wizardFont", "0", 25).setOrigin(0.5)
      }
    })
  }

  addPot(pot) {
    this.potScore[pot.name].score++;
    this.potScore[pot.name].text.setText(this.potScore[pot.name].score);
    this.player.pots.push(pot);
  }

  removePot(pot) {
    this.potScore[pot.name].score--;
    this.potScore[pot.name].text.setText(this.potScore[pot.name].score);
  }

  pick (player, pot) {
    pot.body.enable = false;
  
    this.starBurst = new StarBurst(pot.scene, pot.x, pot.y);
    player.scene.tweens.add({
      targets: pot,
      alpha: 0.3,
      angle: 720,
      x: player.scene.potScore[pot.name].x,
      y: 20,
      scaleX: 0.5,
      scaleY: 0.5,
      ease: 'Linear',
      duration: 500,
      onComplete: function() {
          player.scene.addPot(pot);
          pot.disable();
      },
    });
    console.log("yeah");
}

  update () {
   this.player.update()
  }
}

export default Game;