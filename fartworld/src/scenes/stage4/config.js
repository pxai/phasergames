export default {
    door: { x: 400, y: 68 },
    start: { x: 60, y: 400 },
    beans: [
        { x: 200, y: 560, color: 0x00ff00 },
        { x: 600, y: 560, color: 0x00ff00 },
        { x: 200, y: 460, color: 0x00ff00 },
        { x: 600, y: 460, color: 0x00ff00 },
        { x: 200, y: 360, color: 0x00ff00 },
        { x: 600, y: 360, color: 0x00ff00 },
        { x: 400, y: 260, color: 0x00ff00 },
        { x: 200, y: 160, color: 0x00ff00 },
        { x: 600, y: 160, color: 0x00ff00 },
    ],
    redBeans: [
        { x: 400, y: 160, color: 0x00ff00 },
        { x: 400, y: 360, color: 0x00ff00 }
    ],
    foes: [
        { x: 600, y: 60, name: "tomato" },
        { x: 200, y: 60, name: "tomato" },
        { x: 600, y: 460, name: "tomato" },
        { x: 200, y: 460, name: "tomato" },
        { x: 190, y: 260, name: "avocado" },
        { x: 600, y: 260, name: "avocado" },
        { x: 120, y: 50, name: "greenpepper" },
        { x: 330, y: 200, name: "greenpepper" },
        { x: 190, y: 60, name: "carrot" },
        { x: 190, y: 60, name: "carrot" },
    ],
    platforms: [
        {x: 200, y: 500, type: "platform4", mode: "horizontal", offset: 50},
        {x: 600, y: 500, type: "platform4", mode: "horizontal", offset: 50},
        {x: 200, y: 400, type: "platform3", mode: "horizontal", offset: 100},
        {x: 600, y: 400, type: "platform3", mode: "horizontal", offset: 100},
        {x: 400, y: 300, type: "platform1", mode: "horizontal", offset: 300},
        {x: 200, y: 200, type: "platform3", mode: "horizontal", offset: 100},
        {x: 600, y: 200, type: "platform3", mode: "horizontal", offset: 100},
        {x: 200, y: 100, type: "platform4", mode: "horizontal", offset: 50},
        {x: 600, y: 100, type: "platform4", mode: "horizontal", offset: 50},
    ],
    nextScene: "outro"
};
