import Game from "./Game.js";

const config = {
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    scene: [Game],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
};

const p = new Phaser.Game(config);
console.log(p.scene.game);
