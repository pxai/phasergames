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
            if (this.isValidEntry(message)) {
                this.scene.guess(tags.username, message.substring(1).trim().toLowerCase());
            }
        });

        this.client.on("chat", async (channel, user, message, self) => {
            if (user.mod) {
                // User is a mod.
            }

            console.log(`Chat> ${message}`);
            const messageParts = message.toLowerCase().split(" ");
            console.log("Received chat: ", channel, user, messageParts);
            const username = user["display-name"];

            if (this.isValidEntry(message)) {
                this.scene.guess(username, message.substring(1).trim().toLowerCase());
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

    isValidEntry (guess) {
        return guess.startsWith("!") && /^[\wñ]+$/.test(guess.substring(1));
    }
}
