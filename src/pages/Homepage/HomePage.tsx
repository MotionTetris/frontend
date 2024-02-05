import { useEffect, useRef } from "react";
import { HomepageContainer, HomepageBackgroundVideo } from "./styles";
import LoginModal from "@pages/Homepage/Modal/Login/LoginModal";

const HomePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <HomepageContainer>
      <LoginModal />
      {/* <HomepageBackgroundVideo
        ref={videoRef}
        autoPlay
        loop
        muted
        src="./background.mp4"
        onError={() => console.error("비디오를 로드하는데 실패했습니다.")}
        onPlay={() => console.log("비디오가 재생되고 있습니다.")}
      /> */}
    </HomepageContainer>
  );
}

export default HomePage;
