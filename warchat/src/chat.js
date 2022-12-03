const tmi = require('tmi.js');

export default class Chat {
    constructor (scene, username, password, channels) {
        this.scene = scene;
        this._username = username;
        this._password = password;
        this.channel = 'devdiaries';

        this.init();
    }

    init () {
        this.client = new tmi.Client({
            options: { debug: true },
            identity: {
                username: 'devdiaries',
                password: 'oauth:bhtp65u3qmwj803txw3gv650cz91v1'
            },
            channels: [ 'devdiaries' ]
        });
        this.client.connect().then(ok =>{
            console.log("Connected!, loading game")
            this.scene.loadGame();
        }).catch(console.error);
        this.client.on("join", (channel, username, self) => {
            console.log("Somebody joined: ", channel, username)
            this.scene.addPlayer(username)
        });
        this.client.on('message', (channel, tags, message, self) => {
            //if(self) return;
            if(message.toLowerCase() === '!hello') {
                this.client.say(channel, `@${tags.username}, heya!`);
            }
        });
        
        this.client.on("chat", async (channel, user, message, self) => {
            if (user.mod) {
                // User is a mod.
            }
            console.log("Received chat: ", channel, user, message)
            if(message.toLowerCase() === '!hello' ) {
                if(self) return;
                await client.say(channel, ` heya!`);
            }
        });
    }

    say (msg) {
        this.client.say(this.channel, msg)
    }
}


