import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import SettingForm from './components/settingForm';
import HandPoseDetector from '../main/handPoseDetector';
import RenderPrediction from '../main/handPoseDetector/renderPrediction';
import config from '../config';
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
      position: relative;
      margin-left: 1.5rem;
      border-radius: 4px;
      border: 1px solid #cccccc;
      height: fit-content;
      video, canvas {
        transform: scale(-1, 1);
      }
      video {
        display: ${({ enableCamera }) => (enableCamera ? 'block' : 'none')};
        visibility: hidden;
        width: ${config.capture.width}px;
        height: ${config.capture.height}px;
      }
      canvas {
        min-width: ${config.capture.width * 2}px;
        min-height: ${config.capture.height * 2}px;
        opacity: .1;
      }
      span {
        display: flex;
        padding: .5rem;
        height: 100%;
        align-items: center;
        cursor: pointer;
        text-decoration: underline;
      }
      .fps {
        position: absolute;
        right: 0;
        bottom: -20px;
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

// let count = 0;

const Settings = () => {
  const { useState, useEffect, useRef } = React;

  const videoElm = useRef<HTMLVideoElement>(null);
  const canvasElm = useRef<HTMLCanvasElement>(null);

  const [enabled, setEnabled] = useState<boolean>(false);
  const [enableCamera, setEnableCamera] = useState<boolean>(false);
  const [fps, setFps] = useState(0);

  const setVideoStream = async () => {
    if (navigator.mediaDevices) {
      try {
        const constraints = {
          audio: true,
          video: true,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream && videoElm.current && canvasElm.current) {
          const ctx = canvasElm.current.getContext('2d', { alpha: false });
          const handPoseDetector = new HandPoseDetector(stream, ctx);
          handPoseDetector.setDetectStream();
          videoElm.current.srcObject = stream;
          setEnableCamera(true);
        } else {
          setEnableCamera(false);
        }
      } catch {
        setEnableCamera(false);
      }
    }
  };

  const setFpsCounter = () => {
    setInterval(() => {
      setFps(RenderPrediction.fpsCounter);
      RenderPrediction.fpsCounter = 0;
    }, 1000);
  };

  useEffect(() => {
    chrome.storage.sync.get(
      'openCaptureWindow',
      (result: Partial<SettingStorage>) => setEnabled(!!result.openCaptureWindow),
    );
    setVideoStream();
    setFpsCounter();
  }, []);

  return (
    <StyledPopupContainer enableCamera={enableCamera}>
      <h1>Welcome to Youtube Gesture Contol 👋</h1>
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
            <canvas
              ref={canvasElm}
              width={config.capture.width * 2}
              height={config.capture.height * 2}
            />
            <div className='fps'>
              FPS:
              {fps}
            </div>
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
