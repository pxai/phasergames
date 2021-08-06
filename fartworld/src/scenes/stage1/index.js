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
        this.beanGenerator.generate(config.beans);
    }
  
  
    update() {
        super.update();
    }
  
}