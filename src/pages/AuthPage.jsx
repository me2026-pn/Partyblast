import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AuthPage({ onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode]     = useState('signin');
  const [email, setEmail]   = useState('');
  const [password, setPass] = useState('');
  const [name, setName]     = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoad]  = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoad(true);
    try {
      if (mode === 'signin') await signIn(email, password);
      else await signUp(email, password, name);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoad(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08060f', padding: 20 }}>
      <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 400 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, background: 'linear-gradient(90deg,#9d65f5,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 20, textAlign: 'center' }}>PartyBlast</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
        <p style={{ color: '#8b83b0', fontSize: 13, marginBottom: 24 }}>{mode === 'signin' ? 'Sign in to manage your events.' : 'Get started promoting events.'}</p>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Full name</label>
              <input style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '10px 12px', outline: 'none', boxSizing: 'border-box' }} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Email</label>
            <input style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '10px 12px', outline: 'none', boxSizing: 'border-box' }} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Password</label>
            <input style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '10px 12px', outline: 'none', boxSizing: 'border-box' }} type="password" value={password} onChange={e => setPass(e.target.value)} placeholder="8+ characters" required minLength={8} />
          </div>
          {error && <div style={{ background: 'rgba(226,75,74,.15)', border: '1px solid #a32d2d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f09595', marginBottom: 14 }}>{error}</div>}
          <button style={{ width: '100%', background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 }} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#8b83b0', marginTop: 18 }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: '#9d65f5', cursor: 'pointer', fontWeight: 500 }} onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
        {onClose && (
          <button style={{ display: 'block', width: '100%', background: 'transparent', border: 'none', color: '#544d75', fontSize: 12, cursor: 'pointer', marginTop: 16, padding: '6px', fontFamily: 'Inter, sans-serif' }} onClick={onClose}>Continue without account</button>
        )}
      </div>
    </div>
  );
}