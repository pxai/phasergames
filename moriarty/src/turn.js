class Turn {
    constructor (scene, x, y, width=32, height=32, type="down") {
        this.scene = scene;
        this.type = type;
        this.x = x;
        this.y = y;
        this.sprite = this.scene.matter.add.rectangle(x, y, width, height);
        this.sprite.label = "exit";

        this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
            const player = bodyA.label === "player" ? bodyA : bodyB;

            if (bodyA.label === "exit" && player?.label === "player" && this.type === this.scene.player.direction) {

                this.scene.finishScene();
            }
        });
     }
  }
  
  export default Turn;