import { LEVELS, SCENES, OBJECTS, PLAYER, ENEMIES } from './constants';
import Player from './player';
import Enemies from './enemies';

export default class Scene1 extends Phaser.Scene
{
    constructor () {
        super('Scene1');
    }

    init () {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.points = 0;
    }

    preload () {
        this.load.image('logo', 'assets/phaser3-logo.png');
    }

    create () {
        console.log("Juegi!");
        const logo = this.add.image(400, 70, 'logo');
        const playText = this.add.text(
            50,
            this.height/2,
            'JUEGO',
            {fontSize:'32px', color:'#FFFFFF'});

        const pointsTxt = this.add.text(this.width/2, this.height/2, 'POINTS -', {fontSize:'32px', color:'#FFFFFF'}).setInteractive();

        pointsTxt.on('pointerdown', ()=>{
            this.points++
            this.registry.set('points', this.points);
            this.events.emit('updatePoints');
        });

        this.tileMap = this.make.tilemap({ key: LEVELS.SCENE1.TILEMAPJSON , tileWidth: 16, tileHeight: 16 });

        this.tileSet = this.tileMap.addTilesetImage(LEVELS.TILESET);

        this.tileMapLayer = this.tileMap.createLayer(LEVELS.SCENE1.LAYER, this.tileSet);
        this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
        this.tileMapLayer.setCollisionByExclusion([-1]);

        this.background = this
            .add
            .tileSprite(0,0,this.tileMap.widthInPixels, this.tileMap.heightInPixels, LEVELS.SCENE1.BACKGROUND)
            .setOrigin(0,0).setDepth(-1);

        this.anims.create({
            key: PLAYER.ANIM.IDLE,
            frames:this.anims.generateFrameNames (PLAYER.ID,{prefix: PLAYER.ANIM.IDLE + '-',
            end:11}),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: PLAYER.ANIM.RUN,
            frames: this.anims.generateFrameNames(PLAYER.ID,{
                prefix:PLAYER.ANIM.RUN + '-',
                end:11
            }),
            frameRate:20,
            repeat: -1
        });

        this.player = new Player({scene: this, x: 80, y: 80, texture: PLAYER.ID});
        this.cameras.main.startFollow(this.player);
        this.physics.add.collider(this.player, this.tileMapLayer);
        this.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

        let sampleObject = this.tileMap.createFromObjects("objectLayer", {name: "prize"})[0];
        this.physics.world.enable(sampleObject);
        sampleObject.body.setAllowGravity(false);
        sampleObject.setTexture(OBJECTS.BOX);
        sampleObject.body.setSize(40,50);

        this.physics.add.collider(this.player, sampleObject, () => {
            console.log("EEEEND!");
        });

        this.enemyGroup  = new Enemies(this, LEVELS.SCENE1.ENEMIES, ENEMIES.BUNNY.ID, ENEMIES.BUNNY.ANIM, ENEMIES.BUNNY.VELOCIDAD);

        this.physics.add.collider(this.enemyGroup, this.tileMapLayer);
    }

     update () {
        this.background.tilePositionY -= 0.4;
        this.background.tilePositionX += 0.4;
        this.player.update();
    }
}
