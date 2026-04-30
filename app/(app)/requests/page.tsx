'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { FileText, Plus, Check, X } from 'lucide-react';

interface Request {
  id: string;
  patient_id: string;
  blood_group: string;
  units: number;
  status: string;
}

interface Patient {
  id: string;
  name: string;
}

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Form state
  const [patientId, setPatientId] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [units, setUnits] = useState('1');

  const fetchData = async () => {
    try {
      const [reqs, pats] = await Promise.all([
        apiFetch('requests'),
        apiFetch('patients')
      ]);
      setRequests(reqs.reverse()); // latest first
      setPatients(pats);
      if (pats.length > 0 && !patientId) setPatientId(pats[0].id);
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
      await apiFetch('requests', {
        method: 'POST',
        body: JSON.stringify({ patient_id: patientId, blood_group: bloodGroup, units: Number(units) }),
      });
      setMessage({ text: 'Request created successfully!', type: 'success' });
      setShowForm(false);
      fetchData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to add request. Please try again.', type: 'error' });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await apiFetch(`requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setMessage({ text: `Request ${status.toLowerCase()} successfully!`, type: 'success' });
      fetchData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to update request', type: 'error' });
    }
  };

  const getPatientName = (id: string) => {
    return patients.find(p => p.id === id)?.name || id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-500" />
            Blood Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient requests for blood units.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setMessage({ text: '', type: '' }); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition border border-slate-700"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md text-sm font-medium border ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-medium text-white mb-4">Create New Request</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Patient</label>
              <select required value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-orange-500 focus:border-orange-500">
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Blood Group</label>
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-orange-500 focus:border-orange-500">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Units</label>
              <input required type="number" min="1" max="10" value={units} onChange={e => setUnits(e.target.value)} className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div className="md:col-span-3 mt-2">
              <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition font-medium">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Patient Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Blood Group</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Units</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-4 text-center text-sm text-slate-500 border-b border-slate-800">Loading...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="py-4 text-center text-sm text-slate-500 border-b border-slate-800">No requests found.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-400">{req.id}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-200">{getPatientName(req.patient_id)}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800">
                      <span className="bg-red-500/10 text-red-500 px-2 rounded text-[10px] font-bold">{req.blood_group}</span>
                    </td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-300">{req.units}.0</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800">
                      <span className={`font-medium ${
                        req.status === 'Approved' ? 'text-green-500' : 
                        req.status === 'Rejected' ? 'text-red-500' : 
                        'text-orange-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-right">
                      {req.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(req.id, 'Approved')}
                            className="text-green-500 hover:text-green-400 p-1 rounded hover:bg-green-500/10 transition-colors"
                            title="Approve"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                            className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                            title="Reject"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      )}
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
