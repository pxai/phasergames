import { LEVELS, SCENES, PLAYER } from './constants';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    #scene;
    #cursorKeys;
    #wasdKeys;
    #spaceBar;

    constructor(config){
        super(config.scene, config.x, config.y, config.texture) ;

        this.#scene = config.scene;
        this.#scene.physics.world.enable(this);
        this.#scene.add.existing(this);

        this.body.setSize(20,30);
        this.setCollideWorldBounds(true);

        this.#cursorKeys = this.scene.input.keyboard.createCursorKeys();
        this.#wasdKeys = this.scene.input.keyboard.addKeys('W, A, S, D');
        this.#spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.play(PLAYER.ANIM.IDLE);
 }

  update () {

    if (this.#wasdKeys.A.isDown || this.#cursorKeys.left.isDown){
        this.setVelocityX(-200);
        if(this.body.blocked.down) { this.anims.play(PLAYER.ANIM.RUN, true); }
        this.flipX = true;
    }else if (this.#wasdKeys.D.isDown || this.#cursorKeys.right.isDown){
        this.setVelocityX(200);
        if(this.body.blocked.down) this.anims.play(PLAYER.ANIM.RUN, true);
        this.flipX = false;

    } else {
        this.setVelocityX(0);
        this.anims.play(PLAYER.ANIM.IDLE, true);
    }

    if ((this.#spaceBar.isDown || this.#wasdKeys.W.isDown || this.#cursorKeys.up.isDown) && this.body.blocked.down){
        this.setVelocityY(-300);
        this.anims.stop();
        this.setTexture(PLAYER.ID, PLAYER.ANIM.JUMP);
    }
 }
}
