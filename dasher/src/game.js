import Player from "./player";
import Coin from "./coin";
import texts  from "./texts";
import images from "./images";
import Foe from "./foe";
import PowerUp from "./powerup";
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


    this.tileMap = this.make.tilemap({ key: "dasher" , tileWidth: 32, tileHeight: 32 });
    this.tileSetBg = this.tileMap.addTilesetImage("background");
    this.tileMap.createStaticLayer('background', this.tileSetBg)

    this.tileSet = this.tileMap.addTilesetImage("brick");
    this.platform = this.tileMap.createLayer('scene0', this.tileSet);

    this.objectsLayer = this.tileMap.getObjectLayer('objects');
    this.activators = this.tileMap.getObjectLayer('activate');

    const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")

    //const messagePosition = this.objectsLayer.objects.find( object => object.name === "ending")
    //this.add.bitmapText(messagePosition.x, messagePosition.y, "mario", "GUINXU IS IN ANOTHER CASTLE", 40).setAlpha(0);
   this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
    this.platform.setCollisionByExclusion([-1]);
    this.coins = 0;
    this.add.image(20, 20, "coin").setOrigin(0.5).setScrollFactor(0).setScale(0.7)
    this.coinsText = this.add.bitmapText(85, 20, "mario", "x0", 30).setOrigin(0.5).setScrollFactor(0)
    this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.player = new Player(this, playerPosition.x, playerPosition.y, 0);
    this.foes = this.add.group();
    this.powerUps = this.add.group();
    this.secretsGroup = this.add.group();
    this.physics.world.enable([ this.player ]);
    this.colliderActivated = true;

    this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);

    this.physics.add.collider(this.foes, this.platform, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);

    this.physics.add.collider(this.powerUps, this.platform, this.hitFloor, ()=>{
      return this.colliderActivated;
    }, this);

    this.physics.add.overlap(this.player, this.activators, this.activate, ()=>{
      return true;
    }, this);

    this.physics.add.overlap(this.player, this.foes, this.hitplayer, ()=>{
      return true;
    }, this);

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, ()=>{
      return true;
    }, this);


    // this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 0);
    this.texts = {};
    this.loadAudios();
    this.addObjects();
    this.addActivatePoints();

    this.physics.add.overlap(this.player, this.secretsGroup, this.hitSecret, ()=>{
      return true;
    }, this);
      this.cursor = this.input.keyboard.createCursorKeys();
      this.addCamera();
    this.playMusic();
  }

  addCamera () {


    const controlConfig = {
        camera: this.cameras.main,
        left: this.cursor.left,
        right: this.cursor.right,
        up: this.cursor.up,
        down: this.cursor.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    this.cameras.main.setBounds(0, 0, 224, -12000);
  }

  update (time, delta) {
   // this.player.update()
    this.foes.children.entries.forEach(foe => foe.update());
    this.powerUps.children.entries.forEach(power => power.update());
    if (this.cursor.right.isDown) {
      this.player.x--;

    } else if (this.cursor.left.isDown) {
            this.player.x++;
    } 

    this.player.y -= 1;
    this.controls.update(delta);
  }

  loadAudios () {
    this.audios = {
      "jump": this.sound.add("jump"),
      "coin": this.sound.add("coin"),
      "powerup": this.sound.add("powerup"),
      "death": this.sound.add("death"),
      "bump": this.sound.add("bump"),
      "shrink": this.sound.add("shrink"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  hitplayer (player, foe) {
    if (player.powered) {
      this.playAudio("shrink")
      player.powerDown();
      return;
    }

    if (player.tmpDisabled) return;
    this.playAudio("death")
    player.dead = true;
    player.body.enable = false;
    const timeline = this.tweens.createTimeline();
    timeline.add({
      targets: player,
      y: {from: player.y, to: player.y - 200},
      duration: 500
    });
    timeline.add({
      targets: player,
      y: {from: player.y - 200, to: player.y + 800},
      duration: 1000,
      onComplete: () => {
        this.scene.start('game')
      }
    })
    timeline.play();
  }

  pickPowerUp(player, powerUp) {
    player.powerUp();
    this.playAudio("powerup")
    powerUp.destroy();
  }

  hitSecret(player, secret) {
    this.powerUps.add(new PowerUp (this, player.x, player.y - 64))
    this.playAudio("bump")
    secret.destroy();
  }

  addObjects () {
    this.coinsGroup = this.add.group()
    this.objectsLayer.objects.forEach( object => {
      if (object.name === "coin")
        this.coinsGroup.add(new Coin(this, object.x, object.y, object.name))
      if (object.name.startsWith("text")) {
        // this.addText(object);
       }

       if (object.name.startsWith("secret")) {
         this.secretsGroup.add(new ActivatePoint(this, object.x, object.y, object.name));
       }

      if (object.name.startsWith("image1") ) {
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
        this.foes.add(new Foe (this, object.x, object.y, "foe0", -100))
        this.foes.add(new Foe (this, object.x, object.y, "foe0", 100))
    })
    this.activateOverlap = this.physics.add.overlap(this.player, this.activateGroup, this.activate.bind(this));
  }

  playMusic (theme="theme") {
    if (this.theme) this.theme.stop();
    this.theme = this.sound.add(theme);
    this.theme.play({
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
  })
  }

  activate(player, activation) {
    activation.destroy();
  }

  pick (player, coin) {
    player.scene.playAudio("coin")
    player.scene.updateCoinScore(1)
    coin.destroy();
  }

  updateCoinScore (points = 0) {
    this.coins = this.coins + points;
    this.registry.set("coins", this.coins);
    this.coinsText.setText("x"+this.coins);
  }

}

export default Game;
