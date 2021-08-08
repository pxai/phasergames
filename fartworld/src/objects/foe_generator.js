import Foe from "./foe";

export default class FoeGenerator {
    constructor (scene) {
        this.scene = scene;
        this.foes = [];
    }

    generate (foes) {
           const scene = this.scene;
           this.foes = foes.map(foe => new Foe({ scene, ...foe }));

           this.foes.forEach(foe => {
                this.scene.physics.world.on('worldbounds', (foe, up, down, left, right) => {
                   if (right) {
                     console.log("Right!!");
                      foe.setVelocityX(-100);
                     //foe.x -= 5;
                   } else if (left) {
                      console.log("Left!");
                      foe.setVelocityX(100);
                     //foe.x += 5;
                   }

                   // console.log("New velocity",foe.velocity.x);
               });
           });
       }

       update () {
           this.foes.forEach(foe => { foe.update() });
       }

       destroy () {
           this.foes.forEach(foe => foe.destroy());
       }
}
