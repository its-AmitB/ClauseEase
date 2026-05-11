export default function TermCard({ term, definition }) {
  return (
    <div className="p-3 bg-[#0A0F1E] rounded flex flex-col gap-1 shrink-0">
      <h4 className="text-[10px] font-mono text-[#00C9B1] uppercase tracking-wider">{term}</h4>
      <p className="text-xs text-white/70 leading-relaxed">{definition}</p>
    </div>
  );
}
