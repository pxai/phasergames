export default {
    door: { x: 200, y: 450 },
    start: { x: 60, y: 400 },
    beans: [
        { x: 100, y: 100, color: 0x00ff00 },
        { x: 200, y: 200, color: 0x00ff00 },
        { x: 100, y: 3, color: 0x00ff00 },
        { x: 200, y: 400, color: 0x00ff00 },
        { x: 180, y: 550, color: 0x00ff00 }
    ],
    redBeans: [
        { x: 200, y: 200, color: 0x00ff00 },
        { x: 300, y: 300, color: 0x00ff00 },
        { x: 400, y: 30, color: 0x00ff00 },
        { x: 240, y: 500, color: 0x00ff00 },
        { x: 480, y: 550, color: 0x00ff00 }
    ],
    foes: [
        { x: 400, y: 350, name: "tomato" },
        { x: 230, y: 400, name: "tomato" },
        { x: 100, y: 50, name: "carrot" },
        { x: 330, y: 200, name: "avocado" },
    ],
    platforms: [
        {x: 400, y: 500, type: "ground", mode: "horizontal"},
        {x: 50, y: 250, type: "ground", mode: "horizontal"},
        {x: 750, y: 220, type: "ground", mode: "horizontal"},
    ],
    nextScene: "stage1"
};
