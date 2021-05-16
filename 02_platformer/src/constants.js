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
        BACKGROUND: "scene1Background"
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
    STRAWBERRY: "strawberry"
};

export { SCENES, LEVELS, EVENTS, FONTS, PLAYER, OBJECTS, ENEMIES };
