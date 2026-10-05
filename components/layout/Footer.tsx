import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Informações e Aviso Legal */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              B
            </div>
            <span className="font-extrabold text-sm text-gray-900"> HabbletXD</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            A HabbletXd é um fã-site não oficial do Habblet Hotel, não está afiliada com, patrocinada por, apoiada por, ou principalmente aprovada pela Rede Habblet. Nosso intuito é apenas dar informações e entretenimento a comunidade do hotel. Esta Fã Site pode utilizar as marcas registradas e outras propriedades intelectuais do Habblet, que estão permitidas sob a Política de Fã Sites Habblet.
          </p>
        </div>

        {/* Créditos de Desenvolvimento */}
        <div className="shrink-0 space-y-1 text-center md:text-right">
          <p className="text-xs font-bold text-gray-700">Desenvolvido Por ArchiPixel</p>
          <p className="text-[10px] text-gray-400 flex items-center justify-center md:justify-end gap-1">
            Feito com <Heart size={12} className="text-red-500 fill-red-500" /> para a comunidade
          </p>
        </div>

      </div>
    </footer>
  );
};