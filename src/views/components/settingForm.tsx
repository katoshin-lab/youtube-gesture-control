import * as React from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';
import type SettingStorage from '../../types/settingStorage';

const SettingForm = () => {
  const { useState, useEffect } = React;

  const [enableStartupOpen, setEnableStartupOpen] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(
      'startupOpen',
      (result: Partial<SettingStorage>) => setEnableStartupOpen(!!result.startupOpen),
    );
  }, []);

  const handleSwitch = <T, >(
    key: string,
    val: T, setState: React.Dispatch<React.SetStateAction<T>>,
  ) => {
    chrome.storage.sync.set({ [key]: val });
    setState(val);
  };

  return (
    <div className="switch-wrapper">
      <h3>Auto Start Up</h3>
      <FormControlLabel
        label={enableStartupOpen ? 'ENABLE' : 'DISABLE'}
        control={
            (
              <Switch
                checked={enableStartupOpen}
                onChange={() => handleSwitch<boolean>('startupOpen', !enableStartupOpen, setEnableStartupOpen)}
              />
            )
          }
      />
      <p className="explanation">
        {enableStartupOpen
          ? 'Open this window when the browser starts up or toggle this extension on.'
          : 'This window will not open unless you toggle the switch on the popup window.'}
      </p>
    </div>
  );
};

export default SettingForm;
