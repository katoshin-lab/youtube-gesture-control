import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormControlLabel, Switch, Button } from '@material-ui/core';
import styled from 'styled-components';
import type Storage from '../types/storage';

const StyledPopupContainer = styled.div`
  padding: 1rem;
  width: 200px;
`;

const Popup = () => {
  const { useState, useEffect } = React;

  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.sync.get(
      ['pageWatcherEnable'],
      (result: Partial<Storage>) => setEnabled(!!result['pageWatcherEnable']),
    )
  }, []);

  const handleEnabled = () => {
    setEnabled(!enabled);
    chrome.storage.sync.set({ pageWatcherEnable: !enabled });
  };

  const openSettingTab = () => {
    const url = chrome.runtime.getURL('settings.html');
    chrome.tabs.create({ url });
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
      {/* <Button variant='contained' onClick={handleClickButton}>アクション</Button> */}
      <Button variant='outlined' onClick={openSettingTab}>詳細設定</Button>
    </StyledPopupContainer>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('popup-root'),
);
