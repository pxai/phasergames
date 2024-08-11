import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Game from "./game";

const config = {
  width: 900,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: "contenedor",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Bootloader, Splash, Game, Outro],
};

const game = new Phaser.Game(config);
