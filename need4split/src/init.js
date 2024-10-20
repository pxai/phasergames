import Phaser from "phaser";
import Bootloader from "./bootloader";
import Splash from "./splash";
import Game from "./game";
import Transition from "./transition";
import GameOver from "./gameover";
import Outro from "./outro";

const config = {
    width: 1200,
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "contenedor",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    },
    scene: [
        Bootloader,
        Splash,
        Game,
        Transition,
        GameOver,
        Outro
    ]
};

const game = new Phaser.Game(config);
