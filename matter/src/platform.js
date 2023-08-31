export default class Platform extends Phaser.Physics.Matter.Sprite {
	/**
	 * 
	 * @param {Phaser.Scene} scene 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} texture 
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} options 
	 */
	constructor(scene, x, y, texture = "platform", options = {isStatic: true}) {
        options =  {
            isStatic: true,
            restitution: 0, // No bounciness
            friction: 0.1, // A little extra friction so the player sticks better
          }
		super(scene.matter.world, x, y, texture, 0, options)
        this.name = Phaser.Math.RND.pick(["verticalPlatform", "horizontalPlatform"]);
		scene.add.existing(this)

        if (this.name.startsWith("vertical")) this.moveVertically();
        else this.moveHorizontally();
	}

    moveHorizontally () {
        this.scene.tweens.add({
            targets: this,
            duration: 2000,
            yoyo: true,
            x: "-=200",
            repeat: -1
        })
    }

    moveVertically () {
        this.scene.tweens.add({
            targets: this,
            duration: 2000,
            yoyo: true,
            y: "-=200",
            repeat: -1
        })
        // this.scene.tweens.addCounter({
        //     from: 0,
        //     to: -300,
        //     duration: 1500,
        //     ease: Phaser.Math.Easing.Sine.InOut,
        //     repeat: -1,
        //     yoyo: true,
        //     onUpdate: (tween, target) => {
        //         const y = this.startY + target.value
        //         const dy = y - this.y
        //         this.y = y
        //         this.setVelocityY(dy)
        //     }
        // })
    }
}