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
import { useRoomSocket } from "@src/context/roomSocket";
import { createRoomAPI } from "@src/api/room";
import { getUserNickname } from "@src/data-store/token";
import { ROOM_BG1_URL, ROOM_BG2_URL, ROOM_BG3_URL, ROOM_BG4_URL, ROOM_BG5_URL } from "@src/config";

const bannerImages = [
  "/assets/Banner1.png",
  "/assets/Banner2.png",
];
const Banner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const nickname = getUserNickname();
  const navigateTo = async () => {
    const roomInfo = await createRoomAPI({
      roomTitle: `${nickname}님의 방`,
      currentCount: 1,
      maxCount: 1,
      backgroundUrl: [ROOM_BG1_URL, ROOM_BG2_URL, ROOM_BG3_URL, ROOM_BG4_URL, ROOM_BG5_URL][Math.floor(Math.random() * 5)],
      roomStatus: "READY",
      isLock: "UNLOCK",
      password: ""
    });
    navigate("/rooms/${roomId}", { state: { roomInfo: roomInfo.message, isCreator: true } });
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
