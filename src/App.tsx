import React from 'react';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Layout } from './components/Layout/Layout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ClientDashboard } from './pages/client/Dashboard';
import { ClientsPage } from './pages/admin/Clients';
import { RequestsPage } from './pages/admin/Requests';
import { ProjectsPage } from './pages/admin/Projects';
import { InvoicesPage } from './pages/admin/Invoices';
import { NewRequestPage } from './pages/client/NewRequest';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, profile, loading, setUser, setProfile, setLoading, fetchProfile } = useAuthStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if Supabase is available
    if (!supabase || !isSupabaseConfigured) {
      console.log('Supabase not configured, stopping auth initialization');
      setLoading(false);
      return;
    }

    // Get initial session and handle errors
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Session retrieved:', session?.user?.email || 'No session');
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log('User found, fetching profile...');
          setLoading(true);
          await fetchProfile();
        } else {
          console.log('No user, clearing profile');
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setLoading, fetchProfile]);

  // Fetch profile when user is set
  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // Show Supabase connection prompt if not available
  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H8c-2.21 0-4-1.79-4-4zm0 0V4c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4v3M4 7h16" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connect to Supabase</h1>
          <p className="text-gray-600 mb-6">
            To use this client management system, you need to connect to Supabase first.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Click the <strong>"Connect to Supabase"</strong> button in the top right corner to get started.
            </p>
          </div>
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">What you'll get:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete database with sample data</li>
              <li>• User authentication system</li>
              <li>• Admin and client portals</li>
              <li>• Project management features</li>
              <li>• Invoice and communication tools</li>
            </ul>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onToggleMode={() => setAuthMode('register')} />
        ) : (
          <Register onToggleMode={() => setAuthMode('login')} />
        )}
        <ToastContainer position="top-right" />
      </>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (profile.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'clients':
          return <ClientsPage />;
        case 'projects':
          return <ProjectsPage />;
        case 'requests':
          return <RequestsPage />;
        case 'invoices':
          return <InvoicesPage />;
        case 'communications':
          return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Communications</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
        case 'analytics':
          return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
        case 'settings':
          return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Settings</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <ClientDashboard />;
        case 'projects':
          return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">My Projects</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
        case 'requests':
          return <NewRequestPage />;
        case 'invoices':
          return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">My Invoices</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
        case 'messages':
          return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Messages</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
        case 'profile':
          return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
        default:
          return <ClientDashboard />;
      }
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
