import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';

const CATS = ['DJ / Music','Photographer','Videographer','Caterer','Florist / Decor','Venue','MC / Host','Lighting / AV','Cake / Desserts','Hair and Makeup','Transportation','Other'];
const EVENT_TYPES = [['🎉','Parties'],['💍','Weddings'],['🏢','Corporate'],['🎂','Birthdays'],['🎓','Graduations'],['🌿','Festivals'],['👶','Baby showers'],['🎊','Other']];

export default function JoinVendor({ onAuthRequired }) {
  const { user, hasActiveSub, refreshProfile } = useAuth();
  const [tab, setTab]     = useState('profile');
  const [plan, setPlan]   = useState(null);
  const [evTypes, setEvTypes] = useState(['Parties','Weddings']);
  const [error, setError] = useState('');
  const [submitting, setSub] = useState(false);
  const [genLoading, setGen] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [form, setForm] = useState({ business_name:'', category:'', city:'', bio:'', starting_price:'', phone:'', email:'', website:'' });

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const togEvType = label => setEvTypes(t => t.includes(label) ? t.filter(x => x !== label) : [...t, label]);

  async function generateBio() {
    if (!form.business_name || !form.category) { setError('Enter your business name and category first.'); return; }
    setGen(true); setError('');
    try {
      const { bio } = await api.ai.vendorBio({ ...form, event_types: evTypes });
      setForm(f => ({ ...f, bio }));
    } catch { setError('Bio generation failed.'); }
    finally { setGen(false); }
  }

  async function launchListing() {
    if (!user) { onAuthRequired(); return; }
    if (!plan) { setError('Choose a listing plan.'); return; }
    setSub(true); setError('');
    try {
      await api.vendors.create({ ...form, event_types: evTypes });
      if (!hasActiveSub('vendor')) {
        const { url } = await api.checkout.session(plan, 'vendor');
        window.location.href = url;
        return;
      }
      setLaunched(true);
    } catch (e) { setError(e.message); }
    finally { setSub(false); }
  }

  if (launched) return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>🎉</div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Your listing is live!</h2>
      <p style={{ color: '#8b83b0', fontSize: 14, marginBottom: 24 }}>{form.business_name} is now visible to event hosts in your area.</p>
      <button onClick={() => setLaunched(false)} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Edit your listing</button>
    </div>
  );

  const inputStyle = { width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Join as a vendor</h1>
      <p style={{ color: '#8b83b0', fontSize: 13, marginBottom: 20 }}>Reach thousands of event hosts. DJs, photographers, caterers, florists, and more welcome.</p>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #2a2448', marginBottom: 18 }}>
        {[['profile','Your profile'],['plan','Listing plan']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', color: tab===id ? '#9d65f5' : '#8b83b0', borderBottom: `2px solid ${tab===id ? '#9d65f5' : 'transparent'}`, marginBottom: -1, background: 'transparent', border: 'none', borderBottom: `2px solid ${tab===id ? '#9d65f5' : 'transparent'}`, fontFamily: 'Inter,sans-serif' }}>{label}</button>
        ))}
      </div>

      {error && <div style={{ background: 'rgba(226,75,74,.12)', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f09595', marginBottom: 12 }}>{error}</div>}

      {tab === 'profile' && (
        <>
          <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Business name</label><input style={inputStyle} value={form.business_name} onChange={upd('business_name')} placeholder="SoundWave DJ Services" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div><label style={labelStyle}>Category</label><select style={inputStyle} value={form.category} onChange={upd('category')}><option value="">Select...</option>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label style={labelStyle}>City</label><input style={inputStyle} value={form.city} onChange={upd('city')} placeholder="Miami, FL" /></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Bio</label>
              <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.bio} onChange={upd('bio')} placeholder="Tell hosts what makes your service stand out..." />
              <button onClick={generateBio} disabled={genLoading} style={{ marginTop: 6, background: 'transparent', border: '1px solid #7c3aed', color: '#9d65f5', borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>{genLoading ? 'Writing...' : '✨ Generate bio with AI'}</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div><label style={labelStyle}>Starting price</label><input style={inputStyle} value={form.starting_price} onChange={upd('starting_price')} placeholder="$500" /></div>
              <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={upd('phone')} placeholder="+1 (305) 555-0190" /></div>
            </div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={upd('email')} placeholder="hello@yourbusiness.com" /></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Website</label><input style={inputStyle} value={form.website} onChange={upd('website')} placeholder="https://yourbusiness.com" /></div>
            <div>
              <label style={labelStyle}>Event types you serve</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 8 }}>
                {EVENT_TYPES.map(([emoji, label]) => (
                  <div key={label} onClick={() => togEvType(label)} style={{ background: evTypes.includes(label) ? 'rgba(124,58,237,.15)' : '#0f0c1e', border: `1px solid ${evTypes.includes(label) ? '#9d65f5' : '#3d3666'}`, borderRadius: 8, padding: '9px 6px', cursor: 'pointer', textAlign: 'center', fontSize: 11, color: evTypes.includes(label) ? '#9d65f5' : '#8b83b0' }}>
                    <div style={{ fontSize: 20, marginBottom: 3 }}>{emoji}</div>{label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setTab('plan')} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Next: Choose plan →</button>
          </div>
        </>
      )}

      {tab === 'plan' && (
        <>
          <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Vendor listing plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['weekly','Weekly','$19.99','/week',['Appear in marketplace','Message from hosts','Basic profile','Cancel anytime']],['monthly','Monthly','$49.99','/month',['Featured placement','Unlimited messages','Verified badge','Analytics']]].map(([id,label,price,per,perks]) => (
                <div key={id} onClick={() => setPlan(id)} style={{ background: plan===id ? 'rgba(124,58,237,.1)' : '#0f0c1e', border: `2px solid ${plan===id ? '#7c3aed' : '#3d3666'}`, borderRadius: 12, padding: 18, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#8b83b0', marginBottom: 8 }}>{label}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800 }}>{price}<span style={{ fontSize: 12, fontWeight: 400, color: '#8b83b0' }}>{per}</span></div>
                  <div style={{ fontSize: 11, color: '#8b83b0', marginTop: 10, textAlign: 'left', lineHeight: 1.8 }}>{perks.map(p => <div key={p}>✓ {p}</div>)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setTab('profile')} style={{ background: 'transparent', border: '1px solid #3d3666', color: '#8b83b0', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>← Back</button>
            <button onClick={launchListing} disabled={submitting} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{submitting ? 'Launching...' : 'Launch listing 🚀'}</button>
          </div>
        </>
      )}
    </div>
  );
}