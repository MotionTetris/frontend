import styled from "styled-components";

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
  width: 60px;
  height:60px;
  &:active {
    transform: scale(0.95);
    background-color: #cc0000;
  }

  ${VolumeControl}:hover & {
    background-color: #cc0000;
  }
`;
