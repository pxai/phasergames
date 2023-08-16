import Phaser from "phaser";
import Bootloader from "./bootloader";
import Game from "./game";

const config = {
    width: 500,
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
        Game,
    ]
};

const game = new Phaser.Game(config);
