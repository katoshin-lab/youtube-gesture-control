import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormControlLabel, Switch, Button } from '@material-ui/core';
import styled from 'styled-components';
import Base from '../app';
// import PageWatcher from '../main/pageWatcher';

const StyledPopupContainer = styled.div`
  padding: 1rem;
  width: 200px;
`;

const Popup = () => {
  const { useState, useEffect } = React;

  const [enabled, setEnabled] = useState<boolean>(!!Base.instance);

  useEffect(() => {
    setEnabled(!!Base.instance.watcher?.enabled);
  }, []);

  const handleEnabled = () => {
    setEnabled(!enabled);
    if (Base.instance?.watcher) {
      Base.instance.watcher.enabled = enabled;
    }
  };

  const openSettingTab = () => {
    const url = chrome.runtime.getURL('settings.html');
    chrome.tabs.create({ url });
  };

  const handleClickButton = () => {
    console.log('アクション', Base.instance.watcher)
    if (Base.instance?.watcher?.enabled) {
      Base.instance.watcher.tabPageHandler?.pauseVideo();
    } else {
      console.log('not enabled')
    }
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
      <Button variant='contained' onClick={handleClickButton}>アクション</Button>
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
