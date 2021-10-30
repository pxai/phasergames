import Phaser from "phaser";
import Splash from "./splash";
import Game from "./game";
import Bootloader from "./bootloader";

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "phaser-example",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 800
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Bootloader, Splash, Game]
};

new Phaser.Game(config);
