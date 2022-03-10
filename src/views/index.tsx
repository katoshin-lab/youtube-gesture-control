import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PageWatcher from '../main/pageWatcher';

const App = () => {
  const { useState, useEffect, useRef } = React;

  const pageWatcher = useRef<PageWatcher | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    const watcher = new PageWatcher(true);
    setEnabled(watcher.enabled);
    pageWatcher.current = watcher;
    pageWatcher.current.start();
  }, []);

  const handleEnabled = () => {
    setEnabled(!enabled);
    if (pageWatcher.current) {
      pageWatcher.current.enabled = enabled;
    }
  };

  return (
    <div>
      <h1>Hello!!!</h1>
      <input type="checkbox" checked={enabled} onChange={handleEnabled} />
      <div className="status">
        ステータス:
        {enabled ? '監視中' : '休止中'}
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
