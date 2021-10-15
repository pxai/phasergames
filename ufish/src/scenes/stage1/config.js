export default {
    door: { x: 400, y: 68 },
    start: { x: 60, y: 400 },
    beans: [
        { x: 190, y: 550, color: 0x00ff00 },
        { x: 560, y: 460, color: 0x00ff00 },
        { x: 120, y: 360, color: 0x00ff00 },
        { x: 560, y: 260, color: 0x00ff00 },
        { x: 120, y: 160, color: 0x00ff00 },
    ],
    redBeans: [
        { x: 300, y: 260, color: 0x00ff00 },
        { x: 240, y: 460, color: 0x00ff00 },
    ],
    foes: [
        { x: 500, y: 460, name: "tomato" },
        { x: 120, y: 360, name: "tomato" },
        { x: 500, y: 260, name: "tomato" },
        { x: 120, y: 160, name: "tomato" },
        { x: 120, y: 50, name: "tomato" },
        { x: 330, y: 200, name: "greenpepper" },
    ],
    platforms: [
        {x: 400, y: 500, type: "platform1", mode: "horizontal", offset: 300},
        {x: 400, y: 400, type: "platform1", mode: "horizontal", offset: 300},
        {x: 400, y: 300, type: "platform1", mode: "horizontal", offset: 300},
        {x: 400, y: 200, type: "platform1", mode: "horizontal", offset: 300},
        {x: 400, y: 100, type: "platform1", mode: "horizontal", offset: 300},
    ],
    nextScene: "stage2"
};
