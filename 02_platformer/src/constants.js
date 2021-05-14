const SCENES = {
    LOAD: "Load",
    SCENE1: "Scene1",
    HUD: "Hud",
    MENU: "Menu"
};

const LEVELS = {
    SCENE1: {
        TILEMAPJSON: "scene1",
        LAYER: "Scene1Layer",
        BACKGROUND: "scene1Background",
        ENEMIES: "enemies"
    },
    TILESET: "tileset"
};

const EVENTS = {
    UPDATE_POINTS: "update_points"
};

const PLAYER = {
    ID: "jugadorAtlas",
    ANIM: {
        IDLE: "idle",
        RUN: "run",
        JUMP: "jump-0"
    }
};

const FONTS = {
    FONT: {
        IMAGE: "fontImage",
        JSON: "fontJSON"
    }
};

const OBJECTS = {
    BOX: "box"
};

const ENEMIES = {
    STRAWBERRY: "strawberry",
    BUNNY:{
        ID:'bunny',
        ANIM:'bunny-run',
        SPEED: 75            
    },
    CHICKEN:{
        ID:'chicken',
        ANIM:'chicken-run',
        SPEED: 100
    },
    MUSHROOM:{
        ID:'mushroom',
        ANIM:'mushroom-run',
        SPEED: 100
    },
    RADISH:{
        ID:'radish',
        ANIM:'radish-run',
        SPEED: 100
    }
};

export { SCENES, LEVELS, EVENTS, FONTS, PLAYER, OBJECTS, ENEMIES };
