import { useState, useEffect } from "react";
import {
  BannerContainer,
  BannerSlide,
  BannerImageWrapper,
  BannerArrowButton,
  BannerImage,
  BannerSlideNumber,
} from "./styles";
import { useNavigate } from "react-router-dom";

const bannerImages = [
  "public/assets/Banner1.png",
  "public/assets/Banner2.png",
];
const Banner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate("/singleplay");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BannerContainer>
      <BannerArrowButton
        direction="left"
        onClick={() =>
          setCurrentIndex(
            currentIndex === 0 ? bannerImages.length - 1 : currentIndex - 1,
          )
        }
      ></BannerArrowButton>
      <BannerSlide style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {bannerImages.map((image, index) => (
          <BannerImageWrapper key={index}>
            <BannerImage
              src={image}
              alt={`Slide ${index}`}
              onClick={() => navigateTo()}
            />
          </BannerImageWrapper>
        ))}
      </BannerSlide>
      <BannerArrowButton
        direction="right"
        onClick={() =>
          setCurrentIndex((currentIndex + 1) % bannerImages.length)
        }
      ></BannerArrowButton>
      <BannerSlideNumber>
        {currentIndex + 1} / {bannerImages.length}
      </BannerSlideNumber>
    </BannerContainer>
  );
};

export default Banner;
