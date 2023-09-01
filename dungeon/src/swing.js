export default class Swing  {
    constructor(scene, x, y, texture = "block", frame = 0) {
        this.scene = scene;
        this.name = "block";
       // this.setPosition(x, y);

       const platform = scene.add.tileSprite(x, y, 64 * 3, 18, "seesaw");
    
       scene.matter.add.gameObject(platform, {
           restitution: 0, // No bounciness
           frictionAir: 0, // Spin forever without slowing down from air resistance
           friction: 0.2, // A little extra friction so the player sticks better
           // Density sets the mass and inertia based on area - 0.001 is the default. We're going lower
           // here so that the platform tips/rotates easily
           density: 0.0005
       });

       //const body3 = this.scene.matter.add.circle(x, y + 150, 16);
       this.scene.matter.add.worldConstraint(
        platform, 140, 1, 
        { 
            pointA: { x, y },
        });
    
        // this.init(x,y);
    }

    init(x, y) {
        // this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

        // Create the physics-based sprite that we will move around and animate

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this;
        const mainBody = Bodies.rectangle(0, 0, w , h);

        this.setExistingBody(mainBody).setPosition(x, y);
    }
}