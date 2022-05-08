import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Game from "./game";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

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
        default: "matter",
        matter: {
            // gravity: { y: 300 },
             debug: true,
             showAxes: false,
             showAngleIndicator: true,
             angleColor: 0xe81153,

             showBroadphase: false,
             broadphaseColor: 0xffb400,

             showBounds: false,
             boundsColor: 0xffffff,

             showVelocity: true,
             velocityColor: 0x00aeef,

             showCollisions: true,
             collisionColor: 0xf5950c,
 
             showSeparations: false,
             separationColor: 0xffa500,

             showBody: true,
             showStaticBody: true,
             showInternalEdges: true,

             renderFill: false,
             renderLine: true,
 
             fillColor: 0x106909,
             fillOpacity: 1,
             lineColor: 0x28de19,
             lineOpacity: 1,
             lineThickness: 1,
 
             staticFillColor: 0x0d177b,
             staticLineColor: 0x1327e4,

             showSleeping: true,
             staticBodySleepOpacity: 1,
             sleepFillColor: 0x464646,
             sleepLineColor: 0x999a99,
 
             showSensors: true,
             sensorFillColor: 0x0d177b,
             sensorLineColor: 0x1327e4,
 
             showPositions: true,
             positionSize: 4,
             positionColor: 0xe042da,
 
             showJoint: true,
             jointColor: 0xe0e042,
             jointLineOpacity: 1,
             jointLineThickness: 2,
 
             pinSize: 4,
             pinColor: 0x42e0e0,
 
             springColor: 0xe042e0,
 
             anchorColor: 0xefefef,
             anchorSize: 4,
 
             showConvexHulls: true,
             hullColor: 0xd703d0
         }
    },
    plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
          }
        ]
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
