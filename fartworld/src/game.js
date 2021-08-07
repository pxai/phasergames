import Player from './player';
import BeanGenerator from './objects/bean _generator';
import FoeGenerator from './objects/foe_generator';

export default class Game extends Phaser.Scene {
  constructor({key}) {
      super({key});
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
  }

  preload(){
      console.log("preload")
  }

  create () {
        this.width = this.sys.game.config.width
        this.height = this.sys.game.config.height
        // this.add.image(400, 300, 'sky');
       /* this.background = this.add.tileSprite(0, 0, this.width, this.height, "scene1");
        this.background.setOrigin(0, 0);*/

        this.platformsLayer = this.add.layer();
        this.beanGenerator = new BeanGenerator(this);
        this.foeGenerator = new FoeGenerator(this)
        this.player = new Player(this, 100, 400, 'grogu'); //this.physics.add.sprite(100, 450, 'dude');
        this.physics.world.setBoundsCollision(false, false, true, true)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  }


  update() {
   this.player.update();
       
  }


}
