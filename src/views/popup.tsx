import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Base } from '../app';
import PageWatcher from '../main/pageWatcher';
import { FormControlLabel, Switch, Button } from '@material-ui/core';

const Popup = () => {
  const { useState, useEffect, useRef } = React;

  const pageWatcher = useRef<PageWatcher | undefined>(undefined);
  const [enabled, setEnabled] = useState<boolean>(!!Base.instance);

  useEffect(() => {
    if (!Base.instance) {
      Base.init();
    }
    pageWatcher.current = Base.instance.watcher;
    setEnabled(pageWatcher.current.enabled);
  }, []);

  const handleEnabled = () => {
    setEnabled(!enabled);
    if (pageWatcher.current) {
      pageWatcher.current.enabled = enabled;
    }
  };

  const openSettingTab = () => {
    const url = chrome.runtime.getURL('settings.html');
    chrome.tabs.create({ url });
  }

  const handleClickButton = () => {
    
  }

  return (
    <StyledPopupContainer>
      <h1>Hello!!!</h1>
      <FormControlLabel
        label={enabled ? '監視中' : '休止中'}
        control={
          <Switch
            checked={enabled}
            onChange={handleEnabled}
          />
        }
      />
      <Button variant='contained' onClick={handleClickButton}>アクション</Button>
      <Button variant='outlined' onClick={openSettingTab}>詳細設定</Button>
    </StyledPopupContainer>
  );
};

const StyledPopupContainer = styled.div`
  padding: 1rem;
  width: 200px;
`

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('popup-root'),
);

