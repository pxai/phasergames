import Player from "./player";
import Lightning from "./lightning"
import { Debris, Rock } from "./particle";
import { Explosion } from "./steam";


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
      this.cameras.main.setBackgroundColor(0x000000);
      //this.cameras.main.setBounds(0, 0, 20920 * 2, 2000 * 2);
      //this.physics.world.setBounds(0, 0, 20920 * 2, 2080 * 2);
      this.createMap();
      this.addPlayer();
      this.addLight();
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.loadAudios(); 
     //  this.playMusic();
      this.addLightning();

    }

    addLight() {
      this.lights.enable();
      this.lights.setAmbientColor(0x707070);
      this.playerLight = this.lights.addLight(0, 100, 100).setColor(0xffffff).setIntensity(3.0);
    }

    addLightning() {
      this.lightningEffect = this.add.rectangle(0, 40, this.map.widthInPixels, this.map.heightInPixels, 0xffffff).setOrigin(0)
      this.lightningEffect.setAlpha(0);
      this.lightning = new Lightning(this)
    }

    addPlayer() {
      const { x, y } = {x: 100, y: 100}
      this.player = new Player(this, x, y);

      this.physics.add.collider(this.player, this.layer0, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.layer1, this.hitFloor, ()=>{
        return true;
      }, this);
      this.tnts = this.add.group();

      this.physics.add.collider(this.tnts, this.layer0, this.tntHitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.tnts, this.layer1, this.tntHitFloor, ()=>{
        return true;
      }, this);

      this.explosions = this.add.group();
      this.chainReaction = this.add.group();
      this.lamps = this.add.group();
      this.rocks = this.add.group();

      this.physics.add.collider(this.rocks, this.layer0, this.hitRock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.rocks, this.layer1, this.hitRock, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.lamps, this.activateLamp, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.explosions, this.hitExplosion, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.chainReaction, this.hitExplosion, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.layer1, this.explosions, this.kaboom, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.tnts, this.explosions, this.tntKaboom, ()=>{
        return true;
      }, this)

      this.physics.add.overlap(this.layer1, this.chainReaction, this.kaboom, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.tnts, this.chainReaction, this.tntKaboom, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.explosions, this.explosions, this.chainKaboom, ()=>{
        return true;
      }, this);
    }

    activateLamp(player, lamp) {

    }

    hitExplosion(player, explosion) {
      console.log("Hit by explosion!", player.flashing)
      if (!player.flashing) {
        this.player.hit();
      }
    }

    kaboom(explosion, tile) {
      if (tile.layer["name"] === "layer1") {
        if (Phaser.Math.Between(0, 5) > 4)
          this.rocks.add(new Rock(this, tile.pixelX + (Phaser.Math.Between(-100, 100)), tile.pixelY - 100))
        Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
        this.layer1.removeTileAt(tile.x, tile.y);
      }
    }

    tntKaboom(tnt, explosion) {
      console.log("TNT kaboom", tnt, explosion)
      if (!tnt.chain) {
        tnt.chain = true;
        tnt.kaboom();
      }
    }

    chainKaboom(explosion1, explosion2) {
      if (!explosion1.chain && !explosion2.chain) {
        explosion1.chain = true;
        console.log("Adding chain reaction!!!")
        const width = explosion1.width + explosion2.width;
        const height = explosion1.height + explosion2.height;
        this.chainReaction.add(new Explosion(this, explosion1.x, explosion1.y, width, height))
      }
    }

    isBreakable (tile) {
      return tile?.properties['element'] === "break"
    }

    tntHitFloor(tnt, platform) {
    }

    hitRock(rock, layer) {

    } 

    hitFloor(player, platform) {
      if (this.player.jumping && !this.player.falling && this.player.body.velocity.y === 0) {
        const tile = this.getTile(platform)
        if (this.isBreakable(tile)) {
          this.playAudioRandomly("stone");
          Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
          this.platform.removeTileAt(tile.x, tile.y);
        } else if (platform?.name === "brick0") {
          this.playAudioRandomly("stone");
          Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, platform.x, platform.y))
          platform.destroy();
        }
      }
    }

    createMap() {
      // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tilemap/#map
      this.map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 300, height: 300});
      this.brickTiles = this.map.addTilesetImage('cave');

      this.background = this.map.createBlankLayer('background', this.brickTiles).setPipeline('Light2D');
      this.layer0 = this.map.createBlankLayer('layer0', this.brickTiles).setPipeline('Light2D');
      // this.layer1.randomize(0, 0, this.map.width, this.map.height, [ -1, 0, 12 ]);
      this.finished = false;
      this.rooms = 0;
      const positions = [{x: 0, y: 0}];
      let width, height;
      do {
        let {x, y} = positions[positions.length - 1];
        width = Phaser.Math.Between(10, 20)
        height = Phaser.Math.Between(8, 10);
        positions[positions.length - 1] = {...positions[positions.length - 1], width, height}
        let position = this.createSquare(0, x, y, width , height, 1, (this.rooms === 0));
        this.createBackground(x, y, width , height)
        positions.push(position);
        this.rooms++;
      } while(this.rooms < 10)
      positions.pop();
      console.log(positions)

      this.layer1 = this.map.createBlankLayer('layer1', this.brickTiles).setPipeline('Light2D');
      positions.forEach(position => {
        //console.log("Lets see: ", position)
        let {x, y, width, height} = position;
        this.createSquare(1, x + 1, y + 1, width - 2, height -2, 2)
      });
      this.layer0.setCollisionByExclusion([-1]);
      this.layer1.setCollisionByExclusion([-1]);
    }

    createBackground(x, y, width, height) {
      this.map.setLayer(0)
      Array(height).fill(0).forEach((_,i) => {
        Array(width).fill(0).forEach((_,j) => {
          const tile = Phaser.Math.RND.pick([4, 5, 6, 7])
          this.map.putTileAt(tile, x + j, y + i )
        })
      });
    }

    createSquare (tile, x, y, width, height, layer, first = false) {
      
      this.map.setLayer(layer)
      const setTile = (tile, x, y) => {
        tile = Phaser.Math.RND.pick([0, 1, 2, 3])
        const t = this.map.putTileAt(tile, x, y);
      }
      Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y));
      Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y + height - 1));

      if (!layer === 1 && first) {
        Array(height).fill(0).forEach((_,i) => setTile(tile, x, y + i));
      } else if (layer === 2) {
        Array(height).fill(0).forEach((_,i) => setTile(tile, x - 1, y + i));
        Array(height).fill(0).forEach((_,i) => setTile(tile, x, y + i));
        Array(height).fill(0).forEach((_,i) => setTile(tile, x + width - 1, y + i));
        Array(height).fill(0).forEach((_,i) => setTile(tile, x + width, y + i));
      }


      const growinDirections = this.calculateGrowinOptions(x, y, width, height);
      const grow = Phaser.Math.RND.pick(growinDirections);
      return {
        "right": {x: x + width, y},
        "left": {x: x - width, y},
        "up": {x, y},
        "down": {x: x, y: y + height },
      }[grow.orientation];
    }

    calculateGrowinOptions(x, y, width, height) {
      const result = [];
      result.push({ orientation: "right", width: 7, height: 7 } );
      return result;
    }

    getTile(platform) {
      const {x, y} = platform;
      return this.layer1.getTileAt(x, y);
    }

    hitDeadlyLayer(tile) {
      if (!this.player.dead) {
        this.player.sprite.anims.play("moriarty", true);
        this.cameras.main.shake(100)
        this.lightning.lightning();
        this.player.death();
      }
    }

      loadAudios () {
        this.audios = {
         // "stage": this.sound.add("stage"),
        };
      }

      playAudio(key) {
        return;
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
          volume: 0.4,
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

      this.time.delayedCall(500, () => {
        this.scene.start("outro");
      }, null, this)
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
