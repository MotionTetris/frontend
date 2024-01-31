// src/components/BannerComponent.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { goToPrevious, goToNext } from '../../redux/banner/bannerSlice';
import { RootState } from '@app/store';
import { BannerContainer, BannerSlide, BannerImageWrapper, BannerArrowButton, BannerImage, BannerSlideNumber } from './styles';
import { bannerImages } from '@util/images';
const BannerComponent: React.FC = () => {
  const dispatch = useDispatch();
  const currentIndex = useSelector((state: RootState) => state.banner.currentIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(goToNext(bannerImages.length));
    }, 3000);
    return () => clearInterval(interval);
  }, [dispatch, bannerImages.length]);

  return (
    <BannerContainer>
      <BannerArrowButton direction="left" onClick={() => dispatch(goToPrevious(bannerImages.length))}></BannerArrowButton>
      <BannerSlide style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {bannerImages.map((image, index) => (
          <BannerImageWrapper key={index}>
            <BannerImage src={image} alt={`Slide ${index}`} />
          </BannerImageWrapper>
        ))}
      </BannerSlide>
      <BannerArrowButton direction="right" onClick={() => dispatch(goToNext(bannerImages.length))}></BannerArrowButton>
      <BannerSlideNumber>{currentIndex + 1} / {bannerImages.length}</BannerSlideNumber>
    </BannerContainer>
  );
};

export default BannerComponent;