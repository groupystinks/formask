import * as React from 'react';
import './style/app.css';
import Section from './components/common/Section';
import i18n from './i18n/i18n';
import DemoCode from './components/common/Demo';
import DynamicSchema from './cases/DynamicSchema';
import HookComponents from './cases/HookComponents';
import Async from './cases/Async';

// Override others loader (babel, for example) to only use raw-loader.
import DynamicSchemaRaw from '!raw-loader!./cases/DynamicSchema'; // eslint-disable-line
import HookComponentsRaw from '!raw-loader!./cases/HookComponents'; // eslint-disable-line
import AsyncRaw from '!raw-loader!./cases/Async'; // eslint-disable-line

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Section title={i18n['dynamic.schema']}>
          <DemoCode
            component={DynamicSchema}
            sourceCode={DynamicSchemaRaw}
          />
        </Section>
        <Section title={i18n['hook.components']}>
          <DemoCode
            component={HookComponents}
            sourceCode={HookComponentsRaw}
          />
        </Section>
        <Section title={i18n['async']}>
          <DemoCode
            component={Async}
            sourceCode={AsyncRaw}
          />
        </Section>
      </div>
    );
  }
}

export default App;
