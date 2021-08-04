import Game from '../game';

export default class Stage1 extends Game {
    constructor() {
        super({key: "stage1"});
    }
  
    preload(){
        console.log("stage1")
    }
  
    create () {
        super.create();
    }
  
  
    update() {
        super.update();
    }
  
}