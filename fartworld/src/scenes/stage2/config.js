export default {
    door: { x: 400, y: 68 },
    start: { x: 60, y: 400 },
    beans: [
        { x: 190, y: 550, color: 0x00ff00 },
        { x: 300, y: 460, color: 0x00ff00 },
        { x: 400, y: 360, color: 0x00ff00 },
        { x: 360, y: 260, color: 0x00ff00 },
        { x: 320, y: 160, color: 0x00ff00 },
    ],
    redBeans: [
        { x: 300, y: 260, color: 0x00ff00 },
        { x: 240, y: 460, color: 0x00ff00 },
    ],
    foes: [
        { x: 500, y: 160, name: "tomato" },
        { x: 120, y: 360, name: "tomato" },
        { x: 500, y: 260, name: "tomato" },
        { x: 120, y: 160, name: "avocado" },
        { x: 120, y: 50, name: "greenpepper" },
        { x: 330, y: 200, name: "greenpepper" },
    ],
    platforms: [
        {x: 300, y: 500, type: "platform2", mode: "horizontal", offset: 200},
        {x: 500, y: 400, type: "platform2", mode: "horizontal", offset: 200},
        {x: 300, y: 300, type: "platform2", mode: "horizontal", offset: 200},
        {x: 500, y: 200, type: "platform2", mode: "horizontal", offset: 200},
        {x: 300, y: 100, type: "platform2", mode: "horizontal", offset: 200},
    ],
    nextScene: "stage3"
};
