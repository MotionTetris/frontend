import styled from 'styled-components';


export const GameDashboardContainer = styled.div`
    position: relative;
    
`;

export const ProfileHeader = styled.span`
  position: absolute;
  font-family: "DNFBitBitv2", sans-serif;
  font-style: light;
  font-weight: 100;
  color: white;
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
  color: white;
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
