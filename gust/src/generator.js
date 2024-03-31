export default class Generator {
    constructor(scene) {
        this.scene = scene;
        this.scene.time.delayedCall(2000, () => this.init(), null, this);
        this.pinos = 0;
    }

    init() {
        this.generateCloud();
        this.generatePino();
        this.generateBatido();
        this.generateGuinxu();
    }

    generateCloud () {
        new Nube(this.scene)
        this.scene.time.delayedCall(Phaser.Math.Between(2000, 3000), () => this.generateCloud(), null, this);
    }

    generatePino () {
        this.scene.pinos.add(new Pino(this.scene, 800, this.scene.height - 32))
        this.scene.time.delayedCall(Phaser.Math.Between(2500, 3500), () => this.generatePino(), null, this);
    }

    generateGuinxu (first = 0) {
        if (first !== 0) { 
            this.scene.guinxus.add(new Guinxu(this.scene))
        }

        this.scene.time.delayedCall(Phaser.Math.Between(10450, 14105), () => this.generateGuinxu(1), null, this);
    }

    generateBatido (first = 0) {
        if (first !== 0) { 
            this.scene.batidos.add(new Batido(this.scene, 800, this.scene.height - 32))
        }
        this.scene.time.delayedCall(Phaser.Math.Between(5500, 6500), () => this.generateBatido(1), null, this);
    }
}

class Nube extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        const finalX = 800;
        const finalY = y || Phaser.Math.Between(0, 100);
        super(scene, finalX, finalY, "nube")
        scene.add.existing(this)
        const alpha = 1/Phaser.Math.Between(1, 3)

        // this.setAlpha(alpha)
        this.setScale(alpha)
       this.init();
    }

    init(){
        this.scene.tweens.add({
            targets: this,
            x: {from: 800, to: -100},
            duration: 2000 / this.scale,
            onComplete: () => { this.destroy()  }
        })
    }
}

class Pino extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "pino")
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        const alpha = 1/Phaser.Math.Between(1, 3)

        this.init();
    }
    
    init(){
        this.scene.tweens.add({
            targets: this,
            x: {from: 820, to: -100},
            duration: 2000,
            onComplete: () => { this.destroy()  }
        })
    }
}

class Guinxu extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, 820, Phaser.Math.Between(0, 100), "guinxu")
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.init();
    }
    
    init(){
        this.scene.tweens.add({
            targets: this,
            x: {from: 820, to: -100},
            duration: 2000,
            onComplete: () => { this.destroy()  }
        })
    }
}

class Batido extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "batido")
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        const alpha = 1/Phaser.Math.Between(1, 3)

        this.init();
    }
    
    init(){
        this.scene.tweens.add({
            targets: this,
            x: {from: 820, to: -100},
            duration: 2000,
            onComplete: () => { this.destroy()  }
        })
    }
}


