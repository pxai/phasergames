class Weather  {
    constructor (scene,  type="snow") {
        this.scene = scene;
        this.type = type;
        this.start();
     }

     start() {
        if (this.type === "rain")
            this.rain();

        if (this.type === "snow")
            this.snow();
     }

     rain () {
        const particles = this.scene.add.particles('rain');

        particles.createEmitter({
            x: { min: 100, max: 2000 },
            y: 0,
            lifespan: 3000,
            speedY: { min: 200, max: 400 },
            speedX: -300,
            scale: { start: 0.9, end: 0.4 },
            quantity: 1,
            blendMode: 'ADD'
        }).setScrollFactor(0);
     }

     snow () {
        const particles = this.scene.add.particles('snow');

        particles.createEmitter({
            x: { min: -100, max: 3000},
            y: 0,
            lifespan: 20000,
            speedY: { min: 30, max: 100 },
            scale: { start: 0.8, end: 0.4 },
            rotation: { min: 0, max: 90},
            quantity: 1,
            blendMode: 'ADD'
        });
     }
  }
  
  export default Weather;