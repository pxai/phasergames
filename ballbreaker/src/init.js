import Phaser from "phaser";
import Splash from "./splash";
import Game from "./game";
import GameOver from "./gameover";
import Outro from "./outro";

const config = {
    width: 800,
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
            gravity: { y: 350 },
            debug: true
        }
    },
    scene: [
        Splash,
        Game,
        GameOver,
        Outro
    ]
};

const game = new Phaser.Game(config);
