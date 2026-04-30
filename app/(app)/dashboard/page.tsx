'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Users, UserPlus, FileText, Droplet, Archive, Activity } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  donors: number;
  patients: number;
  requests: number;
  donations: number;
  totalStock: number;
  recentDonations: any[];
  recentRequests: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donors, patients, requests, donations, stock] = await Promise.all([
          apiFetch('donors'),
          apiFetch('patients'),
          apiFetch('requests'),
          apiFetch('donations'),
          apiFetch('blood_stock'),
        ]);

        const totalStock = Object.values(stock).reduce((a: any, b: any) => a + b, 0) as number;

        setData({
          donors: donors.length,
          patients: patients.length,
          requests: requests.length,
          donations: donations.length,
          totalStock,
          recentDonations: donations.slice(-5).reverse(),
          recentRequests: requests.slice(-5).reverse(),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div></div>;
  if (!data) return <div>Failed to load data</div>;

  const stats = [
    { name: 'Total Donors', value: data.donors, icon: Users, color: 'bg-blue-500' },
    { name: 'Total Patients', value: data.patients, icon: UserPlus, color: 'bg-indigo-500' },
    { name: 'Blood Requests', value: data.requests, icon: FileText, color: 'bg-yellow-500' },
    { name: 'Total Donations', value: data.donations, icon: Droplet, color: 'bg-rose-500' },
    { name: 'Blood Stock (Units)', value: data.totalStock, icon: Archive, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-500 uppercase mb-1">Total Donors</div>
          <div className="text-2xl font-bold text-white">{data.donors}</div>
          <div className="text-[10px] text-green-500 mt-2">↑ 12% vs last month</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-500 uppercase mb-1">Pending Requests</div>
          <div className="text-2xl font-bold text-orange-500">{data.recentRequests.filter(r => r.status === 'Pending').length}</div>
          <div className="text-[10px] text-slate-500 mt-2">Awaiting Approval</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-500 uppercase mb-1">Available Units</div>
          <div className="text-2xl font-bold text-white">{data.totalStock} <span className="text-xs font-normal text-slate-500 ml-1">U</span></div>
          <div className="text-[10px] text-red-500 mt-2">Check critical levels</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-500 uppercase mb-1">Successful Donations</div>
          <div className="text-2xl font-bold text-green-500">{data.donations}</div>
          <div className="text-[10px] text-slate-500 mt-2">Lifetime total</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[460px]">
        {/* Recent Requests */}
        <div className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden bg-slate-900 rounded-lg border border-slate-800">
          <div className="px-4 py-3 flex items-center justify-between bg-slate-950 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Recent Blood Requests</h3>
            <Link href="/requests" className="text-[10px] bg-red-600/10 text-red-500 px-2 py-1 rounded border border-red-500/20 hover:bg-red-600/20 transition-colors">
              View All
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Patient ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Blood Group</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Units</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentRequests.length === 0 ? <tr><td colSpan={4} className="py-4 text-center text-sm text-slate-500">No recent requests.</td></tr> : null}
                {data.recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-300">{req.patient_id}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Recent Donations</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Donor ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Date</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 bg-slate-950">Units</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDonations.length === 0 ? <tr><td colSpan={3} className="py-4 text-center text-sm text-slate-500">No recent donations.</td></tr> : null}
                {data.recentDonations.map((don) => (
                  <tr key={don.id}>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-300 truncate">{don.donor_id}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-slate-500">{new Date(don.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-sm border-b border-slate-800 text-right text-green-500 font-bold">+{don.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
