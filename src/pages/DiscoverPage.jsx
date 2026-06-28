import { useState, useEffect } from 'react';
import { api } from '../lib/api.js';

const EVENT_TYPES = ['All','Wedding','Birthday','Club night','House party','Festival','Corporate','Rooftop','Graduation','Mixer','Baby shower','Engagement','Other'];
const EMOJI_MAP = { 'Wedding':'💍','Birthday':'🎂','Club night':'🎶','House party':'🎉','Festival':'🌿','Corporate':'🏢','Rooftop':'🌅','Graduation':'🎓','Mixer':'🍸','Baby shower':'👶','Engagement':'🥂','Other':'🎊' };

const DEMO_EVENTS = [
  { id:'1', name:"Summer Rooftop Rave", event_type:"Club night", event_emoji:"🎶", date:"2026-07-15", time:"21:00", venue:"Sky Lounge", city:"Miami, FL", country:"USA", description:"Open bar, rooftop skyline views, live DJ set. Dress to impress!", rsvp_count:234, view_count:1820, is_trending:true, host_name:"DJ Nova Events" },
  { id:'2', name:"Sofia & Marco's Wedding", event_type:"Wedding", event_emoji:"💍", date:"2026-08-14", time:"17:00", venue:"The Grand Ballroom", city:"Atlanta, GA", country:"USA", description:"Join us for our special day! Black tie optional.", rsvp_count:180, view_count:940, is_trending:false, host_name:"Sofia Martinez" },
  { id:'3', name:"Jordan's 30th Birthday Bash", event_type:"Birthday", event_emoji:"🎂", date:"2026-07-19", time:"20:00", venue:"Penthouse Suite", city:"New York, NY", country:"USA", description:"30 years of greatness — come celebrate with us!", rsvp_count:89, view_count:560, is_trending:true, host_name:"Jordan Smith" },
  { id:'4', name:"Afrobeats Festival 2026", event_type:"Festival", event_emoji:"🌿", date:"2026-08-01", time:"14:00", venue:"Victoria Island Beach", city:"Lagos", country:"Nigeria", description:"The biggest Afrobeats festival of the year. 20+ artists, 3 stages!", rsvp_count:1240, view_count:8900, is_trending:true, host_name:"Lagos Events Co." },
  { id:'5', name:"Tech Founders Mixer", event_type:"Mixer", event_emoji:"🍸", date:"2026-07-22", time:"18:00", venue:"The Innovation Hub", city:"London", country:"UK", description:"Network with top founders, VCs, and tech leaders.", rsvp_count:145, view_count:720, is_trending:false, host_name:"TechMeet London" },
  { id:'6', name:"Caribbean Carnival Night", event_type:"Club night", event_emoji:"🎶", date:"2026-07-28", time:"22:00", venue:"Carnival Arena", city:"Toronto", country:"Canada", description:"The hottest Caribbean party of the summer. Soca, reggae, dancehall!", rsvp_count:567, view_count:3400, is_trending:true, host_name:"Caribbean Vibes TO" },
  { id:'7', name:"Paris Fashion Week After Party", event_type:"Mixer", event_emoji:"🍸", date:"2026-09-30", time:"23:00", venue:"Club Élysées", city:"Paris", country:"France", description:"Exclusive after party for fashion week. Invite only — RSVP required.", rsvp_count:98, view_count:2100, is_trending:true, host_name:"Mode Paris" },
  { id:'8', name:"Dubai New Year's Eve Gala", event_type:"Club night", event_emoji:"🎶", date:"2026-12-31", time:"20:00", venue:"Burj Khalifa Ballroom", city:"Dubai", country:"UAE", description:"Ring in the new year in the most spectacular city on earth!", rsvp_count:890, view_count:12000, is_trending:true, host_name:"Dubai Events" },
];

