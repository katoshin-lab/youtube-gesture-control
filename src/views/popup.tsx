import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormControlLabel, Switch, Button } from '@material-ui/core';
import styled from 'styled-components';
import CaptureWindowManager from '../main/captureWindowManager';
import type SettingStorage from '../types/settingStorage';

const StyledPopupContainer = styled.div`
  padding: 1rem;
  width: 400px;
  .switch-wrapper, .button-wrapper {
    margin: 1rem 0;
  }
`;

const Popup = () => {
  const { useState, useEffect } = React;

  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.sync.get(
      ['openCaptureWindow'],
      (result: Partial<SettingStorage>) => setEnabled(!!result.openCaptureWindow),
    );
  }, []);

  const handleEnabled = () => {
    const updated = !enabled;
    setEnabled(updated);
    chrome.storage.sync.set({ openCaptureWindow: updated });
    if (updated) {
      chrome.runtime.sendMessage(CaptureWindowManager.openCaptureWindowKey);
    } else {
      chrome.runtime.sendMessage(CaptureWindowManager.closeCaptureWindowKey);
    }
  };

  const openSettingTab = () => {
    const url = chrome.runtime.getURL('settings.html');
    chrome.tabs.create({ url });
  };

  return (
    <StyledPopupContainer>
      <h1>Youtube Gesture Contol 👋</h1>
      <div className='switch-wrapper'>
        <FormControlLabel
          label={enabled ? 'ENABLE (Camera ON)' : 'DISABLE (Camera OFF)'}
          control={
            (
              <Switch
                checked={enabled}
                onChange={handleEnabled}
              />
            )
          }
        />
      </div>
      {/* <Button variant='contained' onClick={handleClickButton}>アクション</Button> */}
      <div className="button-wrapper">
        <Button variant='outlined' onClick={openSettingTab} color='inherit'>詳細設定</Button>
      </div>
    </StyledPopupContainer>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('popup-root'),
);
