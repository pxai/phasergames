import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Game from "./game";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

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
        default: "matter",
        matter: {
            debug: true
        }
    },
    plugins: {
        scene: [{
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
          }]
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