export default class Bubble extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, texture = "bubble", options = {isStatic: true}) {
		super(scene.matter.world, x, y, texture, 0, options)
        this.setFriction(1, 0, Infinity)
        this.name = Phaser.Math.RND.pick(["verticalPlatform", "horizontalPlatform"]);
        this.startX = x
        this.startY = y
        this.scene = scene;
		scene.add.existing(this)
        this.moveVertically()
       // if (this.name.startsWith("vertical")) this.moveVertically();
       // else this.moveHorizontally();
	}

    moveHorizontally () {
        this.scene.tweens.add({
            targets: this,
            scaleX: {from: 1, to: 0.9},
            yoyo: true,
            repeat: -1,
            duration: 200
        })
        this.scene.tweens.addCounter({
            from: 0,
            to: Phaser.Math.Between(-400, 400),
            duration: 3500,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween, target) => {
                const x = this.startX + target.value
                const dx = x - this.x
                this.x = x
                this.setVelocityX(dx)
            },
            onComplete: () => {
                this.scene.time.delayedCall(1000, () => { this.destroy() }, null, this)
            }
        })
    }

    moveVertically () {
        this.blob = this.scene.tweens.add({
            targets: this,
            scaleX: {from: 1, to: 0.9},
            yoyo: true,
            repeat: -1,
            duration: 200
        })
        this.scene.tweens.addCounter({
            from: 0,
            to: -300,
            duration: 4500,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween, target) => {
                const y = this.startY + target.value
                const dy = y - this.y
                this.y = y
                this.setVelocityY(dy)
            },
            onComplete: () => {
                this.blob.destroy();
                this.scene.time.delayedCall(1000, () => { this.destroy() }, null, this)
            }
        })
    }
}