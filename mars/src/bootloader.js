export default class Bootloader extends Phaser.Scene {
    constructor () {
        super({ key: "bootloader" });
    }

    preload () {
        this.createBars();
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0xe5cc18, 1);
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
            this.scene.start("transition", {number: 0});
        },this);

        this.load.image("body", "assets/images/body.png");
        this.load.audio("mars_background", "assets/sounds/mars_background.mp3");
        this.load.audio("step", "assets/sounds/step.mp3");
        this.load.audio("creepy", "assets/sounds/creepy.mp3");
        this.load.audio("heartbeat", "assets/sounds/heartbeat.mp3");
        this.load.audio("breath", "assets/sounds/breath.mp3");
        this.load.audio("blip", "assets/sounds/blip.mp3");
        this.load.audio("ohmygod", "assets/sounds/ohmygod.mp3");
        this.load.audio("kill", "assets/sounds/kill.mp3");
        this.load.audio("tracker", "assets/sounds/tracker.mp3");



        //this.load.audio("splash", "assets/sounds/splash.mp3");
        //this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("type", "assets/sounds/type.mp3");


        Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`diary${i}`, `assets/sounds/diary/diary${i}.mp3`);
        });

        Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`officer${i}`, `assets/sounds/officer/officer${i}.mp3`);
        });

        this.load.bitmapFont("pico", "assets/fonts/pico.png", "assets/fonts/pico.xml");
        this.load.spritesheet("player", "assets/images/player.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("debris", "assets/images/debris.png", { frameWidth:64, frameHeight: 64 });
        this.load.spritesheet("step", "assets/images/step.png", { frameWidth:64, frameHeight: 64 });
        this.load.spritesheet("wave", "assets/images/wave.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("drone", "assets/images/drone.png", { frameWidth: 64, frameHeight: 64 });
        this.load.image("landscape", "assets/images/landscape.png");
        this.load.image("record", "assets/images/record.png");
        this.load.image("pello", "assets/images/pello_ok.png");

        this.load.image('mars', 'assets/maps/mars64.png');
        this.load.image('background', 'assets/maps/mars.png');

        Array(2).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`,`assets/maps/scene${i}.json`)
        });
        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score", 0);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xb85d08, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
