import React from 'react';
import { Target } from 'lucide-react';

export const AchievementsCard = () => {
  return (
    <div className="bg-white border border-violet-100 rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex justify-between items-center border-b border-violet-50 pb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">🎯 Conquistas</h4>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">Ver todos &gt;</span>
      </div>
      <div className="flex items-center gap-4 py-2">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-blue-700 text-white flex items-center justify-center shrink-0">
          <Target size={20} />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="text-violet-600 font-bold text-sm">100%</div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-blue-500 h-full w-full rounded-full"></div>
          </div>
          <div className="text-[10px] text-gray-400">Você completou todos os objetivos!</div>
        </div>
      </div>
    </div>
  );
};