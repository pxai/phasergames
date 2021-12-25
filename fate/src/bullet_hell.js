export default class BulletHell {
    sin (x, time) {
        return Math.sin(x);//Math.PI * (x + time));
    }

    flat (x) {
        return x;
    }

    wave (x, time = 1) {
        return Math.sin(Math.PI * (x + time));
    }

    multiWave (x, time) {
        return Math.sin(Math.PI * (x + time));
    }
}