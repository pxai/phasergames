import { Game as MainGame } from './scenes/Game';
import Bootloader from './scenes/Bootloader';
import Splash from './scenes/Splash';
import Transition from './scenes/Transition';
import Outro from './scenes/Outro';
import { AUTO, Game, Scale,Types } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 960,
    height: 1024,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [
        Bootloader,
        Splash,
        Transition,
        MainGame,
        Outro
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
