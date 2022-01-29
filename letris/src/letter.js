
export default class Letter extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, letter, points = 1, image = "letter") {
        super(scene, x, y, image);
        this.scene = scene;
        this.letter = letter;
        this.points = points;
        this.setOrigin(0.5);
        this.letterText = this.scene.add.bitmapText(x, y - 2, "pixelFont", letter, 25).setOrigin(0.5);
        this.letterPoints = this.scene.add.bitmapText(x, y + 16, "pixelFont", points, 8).setOrigin(0.5);
        this.posX = 3;
        this.posY = -2;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.scene.physics.add.existing(this.letterText);
        this.scene.physics.world.enable(this.letterText);
        this.scene.physics.add.existing(this.letterPoints);
        this.scene.physics.world.enable(this.letterPoints);
        this.letterText.body.setSize(1, 1);
        this.letterPoints.body.setSize(1, 1);
        this.body.setAllowGravity(false);
        this.letterText.body.setAllowGravity(false);
        this.letterPoints.body.setAllowGravity(false);
        this.scene.add.existing(this);

        this.init();
        this.fixed = false;
        this.passedTime = 0;
    }

    init () {

    }

    update (time, delta) {
        if (this.fixed) return;

        if (this.passedTime > 1000) {
            this.passedTime = 0;
            this.moveDown();
        } else {
            this.passedTime += delta;
        }
    }

    changeLetter () {
        const { letter, points } = this.scene.randomLetter();
        this.letter = letter;
        this.points = points;
        this.letterText.setText(letter);
        this.letterPoints.setText(points);
    }

    hitGround () {
        this.posY = 12;
        this.scene.addToBoard(this);
        this.fixed = true;
        this.stopIt();
    }

    hitLetter () {
        this.scene.addToBoard(this);
        this.fixed = true;
        this.stopIt();
    }

    stopIt () {
        this.body.immovable = true;
        this.body.moves = false;
        this.letterText.body.immovable = true;
        this.letterText.body.moves = false;
        this.letterPoints.body.immovable = true;
        this.letterPoints.body.moves = false;
    }

    release () {
        this.body.immovable = false;
        this.body.moves = true;
        this.letterText.body.immovable = false;
        this.letterText.body.moves = true;
        this.letterPoints.body.immovable = true;
        this.letterPoints.body.moves = false;
    }

    moveLeft () {
        if (this.posY < 0 || this.posX === 0) return;
        if (this.leftIsOccupied()) return;
        this.x -= 48;
        this.letterText.x -= 48;
        this.letterPoints.x -= 48;
        this.posX--;
    }

    leftIsOccupied () {
        return this.scene.board.positions[this.posY][this.posX - 1] !== null;
    }

    moveRight () {
        if (this.posY < 0 || this.posX === 6) return;
        if (this.rightIsOccupied()) return;
        this.x += 48;
        this.letterText.x += 48;
        this.letterPoints.x += 48;
        this.posX++;
    }

    rightIsOccupied () {
        return this.scene.board.positions[this.posY][this.posX + 1] !== null;
    }

    dashDown () {
        while(this.posY > -1 && this.posY < 12 && !this.downIsOccupied())
            this.moveDown();
    }

    moveDown () {
        if (this.posY > -1 && this.downIsOccupied() && this.posY < 12) {
            this.scene.hitLetter(this);
            return;
        }
        this.y += 48;
        this.letterText.y += 48;
        this.letterPoints.y += 48;
        this.posY++;
        if (this.posY === 12) this.scene.hitGround(this);
    }

    downIsOccupied () {
        console.log("Check: ", this.posY + 1, this.posX)
        return this.scene.board.positions[this.posY + 1][this.posX] !== null;
    }
}
