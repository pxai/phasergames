import Coin from "./coin";
import { Particle, particleTypes } from "./particle";

export default class ParticlGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generate () {
        this.scene.time.addEvent({ 
            delay: 1000, 
            callback: () => { 
                let particle = new Particle(this.scene, Phaser.Math.Between(0, this.scene.width), 100)
                this.scene.particles[particle.type].add(particle)
                this.scene.playRandomizedAudio("spawn");
                this.addCoins();
                //let letter = new Letter(this.scene,this.scene.center_width, 128, this.randomLetter());
               // this.scene.playAudio("spawn");
                //new StarBurst(this.scene, letter.x, letter.y, "0xffffff", true, false)
            }, 
            callbackScope: this, 
            loop: true 
        });
    }

    addCoins () {
        if (Phaser.Math.Between(0, 5) > 4) {
            this.scene.coins.add(new Coin(this.scene, Phaser.Math.Between(0, this.scene.width), Phaser.Math.Between(0, this.scene.height)))
        }
    }


    randomParticle () {
    }

    update () {
        particleTypes.slice(0, -2).forEach(type => {
            this.scene.particles[type].children.entries.forEach( particle => {
                particle.update();
            })
        })
    }
}