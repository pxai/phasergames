import Phaser from "phaser";
import Bootloader from "./bootloader";
import Splash from "./splash";
import Game from "./game";

const urlParams = new URLSearchParams(window.location.search);

const width = +urlParams.get('width') || 300;
const height = (+urlParams.get('height') || 200) + 20;
console.log("Final Width: ", width);
console.log("Final height: ", height);

const config = {
    width,
    height,
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