export default function DiscoverPage({ onEventClick }) {
  const [events, setEvents]     = useState(DEMO_EVENTS);
  const [filtered, setFiltered] = useState(DEMO_EVENTS);
  const [type, setType]         = useState('All');
  const [search, setSearch]     = useState('');
  const [country, setCountry]   = useState('');
  const [sortBy, setSortBy]     = useState('trending');
  const [view, setView]         = useState('grid');

  useEffect(() => {
    // Try to load real events from API
    api.events?.list?.().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setEvents([...DEMO_EVENTS, ...data.filter(e => e.status === 'live')]);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let result = [...events];
    if (type !== 'All') result = result.filter(e => e.event_type === type);
    if (country) result = result.filter(e => e.country?.toLowerCase().includes(country.toLowerCase()) || e.city?.toLowerCase().includes(country.toLowerCase()));
    if (search) result = result.filter(e => (e.name + e.description + e.city + e.country).toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'trending') result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    if (sortBy === 'date') result.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'rsvp') result.sort((a, b) => (b.rsvp_count || 0) - (a.rsvp_count || 0));
    setFiltered(result);
  }, [events, type, country, search, sortBy]);

  const trending = events.filter(e => e.is_trending).slice(0, 3);

  function shareEvent(ev, e) {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: ev.name, text: ev.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  const cardStyle = (ev) => ({
    background: '#16132a',
    border: '1px solid #2a2448',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform .2s, border-color .2s',
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          Discover events <span style={{ background: 'linear-gradient(90deg,#9d65f5,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>worldwide</span>
        </h1>
        <p style={{ color: '#8b83b0', fontSize: 14 }}>Find parties, weddings, festivals, and more happening around the globe.</p>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 700 }}>Trending now</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {trending.map(ev => (
              <div key={ev.id} onClick={() => onEventClick(ev)} style={{ background: 'linear-gradient(135deg,#1a0f35,#0d0920)', border: '1px solid #3b2e7a', borderRadius: 12, padding: 16, cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(219,39,119,.2)', color: '#f472b6', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>🔥 Trending</div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{ev.event_emoji}</div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 4, paddingRight: 60 }}>{ev.name}</h3>
                <div style={{ fontSize: 11, color: '#8b83b0', marginBottom: 8 }}>📍 {ev.city}, {ev.country} · {ev.date ? new Date(ev.date+'T00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) : ''}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#8b83b0' }}>
                  <span>👁 {ev.view_count?.toLocaleString()}</span>
                  <span>✅ {ev.rsvp_count} going</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search events..." style={{ background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'Inter,sans-serif' }} />
          <input value={country} onChange={e => setCountry(e.target.value)} placeholder="🌍 City or country..." style={{ background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'Inter,sans-serif' }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: '#0f0c1e', border: '1px solid #3d3666', borderRadius: 8, color: '#f0ecff', padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'Inter,sans-serif' }}>
            <option value="trending">Sort: Trending</option>
            <option value="date">Sort: Date</option>
            <option value="rsvp">Sort: Most RSVPs</option>
          </select>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setView('grid')} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid', borderColor: view==='grid' ? '#7c3aed' : '#3d3666', background: view==='grid' ? 'rgba(124,58,237,.15)' : 'transparent', color: view==='grid' ? '#9d65f5' : '#8b83b0', cursor: 'pointer', fontSize: 14 }}>⊞</button>
            <button onClick={() => setView('list')} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid', borderColor: view==='list' ? '#7c3aed' : '#3d3666', background: view==='list' ? 'rgba(124,58,237,.15)' : 'transparent', color: view==='list' ? '#9d65f5' : '#8b83b0', cursor: 'pointer', fontSize: 14 }}>☰</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {EVENT_TYPES.map(t => (
            <button key={t} onClick={() => setType(t)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, border: '1px solid', cursor: 'pointer', fontFamily: 'Inter,sans-serif', borderColor: type===t ? '#7c3aed' : '#2a2448', color: type===t ? '#9d65f5' : '#8b83b0', background: type===t ? 'rgba(124,58,237,.1)' : 'transparent' }}>
              {EMOJI_MAP[t] || ''} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: '#8b83b0', marginBottom: 16 }}>
        Showing <strong style={{ color: '#f0ecff' }}>{filtered.length}</strong> events worldwide
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
          {filtered.map(ev => (
            <div key={ev.id} onClick={() => onEventClick(ev)} style={cardStyle(ev)}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='#3d3666'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#2a2448'; }}>
              <div style={{ height: 100, background: 'linear-gradient(135deg,#4c1d95,#831843)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, position: 'relative' }}>
                {ev.event_emoji}
                {ev.is_trending && <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(219,39,119,.25)', color: '#f472b6', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>🔥</div>}
              </div>
              <div style={{ padding: 14 }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.name}</h3>
                <div style={{ fontSize: 11, color: '#8b83b0', marginBottom: 6 }}>
                  📅 {ev.date ? new Date(ev.date+'T00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) : 'TBD'}
                  {ev.time ? ` · ${ev.time}` : ''}
                </div>
                <div style={{ fontSize: 11, color: '#8b83b0', marginBottom: 8 }}>📍 {ev.venue ? `${ev.venue}, ` : ''}{ev.city}, {ev.country}</div>
                <div style={{ fontSize: 11, color: '#a89fd4', lineHeight: 1.4, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#8b83b0' }}>
                    <span>👁 {(ev.view_count||0).toLocaleString()}</span>
                    <span>✅ {ev.rsvp_count||0}</span>
                  </div>
                  <button onClick={(e) => shareEvent(ev, e)} style={{ background: 'transparent', border: '1px solid #2a2448', color: '#8b83b0', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(ev => (
            <div key={ev.id} onClick={() => onEventClick(ev)} style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#3d3666'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#2a2448'}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg,#4c1d95,#831843)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{ev.event_emoji}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{ev.name}</h3>
                <div style={{ fontSize: 11, color: '#8b83b0' }}>📅 {ev.date ? new Date(ev.date+'T00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : 'TBD'} · 📍 {ev.city}, {ev.country}</div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#8b83b0', flexShrink: 0 }}>
                <span>👁 {(ev.view_count||0).toLocaleString()}</span>
                <span>✅ {ev.rsvp_count||0} going</span>
              </div>
              {ev.is_trending && <span style={{ background: 'rgba(219,39,119,.2)', color: '#f472b6', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>🔥 Trending</span>}
              <button onClick={(e) => shareEvent(ev, e)} style={{ background: 'transparent', border: '1px solid #2a2448', color: '#8b83b0', borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>Share</button>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8b83b0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌍</div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, marginBottom: 8 }}>No events found</h3>
          <p style={{ fontSize: 13 }}>Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
}