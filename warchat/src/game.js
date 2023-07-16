import Player from "./player";
import Chat from "./chat";
import Fireball from "./fireball";

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
        this.cameras.main.setBackgroundColor(0x00b140);
        this.addChat();
    }

    addChat () {
        this.chat = new Chat(this);
    }

    loadGame () {
        this.addMap();
        // this.loadAudios();
        // this.playMusic();
    }

    addMap () {
        this.waterTime = 0;
        this.tileMap = this.make.tilemap({ key: `scene${this.number}`, tileWidth: 25, tileHeight: 25 });

        this.tileSetBg = this.tileMap.addTilesetImage("map");
        this.backgroundLayer = this.tileMap.createLayer("background", this.tileSetBg);

        this.tileSet = this.tileMap.addTilesetImage("map");
        this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
        this.objectsLayer = this.tileMap.getObjectLayer("objects");

        this.tileSetItems = this.tileMap.addTilesetImage("tiles");
        this.tileMap.createLayer("items", this.tileSetItems);

        this.platform.setCollisionByExclusion([-1]);

        this.allPlayers = {};
        this.playersLeft = this.add.group();
        this.playersRight = this.add.group();
        this.foesGroup = this.add.group();
        this.skeletons = this.add.group();
        this.fireballs = this.add.group();
        this.trailLayer = this.add.layer();
        this.arrows = this.add.group();
        this.texts = [];

        this.objectsLayer.objects.forEach(object => {
            if (object.name === "text") {
                this.texts.push(object);
            }
        });
    }

    addPlayer (name) {
        const player = this.chooseSide(name);

        this.physics.add.collider(player, this.platform, this.hitFloor, () => {
            return true;
        }, this);

        this.physics.add.collider(player, this.arrows, this.arrowHitPlayer, () => {
            return true;
        }, this);

        this.physics.add.collider(this.fireballs, this.platform, this.fireballHitPlatform, () => {
            return true;
        }, this);

        this.physics.add.collider(this.fireballs, this.playersLeft, this.fireballHitPlayer, () => {
            return true;
        }, this);

        this.physics.add.collider(this.fireballs, this.playersRight, this.fireballHitPlayer, () => {
            return true;
        }, this);
    }

    chooseSide (name) {
        const y = Phaser.Math.Between(64, this.height - 196);
        let player = null;
        let side = "";
        if (this.playersLeft.getLength() >= this.playersRight.getLength()) {
            side = "right";
            const x = Phaser.Math.Between(this.width - 64, this.width - 196);
            player = new Player(this, x, y, side, name);
            this.playersRight.add(player);
        } else {
            side = "left";
            const x = Phaser.Math.Between(64, 196);
            player = new Player(this, x, y, side, name);
            this.playersLeft.add(player);
        }
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins ${side} army!`);
        return player;
    }

    fireballHitPlayer (fireball, player) {
        console.log("Hit by fireball", fireball, player);
    }

    attack (playerName, x, y) {
        if (this.isValidNumber(x) && this.isValidNumber(y)) {
            const player = this.allPlayers[playerName];
            console.log("Attack: ", playerName, player);
            player.sprite.anims.play("playerspell", true);
            const point = new Phaser.Geom.Point(+x, +y);
            const fireball = new Fireball(this, player.x, player.y);
            this.fireballs.add(fireball);
            const distance = Phaser.Math.Distance.BetweenPoints(player, point) / 100;
            // new Rune(this, x, y);
            this.physics.moveTo(fireball, point.x, point.y, 300);
        }
    }

    move (playerName, x, y) {
        const player = this.allPlayers[playerName];
        if (this.isValidRange(x, player.range) && this.isValidRange(y, player.range)) {
            const player = this.allPlayers[playerName];
            console.log("Move: ", playerName, player);
            player.sprite.anims.play("playerwalk", true);
            const point = new Phaser.Geom.Point(player.x + x, player.y + y);
            const distance = Phaser.Math.Distance.BetweenPoints(player, point) / 100;
            this.physics.moveTo(player, point.x, point.y, 100);
        }
    }

    shield (playerName, size) {
        const player = this.allPlayers[playerName];
        if (this.isValidRange(size, player.mana)) {
            console.log("Shield: ", playerName, player);
            player.sprite.anims.play("playerspell", true);
            const point = new Phaser.Geom.Point(player.x + x, player.y + y);
            const distance = Phaser.Math.Distance.BetweenPoints(player, point) / 100;
            this.physics.moveTo(player, point.x, point.y, 100);
        }
    }

    info (playerName, playerToGetInfo) {
      const player = this.allPlayers[playerName];
      const playerInfo = this.allPlayers[playerToGetInfo];
      if (player && playerInfo) {
          const info = playerInfo.getInfo();
          return Object.keys(info).map(key => `${key} ${info[key]}`).join("\n");
      }
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 0 && number < this.width;
    }

    isValidRange (number, range) {
        return this.isValidNumber(number) && number > 0 && number <= range;
    }

    loadAudios () {
        this.audios = {
            beam: this.sound.add("beam")
        };
    }

    playAudio (key) {
        this.audios[key].play();
    }

    playMusic (theme = "game") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
    }

    update () {

    }

    finishScene () {
        this.sky.stop();
        this.theme.stop();
        this.scene.start("transition", { next: "underwater", name: "STAGE", number: this.number + 1 });
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
