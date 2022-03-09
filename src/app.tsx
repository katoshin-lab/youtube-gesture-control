import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = (): JSX.Element => {
  return (
    <div>
      <h1>Hello.</h1>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
