export default class BulletHell {

    constructor () {
        this._functions = [ this.flat, this.tlaf, this.horizontal, this.multiWave, this.cos, this.tan, this.ripple]
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
        return Math.sin(Math.PI * (x + time));
    }

    multiWave (x, time) {
        return Math.sin(Math.PI * (x + time));
    }

    cos (x, time, z) {
        return  Math.cos(x) * Phaser.Math.Between(0.1, 0.9);
	}

    tan (x, time, z) {
        return  Math.tan(x);
	}

    ripple (x, time, z) {
        return Math.sin( time * x * (Math.PI/360))
	}
}