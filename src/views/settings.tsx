import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import SettingForm from './components/settingForm';
import type SettingStorage from '../types/settingStorage';

type StyledProps = { enableCamera: boolean };

const StyledPopupContainer = styled.div<StyledProps>`
  padding: 1rem;
  h2 {
    margin-top: 4rem;
    padding-left: 1rem;
    font-weight: bold;
    border-left: 5px solid #1166ff;
  }
  h3 {
    margin-top: 2rem;
    padding-left: .75rem;
    border-left: 5px solid #55aaff;
  }
  .io-wrapper, .setting-wrapper {
    margin: 2rem 0;
    margin-left: 2rem;
    .switch-title {
      font-weight: bold;
      font-size: .9rem;
    }
    .explanation {
      margin-top: -.1rem;
    }
  }
  .capture-display {
    display: flex;
    >div {
      margin-left: 1.5rem;
      width: 160px;
      height: 90px;
      border-radius: 4px;
      border: 1px solid #cccccc;
      video, canvas {
        display: ${({ enableCamera }) => (enableCamera ? 'block' : 'none')};
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
  const [enableCamera, setEnableCamera] = useState<boolean>(false);

  const setVideoStream = async () => {
    if (navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoElm.current!.srcObject = stream;
        setEnableCamera(!!stream);
      } catch {
        setEnableCamera(false);
      }
    }
  };

  useEffect(() => {
    chrome.storage.sync.get(
      'captureGestureEnable',
      (result: Partial<SettingStorage>) => setEnabled(!!result.captureGestureEnable),
    );
    setVideoStream();
  }, []);

  // const handleEnabled = () => {
  //   setEnabled(!enabled);
  //   chrome.storage.sync.set({ captureGestureEnable: !enabled });
  // };

  return (
    <StyledPopupContainer enableCamera={enableCamera}>
      <h1>Welcome to Youtube Gesture Contol 👋</h1>
      {/* <div className="switch-wrapper">
        <p className='switch-title'>Enable Gestrue Control?</p>
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
      </div> */}
      <h2>Capture</h2>
        <div className="io-wrapper">
        <p style={{ display: 'block' }}>{enabled ? 'Capturing your hands! You are able to control youtube video with hand gesture!' : ''}</p>
        <div className="capture-display">
          <div>
            <video
              ref={videoElm}
              autoPlay
              playsInline
              muted
            />
            {enableCamera || <span onClick={setVideoStream}>Please enable camera access.</span>}
          </div>
          <div>
            <canvas ref={canvasElm} />
          </div>
        </div>
          
        </div>
      <h2>Settings</h2>
      <div className="setting-wrapper">
        <SettingForm />
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
