import Foe from "./foe";

export default class FoeGenerator {
  constructor(scene){
    this.scene = scene;
    this.waveFoes = [];
    this.generate()
    this.activeWave = false;
}

  generate () {
    this.generateEvent1 = this.scene.time.addEvent({ delay: 7000, callback: () => this.orderedWave(), callbackScope: this, loop: true });
    this.generateEvent2 = this.scene.time.addEvent({ delay: 15000, callback: () => this.wave(), callbackScope: this, loop: true });
  }

  stop () {
    clearInterval(this.generationIntervalId);
    this.scene.foeGroup.children.entries.forEach(foe => {
        foe.destroy();
    });
  }

  createPath() {
    const start = Phaser.Math.Between(100, 600);
    this.path = new Phaser.Curves.Path(start, 0);

    this.path.lineTo(start, Phaser.Math.Between(20, 50));

    let max = 8;
    let h = 500/ max;

    for (let i = 0; i < max; i++) {
        if (i % 2 === 0){
            this.path.lineTo(start, 50 + h * (i + 1));
        } else {
            this.path.lineTo(start + 300, 50 + h * (i + 1));
        }
    }

    this.path.lineTo(start, this.scene.height + 50);
    this.graphics = this.scene.add.graphics();
    // this.graphics.lineStyle(1, 0xffffff, 1); // debug
  }

  orderedWave (difficulty = 5) {
    const x = Phaser.Math.Between(64, this.scene.width - 200);
    const y = Phaser.Math.Between(-100, 0)
    const minus = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

    Array(difficulty).fill().forEach((_, i) => this.addOrder(i,x, y, minus));
  }

  wave (difficulty = 5) {
    this.createPath();
    const x = Phaser.Math.Between(64, this.scene.width - 200);
    const y = Phaser.Math.Between(-100, 0)
    const minus = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

    Array(difficulty).fill().forEach((_, i) => this.addToWave(i));
    this.activeWave = true;
  }

  addOrder (i, x, y, minus) {
    const offset = minus * 70;

    this.scene.foeGroup.add(new Foe(this.scene, x + (i * 70) , (i * y) + offset, "foe0", 0, 300));
  }

  add () {
    const foe = new Foe(this.scene, Phaser.Math.Between(32, this.scene.width - 32), 0);
    this.scene.foeGroup.add(foe);
  }

  addToWave (i) {
    const foe = new Foe(this.scene, Phaser.Math.Between(32, this.scene.width - 32), 0, "foe0")
    this.scene.tweens.add({
      targets: foe,
      z: 1,
      ease: 'Linear',
      duration: 12000,
      repeat: -1,
      delay: i * 100
    }); 
    this
    this.scene.foeWaveGroup.add(foe);
  }

  update () {
    if (this.path) { 
      this.path.draw(this.graphics);

      this.scene.foeWaveGroup.children.entries.forEach(foe => {
        let t = foe.z;
        let vec = foe.getData('vector');

        this.path.getPoint(t, vec);
        foe.setPosition(vec.x, vec.y);
        foe.shadow.setPosition(vec.x + 20, vec.y + 20);
        foe.setDepth(foe.y);
      });

      if (this.activeWave && this.checkIfWaveDestroyed()) {
        this.activeWave = false;
        this.scene.spawnShake();
        this.path.destroy();
      }
    }

    this.scene.foeGroup.children.entries.forEach( foe => {
        if (foe.y > this.scene.height + 100) foe.destroy();
        foe.update();
    })
  }

  checkIfWaveDestroyed() {
    const foes = this.scene.foeWaveGroup.children.entries;

    return foes.length === foes.filter(foe => !foe.active).length;

  }
}