import { Scene3D, ExtendedObject3D, THREE  } from '@enable3d/phaser-extension'
import { ThreeGraphics } from '@enable3d/three-graphics';
import { Euler } from 'three';
import BulletHell from "./bullet_hell";
import Lightning from "./lightning";

export default class Game extends Scene3D {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

  /*

  */
    init (data) {
      this.accessThirdDimension({ gravity: { x: 0, y: 0, z: 0 } })
      this.third.load.preload('stars', 'assets/images/stars.png')
      this.third.load.preload('nebulaset', 'assets/images/nebulaset.png')
      this.name = data.name;
      this.elapsedTime = data.elapsedTime;
  }

    preload () {
    }

  /*

  */
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
      //enable physics debugging
      //this.third.physics.debug.enable()
      this.setLightning();
      this.setNeutrinoStar();

      this.loadAudios();
      // this.playMusic();

      // https://catlikecoding.com/unity/tutorials/basics/mathematical-surfaces/
      // https://github.com/enable3d/enable3d-website/blob/master/src/examples/first-phaser-game-3d-version.html
      this.prepareShip()

      this.setScores();
      this.cursor = this.input.keyboard.createCursorKeys();
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.playAudio("voice_start")
    }

  /*

  */
    setLightning () {
      this.lightsOut = this.add.rectangle(0, 40, this.width, this.height + 100, 0x0).setOrigin(0)
      this.lightsOut.setAlpha(0);
      this.lightningEffect = this.add.rectangle(0, 40, this.width, this.height + 100, 0xffffff).setOrigin(0)
      this.lightningEffect.setAlpha(0);
      this.lightning = new Lightning(this);
    }

  /*

  */
    setLights() {
      this.spot = this.third.lights.spotLight({ color: 'blue', angle: Math.PI / 8 })
      // this.spotHelper = this.third.lights.helper.spotLightHelper(this.spot)

      this.directional = this.third.lights.directionalLight({ intensity: 0.5 })
      this.directional.position.set(5, 5, 5)
      //this.third.lights.helper.directionalLightHelper(this.directional)

       this.third.lights.hemisphereLight({ intensity: 0.7 })

       const d = 4
       this.directional.shadow.camera.top = d
       this.directional.shadow.camera.bottom = -d
       this.directional.shadow.camera.left = -d
       this.directional.shadow.camera.right = d
    }

  /*

  */
    setNeutrinoStar() {
      // this.addRings();
      this.torus = this.addRing(0);
      this.proximity = 0;
      this.star = this.third.add.sphere({ name: 'neutrinoStarBack', radius: 22, x: 0, y: 14.5, z: -150  },  { lambert: { color: 0xFFFFE0, transparent: true, opacity: 0.5 } })
      this.third.physics.add.existing(this.star);
      this.star.body.setCollisionFlags(2)
      this.starFront = this.third.add.sphere({ name: 'neutrinoStarBack', radius: 17, x: 0, y: 12, z: -120  },  { lambert: { color: 'black', transparent: false } })
      this.third.physics.add.existing(this.starFront);
      this.starFront.body.setCollisionFlags(2)
    }

  /*

  */
    addRings() {
      this.rings = Array(20).fill(0).map((ring, i) => {
        this.addRing(i);
      })
    }

  /*

  */
    addRing(i) {
      let torus = this.third.add.cylinder({x: 0, y: 12, z: -120, height: 1, radiusSegments: 200, radiusBottom: 75 * (i+1), radiusTop: 75 * (i+1)}, { lambert: { color: 0xFFFFE0, transparent: true, opacity: 0.8 } })
      //let torus = this.third.add.torus({ x: 0, y: 12, z: -120, radius: 75 * (i+1), tubularSegments: 200, tube: 0.4 }, { lambert: { color: 0xFFFFE0, transparent: true, opacity: 1 } })
      torus.rotation.set(0.1, 0, 0)
      this.third.physics.add.existing(torus, { shape: 'hacd' })
      torus.body.setCollisionFlags(6)

      return torus;
    }

  /*

  */
    setCenters () {
      this.width = this.cameras.main.width;
      this.height = this.cameras.main.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
    }

  /*

  */
    updateClock () {
      if (this.remaining < 0) {
        this.remaining = 20000;
        this.releaseProbe();
      } else {
        this.nextDropText.setText("NEXT DROP: " + this.remaining);
      }
      this.remaining -= 50;
    }

  /*

  */
    createBottom() {
      this.third.load.texture('stars').then(grass => {
        grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
        grass.offset.set(0, 0)
        grass.repeat.set(2, 2)

        // BUG: To add shadows to your ground, set transparent = true
        this.ground = this.third.physics.add.ground({ width: 2000, height: 2000, y: -50 }, { phong: { map: grass, transparent: true } })
      })
    }

  /*

  */
    releaseProbe () {
      this.updateProbes(-1);
      this.tweens.add({
        targets: this.probesText,
        duration: 400,
        alpha: {from: 0.5, to: 1},
        repeat: 5
      })
    }

  /*

  */
    setScores() {
      this.deviationText = this.add.bitmapText(175, 30, "computer", "DEVIATION: " + this.registry.get("deviation"), 30).setTint(0x03A062).setOrigin(0.5);
      this.nextDropText = this.add.bitmapText(this.center_width, 30, "computer", "NEXT DROP: " + this.remaining, 30).setTint(0x03A062).setOrigin(0.5);
      this.probesText = this.add.bitmapText(this.width - 150, 30, "computer", "PROBES: " + this.registry.get("probes"), 30).setTint(0x03A062).setOrigin(0.5);
    }

  /*

  */
    prepareShip() {
      this.third.load.gltf('./assets/objects/ship.glb').then(gltf => {

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
        this.ship = this.createShip("convexMesh", 0, this.object)
        this.setShipColliderWithParticles();
      })
    }

  /*

  */
    setShipColliderWithParticles () {
      this.ship.body.on.collision((otherObject, event) => {
        if (/particle/.test(otherObject.name)) {
          this.updateDeviation(1);
          this.cameras.main.shake(500);
          this.playAudio(`hit${Phaser.Math.Between(1, 4)}`);
          this.third.destroy(this.ship)
          this.ship = this.createShip("convexMesh", 0, this.object)
          this.setShipColliderWithParticles();
        }
      })
    }

  /*

  */
    createShip (shape, i, object3d) {
      this.left = false;
      const object = new ExtendedObject3D()

      object.add(object3d.clone())
      object.position.set(i, -2, 10)
      object.rotation.set(0, Math.PI, 0)

      let options = { addChildren: false, shape }

      this.third.add.existing(object)
      this.third.physics.add.existing(object, options)
      object.body.needUpdate = true
      object.body.setLinearFactor(0, 0, 0)
      object.body.setAngularFactor(1, 1, 0)
      object.body.setFriction(20, 20, 20)
      object.body.setCollisionFlags(2) // Dynamic body: 0, kinematic: 2

      return object;
    }

  /*

  */
      loadAudios () {
        this.audios = {
          "thunder0": this.sound.add("thunder0"),
          "thunder1": this.sound.add("thunder1"),
          "thunder2": this.sound.add("thunder2"),
          "thunder3": this.sound.add("thunder3"),
          "passby0": this.sound.add("passby0"),
          "passby1": this.sound.add("passby1"),
          "shot": this.sound.add("shot"),
          "hit1": this.sound.add("hit1"),
          "hit2": this.sound.add("hit2"),
          "hit3": this.sound.add("hit3"),
          "hit4": this.sound.add("hit4"),
          "voice_start": this.sound.add("voice_start"),
          "voice_drop": this.sound.add("voice_drop"),
          "voice_hit": this.sound.add("voice_hit"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

  /*

  */
      playRandom(key) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0
        });
      }

  /*

  */
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

  /*

  */
    update(time, delta) {
      this.currentTime = time;

      //this.generateBullet(time, delta)
      if (this.ship && this.ship.body) {
        let {x, y, z} = this.ship.position;
        //this.ship.body.setAngularVelocityZ(0)
        if (this.cursor.up.isDown && this.ship.position.y < 6/(z/5)) {
          y = y + 0.1;
          this.createWingTrails();
        }  else if (this.cursor.down.isDown && this.ship.position.y > -7/(z/5)) {
          y = y - 0.1;
          this.createWingTrails();
        }

        if (this.cursor.left.isDown && this.ship.position.x > -7/(z/6) ) {
          x = x - 0.1;
          this.ship.rotation.set(0, Math.PI, -0.2)
          this.createWingTrails(true);
        }  else if (this.cursor.right.isDown && this.ship.position.x < 7/(z/6)) {
          x = x + 0.1;
          this.ship.rotation.set(0, Math.PI, 0.2);
          this.createWingTrails(false);
        }

        if (!this.cursor.right.isDown && !this.cursor.left.isDown) {
          this.ship.rotation.set(0, Math.PI, 0);
        }

        if (this.W.isDown && this.ship.position.z > 7) {
          this.ship.position.set(x, y, z - 0.1)
          z = z - 0.1;
        } else if (this.S.isDown && this.ship.position.z < 15) {
          this.ship.position.set(x, y, z + 0.1)
          z = z + 0.1;
        }

        this.ship.position.set(x, y, z)
        this.ship.body.needUpdate = true
        this.createTrail();
      }

      if (this.ground) {
        this.ground.setRotationFromEuler(new Euler(0, 0, 1))
      }

      if (this.star) {
        this.star.material.opacity = 0.5 / Math.sin(time * 3);
        let offset = Math.sin(time)/10
        this.starFront.position.set(
          this.starFront.position.x + offset,
          this.starFront.position.y + offset,
          this.starFront.position.z + offset + this.proximity,
        )
        this.starFront.rotation.set(0, time, 0)

        this.starFront.body.needUpdate = true

        this.star.position.set(
          this.star.position.x + offset,
          this.star.position.y + offset,
          this.star.position.z + offset + this.proximity,
        )

        this.star.body.needUpdate = true
        this.proximity += 0.000001;

        this.torus.rotation.set(0.1, delta, 0)
        this.torus.position.set(
          this.torus.position.x,
          this.torus.position.y,
          this.star.position.z + this.proximity,
        )
        this.torus.body.needUpdate = true

      }
    }

  /*

  */
    createTrail() {
      const color = Phaser.Math.Between(-1, 1) > 0 ? 0xADD8E6 : 0xffffff;
      const trail = this.third.add.box({ x: this.ship.position.x, y: this.ship.position.y + 0.3, z: this.ship.position.z + 1, width: 0.2, height: 0.2, depth: 0.2 },  { lambert: { color, transparent: true, opacity: 0.4 } })
      this.third.physics.add.existing(trail);
      trail.body.setVelocityZ(15)
      this.tweens.add({
        targets: trail,
        duration: 600,
        scale: {from: 1, to: 0},
        repeat: 1,
        onComplete: () => {
          this.destroyParticle(trail)
        }
      })
    }

  /*

  */
    createWingTrails(toTheLeft = null) {
      const color = Phaser.Math.Between(-1, 1) > 0 ? 0xADD8E6 : 0xffffff;
      const [m1, m2] = toTheLeft  === null ? [0, 0] : (toTheLeft ? [-0.3, 0.3] : [0.3, -0.3]);

      const trail1 = this.third.add.box({ x: this.ship.position.x + 1.3, y: this.ship.position.y + 0.5 + m2, z: this.ship.position.z + 0.5, width: 0.05, height: 0.05, depth: 0.05 },  { lambert: { color, transparent: true, opacity: 0.4 } })
      const trail2 = this.third.add.box({ x: this.ship.position.x - 1.3, y: this.ship.position.y + 0.5 + m1, z: this.ship.position.z + 0.5, width: 0.05, height: 0.05, depth: 0.05 },  { lambert: { color, transparent: true, opacity: 0.4 } })

      this.third.physics.add.existing(trail1);
      this.third.physics.add.existing(trail2);
      trail1.body.setVelocityZ(15)
      trail2.body.setVelocityZ(15)
      this.tweens.add({
        targets: [trail1, trail2],
        duration: 600,
        scale: {from: 1, to: 0},
        repeat: 1,
        onComplete: () => {
          this.destroyParticle(trail1)
          this.destroyParticle(trail2)
        }
      })
    }

  /*

  */
    addWave (start = -25, zed = false) {
      this.lightning.lightning();
      const {f1, f2, c} = this.applyFunctionsInterval();

      for (let j = 0; j < c; j++) {
        let waveFunction = this.bulletHell.functions[Phaser.Math.Between(f1, f2)];
        let randomHeight = Phaser.Math.Between(-10, 10);
        let color = Phaser.Math.Between(0x111111, 0xffffff);
        let wave = Array(50).fill(0).map((particle, i) => {
          let x = start + i;
          let y = waveFunction(x, 16 * i, randomHeight);

          let box = this.third.add.sphere({ name: 'particle' + Math.random(), radius: 0.25, x, y, z: start - (zed ? x : 0 )  },  { lambert: { color } })
          //this.box.set
          this.third.physics.add.existing(box);
          this.particles.push(box);
          box.body.setVelocityZ(15)

          return box
        })
        this.playAudio("shot")

        this.waves.push(wave);
        this.time.delayedCall(4000, () => this.playRandom("passby" + Phaser.Math.Between(0, 1)), null, this)
        this.time.delayedCall(6000, () => this.removeWave(), null, this);
      }
    }

  /*

  */
    applyFunctionsInterval() {
      return {
        "20": {f1: 0, f2: 3, c: 3},
        "19": {f1: 0, f2: 4, c: 3},
        "18": {f1: 0, f2: 3, c: 4},
        "17": {f1: 0, f2: 3, c: 5},
        "16": {f1: 0, f2: 3, c: 6},
        "15": {f1: 0, f2: 3, c: 6},
        "14": {f1: 0, f2: 3, c: 6},
        "13": {f1: 0, f2: 3, c: 6},
        "12": {f1: 0, f2: 4, c: 4},
        "11": {f1: 0, f2: 4, c: 4},
        "10": {f1: 0, f2: 4, c: 4},
        "9": {f1: 0, f2: 4, c: 5},
        "8": {f1: 0, f2: 4, c: 5},
        "7": {f1: 0, f2: 5, c: 4},
        "6": {f1: 0, f2: 5, c: 5},
        "5": {f1: 0, f2: 5, c: 5},
        "4": {f1: 0, f2: 5, c: 6},
        "3": {f1: 0, f2: 6, c: 5},
        "2": {f1: 0, f2: 6, c: 5},
        "1": {f1: 0, f2: 6, c: 6},
        "0": {f1: 0, f2: 6, c: 6},
      }[this.registry.get("probes")]
    }


  /*

  */
    removeWave () {
      const wave = this.waves.shift();
      wave.forEach((particle) => this.destroyParticle(particle));
    }

  /*

  */
    destroyParticle(particle) {
      particle.userData.dead = true;
      particle.visible = false;
      this.third.physics.destroy(particle);
      particle = null;
    }

    finishScene (name = "outro") {
      //this.sky.stop();
      //this.theme.stop();
      this.scene.start(name, {next: "underwater", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

  /*

  */
    updateDeviation (points = 0) {
        const deviation = +this.registry.get("deviation") + points;
        this.registry.set("deviation", deviation);
        this.playAudio("voice_hit")
        this.deviationText.setText("DEVIATION: " + Number(deviation).toLocaleString());
        if (deviation === 10) {
          this.finishScene("game_over")
        }
    }

  /*

  */
    updateProbes (points = 0) {
      const probes = +this.registry.get("probes") + points;
      this.registry.set("probes", probes);
      this.playAudio("voice_drop")
      this.probesText.setText("PROBES: " + Number(probes).toLocaleString());
      if (probes === 0) {
        this.finishScene("outro")
      }
  }
}
