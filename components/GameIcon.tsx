
import React from 'react';
import { ItemSymbol } from '../types';

interface GameIconProps {
  symbol: ItemSymbol;
  className?: string;
}

const GameIcon: React.FC<GameIconProps> = ({ symbol, className = "w-10 h-10" }) => {
  switch (symbol) {
    case ItemSymbol.Apple:
      return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="appleShine" cx="0.3" cy="0.3" r="0.7">
              <stop offset="0%" stopColor="white" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <path d="M85,40 C85,20 70,10 50,10 C30,10 22,25 20,30 C18,25 10,10 10,25 C10,45 35,65 50,65 C65,65 90,45 90,40 Z" fill="#D92D20"/>
          <path d="M55,15 C55,5 60,0 68,2 C75,5 72,15 72,15 Z" fill="#4D7C0F"/>
          <circle cx="35" cy="35" r="30" fill="url(#appleShine)"/>
        </svg>
      );
    case ItemSymbol.Orange:
      return (
         <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="orangeShine" cx="0.25" cy="0.25" r="0.6">
                    <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="#F97316" />
            <path d="M60,10 C60,5 65,2 70,5 C75,8 72,15 72,15 Z" fill="#16A34A" />
            <circle cx="50" cy="50" r="45" fill="url(#orangeShine)" />
        </svg>
      );
    case ItemSymbol.Grape:
       return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="grapeShine" cx="0.3" cy="0.3" r="0.7">
                    <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
            </defs>
            <g transform="translate(10, 10)">
                <circle cx="40" cy="20" r="15" fill="#6D28D9" />
                <circle cx="25" cy="40" r="15" fill="#6D28D9" />
                <circle cx="55" cy="40" r="15" fill="#6D28D9" />
                <circle cx="40" cy="60" r="15" fill="#6D28D9" />
                <circle cx="15" cy="65" r="15" fill="#6D28D9" />
                <circle cx="65" cy="65" r="15" fill="#6D28D9" />
                <path d="M40 5 L45 0 L55 5" stroke="#4D7C0F" strokeWidth="5" fill="none" />
                 <g>
                    <circle cx="40" cy="20" r="15" fill="url(#grapeShine)" />
                    <circle cx="25" cy="40" r="15" fill="url(#grapeShine)" />
                    <circle cx="55" cy="40" r="15" fill="url(#grapeShine)" />
                </g>
            </g>
        </svg>
    );
    case ItemSymbol.Bell:
      return (
         <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bellGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#FBBF24'}} />
                    <stop offset="100%" style={{stopColor: '#F59E0B'}} />
                </linearGradient>
            </defs>
            <path d="M10 50 C10 20 90 20 90 50 L 10 50 Z" fill="url(#bellGradient)" stroke="#CA8A04" strokeWidth="4"/>
            <path d="M10 50 L 90 50 C 85 70 70 85 50 85 C 30 85 15 70 10 50 Z" fill="url(#bellGradient)"  stroke="#CA8A04" strokeWidth="4"/>
            <rect x="45" y="80" width="10" height="10" fill="#CA8A04" rx="3"/>
            <path d="M40,20 a10,5 0 0,1 20,0" fill="#F59E0B"/>
        </svg>
      );
    case ItemSymbol.Watermelon:
      return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 A 40 40 0 0 1 90 50 Z" fill="#DC2626"/>
            <path d="M10 50 A 40 40 0 0 1 90 50" stroke="#FCA5A5" strokeWidth="8" fill="none"/>
            <path d="M10 50 L 90 50" fill="#15803D" />
            <path d="M10 50 L 90 50 L 90 60 A 40 40 0 0 1 10 60 Z" fill="#15803D"/>
            <circle cx="30" cy="45" r="3" fill="black"/>
            <circle cx="50" cy="40" r="3" fill="black"/>
            <circle cx="70" cy="45" r="3" fill="black"/>
        </svg>
      );
    case ItemSymbol.Star:
      return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#FDE047"/>
                     <stop offset="100%" stopColor="#FBBF24"/>
                </linearGradient>
            </defs>
             <path d="M50,5 L61,35 L95,35 L68,55 L78,85 L50,68 L22,85 L32,55 L5,35 L39,35 Z" fill="url(#starGradient)" stroke="#F59E0B" strokeWidth="3"/>
        </svg>
      );
    case ItemSymbol.Seven:
      return <div className="text-red-500 font-bold text-5xl italic" style={{textShadow: '2px 2px #881337', WebkitTextStroke: '1px white'}}>77</div>;
    case ItemSymbol.Bar:
    case ItemSymbol.JP:
        return (
            <div className={`flex flex-col items-center justify-center font-bold text-white ${className}`} style={{ textShadow: '1px 1px #000' }}>
                <div className="bg-red-600 px-3 py-0.5 rounded-sm border-2 border-red-800 text-sm mb-0.5 w-full text-center">BAR</div>
                <div className="bg-red-600 px-3 py-0.5 rounded-sm border-2 border-red-800 text-sm mb-0.5 w-full text-center">BAR</div>
                <div className="bg-red-600 px-3 py-0.5 rounded-sm border-2 border-red-800 text-sm w-full text-center">BAR</div>
            </div>
        );
    default:
      return <div className="text-xs">{symbol}</div>;
  }
};

export default GameIcon;