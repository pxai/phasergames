import Phaser from "phaser";
import Player from "./player";
import Foe from "./foe";
import Background from "./background";
import Items from "./items";
import Explosion from "./explosion";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
    }

    preload () {
        this.registry.set("score", 0);
        this.registry.set("health", 100);
        this.registry.set("time", 0);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.shots = this.add.group();
        this.checkWorld = false;
        this.setCamera();
        this.addBackground();
        this.addItems();
        this.addPlayer()
        this.addColliders();
        this.cameras.main.setBackgroundColor(0x494d7e);

       // this.loadAudios();
       // this.playMusic();
       // this.cameras.main.startFollow(this.player, true);
    }

    setCamera () {
        this.cameras.main.setBounds(0, 0, 64 * 40, 64 * 33);
        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(64 * 20, 64 * 20);
        this.cameraX = 64 * 20;
        this.cameraY = 64 * 20;
        this.panDirection = Date.now() % 8; // right, left, up, down
        console.log("A ver jambo:; ",  this.panDirection)
    }

    updateCamera() {
        const {x, y} = this.cameras.main.worldView;
    
        if (this.cameraX > 1680) {
            this.panDirection = Date.now() % 8; 
        } else if (this.cameraX < 64) {
            this.panDirection = Date.now() % 8; 
        } else if (this.cameraY < 64) {
            this.panDirection = Date.now() % 8; 
        } else if (this.cameraY > (64 * 33) - 100) {
            this.panDirection = Date.now() % 8; 
        }

        switch (this.panDirection) {
            case 0:
                this.cameraX += 2;
                break;
            case 1:
                this.cameraX -= 2;
                break;
            case 2:
                this.cameraY -= 2;
                break;
            case 3:
                this.cameraY += 2;
                break;
            case 4:
                this.cameraX += 2;
                this.cameraY += 2;
                break;
            case 5:
                this.cameraX += 2;
                this.cameraY -= 2;
                break;
            case 6:
                this.cameraX -= 2;
                this.cameraY -= 2;
                break;
            case 7:
                this.cameraX -= 2;
                this.cameraY += 2;
                break;
            default:
                break;
        }

        this.cameras.main.pan(this.cameraX, this.cameraY)
    }

    addPlayer() {
        this.thrust = this.add.layer();
        const x = 64 * 20;
        const y = 64 * 20;
        this.player = new Player(this, x, y)
        this.foe = new Foe(this, x + 200, y + 200, this.items.grid)
        this.time.delayedCall(300, () => { this.checkWorld = true; });
    }

    addBackground () {
        this.backgroundLayer = this.add.layer();
        this.background = new Background(this)
    }

    addItems () {
        this.asteroids = this.add.group()
        this.boxes = this.add.group();
        this.energies = this.add.group();
        this.items = new Items(this)
    }

    addColliders () {
        this.physics.add.overlap(this.player, this.asteroids, this.crashAsteroid.bind(this));
        this.physics.add.overlap(this.player, this.energies, this.pickEnergy.bind(this));
        this.physics.add.overlap(this.shots, this.asteroids, this.destroyAsteroid.bind(this));
        this.physics.add.overlap(this.shots, this.ship, this.shotShip.bind(this));
        this.physics.add.overlap(this.shots, this.energies, this.destroyEnergy.bind(this));
    }

    destroyEnergy(shot, energy) {
        shot.destroy();
        energy.destroy();
    }

    pickEnergy(ship, energy) {
        ship.addEnergy(energy.power);
        energy.destroy();
    }

    shotShip(shot, ship) {
        if (shot.id === ship.id) return;

        shot.destroy();
        ship.destroy()
    }

    destroyAsteroid(shot, asteroid) {
        shot.destroy();
        new Explosion(this, asteroid.x, asteroid.y, "0xcccccc", 15)
        asteroid.destroy();
    }

    crashAsteroid (player, asteroid) {
        new Explosion(this, asteroid.x, asteroid.y, "0xcccccc", 15)
        asteroid.destroy();
        this.destroyPlayer()
    }

    destroyPlayer () {
        this.cameras.main.shake(500);
        new Explosion(this, this.player.x, this.player.y, "0xffffff", 10)
        this.player.destroy();

        this.updateScore(false)
        this.time.delayedCall(4000, () => this.startGame());
    }

    destroyFoe() {
        this.cameras.main.shake(500);
        new Explosion(this, this.foe.x, this.foe.y, "0xffffff", 10)
        this.foe.destroy();

        this.updateScore(true)
        this.time.delayedCall(4000, () => this.startGame());
    }

    update () {
        if (!this.player.death && !this.foe.death) { 
            this.player.update();
            this.foe.update();
            this.updateCamera();
            this.checkPlayerInside();
        }
        this.shots.children.entries.forEach(shot => { 
            shot.update();
        });
    }

    checkPlayerInside () {
        if (!this.checkWorld) return;

        const worldView = this.cameras.main.worldView;
        if (!worldView.contains(this.player.x, this.player.y)) { this.destroyPlayer(); }
        if (!worldView.contains(this.foe.x, this.foe.y)) { this.destroyFoe(); }
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("muzik", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.theme.play()
    }

    loadAudios () {
        this.audios = {
          // "move": this.sound.add("move"),
        };
      }

    playAudio(key) {
        this.audios[key].play();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("game");
    }

    updateScore (playerWin) {
        let playerScore = +this.registry.get("playerScore");
        let foeScore = +this.registry.get("foeScore");
        let outcome = "";
        if (playerWin) {
            outcome = ["You won!!", "YAY!!", "Awesome!!"][Phaser.Math.Between(0, 2)];
            playerScore++;
            this.registry.set("playerScore",`${playerScore}`)
        } else {
            outcome = ["You lose!!", "You suck!!", "Loser!!"][Phaser.Math.Between(0, 2)];
            foeScore++;
            this.registry.set("foeScore",`${foeScore}`)
        }

        if (playerScore === 10 || foeScore === 10) {
            this.time.delayedCall(2000, () => this.gameOver());
        }

        const x = this.cameras.main.worldView.centerX;
        const y = this.cameras.main.worldView.centerY;
        this.score1 = this.add.bitmapText(x, y - 200, "starshipped", outcome, 80).setOrigin(0.5);
        this.score2 = this.add.bitmapText(x, y + 100, "starshipped", `You: ${playerScore} - Foe: ${foeScore}`, 60).setOrigin(0.5);
    }

    gameOver () {
        if (this.theme) this.theme.stop();
        this.scene.start("game-over");
    }
}
