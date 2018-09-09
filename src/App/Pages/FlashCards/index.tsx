import * as React from "react";
import {
  Card,
  Button,
  Elevation,
  FormGroup,
  NumericInput,
  Icon,
  Collapse,
  Callout,
  H5,
} from "@blueprintjs/core";
import Metronome from "../../Components/Metronome";

interface IProps {
  path: string;
}

interface IState {
  tempo: number;
  beatsPerMeasure: number;
  showAdditionalInfo: boolean;
}

export class FlashCards extends React.Component<IProps, IState> {
  public readonly state = {
    showAdditionalInfo: false,
    tempo: 60,
    beatsPerMeasure: 4,
  };

  public render() {
    return (
      <Metronome
        tempo={this.state.tempo}
        beatsPerMeasure={this.state.beatsPerMeasure}
        render={({ onPlay, playing, beat, tempo }) => (
          <Card elevation={Elevation.TWO}>
            <H5>
              Flash Cards{" "}
              <Button
                minimal
                onClick={() =>
                  this.setState({
                    showAdditionalInfo: !this.state.showAdditionalInfo,
                  })
                }
              >
                <Icon icon="info-sign" />
              </Button>
            </H5>

            <Collapse
              keepChildrenMounted
              isOpen={this.state.showAdditionalInfo}
            >
              <Callout intent="primary" style={{ marginBottom: 20 }}>
                Flash Cards will display a random sticking pattern. After 4
                bars, a new pattern will be shown. Try to keep up.
              </Callout>
            </Collapse>

            <FormGroup
              label="BPM"
              helperText="How fast we will go"
              labelFor="bpm-input"
            >
              <NumericInput
                id="bpm-input"
                leftIcon="time"
                value={this.state.tempo}
                onValueChange={val => this.setState({ tempo: val })}
                allowNumericCharactersOnly
              />
            </FormGroup>

            <FormGroup
              label="Beats per Measure"
              helperText="Determines the length of the pattern"
              labelFor="bpm-input"
            >
              <NumericInput
                id="bpm-input"
                leftIcon="property"
                value={this.state.beatsPerMeasure}
                onValueChange={val => this.setState({ beatsPerMeasure: val })}
                allowNumericCharactersOnly
              />
            </FormGroup>

            <Button
              icon={playing ? "stop" : "play"}
              onClick={onPlay}
              intent={playing ? "danger" : "primary"}
            >
              {playing ? "Stop" : "Start"}
            </Button>
          </Card>
        )}
      />
    );
  }
}
