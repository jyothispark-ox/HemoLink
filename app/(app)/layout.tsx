'use client';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, UserPlus, FileText, Droplet, Archive, Settings, LogOut, Menu, X, UserCircle } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Patients', href: '/patients', icon: UserPlus },
  { name: 'Requests', href: '/requests', icon: FileText },
  { name: 'Donations', href: '/donations', icon: Droplet },
  { name: 'Blood Stock', href: '/stock', icon: Archive },
  { name: 'Admin Panel', href: '/admin', icon: Settings },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="h-screen bg-[#0f172a] text-[#f1f5f9] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#0f172a]/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-56 bg-slate-950 flex flex-col border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 lg:h-16 lg:py-0">
          <Image 
            src="https://i.ibb.co/Z1Lc8JyQ/Hemo-Linklogo.png" 
            alt="HemoLink Logo" 
            width={120} 
            height={40} 
            className="h-8 w-auto object-contain" 
            referrerPolicy="no-referrer" 
          />
          <button className="lg:hidden ml-auto text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-2 text-sm transition-colors cursor-pointer
                  ${isActive 
                    ? 'bg-slate-800 text-white border-r-2 border-red-500' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-red-500' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0f172a]">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              className="lg:hidden text-slate-500 hover:text-slate-300" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-white">System Overview</h1>
              <p className="text-xs text-slate-500">HemoLink Blood Donation Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right hidden sm:block">
              <div className="text-slate-300">Welcome, <b className="text-white">{user?.name || 'Administrator'}</b></div>
              <div className="text-slate-500 font-mono">ID: {user?.id ? user.id.slice(0, 7) : 'AD-1082'}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 overflow-hidden">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
