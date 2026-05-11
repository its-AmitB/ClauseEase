import { useState, useEffect } from 'react';
import client from '../api/client';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import DiffViewer from '../components/DiffViewer';
import ClauseCard from '../components/ClauseCard';

export default function History() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await client.get('/documents/history');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-teal)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-heading font-bold text-white mb-6">Document History</h2>

      {documents.length === 0 ? (
        <div className="bg-[#111A2E] p-8 rounded-xl border border-[#1F2A40] text-center">
          <p className="text-gray-400">No documents analyzed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-[#111A2E] border border-[#1F2A40] rounded-xl overflow-hidden transition-colors hover:border-[var(--color-accent-teal)]/30">
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === doc._id ? null : doc._id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-white font-mono text-sm">{doc.fileName || 'Unknown File'}</span>
                  <span className="text-xs text-gray-500 mt-1">{new Date(doc.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Score Delta</span>
                    <span className="text-sm font-mono text-white">
                      <span className="text-red-400">{doc.originalScore?.toFixed(1) || '?'}</span> 
                      <span className="mx-2 text-gray-600">→</span> 
                      <span className="text-[var(--color-accent-teal)]">{doc.simplifiedScore?.toFixed(1) || '?'}</span>
                    </span>
                  </div>
                  {expandedId === doc._id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>

              {expandedId === doc._id && (
                <div className="border-t border-[#1F2A40] p-6 bg-[#0A0F1E]">
                  <div className="flex flex-col space-y-6 animate-in fade-in duration-300">
                    <DiffViewer 
                      originalText={doc.originalText} 
                      simplifiedText={doc.simplifiedText} 
                      clauses={doc.clauses} 
                    />
                    {doc.clauses && doc.clauses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-heading text-gray-300 mb-3">Clauses Detected</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {doc.clauses.map((c, i) => <ClauseCard key={i} clause={c} />)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
