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

        describe.only("#next", () => {
            it("should rotate to the right", () => {
                const tetronimo = new Tetronimo(4, 5, "L")

                expect(tetronimo.current).toEqual(tetronimo.positions[tetronimo.rotation]);
                expect(tetronimo.next).toEqual(tetronimo.positions[tetronimo.rotation + 1]);
            })
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

                tetronimo.rotateRight();

                expect(tetronimo.bottomParts).toEqual( [ { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 } ])
                expect(tetronimo.collidingBottom).toEqual( [ { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -2, y: 1 } ])

                expect(tetronimo.current).toEqual(tetronimo.positions[3]);
            });

            it("should have right rightParts and collidingRight after rotate", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.current).toEqual(initial);


                expect(tetronimo.rightParts).toEqual([ { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }])
                expect(tetronimo.collidingRight).toEqual([ { x: 2, y: 0 }, { x: 1, y: -1 }, { x: 1, y: -2 }])

                tetronimo.rotateRight();
                

                expect(tetronimo.rightParts).toEqual([ { x: 2, y: 0 }, { x: 0, y: 1 } ])
                expect(tetronimo.collidingRight).toEqual([ { x: 3, y: 0 }, { x: 1, y: 1 } ])

                tetronimo.rotateRight();

                expect(tetronimo.rightParts).toEqual([ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ])
                expect(tetronimo.collidingRight).toEqual([ { x: 1, y: 0 }, { x: 1, y: 1 }, {x: 1, y: 2} ])

                expect(tetronimo.current).toEqual(tetronimo.positions[2]);

                tetronimo.rotateRight();

                expect(tetronimo.rightParts).toEqual([ { x: 0, y: 0 }, { x: 0, y: -1 } ])
                expect(tetronimo.collidingRight).toEqual([ { x: 1, y: 0 }, { x: 1, y: -1 } ])
            });

            it("should have right leftParts and collidingLeft after rotate", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.current).toEqual(initial);

                expect(tetronimo.leftParts).toEqual([ { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }])
                expect(tetronimo.collidingLeft).toEqual([ { x: -1, y: 0 }, { x: -1, y: -1 }, { x: -1, y: -2 }])

                tetronimo.rotateRight();
                expect(tetronimo.leftParts).toEqual([ { x: 0, y: 0 }, { x: 0, y: 1 } ])
                expect(tetronimo.collidingLeft).toEqual([ { x: -1, y: 0 }, { x: -1, y: 1 } ])

                tetronimo.rotateRight();

                expect(tetronimo.leftParts).toEqual([ { x: -1, y: 0 }, { x: 0, y: 1 }, {x: 0, y: 2} ])
                expect(tetronimo.collidingLeft).toEqual([ { x: -2, y: 0 }, { x: -1, y: 1 }, {x: -1, y: 2} ])

                expect(tetronimo.current).toEqual(tetronimo.positions[2]);

                tetronimo.rotateRight();

                expect(tetronimo.leftParts).toEqual([ { x: -2, y: 0 }, { x: 0, y: -1 } ])
                expect(tetronimo.collidingLeft).toEqual([ { x: -3, y: 0 }, { x: -1, y: -1 } ])
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

            it("should return right lowest parts after removing", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.bottomParts).toEqual([{x:0, y: 0},{x: 1, y: 0}]);

                tetronimo.removePosition({x: 0, y: 0});
                tetronimo.removePosition({x: 1, y: 0});

                expect(tetronimo.bottomParts).toEqual([ { x: 0, y: -1 } ]);
                expect(tetronimo.lowest).toEqual(-1);
            });
        })

        describe("#lowest", () => {
            it("should return lowest point", () => {
                const tetronimo1 = new Tetronimo(0, 0, "L")
                expect(tetronimo1.lowest).toBe(0);

                const tetronimo2 = new Tetronimo(4, 4, "L")
                expect(tetronimo2.lowest).toBe(4);

                const tetronimo3 = new Tetronimo(6, 6, "L")
                tetronimo3.removePosition({x: 6, y: 6})
                tetronimo3.removePosition({x: 6, y: 7})
                expect(tetronimo3.lowest).toBe(5);
            });
        });

        describe("#rightest", () => {
            it("should return rightest point", () => {
                const tetronimo1 = new Tetronimo(0, 0, "L")
                expect(tetronimo1.rightest).toBe(1);

                const tetronimo2 = new Tetronimo(4, 4, "L")
                expect(tetronimo2.rightest).toBe(5);
            });

            it("should return rightest point after move", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.rightest).toBe(1);
                tetronimo.right()
                expect(tetronimo.rightest).toBe(2);
            });
        });

        describe("#leftest", () => {
            it("should return leftest point", () => {
                const tetronimo1 = new Tetronimo(0, 0, "L")
                expect(tetronimo1.leftest).toBe(0);

                const tetronimo2 = new Tetronimo(4, 4, "L")
                expect(tetronimo2.leftest).toBe(4);
            });

            it("should return leftest point after move", () => {
                const tetronimo = new Tetronimo(4, 4, "L")
                expect(tetronimo.leftest).toBe(4);
                tetronimo.left();
                expect(tetronimo.leftest).toBe(3);
            });
        });
    
        describe("#leftParts", () => {
            it("should return parts to the left limit", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.leftParts).toEqual( [ { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 } ]);
            });
        })

        describe("#rightParts", () => {
            it("should return parts to the right limit", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.rightParts).toEqual( [ { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }]);
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

            it("should return right collidingBottom after removing", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.bottomParts).toEqual([{x:0, y: 0},{x: 1, y: 0}]);

                tetronimo.removePosition({x: 0, y: 0});
                tetronimo.removePosition({x: 1, y: 0});

                expect(tetronimo.bottomParts).toEqual([ { x: 0, y: -1 } ]);
                expect(tetronimo.collidingBottom).toEqual([ { x: 0, y: 0 } ]);
            });
        });

        describe("#collidingRight", () => {
            it("should return bottom colliding points", () => {
                const tetronimo = new Tetronimo(0, 0, "L")
                expect(tetronimo.collidingRight).toEqual([ { x: 2, y: 0 }, { x: 1, y: -1 }, { x: 1, y: -2 }]);
            });

            it("should return bottom colliding points in any position", () => {
                const tetronimo = new Tetronimo(5, 6, "L")
                expect(tetronimo.collidingRight).toEqual([ { x: 7, y: 6 }, { x: 6, y: 5 }, { x: 6, y: 4 } ]);
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

            it.skip("should change the center of the tetronimo", () => {
                const tetronimo = new Tetronimo(0, 0, "L")

                expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 0, y: -1},{x:0, y: -2},{x: 1, y: 0}])
                tetronimo.removePosition({x: 0, y: 0})
                tetronimo.removePosition({x: 1, y: 0})

                console.log("So: ", tetronimo.absolute)
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

    describe("#nextRotation", () => {
        it("returns edges of next rotation", () => {
            const tetronimo = new Tetronimo(4, 4, "L")
            expect(tetronimo.absolute).toEqual([{x: tetronimo.x, y: tetronimo.y}, {x: 4, y: 3},{x:4, y: 2},{x: 5, y: 4}]);

            expect(tetronimo.nextRotation()).toEqual( [ { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 4, y: 5 } ])
        })
    })
});
