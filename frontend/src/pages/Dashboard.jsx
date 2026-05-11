import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import DiffViewer from '../components/DiffViewer';
import ClauseCard from '../components/ClauseCard';
import TermCard from '../components/TermCard';
import ReadabilityScore from '../components/ReadabilityScore';
import client from '../api/client';
import { Loader2, Zap } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await client.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze document.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex gap-6 overflow-hidden w-full">
      {!result && (
        <div className="flex-1 flex flex-col justify-center items-center overflow-auto">
          <div className="w-full max-w-2xl">
            <div className="mb-8 text-center text-white/50">
              <h2 className="text-3xl font-heading font-bold text-white mb-2">Analysis Dashboard</h2>
              <p className="text-sm">Upload a legal document to instantly extract clauses, definitions, and simplify complex jargon.</p>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">{error}</div>}
            <FileUploader onFileSelect={handleFileUpload} disabled={loading} />
            {loading && (
              <div className="mt-8 flex flex-col items-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#00C9B1] mb-4" />
                <p>Analyzing document syntax and extracting legal clauses...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          <aside className="w-80 flex flex-col gap-6 overflow-y-auto pr-2">
            <section className="bg-[#161D30] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
              <h3 className="font-heading text-sm italic text-white/50 border-b border-white/5 pb-2">Readability Indices</h3>
              <ReadabilityScore readability={{
                original_score: result.originalScore,
                simplified_score: result.simplifiedScore,
                grade_level_original: result.readability?.grade_level_original || 'Complex',
                grade_level_simplified: result.readability?.grade_level_simplified || 'Simplified',
              }} />
            </section>

            <section className="flex-1 bg-[#161D30] border border-white/5 rounded-xl p-5 flex flex-col gap-4 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-sm italic text-white/50">Detected Clauses</h3>
                <span className="text-[10px] font-mono text-[#00C9B1]">{result.clauses?.length || 0} Found</span>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto">
                {result.clauses?.map((clause, idx) => (
                  <ClauseCard key={idx} clause={clause} />
                ))}
                {(!result.clauses || result.clauses.length === 0) && (
                  <p className="text-white/40 text-sm italic py-2">No clauses detected.</p>
                )}
              </div>
            </section>

            <section className="bg-[#161D30] border border-white/5 rounded-xl p-5 flex flex-col gap-4 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-sm italic text-white/50">Legal Glossary</h3>
                <span className="text-[10px] font-mono text-white/40">{result.terms?.length || 0} Terms</span>
              </div>
              <div className="grid grid-cols-1 gap-3 overflow-y-auto">
                {result.terms?.map((t, idx) => (
                  <TermCard key={idx} term={t.term} definition={t.definition} />
                ))}
                {(!result.terms || result.terms.length === 0) && (
                  <p className="text-white/40 text-sm italic py-2">No legal terms identified.</p>
                )}
              </div>
            </section>
          </aside>

          <section className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between bg-[#161D30] p-4 rounded-xl border border-white/5 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 bg-[#00C9B1]/20 text-[#00C9B1] text-[10px] font-mono rounded">
                  DOC_SHA256: {result.hash ? result.hash.substring(0, 8) + '...' : 'pending'}
                </span>
                <h2 className="font-heading text-lg text-white">
                  {result.fileName}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                {result.cached && (
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 font-mono tracking-widest uppercase">
                    ⚡ Instant Result (Cached)
                  </div>
                )}
                <button 
                  onClick={() => setResult(null)} 
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/60 font-mono tracking-widest uppercase hover:bg-white/10 transition-colors"
                >
                  Upload New
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <DiffViewer 
                originalText={result.originalText} 
                simplifiedText={result.simplifiedText} 
                clauses={result.clauses} 
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
