
import { Scene3D } from '@enable3d/phaser-extension'

export default class Bootloader extends Scene3D {
    constructor () {
        super({ key: "bootloader" });
    }

    preload () {
        this.createBars();
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x03A062, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );
        this.load.on("complete", () => {
            this.scene.start("splash");
        },this);

        Array(4).fill(0).forEach((e, i) => { this.load.audio(`thunder${i}`, `./assets/sounds/thunder${i}.mp3`);})
        Array(2).fill(0).forEach((e, i) => { this.load.audio(`passby${i}`, `./assets/sounds/passby${i}.mp3`);})
        Array(4).fill(0).forEach((_,i) => {
            this.load.audio(`hit${i+1}`,`assets/sounds/hit${i+1}.mp3`)
        });
        this.load.image("pello_logo_old", "assets/images/pello_logo_old.png");
        this.load.image("logo", "assets/images/logo.png");
        this.load.audio("hymn", "assets/sounds/hymn.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("type", "assets/sounds/type.mp3");
        this.load.audio("shot", "assets/sounds/shot.mp3");
        this.load.audio("voice_start", "assets/sounds/voice_start.mp3");
        this.load.audio("voice_drop", "assets/sounds/voice_drop.mp3");
        this.load.audio("voice_hit", "assets/sounds/voice_hit.mp3");
        Array(4).fill(0).forEach((e, i) => {this.load.video(`video${i}`, `./assets/videos/video${i}.mp4`, 'loadeddata', false, true); });
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.bitmapFont("computer", "assets/fonts/computer.png", "assets/fonts/computer.xml");


        this.registry.set("deviation", "0")
        this.registry.set("probes", "20")
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x06E18A, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
