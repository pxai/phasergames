const player = require('play-sound')(opts = {});

class SoundReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    if (results.numFailedTests === 0) {
      console.log("Running sound!")
        player.play('./assets/sounds/move.mp3', { afplay: ['-v', 1 ]  }, (err) => {
        if (err) console.error('Error playing sound:', err);
      })
    }
  }
}

module.exports = SoundReporter;