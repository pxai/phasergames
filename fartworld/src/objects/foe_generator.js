import GreenPepper from "./green_pepper";
import Tomato from "./tomato";
import Avocado from "./avocado";
import Carrot from "./carrot";

export default class FoeGenerator {
    constructor (scene) {
        this.scene = scene;
        this.foes = [];
    }

    generate (foes, platforms) {
           const scene = this.scene;
           this.foes = foes.map(foe => {
               switch(foe.name) {
                   case "tomato": return new Tomato({ scene, ...foe })
                   case "greenpepper": return new GreenPepper({ scene, ...foe })
                   case "avocado": return new Avocado({ scene, ...foe })
                   case "carrot": return new Carrot({ scene, platforms,  ...foe })
               }
            });

           this.foes.forEach(foe => {
                console.log("Created: ", foe);
                this.scene.physics.world.on('worldbounds', (foe, up, down, left, right) => {
                   if (right) {
                      foe.setVelocityX(-100);
                   } else if (left) {
                      foe.setVelocityX(100);
                   }
               });
           });
       }

       update () {
           this.foes.forEach(foe => {
               if (foe) foe.update() 
            });
       }

       areAllDead () {
            return this.foes.every(foe => foe.dead);
       }

       destroy () {
           this.foes.forEach(foe => foe.destroy());
       }

       setFartCollider (fart) {
            this.foes.forEach(foe => { 
                let fartCollider = this.scene.physics.add.overlap(fart, foe, foe.farted, null, this.scene);
                foe.setFartCollider(fartCollider);
            });
       }

       setRedFartCollider (fart) {
            this.foes.forEach(foe => {
                this.scene.physics.add.overlap(fart, foe, foe.redFarted, null, foe);
            });
        }
}
