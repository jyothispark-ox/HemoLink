'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { UserCircle, Save, Activity, Weight, Ruler } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Health details state
  const [bloodType, setBloodType] = useState('A+');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bloodCount, setBloodCount] = useState('');
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedBloodType = localStorage.getItem('profile_bloodType');
      const storedWeight = localStorage.getItem('profile_weight');
      const storedHeight = localStorage.getItem('profile_height');
      const storedBloodCount = localStorage.getItem('profile_bloodCount');
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedBloodType) setBloodType(storedBloodType);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedWeight) setWeight(storedWeight);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedHeight) setHeight(storedHeight);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedBloodCount) setBloodCount(storedBloodCount);
    } catch (e) {
      console.error('Failed to load profile data from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!bloodType || !weight || !height || !bloodCount) {
      setMessage({ text: 'All fields must be filled.', type: 'error' });
      return;
    }
    
    if (Number(weight) <= 0 || Number(height) <= 0 || Number(bloodCount) <= 0) {
      setMessage({ text: 'Values must be greater than 0.', type: 'error' });
      return;
    }

    try {
      localStorage.setItem('profile_bloodType', bloodType);
      localStorage.setItem('profile_weight', weight);
      localStorage.setItem('profile_height', height);
      localStorage.setItem('profile_bloodCount', bloodCount);
      
      setMessage({ text: 'Profile saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to save profile. localStorage might be disabled.', type: 'error' });
    }
  };

  if (loading) {
    return <div className="text-slate-400 p-4">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-red-500" />
          My Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">View your information and manage your personal health details locally.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md text-sm font-medium border ${
          message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Information Card */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 mb-4 overflow-hidden">
              <UserCircle className="w-16 h-16 text-slate-500" />
            </div>
            {/* Fallback to localStorage if the auth context name is not instantly available */}
            <h2 className="text-xl font-bold text-white mb-1">
              {user?.name || (typeof window !== 'undefined' ? localStorage.getItem('name') : 'Administrator')}
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              {user?.email || (typeof window !== 'undefined' ? localStorage.getItem('email') : 'admin@hemolink.com')}
            </p>
            <div className="w-full pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Account Status</span>
              <span className="text-green-500 font-semibold px-2 py-0.5 bg-green-500/10 rounded">Active</span>
            </div>
          </div>
        </div>

        {/* Health Details Form */}
        <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-2">Health Details (Local Only)</h2>
          
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Activity className="h-4 w-4 text-slate-500" />
                  </div>
                  <select 
                    value={bloodType} 
                    onChange={e => setBloodType(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Count (e.g., 4.5)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Activity className="h-4 w-4 text-slate-500" />
                  </div>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    placeholder="e.g. 4.5"
                    value={bloodCount} 
                    onChange={e => setBloodCount(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Weight className="h-4 w-4 text-slate-500" />
                  </div>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    placeholder="e.g. 70"
                    value={weight} 
                    onChange={e => setWeight(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Height (cm)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ruler className="h-4 w-4 text-slate-500" />
                  </div>
                  <input 
                    type="number" 
                    step="1"
                    min="0"
                    placeholder="e.g. 175"
                    value={height} 
                    onChange={e => setHeight(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-md placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4 mt-6 border-t border-slate-800 flex justify-end">
              <button 
                type="submit" 
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white text-sm font-bold uppercase tracking-wider rounded border border-red-500 hover:bg-red-700 transition"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
            <p className="text-xs text-slate-500 italic mt-2 text-right">
              Data is stored securely on your local device only.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
