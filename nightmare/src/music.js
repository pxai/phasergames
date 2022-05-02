import * as Tone from 'tone'

// console.clear();

let APP = {};


/*document.documentElement.addEventListener('mousedown', () => {
  
});*/

// There's a bug that happens occasionally. Intercept it.
// a seed that triggers it: d12d21ddd
/*window.ABCJS.parse.each = function(a, d, c) {
  let e = (a === undefined) ? 0 : a.length;
  // for (let b = 0, e = a.length; b < e; b++) {
  // ^^ this is the code that gets around it  
  for (let b = 0; b < e; b++) {
    d.apply(c, [a[b], b])
  }
}*/

/*document.getElementById("load").addEventListener("click", function(e) {
  let seed = document.getElementById("seed").value;
  if(seed) {
    // if(seed.match(/^[A-Za-z0-9]+$/g)) {
      document.getElementById("intro").style.display = "none";
      APP.MusicGenerator.init(seed);
      document.getElementById("play").focus();
      document.getElementById("play").addEventListener("click", function(e) {
        let $el = e.target;
        if($el.getAttribute("data-playing") === "true") {
          APP.MusicGenerator.pause();
          $el.setAttribute("data-playing", "false");
          $el.innerHTML = "Play";
          APP.MusicGenerator.report();
        } else {
          APP.MusicGenerator.play();
          $el.innerHTML = "Pause";
          $el.setAttribute("data-playing", "true");
        }
      });
    // } else {
    //   alert("Letters and numbers only");
    // }
  } else {
    alert("Please enter a seed into the input");
  }
});*/


