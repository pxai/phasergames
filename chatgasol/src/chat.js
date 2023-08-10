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
        this.feedback = urlParams.get('feedback') == "1";
        this.maxPlayers = this.isValidNumberWithMax(urlParams.get('maxplayers')) ? +urlParams.get('maxplayers') : 500;

        console.log("Chat channel: ", channel, "feedback: ", this.feedback, "maxPlayers: ", this.maxPlayers);

        this.client = new tmi.Client({
            options: { debug: false },
            // identity: {
            //     username: "devdiaries",
            //     password: NOPE
            // },
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
                this.sendAction(channel, `${username} just said hello`);
                break;

            case "!h":
            case "!help":
                console.log("Help requested")
                this.say(channel, `Commands: !join,\r\n !fb speed angle: shoots fireball speed (0-100) angle (0-360),\r\n !in player: gives info about player, \r\n!h :this help`);
                break;
            case "!j":
            case "!join":
                console.log(this.scene.allPlayers.length, this.maxPlayers)
                if (Object.values(this.scene.allPlayers).length < this.maxPlayers) {
                    this.sendAction(channel, `${username} joins the battle!!!`);
                    this.scene.addPlayer(user["display-name"]);
                } else {
                    this.sendAction(channel, `${username} tries to join the battle, but it's full`);
                }

                break;
            case "!f":
            case "!fb":
                // if(self) return;
                [command, speed, angle] = messageParts;

                this.sendAction(channel, `${username} attacks ${speed} ${angle}`);
                this.scene.attack(username, speed, angle);

                break;

            case "!mv":
                [command, x, y] = messageParts;

                this.sendAction(channel, `${username} moves to ${x} ${y}`);
                this.scene.move(username, x, y);

                break;
            case "!sh":
                [command, shield] = messageParts;

                this.sendAction(channel, `${username} launches shield of ${shield}`);
                this.scene.shield(username, shield);

                break;
            case "!in":
                [command, userInfo] = messageParts;

                this.sendAction(channel, `${username} requests info for ${userInfo}`);
                const info = this.scene.info(username, userInfo);
                this.sendAction(channel, `${userInfo} has ${info}`);
                break;
            default:
                break;
            }
        });
    }

    sendAction (channel, msg) {
        console.log("Sending action: ", this.feedback, channel, msg);
        if (!this.feedback) return;
        this.client.action(channel, msg);
    }

    say (msg) {
        if (!this.feedback) return;
        this.client.say(this.channel, msg);
    }

    isValidNumberWithMax(number, limit = 100) {
        return this.isValidNumber(number) && +number > 0 && +number <= limit;
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 0;
    }
}
