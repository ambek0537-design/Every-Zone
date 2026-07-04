import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface SimulatedVideoPlayerProps {
  videoPlaceholderTheme?: string;
}

export const SimulatedVideoPlayer: React.FC<SimulatedVideoPlayerProps> = ({ videoPlaceholderTheme }) => {
  const [videoPlaying, setVideoPlaying] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(42);

  useEffect(() => {
    let interval: any;
    if (videoPlaying) {
      interval = setInterval(() => {
        setVideoProgress(p => (p >= 100 ? 0 : p + 1.5));
      }, 350);
    }
    return () => clearInterval(interval);
  }, [videoPlaying]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 flex flex-col justify-center items-center shadow-lg group">
      <div className={`absolute inset-0 bg-gradient-to-tr ${videoPlaceholderTheme || 'from-stone-900 to-stone-800'} ${videoPlaying ? 'opacity-30' : 'opacity-70'} transition-opacity duration-300`}></div>
      
      {/* Graphical Video Controls Visual overlay */}
      <div className="w-full h-36 flex flex-col justify-between p-3 relative z-10">
        <div className="flex justify-between items-center select-none">
          <span className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase">
            <span className="w-1 h-1 bg-white rounded-full animate-ping"></span> Live demo video
          </span>
          <span className="text-[10px] text-stone-300 font-mono select-none">0:14</span>
        </div>

        {/* Loop Soundwave simulation graph */}
        <div className="flex items-end justify-center gap-[2.5px] h-10 w-full opacity-70 mb-3 px-6 select-none pointer-events-none">
          {Array.from({ length: 28 }).map((_, i) => {
            const randomHeight = videoPlaying ? Math.sin((i + videoProgress) / 3) * 16 + 22 : 4;
            return (
              <div 
                key={i} 
                style={{ height: `${randomHeight}px` }} 
                className="w-[3px] bg-[#C5A059] rounded-t-sm transition-all duration-300"
              ></div>
            );
          })}
        </div>

        {/* Scrub and Play buttons */}
        <div className="flex items-center gap-3.5">
          <button 
            type="button"
            onClick={() => setVideoPlaying(!videoPlaying)}
            className="p-2 rounded-full bg-[#1E3A1A] text-white hover:bg-[#1E3A1A]/95 flex justify-center items-center shrink-0 cursor-pointer shadow-md"
          >
            {videoPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
          </button>
          <div className="flex-1 h-1.5 bg-stone-700/50 rounded-full overflow-hidden relative">
            <div style={{ width: `${videoProgress}%` }} className="h-full bg-[#C5A059] transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
