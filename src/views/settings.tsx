import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import PageWatcher from '../main/pageWatcher';
import { Base } from '../app';

const Settings = () => {
  const { useState, useEffect } = React;

  // const pageWatcher = useRef<PageWatcher | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    setEnabled(Base.instance.watcher.enabled);
  }, []);

  return (
    <div>
      <h1>Hello!!!</h1>
      <div className="status">
        ステータス:
        {enabled ? '監視中' : '休止中'}
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
  document.getElementById('root'),
);
