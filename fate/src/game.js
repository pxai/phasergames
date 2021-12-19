import { Scene3D, ExtendedObject3D } from '@enable3d/phaser-extension' 
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
      this.number = data.number;
      this.time = data.time;

  }

    preload () {
    }

    create () {      
      this.bulletHell = new BulletHell();
      this.x = 0;
      // creates a nice scene
      this.third.warpSpeed()

      this.third.camera.position.set(0, 5, 20)
      this.third.camera.lookAt(0, 0, 0)

      // enable physics debugging
      this.third.physics.debug.enable()
      // adds a box
      // this.third.add.box({ x: 1, y: 2 })

      // adds a box with physics
      // this.third.physics.add.box({ x: -1, y: 2 })

      // throws some random object on the scene
      //this.third.haveSomeFun()
      //this.loadAudios(); 
      // this.playMusic();

      // add object3d (the monkey's name is object3d)
      // https://catlikecoding.com/unity/tutorials/basics/mathematical-surfaces/
      // https://github.com/enable3d/enable3d-website/blob/master/src/examples/first-phaser-game-3d-version.html
      this.third.load.gltf('/assets/objects/ship.glb').then(gltf => {
        // If you can, always use simple shapes like BOX, SPHERE, CONE etc.
        // The second most efficient shape is a COMPOUND, which merges multiple simple shapes.
        // Prefer HULL over CONVEX MESH.
        // HACD is the most expensive but also the most accurate.
        // If you need a concave shape, for a static or kinematic body, use CONCAVE MESH.

        // (mesh and convex are aliases for convexMesh)
        // (concave is an alias for concaveMesh)
        // (heightMap uses concaveMesh by default)
        // (extrude uses hacd by default)
        const object = new ExtendedObject3D()
        object.add(gltf.scene)
        //const object3d = gltf.scene.children[0]

        const shapes = ['box', 'compound', 'hull', 'hacd', 'convexMesh', 'concaveMesh']

        const material = this.third.add.material({ standard: { color: 0xcc0000, transparent: false, opacity: 1 } })


        // compound multiple simple shape together

        object.traverse(child => {
          if (child.isMesh && child.material.isMaterial) {
            child.material = material
          }
        })

        //shapes.forEach((shape, i) => { this.createObject(shape,i,  object3d) })
        this.ship = this.createObject("hull",0,  object)
      })

      this.cursor = this.input.keyboard.createCursorKeys();
    }

    createObject (shape, i, object3d) {
      const compoundShape = {
        compound: [
          // nose
          { shape: 'box', width: 0.5, height: 1, depth: 0.4, y: -0.5, z: 0.5 },
          // ears
          { shape: 'box', width: 2.4, height: 0.6, depth: 0.4, z: -0.4, y: 0.2 },
          // head back
          { shape: 'sphere', radius: 0.65, z: -0.25, y: 0.35 },
          // head front
          { shape: 'box', width: 1.5, height: 0.8, depth: 1, y: 0.2, z: 0.2 }
        ]
      }
      const boxShape = { shape: 'box', width: 2, height: 1.5, depth: 1.25 }
      const object = new ExtendedObject3D()

      object.add(object3d.clone())
      object.position.set(i, 1.2, 0)

      // we se addChildren to false since we do not want
      // to create a body from object3d's child meshes
      // (it would create a box 1x1x1 since no matching shape would be found)
      let options = { addChildren: false, shape }

      if (shape === 'box') options = { ...options, ...boxShape }
      else if (shape === 'compound') options = { ...options, ...compoundShape }

      this.third.add.existing(object)
      this.third.physics.add.existing(object, options)

      object.body.setLinearFactor(1, 1, 0)
      object.body.setAngularFactor(0, 0, 0)
      object.body.setFriction(20, 20, 20)

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
      this.generateBullet(time, delta)
      if (this.cursor.up.isDown) {
        console.log(this.ship, this.ship.body)
        this.ship.body.setVelocityY(5)
      } else if (this.cursor.down.isDown) {
        this.ship.body.setVelocityY(-5)
      } else if (this.cursor.left.isDown) {
        this.ship.body.setVelocityX(-5)
      } else if (this.cursor.right.isDown) {
        this.ship.body.setVelocityX(5)
      } 
      console.log(this.ship?.body)
    }

    generateBullet (time, delta) {
      const y = this.bulletHell.wave(this.x, time);
      console.log(this.x, y)
      let box = this.third.add.box({ x: this.x, y, height: 0.4, width: 0.4, depth: 0.4  })
      this.third.physics.add.existing(box);
      box.body.setVelocityZ(-15)
     this.x =  (this.x < 1000) ? this.x + 1 : 0; 
    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
