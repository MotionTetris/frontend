import styled, { keyframes } from 'styled-components';


const Gradient = keyframes`
  0% {
    background-position: 0% 0%;
  }
  25% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
`;


const morph = keyframes`
  0% {
    border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
  }
  100% {
    border-radius: 40% 60%;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

export const BackgroundColor3 = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: -moz-linear-gradient(45deg, #333a56 0%, #4a5480 25%, #5a6789 50%, #a284b5 75%, #c89bb1 90%, #e8c0a9 100%);
    background: -webkit-linear-gradient(45deg, #333a56 0%, #4a5480 25%, #5a6789 50%, #a284b5 75%, #c89bb1 90%, #e8c0a9 100%);
    background: linear-gradient(45deg, #333a56 0%, #4a5480 25%, #5a6789 50%, #a284b5 75%, #c89bb1 90%, #e8c0a9 100%);
    background-size: 400% 400%;
    animation: ${Gradient} 15s ease infinite;
    min-height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-evenly;
    overflow: hidden;

  &::before, 
  &::after {
    content: "";
    width: 70vmax;
    height: 70vmax;
    position: absolute;
    background: rgba(255, 255, 255, 0.07);
    left: -20vmin;
    top: -20vmin;
    animation: ${morph} 15s linear infinite alternate, ${spin} 20s linear infinite;
    z-index: 1;
    will-change: border-radius, transform;
    transform-origin: 30% 30%;
    pointer-events: none; 
  }
  &::after {
    width: 70vmin;
    height: 70vmin;
    left: auto;
    right: -10vmin;
    top: auto;
    bottom: 0;
    animation: ${morph} 10s linear infinite alternate, ${spin} 26s linear infinite reverse;
    transform-origin: 10% 10%; 
  }
  
`;


/*      <BackgroundColor1>
  {Array.from({length: 10}).map((_, index) => (
    <Circle key={index}></Circle>
  ))}
</BackgroundColor1>
*/

const animate = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
`;

export const Circle = styled.li`
  position: absolute;
  display: block;
  list-style: none;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  animation: ${animate} linear infinite;
  bottom: -150px;
  z-index: -1;

  &:nth-child(1) {
    left: 80%;
    width: 83px;
    height: 83px;
    bottom: -83px;
    animation-delay: 1s;
    animation-duration: 11s;
  }
  &:nth-child(2) {
    left: 19%;
    width: 144px;
    height: 144px;
    bottom: -144px;
    animation-delay: 1s;
    animation-duration: 6s;
  }
  &:nth-child(3) {
    left: 45%;
    width: 144px;
    height: 144px;
    bottom: -144px;
    animation-delay: 1s;
    animation-duration: 18s;
  }
  &:nth-child(4) {
    left: 84%;
    width: 134px;
    height: 134px;
    bottom: -134px;
    animation-delay: 10s;
    animation-duration: 31s;
  }
  &:nth-child(5) {
    left: 48%;
    width: 122px;
    height: 122px;
    bottom: -122px;
    animation-delay: 14s;
    animation-duration: 41s;
  }
  &:nth-child(6) {
    left: 21%;
    width: 129px;
    height: 129px;
    bottom: -129px;
    animation-delay: 24s;
    animation-duration: 11s;
  }
  &:nth-child(7) {
    left: 65%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
    animation-duration: 51s;
  }
  &:nth-child(8) {
    left: 51%;
    width: 103px;
    height: 103px;
    bottom: -103px;
    animation-delay: 20s;
    animation-duration: 21s;
  }
  &:nth-child(9) {
    left: 77%;
    width: 82px;
    height: 82px;
    bottom: -82px;
    animation-delay: 2s;
    animation-duration: 11s;
  }
  &:nth-child(10) {
    left: 88%;
    width: 125px;
    height: 125px;
    bottom: -125px;
    animation-delay: 41s;
    animation-duration: 41s;
  }
  &:nth-child(11) {
    left: 42%;
    width: 83px;
    height: 83px;
    bottom: -83px;
    animation-delay: 8s;
    animation-duration: 31s;
  }
  &:nth-child(12) {
    left: 8cap;
    width: 100px;
    height: 100px;
    bottom: -100px;
    animation-delay: 1s;
    animation-duration: 11s;
  }
  &:nth-child(13) {
    left: 69%;
    width: 128px;
    height: 128px;
    bottom: -128px;
    animation-delay: 47s;
    animation-duration: 7s;
  }
`;


export const BackgroundColor1 = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  overflow: hidden;
  z-index: -1;
`;

//

