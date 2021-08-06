import Game from '../../game';
import config from './config';

export default class Stage1 extends Game {
    constructor() {
        super({key: "stage1"});
    }
  
    preload(){
        console.log("stage1")
    }
  
    create () {
        super.create();
        console.log(this.width, this.height);

        this.tileMap = this.make.tilemap({ key: "scene1_map", tileWidth: 32, tileHeight: 32 });
        this.tileSet = this.tileMap.addTilesetImage("scene1_tileset");
        this.tileMapLayer = this.tileMap.createLayer("platforms1", this.tileSet);
        //this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

        //this.tileMapLayer.setCollisionByExclusion([-1]);

        //this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

        this.beanGenerator.generate(config.beans);
        this.foeGenerator.generate(config.foes);
    }
  
  
    update() {
        super.update();
    }
  
}