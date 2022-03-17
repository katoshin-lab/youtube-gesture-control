import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormControlLabel, Switch, } from '@material-ui/core';
import styled from 'styled-components';
import type Storage from '../types/storage';

const StyledPopupContainer = styled.div`
  padding: 1rem;
  width: 200px;
`;

const Settings = () => {
  const { useState, useEffect } = React;

  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.sync.get(
      ['pageWatcherEnable'],
      (result: Partial<Storage>) => setEnabled(!!result['pageWatcherEnable']),
    )
    console.log(window.matchMedia)
  }, []);

  const handleEnabled = () => {
    setEnabled(!enabled);
    chrome.storage.sync.set({ pageWatcherEnable: !enabled });
  };

  return (
    <StyledPopupContainer>
      <h1>Hello!!!</h1>
      <FormControlLabel
        label={enabled ? '監視中' : '休止中'}
        control={
          (
            <Switch
              checked={enabled}
              onChange={handleEnabled}
            />
          )
        }
      />
    </StyledPopupContainer>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
  document.getElementById('root'),
);
