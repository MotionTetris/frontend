export const setBackgroundVideo = (videoUrl: string) => {
  let video = document.createElement('video') as HTMLVideoElement;
  video.src = videoUrl;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.style.position = 'fixed';
  video.style.minWidth = '100%';
  video.style.minHeight = '100%';
  video.style.width = 'auto';
  video.style.height = 'auto';
  document.body.appendChild(video);
  console.log("Video element created:", video); 
};

export const clearBackgroundVideo = () => {
  let video = document.body.querySelector('video');
  if (video) {
    document.body.removeChild(video);
  }
};
