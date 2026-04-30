'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Droplet, Plus } from 'lucide-react';

interface Donation {
  id: string;
  donor_id: string;
  quantity: number;
  date: string;
}

interface Donor {
  id: string;
  name: string;
  blood_group: string;
}

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Form state
  const [donorId, setDonorId] = useState('');
  const [quantity, setQuantity] = useState('1');

  const fetchData = async () => {
    try {
      const [dons, ds] = await Promise.all([
        apiFetch('donations'),
        apiFetch('donors')
      ]);
      setDonations(dons.reverse());
      setDonors(ds);
      if (ds.length > 0 && !donorId) setDonorId(ds[0].id);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('donations', {
        method: 'POST',
        body: JSON.stringify({ donor_id: donorId, quantity: Number(quantity) }),
      });
      setMessage({ text: 'Donation logged successfully!', type: 'success' });
      setShowForm(false);
      fetchData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to log donation. Please try again.', type: 'error' });
    }
  };

  const getDonorInfo = (id: string) => {
    const donor = donors.find(d => d.id === id);
    return donor ? `${donor.name} (${donor.blood_group})` : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Droplet className="h-6 w-6 text-red-500" />
            Donations
          </h1>
          <p className="text-sm text-slate-500 mt-1">Log and view blood donations received.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setMessage({ text: '', type: '' }); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition border border-slate-700"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Log Donation'}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md text-sm font-medium border ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-medium text-white mb-4">Log New Donation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Donor</label>
              <select required value={donorId} onChange={e => setDonorId(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-red-500 focus:border-red-500">
                {donors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.blood_group})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Quantity (Units)</label>
              <input required type="number" min="1" max="5" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-red-500 focus:border-red-500" />
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium">Save Donation</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Donation ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Donor Info</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-4 text-center text-sm text-slate-500 border-b border-slate-800">Loading...</td></tr>
              ) : donations.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-center text-sm text-slate-500 border-b border-slate-800">No donations logged yet.</td></tr>
              ) : (
                donations.map((don) => (
                  <tr key={don.id}>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-400">{don.id}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-400">{new Date(don.date).toLocaleDateString()} {new Date(don.date).toLocaleTimeString()}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-200">{getDonorInfo(don.donor_id)}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800">
                      <span className="text-green-500 font-bold">+{don.quantity} Units</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
