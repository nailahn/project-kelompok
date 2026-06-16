import { useState, useEffect } from 'react';
import { historyAPI } from '../api/client';
import EmptyState from '../components/ui/EmptyState';
import { Clock, Filter } from 'lucide-react';

function HistoryItem({ item }) {
  const date = new Date(item.searched_at);
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const hasFilters = item.genre || item.year || item.min_rating;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-white/6 last:border-0">
      <div className="w-8 h-8 rounded-full bg-olive-600/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Filter className="w-3.5 h-3.5 text-white/40" />
      </div>
      <div className="flex-1 min-w-0">
        {hasFilters ? (
          <div className="flex flex-wrap gap-2 mb-1">
            {item.genre && (
              <span className="bg-cinema-gold/15 text-cinema-gold/80 text-xs font-sans px-2.5 py-0.5 rounded-full border border-cinema-gold/20">
                {item.genre.name}
              </span>
            )}
            {item.year && (
              <span className="bg-white/8 text-white/60 text-xs font-sans px-2.5 py-0.5 rounded-full">
                Tahun {item.year}
              </span>
            )}
            {item.min_rating && (
              <span className="bg-white/8 text-white/60 text-xs font-sans px-2.5 py-0.5 rounded-full">
                ≥ {item.min_rating} ⭐
              </span>
            )}
          </div>
        ) : (
          <p className="text-white/50 text-sm font-sans italic mb-1">Tanpa filter (semua film)</p>
        )}
        <p className="text-white/25 text-xs font-sans">{formattedDate}</p>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyAPI.getAll()
      .then(res => setHistory(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 md:px-8 max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-white mb-1">Riwayat Pencarian</h1>
        <p className="text-white/40 text-sm font-sans">50 pencarian terakhir</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-white/6">
              <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-48 rounded-full" />
                <div className="skeleton h-3 w-32 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat"
          description="Riwayat pencarian filmmu akan muncul di sini."
          icon={<Clock className="w-8 h-8" />}
        />
      ) : (
        <div className="bg-olive-700/20 border border-white/8 rounded-2xl px-5">
          {history.map(item => <HistoryItem key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
