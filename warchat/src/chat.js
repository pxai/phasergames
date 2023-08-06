const tmi = require("tmi.js");

export default class Chat {
    constructor (scene, username, password, channels) {
        this.scene = scene;
        this._username = username;
        this._password = password;
        this.channel = "devdiaries";

        this.init();
    }

    init () {
        const urlParams = new URLSearchParams(window.location.search);
        const channel = urlParams.get('channel') || "devdiaries";
        console.log("Chat channel: ", channel);

        this.client = new tmi.Client({
            options: { debug: true },
            identity: {
                username: "devdiaries",
                password: "oauth:d436lbvjbql0nf8zhe154xn0k60qxq" //bhtp65u3qmwj803txw3gv650cz91v1"
            },
            channels: [channel]
        });

        this.client.connect().then(ok => {
            console.log("Connected!, loading game");
            this.scene.loadGame();
        }).catch(console.error);

        this.client.on("join", (channel, username, self) => {
            console.log("Somebody joined the chat: ", channel, username);
            if (self) { this.scene.addPlayer(username); }
        });

        this.client.on("message", (channel, tags, message, self) => {
            console.log(`Message: ${tags.username} just ${message}`);
            // if(self) return;
            if (message.toLowerCase() === "!hello") {
                this.client.say(channel, `@${tags.username}, heya!`);
            }
        });

        this.client.on("chat", async (channel, user, message, self) => {
            if (user.mod) {
                // User is a mod.
            }
            let [command, x, y, speed, angle, size, shield, userInfo] = ["", "", "", "", "", "", "", ""];
            console.log(`Chat> ${message}`);
            const messageParts = message.toLowerCase().split(" ");
            console.log("Received chat: ", channel, user, messageParts);
            const username = user["display-name"];
            switch (messageParts[0]) {
            case "!hello":
                // if(self) return;
                this.client.action(channel, `${username} just said hello`);
                break;

            case "!h":
            case "!help":
                // if(self) return;
                console.log("Help requested")
                this.client.say(channel, `Commands: !join,\r\n !fb speed angle,\r\n !in player: gives info about player, \r\n!h :this help`);
                break;
            case "!join":
                // if(self) return;
                this.client.action(channel, `${username} joins the battle!!!`);
                this.scene.addPlayer(user["display-name"]);
                break;
            case "!fb":
                // if(self) return;
                [command, speed, angle] = messageParts;

                this.client.action(channel, `${username} attacks ${speed} ${angle}`);
                this.scene.attack(username, speed, angle);

                break;

            case "!mv":
                [command, x, y] = messageParts;

                this.client.action(channel, `${username} moves to ${x} ${y}`);
                this.scene.move(username, x, y);

                break;
            case "!sh":
                [command, shield] = messageParts;

                this.client.action(channel, `${username} launches shield of ${shield}`);
                this.scene.shield(username, shield);

                break;
            case "!in":
                [command, userInfo] = messageParts;

                this.client.action(channel, `${username} requests info for ${userInfo}`);
                const info = this.scene.info(username, userInfo);
                this.client.action(channel, `${userInfo} has ${info}`);
                break;
            default:
                break;
            }
        });
    }

    say (msg) {
        this.client.say(this.channel, msg);
    }
}
