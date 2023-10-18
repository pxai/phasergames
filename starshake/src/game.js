import FoeGenerator from "./foe_generator";
import Player from "./player";
import PowerUp from "./powerup";
import SceneEffect from "./scene_effect";

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
      this.next = data.next;
      console.log("Current scene: ", this.name, "Next scene: ", this.next)
  }

    preload () {
    }

    create () {
      this.duration = this.time * 1000;
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      new SceneEffect(this).simpleOpen(() => 0);
      this.addBackground();
      this.cameras.main.setBackgroundColor(0x333333)
      this.lights.enable();
      this.lights.setAmbientColor(0x666666);
      this.addScores();
      this.addFoes();
      this.addPlayers();
      this.addPowerUps();

      this.addShots();
      //this.loadAudios();

      this.addColliders();
      this.time.delayedCall(6000, () => this.endScene(), null, this)
    }

  /*

  */
    addBackground () {
      this.background = this.add.tileSprite(0, 0, this.width, this.height, "stage"+ this.number).setOrigin(0).setScrollFactor(0, 1);
    }

  /*

  */
    spawnShake() {
      const {x, y} = this.lastDestroyedWaveFoe;
      this.shake = new PowerUp(this, x, y);
      this.powerUps.add(this.shake)
    }

  /*

  */
    addScores () {
      this.scores = {
        "player1": {},
        "player2": {},
      };

      this.add.image(180, 16, "player1").setOrigin(0.5).setScale(0.3).setScrollFactor(0)
      this.scores["player1"]["scoreText"] = this.add.bitmapText(150, 16, "pixelFont", "0".padStart(6,"0"), 20).setOrigin(0.5).setScrollFactor(0)
      this.scores["player2"]["scoreText"] = this.add.bitmapText(this.width - 150, 16, "pixelFont", "0".padStart(6,"0"), 20).setOrigin(0.5).setScrollFactor(0)
    }

  /*

  */
    addPlayers () {
      this.players = this.add.group();
      this.players.add(new Player(this, this.center_width, this.center_height))
    }

  /*

  */
    addShots () {
      this.shotsLayer = this.add.layer();
      this.shots = this.add.group();
    }

  /*

  */
    addFoes () {
      this.foeGroup = this.add.group();
      this.foeWaveGroup = this.add.group();
      this.foeShots = this.add.group();
      this.foes = new FoeGenerator(this);
    }

  /*

  */
    addPowerUps () {
      this.powerUps = this.add.group();
    }

  /*

  */
    addColliders () {
      this.physics.add.collider(this.players, this.foeGroup, this.crashFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.players, this.foeWaveGroup, this.crashFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.shots, this.foeGroup, this.destroyFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.shots, this.foeWaveGroup, this.destroyWaveFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.players, this.powerUps, this.pickPowerUp, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.players, this.foeShots, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.shots, this.foeShots, this.destroyShot, ()=>{
        return true;
      }, this);
      this.physics.world.on('worldbounds', this.onWorldBounds);
    }

  /*

  */
    onWorldBounds (body) {
      const name = body.gameObject.constructor.name.toString();
      if (["Shot","FoeShot"].includes(name)) {
        body.gameObject.destroy();
      }
    }

  /*

  */
    destroyShot (shot, foeShot) {
      const point = this.lights.addPointLight(shot.x, shot.y, 0xffffff, 10, 0.7);
      this.tweens.add({ targets: point, duration: 400, scale: { from: 1, to: 0 } });
      shot.destroy();
      foeShot.destroy();
      this.updateScore(shot.playerName, 50);
    }

  /*

  */
    destroyWaveFoe (shot, foe) {
      this.lastDestroyedWaveFoe = {x: foe.x, y: foe.y};
      this.destroyFoe(shot, foe)
    }

  /*

  */
    destroyFoe (shot, foe) {
      const point = this.lights.addPointLight(shot.x, shot.y, 0xffffff, 10, 0.7);
      this.tweens.add({ targets: point, duration: 400, scale: { from: 1, to: 0 } });
      this.updateScore(shot.playerName, foe.points);
      shot.destroy();
      foe.dead()
    }

  /*

  */
    hitPlayer (player, shot) {
      if (player.blinking) return;
      player.dead();
      shot.destroy()
      this.players.remove(player)
      this.time.delayedCall(1000, () => this.respwanPlayer(), null, this);
    }

  /*

  */
    crashFoe (player, foe) {
      if (player.blinking) return;
      player.dead();
      foe.dead()
      this.players.remove(player)
      this.time.delayedCall(1000, () => this.respwanPlayer(), null, this);
    }

  /*

  */
    pickPowerUp (player, powerUp) {
      this.updatePowerUp(player, powerUp);
      this.tweens.add({
        targets: player,
        duration: 100,
        alpha: {from: 0.5, to: 1},
        scale: { from: 1.2, to: 1},
        repeat: 50
    });
      powerUp.destroy();
    }

  /*

  */
    respwanPlayer () {
      const player = new Player(this, this.center_width, this.center_height)
      this.players.add(player)
      this.tweens.add({
        targets: player,
        duration: 100,
        alpha: {from: 0, to: 1},
        repeat: 20,
        onComplete: () => { player.blinking = false; }
    });
    }

    loadAudios () {
      this.audios = {
        "beam": this.sound.add("beam"),
      };
    }

  /*

  */
    playAudio(key) {
      this.audios[key].play();
    }

  /*

  */
    update() {
      this.players.children.entries.forEach( player => {
        player.update();
    })

      this.foes.update();
      this.background.tilePositionY -= 10;
    }

  /*

  */
    endScene () {
      if (this.number === 4) {
        console.log("Final BOSS")
      } else {
        this.finishScene();
      }
    }

  /*

  */
    finishScene () {
      this.game.sound.stopAll();
      console.log("This number: ", this.number)
      const scene = this.number < 5 ? "transition" : "outro"
      this.scene.start(scene, {next: "game", name: "STAGE", number: this.number + 1});
    }

  /*

  */
    updatePowerUp (player, powerUp) {
      console.log("Picket power: ", player.name, powerUp.power)
      player.powerUp = powerUp.power;
    }

  /*

  */
    updateScore (playerName, points = 0) {
        const score = +this.registry.get("score_" + playerName) + points;
        this.registry.set("score_" + playerName, score);
        this.scores[playerName]["scoreText"].setText(String(score).padStart(6, '0'));
    }
}
