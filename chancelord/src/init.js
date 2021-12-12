import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Stage0 from "./stage0";
import Stage1 from "./stage1";
import Stage2 from "./stage2";
import Stage3 from "./stage3";
import Stage4 from "./stage4";
import Stage5 from "./stage5";
import Stage6 from "./stage6";

const config = {
    width: 1000,
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
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [
        Bootloader,
        Splash,
        Transition,
        Stage0,
        Stage1,
        Stage2,
        Stage3,
        Stage4,
        Stage5,
        Stage6,
        Outro,
    ]
};

const game = new Phaser.Game(config);
