'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Archive, AlertTriangle } from 'lucide-react';

interface Stock {
  [key: string]: number;
}

export default function BloodStock() {
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await apiFetch('blood_stock');
        setStock(data);
      } catch (error) {
        console.error('Failed to fetch stock:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  if (!stock) return <div>Error loading stock.</div>;

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const totalStock = Object.values(stock).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Archive className="h-6 w-6 text-green-500" />
          Blood Stock Available
        </h1>
        <p className="text-sm text-slate-500 mt-1">Real-time inventory of all blood groups. Total available: <span className="font-bold text-green-500">{totalStock} units</span>.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {bloodGroups.map((bg) => {
          const units = stock[bg as keyof Stock] || 0;
          const isLow = units < 5;
          const isCritical = units === 0;
          
          let color = 'bg-green-500';
          let textColor = 'text-green-500';
          if (isCritical) { color = 'bg-red-500'; textColor = 'text-red-500'; }
          else if (isLow) { color = 'bg-orange-500'; textColor = 'text-orange-500'; }

          // Max 100 on progress bar for visualization
          const percentage = Math.min((units / 100) * 100, 100);

          return (
            <div key={bg} className="space-y-1 bg-slate-900 rounded-lg border border-slate-800 p-4">
              <div className="flex justify-between text-xs items-center mb-2">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  {bg}
                  {(isLow || isCritical) && <AlertTriangle className={`h-3 w-3 ${textColor}`} />}
                </span>
                <span className={`font-bold ${textColor}`}>{units} Units</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className={`${color} h-full rounded-full transition-all duration-500 ease-in-out`} style={{ width: `${Math.max(percentage, isCritical ? 0 : 2)}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
