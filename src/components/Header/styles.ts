// Headercomponent
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StyledLinkProps } from '../../app/store'

export const HeaderContainer = styled.header`
  height: 100px;
  background: url('/src/assets/HeaderBackground.png') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%;
  z-index:3;
`;

export const HeaderLogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-48%);
`;

export const HeaderLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid white;
  transition: box-shadow 0.3s ease;
  margin-right: 10px;

  &:hover {
  box-shadow: 0 0 10px white;
  }
`;

export const HeaderLogoTitle = styled.p`
  color: white;
  display: inline-block;
  vertical-align: middle;
`;

export const HeaderProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 4vw;
  top: 50%;
  transform: translateY(-50%);
`;

export const HeaderProfilePhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  border: 3px solid white;
  transition: box-shadow 0.3s ease;
  margin-right: 10px;

  &:hover {
    box-shadow: 0 0 10px white;
  }
`;

export const HeaderProfileNickName = styled.p`
  color: white;
  display: inline-block;
  vertical-align: middle;
`;

export const HeaderStyledLinkContainer = styled.div`
  display: flex;
  gap: 50px;
`;

export const HeaderStyledLink = styled(Link)<StyledLinkProps>`
  width: 200px;
  height: 55px;
  left: 30vw;
  margin: 60px 0;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(90deg, rgba(54,209,220,1) 0%, rgba(91,134,229,1) 100%);
  border-radius: 60px;
  transition: box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease, filter 0.3s ease;
  position: relative;
  background: ${props => props.active ? 'linear-gradient(90deg, rgba(54,209,220,1) 0%, rgba(91,134,229,1) 100%)' : 'grey'};
  filter: ${props => !props.active && 'grayscale(100%)'};
  &:hover {
    box-shadow: 0 0 5px white;
    background: linear-gradient(90deg, rgba(54,209,220,1) 0%, rgba(91,134,229,1) 100%);
    color: white;
    filter: none;
    &::before {
      filter: none;
    }
  }
  &::before {
    content: '';
    display: block;
    position: relative;
    left: 20px;
    width: 35px;
    height: 35px;
    background-image: url('${props => props.image}');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 35px;
    filter: ${props => !props.active && 'grayscale(100%)'};
  }
`;