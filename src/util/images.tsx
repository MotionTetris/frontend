export const goToNextImage = (currentIndex: number, totalImages: number) => {
    return (currentIndex + 1) % totalImages;
  };
  
export const goToPreviousImage = (currentIndex: number, totalImages: number) => {
    return (currentIndex - 1 + totalImages) % totalImages;
  };

export const bannerImages = ['src/assets/Banner1.png', 'src/assets/Banner2.png', 'src/assets/Banner3.png'];
