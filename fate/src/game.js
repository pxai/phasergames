import { Scene3D, ExtendedObject3D, THREE } from '@enable3d/phaser-extension' 
import { Euler } from 'three';
import { random16 } from 'three/src/math/MathUtils';
import BulletHell from "./bullet_hell";

export default class Game extends Scene3D {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.accessThirdDimension({ gravity: { x: 0, y: 0, z: 0 } })
      this.name = data.name;
      this.elapsedTime = data.elapsedTime;
  }

    preload () {
    }

    create () {      
      this.bulletHell = new BulletHell();
      this.x = -500;
      // creates a nice scene
      this.third.warpSpeed()

      this.third.camera.position.set(0, 5, 20)
      this.third.camera.lookAt(0, 0, 0)
      this.particles = [];
      this.waves = [];
      this.addWave = this.time.addEvent({ delay: 3000, callback: this.addWave, callbackScope: this, loop: true });
      this.setCenters();
      // enable physics debugging
      this.third.physics.debug.enable()
      
      //this.loadAudios(); 
      // this.playMusic();

      // https://catlikecoding.com/unity/tutorials/basics/mathematical-surfaces/
      // https://github.com/enable3d/enable3d-website/blob/master/src/examples/first-phaser-game-3d-version.html
      this.third.load.gltf('/assets/objects/ship.glb').then(gltf => {

        const object = new ExtendedObject3D()
        object.add(gltf.scene)
        //const object3d = gltf.scene.children[0]

        const shapes = ['box', 'compound', 'hull', 'hacd', 'convexMesh', 'concaveMesh']

        const material = this.third.add.material({ standard: { color: 0xcc0000, transparent: false, opacity: 1 } })

        object.traverse(child => {
          if (child.isMesh && child.material.isMaterial) {
            child.material = material
          }
        })
        this.ship = this.createObject("convexMesh", 0,  object)
        this.setShipColliderWithParticles();
      })

      this.setScores();
      this.cursor = this.input.keyboard.createCursorKeys();
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    setCenters () {
      this.width = this.cameras.main.width;
      this.height = this.cameras.main.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
    }

    setScores() {
      this.deviationText = this.add.bitmapText(175, 30, "pixelFont", "Deviation: " + this.registry.get("deviation"), 30).setOrigin(0.5);
      this.probesText = this.add.bitmapText(this.width - 150, 30, "pixelFont", "Probes: " + this.registry.get("probes"), 30).setOrigin(0.5);
    }

    setShipColliderWithParticles () {
      this.ship.body.on.collision((otherObject, event) => {
        if (/particle/.test(otherObject.name)) {
          this.updateDeviation(1);
          console.log("HIT!!!", otherObject)
        }
      })
    }

    createObject (shape, i, object3d) {
      const object = new ExtendedObject3D()

      object.add(object3d.clone())
      object.position.set(i, 3, 10)
      object.rotation.set(0, Math.PI, 0)
      let options = { addChildren: false, shape }

      this.third.add.existing(object)
      this.third.physics.add.existing(object, options)

      object.body.setLinearFactor(0, 0, 0)
      object.body.setAngularFactor(1, 1, 0)
      object.body.setFriction(20, 20, 20)
      object.body.setCollisionFlags(0) // Dynamic body

      return object;
    }

      loadAudios () {
        this.audios = {
          "beam": this.sound.add("beam"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="game") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    update(time, delta) {
      //this.generateBullet(time, delta)
      if (this.ship && this.ship.body) {
        /*const direction = new THREE.Vector3()
        const rotation = this.third.camera.getWorldDirection(direction)
        const theta = Math.atan2(rotation.x, rotation.y)*/

        this.ship.body.setAngularVelocityZ(0)

        if (this.cursor.up.isDown) {
          console.log(this.ship, this.ship.body)
          this.ship.body.setVelocityY(5)
        } else if (this.cursor.down.isDown) {
          this.ship.body.setVelocityY(-5)
        } else if (this.cursor.left.isDown) {
          this.ship.body.setVelocityX(-5)
          this.ship.body.setAngularVelocityZ(1)
        } else if (this.cursor.right.isDown) {
          this.ship.body.setVelocityX(5)
          this.ship.body.setAngularVelocityZ(-1)
        } else if (this.W.isDown) {
          this.ship.body.setVelocityZ(-5)
        } else if (this.S.isDown) {
          this.ship.body.setVelocityZ(5)
        } else if (this.D.isDown) {
          console.log("DEW IT", this.ship)
          this.ship.setRotationFromEuler(new Euler(Math.PI, Math.PI/2, Math.PI))
        } else if (this.ship && this.ship.body) {
          this.ship.body.setVelocity(0, 0, 0);
          // this.ship.body.setAngularVelocityZ(0)
          this.ship.setRotationFromEuler(new Euler(Math.PI, Math.PI/2, Math.PI))
        }
    }
      //this.removeParticles()
    }

    addWave (start = -50, zed = false) {
      const wave = Array(100).fill(0).map((particle, i) => {
        const x = start + i;
        const y = this.bulletHell.wave(x,1000 + i);
        // let box = this.third.add.box({ x: this.x, y, height: 0.4, width: 0.4, depth: 0.4, z: start - this.x  })
        const box = this.third.add.sphere({ name: 'particle' + Math.random(), radius: 0.25, x, y, z: start - (zed ? this.x : 0 )  })
        this.third.physics.add.existing(box);
        this.particles.push(box);
        box.body.setVelocityZ(15)
        // console.log("Adding particle!! ", x, y, start);
        return box
      })

      this.waves.push(wave);
      this.time.delayedCall(4000, () => this.removeWave(), null, this);
    }

    removeWave () {
      console.log("About to remove: ", this.waves.length)
      const wave = this.waves.shift();
      wave.forEach((particle,i) => this.destroyParticle(particle,i));
    }

    generateBullet (time, delta, start = -100, zed = false) {
      const y = this.bulletHell.wave(this.x, time);
      // let box = this.third.add.box({ x: this.x, y, height: 0.4, width: 0.4, depth: 0.4, z: start - this.x  })
      const box = this.third.add.sphere({ name: 'particle' + Math.random(), radius: 0.25, x: this.x, y, z: start - (zed ? this.x : 0 )  })
      this.third.physics.add.existing(box);
      this.particles.push(box);
      box.body.setVelocityZ(15)
     this.x =  (this.x < 100) ? this.x + 1 : -100; 
    }

    destroyParticle(particle, i) {
      if (i === 0) console.log("Destroying particle: ", particle.name, particle)
      particle.userData.dead = true;
      particle.visible = false;
      this.third.physics.destroy(particle);
      particle = null;
    }

    removeParticlesFromGroup() {
      console.log("Removing dead particles START: ", this.particles.length)
      this.particles = this.particles.filter(particle => particle.visible)
      console.log("Removing dead particles END: ", this.particles.length)
    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("outro", {next: "underwater", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    updateDeviation (points = 0) {
        const deviation = +this.registry.get("deviation") + points;
        this.registry.set("deviation", deviation);
        this.deviationText.setText("Deviation: " + Number(deviation).toLocaleString());
    }

    updateProbes (points = 0) {
      const probes = +this.registry.get("probes") + points;
      this.registry.set("probes", probes);
      this.probesText.setText("Probes: " + Number(probes).toLocaleString());
  }
}
