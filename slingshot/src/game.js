import Ball from "./ball";
import Exit from "./exit";
import Bat from "./bat";
import Platform from "./platform";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.ball = null;
    this.score = 0;
    this.scoreText = null;
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
  }

  preload() {}

  /*
    This function creates the game. It sets the width and height of the game, the center of the width and height, and the background color. Then it calls the functions to create the rest of the elements of the game.
    */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(0x62a2bf); //(0x00b140)//(0x62a2bf)
    this.add.tileSprite(0, 1000, 1024 * 10, 512, "landscape").setOrigin(0.5);

    this.createMap();
    this.addBall();
    this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);


    this.cameras.main.startFollow(this.ball, true, 0.0, 0.10, 0, 240);
    this.physics.world.enable([this.ball]);
    this.addScore();
    this.loadAudios();
    //this.playMusic()
  }

  /*
    This function adds the score to the game. It creates the text and the coin icon. It will be updated when the ball picks a coin.
    */
  addScore() {
    this.scoreText = this.add
      .bitmapText(75, 10, "pixelFont", "x0", 30)
      .setDropShadow(0, 4, 0x222222, 0.9)
      .setOrigin(0)
      .setScrollFactor(0);
    this.scoreExitLogo = this.add
      .sprite(50, 25, "exit")
      .setScale(1)
      .setOrigin(0.5)
      .setScrollFactor(0);
  }

  /*
    This function creates the map of the game. It loads the tilemap and the tilesets and it creates the layers and the objects defined on the tilemap. It also creates the groups for the foes, the platforms, the turns, the exits, the lunchboxes, and the bricks. Finally, it calls the function to create the colliders.
    */
  createMap() {
    this.tileMap = this.make.tilemap({
      key: "scene" ,
      tileWidth: 64,
      tileHeight: 64,
    });
    this.tileSetBg = this.tileMap.addTilesetImage("background");
    this.tileMap.createStaticLayer("background", this.tileSetBg);

    this.tileSet = this.tileMap.addTilesetImage("softbricks");
    this.platform = this.tileMap.createLayer(
      "scene",
      this.tileSet
    );
    this.objectsLayer = this.tileMap.getObjectLayer("objects");

    this.platform.setCollisionByExclusion([-1]);

    this.batGroup = this.add.group();
    this.foesGroup = this.add.group();
    this.exitGroup = this.add.group();
    this.platformGroup = this.add.group();

    this.addsObjects();
    this.addColliders();
  }

  /*
    This function adds the objects defined on the objects layer of the tilemap to the game. Yeah, I know, I could have used a switch statement here, but lately, I'm trying to avoid them as much as I can.
    */
  addsObjects() {
    this.objectsLayer.objects.forEach((object) => {
      if (object.name === "bat") {
        let bat = new Bat(this, object.x, object.y, object.type);
        this.batGroup.add(bat);
        this.foesGroup.add(bat);
      }

      if (object.name === "platform") {
        this.platformGroup.add(
          new Platform(this, object.x, object.y, object.type)
        );
      }

      if (object.name === "text") {
        this.add
          .bitmapText(object.x, object.y, "pixelFont", object.text.text, 30)
          .setDropShadow(2, 4, 0x222222, 0.9)
          .setOrigin(0);
      }

      if (object.name === "exit") {
        this.exit = new Exit(
          this,
          object.x,
          object.y,
        ).setOrigin(0.5)
        this.exitGroup.add(this.exit);
      }
    });
  }

  /*
    Once we have our objects, foes, and platforms in the game, we add the colliders between them.
    */
  addColliders() {
    this.physics.add.collider(
      this.batGroup,
      this.platform,
      this.turnFoe,
      () => {
        return true;
      },
      this
    );
  }

  /*
    This function is called when a foe touches a turn object. It turns the foe.
    */
  turnFoe(foe, platform) {
    foe.turn();
  }

  /*
    This callback is empty but here we could add some effects. It is called when a foe hits the floor.
    */
  hitFloor() {}

  /*
    We add the ball to the game and we add the colliders between the ball and the rest of the elements. The starting position of the ball is defined on the tilemap.
    */
  addBall() {
    this.elements = this.add.group();
    this.coins = this.add.group();

    const ballPosition = this.objectsLayer.objects.find(
      (object) => object.name === "ball"
    );
    this.ball = new Ball(this, ballPosition.x, ballPosition.y, 0);

    this.physics.add.collider(
      this.ball,
      this.platform,
      this.hitFloor,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.ball,
      this.platformGroup,
      this.hitFloor,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.hitFloor,
      () => {
        return true;
      },
      this
    );


    this.physics.add.overlap(
      this.ball,
      this.exitGroup,
      () => {
        this.playAudio("stage");
        this.time.delayedCall(1000, () => this.finishScene(), null, this);
      },
      () => {
        return true;
      },
      this
    );


    this.physics.add.collider(
      this.ball,
      this.batGroup,
      this.hitBall,
      () => {
        return true;
      },
      this
    );
  }

  /*
    This function is called when the ball hits a foe. If the ball is invincible (because of a power-up), then the foe dies. If not, then the ball dies.
    */
  hitBall(ball, foe) {
      ball.destroy();
      this.playAudio("death");
      this.restartScene()
  }

  hitFloor(ball, platform) {
  }

  /*
    This will load all the audio files used in the game. It is called from the create function, and so we can use `this.audios` to play the sounds.
    */
  loadAudios() {
    this.audios = {
      death: this.sound.add("death"),
      jump: this.sound.add("jump"),
      kill: this.sound.add("kill"),
      land: this.sound.add("land"),
      foedeath: this.sound.add("foedeath"),
      stage: this.sound.add("stage"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  /*
      This plays the audio with a random volume and rate to add more variety to some sounds that otherwise would sound too repetitive.
      */
  playAudioRandomly(key) {
    const volume = Phaser.Math.Between(0.8, 1);
    const rate = Phaser.Math.Between(0.8, 1);
    this.audios[key].play({ volume, rate });
  }

  /*
      This plays the music of the game. It is called from the create function, and so we can use `this.theme` to play the music.
      */
  playMusic(theme = "music") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
    The game loop. It updates the ball and checks if the ball has fallen from the map (we could add pits for this). If it has, then it restarts the scene.
    */
  update() {
    this.updateScore()
  }

  /*
    This is called when the ball reaches the exit. It stops the music and it starts the transition scene increasing the stage number, so we will load the next map.
    */
  finishScene() {
    if (this.theme) this.theme.stop();
    this.scene.start("outro", { name: "STAGE", number: this.number + 1 });
  }

  /*
    This is called when the ball dies. It stops the music and it starts the transition scene without increasing the stage number.
    */
  restartScene() {
    this.time.delayedCall(
      1000,
      () => {
       // if (this.theme) this.theme.stop();
        this.scene.start("game", { name: "STAGE", number: this.number });
      },
      null,
      this
    );
  }

  /*
    This is called when the ball picks a coin. It updates the score from the registry and it adds a little tween effect to the score text.
    */
  updateScore() {
    this.scoreText.setText("px: " + this.getDistanceToExit());
  }

  getDistanceToExit() {
      const graphics = this.add.graphics();

      this.line = graphics.lineBetween(this.ball.x, this.ball.y, this.exitGroup.x, this.exitGroup.y);
        // Calculate the length of the line
        let dx = this.exit.x - this.ball.x ;
        let dy = this.exit.y - this.ball.y ;
      const lineLength = Math.sqrt(dx * dx + dy * dy);

      return parseFloat(lineLength.toFixed(2));
  }
}
