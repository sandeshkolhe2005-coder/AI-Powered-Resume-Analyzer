import React from 'react';
import Hls from 'hls.js';

export default function BackgroundVideo() {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = 'https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari support
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      // Chrome, Firefox, and other modern browsers using Hls.js
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-50"
        style={{ filter: 'brightness(0.65) contrast(1.15)' }}
      />
      {/* Subtle bottom linear-gradient fade overlay instead of heavy mix-blend multiplier */}
      <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-transparent to-bgPrimary/60 pointer-events-none" />
    </div>
  );
}
