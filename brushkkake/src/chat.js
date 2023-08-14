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
            this.processMessage(channel, tags.username, message)
        });

        this.client.on("chat", async (channel, user, message, self) => {
            this.processMessage(channel, user["display-name"], message)
        });
    }

    processMessage(channel, username, message) {
        console.log(`Chat> ${message}`);
        const messageParts = message.toLowerCase().split(" ");
        console.log("Received chat: ", channel, username, messageParts);

        if (this.isMoveCommand(messageParts)) {
            console.log("Its a move! ")
            const x = +messageParts[0].substring(1);
            const y = +messageParts[1];
            const color = messageParts[2];
            const size = messageParts[3];
            this.scene.paint(username,x, y, color, size );
            return;
        }
    }

    isMoveCommand(moveCommands) {
        return this.isValidMove(moveCommands[0].substring(1)) && this.isValidMove(moveCommands[1])
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

    isValidMove (number) {
        return !isNaN(number) && +number >= -5 && +number <= 5;
    }
}
