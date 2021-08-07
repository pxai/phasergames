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
       /* const level = [
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            Array(20).fill(1),
            [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
          ];

          const map = this.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
  const tiles = map.addTilesetImage("scene1_tileset");
  const layer = map.createStaticLayer(0, tiles, 0, 0);
    this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

    
       // layer.setCollisionByExclusion([-1]);

        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.add.collider(this.player, layer);
        */

        this.tileMap = this.make.tilemap({ key: "scene1_map", tileWidth: 32, tileHeight: 32 });
        this.tileSet = this.tileMap.addTilesetImage("scene1_tileset");
        this.tileMapLayer = this.tileMap.createLayer("scene1", this.tileSet);
        debugger;
        //this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);


        this.beanGenerator.generate(config.beans);
        this.foeGenerator.generate(config.foes);
    }
  
  
    update() {
        super.update();
    }
  
}