import * as React from "react";

const metronomeWorker = require("./metronome.worker");

import {
  ACTION_START,
  ACTION_STOP,
  ACTION_UPDATE,
  ACTION_TICK,
  TICKS_PER_BEAT_BINARY,
  TICKS_PER_BEAT_TERNARY,
  SECONDS_IN_MINUTE,
  SCHEDULE_AHEAD_TIME,
  NOTE_LENGTH,
} from "./constants";

class Metronome extends React.Component<any, any> {
  private ticksPerBeat;
  private timerWorker;
  private audioContext;
  private nextNoteTime = 0;
  private currentBeat = 1;

  constructor(props) {
    super(props);

    if (this.props.subdivision < 1 || this.props.subdivision > 4) {
      throw new Error(
        `test: the \`subdivision\` prop must be between 1 and 4.`
      );
    }

    this.ticksPerBeat =
      this.props.beatsPerMeasure % 3 === 0 || this.props.subdivision % 3 === 0
        ? TICKS_PER_BEAT_TERNARY
        : TICKS_PER_BEAT_BINARY;
    this.timerWorker = new metronomeWorker();
    this.audioContext = new ((window as any).AudioContext ||
      (window as any).webkitAudioContext)();

    this.state = {
      beat: 0,
      subBeat: 0,
      playing: this.props.autoplay === true,
      subdivision: this.props.subdivision,
    };
  }

  public componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.beatsPerMeasure !== this.props.beatsPerMeasure ||
      prevProps.subdivision !== this.props.subdivision
    ) {
      this.ticksPerBeat =
        this.props.beatsPerMeasure % 3 === 0 || this.props.subdivision % 3 === 0
          ? TICKS_PER_BEAT_TERNARY
          : TICKS_PER_BEAT_BINARY;
    }
  }

  public componentDidMount() {
    this.timerWorker.onmessage = event => {
      if (event.data === ACTION_TICK) {
        this.runScheduler();
      }
    };

    this.state.playing && this.start();
  }

  public componentWillUnmount() {
    this.timerWorker.postMessage({
      action: ACTION_STOP,
    });
  }

  public runScheduler = () => {
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + SCHEDULE_AHEAD_TIME
    ) {
      this.tick(this.currentBeat, this.nextNoteTime);

      const secondsPerBeat = SECONDS_IN_MINUTE / this.props.tempo;
      this.nextNoteTime +=
        (this.props.beatsPerMeasure / this.ticksPerBeat) * secondsPerBeat;
      this.currentBeat++;

      if (this.currentBeat === this.ticksPerBeat) {
        this.currentBeat = 0;
      }
    }
  };

  private tick = (beat, time) => {
    const isFirstBeat = beat === 0;
    const isQuarterBeat =
      beat % (this.ticksPerBeat / this.props.beatsPerMeasure) === 0;
    const isTripletBeat =
      this.ticksPerBeat === TICKS_PER_BEAT_TERNARY &&
      beat % (this.ticksPerBeat / this.props.beatsPerMeasure) !== 0;
    const isEighthBeat =
      beat % (this.ticksPerBeat / (this.props.beatsPerMeasure * 2)) === 0;

    let playTick = false;

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    if (this.state.subdivision === 4) {
      playTick = true;
      osc.frequency.setTargetAtTime(
        this.props.subdivisionFrequency,
        this.audioContext.currentTime,
        0.001
      );
      gainNode.gain.setTargetAtTime(
        this.props.subdivisionVolume,
        this.audioContext.currentTime,
        0.001
      );
    }

    if (this.state.subdivision === 3 && isTripletBeat) {
      playTick = true;
      osc.frequency.setTargetAtTime(
        this.props.subdivisionFrequency,
        this.audioContext.currentTime,
        0.001
      );
      gainNode.gain.setTargetAtTime(
        this.props.subdivisionVolume,
        this.audioContext.currentTime,
        0.001
      );
    }

    if (this.state.subdivision === 2 && isEighthBeat) {
      playTick = true;
      osc.frequency.setTargetAtTime(
        this.props.subdivisionFrequency,
        this.audioContext.currentTime,
        0.001
      );
      gainNode.gain.setTargetAtTime(
        this.props.subdivisionVolume,
        this.audioContext.currentTime,
        0.001
      );
    }

    if (isQuarterBeat) {
      playTick = true;
      osc.frequency.setTargetAtTime(
        this.props.subdivisionFrequency,
        this.audioContext.currentTime,
        0.001
      );
      gainNode.gain.setTargetAtTime(
        this.props.beatVolume,
        this.audioContext.currentTime,
        0.001
      );
    }

    if (isFirstBeat) {
      playTick = true;
      osc.frequency.setTargetAtTime(
        this.props.beatFrequency,
        this.audioContext.currentTime,
        0.0001
      );
      gainNode.gain.setTargetAtTime(
        this.props.beatVolume,
        this.audioContext.currentTime,
        0.001
      );
    }

    if (isFirstBeat || isQuarterBeat) {
      this.setState(
        state => ({
          beat:
            state.beat === this.props.beatsPerMeasure ? 1 : state.beat + 1 || 1,
        }),
        () => {
          this.props.onTick(this.state);
        }
      );
    }

    if (playTick) {
      osc.start(time);
      osc.stop(time + NOTE_LENGTH);

      this.setState(
        state => ({
          subBeat:
            state.subBeat === this.state.subdivision
              ? 1
              : state.subBeat + 1 || 1,
        }),
        () => {
          this.props.onSubtick(this.state);
        }
      );
    }
  };

  private start = () => {
    this.currentBeat = 0;
    this.nextNoteTime = this.audioContext.currentTime;

    this.timerWorker.postMessage({
      action: ACTION_START,
      tempo: this.props.tempo,
      subdivision: this.state.subdivision,
    });

    this.setState(
      {
        beat: 0,
        playing: true,
      },
      () => {
        this.props.onStart(this.state);
      }
    );
  };

  private stop = () => {
    this.timerWorker.postMessage({
      action: ACTION_STOP,
    });

    this.setState(
      {
        playing: false,
      },
      () => {
        this.props.onStop(this.state);
      }
    );
  };

  private onPlay = () => {
    this.state.playing ? this.stop() : this.start();
  };

  private onTempoChange = tempo => {
    this.timerWorker.postMessage({
      action: ACTION_UPDATE,
    });
  };

  public render() {
    return this.props.render({
      ...this.state,
      tempo: this.props.tempo,
      onTempoChange: this.onTempoChange,
      onPlay: this.onPlay,
    });
  }

  static defaultProps = {
    tempo: 120,
    beatsPerMeasure: 4,
    subdivision: 1,
    beatFrequency: 880,
    beatVolume: 0.75,
    subdivisionFrequency: 440,
    subdivisionVolume: 0.5,
    autoplay: false,
    render: () => null,
    onTick: () => {},
    onSubtick: () => {},
    onStart: () => {},
    onStop: () => {},
  };
}

export default Metronome;