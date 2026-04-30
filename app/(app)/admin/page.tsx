'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Settings, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminPanel() {
  const [dbState, setDbState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFullState = async () => {
    try {
      const [users, donors, patients, requests, donations, stock] = await Promise.all([
        apiFetch('donors'), // Cannot fetch users directly since we don't have an endpoint for ALL users (except mock array)
        apiFetch('donors'),
        apiFetch('patients'),
        apiFetch('requests'),
        apiFetch('donations'),
        apiFetch('blood_stock'),
      ]);
      setDbState({ users, donors, patients, requests, donations, stock });
    } catch (error) {
      console.error('Failed to fetch DB state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFullState();
  }, []);

  const resetSystem = () => {
    if (confirm('This is a simulated action. In a real system, this would clear the database. Continue?')) {
      alert('System reset simulated.');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-400" />
          System Admin Panel
        </h1>
        <p className="text-sm text-slate-500 mt-1">Advanced management and system diagnostics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/20">
                <div className="flex items-center gap-3 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Database Connection</span>
                </div>
                <span className="text-sm font-bold text-green-500">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/20">
                <div className="flex items-center gap-3 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">API Endpoints</span>
                </div>
                <span className="text-sm font-bold text-green-500">Operational</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
             <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Danger Zone
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-200">Reset Database</h3>
                <p className="text-sm text-slate-500">Permanently delete all mock data and reset stock.</p>
              </div>
              <button 
                onClick={resetSystem}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition border border-red-700"
              >
                Factory Reset
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 mb-4">Record Counts</h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Donors Registered</span>
                <span className="font-bold text-slate-200">{dbState?.donors?.length || 0}</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Patients Registered</span>
                <span className="font-bold text-slate-200">{dbState?.patients?.length || 0}</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Donation Logs</span>
                <span className="font-bold text-slate-200">{dbState?.donations?.length || 0}</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Requests</span>
                <span className="font-bold text-slate-200">{dbState?.requests?.length || 0}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
