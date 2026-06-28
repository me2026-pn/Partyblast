import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';

export default function Dashboard({ setPage }) {
  const { profile, user } = useAuth();
  const [tab, setTab]     = useState('events');
  const [events, setEvents] = useState([]);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    if (!user) { setLoad(false); return; }
    api.events.list()
      .then(data => { if (Array.isArray(data)) setEvents(data); })
      .catch(console.warn)
      .finally(() => setLoad(false));
  }, [user]);

  const sub = profile?.subscriptions?.find(s => s.status === 'active');
  const totalReach = events.reduce((a, e) => a + (e.reach_total || 0), 0);

  async function openPortal() {
    try {
      const { url } = await api.checkout.portal();
      window.open(url, '_blank');
    } catch { alert('No active subscription found.'); }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: '#8b83b0', fontSize: 13, marginBottom: 20 }}>Welcome back, {profile?.full_name || user?.email}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          [events.filter(e => e.status === 'live').length, 'Active events', '#9d65f5'],
          [totalReach.toLocaleString(), 'Total reach', '#f472b6'],
          [events.length, 'Total events', '#2dd4bf'],
          [sub ? (sub.plan_type === 'monthly' ? '$49.99/mo' : '$19.99/wk') : 'No plan', 'Plan', '#fbbf24'],
        ].map(([n, label, color]) => (
          <div key={label} style={{ background: '#16132a', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, color, marginBottom: 2 }}>{n}</div>
            <div style={{ fontSize: 11, color: '#8b83b0' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #2a2448', marginBottom: 20 }}>
        {[['events','My events'],['billing','Billing']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', color: tab===id ? '#9d65f5' : '#8b83b0', borderBottom: `2px solid ${tab===id ? '#9d65f5' : 'transparent'}`, marginBottom: -1, background: 'transparent', border: 'none', borderBottom: `2px solid ${tab===id ? '#9d65f5' : 'transparent'}`, fontFamily: 'Inter,sans-serif' }}>{label}</button>
        ))}
      </div>

      {tab === 'events' && (
        <div>
          {loading && <div style={{ color: '#8b83b0' }}>Loading...</div>}
          {!loading && events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, marginBottom: 8 }}>No events yet</h3>
              <p style={{ color: '#8b83b0', fontSize: 13, marginBottom: 20 }}>Start promoting your first event!</p>
              <button onClick={() => setPage('host')} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Promote your first event</button>
            </div>
          )}
          {events.map(ev => (
            <div key={ev.id} style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#1e1a35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{ev.event_emoji || '🎉'}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{ev.name}</h3>
                <div style={{ fontSize: 11, color: '#8b83b0' }}>{ev.event_type} · {(ev.platforms || []).join(', ')}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: ev.status === 'live' ? 'rgba(5,150,105,.2)' : 'rgba(217,119,6,.2)', color: ev.status === 'live' ? '#34d399' : '#fbbf24' }}>{ev.status}</span>
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <button onClick={() => setPage('host')} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Promote a new event</button>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div>
          {sub ? (
            <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 18 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Current subscription</h3>
              {[['Plan', sub.plan_type === 'monthly' ? 'Monthly — $49.99/mo' : 'Weekly — $19.99/wk'],['Type', sub.sub_role],['Status', sub.status]].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #2a2448' }}>
                  <span style={{ color: '#8b83b0' }}>{k}</span><span>{v}</span>
                </div>
              ))}
              <button onClick={openPortal} style={{ marginTop: 14, background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Manage subscription</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 20px' }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, marginBottom: 8 }}>No active subscription</h3>
              <p style={{ color: '#8b83b0', fontSize: 13, marginBottom: 20 }}>Choose a plan to start promoting events.</p>
              <button onClick={() => setPage('host')} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Get started</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}