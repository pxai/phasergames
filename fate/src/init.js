import * as Phaser from "phaser";
import { enable3d, Canvas } from '@enable3d/phaser-extension'
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Game from "./game";

const config = {
    type: Phaser.WEBGL,
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720
    },
    scene: [
        Bootloader,
        Splash,
        Transition,
        Game,
        Outro,
    ],
    ...Canvas()
};

window.addEventListener('load', () => {
    enable3d(() => new Phaser.Game(config)).withPhysics('/assets/ammo')
})

