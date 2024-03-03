import Phaser from "phaser";
import Player from "./player";

import {
    NEW_PLAYER,
    CURRENT_PLAYERS,
    PLAYER_DISCONNECTED,
    PLAYER_MOVED,
    PLAYER_IS_MOVING
} from "./status";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
    }

    create () {
        this.id = null;

        this.startSockets();
        this.loadAudios();
        this.addColliders();
    }

    startSockets () {
        this.socket = io()
        this.playerId = this.socket.id;
        this.addPlayer()
        this.enemies = {}
        this.enemyPlayers = this.physics.add.group()

        this.socket.on(NEW_PLAYER, function (playerInfo) {
            console.log("Game> Player added", playerInfo)
            this.addEnemyPlayers(playerInfo)
        }.bind(this))

        this.socket.on(CURRENT_PLAYERS, function (players) {
            console.log("Current players > ", Object.keys(players))
            Object.keys(players).forEach(playerId => {
                if (!this.enemies[playerId] && playerId !== this.player.key)
                    this.addEnemyPlayers(players[playerId])
            })
        }.bind(this))

        this.socket.on(PLAYER_MOVED, function (playerInfo) {
            console.log("Game> Player moved", playerInfo)
            this.enemyPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setRotation(playerInfo.rotation)
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y)
                }
            })
        }.bind(this))

        this.socket.on(PLAYER_DISCONNECTED, function (playerId) {
            this.enemyPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.key) {
                    otherPlayer.destroy()
                }
            })
        }.bind(this))
    }

    addEnemyPlayers (player) {
        console.log("Adding enemy player! ", player.name, " Against ", player.key)
        const enemy = new Player(this, player.x, player.y, "My enemy")
        this.enemies[enemy.key] = enemy;
        this.enemyPlayers.add(enemy)
    }

    setCamera () {
        this.cameras.main.setBackgroundColor(0xcccccc)
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
    }


    addPlayer() {
        this.thrust = this.add.layer();
        const x = 600 + Phaser.Math.Between(-100, 100)
        const y = 500+ Phaser.Math.Between(-100, 100)
        this.player = new Player(this, x, y, "My Name")
        console.log("Creating player! ", this.player.key)
        this.socket.emit(NEW_PLAYER, this.player)
        this.setCamera();
    }

    addColliders () {
        this.physics.add.overlap(this.player, this.enemyPlayers , this.playerCollision.bind(this));
    }

    playerCollision(player, foe) {
        console.log("Collision! ")
        this.socket.emit(PLAYER_DISCONNECTED, player.key)
        player.destroy();
        foe.destroy();
    }


    update (timestep, delta) {
        if (this.player && !this.player.death) {
            this.player.update(timestep, delta);
        }

        if (this.player) {
            const currPosition = {
                x: this.player.x,
                y: this.player.y,
                rotation: this.player.rotation
              }
              if (this.player.oldPosition && (
                    currPosition.x !== this.player.oldPosition.x ||
                    currPosition.y !== this.player.oldPosition.y ||
                    currPosition.rotation !== this.player.oldPosition.rotation)) {
                this.socket.emit(PLAYER_IS_MOVING, {key: this.player.key, ...currPosition})
              }

              this.player.oldPosition = currPosition
        }
    }


    loadAudios () {
        this.audios = {
          "pick": this.sound.add("pick"),
          "shot": this.sound.add("shot"),
          "foeshot": this.sound.add("foeshot"),
          "explosion": this.sound.add("explosion"),
          "asteroid": this.sound.add("asteroid"),
        };
      }

    playAudio(key) {
        this.audios[key].play({volume: 0.2});
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("game");
    }

    destroy() {
        console.log("Scene Destroyed!!")
        if (this.player)
            this.socket.emit(PLAYER_DISCONNECTED, this.player)
        super.destroy();
    }
}
