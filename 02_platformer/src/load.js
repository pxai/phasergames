import { LEVELS, FONTS, PLAYER, OBJECTS, ENEMIES } from './constants';

export default class Load extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    preload()  {
        this.cameras.main.setBackgroundColor(0x000000);
        this.createBars();

        this.load.on(
            'progress',
            function (value) {
              this.progressBar.clear();
              this.progressBar.fillStyle(0x125555, 1);
              this.progressBar.fillRect(
                this.cameras.main.width / 4,
                this.cameras.main.height / 2 - 16,
                (this.cameras.main.width / 2) * value,
                16
              );
            },
            this
        );

        //Mapas
        this.load.tilemapTiledJSON(LEVELS.SCENE1.TILEMAPJSON, 'assets/scenes/scene1.json');
        this.load.image(LEVELS.TILESET, 'assets/scenes/tileset.png');


        this.load.image(LEVELS.SCENE1.BACKGROUND, 'assets/images/Background/Green.png');

        this.load.on('complete', () => {
        //        const fontJSON = this.cache.json.get(FONTS.FONT.JSON);
        //       this.cache.bitmapFont.add(FONTS.FONT.IMAGE, Phaser.GameObjects.RetroFont.Parse(this, fontJSON));

                this.scene.start('Menu');
            },
            this
        );
        this.load.image('logo', 'assets/phaser3-logo.png');

        this.load.spritesheet(ENEMIES.BUNNY.ID, 'assets/images/enemies/bunny.png', { frameWidth: 34, frameHeight: 44 });
        this.load.spritesheet(ENEMIES.CHICKEN.ID, 'assets/images/enemies/chicken.png', { frameWidth: 32, frameHeight: 34 });
        this.load.spritesheet(ENEMIES.MUSHROOM.ID, 'assets/images/enemies/mushroom.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet(ENEMIES.RADISH.ID, 'assets/images/enemies/radish.png', { frameWidth: 30, frameHeight: 38 });

        this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");
        this.load.image(OBJECTS.BOX, 'assets/images/box.png');
        this.load.atlas(PLAYER.ID, 'assets/images/player/ninjafrog.png', 'assets/images/player/ninjafrog.json');
   }

    createBars() {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xffffff, 1);
        this.loadBar.fillRect(
          this.cameras.main.width / 4 - 2,
          this.cameras.main.height / 2 - 18,
          this.cameras.main.width / 2 + 4,
          20
        );
        this.progressBar = this.add.graphics();
    }
}
