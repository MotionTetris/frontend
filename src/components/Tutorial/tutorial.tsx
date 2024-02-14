import React from 'react';
import { CloseButton, LeftButton, ModalBackground, ModalContent, RightButton } from './styles';
import { TUTORIAL_1_PNG, TUTORIAL_4_PNG,TUTORIAL_2_GIF, TUTORIAL_3_GIF, TUTORIAL_5_GIF } from '@src/config';

// Tutorial 컴포넌트의 props 타입을 정의합니다.
interface TutorialProps {
    isOpen: boolean;
    closeModal: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ isOpen, closeModal }) => {
    
  const [currentPage, setCurrentPage] = React.useState(1);

  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage < 5 ? prevPage + 1 : prevPage));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  if (!isOpen) {
    return null;
  }
  const renderContent = () => {
    switch (currentPage) {

        case 1:
            return <img src={TUTORIAL_1_PNG} alt="Tutorial1" style={{width: "1080px", height: "608px"}} />;
          case 2:
            return <img src={TUTORIAL_2_GIF} alt="Tutorial1" style={{width: "1080px", height: "608px"}} />;
          case 3:
            return <img src={TUTORIAL_3_GIF} alt="Tutorial1" style={{width: "1080px", height: "608px"}} />;
          case 4:
            return <img src={TUTORIAL_4_PNG} alt="Tutorial4" style={{width: "1080px", height: "608px"}} />;
          case 5:
            return <img src={TUTORIAL_5_GIF} alt="Tutorial1" style={{width: "1080px", height: "608px"}} />;
          default:
            return null;
    }
  };
  
  
  
  return (
    <ModalBackground>
      <ModalContent>
        <CloseButton onClick={closeModal}>모달 닫기</CloseButton>
        {renderContent()}
        <LeftButton onClick={prevPage}>이전 페이지</LeftButton>
        {currentPage < 5 && <RightButton onClick={nextPage}>다음 페이지</RightButton>}
      </ModalContent>
    </ModalBackground>
  );
};

export default Tutorial;
