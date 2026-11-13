import React from 'react';

export default function PortalSvgDefs() {
  return (
    <div 
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} 
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<linearGradient id="g3o" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFB37A"/><stop offset=".5" stop-color="#F06A1F"/><stop offset="1" stop-color="#B83D05"/></linearGradient>
<linearGradient id="g3n" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#7DB2E3"/><stop offset=".5" stop-color="#2A5C8C"/><stop offset="1" stop-color="#12304F"/></linearGradient>
<linearGradient id="g3g" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#A6EC8A"/><stop offset=".5" stop-color="#3CAB24"/><stop offset="1" stop-color="#1E6A10"/></linearGradient>
<linearGradient id="g3r" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FF9AAE"/><stop offset=".5" stop-color="#E8264A"/><stop offset="1" stop-color="#9A0E2A"/></linearGradient>
<linearGradient id="g3w" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E9EEF4"/><stop offset="1" stop-color="#AEBACA"/></linearGradient>
<linearGradient id="g3y" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFEB9E"/><stop offset=".5" stop-color="#FFC21A"/><stop offset="1" stop-color="#D9900B"/></linearGradient>
<linearGradient id="g3b" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#CBEBFF"/><stop offset=".5" stop-color="#59B4F0"/><stop offset="1" stop-color="#1F78C1"/></linearGradient>
<linearGradient id="g3p" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFCADF"/><stop offset=".5" stop-color="#FF6FA3"/><stop offset="1" stop-color="#B92C62"/></linearGradient>
<radialGradient id="hl"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="f3" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="2.2" stdDeviation="1.6" flood-color="#0F2A44" flood-opacity=".3"/></filter>
<symbol id="i-moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></symbol>
<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></symbol>
<symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="10" r="2"/></symbol>
<symbol id="i-pill" viewBox="0 0 24 24"><rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m8.5 8.5 7 7"/></symbol>
<symbol id="i-siren" viewBox="0 0 24 24"><path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 21h14v-3H5z"/><path d="M12 2v2M4.2 5.2l1.4 1.4M19.8 5.2l-1.4 1.4"/></symbol>
<symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
<symbol id="i-mic" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></symbol>
<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></symbol>
<symbol id="i-cart" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H6"/></symbol>
<symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol>
<symbol id="i-file" viewBox="0 0 24 24"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></symbol>
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-8-4.6-8-10.3A4.7 4.7 0 0 1 12 7a4.7 4.7 0 0 1 8 2.7C20 15.4 12 20 12 20z"/><path d="M3.5 12h4l2-3 3 6 2-3h6"/></symbol>
<symbol id="i-video" viewBox="0 0 24 24"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol>
<symbol id="i-hosp" viewBox="0 0 24 24"><path d="M4 21V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16M2 21h20M12 7v6M9 10h6M10 21v-4h4v4"/></symbol>
<symbol id="i-amb" viewBox="0 0 24 24"><path d="M2 16V7a1 1 0 0 1 1-1h11v10M14 9h4l4 4v3h-8"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/><path d="M7 8.5v4M5 10.5h4"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 5 5L20 7"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
<symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></symbol>
<symbol id="i-rupee" viewBox="0 0 24 24"><path d="M6 4h12M6 9h12M9 4c6 0 6 9 0 9H6l8 7"/></symbol>
<symbol id="i-history" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
<symbol id="i-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></symbol>
<symbol id="i-box" viewBox="0 0 24 24"><path d="m21 8-9-5-9 5v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></symbol>
<symbol id="i-truck" viewBox="0 0 24 24"><path d="M1 4h14v12H1zM15 9h4l4 4v3h-8"/><circle cx="5.5" cy="18" r="2"/><circle cx="18.5" cy="18" r="2"/></symbol>
<symbol id="i-lungs" viewBox="0 0 24 24"><path d="M12 3v9M12 9c-2 0-3 1-3 3M12 9c2 0 3 1 3 3"/><path d="M9 7.5C6 6 3 9 3 14c0 4 2 6 4 6s2-2 2-4v-6M15 7.5c3-1.5 6 1.5 6 6.5 0 4-2 6-4 6s-2-2-2-4v-6"/></symbol>
<symbol id="i-brain" viewBox="0 0 24 24"><path d="M9.5 3A3 3 0 0 0 7 7a3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 5 2V4a3 3 0 0 0-2.5-1zM14.5 3A3 3 0 0 1 17 7a3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-5 2"/></symbol>
<symbol id="i-stomach" viewBox="0 0 24 24"><path d="M9 3v4c0 2-3 3-3 7a6 6 0 0 0 6 6c3 0 6-2 6-6 0-3-2-4-4-4-1.5 0-2 1-2 2"/></symbol>
<symbol id="i-baby" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="11" r=".5"/><circle cx="15" cy="11" r=".5"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0M12 3c-1 1.5-1 3 1 3"/></symbol>
<symbol id="i-steth" viewBox="0 0 24 24"><path d="M5 3v5a4 4 0 0 0 8 0V3"/><path d="M9 12v3a5 5 0 0 0 10 0v-2"/><circle cx="19" cy="11" r="2"/></symbol>
<symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></symbol>
<symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 2.5s7 7.5 7 12.5a7 7 0 0 1-14 0c0-5 7-12.5 7-12.5z"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>
<symbol id="i-bone" viewBox="0 0 24 24"><path d="M17 10c.7.5 1.5.6 2.4.3a2.5 2.5 0 1 0-2.7-4.1 2.5 2.5 0 1 0-4.1 2.7c-.3.9-.2 1.7.3 2.4L7 17c-.7-.5-1.5-.6-2.4-.3a2.5 2.5 0 1 0 2.7 4.1 2.5 2.5 0 1 0 4.1-2.7c.3-.9.2-1.7-.3-2.4z"/></symbol>
<symbol id="i-scan" viewBox="0 0 24 24"><path d="M3 7V4a1 1 0 0 1 1-1h3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3M7 12h10"/></symbol>
<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></symbol>
<symbol id="i-gift" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z"/></symbol>
<symbol id="i-chart" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-6"/></symbol>
<symbol id="i-urine" viewBox="0 0 24 24"><path d="M8 3h8M9 3v15a3 3 0 0 0 6 0V3M9 11h6"/></symbol>

<linearGradient id="g3s" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFE3C8"/><stop offset=".55" stop-color="#F2B48A"/><stop offset="1" stop-color="#C98757"/></linearGradient>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
<symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V4h6v3"/></symbol>
<symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
<symbol id="i-logout" viewBox="0 0 24 24"><path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/></symbol>
<symbol id="i-left" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></symbol>
<symbol id="i-edit" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></symbol>
<symbol id="i-send" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></symbol>
<symbol id="i-pause" viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></symbol>
<symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></symbol>
<symbol id="i-whats" viewBox="0 0 24 24"><path d="M3 21l1.7-5A9 9 0 1 1 8 19.3z"/><path d="M9 9c0 3 3 6 6 6l1.5-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/></symbol>
<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></symbol>
</defs></svg>` }} 
    />
  );
}
