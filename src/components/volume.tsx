import React, { useState, useEffect } from 'react';
import { VolumeControl, VolumeButton } from "./styles";
import { playLodingSound1,playLodingSound2, stopSound  } from "./sound";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { isMuted, muteBGM, unmuteBGM } from '@src/data-store/volume';

interface VolumeProps {
    page: string;
}

const Volume: React.FC<VolumeProps> = ({ page }) => {
  const initialVolumeState = !isMuted();
  const [isPlaying, setIsPlaying] = useState(initialVolumeState);
  const [volume, setVolume] = useState([50]);

  useEffect(() => {
    if (page === 'page1') {
      playLodingSound1(volume[0] / 100);
    } else if (page === 'page2') {
      playLodingSound2(volume[0] / 100);
    }
    return () => stopSound();
  }, [page]);


  useEffect(() => {
    if (page === 'page1') {
      playLodingSound1(volume[0] / 100, isPlaying);
    } else if (page === 'page2') {
      playLodingSound2(volume[0] / 100, isPlaying);
    }
  }, [volume, isPlaying, page]);


  const handlePlayClick = () => {
    if (isPlaying) {
      muteBGM();
      setIsPlaying(!isPlaying);
      console.log("뮤트함");
      return;
    }

    unmuteBGM();
    setIsPlaying(!isPlaying);
  };
  return (
    <VolumeControl>
      <VolumeButton 
        onClick={handlePlayClick}>
        {isPlaying ? <IoVolumeMediumSharp /> : <IoVolumeMuteOutline />}
      </VolumeButton>
    </VolumeControl>
  );
  
};

export default Volume;
