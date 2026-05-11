import { useEffect, useState } from 'react';

export default function ReadabilityScore({ readability }) {
  const [animatedOriginal, setAnimatedOriginal] = useState(0);
  const [animatedSimplified, setAnimatedSimplified] = useState(0);

  useEffect(() => {
    if (!readability) return;
    let timer = setTimeout(() => {
      setAnimatedOriginal(readability.original_score);
      setAnimatedSimplified(readability.simplified_score);
    }, 100);
    return () => clearTimeout(timer);
  }, [readability]);

  if (!readability) return null;

  const calculateDashArray = (score) => {
    // Score is 0-100, circumference of r=40 is ~251
    const max = 251.2;
    const progress = (score / 100) * max;
    return `${progress} ${max}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-center flex-1">
        <div className="text-xs font-mono text-white/40 mb-2 uppercase tracking-tighter">Original</div>
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle
              cx="48" cy="48" r="40"
              stroke="#F27D26" strokeWidth="6" fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - ((animatedOriginal / 100) * 251.2)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="text-lg font-bold">{readability.original_score.toFixed(1)}</div>
        </div>
        <div className="text-[10px] text-white/60 mt-1 uppercase tracking-wider">{readability.grade_level_original}</div>
      </div>
      
      <div className="w-px h-16 bg-white/10"></div>
      
      <div className="text-center flex-1">
        <div className="text-xs font-mono text-white/40 mb-2 uppercase tracking-tighter">Simplified</div>
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle
              cx="48" cy="48" r="40"
              stroke="#00C9B1" strokeWidth="6" fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - ((animatedSimplified / 100) * 251.2)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="text-lg font-bold text-[#00C9B1]">{readability.simplified_score.toFixed(1)}</div>
        </div>
        <div className="text-[10px] text-[#00C9B1] mt-1 uppercase tracking-wider">{readability.grade_level_simplified}</div>
      </div>
    </div>
  );
}
