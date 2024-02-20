import React, { useState, useEffect } from 'react';
import { VolumeControl, VolumeButton } from "./styles";
import { PageBGM, playSound, stopSound  } from "./sound";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { isMuted, muteBGM, unmuteBGM } from '@src/data-store/volume';

interface VolumeProps {
    page: PageBGM;
}

const Volume: React.FC<VolumeProps> = ({ page }) => {
  const initialVolumeState = !isMuted();
  const [isPlaying, setIsPlaying] = useState(initialVolumeState);
  const [volume, setVolume] = useState([50]);

  useEffect(() => {
    playSound(page, volume[0] / 100);
    return () => stopSound();
  }, [page]);

  useEffect(() => {
    playSound(page, volume[0] / 100, isPlaying);
  }, [volume, isPlaying, page]);

  const handlePlayClick = () => {
    isPlaying ? muteBGM() : unmuteBGM();
    setIsPlaying(!isPlaying);
  };

  return (
    <VolumeControl>
      <VolumeButton 
        onClick={handlePlayClick}>
        {isPlaying ? <IoVolumeMediumSharp size="25"/> : <IoVolumeMuteOutline size="25"/>}
      </VolumeButton>
    </VolumeControl>
  );
  
};

export default Volume;
