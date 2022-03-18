import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormControlLabel, Switch, } from '@material-ui/core';
import styled from 'styled-components';
import type Storage from '../types/storage';

type StyledProps = { enableCamera: boolean };

const StyledPopupContainer = styled.div<StyledProps>`
  padding: 1rem;
  .switch, .io-wrapper {
    margin: 2rem 0;
  }
  .io-wrapper {
    display: flex;
    margin-left: 1.5rem;
    >div {
      margin-left: 1.5rem;
      width: 160px;
      height: 90px;
      border-radius: 4px;
      border: 1px solid #cccccc;
      video, canvas {
        display: ${({ enableCamera }) => enableCamera ? 'block' : 'none'};
        width: 100%;
        height: 100%;
        transform: scale(-1, 1);
      }
      span {
        display: flex;
        padding: .5rem;
        height: 100%;
        align-items: center;
        cursor: pointer;
        text-decoration: underline;
      }
    }
    >div:first-of-type {
      margin-left: 0;
    }
  }
  @media (prefers-color-scheme: dark) {
    .io-wrapper >div {
      border-color: #333333;
    }
  }
`;

const Settings = () => {
  const { useState, useEffect, useRef } = React;

  const videoElm = useRef<HTMLVideoElement>(null);
  const canvasElm = useRef<HTMLCanvasElement>(null);

  const [enabled, setEnabled] = useState<boolean>(false);
  const [enableCamera, setEnableCamera] = useState<boolean>(false)

  const setVideoStream = async () => {
    if (navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoElm.current!.srcObject = stream;
      stream && setEnableCamera(true)
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
    <StyledPopupContainer enableCamera={enableCamera}>
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
      <div className="io-wrapper">
        <div>
          <video
            ref={videoElm}
            autoPlay
            playsInline
            muted
          />
          <span onClick={setVideoStream}>{ enableCamera || 'Please enable camera access.' }</span>
        </div>
        <div>
          <canvas ref={canvasElm} />
        </div>
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
