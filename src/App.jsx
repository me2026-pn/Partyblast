import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import HostFlow from './pages/HostFlow.jsx';
import VendorMarketplace from './pages/VendorMarketplace.jsx';
import JoinVendor from './pages/JoinVendor.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Nav from './components/Nav.jsx';

function AppInner() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('host');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#08060f' }}>
        <div style={{ color: '#8b83b0', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>Loading PartyBlast...</div>
      </div>
    );
  }

  if (showAuth) return <AuthPage onClose={() => setShowAuth(false)} />;

  return (
    <div style={{ background: '#08060f', minHeight: '100vh', color: '#f0ecff', fontFamily: 'Inter, sans-serif' }}>
      <Nav page={page} setPage={setPage} user={user} onAuthClick={() => setShowAuth(true)} />
      {page === 'host'    && <HostFlow onAuthRequired={() => setShowAuth(true)} />}
      {page === 'vendors' && <VendorMarketplace />}
      {page === 'join'    && <JoinVendor onAuthRequired={() => setShowAuth(true)} />}
      {page === 'dash'    && (user ? <Dashboard setPage={setPage} /> : <AuthPage onClose={() => setPage('host')} />)}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}