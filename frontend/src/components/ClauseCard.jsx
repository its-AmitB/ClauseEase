export default function ClauseCard({ clause }) {
  const badgeColors = {
    'Confidentiality': { border: 'border-blue-500', text: 'text-blue-400' },
    'Indemnity': { border: 'border-orange-500', text: 'text-orange-400' },
    'Termination': { border: 'border-red-500', text: 'text-red-400' },
    'Liability': { border: 'border-yellow-500', text: 'text-yellow-400' },
    'Payment': { border: 'border-green-500', text: 'text-green-400' },
    'Governing Law': { border: 'border-purple-500', text: 'text-purple-400' },
  };

  const confidencePercent = Math.round(clause.confidence * 100);
  const theme = badgeColors[clause.label] || { border: 'border-gray-500', text: 'text-gray-400' };

  return (
    <div className={`p-3 bg-[#0A0F1E] rounded border-l-2 ${theme.border} flex flex-col gap-2 shrink-0`}>
      <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider">
        <span className={theme.text}>{clause.label}</span>
        <span className="text-white/40">{confidencePercent}%</span>
      </div>
      <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
        {clause.text}
      </p>
    </div>
  );
}
