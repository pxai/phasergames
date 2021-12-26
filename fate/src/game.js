import { Scene3D, ExtendedObject3D, THREE  } from '@enable3d/phaser-extension' 
import { ThreeGraphics } from '@enable3d/three-graphics';
import { Euler } from 'three';
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
      this.third.load.preload('stars', 'assets/images/stars.png')
      this.third.load.preload('nebulaset', 'assets/images/nebulaset.png')
      this.name = data.name;
      this.elapsedTime = data.elapsedTime;
  }

    preload () {
    }

    create () {      
      this.bulletHell = new BulletHell();
      this.x = -500;

      // creates a nice scene : remove -orbitControls
      this.third.warpSpeed("-ground", "-grid", "-sky", "-light");
      this.setLights();
      this.createBottom();
      this.third.camera.position.set(0, 0, 20)
      this.third.camera.lookAt(0, 0, 0)
      this.third.load.texture('nebulaset').then(sky => (this.third.scene.background = sky))
      this.particles = [];
      this.waves = [];
      this.remaining = 20000;
      this.addWaveEvent = this.time.addEvent({ delay: 3000, callback: this.addWave, callbackScope: this, loop: true });
      this.addClockEvent = this.time.addEvent({ delay: 50, callback: this.updateClock, callbackScope: this, loop: true });
      this.setCenters();
      // enable physics debugging
      //this.third.physics.debug.enable()      
      
      this.setNeutrinoStar();

      //this.loadAudios(); 
      // this.playMusic();

      // https://catlikecoding.com/unity/tutorials/basics/mathematical-surfaces/
      // https://github.com/enable3d/enable3d-website/blob/master/src/examples/first-phaser-game-3d-version.html
      this.createShip()

      this.setScores();
      this.cursor = this.input.keyboard.createCursorKeys();
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    }

    setLights() {
    // this.spot = this.third.lights.spotLight({ color: 'blue', angle: Math.PI / 8 })
      // this.spotHelper = this.third.lights.helper.spotLightHelper(this.spot)

      this.point = this.third.lights.pointLight({ color: 0x00ff7f, intensity: 2, distance: 10 })
      this.point.position.set(0, 5, 0)
      this.third.lights.helper.pointLightHelper(this.point)

      this.directional = this.third.lights.directionalLight({ intensity: 1 })
      this.directional.position.set(5, 5, 5)
      this.third.lights.helper.directionalLightHelper(this.directional)

       this.third.lights.hemisphereLight({ intensity: 0.7 })

       const d = 4
       this.directional.shadow.camera.top = d
       this.directional.shadow.camera.bottom = -d
       this.directional.shadow.camera.left = -d
       this.directional.shadow.camera.right = d
    }

    setNeutrinoStar() {
      this.star = this.third.add.sphere({ name: 'neutrinoStarBack', radius: 22, x: 0, y: 14.5, z: -150  },  { lambert: { color: 'white', transparent: true, opacity: 0.5 } })
      this.starFront = this.third.add.sphere({ name: 'neutrinoStarBack', radius: 17, x: 0, y: 12, z: -120  },  { lambert: { color: 'black', transparent: false } })
    }

    setCenters () {
      this.width = this.cameras.main.width;
      this.height = this.cameras.main.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
    }
    updateClock () {
      if (this.remaining < 0) {
        console.log("DROP PROBE!")
        this.remaining = 20000;
        this.releaseProbe();
      } else {
        this.nextDropText.setText("NEXT drop: " + this.remaining);
      }
      this.remaining -= 50;
    }

    createBottom() {
      this.third.load.texture('stars').then(grass => {
        grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
        grass.offset.set(0, 0)
        grass.repeat.set(2, 2)

        // BUG: To add shadows to your ground, set transparent = true
        this.ground = this.third.physics.add.ground({ width: 2000, height: 2000, y: -50 }, { phong: { map: grass, transparent: true } })
      })
    }

    releaseProbe () {
      this.updateProbes(-1);
      this.tweens.add({
        targets: this.probesText,
        duration: 400,
        alpha: {from: 0.5, to: 1},
        repeat: 5
      })  
    }

    setScores() {
      this.deviationText = this.add.bitmapText(175, 30, "pixelFont", "Deviation: " + this.registry.get("deviation"), 30).setOrigin(0.5);
      this.nextDropText = this.add.bitmapText(this.center_width - 100, 30, "pixelFont", "NEXT drop: " + this.remaining, 30).setOrigin(0.5);
      this.probesText = this.add.bitmapText(this.width - 150, 30, "pixelFont", "Probes: " + this.registry.get("probes"), 30).setOrigin(0.5);
    }

    createShip() {
      this.third.load.gltf('/assets/objects/ship.glb').then(gltf => {

        this.object = new ExtendedObject3D()
        this.object.add(gltf.scene)
        //const object3d = gltf.scene.children[0]

        const shapes = ['box', 'compound', 'hull', 'hacd', 'convexMesh', 'concaveMesh']

        const material = this.third.add.material({ standard: { color: 0xcc0000, transparent: false, opacity: 1 } })

        this.object.traverse(child => {
          if (child.isMesh && child.material.isMaterial) {
            child.material = material
          }
        })
        this.ship = this.createObject("convexMesh", 0, this.object)
        this.setShipColliderWithParticles();
      })
    }

    setShipColliderWithParticles () {
      this.ship.body.on.collision((otherObject, event) => {
        if (/particle/.test(otherObject.name)) {
          this.updateDeviation(1);
          this.cameras.main.shake(500);
          console.log("HIT!!!", otherObject)
          this.third.destroy(this.ship)
          this.ship = this.createObject("convexMesh", 0, this.object)
          this.setShipColliderWithParticles();
        }
      })
    }

    createObject (shape, i, object3d) {
      const object = new ExtendedObject3D()

      object.add(object3d.clone())
      object.position.set(i, 0, 10)
      object.rotation.set(0, Math.PI, 0)
      let options = { addChildren: false, shape }

      this.third.add.existing(object)
      this.third.physics.add.existing(object, options)

      object.body.setLinearFactor(0, 0, 0)
      object.body.setAngularFactor(1, 1, 0)
      object.body.setFriction(20, 20, 20)
      object.body.setCollisionFlags(0) // Dynamic body: 0, kinematic: 2

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
      this.currentTime = time;

      //this.generateBullet(time, delta)
      if (this.ship && this.ship.body) {
        let z = Math.abs(this.ship.position.z)
        this.ship.body.setAngularVelocityZ(0)
        if (this.cursor.up.isDown && this.ship.position.y < 6/(z/5)) {
          this.ship.body.setVelocityY(5)
        } else if (this.cursor.down.isDown && this.ship.position.y > -7/(z/5)) {
          this.ship.body.setVelocityY(-5)
        } else if (this.cursor.left.isDown && this.ship.position.x > -7/(z/6) ) {
          this.ship.body.setVelocityX(-5)
          this.ship.body.setAngularVelocityZ(0.5)
        } else if (this.cursor.right.isDown && this.ship.position.x < 7/(z/6)) {
          this.ship.body.setVelocityX(5)
          this.ship.body.setAngularVelocityZ(-0.5)
        } else if (this.W.isDown && this.ship.position.z > 7) {
          this.ship.body.setVelocityZ(-5)
        } else if (this.S.isDown && this.ship.position.z < 15) {
           this.ship.body.setVelocityZ(5)
        } else if (this.ship && this.ship.body) {
          this.ship.body.setVelocity(0, 0, 0);
          this.ship.setRotationFromEuler(new Euler(Math.PI, Math.PI/2, Math.PI))
        }
      }

      if (this.ground) {
        this.ground.setRotationFromEuler(new Euler(0, 0, 1))
      }

      if (this.point) {
        // this.third.lights.hemisphereLight({ intensity: 1 / Math.sin(time * 3) })
        this.star.material.opacity = 0.5 / Math.sin(time * 3);
        // this.starBack.position.set(Math.sin(time) * 2 - 8, 8, 2)
        //this.starBack.target.position.set(-85 + Math.sin(time), 15 + Math.sin(time), -150 + Math.sin(time))
        //this.starBack.target.updateMatrixWorld()
       // this.pointLightHelper.update()

        //this.starBack.position.set(Math.cos(time * 2), Math.sin(time * 3) * 3 + 3.1, Math.cos(time * 1.5))
      }
    }

    addWave (start = -50, zed = false) {
      const {f1, f2, c} = this.applyFunctionsInterval();
      for (let j = 0; j < c; j++) {
        let waveFunction = this.bulletHell.functions[Phaser.Math.Between(f1, f2)];
        let randomHeight = Phaser.Math.Between(-10, 10);
        let wave = Array(100).fill(0).map((particle, i) => {
          let x = start + i;
          let y = waveFunction(x, 16 * i, randomHeight);
  
          let box = this.third.add.sphere({ name: 'particle' + Math.random(), radius: 0.25, x, y, z: start - (zed ? x : 0 )  },  { lambert: { color: 0xffffff } })
          //this.box.set
          this.third.physics.add.existing(box);
          this.particles.push(box);
          box.body.setVelocityZ(15)
          // console.log("Adding particle!! ", x, y, start);
          return box
        })
  
        this.waves.push(wave);
        this.time.delayedCall(4000, () => this.removeWave(), null, this);
      }
    }

    applyFunctionsInterval() {
      return {
        "20": {f1: 0, f2: 3, c: 3},
        "19": {f1: 4, f2: 4, c: 2},
        "18": {f1: 0, f2: 3, c: 3},
        "17": {f1: 0, f2: 3, c: 3},
        "16": {f1: 0, f2: 3, c: 3},
        "15": {f1: 0, f2: 3, c: 3},
        "14": {f1: 0, f2: 3, c: 3},
        "13": {f1: 0, f2: 3, c: 3},
        "12": {f1: 0, f2: 3, c: 3},
        "11": {f1: 0, f2: 3, c: 3},
        "10": {f1: 0, f2: 3, c: 3},
        "9": {f1: 0, f2: 3, c: 3},
        "8": {f1: 0, f2: 3, c: 3},
        "7": {f1: 0, f2: 3, c: 3},       
        "6": {f1: 0, f2: 3, c: 3},
        "5": {f1: 0, f2: 3, c: 3},
        "4": {f1: 0, f2: 3, c: 3},
        "3": {f1: 0, f2: 3, c: 3},
        "2": {f1: 0, f2: 3, c: 3},
        "1": {f1: 0, f2: 3, c: 3},
        "0": {f1: 0, f2: 3, c: 3},
      }[this.registry.get("probes")]
    }


    removeWave () {
      const wave = this.waves.shift();
      wave.forEach((particle,i) => this.destroyParticle(particle,i));
    }

    destroyParticle(particle, i) {
      particle.userData.dead = true;
      particle.visible = false;
      this.third.physics.destroy(particle);
      particle = null;
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
