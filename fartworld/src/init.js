import Phaser from "phaser";
import Bootloader from "./bootloader";
import Intro from "./intro";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Stage1 from "./scenes/stage1/";
import Stage2 from "./scenes/stage2/";
import Stage3 from "./scenes/stage3/";
import Stage4 from "./scenes/stage4/";

const config = {
    width: 800,
    height: 600,
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
            debug: false
        }
    },
    scene: [
        Bootloader,
        Intro,
        Splash,
        Transition,
        Stage1,
        Stage2,
        Stage3,
        Stage4,
        Outro,
    ]
};

const game = new Phaser.Game(config);
