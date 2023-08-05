import Player from "./player";
import Chat from "./chat";
import Fireball from "./fireball";
import Shield from "./shield";
import MapGenerator from "./map_generator";
import Explosion from "./explosion";

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
        this.physics.world.setBoundsCollision(true, true, false, true);
        this.addChat();
        this.loadAudios();

        this.cursor = this.input.keyboard.createCursorKeys();
    }

    addChat () {
        this.chat = new Chat(this);
    }

    loadGame () {
        this.addMap();

        // this.playMusic();
    }

    addMap () {
        this.waterTime = 0;
        this.tileMap = this.make.tilemap({ key: `scene${this.number}`, tileWidth: 32, tileHeight: 32 });

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
        this.shields = this.add.group();
        this.arrows = this.add.group();
        this.texts = [];

        this.objectsLayer.objects.forEach(object => {
            if (object.name === "text") {
                this.texts.push(object);
            }
        });

        //new MapGenerator(this)
    }

    addPlayer (name) {
        const player = this.chooseSide(name);

        this.physics.add.collider(player, this.platform, this.hitFloor, () => {
            return true;
        }, this);


        this.physics.add.collider(player, this.bricks, this.hitFloor, () => {
            return true;
        }, this);

        this.physics.add.collider(player, this.arrows, this.arrowHitPlayer, () => {
            return true;
        }, this);

        this.physics.add.overlap(player, this.fireballs, this.fireballHitsPlayer, () => {
            return true;
        }, this);

        this.physics.add.collider(player, this.explosions, this.explosionHitsPlayer, () => {
            return true;
        }, this);

        this.physics.add.overlap(this.fireballs, this.shields, this.fireballHitShield, () => {
            return true;
        }, this);

        this.physics.add.overlap(this.fireballs, this.platform, this.fireballHitPlatform, () => {
            return true;
        }, this);

        this.physics.add.overlap(this.fireballs, this.playersLeft, this.fireballHitPlayer, () => {
            return true;
        }, this);

        this.physics.add.overlap(this.fireballs, this.playersRight, this.fireballHitPlayer, () => {
            return true;
        }, this);
    }

    fireballHitsPlayer(player, fireball) {
        console.log("Fireball hits pllayer: ", player, fireball)
        player.hit(2);
        fireball.destroy();
        new Explosion(this, fireball.x, fireball.y)
        this.playAudio("boom")
    }

    explosionHitsPlayer(player, explosions) {
        player.hit(1);
    }

    hitFloor (player, platform) {
    }

    brickHitPlatform (brick, platform) {
    }

    fireballHitShield (fireball, shield) {
        fireball.destroy();
        shield.destroy();
    }

    chooseSide (name) {
        const y = Phaser.Math.Between(64, 128);
        let player = null;
        let side = "";

        const x = parseInt(Phaser.Math.Between(0, this.width - 128));

        player = new Player(this, x, y, side, name);
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        return player;
    }

    getTile(platform) {
        const {x, y} = platform;
        return this.platform.getTileAt(x, y);
      }

    fireballHitPlayer (fireball, player) {
        console.log("Destroyed firebal??")
    }

    fireballHitPlatform (fireball, platform) {
        //if (!fireball.activate) return
        const tile = this.getTile(platform)
        if (tile && tile.x) {
            this.platform.removeTileAt(tile.x, tile.y);
            fireball.destroy();
            new Explosion(this, fireball.x, fireball.y)
            this.playAudio("boom")
        }

        //platform.destroy();
    }

    attack (playerName, speed, angle) {
        const player = this.allPlayers[playerName];
        if (player.dead) return;

        if (this.isValidNumber(speed) && this.isValidNumber(angle)) {
            console.log("Attack: ", playerName, player, speed, angle);
            player.sprite.anims.play("playerspell", true);
            const fireball = new Fireball(this, player.x + 16, player.y - 16);
            this.fireballs.add(fireball);
            const finalAngle = Phaser.Math.DegToRad(+angle);
            const velocity = this.physics.velocityFromRotation(finalAngle, +speed);
            fireball.body.setVelocity(velocity.x, velocity.y);
            this.playAudio("fireball")
        } else {
            this.chat.say(`Player ${playerName} invalid attack values. Use speed: 0-400, angle: 0-360!`);
        }
    }

    isValidSpeed(number) {
        return this.isValidNumber(number) && +number >= 0 && +number <= 400;
    }

    isValidAngle(number) {
        return this.isValidNumber(number) && +number >= 0 && +number <= 360;
    }

    move (playerName, x, y) {
        return;
        const player = this.allPlayers[playerName];
        if (this.isValidRange(Math.abs(x), player.range) && this.isValidRange( Math.abs(y),player.range)) {
            const player = this.allPlayers[playerName];
            player.sprite.anims.play("playerwalk", true);
            const point = new Phaser.Geom.Point(player.x + (+x), player.y + (+y));
            const velocity = (Math.abs(x) + Math.abs(y)) * 5;
            console.log("Move: ", playerName, velocity, player.x, player.y, point.x, point.y);
            this.physics.moveTo(player, point.x, point.y, velocity);
        }
    }

    shield (playerName, size) {
        const player = this.allPlayers[playerName];
        if (this.isValidRange(size, player.mana)) {
            console.log("Shield: ", playerName, player);
            player.sprite.anims.play("playerspell", true);
            new Shield(this, player.x, player.y);
        }
    }

    info (playerName, playerToGetInfo) {
      const player = this.allPlayers[playerName];
      const playerInfo = this.allPlayers[playerToGetInfo];
      if (player && playerInfo) {
          const info = playerInfo.getInfo();
          return Object.keys(info).map(key => `${key} ${info[key]}`).join(", ");
      }
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 0 && number < this.width;
    }

    isValidRange (number, range) {
        return this.isValidNumber(number) && number >= 0 && number <= range;
    }

    loadAudios () {
        this.audios = {
            fireball: this.sound.add("fireball"),
            step: this.sound.add("step"),
            death: this.sound.add("death"),
            boom: this.sound.add("boom"),
            fireball: this.sound.add("fireball"),
            win: this.sound.add("win")
        };
    }

    playAudio (key) {
        this.audios[key].play();
    }

    playRandom(key) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0
        });
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
        if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
            this.attack("devdiaries", Phaser.Math.Between(0, 400), Phaser.Math.Between(0, 360));
        }
    }

    checkGameOver () {
        console.log(this.allPlayers, Object.values(this.allPlayers));
        const remaining = Object.values(this.allPlayers).map(player => player.dead).length;

        if (remaining == 1) {
            const last = Object.values(this.allPlayers).find(player => !player.dead) ;
            this.winner = last ? last.name : "No Winn" ;
            this.gameOver = true;
        } else if (remaining <= 1)
            this.winner = "No Winn"
            this.gameOver = true;
            this.showResult();
    }

    showResult () {
        this.add.bitmapText(this.center_width, this.center_height - 50, "mainFont", "Game Over:", 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
        this.add.bitmapText(this.center_width, this.center_height + 50, "mainFont", "Winner: ", 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
       // this.scene.start("transition", { next: "underwater", name: "STAGE", number: this.number + 1 });

       this.restart = this.add.bitmapText(this.center_width, this.center_height + 150, "mainFont", "CLICK TO RESTART", 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
       this.restart.setInteractive();
       this.restart.on('pointerdown', () => {
            this.scene.start("splash")
        })
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
