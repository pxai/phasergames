import Scene1 from './scene1';

export default class Enemies extends Phaser.Physics.Arcade.Group {

    constructor(scene, nombreObjeto, idObjeto, animObjeto, velocidad){
        super(scene.physics.world, scene);

        this.scene = scene;
        this.velocidad=velocidad;

        this.addMultiple(this.scene.tileMap.createFromObjects(nombreObjeto, {name: idObjeto}));
        this.scene.physics.world.enable(this.children.entries);

        this.scene.anims.create({
            key: animObjeto,
            frames: idObjeto,
            frameRate: 20,
            repeat: -1
        });

        this.children.entries.forEach((foe) => {
            foe.body.setCollideWorldBounds(true);
            foe.body.setSize(30,30);
            foe.body.setOffset(0,10);
            foe.play(animObjeto);
            this.moveFoe((Phaser.Math.Between(0, 1) ? 'left' : 'right'), foe);
        });

    }

    moveFoe(direccion, foe) {
        if (direccion === 'left') {
            foe.body.setVelocityX(this.velocidad*-1);
            foe.flipX=false;
        } else if (direccion === 'right') {
            foe.body.setVelocityX(this.velocidad);
            foe.flipX=true;
        }
    }

    update() {
        this.children.entries.forEach((foe) => {
            if(foe.body.velocity.x === 0) {
                this.moveFoe((Phaser.Math.Between(0, 1) ? 'left' : 'right'), foe);
            }
            if (foe.body.blocked.right) {
                this.moveFoe('left', foe);
            } else if (foe.body.blocked.left) {
                this.moveFoe('right', foe);
            }
        });
    }
}
