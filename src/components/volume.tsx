import React, { useState, useEffect } from 'react';
import { VolumeControl, VolumeButton, VolumeTooltip, VolumeThumb } from "./styles";
import { playLodingSound1,playLodingSound2, stopSound  } from "./sound";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMuteOutline } from "react-icons/io5";

interface VolumeProps {
    page: string;
}

const Volume: React.FC<VolumeProps> = ({ page }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([50]);

  useEffect(() => {
    stopSound();
    if (page === 'page1') {
      playLodingSound1(volume[0] / 100);
    } else if (page === 'page2') {
      playLodingSound2(volume[0] / 100);
    }
  }, [ page]);

  useEffect(() => {
    if (page === 'page1') {
      playLodingSound1(volume[0] / 100, isPlaying);
    } else if (page === 'page2') {
      playLodingSound2(volume[0] / 100, isPlaying);
    }
  }, [volume, isPlaying, page]);


  const handlePlayClick = () => {
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
