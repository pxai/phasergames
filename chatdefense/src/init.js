import Phaser from "phaser";
import Bootloader from "./bootloader";
import Splash from "./splash";
import Transition from "./transition";
import Game from "./game";

const urlParams = new URLSearchParams(window.location.search);

const width = +urlParams.get('width') || 800;

const config = {
    width,
    height: 800,
    scale: {
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
    ]
};

const game = new Phaser.Game(config);
