

export default class Utils {
    constructor (scene) {
        this.scene = scene;
    }

    typeText(text, font, x, y = 150, tint = 0xffffff, size = 40) {
        this.characters = [];
        let jump = 0;
        let line = 0;
        let last = 0;
        text.split("").forEach( (character, i) => {
            if (character === "\n") { jump++; line = 0 }
            last = i;
            this.characters.push(this.scene.add.bitmapText(x - 350 + (line++ * 25), 150 + (jump * size / 1.3), font, character, size).setTint(tint).setAlpha(0))
        })
        const ending = this.scene.add.rectangle(x - 335 + (line * 25), 175 + (jump * size / 1.3), 25, 5, 0xcccccc).setOrigin(0.5).setAlpha(0)
        const timeline = this.scene.tweens.createTimeline();

        this.characters.forEach( (character, i) => {
            timeline.add({
                targets: character,
                alpha: { from: 0, to: 0.5},
                duration: 100,
            })
        })
        timeline.add({
            targets: ending,
            alpha: { from: 0, to: 0.8},
            duration: 200,
            repeat: -1,
            yoyo: true
        })
        timeline.play();
    
    }
}
