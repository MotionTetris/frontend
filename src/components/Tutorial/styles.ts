import styled from 'styled-components';

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const NavigationButton = styled.button`
  position: absolute;
  bottom: 10px;
`;

export const LeftButton = styled(NavigationButton)`
  left: 10px;
`;

export const RightButton = styled(NavigationButton)`
  right: 10px;
`;