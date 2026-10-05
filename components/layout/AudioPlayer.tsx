import React from 'react';
import { Play, SkipBack, SkipForward, Volume2, ChevronUp } from 'lucide-react';

export const AudioPlayer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-violet-700 via-indigo-800 to-blue-800 px-8 flex items-center justify-between z-40 shadow-2xl shadow-violet-900/40 text-white">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop"
          alt=""
          className="w-9 h-9 rounded-lg object-cover"
        />
        <div>
          <div className="text-[10px] font-semibold text-white/70">Now Playing</div>
          <div className="text-xs font-bold">HabbletXd - Nossa Comunidade</div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="hover:text-white/70 transition-colors"><SkipBack size={16} /></button>
        <button className="w-8 h-8 rounded-full bg-white text-violet-600 flex items-center justify-center hover:scale-105 transition-transform shadow-md">
          <Play size={14} fill="currentColor" />
        </button>
        <button className="hover:text-white/70 transition-colors"><SkipForward size={16} /></button>
        <div className="flex items-center gap-2 ml-3">
          <Volume2 size={16} />
          <div className="w-24 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="bg-white h-full w-1/3 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs font-bold italic text-right leading-tight">
          HabbletXd<br/>
          <span className="font-normal not-italic text-[10px] text-white/80">É mais que um servidor,<br/>é uma família!</span>
        </div>
        <ChevronUp size={16} className="cursor-pointer" />
      </div>
    </footer>
  );
};