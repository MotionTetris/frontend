import styled, { keyframes } from 'styled-components';

export interface Block {
    x: number;
    y: number;
}

export type Tetriminos = {
    [key in 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L']: Block[];
};

const blockColors = ['#E16B8C', '#64363C', '#F596AA', '#F17C67', '#58B2DC', '#7ebeab', '#6a4c9c', '#7DB9DE'];
export const tetriminos = {
    I: { shape: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }], color: blockColors[0] },
    O: { shape: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], color: blockColors[1] },
    T: { shape: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: blockColors[2] },
    S: { shape: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 2, y: 0 }], color: blockColors[3] },
    Z: { shape: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: blockColors[4] },
    J: { shape: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: blockColors[5] },
    L: { shape: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: blockColors[6] }
};

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg); // 화면 높이만큼 이동
    opacity: 1;
  }
`;

export const TetrisBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  overflow: hidden;
  z-index: -1;

.tetrimino {
    position: absolute;
    bottom: ${() => 50 + Math.random() * 50}vh; // 무작위 시작 위치 (수직)
    left: ${() => Math.random() * 100}vw; // 무작위 시작 위치 (수평)
    animation: ${floatAnimation} 05s linear infinite;
    animation-direction: alternate; // 애니메이션 방향을 alternate로 설정
    animation-delay: ${() => Math.random()*5}s; //
.block {
      position: absolute;
      width: 50px; // 너비 조정
      height: 50px; // 높이 조정
      background-color: ${props => props.color}; // 각 블록별 색상
      border: 1px solid #000; // 블록 테두리
      opacity: 0.7;
    }
  }
`;



export const GameDashboardContainer = styled.div`
    position: relative;
    
`;

export const ProfileHeader = styled.span`
  position: absolute;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  color: gray;
  top:20vh;
  left: 4vw;
  font-size: 42px;
  display: flex;
`;

export const ProfileChange = styled.span`
  position: absolute;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  color: gray;
  top:30vh;
  left: 30vw;
  font-size: 32px;
  display: flex;
`;

export const FormContainer = styled.div`
  position: relative;
  top:45vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const Input = styled.input`
  position: relative;
  width: 340px;
  height: 40px;
  font-size: 16px;
  padding-left: 40px;
  border-radius: 66px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  transition: box-shadow 0.3s ease;
  &:hover,
  &:focus {
    box-shadow: 0 0 10px #dcd6f7;
  }
  &::placeholder {
    position: relative;
    font-size: 16px;
    top: 2px;
    color: rgba(128, 128, 128, 0.6);
    font-family: "JalnanGothic", sans-serif;
  }
`;


export const Button = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

  &:hover {
    background-color: #45a049;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    box-shadow: none;
  }
`;


export const ByeButton = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  color: white;
  background-color: red;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

  &:hover {
    background-color: #ff0e00 ;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }

`;
