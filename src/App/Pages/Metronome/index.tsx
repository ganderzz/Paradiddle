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
import { MetronomePlayer } from "../../Components/Metronome";

interface IProps {
  path: string;
}

interface IState {
  tempo: number;
  subdivision: number;
  showAdditionalInfo: boolean;
}

export class MetronomePage extends React.Component<IProps, IState> {
  public readonly state = {
    showAdditionalInfo: false,
    tempo: 120,
    subdivision: 4,
  };

  public render() {
    return (
      <MetronomePlayer
        bpm={this.state.tempo}
        subdivision={this.state.subdivision}
      >
        {({ onStart, onStop, count, isPlaying }) => (
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
              <div
                style={{
                  gridColumn: "1/2",
                  gridRow: 1,
                  borderRight: "1px solid #888",
                }}
              >
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
                    value={this.state.subdivision}
                    onValueChange={val => this.setState({ subdivision: val })}
                    min={1}
                    allowNumericCharactersOnly
                  />
                </FormGroup>

                <Button
                  icon={isPlaying ? "stop" : "play"}
                  onClick={isPlaying ? onStop : onStart}
                  intent={isPlaying ? "danger" : "primary"}
                >
                  {isPlaying ? "Stop" : "Start"}
                </Button>
              </div>

              <div
                style={{
                  display: "flex",
                  gridColumn: "2/2",
                  gridRow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <H1
                  style={{
                    fontSize: "4rem",
                    ...(count === 1 ? { color: "#0F9960" } : {}),
                  }}
                >
                  {count}
                </H1>
              </div>
            </div>
          </Card>
        )}
      </MetronomePlayer>
    );
  }
}
