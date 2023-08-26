import Tetronimo from "../src/tetronimo";

describe("Tetronimo class", () => {
    it("should exist", () => {
        expect(Tetronimo).toBeDefined();
    });

    describe("L", () => {
        let tetronimo, initial;

        beforeEach(() =>{
            tetronimo = new Tetronimo(0, 0, "L");
            initial = tetronimo.current;
        })

        it("should have sides", () => {
            expect(tetronimo.positions[0].length).toBe(4);
        });

        it("should be floating by default", () => {
            expect(tetronimo.floating).toBe(true);
        });

        it("should have rotate positions", () => {
            expect(tetronimo.positions.length).toBe(4);
        });

        it("should have real positions from start", () => {
            expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -1},{x:0, y: -2},{x: 1, y: 0}]);
        });

        it("should have real positions anywhere", () => {
            const tetronimo = new Tetronimo(4, 5, "L")
            expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 4, y: 4},{x:4, y: 3},{x: 5, y: 5}]);
        });

        describe("#rotateRight", () => {
            it("should rotate to the right", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.current).toEqual(initial);
    
                tetronimo.rotateRight();
    
                expect(tetronimo.current).toEqual(tetronimo.positions[1]);
            });
    
            it("completes rotation to right", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.current).toEqual(initial);
    
                [0, 1, 2].forEach(i => {
                    tetronimo.rotateRight()
                    expect(tetronimo.current).toEqual(tetronimo.positions[i+1]);
                });
                tetronimo.rotateRight();
    
                expect(tetronimo.current).toEqual(initial);
            });

            it("should have right bottomParts and collidingBottom after rotate", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.current).toEqual(initial);

                expect(tetronimo.bottomParts).toEqual([ { x: 0, y: 0 }, { x: 1, y: 0 } ])
                expect(tetronimo.collidingBottom).toEqual([ { x: 0, y: 1 }, { x: 1, y: 1 } ])

                tetronimo.rotateRight();

                expect(tetronimo.bottomParts).toEqual([{x:0, y: 1},{x: 1, y: 0}, {x: 2, y: 0}])
                expect(tetronimo.collidingBottom).toEqual([{x:0, y: 2},{x: 1, y: 1}, {x: 2, y: 1}])

                tetronimo.rotateRight();

                expect(tetronimo.bottomParts).toEqual([ { x: 0, y: 2 }, { x: -1, y: 0 } ])
                expect(tetronimo.collidingBottom).toEqual([ { x: 0, y: 3 }, { x: -1, y: 1 } ])

                expect(tetronimo.current).toEqual(tetronimo.positions[2]);
            });
        })

        describe("#rotateLeft", () => {
            it("should rotate to the left", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.current).toEqual(initial);
    
                tetronimo.rotateLeft();
    
                expect(tetronimo.current).toEqual(tetronimo.positions[3]);
            });
    
            it("completes rotation to left", () => {
                expect(tetronimo.current).toEqual(initial);
    
                [3, 2, 1].forEach(i => {
                    tetronimo.rotateLeft()
                    expect(tetronimo.current).toEqual(tetronimo.positions[i]);
                });
                tetronimo.rotateLeft()
    
                expect(tetronimo.current).toEqual(initial);
            }); 
        })

        describe("#right", () => {
            it("should move to the right", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.x).toEqual(0);
                expect(tetronimo.y).toEqual(0);
    
                tetronimo.right();
    
                expect(tetronimo.x).toEqual(1);
                expect(tetronimo.y).toEqual(0);
            });
        })

        describe("#left", () => {
            it("should move to the left", () => {
                const tetronimo = new Tetronimo(1, 0, "L")
                expect(tetronimo.x).toEqual(1);
                expect(tetronimo.y).toEqual(0);
    
                tetronimo.left();
    
                expect(tetronimo.x).toEqual(0);
                expect(tetronimo.y).toEqual(0);
            });
        })

        describe("#bottomParts", () => {
            it("should return lowest parts", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.bottomParts).toEqual([{x:0, y: 0},{x: 1, y: 0}]);
            });

            it("should return lowest parts of first rotation", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.bottomParts).toEqual([{x:0, y: 0},{x: 1, y: 0}]);
                tetronimo.rotateRight();
                expect(tetronimo.bottomParts).toEqual([{x:0, y: 1},{x: 1, y: 0}, {x: 2, y: 0}]);
                tetronimo.rotateRight();
                expect(tetronimo.bottomParts).toEqual([ { x: 0, y: 2 }, { x: -1, y: 0 } ]);
                tetronimo.rotateRight();
                expect(tetronimo.bottomParts).toEqual([ { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 } ]);
            });
        })

        describe("#leftParts", () => {
            it("should return parts to the left limit", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.leftParts).toEqual( [ { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 } ]);
            });
        })

        describe("#rightParts", () => {
            it("should return parts to the right limit", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.rightParts).toEqual( [{x: 1, y: 0}]);
            });
        })

        describe("#collidingBottom", () => {
            it("should return bottom colliding points", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.collidingBottom).toEqual([{x:0, y: 1},{x: 1, y: 1}]);
            });

            it("should return bottom colliding points in any position", () => {
                const tetronimo = new Tetronimo(5, 6, "L")
                expect(tetronimo.collidingBottom).toEqual([{x:5, y: 7},{x: 6, y: 7}]);
            });
        });

        describe("#collidingRight", () => {
            it("should return bottom colliding points", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.collidingRight).toEqual([{x: 2, y: 0}]);
            });

            it("should return bottom colliding points in any position", () => {
                const tetronimo = new Tetronimo(5, 6, "L")

                expect(tetronimo.collidingRight).toEqual([{x: 7, y: 6}]);
            });
        });

        describe("#collidingLeft", () => {
            it("should return bottom colliding points", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.collidingLeft).toEqual([{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: -1, y: -2 } ]);
            });

            it("should return bottom colliding points in any position", () => {
                const tetronimo = new Tetronimo(5, 6, "L")
                expect(tetronimo.collidingLeft).toEqual([{ x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 } ]);
            });
        });

        describe("#removePosition", () => {
            it("should remove the indicated position", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -1},{x:0, y: -2},{x: 1, y: 0}])
                tetronimo.removePosition({x: 1, y: 0})
                expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -1},{x:0, y: -2}])
                tetronimo.removePosition({x: 0, y: -1})
                expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y},{x:0, y: -2}])
                tetronimo.removePosition({x: 0, y: -2})
                expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}])
            });

            it("should remove from just one tetronimo, not others", () => {
                const tetronimo1 = new Tetronimo(0, 0, "L")
                const tetronimo2 = new Tetronimo(2, 0, "L")

                expect(tetronimo1.absolute).toEqual([{x: tetronimo1.x, y: tetronimo1.y}, {x: 0, y: -1},{x:0, y: -2},{x: 1, y: 0}])
                expect(tetronimo2.absolute).toEqual([{x: tetronimo2.x, y: tetronimo2.y}, {x: 2, y: -1},{x:2, y: -2},{x: 3, y: 0}])

                tetronimo1.removePosition({x: 1, y: 0})

                expect(tetronimo1.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -1},{x:0, y: -2}])
                expect(tetronimo2.absolute).toEqual([{x: tetronimo2.x, y: tetronimo2.y}, {x: 2, y: -1},{x:2, y: -2},{x: 3, y: 0}])
            });

            it("should change the center of the tetronimo", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -1},{x:0, y: -2},{x: 1, y: 0}])
                tetronimo.removePosition({x: 0, y: 0})
                tetronimo.removePosition({x: 1, y: 0})

                expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -2}])
            });

            it("should change the colliding bottom parts", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.collidingBottom).toEqual([{"x": 0, "y": 1}, {"x": 1, "y": 1}])
                tetronimo.removePosition({x: 0, y: 0})
                tetronimo.removePosition({x: 1, y: 0})

                expect(tetronimo.collidingBottom).toEqual([{"x": 0, "y": 0}])
            });
        });
    })
});
