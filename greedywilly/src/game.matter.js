import Player from "./player";
import Lightning from "./lightning";

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
      //this.addPlayer();

     // this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
     // this.loadAudios(); 
     //  this.playMusic();
      this.addLightning();

    }

    addLightning() {
      this.lightningEffect = this.add.rectangle(0, 40, this.map.widthInPixels, this.map.heightInPixels, 0xffffff).setOrigin(0)
      this.lightningEffect.setAlpha(0);
      this.lightning = new Lightning(this)
    }

    addPlayer() {
      const { x, y } = {x: 100, y: 100}
      this.player = new Player(this, x, y);

      // Smoothly follow the player
      this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5, 0, -300);


    }

    createMap() {
      // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tilemap/#map
      this.map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 300, height: 300});
      this.brickTiles = this.map.addTilesetImage('brick');
      this.layer1 = this.map.createBlankLayer('layer1', this.brickTiles);
      this.layer1.setCollision(20);
      // this.layer1.randomize(0, 0, this.map.width, this.map.height, [ -1, 0, 12 ]);
      this.finished = false;
      this.rooms = 0;
      const positions = [{x: 0, y: 0}];
      do {
        let {x, y} = positions[positions.length - 1];
        let position = this.createSquare(0, x, y, Phaser.Math.Between(5, 10), Phaser.Math.Between(5, 10));
        positions.push(position);
        this.rooms++;
      } while(this.rooms < 10)

      this.map.setCollisionBetween(0, 6); 
      this.map.setCollisionByProperty({ collides: true });
          // body will be accessible via tile.physics.matterBody.

      this.matter.world.convertTilemapLayer(this.layer1);

      this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.layer1.forEachTile(function (tile) {
        tile.label = "destroyable"
      });

      this.matter.world.on('collisionstart', function (event) {
        function getRootBody (body) {
          if (body.parent === body) return body; 
          while (body.parent !== body)
            body = body.parent;
          
          return body;
        }

        for (let i = 0; i < event.pairs.length; i++) {
            // The tile bodies in this example are a mixture of compound bodies and simple rectangle
            // bodies. The "label" property was set on the parent body, so we will first make sure
            // that we have the top level body instead of a part of a larger compound body.
            const bodyA = getRootBody(event.pairs[i].bodyA);
            const bodyB = getRootBody(event.pairs[i].bodyB);

            if ((bodyA.label === 'explosion' && bodyB.label === 'destroyable') ||
                (bodyB.label === 'explosion' && bodyA.label === 'destroyable'))
            {
                const ballBody = bodyA.label === 'explosion' ? bodyA : bodyB;
                const ball = ballBody.gameObject;

                const tileBody = bodyA.label === 'destroyable' ? bodyA : bodyB;
                const tile = tileBody.gameObject;

                // A body may collide with multiple other bodies in a step, so we'll use a flag to
                // only tween & destroy the ball once.
                if (tile.isBeingDestroyed) continue;
                
                tile.isBeingDestroyed = true;

                this.matter.world.remove(tileBody);
            }
        }
    }, this);

    }

    createSquare (tile, x, y, width, height) {
      Array(width).fill(0).forEach((_,i) => this.map.putTileAt(tile, x + i, y));
      Array(width).fill(0).forEach((_,i) => this.map.putTileAt(tile, x + i, y + height - 1));

      Array(height).fill(0).forEach((_,i) => this.map.putTileAt(tile, x, y + i));
      Array(height).fill(0).forEach((_,i) => this.map.putTileAt(tile, x + width - 1, y + i));

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

    createMap2() {

      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("bricks");
      this.dangerousLayer = this.add.layer();
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
        if (object.name === "steam") {
          this.dangerousLayer.add(new SteamTube(this, object.x, object.y, object.type));
        }

        if (object.name === "exit") {
          new Turn(this, object.x, object.y, object.width, object.height, object.type)
        }
      });
    }

    hitDeadlyLayer(tile) {
      if (!this.player.dead) {
        this.player.sprite.anims.play("moriarty", true);
        this.cameras.main.shake(100);
        this.lightning.lightning();
        this.player.death();
      }
    }

      loadAudios () {
        this.audios = {
          "stage": this.sound.add("stage"),
        };
      }

      playAudio(key) {
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
