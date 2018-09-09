import * as React from "react";
import { Card, Elevation, H2 } from "@blueprintjs/core";

interface IProps {
  path: string;
}

export class Homepage extends React.Component<IProps> {
  public render() {
    return (
      <Card elevation={Elevation.TWO}>
        <H2>Welcome to Paradiddle 🥁</H2>

        <p>
          Paradiddle is a learning tool for practicing drumming and timing.
          Choose from the menu above to get started.
        </p>
      </Card>
    );
  }
}
