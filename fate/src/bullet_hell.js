export default class BulletHell {

    constructor () {
        this._functions = [ this.flat, this.tlaf, this.horizontal, this.multiWave, this.sin]
    }

    get functions () {
        return this._functions;
    }

    sin (x, time) {
        return Math.sin(x);//Math.PI * (x + time));
    }

    flat (x, y, z) {
        return x + z;
    }

    tlaf (x, y, z) {
        return -x - z;
    }

    horizontal (x, y, z) {
        return z;
    }

    wave (x, time) {
        // console.log(x, Math.sin(Math.PI * (x + time)))
        return Math.sin(Math.PI * (x + time));
    }

    multiWave (x, time) {
        return Math.sin(Math.PI * (x + time));
    }
}