import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  intervalId: NodeJS.Timeout | null,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      intervalId: null, // To keep track of the interval ID
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    return (<Graph data={this.state.data}/>);
  }

  /**
   * Get new data from the server and update the state with the new data
   */
  getDataFromServer() {
    const intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100);

    this.setState({ intervalId });
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              this.getDataFromServer();
            }}
            disabled={!!this.state.intervalId} // Disable button after starting the stream
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
