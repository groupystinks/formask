import * as React from 'react';
import './style/app.css';

import DynamicSchema from './cases/DynamicSchema';
import HookComponents from './cases/HookComponents';
import Async from './cases/Async';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <DynamicSchema />
        <HookComponents />
        <Async />
      </div>
    );
  }
}

export default App;
