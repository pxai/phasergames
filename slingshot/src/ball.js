export default class Ball extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.name = "ball";
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(true);
    this.scene.add.existing(this);
    this.body.setBounce(0.5)
    this.body.setCircle(16)
    this.ball = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ball").setOrigin(0)
    this.circle = this.scene.add.circle(
      0,
      0,
      16,
      0xf22c2e
    ).setAlpha(1).setOrigin(0)
    this.add(this.ball)
    this.add(this.circle)
    this.init();
    this.setDrag()
  }
  /*
    Inits the animations for the bat and starts the movement. We also add a listener for the `animationcomplete` event.
    */
  init() {
    this.scene.anims.create({
      key: "ball",
      frames: this.scene.anims.generateFrameNumbers("ball", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.ball.anims.play("ball", true);
    this.scene.events.on("update", this.update, this);
   // this.on("animationcomplete", this.animationComplete, this);
  }

  setDrag() {
    this.scene.input.mouse.disableContextMenu();


    this.circle.setInteractive();
    this.scene.input.setDraggable(this.circle);

    this.dragging = false;


    this.on('pointerover', function () {
        this.velocityX = this.body.velocity.x;
        this.velocityY = this.body.velocity.y;
    });

    this.on('pointerout', function () {
      this.circle.setAlpha(1)
    });

    this.on('pointerdown', function (pointer) {
      this.circle.setAlpha(1)
    });

    this.scene.input.on('dragstart', function (pointer, gameObject) {

    });

    this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      this.dragging = true;
      if (length > 100) return;
      const length = this.addLine(this.body.x + dragX + 16, this.body.y + dragY + 16, this.body.x + 16, this.body.y + 16, 0xf22c2e)
      gameObject.x = dragX;
      gameObject.y = dragY;

    }.bind(this));

    this.scene.input.on('dragend', function (pointer, gameObject) {
      this.hitBall(pointer, gameObject)
      this.scene.playAudioRandomly("jump")
      this.line.destroy()
      gameObject.x = 0;
      gameObject.y = 0
    }.bind(this));
}

hitBall(pointer, gameObject) {
  // Calculate the direction of the line
  let directionX = this.x - pointer.upX;
  let directionY = this.y - pointer.upY;
  const {x1, y1, x2, y2} = this.lineCoordinates;
  let dx = x2 - x1;
  let dy = y2 - y1;

  // Normalize the direction
  let length = Math.sqrt((dx * dx) + (dy * dy));
  dx /= length;
  dy /= length;

  // Apply a velocity to the object in the direction of the line
  if (this.lineLength < 0 || this.lineLength > 100) this.lineLength = 100
  let speed = 5 * this.lineLength; // Adjust this value to change the speed
  this.body.setVelocity(dx * speed, dy * speed);
}

addLine (x1, y1, x2, y2, color) {
  if (this.line) this.line.destroy()
  const graphics = this.scene.add.graphics();
  graphics.lineStyle(4, color);
  this.line = graphics.lineBetween(x1, y1, x2, y2);
  this.scene.lineLayer.add(this.line)
    // Calculate the length of the line
    let dx = x2 - x1;
    let dy = y2 - y1;
  this.lineLength = Math.sqrt(dx * dx + dy * dy);
  this.lineCoordinates = {x1, y1, x2, y2}

  return this.lineLength
}

  update() {
    if (!this.active) return;
    if (this.body.blocked.down) {
      this.ball.anims.stop()
      this.body.setDrag(1000, 0);
    } else {
      this.body.setDrag(0, 0);
    }
    if (Phaser.Math.Between(0,10) > 9) {
      const bubble = this.scene.add.circle(this.x + 16, this.y + 16, 8, 0xf22c2e)
      this.scene.lineLayer.add(bubble)
      this.scene.tweens.add({
        targets: bubble,
        duration: 200,
        scale: {from: 1, to: 0},
        onComplete: () => { bubble.destroy()}
      })
    }
  }
}


