import  { useState, useEffect } from 'react';
import { BannerContainer, Slide, ImageWrapper, ArrowButton, Image, SlideNumber } from '../Styled';

const BannerComponent: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 이미지 인덱스
  const images = ['src/assets/Banner1.png', 'src/assets/Banner2.png', 'src/assets/Banner3.png']; // 이미지 파일 경로 배열

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // 다음 이미지로 자동 전환
    }, 3000); // 3초마다 이미지 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, []);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <BannerContainer>
      <ArrowButton direction="left" onClick={goToPrevious}></ArrowButton>
      <Slide style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <ImageWrapper key={index}>
            <Image src={image} alt={`Slide ${index}`} />
          </ImageWrapper>
        ))}
      </Slide>
      <ArrowButton direction="right" onClick={goToNext}></ArrowButton>
      <SlideNumber>{currentIndex + 1} / {images.length}</SlideNumber>
    </BannerContainer>
  );
};

export default BannerComponent;