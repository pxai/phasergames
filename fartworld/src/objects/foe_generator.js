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
            return this.foes.every(foe => !foe.active);
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
            let fartCollider = this.scene.physics.add.overlap(fart, foe, () => { 
               //foe.anims.play("death");
                this.scene.updateScore(500); 
                foe.destroy();
            }, null, this.scene);
        });
   }
}
