import styled, { keyframes } from 'styled-components';


type Block = {
  colors: string[];
  data: number[][];
  position: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
  width: string;
  height: string;
  animationIndex: number;
  top: string; 
};

interface BlockProps {
  position: string;
  left: string;
  width: string;
  height: string;
  animationDelay: string;
  animationDuration: string;
  animationIndex: number;
  top: string; 
}


const blocks: Block[] = [
  // 네모
  {
 colors : ['rgb(59,84,165)', 'rgb(118,137,196)', 'rgb(79,111,182)'],
  data : [[0, 0, 0, 0],
       [0, 1, 1, 0],
       [0, 1, 1, 0],
       [0, 0, 0, 0]],
       position: 'absolute',
       width: '80px',
       height: '80px',
       left: '50px',
       animationDelay: '0s',
       animationDuration: '3s',
       animationIndex: 0,
       top: '-200px'
  },
  {
  // stick
  colors : ['rgb(214,30,60)', 'rgb(241,108,107)', 'rgb(236,42,75)'],
  data : [[0, 0, 0, 0],
       [0, 0, 0, 0],
       [1, 1, 1, 1],
       [0, 0, 0, 0]],
       position: 'absolute',
       left: '150px',
       width: '150px',
       height: '150px',
       animationDelay: '0s',
       animationDuration: '15s',
       animationIndex: 1,
       top: '-200px',
  },
  {
  // z
  colors : ['rgb(88,178,71)', 'rgb(150,204,110)', 'rgb(115,191,68)'],
  data : [[0, 0, 0, 0],
       [0, 1, 1, 0],
       [0, 0, 1, 1],
       [0, 0, 0, 0]],
       position: 'absolute',
       left: '600px',
       width: '40px',
       height: '40px',
       animationDelay: '0s',
       animationDuration: '30s',
       animationIndex: 2,
       top: '-200px',
  },
  {
  // T
  colors : ['rgb(62,170,212)', 'rgb(120,205,244)', 'rgb(54,192,240)'],
  data : [[0, 0, 0, 0],
       [0, 1, 1, 1],
       [0, 0, 1, 0],
       [0, 0, 0, 0]],
       position: 'absolute',
       left: '500px',
       width: '80px',
       height: '80px',
       animationDelay: '0s',
       animationDuration: '3s',
       animationIndex: 3,
       top: '-200px',
  },
  {
  // s
  colors : ['rgb(236,94,36)', 'rgb(234,154,84)', 'rgb(228,126,37)'],
  data : [[0, 0, 0, 0],
       [0, 1, 1, 0],
       [1, 1, 0, 0],
       [0, 0, 0, 0]],
       position: 'absolute',
       left: '800px',
       width: '180px',
       height: '180px',
       animationDelay: '0s',
       animationDuration: '34s',
       animationIndex: 4,
       top: '-200px',
  },
  {
  // backwards L
  colors : ['rgb(220,159,39)', 'rgb(246,197,100)', 'rgb(242,181,42)'],
  data : [[0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]],
        position: 'absolute',
        left: '450px',
        width: '60px',
        height: '60px',
        animationDelay: '0s',
        animationDuration: '23s',
        animationIndex: 5,
        top: '-200px',
  },
  {
  // L
  colors : ['rgb(158,35,126)', 'rgb(193,111,173)', 'rgb(179,63,151)'],
  data : [[0, 1, 0, 0],
       [0, 1, 0, 0],
       [0, 1, 1, 0],
       [0, 0, 0, 0]],
       position: 'absolute',
       left: '250px',
       width: '80px',
       height: '80px',
       animationDelay: '0s',
       animationDuration: '30s',
       animationIndex: 6,
       top: '-200px',
  },
];


// 블록이 떨어지는 애니메이션을 정의합니다.
const animations = [
  keyframes`
    0% { transform: translateY(0%); }
    100% { transform: translateY(1200%); }
  `,
  keyframes`
    0% { transform: translateY(0); }
    100% { transform: translateY(1400%); }
  `,
  keyframes`
    0% { transform: translateY(0); }
    100% { transform: translateY(1500%); }
  `,
  keyframes`
    0% { transform: translateY(0%); }
    100% { transform: translateY(1600%); }
  `,
  keyframes`
    0% { transform: translateY(0%); }
    100% { transform: translateY(1800%); }
  `,
  keyframes`
    0% { transform: translateY(0%); }
    100% { transform: translateY(1400%); }
  `,
  keyframes`
    0% { transform: translateY(0%); }
    100% { transform: translateY(1300%); }
  `,
];

const BlockComponent = styled.div<BlockProps>`
  position: ${props => props.position};
  left: ${props => props.left};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: ${props => props.width};
  height: ${props => props.height};
  top: ${props => props.top};
  animation: ${props => animations[props.animationIndex % animations.length]} ${props => props.animationDuration} linear ${props => props.animationDelay} infinite;
`;

// 각 블록을 구성하는 작은 사각형을 렌더링하는 컴포넌트를 정의합니다.
const CellComponent = styled.div`
  background-color: ${props => props.color};
  border: 1px solid white;
`;
const renderBlock = (block: Block, props: BlockProps, index: number) => {
  return (
    <BlockComponent {...props} animationIndex={index}>
      {block.data.map((row, rowIndex) => 
        row.map((cell, cellIndex) => 
          cell === 1 ? 
          <CellComponent 
            key={`${rowIndex}-${cellIndex}`} 
            color={block.colors[0]} 
            style={{ gridRow: rowIndex + 1, gridColumn: cellIndex + 1 }}
          /> : null
        )
      )}
    </BlockComponent>
  );
};

export const BlockComponents = blocks.map((block, index) => renderBlock(block, block, index));