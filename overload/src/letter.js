export default class Letter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "") {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter;
        this.sticky = false;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setBounce(1);
        this.body.setSize(46, 46)
        this.body.setOffset(-4, -4)
        this.body.setVelocityY(Phaser.Math.Between(-100, 100));
        this.body.setVelocityX(Phaser.Math.Between(-100, 100));
        this.squareBack = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 48, 48, 0xffffff).setOrigin(0.5)
        this.add(this.squareBack);

        this.square = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "letter").setOrigin(0.5);
        this.add(this.square);

        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 0, -4, "pixelFont", this.letter['letter'].toUpperCase(), 26).setTint(0x000000).setOrigin(0.5)
        this.add(this.letterText);
        this.letterPoints = new Phaser.GameObjects.BitmapText(this.scene, 0, 16, "pixelFont", this.letter['points'], 8).setTint(0x000000).setOrigin(0.5);
        this.add(this.letterPoints);

        this.addSideColliders()

        this.left = null;
        this.right = null;
        this.setSize(44, 44)
        this.setInteractive();

        this.setDrag();
    }

    get length () {
        console.log("LEnght: ", this.getWord())
        return this.getWord().word.length;
    }

    setDrag() {
        this.scene.input.setDraggable(this);
    
        this.on('pointerover', function () {
            this.velocityX = this.body.velocity.x;
            this.velocityY = this.body.velocity.y;
        });
    
        this.on('pointerout', function () {

        });
    
        this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.changeSticky(true);
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.body.setVelocityX(0)
            gameObject.body.setVelocityY(0)
        });

        this.scene.input.on('dragend', function (pointer, gameObject) {
            gameObject.changeSticky(false);
            gameObject.body.setVelocityX(gameObject.velocityX);
            gameObject.body.setVelocityY(gameObject.velocityY);
        });
    }
    selectIt() {

    }

    addSideColliders() {
        this.leftCollider = new Phaser.GameObjects.Rectangle(this.scene, -24, 0, 4, 42, 0x00ff00).setOrigin(0.5)
        this.scene.physics.add.existing(this.leftCollider);
        this.leftCollider.body.setAllowGravity(false);
        this.add(this.leftCollider)
        this.scene.leftColliders.add(this.leftCollider);

        this.rightCollider = new Phaser.GameObjects.Rectangle(this.scene, 24, 0, 4, 42, 0xff0000).setOrigin(0.5)
        this.scene.physics.add.existing(this.rightCollider);
        this.rightCollider.body.setAllowGravity(false);
        this.add(this.rightCollider)
        this.scene.rightColliders.add(this.rightCollider);
    }

    disableIt (letter, right = true) {
        letter.removeInteractive();
        letter.body.setVelocity(0);
        letter.body.stop()
        letter.body.setBounce(1);
        letter.body.immovable = true;
        if (right) {
            letter.leftCollider.body.enable = false;
            letter.x = 48;
        } else {
            letter.rightCollider.body.enable = false;
            letter.x = -48;
        }
  
        letter.y = 0;
        //letter.body.enable = false;
    }

    setLetter (letter = "") {
        this.letterText.setText(letter);
    }

    setColor (color) {
        this.square.setFillStyle(color);
    }

    joinLeft (leftLetter) {
        const length = this.length;
        this.disableIt(leftLetter, false)
        this.add(leftLetter)
        this.left = leftLetter;
        leftLetter.right = this;
        this.leftCollider.body.enable = false;
        console.log("About to grow ength: ",  this.getWord(), length + 1)
        const parent = this.getRightParent();
        const left = this.getLeftParent();

        parent.body.setSize(46 * (length + 1) , 46)
        parent.body.setOffset(-(46 * length), 0);
        console.log("What is parent: ", parent, parent.input)
        // parent.input.hitArea.setTo(left.x - (46 * (length - 1)), left.y, 46 * (length + 1), 48)
        console.log("Size: ", parent.letter, left.letter, parent.x, parent.y, parent.body.width, parent.body.height)
    }

    joinRight (rightLetter) {
        const length = this.length;
        this.disableIt(rightLetter)
        this.add(rightLetter)
        this.right = rightLetter;
        rightLetter.left = this;
        this.rightCollider.body.enable = false;
        console.log("About to grow ength: ",  this.getWord(), length + 1)
        const parent = this.getLeftParent();
        const right = this.getRightParent();

        parent.body.setSize(48 * (length + 1) , 46)

        console.log("What is parent: ", parent, parent.input)
        
        // parent.input.hitArea.setTo(right.x - 48, right.y, 46 * (length + 1), 48)
        console.log("Size: ", parent.letter, right.letter, parent.x, parent.y, parent.body.width, parent.body.height)

    }

    getWord () {
        let word = "";
        let points = 0;
        let first = this;
        while (first.left !== null)
            first = first.left;

        while(first !== null) {
            word += first.letter['letter'];
            points += first.letter['points'];
            first = first.right;
        }
        console.log("Then: ", word, points);
        return {
            word,
            points
        };
    }

    changeSticky (value) {
        let first = this;
        while (first.left !== null)
            first = first.left;

        while(first !== null) {
            first.sticky = value;
            first = first.right;
        }
    }

    getRightParent () {
        let first = this;
        while (first.right !== null)
            first = first.right;

        return first;
     }

     getLeftParent () {
        let first = this;
        while (first.left !== null)
            first = first.left;

        return first;
     }
}
