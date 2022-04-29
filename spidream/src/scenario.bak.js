export default class Scenario {
    constructor (scene) {
        this.scene = scene;
        this.init();
    }

    init () {
        this.scene.matter.world.setBounds();

        //  First, we'll create a few static bodies
        const body1 = this.scene.matter.add.rectangle(250, 50, 200, 32, { isStatic: true, frictionStatic: 1, ignoreGravity: true });
       // const body0 = this.scene.matter.add.rectangle(400, 250, 40, 40, { isStatic: false });
 
       Array(20).fill(0).forEach((e,i) => {
        Array(1).fill(0).forEach((a, j) => {
            const body2 = this.scene.matter.add.rectangle(40 * i, 200 + (40 * j), 40, 40, { isStatic: false, ignoreGravity: true });
            this.scene.matter.add.worldConstraint(body2, 50, 1, { pointA: { x: 40 * i, y: 200 + (40 * j) }});
        })
    })

        Array(20).fill(0).forEach((e,i) => {
            Array(5).fill(0).forEach((a, j) => {
                const body2 = this.scene.matter.add.rectangle(40 * i, 400 + (40 * j), 40, 40, { isStatic: false, ignoreGravity: false });
                this.scene.matter.add.worldConstraint(body2, 50, 1, { pointA: { x: 40 * i, y: 400 + (40 * j) }});
            })
        })

        //this.scene.matter.add.polygon(600, 100, 3, 40, { isStatic: true });
        //this.scene.matter.add.polygon(100, 500, 8, 50, { isStatic: true });
        //this.scene.matter.add.rectangle(750, 200, 16, 180, { isStatic: true });
    
        //  Now a body that shows off internal edges + convex hulls
       // const star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';
    
        //this.scene.matter.add.fromVertices(700, 500, star, { restitution: 0.5 }, true);
    
        //  Some different joint types
        //const body2 = this.scene.matter.add.circle(150, 250, 16);
        const body3 = this.scene.matter.add.circle(400, 450, 16);
        const body4 = this.scene.matter.add.circle(500, 50, 16);
        
        //  A spring, because length > 0 and stiffness < 0.9
       //// this.scene.matter.add.spring(body1, body2, 50, 0.051);

        //  A joint, because length > 0 and stiffness > 0.1
        //this.scene.matter.add.worldConstraint(body3, 140, 1, { pointA: { x: 400, y: 250 }});
    
        //  A pin, because length = 0 and stiffness > 0.1
       // this.scene.matter.add.worldConstraint(body4, 0, 1, { pointA: { x: 500, y: 50 }});
    
        //  Finally some random dynamic bodies
        /*for (let i = 0; i < 12; i++) {
            let x = Phaser.Math.Between(100, 700);
            let y = Phaser.Math.Between(100, 500);
    
            if (Math.random() < 0.5) {
                let sides = Phaser.Math.Between(3, 14);
                let radius = Phaser.Math.Between(8, 50);
    
                this.scene.matter.add.polygon(x, y, sides, radius, { restitution: 0.5 });
            } else {
                let width = Phaser.Math.Between(16, 128);
                let height = Phaser.Math.Between(8, 64);
    
                this.scene.matter.add.rectangle(x, y, width, height, { restitution: 0.5 });
            }
            console.log("Adding bodies: ", x, y)
        }*/
    
        this.scene.matter.add.mouseSpring();
        console.log("Added matter!")
    }
}