import { useAuth } from '../contexts/AuthContext.jsx';

export default function Nav({ page, setPage, onAuthClick }) {
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'host',    label: 'Host an event' },
    { id: 'vendors', label: 'Find vendors' },
    { id: 'join',    label: 'Join as vendor' },
    { id: 'dash',    label: 'Dashboard' },
  ];

  return (
    <nav style={{
      background: '#100d1c',
      borderBottom: '1px solid #2a2448',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      height: 52,
      gap: 4,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: 18,
        background: 'linear-gradient(90deg,#9d65f5,#f472b6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginRight: 16,
        whiteSpace: 'nowrap',
      }}>PartyBlast</div>

      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setPage(t.id)}
          style={{
            padding: '7px 14px',
            fontSize: 13,
            borderRadius: 8,
            cursor: 'pointer',
            color: page === t.id ? '#9d65f5' : '#8b83b0',
            background: page === t.id ? 'rgba(124,58,237,.15)' : 'transparent',
            border: 'none',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            transition: 'all .2s',
          }}
        >{t.label}</button>
      ))}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: 12, color: '#8b83b0' }}>{user.email}</span>
            <button
              onClick={signOut}
              style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, border: '1px solid #2a2448', background: 'transparent', color: '#8b83b0', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >Sign out</button>
          </>
        ) : (
          <button
            onClick={onAuthClick}
            style={{ padding: '7px 16px', fontSize: 13, borderRadius: 8, border: 'none', background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
          >Sign in</button>
        )}
      </div>
    </nav>
  );
}