(function() {

  APP.MusicGenerator = {};

  let _v_key      = "WeAddaBabyEetsABoy"; // change this to refresh the seed
  let _roots      = "C Db D Eb E F F# G Ab A Bb".split(" ");
  let _modes      = "maj min".split(" ");
  let _hold       = "HOLD";
  //let _container  = document.getElementById("staff-container");
  //let _staff      = document.getElementById("staff");
  //let _midi       = document.getElementById("midi");
  let _min_oct    = 2;
  let _max_oct    = 5;
  let _playing    = false;
  let _res        = 8;
  let _curr_meas  = 0;
  let _curr_note  = 0;
  let _scale      = [];
  let _measures   = [];
  let _abc        = "";
  let _total_abc  = "";
  let _treb_abc   = "";
  let _bass_abc   = "";
  let _gen_meas   = 0;
  let _meas_gen   = 4;
  let _first_one  = true;

  let _bpm        = null;
  let _generator  = null;
  let _len_seqs   = null;
  let _mode       = null;
  let _output     = null;
  let _root       = null;
  let _seed       = null;
  let _synth      = null;

  APP.MusicGenerator.init = function(seed) {
    // _staff.innerHTML = "";
    _seed = seed + _v_key;
    _setGenerator(_seed);
    _setKey();
    if(!_synth) _setSynth();
    _setTransport();
   // _genStaff();
   // _renderStaff();    

    _genLengthSequences();
    _genScale();

    _addMeasure(_meas_gen);
  };

  APP.MusicGenerator.play = playPlayer;
  APP.MusicGenerator.pause = pausePlayer;
  APP.MusicGenerator.report = reportData;

  //////////////
  // PUBLIC METHODS
  //////////////

  // play the player
  function playPlayer() {
    //_midi.innerHTML = "";
    Tone.Transport.start();
  }

  // pause the player
  function pausePlayer() {
    Tone.Transport.stop();
  }

  // reporting the data
  function reportData() {
    _output = {
      root: _root, mode: _mode, resolution: _res,
      scale: _scale, measures: _measures, abc: _total_abc
    };
    //ABCJS.renderMidi(_midi, _total_abc , {}, {}, {});
    console.log(_total_abc);
    console.log(_output);
  }
  
  
  
  

  //////////////
  // PRIVATE METHODS
  //////////////

  // get a unique random number generator based on the seed
  function _setGenerator(seed) {
    _generator = new Math.seedrandom(seed);
  }

  // get randomly generated key and mode
  function _setKey() {
    _root = _roots[Math.floor(_generator.quick() * _roots.length)];

    let mode_index = Math.floor(_generator.quick() * _modes.length);
    _mode = _modes[mode_index];
  }

  // play the bass and treble notes
  function _playSong() {
    let measure = _measures[_curr_meas];
    if(measure) {
      let treb = measure.treb[_curr_note];
      let bass = measure.bass[_curr_note];
      if(treb.chord) {
        _synth.triggerAttackRelease(treb.chord, treb.len + "n");
      }
      if(bass.chord) {
        _synth.triggerAttackRelease(bass.chord, bass.len + "n");
      }
      if(_curr_note + _curr_meas === 0) {
        let hidden = document.querySelector(".hide"); 
        if(hidden) hidden.className = "";
      }
      _curr_note++;
      if(_curr_note >= _res) {
        _curr_note = 0;
        _curr_meas++;
        if(_gen_meas % _meas_gen === 0) {
          _addMeasure(_meas_gen);
        } else if (_gen_meas % _meas_gen === 3) {
          // scroll to the bottom of container
          let hidden = document.querySelector(".hide"); 
          if(hidden) hidden.className = "";          
          // _utilScrollTo(_container, _container.scrollHeight, 500);
        }
        _gen_meas++;
      }
    } else {
      pausePlayer();
    }
  }

  // add a measure to the sequence
  function _addMeasure(how_many, loaded) {
    loaded = loaded || 0;
    let get_measure = _getMeasure();
    get_measure.then(function(measure) {
      loaded++;
      // console.log("_getMeasure", measure);
      _measures.push(measure);
      _staffABC(measure);
      if(loaded < how_many) {
        _addMeasure(how_many, loaded);
      } else {
        //_renderStaff();
      }
    });
  }

  // generate a measure's worth of notes
  function _getMeasure() {
    return new Promise(function(resMeasure, rejMeasure) {
      let data = {
        scale: _scale.length / 2,
        bass: { max_notes: 1, offset: 0 },
        treb: { max_notes: 3, offset: Math.floor(_scale.length / 2) }
      };
      let measure = {
        bass: [], treb: []
      };

      // for each clef
      let get_treb = _getClef('treb', data);
      get_treb.then(function(t) {
        // console.log("_getClef: t", t);
        measure.treb = measure.treb.concat(t);
        let get_bass = _getClef('bass', data);
        get_bass.then(function(b) {
          // console.log("_getClef: b", b);
          measure.bass = measure.bass.concat(b);
          resMeasure(measure);
        }, function(b) {
          rejMeasure(b);
        });
      }, function(t) {
        rejMeasure(t);
      });
    });
  }

  // generate notes for a clef
  function _getClef(clef_name, data) {
    return new Promise(function(resClef, rejClef) {
      let _clef_generator = new Math.seedrandom(_generator.int32() + "");
      // find a sequence
      let seq = _len_seqs[Math.floor(_clef_generator.quick() * _len_seqs.length)];
      // shuffle the sequence order
      _utilShuffleArray(seq);

      // set the data
      let max_notes = data[clef_name].max_notes;
      let note_offset = data[clef_name].offset;

      let chord_promises = [];
      // for each length in sequence
      for(let s = 0; s < seq.length; s++) {
        // generate x notes for a random bass count. no rests.
        let note_count = Math.ceil(_clef_generator.quick() * max_notes);
        // generate random note length
        let note_length = seq[s];
        chord_promises.push(_getChord(_clef_generator, data.scale, note_offset, note_count, note_length));
      }

      Promise.all(chord_promises).then(function(chords) {
        let clef = [];
        // console.log("_getChord: promises", chords);
        for(let i = 0; i < chords.length; i++) {
          let chord = chords[i];
          clef.push(chord);
          if(chord.len) {
            let chord_length_i = _res / chord.len;
            for(let e = 0; e < chord_length_i - 1; e++) {
              clef.push(_hold);
            }
          }
        }
        resClef(clef);
      }, function(chords) {
        rejClef(chords);
      });

    });
  }

  // generate the chord notes
  function _getChord(_clef_generator, scale, offset, note_count, note_length) {

    return new Promise(function(resNotes, rejNotes) {
      // used note indexes
      let used_note_indexes = [];
      let note_promises = [];
      // generate the notes
      for(let i = 0; i < note_count; i++) {
        note_promises.push(_getNote(_clef_generator, scale, offset, used_note_indexes));
      }
      Promise.all(note_promises).then(function(chord) {
        // console.log("_getNote: promises", chord);
        let abc = _getABC(chord, note_length);
        // add notes to measure
        resNotes({ abc: abc, chord: chord, len: note_length });
      }, function(chord) {
        rejNotes(chord);
      });
    });
  }

  // generate a note
  function _getNote(_clef_generator, scale, offset, used_note_indexes) {
    return new Promise(function(resNote, rejNote) {
      // add the note to the chord
      resNote(_note());

      function _note() {
        // get a random index
        let index = Math.floor(_clef_generator.quick() * scale) + offset;
        // for measuring note is a "good" one.
        let good_note = true;
        // ensure we havent selected this index
        if(used_note_indexes.indexOf(index) !== -1) good_note = false;
        // or one below it
        if(index > 0 && used_note_indexes.indexOf(index - 1) !== -1) good_note = false;
        // or one above it
        if(used_note_indexes.indexOf(index + 1) !== -1) good_note = false;

        // if we found a good note
        if(good_note) {
          // add the index to the used array
          used_note_indexes.push(index);
          // grab the note
          let note = _scale[index];
          // build the tone version of the note
          let n = note.note + note.octave;
          return n;
        } else {
          return _note();
        }
      }
    });
  }





  //////////////
  // ABC MUSICAL NOTATION
  //////////////

  // get abc notation for notes at a certain length
  function _getABC(notes, len) {
    if(!len) return "";
    let str = notes.length > 1 ? "[" : "";
    for(let n = 0; n < notes.length; n++) {
      str += _ABCNotation(notes[n], len);
    }
    str += notes.length > 1 ? "]" : "";
    return str;
  }

  // render the current abc to staff
  function _renderStaff() {
    let $par = document.createElement("div");
    if(_first_one) {
      _first_one = false;
    } else {
      $par.className = "hide";
    }
    //let $el = document.createElement("div");
    // beats per second times four beats * measures per line * 1 second
   // $par.appendChild($el);
   // _staff.appendChild($par);
    _abc += _treb_abc;
    _abc += "\n" + _bass_abc;
    let cleaned = _abc;
    _total_abc += cleaned;
    _abc = _genStaffHeader();
    _treb_abc = "[V: 1] ";
    _bass_abc = "[V: 2] ";
    _renderABC($el, cleaned);
  }

  function _renderABC(el, abc) {
    console.log(abc);
    ABCJS.renderAbc(el, abc, {}, {
      staffwidth: 800,
      paddingright: 0,
      paddingleft: 0,
      scale: 1,
      add_classes: true
    }, {});
  }
  
  // take a measure and generate the abc output
  function _staffABC(measure) {
    let abc = "";
    // TODO: every two measures new line with _gen_meas, _treb_abc, _bass_abc
    for(let i = 0; i < measure.treb.length; i++) {
      if(measure.treb[i].abc) {
        _treb_abc += measure.treb[i].abc + " ";
      }
    }
    for(let i = 0; i < measure.bass.length; i++) {
      if(measure.bass[i].abc) {
        _bass_abc += measure.bass[i].abc + " ";
      }
    }
    _treb_abc = _treb_abc.replace(/ $/g, "|");
    _bass_abc = _bass_abc.replace(/ $/g, "|");

    // abc += [treb, bass].join("\n");
    // return abc;
  }

  
  // generate the staff header
  function _genStaffHeader() {
    return [
      "K:" + _root + _mode,
      "L:1/" + _res,
      "%%staves {1 2}",
      "V: 1 clef=treble",
      "V: 2 clef=bass",
      ""
    ].join("\n");
  }

  // abc notation
  function _ABCNotation(note, length) {
    // note = note.replace(/([A-G])b/,"_$1");
    // TODO: know if this is needed based on mode.
    note = note.replace(/([A-G])b/,"$1");
    note = note
      .replace(/(.)1/, "$1,,,")
      .replace(/(.)2/, "$1,,")
      .replace(/(.)3/, "$1,")
      .replace(/(.)4/, "$1");
    if(note.match(/(.)5|6/)) {
      note = note
        .replace(/(.)5/, "$1")
        .replace(/(.)6/, "$1'")
        .toLowerCase();
    }
    note += _res / length;
    return note;
  }





  //////////////
  // DATA
  //////////////

  // generate the scale
  function _genScale() {
    // generate the scale
    let _steps_lib = _genStepsLib();
    let _notes_lib = _genNotesLib();
    let steps = _steps_lib;
    let start = _notes_lib.indexOf(_root + _min_oct);
    let last_note = (_max_oct - _min_oct) * 8;
    for(let o = 0; o < last_note; o++) {
      let index = start + steps[o % steps.length] + (Math.floor(o / steps.length) * 12);
      let note = _notes_lib[index];
      if(note) {
        _scale.push({ note: note.match(/[^\d]+/)[0], octave: note.match(/\d/)[0] });
      }
    }
    if(!_scale.length) console.error("Too high up. Lower the octave or note count.");
  }

  // potential combinations of note lengths
  // this could be done programmatically.
  function _genLengthSequences() {
    _len_seqs = [
      [1],
      [2,2],
      [2,4,4],
      [2,4,8,8],
      [4,4,4,4],
      [2,8,8,8,8],
      [4,4,4,8,8],
      [8,8,8,8,8,8,8,8],
       [2,4,8,16,16],
       [2,4,16,16,16,16],
       [2,8,8,8,16,16],
       [2,8,8,16,16,16,16],
       [2,8,16,16,16,16,16,16],
       [2,16,16,16,16,16,16,16,16],
       [4,4,4,8,16,16],
       [4,4,4,16,16,16,16],
       [4,4,8,8,16,16,16,16],
       [4,4,8,16,16,16,16,16,16],
       [4,4,16,16,16,16,16,16,16,16],
       [4,8,8,16,16,16,16,16,16,16,16],
       [4,8,16,16,16,16,16,16,16,16,16,16],
       [4,16,16,16,16,16,16,16,16,16,16,16,16],
       [8,8,8,8,8,8,8,16,16],
       [8,8,8,8,8,8,16,16,16,16],
       [8,8,8,8,8,16,16,16,16,16,16],
       [8,8,8,8,16,16,16,16,16,16,16,16],
       [8,8,8,16,16,16,16,16,16,16,16,16,16],
       [8,8,16,16,16,16,16,16,16,16,16,16,16,16],
       [8,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
       [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
    ];
  }

  // set the notes for the key
  function _genStepsLib() {
    // generate major and minor integer step arrays from whole/half notation
    // whole/half note steps for minor and major
    let mode = {
      // ionian:     "W W H W W W H",
      // dorian:     "W H W W W H W",
      // phrygian:   "H W W W H W W",
      // lydian:     "W W W H W W H",
      // mixolydian: "W W H W W H W",
      // aeolian:    "W H W W H W W",
      // locrian:    "H W W H W W W",
      maj:        "W W H W W W H",
      min:        "W H W W H W W",
    }[_mode].split(" ");
    // start each with root step
    let steps = [0];

    // loop through
    let step = 0;
    for(let s = 0; s < mode.length; s++) {
      let key = mode[s];
      if(key === "W") {
        steps.push(steps[s] + 2);
      } else if(key == "WH") {
        steps.push(steps[s] + 3);
      } else {
        steps.push(steps[s] + 1);
      }
      step++;
    }
    return steps;
  }

  // generate every possible note/octave pairing in order
  function _genNotesLib() {
    let notes = [];
    for(let i = 0; i < 9; i++) {
      let n = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
      for(let x = 0; x < n.length; x++) notes.push(n[x] + i);
    }
    return notes;
  }
  




  //////////////
  // TONE.js
  //////////////

  // set the tone js transport
  function _setTransport() {
    _bpm = Math.round(_generator.quick() * 60) + 60;
    Tone.Transport.bpm.value = _bpm;
    Tone.Transport.scheduleRepeat(function(time) {
      _playSong();
    }, _res + "n");
  }

  // set the synthesizer
  function _setSynth() {

    // master compression
    let multiband = new Tone.MultibandCompressor({
      lowFrequency: 200,
      highFrequency: 1300,
      low: { threshold: -12 }
     });

    let reverb = new Tone.Freeverb();
        reverb.roomSize.value = 0.6;
        reverb.wet.value = 0.2;

    Tone.Master.chain(reverb, multiband);

    // _synth = new Tone.PolySynth(6, Tone.SimpleAM).toDestination();
    //new Tone.PolySynth({}, Tone.Synth).toDestination();
    _synth = new Tone.PolySynth({}, Tone.Synth).toDestination();
    _synth.set({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    });

//     _synth.set({
//       envelope: {
//         attack:  0.5,
//         release: 0.5
//       }
//     });

//     _synth.set("carrier", {
//       volume: -8,
//       oscillator: {
//         type: "triangle8",
//         partials: [1, 0.2, 0.01]
//       },
//       envelope: {
//         attack:  0.05,
//         decay:   0.02,
//         sustain: 0.6,
//         release: 0.8
//       }
//     });

    // _synth.set("modulator", {
    //   volume: -16,
    //   oscillator: {
    //     type: "triangle8",
    //     detune: 0,
    //     phase: 90,
    //     partials: [1, 0.2, 0.01]
    //   },
    //   envelope: {
    //     attack:  0.05,
    //     decay:   0.01,
    //     sustain: 1,
    //     release: 1
    //   }
    // });
  }

  



  
  //////////////
  // UTILS
  //////////////

  // shuffle an array
  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function _utilShuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(_generator() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function _utilScrollTo(element, to, duration) {
    if (duration <= 0) return;
    let difference = to - element.scrollTop;
    let perTick = difference / duration * 10;

    setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      _utilScrollTo(element, to, duration - 10);
    }, 10);
  }


}());

export default APP;