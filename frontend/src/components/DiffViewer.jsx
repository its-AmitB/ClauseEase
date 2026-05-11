import { diffWords } from 'diff';
import { useMemo, useState, useRef } from 'react';

export default function DiffViewer({ originalText, simplifiedText, clauses }) {
  const [activeTab, setActiveTab] = useState('both');
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const [hoveredClauseInfo, setHoveredClauseInfo] = useState(null);

  const diffs = useMemo(() => diffWords(originalText || '', simplifiedText || ''), [originalText, simplifiedText]);

  // Synchronized scrolling
  const handleScroll = (source) => {
    if (activeTab !== 'both') return;
    if (source === 'left' && leftPanelRef.current && rightPanelRef.current) {
      rightPanelRef.current.scrollTop = leftPanelRef.current.scrollTop;
    } else if (source === 'right' && leftPanelRef.current && rightPanelRef.current) {
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop;
    }
  };

  const renderOriginal = () => {
    return diffs.map((part, index) => {
      if (part.added) return null;
      // find if part matches a clause
      const clauseMatch = clauses?.find(c => part.value.includes(c.text.substring(0, 20)));
      return (
        <span
          key={index}
          onMouseEnter={() => clauseMatch && setHoveredClauseInfo(clauseMatch)}
          onMouseLeave={() => setHoveredClauseInfo(null)}
          className={`${part.removed ? 'bg-red-500/20 text-red-300 px-1' : ''} ${clauseMatch ? 'cursor-help border-b border-dashed border-gray-500' : ''}`}
        >
          {part.value}
        </span>
      );
    });
  };

  const renderSimplified = () => {
    return diffs.map((part, index) => {
      if (part.removed) return null;
      return (
        <span
          key={index}
          className={part.added ? 'bg-[#00C9B1]/20 text-white px-1 font-bold' : ''}
        >
          {part.value}
        </span>
      );
    });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-hidden">
      {/* Left Panel */}
      <div className={`bg-[#161D30] rounded-xl border border-white/5 flex flex-col ${activeTab === 'simplified' ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex justify-between items-center p-3 border-b border-white/5">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Legal Original</div>
          <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded uppercase tracking-widest hidden md:block">Removed/Modified</span>
        </div>
        <div 
          ref={leftPanelRef}
          onScroll={() => handleScroll('left')}
          className="p-6 overflow-y-auto leading-relaxed text-sm text-white/60 font-mono space-y-4 h-full"
        >
          <div className="whitespace-pre-wrap">
            {renderOriginal()}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={`bg-[#161D30] rounded-xl border border-[#00C9B1]/30 flex flex-col ${activeTab === 'original' ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex justify-between items-center p-3 border-b border-[#00C9B1]/10">
          <div className="text-[10px] font-mono text-[#00C9B1] uppercase tracking-widest">Plain English</div>
          <span className="text-[10px] font-mono bg-[#00C9B1]/10 text-[#00C9B1] px-2 py-0.5 rounded uppercase tracking-widest hidden md:block">Added/Simplified</span>
        </div>
        <div 
          ref={rightPanelRef}
          onScroll={() => handleScroll('right')}
          className="p-6 overflow-y-auto leading-relaxed text-sm text-[#00C9B1]/90 font-mono space-y-4 h-full"
        >
          <div className="whitespace-pre-wrap">
            {renderSimplified()}
          </div>
        </div>
      </div>

      {/* Tabs for mobile or single view */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex border-t border-[#1F2A40] bg-[#0A0F1E] lg:hidden z-20">
        <button onClick={() => setActiveTab('original')} className={`flex-1 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'original' ? 'bg-[#161D30] text-[#00C9B1] border border-[#00C9B1]/30' : 'bg-[#0A0F1E] text-white/40 border border-[#1F2A40]'}`}>Original</button>
        <button onClick={() => setActiveTab('simplified')} className={`flex-1 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'simplified' ? 'bg-[#161D30] text-[#00C9B1] border border-[#00C9B1]/30' : 'bg-[#0A0F1E] text-white/40 border border-[#1F2A40]'}`}>Simplified</button>
      </div>

      {hoveredClauseInfo && (
        <div className="absolute bottom-16 lg:bottom-4 left-1/4 transform -translate-x-1/2 bg-[#0A0F1E] border border-blue-500/50 p-4 rounded-xl shadow-2xl z-10 w-72">
           <p className="text-[10px] text-blue-400 font-mono mb-2 uppercase tracking-widest">Detected Clause</p>
           <p className="font-medium text-sm text-white">{hoveredClauseInfo.label}</p>
           <div className="w-full bg-[#161D30] h-1 mt-3 rounded overflow-hidden">
             <div className="bg-blue-500 h-1 rounded" style={{ width: `${hoveredClauseInfo.confidence * 100}%` }}></div>
           </div>
        </div>
      )}
    </div>
  );
}
