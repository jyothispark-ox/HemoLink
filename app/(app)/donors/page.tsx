'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Users, Plus, Search } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  age: number;
  blood_group: string;
  contact: string;
}

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [contact, setContact] = useState('');

  const fetchDonors = async () => {
    try {
      const data = await apiFetch('donors');
      setDonors(data);
    } catch (error) {
      console.error('Failed to fetch donors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDonors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('donors', {
        method: 'POST',
        body: JSON.stringify({ name, age: Number(age), blood_group: bloodGroup, contact }),
      });
      setMessage({ text: 'Donor added successfully!', type: 'success' });
      setShowForm(false);
      setName('');
      setAge('');
      setContact('');
      fetchDonors(); // Reload
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to add donor. Please try again.', type: 'error' });
    }
  };

  const filteredDonors = donors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.blood_group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-red-500" />
            Donors Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage all blood donors in the system.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setMessage({ text: '', type: '' }); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition border border-slate-700"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add New Donor'}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md text-sm font-medium border ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-medium text-white mb-4">Register New Donor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-red-500 focus:border-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Age</label>
              <input required type="number" min="18" max="65" value={age} onChange={e => setAge(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-red-500 focus:border-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Blood Group</label>
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-red-500 focus:border-red-500">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Contact Number</label>
              <input required type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-red-500 focus:border-red-500" />
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium">Save Donor</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Filter by name or blood group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-md leading-5 bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm text-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Age</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Blood Group</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Contact</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-4 text-center text-sm text-slate-500 border-b border-slate-800">Loading...</td></tr>
              ) : filteredDonors.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-center text-sm text-slate-500 border-b border-slate-800">No donors found.</td></tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-400">{donor.id}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-200">{donor.name}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-400">{donor.age}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800">
                      <span className="bg-red-500/10 text-red-500 px-2 rounded text-[10px] font-bold">{donor.blood_group}</span>
                    </td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-400">{donor.contact}</td>
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
