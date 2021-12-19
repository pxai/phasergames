export default class BulletHell {
    sin (x, time) {
        return Math.sin(x);//Math.PI * (x + time));
    }

    wave (x, time) {
        return Math.sin(Math.PI * (x + time));
    }

    multiWave (x, time) {
        return Math.sin(Math.PI * (x + time));
    }
}