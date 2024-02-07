import styled from "styled-components";
import { Range } from 'react-range';

export const VolumeControl = styled.div`
  position: fixed;
  z-index: 1000;
  bottom: 20px;
  right: 20px;
`;
export const VolumeButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #ff0000;
  color: #ffffff;

  &:active {
    transform: scale(0.95);
    background-color: #cc0000;
  }

  ${VolumeControl}:hover & {
    background-color: #cc0000;
  }
`;


export const VolumeThumb = styled.div`
  height: 42px;
  width: 42px;
  border-radius: 4px;
  background-color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 6px #AAA;
`;

export const VolumeTooltip = styled.div`
  position: absolute;
  top: -28px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  font-family: Arial,Helvetica Neue,Helvetica,sans-serif;
  padding: 4px;
  border-radius: 4px;
  background-color: #548BF4;
`