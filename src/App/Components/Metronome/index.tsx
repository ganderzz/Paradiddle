import * as React from "react";
import { node } from "prop-types";

interface IProps {
  bpm: number;
  subdivision: number;
  children: (
    data: {
      onStart: () => void;
      onStop: () => void;
      count: number;
      isPlaying: boolean;
    }
  ) => any;
}

interface IState {
  count: number;
  isPlaying: boolean;
}

export class MetronomePlayer extends React.Component<IProps, IState> {
  private AudioCtx =
    (window as any).AudioContext || (window as any).webkitAudioContext;
  private audioContext: AudioContext = new this.AudioCtx();
  private currTime = 0.0;
  private timer;

  public state: IState = {
    count: 1,
    isPlaying: false,
  };

  public componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  public onStart = () => {
    if (!this.state.isPlaying) {
      this.currTime = this.audioContext.currentTime;

      this.setState({ count: 0, isPlaying: true }, () => {
        this.schedule();
      });
    }
  };

  public onStop = () => {
    this.setState({ count: 1, isPlaying: false });
    window.clearTimeout(this.timer);
  };

  public schedule = () => {
    while (this.currTime < this.audioContext.currentTime + 0.1) {
      this.playNote(this.currTime);
      this.updateTime();
      this.setState(prevState => ({
        count:
          prevState.count >= this.props.subdivision ? 1 : prevState.count + 1,
      }));
    }

    this.timer = window.setTimeout(this.schedule, 0.1);
  };

  public updateTime = () => {
    this.currTime += 60.0 / this.props.bpm || 120;
  };

  public playNote = time => {
    const note = this.audioContext.createOscillator();

    if (this.state.count !== 1) {
      note.frequency.value = 200;
    } else {
      note.frequency.value = 300;
    }

    note.connect(this.audioContext.destination);

    note.start(time);
    note.stop(time + 0.05);
  };

  public render() {
    return this.props.children({
      onStart: this.onStart,
      onStop: this.onStop,
      count: this.state.count,
      isPlaying: this.state.isPlaying,
    });
  }
}
