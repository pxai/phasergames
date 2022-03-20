class Turn {
    constructor (scene, x, y, width=32, height=32, type="") {
        this.scene = scene;
        this.type = type;
        this.x = x;
        this.y = y;
        this.sprite = this.scene.matter.add.rectangle(x, y, width, height);
        this.sprite.label = "exit";

        this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
            console.log("Collision with ", bodyA.label, bodyB.label, bodyA, bodyB)
        });
     }
  }
  
  export default Turn;