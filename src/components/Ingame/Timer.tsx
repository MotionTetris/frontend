import React from "react";
import { LeftTime } from "./styles";
import styled, { css, keyframes } from 'styled-components';

export interface TimerProps {
    timeLeft: string 
}

interface ProgressBarProps {
    progress: number;
}

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const ProgressBarContainer = styled.div<ProgressBarProps>`
  position: absolute;
  top: 50px;
  right: 705px;
  width: 500px;
  height: 30px;
  background: ${(props) => props.progress >= (150/180) * 100 ? 'red' : '#3A4CA8'};
  border-radius: 15px;

  ${(props) => props.progress >= (150/180) * 100 && css`
    animation: ${blink} 0.5s linear infinite;
  `}
`;

const ProgressBar = styled.div<ProgressBarProps>`
  position: absolute;
  left: 0; 
  width: ${(props) => props.progress}%;
  height: 100%;
  background: #eee;
  transition: all 0.5s ease;
  border-radius: 15px;
`;

export const Timer: React.FC<TimerProps> = ({timeLeft}: TimerProps) => {
    const maxTime = 3 * 60;

    const [minutes, seconds] = timeLeft.split(':').map(Number);

    const timeLeftSeconds = minutes * 60 + seconds;

    let progress = ((maxTime - timeLeftSeconds) / maxTime) * 100;
    progress = Math.min(progress, 100);
    return (
        <>
          <LeftTime>남은시간: {timeLeft}</LeftTime>
          <ProgressBarContainer progress={progress}>
            <ProgressBar progress={progress} />
          </ProgressBarContainer>
        </>
      )
}
