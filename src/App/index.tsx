import * as React from "react";
import { Router, Link } from "@reach/router";
import { Navbar, Classes } from "@blueprintjs/core";
import { Homepage } from "./Pages/Homepage";
import { MetronomePage } from "./Pages/Metronome";

export default class App extends React.Component {
  public render() {
    return (
      <div style={{ height: "inherit", background: "#F1F1F1" }}>
        <Navbar className={Classes.DARK}>
          <Navbar.Group>
            <Navbar.Heading style={{ fontWeight: 600 }}>
              <Link {...{ to: "/", style: { color: "#FFF" } }}>
                🥁 Paradiddle
              </Link>
            </Navbar.Heading>

            <Navbar.Divider />

            <Link
              {...{ to: "metronome", style: { color: "#FFF", marginLeft: 15 } }}
            >
              Metronome
            </Link>
          </Navbar.Group>
        </Navbar>

        <section style={{ maxWidth: "95vw", margin: "20px auto" }}>
          <Router>
            <Homepage path="/" />
            <MetronomePage path="/metronome" />
          </Router>
        </section>
      </div>
    );
  }
}
