const config = {
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  scene: [Game],
  physics: {
    default: "arcade",
    arcade:{
        debug: false
    }
  }
};

const game = new Phaser.Game(config);