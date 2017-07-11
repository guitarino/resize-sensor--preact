import preact from 'preact';
import ResizeSensor from '../../build/resize-sensor';

import '../../build/resize-sensor.css';
import './App.css';

export default class App extends preact.Component {
  constructor() {
    super();
    this.state = {
      example1: {width: 0, height: 0, refresh: Math.random()},
      example2_shown: false,
      example2: {width: 0, height: 0, refresh: Math.random()}
    };
  }
  render() {
    return (
      <div class='App'>

        <div class='App__example-1 App__example'>
          <ResizeSensor
            onResize={(width, height) => {
              this.setState({
                example1: {width: width, height: height, refresh: Math.random()},
                example2_shown: this.state.example2_shown,
                example2: this.state.example2
              })
            }}
          />
          <div class='App_container'>
            <p>Width: {this.state.example1.width}px</p>
            <p>Height: {this.state.example1.height}px</p>
            <p>Random: {this.state.example1.refresh}</p>
          </div>
        </div>

        <button onClick={() => {
          let shown = this.state.example2_shown;
          this.setState({
            example1: this.state.example1,
            example2_shown: !shown,
            example2: this.state.example2
          });
        }}>Toggle another example</button>

        <div class={'App__example-2 App__example' + (this.state.example2_shown ? '' : ' hidden')}>
          <ResizeSensor
            onResize={(width, height) => {
              this.setState({
                example1: this.state.example1,
                example2_shown: this.state.example2_shown,
                example2: {width: width, height: height, refresh: Math.random()}
              })
            }}
          />
          <div class='App_container'>
            <p>Width: {this.state.example2.width}px</p>
            <p>Height: {this.state.example2.height}px</p>
            <p>Random: {this.state.example2.refresh}</p>
          </div>
        </div>

      </div>
    );
  }
};

export function renderApp(where) {
  preact.render(
    <App />,
    where
  );
}