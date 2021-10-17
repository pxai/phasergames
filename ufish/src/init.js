import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Game from "./game";
import Underwater from "./underwater";
import Depth from "./depth";
import Escape from "./escape";

const config = {
    width: 1000,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "contenedor",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        Bootloader,
        Splash,
        Transition,
        Game,
        Underwater,
        Depth,
        Escape,
        Outro,
    ]
};

const game = new Phaser.Game(config);
