import { useState } from 'react';

export default function EventDetail({ event, onBack }) {
  const [rsvpd, setRsvpd] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(event?.rsvp_count || 0);
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const dateStr = event.date
    ? new Date(event.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBD';

  function handleRSVP() {
    if (rsvpd) return;
    setRsvpd(true);
    setRsvpCount(c => c + 1);
    if (event.rsvp_link) window.open(event.rsvp_link, '_blank');
  }

  function shareEvent() {
    const text = `Check out ${event.name} on PartyBlast! 🎉`;
    if (navigator.share) {
      navigator.share({ title: event.name, text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function shareToTwitter() {
    const text = encodeURIComponent(`Check out ${event.name} on PartyBlast! 🎉 ${event.date ? `📅 ${dateStr}` : ''} ${event.venue ? `📍 ${event.venue}` : ''}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }

  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>

      {/* Back button */}
      <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #2a2448', color: '#8b83b0', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Back to events
      </button>

      {/* Hero banner */}
      <div style={{ height: 200, background: 'linear-gradient(135deg,#4c1d95,#831843,#1e1b4b)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, marginBottom: 24, position: 'relative' }}>
        {event.event_emoji || '🎉'}
        {event.is_trending && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(219,39,119,.25)', color: '#f472b6', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20 }}>🔥 Trending</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

        {/* Left col */}
        <div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ background: 'rgba(124,58,237,.2)', color: '#9d65f5', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{event.event_type}</span>
          </div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{event.name}</h1>

          <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            {[
              ['📅', 'Date', dateStr + (event.time ? ` at ${event.time}` : '')],
              ['📍', 'Venue', [event.venue, event.city, event.country].filter(Boolean).join(', ')],
              ['👤', 'Hosted by', event.host_name || 'PartyBlast Host'],
            ].map(([icon, label, value]) => value && (
              <div key={label} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #2a2448' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#8b83b0', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, color: '#f0ecff' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {event.description && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>About this event</h3>
              <p style={{ fontSize: 14, color: '#a89fd4', lineHeight: 1.7 }}>{event.description}</p>
            </div>
          )}

          {/* Share buttons */}
          <div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Share this event</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={shareEvent} style={{ background: 'rgba(124,58,237,.15)', border: '1px solid #7c3aed', color: '#9d65f5', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                {copied ? '✅ Copied!' : '🔗 Copy link'}
              </button>
              <button onClick={shareToTwitter} style={{ background: 'rgba(29,161,242,.15)', border: '1px solid #1da1f2', color: '#1da1f2', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                🐦 Share on X
              </button>
              <button onClick={shareToFacebook} style={{ background: 'rgba(66,103,178,.15)', border: '1px solid #4267B2', color: '#4267B2', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                👥 Share on Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Right col — RSVP card */}
        <div>
          <div style={{ background: '#16132a', border: '1px solid #2a2448', borderRadius: 12, padding: 20, position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, textAlign: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, color: '#9d65f5' }}>{rsvpCount}</div>
                <div style={{ fontSize: 11, color: '#8b83b0' }}>going</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, color: '#f472b6' }}>{(event.view_count || 0).toLocaleString()}</div>
                <div style={{ fontSize: 11, color: '#8b83b0' }}>views</div>
              </div>
            </div>

            <button
              onClick={handleRSVP}
              style={{
                width: '100%',
                background: rsvpd ? 'rgba(5,150,105,.2)' : 'linear-gradient(90deg,#7c3aed,#db2777)',
                color: rsvpd ? '#34d399' : '#fff',
                border: rsvpd ? '1px solid #059669' : 'none',
                borderRadius: 10,
                padding: '14px',
                fontFamily: 'Syne,sans-serif',
                fontSize: 15,
                fontWeight: 700,
                cursor: rsvpd ? 'default' : 'pointer',
                marginBottom: 12,
              }}
            >
              {rsvpd ? '✅ You\'re going!' : 'RSVP now'}
            </button>

            {event.rsvp_link && (
              <a href={event.rsvp_link} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#8b83b0', textDecoration: 'none', marginBottom: 16 }}>
                Get tickets →
              </a>
            )}

            <div style={{ borderTop: '1px solid #2a2448', paddingTop: 14 }}>
              <div style={{ fontSize: 12, color: '#8b83b0', marginBottom: 8 }}>Promoted on</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(event.platforms || ['Instagram', 'TikTok', 'Facebook']).map(p => (
                  <span key={p} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#1e1a35', border: '1px solid #3d3666', color: '#8b83b0' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}