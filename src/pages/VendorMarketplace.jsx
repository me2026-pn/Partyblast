import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';

const CATS = ['All','DJ / Music','Photographer','Videographer','Caterer','Florist / Decor','Lighting / AV'];
const CAT_ICONS = { 'DJ / Music':'🎵','Photographer':'📸','Videographer':'🎬','Caterer':'🍽️','Florist / Decor':'🌸','Lighting / AV':'💡' };

const DEMO_VENDORS = [
  { id:'1', business_name:'DJ Nova', category:'DJ / Music', city:'Miami, FL', bio:'10+ years spinning weddings, clubs, and private events. Top 40, R&B, hip-hop, and Afrobeats.', starting_price:'$800', rating:'4.9', review_count:127, is_featured:true, event_types:['Weddings','Parties'] },
  { id:'2', business_name:'Lena Visuals', category:'Photographer', city:'Atlanta, GA', bio:'Award-winning event photographer. Natural light specialist. 7-day delivery.', starting_price:'$1,200', rating:'5.0', review_count:89, is_featured:true, event_types:['Weddings','Events'] },
  { id:'3', business_name:'Taste by Marcus', category:'Caterer', city:'Houston, TX', bio:'Full-service catering for all occasions. Custom menus, live stations, and bar service.', starting_price:'$35/head', rating:'4.8', review_count:212, is_featured:false, event_types:['Weddings','Corporate'] },
  { id:'4', business_name:'Bloom and Co.', category:'Florist / Decor', city:'New York, NY', bio:'Luxury floral design for weddings and upscale events. Custom installations.', starting_price:'$500', rating:'4.9', review_count:64, is_featured:true, event_types:['Weddings','Galas'] },
  { id:'5', business_name:'FrameIt Cinematic', category:'Videographer', city:'Los Angeles, CA', bio:'Cinematic wedding films and event highlight reels. 4K drone footage available.', starting_price:'$1,800', rating:'4.7', review_count:43, is_featured:false, event_types:['Weddings','Parties'] },
  { id:'6', business_name:'Lights Up AV', category:'Lighting / AV', city:'Dallas, TX', bio:'Professional lighting design, PA systems, LED uplighting for any event.', starting_price:'$600', rating:'4.8', review_count:98, is_featured:false, event_types:['Weddings','Corporate'] },
];

export default function VendorMarketplace() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState(DEMO_VENDORS);
  const [cat, setCat]         = useState('All');
  const [search, setSearch]   = useState('');
  const [activeVendor, setActive] = useState(null);
  const [messages, setMessages]   = useState([]);
  const [msgInput, setMsgInput]   = useState('');

  useEffect(() => {
    api.vendors.list().then(d => { if (d?.vendors?.length) setVendors(d.vendors); }).catch(() => {});
  }, []);

  const filtered = vendors.filter(v =>
    (cat === 'All' || v.category === cat) &&
    (!search || (v.business_name + v.bio + v.category).toLowerCase().includes(search.toLowerCase()))
  );

  function openChat(v) {
    setActive(v);
    setMessages([{ sender: v.business_name, body: "Hi! I'd love to hear about your event. What date are you planning?" }]);
  }

  async function sendMsg() {
    if (!msgInput.trim()) return;
    const body = msgInput.trim();
    setMessages(m => [...m, { sender: 'me', body }]);
    setMsgInput('');
    if (user && activeVendor?.user_id) {
      try { await api.messages.send({ recipient_id: activeVendor.user_id, vendor_id: activeVendor.id, body }); } catch {}
    }
    setTimeout(() => setMessages(m => [...m, { sender: activeVendor.business_name, body: "Thanks! What's the approximate guest count?" }]), 1200);
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Vendor marketplace</h1>
      <p style={{ color: '#8b83b0', fontSize: 13, marginBottom: 20 }}>Find and book DJs, photographers, caterers, florists, and more.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 8, color: '#f0ecff', padding: '7px 12px', fontSize: 13, outline: 'none', width: 200, fontFamily: 'Inter,sans-serif' }} />
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontFamily: 'Inter,sans-serif', border: '1px solid', cursor: 'pointer', borderColor: cat===c ? '#7c3aed' : '#2a2448', color: cat===c ? '#9d65f5' : '#8b83b0', background: cat===c ? 'rgba(124,58,237,.1)' : 'transparent' }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {filtered.map(v => (
          <div key={v.id} style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: 'rgba(124,58,237,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{CAT_ICONS[v.category] || '✨'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, margin: 0 }}>{v.business_name}</h3>
                  {v.is_featured && <span style={{ background: 'rgba(124,58,237,.25)', color: '#9d65f5', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>Featured</span>}
                </div>
                <div style={{ fontSize: 11, color: '#8b83b0' }}>{v.category} · {v.city}</div>
                <div style={{ color: '#fbbf24', fontSize: 12 }}>{'★'.repeat(Math.floor(Number(v.rating||5)))} <span style={{ color: '#8b83b0' }}>{Number(v.rating||5).toFixed(1)} ({v.review_count||0})</span></div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#8b83b0', lineHeight: 1.5 }}>{v.bio}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#9d65f5' }}>From {v.starting_price}</div>
              <button onClick={() => openChat(v)} style={{ background: '#0d9488', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'Syne,sans-serif', fontWeight: 700 }}>Message</button>
            </div>
          </div>
        ))}
      </div>

      {activeVendor && (
        <div style={{ marginTop: 20, background: 'rgba(0,0,0,.5)', borderRadius: 12, padding: 20 }}>
          <div style={{ background: '#1e1a35', border: '1px solid #3d3666', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700 }}>Message {activeVendor.business_name}</h3>
              <button onClick={() => setActive(null)} style={{ background: 'transparent', border: '1px solid #3d3666', color: '#8b83b0', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>✕ Close</button>
            </div>
            <div style={{ background: '#16132a', borderRadius: 10, padding: 14, marginBottom: 10, maxHeight: 200, overflowY: 'auto' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  {m.sender !== 'me' && <div style={{ fontSize: 10, color: '#8b83b0', marginBottom: 3 }}>{m.sender}</div>}
                  <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12, background: m.sender==='me' ? 'rgba(124,58,237,.25)' : '#1e1a35', color: m.sender==='me' ? '#e0d6ff' : '#f0ecff', maxWidth: '85%', marginLeft: m.sender==='me' ? 'auto' : 0 }}>{m.body}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMsg()} placeholder="Type a message..." style={{ flex: 1, background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'Inter,sans-serif' }} />
              <button onClick={sendMsg} style={{ background: '#0d9488', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Syne,sans-serif', fontWeight: 700 }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}