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
  H1,
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

export class MetronomePage extends React.Component<IProps, IState> {
  public readonly state = {
    showAdditionalInfo: false,
    tempo: 120,
    beatsPerMeasure: 5,
  };

  public render() {
    return (
      <Metronome
        tempo={this.state.tempo}
        beatsPerMeasure={this.state.beatsPerMeasure}
        render={({ onPlay, playing, beat }) => (
          <Card elevation={Elevation.TWO}>
            <H5>
              Metronome{" "}
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
                This is a classic metronome tool.
              </Callout>
            </Collapse>

            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <div style={{ gridColumn: "1/2", gridRow: 1, borderRight: "1px solid #888" }}>
                <FormGroup
                  label="Tempo"
                  helperText="How fast we will go"
                  labelFor="bpm-input"
                >
                  <NumericInput
                    id="bpm-input"
                    leftIcon="time"
                    value={this.state.tempo}
                    onValueChange={val => this.setState({ tempo: val })}
                    min={1}
                    allowNumericCharactersOnly
                  />
                </FormGroup>

                <FormGroup
                  label="Beats per measure"
                  helperText="Number of notes"
                  labelFor="bpm-input"
                >
                  <NumericInput
                    id="bpm-input"
                    leftIcon="time"
                    value={this.state.beatsPerMeasure}
                    onValueChange={val => this.setState({ beatsPerMeasure: val })}
                    min={1}
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
              </div>

              <div
                style={{ gridColumn: "2/2", gridRow: 1, textAlign: "center" }}
              >
                <H1 style={beat === 1 ? { color: "#0F9960" } : {}}>{beat}</H1>
              </div>
            </div>
          </Card>
        )}
      />
    );
  }
}
