import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Stage1 from "./scenes/stage1/";

const config = {
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "contenedor",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        Bootloader,
        Splash,
        Transition,
        Stage1,
        Outro,
    ]
};

const game = new Phaser.Game(config);
