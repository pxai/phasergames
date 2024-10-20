import * as Phaser from "phaser";
import { enable3d, Canvas } from "@enable3d/phaser-extension";
import Bootloader from "./bootloader";
import Outro from "./outro";
import GameOver from "./game_over";
import Splash from "./splash";
import Story from "./story";
import Game from "./game";

const config = {
  type: Phaser.WEBGL,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  scene: [Bootloader, Story, Splash, Game, Outro, GameOver],
  ...Canvas(),
};

/*
We need this specific way to load the game because we are using the 3D extension.
  */
window.addEventListener("load", () => {
  enable3d(() => new Phaser.Game(config)).withPhysics("./assets/ammo");
});
