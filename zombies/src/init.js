import Phaser from "phaser";
import Bootloader from "./bootloader";
import Splash from "./splash";
import Game from "./game";

const urlParams = new URLSearchParams(window.location.search);

const width = +urlParams.get('width') || 1200;
console.log("Final Width: ", width);

const config = {
    width: 1200,
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
        Game,
    ]
};

const game = new Phaser.Game(config);
