import Phaser from "phaser";
import Bootloader from "./bootloader";
import Splash from "./splash";
import Game from "./game";

const urlParams = new URLSearchParams(window.location.search);

const config = {
    width: 300,
    height: 350,
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
