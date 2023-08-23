import Shape from '../src/shape';

describe('#Shape', () => {
    it('should be defined', () => {
        expect(Shape).toBeDefined();
    });

    it("should have right x and y", () => {
        const shape = new Shape(4, 5, "L")
        expect(shape.x).toBe(4);
        expect(shape.y).toBe(5);
    });
});