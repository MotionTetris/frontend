// src/components/BannerComponent.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { goToPrevious, goToNext } from '../features/banner/bannerSlice';
import { RootState } from '../app/store';
import { BannerContainer, Slide, ImageWrapper, ArrowButton, Image, SlideNumber } from '../Styled';

const BannerComponent: React.FC = () => {
  const dispatch = useDispatch();
  const currentIndex = useSelector((state: RootState) => state.banner.currentIndex);
  const images = ['src/assets/Banner1.png', 'src/assets/Banner2.png', 'src/assets/Banner3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(goToNext(images.length));
    }, 3000);
    return () => clearInterval(interval);
  }, [dispatch, images.length]);

  return (
    <BannerContainer>
      <ArrowButton direction="left" onClick={() => dispatch(goToPrevious(images.length))}></ArrowButton>
      <Slide style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <ImageWrapper key={index}>
            <Image src={image} alt={`Slide ${index}`} />
          </ImageWrapper>
        ))}
      </Slide>
      <ArrowButton direction="right" onClick={() => dispatch(goToNext(images.length))}></ArrowButton>
      <SlideNumber>{currentIndex + 1} / {images.length}</SlideNumber>
    </BannerContainer>
  );
};

export default BannerComponent;
