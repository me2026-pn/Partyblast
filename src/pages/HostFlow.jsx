import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';

const EVENT_TYPES = [
  ['🎉','House party'],['💍','Wedding'],['🥂','Engagement'],['🎂','Birthday'],
  ['🎶','Club night'],['🌅','Rooftop'],['🌿','Festival'],['🏢','Corporate'],
  ['🎓','Graduation'],['🍸','Mixer'],['👶','Baby shower'],['🎊','Other'],
];

const PLATFORMS = ['Instagram','TikTok','Facebook','X / Twitter','Snapchat','Threads','Pinterest','YouTube','LinkedIn'];
const PLAT_COLORS = { Instagram:'#c13584', TikTok:'#69c9d0', Facebook:'#4267B2', 'X / Twitter':'#1da1f2', Snapchat:'#f9c923', Threads:'#aaa', Pinterest:'#e60023', YouTube:'#ff0000', LinkedIn:'#0077b5' };

export default function HostFlow({ onAuthRequired }) {
  const { user, hasActiveSub } = useAuth();
  const [step, setStep]       = useState(0);
  const [eventType, setEventType] = useState(['🎉','House party']);
  const [form, setForm]       = useState({ name:'', date:'', time:'', venue:'', description:'', rsvp_link:'' });
  const [platforms, setPlats] = useState([]);
  const [plan, setPlan]       = useState(null);
  const [aiCaption, setCaption] = useState('');
  const [genLoading, setGenLoad] = useState(false);
  const [submitting, setSubmit] = useState(false);
  const [error, setError]     = useState('');
  const [launched, setLaunched] = useState(false);

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const togPlat = p => setPlats(ps => ps.includes(p) ? ps.filter(x => x !== p) : [...ps, p]);

  async function generateCaption() {
    setGenLoad(true);
    try {
      const { caption } = await api.ai.caption({ ...form, event_type: eventType[1] });
      setCaption(caption);
    } catch (e) { console.error(e); }
    finally { setGenLoad(false); }
  }

  async function launch() {
    if (!user) { onAuthRequired(); return; }
    setSubmit(true); setError('');
    try {
      if (!hasActiveSub('host')) {
        const { url } = await api.checkout.session(plan, 'host');
        window.location.href = url;
        return;
      }
      await api.events.create({ ...form, event_type: eventType[1], event_emoji: eventType[0], platforms, ai_caption: aiCaption });
      setLaunched(true);
    } catch (e) { setError(e.message); }
    finally { setSubmit(false); }
  }

  if (launched) return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>🚀</div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>You're live!</h2>
      <p style={{ color: '#8b83b0', fontSize: 14, marginBottom: 24 }}>{form.name} is being promoted across {platforms.length} platforms!</p>
      <button onClick={() => { setLaunched(false); setStep(0); setForm({ name:'',date:'',time:'',venue:'',description:'',rsvp_link:'' }); setPlats([]); setPlan(null); setCaption(''); }} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Promote another event</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Promote your event</h1>
      <p style={{ color: '#8b83b0', fontSize: 13, marginBottom: 20 }}>Parties, weddings, corporate events and more — across every platform.</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ height: 4, borderRadius: 2, flex: 1, background: i < step ? '#db2777' : i === step ? '#7c3aed' : '#2a2448' }} />)}
      </div>

      {error && <div style={{ background: 'rgba(226,75,74,.12)', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f09595', marginBottom: 12 }}>{error}</div>}

      {step === 0 && (
        <>
          <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>What kind of event?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
              {EVENT_TYPES.map(([emoji, label]) => (
                <div key={label} onClick={() => setEventType([emoji, label])} style={{ background: eventType[1]===label ? 'rgba(124,58,237,.15)' : '#0f0c1e', border: `1px solid ${eventType[1]===label ? '#9d65f5' : '#3d3666'}`, borderRadius: 8, padding: '10px 6px', cursor: 'pointer', textAlign: 'center', fontSize: 11, color: eventType[1]===label ? '#9d65f5' : '#8b83b0' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>{label}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Event name</label><input style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box' }} value={form.name} onChange={upd('name')} placeholder="Sofia and Marco's Wedding" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Date</label><input type="date" style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box' }} value={form.date} onChange={upd('date')} /></div>
              <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Time</label><input type="time" style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box' }} value={form.time} onChange={upd('time')} /></div>
            </div>
            <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Venue</label><input style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box' }} value={form.venue} onChange={upd('venue')} placeholder="The Grand Ballroom, Atlanta" /></div>
            <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>Description</label><textarea style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', outline: 'none', height: 80, resize: 'vertical', boxSizing: 'border-box' }} value={form.description} onChange={upd('description')} placeholder="Tell guests what makes this event special..." /></div>
            <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#8b83b0', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>RSVP link</label><input style={{ width: '100%', background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', fontFamily: 'Inter,sans-serif', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box' }} value={form.rsvp_link} onChange={upd('rsvp_link')} placeholder="https://eventbrite.com/..." /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => { if (!form.name) { setError('Enter an event name.'); return; } setError(''); setStep(1); }} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Next: Platforms →</button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Where to promote</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
              {PLATFORMS.map(p => (
                <div key={p} onClick={() => togPlat(p)} style={{ background: platforms.includes(p) ? 'rgba(124,58,237,.15)' : '#0f0c1e', border: `1px solid ${platforms.includes(p) ? '#9d65f5' : '#3d3666'}`, borderRadius: 8, padding: '9px 6px', cursor: 'pointer', textAlign: 'center', fontSize: 11, color: platforms.includes(p) ? '#9d65f5' : '#8b83b0' }}>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{p==='Instagram'?'📸':p==='TikTok'?'🎵':p==='Facebook'?'👥':p==='X / Twitter'?'🐦':p==='Snapchat'?'👻':p==='Threads'?'🧵':p==='Pinterest'?'📌':p==='YouTube'?'▶️':'💼'}</div>{p}
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Choose your plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['weekly','Weekly','$19.99','/week',['3 posts per platform','Basic analytics','Cancel anytime']],['monthly','Monthly','$49.99','/month',['Daily posts','Full analytics','Paid boost','AI captions']]].map(([id,label,price,per,perks]) => (
                <div key={id} onClick={() => setPlan(id)} style={{ background: plan===id ? 'rgba(124,58,237,.1)' : '#0f0c1e', border: `2px solid ${plan===id ? '#7c3aed' : '#3d3666'}`, borderRadius: 12, padding: 18, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#8b83b0', marginBottom: 8 }}>{label}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800 }}>{price}<span style={{ fontSize: 12, fontWeight: 400, color: '#8b83b0' }}>{per}</span></div>
                  <div style={{ fontSize: 11, color: '#8b83b0', marginTop: 10, textAlign: 'left', lineHeight: 1.8 }}>{perks.map(p => <div key={p}>✓ {p}</div>)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(0)} style={{ background: 'transparent', border: '1px solid #3d3666', color: '#8b83b0', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>← Back</button>
            <button onClick={() => { if (!platforms.length) { setError('Select at least one platform.'); return; } if (!plan) { setError('Choose a plan.'); return; } setError(''); setStep(2); }} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Next: AI captions →</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ background: '#1e1a35', border: '1px solid #3d3666', borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#9d65f5', marginBottom: 8 }}>✦ AI promo copy</div>
            <div style={{ fontSize: 12, color: '#c0b4e8', lineHeight: 1.6, minHeight: 48 }}>{aiCaption || 'Click generate to create a custom caption.'}</div>
            <button onClick={generateCaption} disabled={genLoading} style={{ width: '100%', background: 'transparent', border: '1px solid #7c3aed', color: '#9d65f5', borderRadius: 6, padding: 7, fontSize: 11, cursor: 'pointer', marginTop: 10, fontFamily: 'Inter,sans-serif' }}>{genLoading ? 'Writing...' : '✨ Generate caption'}</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={{ background: 'transparent', border: '1px solid #3d3666', color: '#8b83b0', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>← Back</button>
            <button onClick={() => setStep(3)} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Review and launch →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Order summary</h3>
            {[['Event', form.name],['Type', `${eventType[0]} ${eventType[1]}`],['Platforms', `${platforms.length} selected`],['Plan', plan === 'weekly' ? 'Weekly — $19.99/week' : 'Monthly — $49.99/month']].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '7px 0', borderBottom: '1px solid #2a2448' }}>
                <span style={{ color: '#8b83b0' }}>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 500, paddingTop: 10 }}>
              <span>Total</span><span style={{ color: '#f472b6' }}>{plan === 'weekly' ? '$19.99/week' : '$49.99/month'}</span>
            </div>
          </div>
          <div style={{ background: 'rgba(124,58,237,.08)', borderLeft: '3px solid #7c3aed', padding: '10px 14px', fontSize: 12, color: '#c0b4e8', marginBottom: 14 }}>🔒 Secure checkout via Stripe. Cancel anytime.</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} style={{ background: 'transparent', border: '1px solid #3d3666', color: '#8b83b0', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>← Back</button>
            <button onClick={launch} disabled={submitting} style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{submitting ? 'Launching...' : 'Launch promotion 🚀'}</button>
          </div>
        </>
      )}
    </div>
  );
}