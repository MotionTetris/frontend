import styled from 'styled-components';


export const LeftTime = styled.div`
  position: absolute;
  top: 60px;
  left: 325px;
  transform: translate(-50%, -50%);
  width: 259px;
  height: 59px;
  color: #FFF;
  background: #0D7377;
  padding: 10px 20px;
  border-right: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  z-index: 5;
`;

export const ChatContainer = styled.div`
  position: absolute;
  top: 250px;
  left: 50px;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
`;

export const Messages = styled.div`
  padding: 10px;
  height: 600px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;
export const MessageBox = styled.div<{ isMine: boolean }>`
  display: inline-block;
  max-width: 70%;
  border-radius: 10px;
  font-size: 30px;
  padding: 10px;
  background-color: ${props => props.isMine ? '#A9E4D7' : '#E4A9BD'};
  margin-bottom: 4px;
`;


export const Message = styled.div<{ isMine: boolean }>`
  margin-bottom: 10px;
  width: 100%;
  text-align: ${props => props.isMine ? 'right' : 'left'};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const JoinMessage = styled.div`
  width: 100%;
  text-align: center;
  padding: 5px 0;
  font-style: italic;
  font-size: 20px;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 5px;
  margin: 5px 0;
`;

export const MessageInput = styled.div`
  display: flex;
  background-color: #fff;
  padding: 10px;
  height: 40px;
`;

export const Input = styled.input`
  flex-grow: 1;
  border: 1px solid #ddd;
  width: 10px;
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
  font-size: 25px;
  font-family: 'MaplestoryOTFBold';
`;

export const Nickname = styled.div`
  color: #888;
  font-size: 25px;
`;


export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 25px;
  font-family: 'MaplestoryOTFBold';
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;


