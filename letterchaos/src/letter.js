import StarBurst from "./starburst";
import LETTERS from "./letters";

export default class Letter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "", demo = false) {
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
        this.body.setOffset(-2, -2)
        this.body.setVelocityY(Phaser.Math.Between(-100, 100));
        this.body.setVelocityX(Phaser.Math.Between(-100, 100));
        this.body.collideWorldBounds = true;
        this.add(new SingleLetter(this.scene, 0, 0, this.letter))
        this.letterLength = 1;
        this.change = 0;

        this.addSideColliders()

        this.left = null;
        this.right = null;
        this.setSize(44, 44)

        this.setInteractive();

        if (!demo)
            this.setDrag();
    }

    get length () {
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

        this.on('pointerdown', function (pointer) {
            if (pointer.rightButtonDown() && this.letterLength === 1 && this.change < 3) {
                const letter = this.getByName("SingleLetter");
                letter.setLetter(this.randomLetter())
                this.scene.playAudio("change");
                this.change++;
            } else if (pointer.rightButtonDown() && this.letterLength === 1 && this.change >= 3) {
                const letter = this.getByName("SingleLetter");
                letter.list[0].fillColor = 0xdddddd;
            } else if (pointer.rightButtonDown() && this.letterLength > 1) {
                this.scene.checkWord(this);
            } else {
                this.scene.playAudio("bump");
            }
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

    setColor (color) {
        this.square.setFillStyle(color);
    }

    joinLeft (leftContainer) {
        let leftCount = 0;
        leftContainer.reverse();
        leftContainer.iterate( singleLetter => {
            if (singleLetter.type === 'Container') {
                new StarBurst(this.scene, leftContainer.x, leftContainer.y - 50, "0xffffff", false)
                this.addAt(new SingleLetter(this.scene, -48 * this.letterLength, 0, singleLetter.letter), 0)
                this.letterLength++;
                this.leftCollider.x -= 48;
                leftCount++;
            }
        })


        this.body.setSize(48 * this.letterLength , 46)
        this.body.setOffset(-48 * (this.letterLength-1),0)
        this.input.hitArea.x -= 48 * leftCount;
        this.input.hitArea.setSize(48 * this.letterLength, 48)
    }

    joinRight (rightContainer) {
        rightContainer.iterate( singleLetter => {
            if (singleLetter.type === 'Container') {
                new StarBurst(this.scene, rightContainer.x, rightContainer.y - 50, "0xffffff", false)
                this.addAt(new SingleLetter(this.scene, 48 * this.letterLength, 0, singleLetter.letter), this.letterLength)
                this.letterLength++;
                this.rightCollider.x += 48;
            }
        })


        this.body.setSize(48 * this.letterLength , 46)
        this.input.hitArea.setSize(48 * this.letterLength, 48)
    }

    getWord () {
        let word = "";
        let points = 0;

        this.iterate( singleLetter => {
            if (singleLetter.type === 'Container') {
                word += singleLetter.letter['letter'];
                points += singleLetter.letter['points'];
            }
        })

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

    getFirstLetter () {
        return this.iterate( child => {
            if (child.type === 'Container') {
                return child.list[0];
            }
         });
    }

     clearWord () {
         let i = 0;
         this.iterate(child => {
            if (child.type === 'Container') {
                //(scene, x, y, color = "0xffffff", launch = false, multi = false)
                new StarBurst(this.scene, this.x + (i*48), this.y, "0xffffff", false, true)
            }
             child.destroy();
             i++;
         });
     }

     randomLetter () {
        const letters = LETTERS["en"];
        return letters[Phaser.Math.Between(0, letters.length - 1)];
    }
}

export class SingleLetter extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter = "") {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.letter = letter;
        this.name = "SingleLetter";

        this.squareBack = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 48, 48, 0xffffff).setOrigin(0.5)
        this.add(this.squareBack);

        this.square = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "letter").setOrigin(0.5);
        this.add(this.square);

        this.letterText = new Phaser.GameObjects.BitmapText(this.scene, 0, -4, "pixelFont", this.letter['letter'].toUpperCase(), 26).setTint(0x000000).setOrigin(0.5)
        this.add(this.letterText);

        this.letterPoints = new Phaser.GameObjects.BitmapText(this.scene, 0, 16, "pixelFont", this.letter['points'], 8).setTint(0x000000).setOrigin(0.5);
        this.add(this.letterPoints);
    }

    setLetter (letter) {
        this.letter = letter;
        this.letterText.setText(this.letter['letter']);
        this.letterPoints.setText(this.letter['points'])
    }
}
