import Load from "./load";
import Menu from "./Menu";
import Scene1 from "./scene1";
import Hud from "./hud";

export default {
    type: Phaser.AUTO,
    backgroundColor: "#00dead",
    width: 800,
    height: 600,
    scene: [Load, Menu, Scene1, Hud],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    }
};
