import Phaser from "phaser";
import Splash from "./splash";
import Game from "./game";
import Bootloader from "./bootloader";
import GameOver from "./game_over";

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "phaser-example",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 868,
        height: 800
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    },
    scene: [Bootloader, Splash, Game, GameOver]
};

new Phaser.Game(config);