/*      <BackgroundColor2>
  {Array.from({length: 7}).map((_, index) => (
    <Span key={index}></Span>
  ))}
</BackgroundColor2>
*/

const move = keyframes`
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
`;

export const BackgroundColor2 = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #3E1E68;
  overflow: hidden;
`;

export const Span = styled.span`
  width: 17vmin;
  height: 17vmin;
  border-radius: 17vmin;
  backface-visibility: hidden;
  position: absolute;
  animation: ${move};
  animation-duration: 45s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  &:nth-child(1) {
    color: #FFACAC;
    top: 23%;
    left: 84%;
    animation-duration: 52s;
    animation-delay: -5s;
    transform-origin: -11vw 1vh;
    box-shadow: 34vmin 0 5vmin currentColor;
  }
  &:nth-child(2) {
    color: #E45A84;
    top: 72%;
    left: 10%;
    animation-duration: 22s;
    animation-delay: 13s;
    transform-origin: 4vw 17vh;
    box-shadow: 20vmin 0 5vmin currentColor;
  }
  &:nth-child(2) {
    color: #E45A84;
    top: 72%;
    left: 10%;
    animation-duration: 22s;
    animation-delay: -13s;
    transform-origin: 4vw 17vh;
    box-shadow: 20vmin 0 5vmin currentColor;
  }
  &:nth-child(2) {
    color: #E45A84;
    top: 72%;
    left: 10%;
    animation-duration: 22s;
    animation-delay: -13s;
    transform-origin: 4vw 17vh;
    box-shadow: 20vmin 0 5vmin currentColor;
  }
  &:nth-child(3) {
    color: #583C87;
    top: 97%;
    left: 97%;
    animation-duration: 31s;
    animation-delay: -39s;
    transform-origin: -9vw 14vh;
    box-shadow: 20vmin 0 5vmin currentColor;
}
  &:nth-child(4) {
    color: #E45A84;
    top: 91%;
    left: 88%;
    animation-duration: 35s;
    animation-delay: -5s;
    transform-origin: 1vw 11vh;
    box-shadow: 20vmin 0 5vmin currentColor;
}
  &:nth-child(5) {
    color: #583C87;
    top: 10%;
    left: 68%;
    animation-duration: 46s;
    animation-delay: -14s;
    transform-origin: -3vw 5vh;
    box-shadow: 20vmin 0 5vmin currentColor;
}
  &:nth-child(6) {
    color: #FFACAC;
    top: 5%;
    left: 82%;
    animation-duration: 14s;
    animation-delay: -4s;
    transform-origin: -22vw 20vh;
    box-shadow: 20vmin 0 5vmin currentColor;
}
  &:nth-child(7) {
    color: #583C87;
    top: 31%;
    left: 56%;
    animation-duration: 13s;
    animation-delay: -45s;
    transform-origin: -11vw 10vh;
    box-shadow: 20vmin 0 5vmin currentColor;
}
`;

// 별똥별

/*
const shootingStars = Array(20).fill(null).map((_, index) => 
<ShootingStar 
  style={{ 
    left: `${Math.random() * 100}%`, 
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`
  }} 
  key={index} 
/>);
<BackgroundColor1>
<Night>
      {shootingStars}
    </Night>
  </BackgroundColor1></>
*/

const tail = keyframes`
  0% {
    width: 0;
  }
  
  30% {
    width: 100px;
  }
  
  100% {
    width: 0;
  }
`;

const shining = keyframes`
  0% {
    width: 0;
  }
  
  50% {
    width: 30px;
  }
  
  100% {
    width: 0;
  }
`;

const shooting = keyframes`
  0% {
    transform: translateX(0);
  }
  
  100% {
    transform: translateX(300px);
  }
`;

export const Night = styled.div`
  position: relative;
  top:-5vw;
  right:20vw;
  width: 100%;
  height: 100%;
  transform: rotateZ(45deg);
`;

export const ShootingStar = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  height: 2px;
  background: linear-gradient(-45deg, rgba(95, 145, 255, 1), rgba(0, 0, 255, 0));
  border-radius: 999px;
  filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
  animation: ${tail} 3000ms ease-in-out infinite, ${shooting} 3000ms ease-in-out infinite;
  
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(-45deg, rgba(0, 0, 255, 0), rgba(95, 145, 255, 1), rgba(0, 0, 255, 0));
    transform: translateX(50%) rotateZ(45deg);
    border-radius: 100%;
    animation: ${shining} 3000ms ease-in-out infinite;
  }

  &:after {
    transform: translateX(50%) rotateZ(-45deg);
  }
`;

