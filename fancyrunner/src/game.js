class Game extends Phaser.Scene {
    constructor() {
        super("gameScreen");
    }
    preload (){
      this.load.image("guy", "./assets/images/guy.png")
    }
    create () {
      this.cameras.main.setBackgroundColor(0x000000);
      this.cameras.main.setBounds(0, 0, 400, 300);
   this.physics.world.setBoundsCollision(false, false, true, true)
      this.player = new Player(this); 
      this.cameras.main.startFollow(this.player);
    }
  
    update () {
      this.player.update();
    }
  
}
  
  class Player extends Phaser.GameObjects.Rectangle {
    constructor (scene) {
      super(scene, 40, 20, 32, 32, 0x00dd00)
      this.setOrigin(0.5)
      this.scene = scene;
      this.setPipeline('Custom')
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.collideWorldBounds = true;
      this.isFilled = false;
      this.isStroked = true;
      this.lineWidth = 5;
      this.strokeColor = 0x00dd00;
      this.cursor = this.scene.input.keyboard.createCursorKeys();
  
      this.time = 0.0;
      this.body.setVelocityY(500)
    }
  
    update() {
      customPipeline.setFloat1('time', this.time);
      this.time += 0.05;
  
         if (this.cursor.down.isDown) {
            this.body.setVelocityY(200);
          }
  
          else if (this.cursor.up.isDown) {
            this.body.setVelocityY(-200);
          }
  
         else if (this.cursor.right.isDown) {
             this.body.setVelocityX(200);
          }
  
         else if (this.cursor.left.isDown) {
            this.body.setVelocityX(-200);    
         } /*else {
            this.body.setVelocityX(0)
            this.body.setVelocityY(0)
          }*/
    }
  }
  