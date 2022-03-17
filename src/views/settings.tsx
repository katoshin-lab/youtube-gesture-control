import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormControlLabel, Switch, } from '@material-ui/core';
import styled from 'styled-components';
import type Storage from '../types/storage';

const StyledPopupContainer = styled.div`
  padding: 1rem;
  .switch, .video-container {
    margin: 2rem 0;
  }
  video {
    width: 160px;
    height: 90px;
  }
`;

const Settings = () => {
  const { useState, useEffect, useRef } = React;

  const videoElm = useRef<HTMLVideoElement>(null);

  const [enabled, setEnabled] = useState<boolean>(false);

  const setVideoStream = async () => {
    if (navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoElm.current!.srcObject = stream;
    }
  }

  useEffect(() => {
    chrome.storage.sync.get(
      ['pageWatcherEnable'],
      (result: Partial<Storage>) => setEnabled(!!result['pageWatcherEnable']),
    )
    setVideoStream();
  }, []);

  const handleEnabled = () => {
    setEnabled(!enabled);
    chrome.storage.sync.set({ pageWatcherEnable: !enabled });
  };

  return (
    <StyledPopupContainer>
      <h1>Welcome to Youtube Gesture Contol 👋</h1>
      <FormControlLabel
        label={enabled ? 'ENABLE (Your gesture works when the active tab url is \'www.youtube.com\'.)' : 'DISABLE'}
        control={
          (
            <Switch
              checked={enabled}
              onChange={handleEnabled}
            />
          )
        }
        className='switch'
      />
      <div className='video-container'>
        <video
          ref={videoElm}
          autoPlay
          playsInline
          muted
        />
      </div>
    </StyledPopupContainer>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
  document.getElementById('root'),
);
