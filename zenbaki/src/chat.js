const tmi = require("tmi.js");

export default class Chat {
    constructor (scene, username, password, channels) {
        this.scene = scene;
        this._username = username;
        this._password = password;

        const urlParams = new URLSearchParams(window.location.search);
        this.channel = urlParams.get('channel') || "devdiaries";
        this.feedback = urlParams.get('feedback') == "1";
        this.maxPlayers = this.isValidNumberWithMax(urlParams.get('maxplayers')) ? +urlParams.get('maxplayers') : 500;

        this.init();
    }

  /*

  */
    init () {
        console.log("Chat channel: ", this.channel, "feedback: ", this.feedback, "maxPlayers: ", this.maxPlayers);
        this.client = new tmi.Client({
            options: { debug: false },
            // identity: {
            //     username: "devdiaries", // We could actualy log in with a user
            //     password: NOPE   // and send messages or do actions
            // },
            channels: [this.channel]
        });

        this.client.connect().then(ok => {
            console.log("Connected!, loading game");
            this.scene.loadGame();
        }).catch(console.error);

        this.setOnJoinListener();
        this.setOnMessageListener();
        this.setOnChatListener
    }

  /*

  */
    setOnJoinListener () {
        this.client.on("join", (channel, username, self) => {
            console.log("Somebody joined the chat: ", channel, username);
            if (self) { this.scene.addPlayer(username); }
        });
    }

  /*

  */
    setOnMessageListener () {
        this.client.on("message", (channel, tags, message, self) => {
            console.log(`Message: ${tags.username} just ${message}`);
            this.processMessage(tags.username, message);
        });
    }

  /*

  */
    setOnChatListener () {
        this.client.on("chat", async (channel, user, message, self) => {
            if (user.mod) {
                // User is a mod.
            }
            const messageParts = message.toLowerCase().split(" ");
            console.log("Received chat: ", channel, user, messageParts);

            this.processMessage(user["display-name"], message);

        });
    }

    processMessage (username, message) {
        if (this.isValidNumber(message)) {
            this.scene.guess(username, +message);
        }
    }

  /*

  */
    sendAction (channel, msg) {
        console.log("Sending action: ", this.feedback, channel, msg);
        if (!this.feedback) return;
        this.client.action(channel, msg);
    }

  /*

  */
    say (msg) {
        if (!this.feedback) return;
        this.client.say(this.channel, msg);
    }

  /*

  */
    isValidNumberWithMax(number, limit = 100) {
        return this.isValidNumber(number) && +number > 0 && +number <= limit;
    }

  /*

  */
    isValidNumber (number) {
        return !isNaN(number);
    }
}
