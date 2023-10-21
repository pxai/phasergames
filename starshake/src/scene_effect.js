export default class SceneEffect {
    constructor (scene) {
        this.scene = scene;
   }

    /*

    */
   simpleClose (callback) {
    const rectangleWidth = this.scene.width/2;
    const rectangle1 = this.scene.add.rectangle(0 - rectangleWidth, 0, this.scene.width, this.scene.height, 0x000000).setOrigin(0.5, 0);

    this.scene.tweens.add({
         targets: rectangle1,
         duration: 500,
         x: { from: -rectangleWidth/2, to: rectangleWidth},
         onComplete: () => {
             callback();
         }
     });
    }

    /*

    */
    simpleOpen (callback) {
        const rectangleWidth = this.scene.width/2;
        const rectangle1 = this.scene.add.rectangle(rectangleWidth, 0, this.scene.width, this.scene.height, 0x000000).setOrigin(0.5, 0);

        this.scene.tweens.add({
             targets: rectangle1,
             duration: 500,
             x: { from: rectangleWidth, to: -rectangleWidth},
             onComplete: () => {
                 callback();
             }
         });
    }

    /*

    */
   close (callback) {
       const rectangleWidth = this.scene.width / 2;
       const rectangle1 = this.scene.add.rectangle(0 - rectangleWidth, 0, this.scene.width/2, this.scene.height, 0x000000).setOrigin(0.5, 0);
       const rectangle2 = this.scene.add.rectangle(this.scene.width, 0, this.scene.width/2, this.scene.height, 0x000000).setOrigin(0, 0);
       this.scene.tweens.add({
            targets: rectangle1,
            duration: 1000,
            x: { from: -rectangleWidth/2, to: rectangleWidth/2 }
        },{
            targets: rectangle2,
            duration: 1000,
            x: { from: this.scene.width, to: rectangleWidth },
            onComplete: () => {
                callback();
            }
        });
   }
}

