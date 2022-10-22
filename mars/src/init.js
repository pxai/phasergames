import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Game from "./game";
import HorrifiPostFx from 'phaser3-rex-plugins/plugins/horrifipipeline.js';


const config = {
    width: 800,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "contenedor",
    pipeline: [HorrifiPostFx],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: [
        Bootloader,
        Splash,
        Transition,
        Game,
        Outro,
    ]
};

const game = new Phaser.Game(config);
