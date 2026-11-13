// @ts-nocheck
export function initPortalEngine(container, options = {}) {

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const LOGO="/logo.png";
/* ===== 3D icon library (hand-built SVG, shaded with gradients + specular highlights) ===== */
const HL=(cx,cy,rx,ry,r=0)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#hl)" transform="rotate(${r} ${cx} ${cy})"/>`;
const CHK=(x,y)=>`<path d="M${x-3.5} ${y}l2.3 2.3 4-4.6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const W2=(x,y)=>`<circle cx="${x}" cy="${y}" r="6" fill="url(#g3n)"/><circle cx="${x}" cy="${y}" r="2.4" fill="#E9EEF4"/>`;
const A3={
house:`<rect x="41" y="13" width="7" height="13" rx="1.8" fill="url(#g3o)"/><path d="M14 30h36v20a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5z" fill="url(#g3w)"/><rect x="17.5" y="35" width="8" height="8" rx="2" fill="url(#g3b)"/><path d="M28 41a4.5 4.5 0 0 1 9 0v14h-9z" fill="url(#g3n)"/><path d="M6.5 31.5 29 12.6a4.6 4.6 0 0 1 6 0l22.5 18.9a3 3 0 0 1-3.9 4.6L32 18 10.4 36.1a3 3 0 0 1-3.9-4.6z" fill="url(#g3o)"/>${HL(22,23,8,2.2,-40)}`,
steth:`<path d="M18 8v14a12 12 0 0 0 24 0V8" fill="none" stroke="url(#g3n)" stroke-width="5" stroke-linecap="round"/><path d="M30 34v6a11 11 0 0 0 22 0v-6" fill="none" stroke="url(#g3n)" stroke-width="5" stroke-linecap="round"/><circle cx="18" cy="8" r="4.2" fill="url(#g3o)"/><circle cx="42" cy="8" r="4.2" fill="url(#g3o)"/><circle cx="52" cy="28" r="9.5" fill="url(#g3w)"/><circle cx="52" cy="28" r="5.2" fill="url(#g3b)"/>${HL(48.5,24,4,2,-30)}`,
pill:`<g transform="rotate(-35 32 32)"><rect x="8" y="21" width="48" height="22" rx="11" fill="url(#g3w)"/><path d="M19 21h13v22H19a11 11 0 0 1 0-22z" fill="url(#g3o)"/><rect x="31.2" y="21" width="1.6" height="22" fill="#0F2A44" opacity=".14"/>${HL(28,26,16,2.6)}</g>`,
ambulance:`<rect x="21" y="12" width="11" height="8" rx="3" fill="url(#g3r)"/><rect x="5" y="18" width="40" height="28" rx="5" fill="url(#g3w)"/><path d="M44 26h7.5a3 3 0 0 1 2.4 1.2l5 6.6a3 3 0 0 1 .6 1.8V43a3 3 0 0 1-3 3H44z" fill="url(#g3w)"/><path d="M47 29h4.5l4 5.5H47z" fill="url(#g3b)"/><rect x="5" y="37" width="55" height="4" fill="url(#g3r)"/><path d="M22 21.5h4v4.5h4.5v4H26v4.5h-4V30h-4.5v-4H22z" fill="url(#g3r)"/>${W2(16,47)}${W2(49,47)}${HL(18,22,10,2.4)}`,
tube:`<g transform="rotate(25 32 32)"><rect x="24" y="7" width="16" height="50" rx="8" fill="url(#g3w)"/><path d="M24 30h16v19a8 8 0 0 1-16 0z" fill="url(#g3g)"/><rect x="21" y="4" width="22" height="6.5" rx="3.2" fill="url(#g3n)"/><circle cx="30" cy="40" r="2" fill="#fff" opacity=".75"/><circle cx="35" cy="46" r="1.4" fill="#fff" opacity=".75"/>${HL(28.5,21,2,9)}</g>`,
siren:`<g stroke="#FFC21A" stroke-width="4" stroke-linecap="round"><path d="M32 3v6M12 11l4 4M52 11l-4 4M5 29h5M54 29h5"/></g><path d="M17 45V32a15 15 0 0 1 30 0v13z" fill="url(#g3r)"/><rect x="12" y="44" width="40" height="11" rx="4" fill="url(#g3n)"/><rect x="29" y="27" width="6" height="12" rx="3" fill="#fff" opacity=".85"/>${HL(24,30,3.5,7,20)}`,
calendar:`<rect x="9" y="13" width="46" height="44" rx="9" fill="url(#g3w)"/><path d="M9 22a9 9 0 0 1 9-9h28a9 9 0 0 1 9 9v6H9z" fill="url(#g3o)"/><rect x="19" y="7" width="6" height="13" rx="3" fill="url(#g3n)"/><rect x="39" y="7" width="6" height="13" rx="3" fill="url(#g3n)"/><g fill="#1C3D5E" opacity=".22"><rect x="16" y="34" width="7" height="6" rx="2"/><rect x="27" y="34" width="7" height="6" rx="2"/><rect x="16" y="45" width="7" height="6" rx="2"/><rect x="27" y="45" width="7" height="6" rx="2"/></g><circle cx="45" cy="45" r="8.5" fill="url(#g3g)"/>${CHK(45,45)}${HL(24,17,10,2)}`,
bolt:`<path d="M37 4 13 36h15l-4 24 27-34H36z" fill="url(#g3y)" stroke="#D9900B" stroke-width="1.5" stroke-linejoin="round"/>${HL(27,22,2.6,9,37)}`,
magnifier:`<path d="M41 41l13 13" stroke="url(#g3o)" stroke-width="9" stroke-linecap="round"/><circle cx="27" cy="27" r="19" fill="url(#g3n)"/><circle cx="27" cy="27" r="13.5" fill="url(#g3b)"/>${HL(22,21,6,3.4,-35)}`,
clipboard:`<rect x="11" y="9" width="42" height="50" rx="7" fill="url(#g3o)"/><rect x="16" y="15" width="32" height="39" rx="4" fill="url(#g3w)"/><rect x="23" y="5" width="18" height="10" rx="4" fill="url(#g3n)"/><g fill="#1C3D5E" opacity=".3"><rect x="21" y="24" width="16" height="3" rx="1.5"/><rect x="21" y="31" width="22" height="3" rx="1.5"/><rect x="21" y="38" width="10" height="3" rx="1.5"/></g><circle cx="42" cy="46" r="7.5" fill="url(#g3g)"/>${CHK(42,46)}`,
heart:`<path d="M32 56C14 44 6 34 7.5 23 9 13 22 9 32 20 42 9 55 13 56.5 23 58 34 50 44 32 56z" fill="url(#g3r)"/><path d="M14 31h9l3-6 5 12 4-8 3 4h12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${HL(19,20,7,3.6,-30)}`,
lungs:`<path d="M27 22c-9-3-18 7-19 21-.7 9 3 13 9 13 7 0 11-3 11-9V25c0-1.5-.3-2.6-1-3z" fill="url(#g3p)"/><path d="M37 22c9-3 18 7 19 21 .7 9-3 13-9 13-7 0-11-3-11-9V25c0-1.5.3-2.6 1-3z" fill="url(#g3p)"/><path d="M32 5v18M32 22l-6 6M32 22l6 6" stroke="#2A5C8C" stroke-width="4" stroke-linecap="round" fill="none"/>${HL(15,34,2.6,8,15)}${HL(49,34,2.6,8,-15)}`,
brain:`<g fill="url(#g3p)"><circle cx="21" cy="26" r="12"/><circle cx="33" cy="19" r="12"/><circle cx="44" cy="27" r="12"/><circle cx="22" cy="38" r="12"/><circle cx="42" cy="39" r="12"/><circle cx="32" cy="33" r="13"/></g><path d="M34 47c0 4 2 7 6 9" stroke="#B92C62" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M32 11v33M19 28c4 0 4 5 8 5M45 26c-4 0-4 5-8 5M21 43c3-3 7-1 8 2M43 43c-3-3-7-1-8 2" stroke="#B92C62" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".6"/>${HL(25,14,7,2.6,-20)}`,
stomach:`<path d="M22 6v12c0 5-11 9-11 24 0 10 9 16 20 16 13 0 22-9 22-20 0-9-6-14-13-14-6 0-8 4-8 7v1c0 3-2 4-4 4s-3-2-3-4V6z" fill="url(#g3p)"/><path d="M20 6h8" stroke="#B92C62" stroke-width="3" stroke-linecap="round"/>${HL(18,36,2.8,8,10)}`,
bottle:`<path d="M27 4c-2 0-3 4-3 8h16c0-4-1-8-3-8z" fill="url(#g3y)"/><rect x="20" y="12" width="24" height="8" rx="3" fill="url(#g3b)"/><rect x="18" y="19" width="28" height="39" rx="9" fill="url(#g3w)"/><path d="M18 34h28v15a9 9 0 0 1-9 9H27a9 9 0 0 1-9-9z" fill="#FFF3D6"/><g stroke="#59B4F0" stroke-width="2" stroke-linecap="round"><path d="M38 26h4M38 32h4M38 38h4M38 44h4"/></g>${HL(23,31,2.4,9)}`,
upload:`<path d="M14 8h24l12 12v34a5 5 0 0 1-5 5H14a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z" fill="url(#g3w)"/><path d="M38 8v8a4 4 0 0 0 4 4h8z" fill="#AEBACA"/><g fill="#1C3D5E" opacity=".25"><rect x="15" y="22" width="16" height="3" rx="1.5"/><rect x="15" y="29" width="20" height="3" rx="1.5"/></g><circle cx="42" cy="45" r="13" fill="url(#g3o)"/><path d="M42 52V39M36.5 44l5.5-5.5 5.5 5.5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
truck:`<rect x="4" y="14" width="36" height="30" rx="4" fill="url(#g3o)"/><path d="M40 22h9a3 3 0 0 1 2.5 1.3l6 8.5a3 3 0 0 1 .5 1.7V41a3 3 0 0 1-3 3H40z" fill="url(#g3n)"/><path d="M43 25h5.5l5 7H43z" fill="url(#g3b)"/><path d="M12 24h16M12 30h10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>${W2(15,46)}${W2(48,46)}${HL(16,18,10,2.4)}`,
alarm:`<circle cx="15" cy="13" r="7" fill="url(#g3o)"/><circle cx="49" cy="13" r="7" fill="url(#g3o)"/><path d="M18 52l-5 6M46 52l5 6" stroke="#2A5C8C" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="34" r="22" fill="url(#g3o)"/><circle cx="32" cy="34" r="16.5" fill="url(#g3w)"/><path d="M32 24v10l7 5" stroke="#12304F" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="34" r="2.2" fill="#E8264A"/>${HL(23,21,7,2.6,-35)}`,
drop:`<path d="M32 5S13 26 13 39a19 19 0 0 0 38 0C51 26 32 5 32 5z" fill="url(#g3r)"/>${HL(24,37,3.4,8,15)}<circle cx="41" cy="46" r="2" fill="#fff" opacity=".5"/>`,
chart:`<rect x="7" y="9" width="50" height="46" rx="8" fill="url(#g3w)"/><rect x="15" y="34" width="8" height="14" rx="2.5" fill="url(#g3b)"/><rect x="28" y="26" width="8" height="22" rx="2.5" fill="url(#g3o)"/><rect x="41" y="18" width="8" height="30" rx="2.5" fill="url(#g3g)"/><path d="M13 29l12-8 9 4 14-11" stroke="#E8264A" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
sun:`${[0,45,90,135,180,225,270,315].map(a=>`<rect x="29.5" y="3" width="5" height="10" rx="2.5" fill="url(#g3y)" transform="rotate(${a} 32 32)"/>`).join('')}<circle cx="32" cy="32" r="15" fill="url(#g3y)"/>${HL(27,26,6,3.4,-30)}`,
bandage:`<g transform="rotate(-40 32 32)"><rect x="4" y="21" width="56" height="22" rx="11" fill="url(#g3y)"/><rect x="22" y="21" width="20" height="22" fill="url(#g3w)"/><g fill="#B87708" opacity=".5"><circle cx="11" cy="29" r="1.3"/><circle cx="15" cy="35" r="1.3"/><circle cx="53" cy="29" r="1.3"/><circle cx="49" cy="35" r="1.3"/></g><g fill="#AEBACA"><circle cx="28" cy="28" r="1.2"/><circle cx="36" cy="28" r="1.2"/><circle cx="32" cy="32" r="1.2"/><circle cx="28" cy="36" r="1.2"/><circle cx="36" cy="36" r="1.2"/></g>${HL(32,24.5,22,1.8)}</g>`,
box:`<path d="M8 17 32 28v28L8 43z" fill="url(#g3o)"/><path d="M56 17 32 28v28l24-13z" fill="#B83D05"/><path d="M8 17 32 6l24 11-24 11z" fill="#FFB37A"/><path d="M20 11.5 44 22.5V30l-4 2v-7.6L16 13.4z" fill="#FFE6D3" opacity=".95"/>`,
hospital:`<rect x="10" y="18" width="44" height="38" rx="5" fill="url(#g3w)"/><rect x="10" y="18" width="44" height="7" rx="3" fill="url(#g3n)"/><g fill="url(#g3b)"><rect x="15" y="30" width="7" height="7" rx="1.5"/><rect x="42" y="30" width="7" height="7" rx="1.5"/><rect x="15" y="42" width="7" height="7" rx="1.5"/><rect x="42" y="42" width="7" height="7" rx="1.5"/></g><path d="M26 56V45a6 6 0 0 1 12 0v11z" fill="url(#g3n)"/><rect x="22" y="3" width="20" height="19" rx="5" fill="url(#g3r)"/><path d="M30 7.5h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="#fff"/>`,
phone:`<path d="M17 7c-5 1-9 6-9 12 1 20 17 36 37 37 6 0 11-4 12-9l1-5c.3-2-1-3.6-2.7-4.2l-9-3.1c-1.7-.6-3.5 0-4.6 1.4L39 39c-7-3-11-8-14-14l3.4-2.9c1.3-1.2 1.8-3 1.2-4.6l-3.3-8.8C25.7 7 24 6 22 6.3z" fill="url(#g3g)"/>${HL(15,22,2.8,8,-20)}`,
thermo:`<g transform="rotate(35 32 32)"><rect x="25" y="4" width="14" height="40" rx="7" fill="url(#g3w)"/><rect x="29" y="16" width="6" height="30" rx="3" fill="url(#g3r)"/><circle cx="32" cy="48" r="10" fill="url(#g3r)"/><path d="M35 12h3M35 18h3M35 24h3M35 30h3" stroke="#8A97A8" stroke-width="1.6" stroke-linecap="round"/>${HL(28,45,3,3.6)}${HL(28,14,1.6,6)}</g>`,
pin:`<path d="M32 58S12 38 12 24a20 20 0 0 1 40 0c0 14-20 34-20 34z" fill="url(#g3r)"/><circle cx="32" cy="24" r="8" fill="url(#g3w)"/>${HL(23,15,5,2.6,-35)}`,
scan:`<rect x="8" y="6" width="48" height="52" rx="8" fill="url(#g3n)"/><rect x="13" y="11" width="38" height="42" rx="5" fill="#0B1E33"/><g stroke="#CFE6FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"><path d="M32 16v30M30 22c-6-1-11 1-13 4M30 28c-6-1-11 1-13 4M30 34c-6-1-10 1-12 4M34 22c6-1 11 1 13 4M34 28c6-1 11 1 13 4M34 34c6-1 10 1 12 4"/></g>${HL(20,8.5,9,1.4)}`,
grid:`<rect x="8" y="8" width="21" height="21" rx="6" fill="url(#g3o)"/><rect x="35" y="8" width="21" height="21" rx="6" fill="url(#g3g)"/><rect x="8" y="35" width="21" height="21" rx="6" fill="url(#g3b)"/><rect x="35" y="35" width="21" height="21" rx="6" fill="url(#g3p)"/>${HL(15,13,5,2)}${HL(42,13,5,2)}`,
};
const D3=n=>`<svg viewBox="0 0 64 64" class="i3d" aria-hidden="true"><ellipse cx="32" cy="60" rx="17" ry="2.6" fill="#0F2A44" opacity=".16"/><g filter="url(#f3)">${A3[n]||''}</g></svg>`;
const MAP3={steth:'steth',pill:'pill',flask:'tube',siren:'siren',cal:'calendar',bolt:'bolt',search:'magnifier',history:'clipboard',heart:'heart',lungs:'lungs',brain:'brain',stomach:'stomach',baby:'bottle',upload:'upload',truck:'truck',bell:'alarm',drop:'drop',chart:'chart',sun:'sun',bone:'bandage',grid:'grid',hosp:'hospital',amb:'ambulance',users:'phone',sparkle:'thermo',file:'upload',pin:'pin',urine:'tube',scan:'scan',box:'box'};

/* ---------- extra 3D icons for the portal ---------- */
Object.assign(A3,{
user:`<path d="M11 57c0-13 9.5-20 21-20s21 7 21 20z" fill="url(#g3n)"/><circle cx="32" cy="21" r="12" fill="url(#g3s)"/><path d="M20 19c1-8 7-11 12-11s11 3 12 11c-3-3-7-4-12-4s-9 1-12 4z" fill="#3B2A20"/>${HL(27,15,5,2.2,-25)}`,
users:`<path d="M30 56c0-10 7-16 16-16s16 6 16 16z" fill="url(#g3g)"/><circle cx="46" cy="27" r="9" fill="url(#g3s)"/><path d="M2 57c0-12 8.5-18 19-18s19 6 19 18z" fill="url(#g3n)"/><circle cx="21" cy="24" r="11" fill="url(#g3s)"/>${HL(17,19,4,2,-25)}`,
receipt:`<path d="M12 5h40v50l-5-4-5 4-5-4-5 4-5-4-5 4-5-4-5 4z" fill="url(#g3w)"/><g fill="#1C3D5E" opacity=".28"><rect x="19" y="14" width="18" height="3" rx="1.5"/><rect x="19" y="21" width="26" height="3" rx="1.5"/><rect x="19" y="28" width="22" height="3" rx="1.5"/></g><circle cx="42" cy="40" r="11" fill="url(#g3o)"/><text x="42" y="45" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="Arial">₹</text>`,
coin:`<circle cx="32" cy="34" r="22" fill="#D9900B"/><circle cx="32" cy="31" r="22" fill="url(#g3y)"/><circle cx="32" cy="31" r="16" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><text x="32" y="39.5" text-anchor="middle" font-size="22" font-weight="800" fill="#B87708" font-family="Arial">₹</text>${HL(24,20,7,3,-35)}`,
gear:`${[0,45,90,135].map(a=>`<rect x="27" y="5" width="10" height="54" rx="4" fill="url(#g3n)" transform="rotate(${a} 32 32)"/>`).join('')}<circle cx="32" cy="32" r="19" fill="url(#g3n)"/><circle cx="32" cy="32" r="8" fill="url(#g3w)"/>${HL(25,22,6,2.5,-35)}`,
ret:`<circle cx="32" cy="32" r="25" fill="url(#g3g)"/><path d="M22 30a11 11 0 1 1 3 9" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M15 25l7 6 6-7" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${HL(23,17,8,3,-35)}`,
cart:`<path d="M4 10h8l6 30h32l6-22H15" fill="none" stroke="url(#g3n)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 18h40l-5 18H19z" fill="url(#g3o)"/>${W2(22,50)}${W2(46,50)}${HL(30,22,10,2)}`,
book:`<rect x="12" y="6" width="42" height="52" rx="6" fill="url(#g3n)"/><rect x="16" y="10" width="34" height="44" rx="3" fill="url(#g3w)"/><rect x="12" y="6" width="9" height="52" rx="4" fill="url(#g3o)"/><g fill="#1C3D5E" opacity=".3"><rect x="26" y="18" width="18" height="3" rx="1.5"/><rect x="26" y="25" width="14" height="3" rx="1.5"/><rect x="26" y="32" width="18" height="3" rx="1.5"/></g><circle cx="41" cy="45" r="6" fill="url(#g3g)"/>`,
lock3:`<path d="M20 28v-7a12 12 0 0 1 24 0v7" fill="none" stroke="url(#g3w)" stroke-width="6" stroke-linecap="round"/><rect x="12" y="27" width="40" height="30" rx="8" fill="url(#g3y)"/><circle cx="32" cy="40" r="4" fill="#8A5A00"/><rect x="30.5" y="41" width="3" height="8" rx="1.5" fill="#8A5A00"/>${HL(20,32,8,2.4)}`,
doc:`<circle cx="32" cy="20" r="12" fill="url(#g3s)"/><path d="M20 18c1-8 6-11 12-11s11 3 12 11c-3-2-7-3-12-3s-9 1-12 3z" fill="#2B1E17"/><path d="M10 58c0-13 10-20 22-20s22 7 22 20z" fill="url(#g3w)"/><path d="M27 38l5 9 5-9" fill="url(#g3b)"/><path d="M22 41v8a5 5 0 0 0 10 0" stroke="#2A5C8C" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="32" cy="49" r="2.6" fill="url(#g3o)"/>${HL(26,15,4,2,-25)}`,
});
Object.assign(A3,{
mega:`<path d="M14 40l5 15a3 3 0 0 0 3 2h4a2 2 0 0 0 2-2.6L24 40z" fill="url(#g3n)"/><path d="M9 25h11l25-13v40L20 39H9a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z" fill="url(#g3o)"/><rect x="43" y="9" width="9" height="46" rx="4.5" fill="url(#g3n)"/><path d="M56 25c3 3 3 11 0 14" stroke="#FFC21A" stroke-width="3.2" fill="none" stroke-linecap="round"/>${HL(19,29,8,2.2,-24)}`,
finger:`<rect x="9" y="5" width="46" height="54" rx="15" fill="url(#g3n)"/><g fill="none" stroke="#7DE0FF" stroke-width="2.6" stroke-linecap="round"><path d="M22 27a10 10 0 0 1 20 0v5"/><path d="M17 35v-8a15 15 0 0 1 30 0v9"/><path d="M27 47c2-3 3-8 3-13v-7a2 2 0 0 1 4 0v8c0 7-2 12-5 16"/><path d="M21 42c1.5-2.5 1.5-5 1.5-7"/><path d="M37 49c2.5-4 4-9 4-14"/></g>${HL(22,12,10,2.4)}`,
});
const D3s=(n)=>D3(n);
const ico=(n,st='')=>`<svg class="ico" ${st?`style="${st}"`:''}><use href="#i-${n}"/></svg>`;
function paint3(root=document){root.querySelectorAll('[data-3]').forEach(e=>{if(!e.dataset.p3){e.innerHTML=D3(e.dataset['3']);e.dataset.p3=1}})}

/* ---------- utils ---------- */
const TODAY=new Date();TODAY.setHours(0,0,0,0);
const addD=(n,b=TODAY)=>{const d=new Date(b);d.setDate(d.getDate()+n);return d};
const expM=n=>new Date(TODAY.getFullYear(),TODAY.getMonth()+n+1,0);
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fd=d=>`${String(d.getDate()).padStart(2,'0')} ${MON[d.getMonth()]} ${d.getFullYear()}`;
const fexp=d=>`${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
const ft=d=>d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});
const dk=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const days=(a,b)=>Math.round((a-b)/864e5);
const inr=n=>'₹'+(Math.round(n*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
const inr0=n=>(n<0?'− ₹':'₹')+Math.abs(Math.round(n)).toLocaleString('en-IN');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const GR=['linear-gradient(135deg,#E0510F,#F47A2E)','linear-gradient(135deg,#1C3D5E,#3E6A93)','linear-gradient(135deg,#2A9615,#5BBF3E)','linear-gradient(135deg,#9F1239,#E11D48)','linear-gradient(135deg,#6D3FB0,#9C6BE0)','linear-gradient(135deg,#B7791F,#E0A43A)'];
const ini=n=>n.replace(/^Dr\.\s*/,'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const gfor=s=>GR[[...s].reduce((a,c)=>a+c.charCodeAt(0),0)%GR.length];
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const pick=a=>a[Math.floor(rnd()*a.length)];
function inWords(n){n=Math.round(n);const a=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],b=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];const w=x=>x<20?a[x]:b[Math.floor(x/10)]+(x%10?' '+a[x%10]:'');const h=x=>x>=100?a[Math.floor(x/100)]+' Hundred'+(x%100?' '+w(x%100):''):w(x);if(!n)return'Zero';let s='';const cr=Math.floor(n/1e7);n%=1e7;const la=Math.floor(n/1e5);n%=1e5;const th=Math.floor(n/1e3);n%=1e3;if(cr)s+=h(cr)+' Crore ';if(la)s+=h(la)+' Lakh ';if(th)s+=h(th)+' Thousand ';if(n)s+=h(n);return s.trim()}

/* ---------- data ---------- */
const S={
 store:{name:'ABC Medical Store',addr:'DN-12, Sector V, Salt Lake, Kolkata 700091',gstin:'19ABCDE1234F1Z5',dl:'WB/KOL/20B-1123, 21B-1124',phone:'+91 33 4000 1122',ownerMob:'+91 98765 43210',prefix:'SD-INV',low:30,expAlert:90,state:'West Bengal'},
 meds:[
  {id:'m1',name:'Metformin 500mg',gen:'Metformin',form:'Tablet',pack:'10 Tab',hsn:'30049099',gst:12,rack:'A1',sch:'H',mfr:'Sun Pharma'},
  {id:'m2',name:'Glimepiride 2mg',gen:'Glimepiride',form:'Tablet',pack:'10 Tab',hsn:'30049099',gst:12,rack:'A1',sch:'H',mfr:'Sanofi'},
  {id:'m3',name:'Telmisartan 40mg',gen:'Telmisartan',form:'Tablet',pack:'10 Tab',hsn:'30049099',gst:12,rack:'A2',sch:'H',mfr:'Glenmark'},
  {id:'m4',name:'Amlodipine 5mg',gen:'Amlodipine',form:'Tablet',pack:'10 Tab',hsn:'30049099',gst:12,rack:'A2',sch:'H',mfr:'Cipla'},
  {id:'m5',name:'Atorvastatin 10mg',gen:'Atorvastatin',form:'Tablet',pack:'10 Tab',hsn:'30049099',gst:12,rack:'A3',sch:'H',mfr:'Lupin'},
  {id:'m6',name:'Paracetamol 650mg',gen:'Paracetamol',form:'Tablet',pack:'15 Tab',hsn:'30049063',gst:12,rack:'B1',sch:'OTC',mfr:'Micro Labs'},
  {id:'m7',name:'Pantoprazole 40mg',gen:'Pantoprazole',form:'Tablet',pack:'15 Tab',hsn:'30049099',gst:12,rack:'B2',sch:'H',mfr:'Alkem'},
  {id:'m8',name:'Azithromycin 500mg',gen:'Azithromycin',form:'Tablet',pack:'3 Tab',hsn:'30042019',gst:12,rack:'B3',sch:'H1',mfr:'Cipla'},
  {id:'m9',name:'Cetirizine 10mg',gen:'Cetirizine',form:'Tablet',pack:'10 Tab',hsn:'30049099',gst:12,rack:'B1',sch:'OTC',mfr:'Dr. Reddy\'s'},
  {id:'m10',name:'ORS Sachet 21g',gen:'Oral Rehydration Salts',form:'Powder',pack:'1 Sachet',hsn:'30049099',gst:12,rack:'C1',sch:'OTC',mfr:'FDC'},
  {id:'m11',name:'Vitamin D3 60K',gen:'Cholecalciferol',form:'Capsule',pack:'4 Cap',hsn:'21069099',gst:18,rack:'C2',sch:'OTC',mfr:'Mankind'},
  {id:'m12',name:'Insulin Glargine 100IU',gen:'Insulin Glargine',form:'Injection',pack:'3ml Pen',hsn:'30043110',gst:5,rack:'F1 (Fridge)',sch:'H',mfr:'Biocon'},
  {id:'m13',name:'Dextromethorphan Syrup',gen:'Dextromethorphan',form:'Syrup',pack:'100 ml',hsn:'30049099',gst:12,rack:'C3',sch:'H',mfr:'Abbott'},
  {id:'m14',name:'Amoxicillin 500mg',gen:'Amoxicillin',form:'Capsule',pack:'10 Cap',hsn:'30041010',gst:12,rack:'B3',sch:'H',mfr:'Alkem'},
  {id:'m15',name:'Glucometer Strips',gen:'Blood glucose strips',form:'Device',pack:'50 Strips',hsn:'38220090',gst:12,rack:'D1',sch:'OTC',mfr:'Accu-Chek'},
 ],
 batches:[],sales:[],returns:[],held:[],adj:[],ledger:[],pos:[],
 patients:[
  {id:'p1',name:'Rahul Sharma',age:45,g:'M',mob:'98765 43210',doc:'Dr. Amit Verma',last:-2,refill:0,meds:['m1','m2','m3'],status:'Active',due:0},
  {id:'p2',name:'Suman Das',age:38,g:'F',mob:'91234 56781',doc:'Dr. Priya Nair',last:-1,refill:1,meds:['m7','m9'],status:'Active',due:240},
  {id:'p3',name:'Arun Patnaik',age:52,g:'M',mob:'98811 22334',doc:'Dr. Amit Verma',last:-5,refill:3,meds:['m4','m5'],status:'Active',due:0},
  {id:'p4',name:'Neha Gupta',age:29,g:'F',mob:'90011 22334',doc:'Dr. Rohit Singh',last:-29,refill:0,meds:['m1'],status:'Active',due:0},
  {id:'p5',name:'Prakash Shaw',age:61,g:'M',mob:'99001 12233',doc:'Dr. Amit Verma',last:-12,refill:-1,meds:['m3','m4','m12'],status:'Active',due:1180},
  {id:'p6',name:'Meena Kumari',age:55,g:'F',mob:'98300 44556',doc:'Dr. Meena Kapoor',last:-8,refill:5,meds:['m11','m6'],status:'Active',due:0},
  {id:'p7',name:'Kavita Joshi',age:34,g:'F',mob:'97480 11223',doc:'Dr. Meena Kapoor',last:-3,refill:6,meds:['m14','m9'],status:'Active',due:0},
  {id:'p8',name:'Lakshmi Devi',age:62,g:'F',mob:'94330 77889',doc:'Dr. Amit Verma',last:-15,refill:2,meds:['m1','m4','m15'],status:'Active',due:0},
  {id:'p9',name:'Sourav Ghosh',age:47,g:'M',mob:'98742 66110',doc:'Dr. Rohit Singh',last:-60,refill:-20,meds:['m6'],status:'Inactive',due:0},
  {id:'p10',name:'Priyanka Roy',age:31,g:'F',mob:'90073 55441',doc:'Dr. Priya Nair',last:-6,refill:7,meds:['m11'],status:'Active',due:0},
 ],
 doctors:[
  {id:'d1',name:'Dr. Amit Verma',qual:'MBBS, MD',spec:'General Physician',reg:'WBMC12345',mob:'98300 12345',mode:'Video + In-Pharmacy',appr:'approved',from:-50,to:130,active:true},
  {id:'d2',name:'Dr. Priya Nair',qual:'MBBS, DGO',spec:'Gynecologist',reg:'WBMC58210',mob:'98311 58210',mode:'Video',appr:'pending',sent:0,active:true},
  {id:'d3',name:'Dr. Rohit Singh',qual:'MBBS, MS',spec:'Orthopedic',reg:'WBMC33487',mob:'98312 33487',mode:'In-Pharmacy',appr:'expired',from:-235,to:-52,active:false},
  {id:'d4',name:'Dr. Meena Kapoor',qual:'MBBS, MD',spec:'Pediatrician',reg:'WBMC90911',mob:'98313 90911',mode:'Video + In-Pharmacy',appr:'approved',from:-95,to:88,active:true},
 ],
 suppliers:[
  {id:'s1',name:'Eastern Medico Agencies',person:'Subrata Paul',mob:'98300 11001',gstin:'19AAACE1111A1Z2',city:'Kolkata',due:18450,status:'Active'},
  {id:'s2',name:'Kalyani Pharma Distributors',person:'Rina Sen',mob:'98300 22002',gstin:'19AAACK2222B1Z3',city:'Kalyani',due:0,status:'Active'},
  {id:'s3',name:'Howrah Drug House',person:'Md. Imran',mob:'98300 33003',gstin:'19AAACH3333C1Z4',city:'Howrah',due:6200,status:'Active'},
  {id:'s4',name:'Sealdah Medical Suppliers',person:'Tapas Roy',mob:'98300 44004',gstin:'19AAACS4444D1Z5',city:'Kolkata',due:0,status:'Inactive'},
 ],
 users:[
  {name:'Anil Banerjee',role:'Admin',mob:'98765 43210',on:true,last:'Today, 09:02 AM'},
  {name:'Riya Mondal',role:'Pharmacist',mob:'90070 11223',on:true,last:'Today, 08:47 AM'},
  {name:'Babu Das',role:'Billing Staff',mob:'90070 44556',on:true,last:'Yesterday, 08:55 PM'},
  {name:'Sanjay Kar',role:'Billing Staff',mob:'90070 77889',on:false,last:'12 days ago'},
 ],
 notifs:[
  ['upload','New prescription uploaded by Rahul Sharma',2],['users','Patient consent completed for Suman Das',12],['steth','Consultation confirmed for Arun Patnaik with Dr. Amit Verma',25],['alarm','Refill due today for Neha Gupta',60],['coin','Settlement of ₹8,750 processed to your bank',120]],
 pending:[
  {p:'Rahul Sharma',mob:'98765 43210',act:'Verify prescription',cls:'info',det:'Uploaded · 2 mins ago',sub:'Rx #1024',time:'10:24 AM',btn:'Verify',go:'prescription'},
  {p:'Suman Das',mob:'91234 56781',act:'Patient consent',cls:'warn',det:'Consent pending',sub:'Rx #1023',time:'09:50 AM',btn:'Send OTP',go:'prescription'},
  {p:'Arun Patnaik',mob:'98811 22334',act:'Consultation request',cls:'plum',det:'Dr. Amit Verma',sub:'Rx #1021',time:'09:15 AM',btn:'View',go:'doctors'},
  {p:'Neha Gupta',mob:'90011 22334',act:'Refill due',cls:'ok',det:'Metformin 500mg',sub:'Due today',time:'08:45 AM',btn:'Bill refill',go:'refills'},
  {p:'Prakash Shaw',mob:'99001 12233',act:'Review AI analysis',cls:'sos',det:'Confidence 72%',sub:'Rx #1018',time:'08:20 AM',btn:'Review',go:'prescription'},
 ],
};
// batches: [med, batchNo, expiry months from now, stock, mrp, cost]
[['m1','MTF24A11',14,240,28,19],['m1','MTF25B02',22,120,28,19.5],['m2','GLM24C07',9,90,62,44],['m3','TLM24D19',11,160,60,41],['m4','AML24E02',16,200,35,22],['m5','ATV24F15',2,18,45,30],['m5','ATV25A03',20,60,45,31],
 ['m6','PCM24G08',12,22,33,21],['m7','PAN24H11',7,140,95,62],['m8','AZI24J05',1,25,72,49],['m9','CTZ23K10',-1,30,18,10],['m9','CTZ25L01',24,80,18,10],['m10','ORS24M04',0,45,21,13],['m11','VTD24N09',10,64,128,82],
 ['m12','INS24P02',5,8,1240,960],['m13','DXM24Q06',3,26,115,74],['m14','AMX24R01',6,0,98,64],['m15','GLS24S03',15,12,849,610]
].forEach(([m,b,e,st,mrp,c],i)=>S.batches.push({id:'b'+(i+1),med:m,no:b,exp:expM(e),stock:st,mrp,cost:c}));
S.doctors.forEach(d=>{d.slots={};});
function mkSlots(d,off,sh,sm,dur,n,booked=[],status='live'){const k=dk(addD(off));const arr=[];for(let i=0;i<n;i++){const s=new Date(2026,0,1,sh,sm+dur*i);const e=new Date(s.getTime()+dur*6e4);arr.push({t:ft(s)+' – '+ft(e),bk:booked.includes(i)?pick(['Rahul Sharma','Suman Das','Meena Kumari','Arun Patnaik','Kavita Joshi','Neha Gupta']):null,blk:false})}d.slots[k]={status,start:ft(new Date(2026,0,1,sh,sm)),dur,list:arr}}
{const[a,p,r,m]=S.doctors;mkSlots(a,0,10,0,15,12,[0,2,5,9]);mkSlots(a,2,10,0,15,12,[1]);mkSlots(a,3,9,0,15,12,[0,1,2,3,4,5,6,7,8,9,10,11],'full');mkSlots(a,5,17,0,15,12,[],'pending');mkSlots(a,8,10,0,15,12,[]);
 mkSlots(p,1,11,0,20,9,[],'pending');mkSlots(p,4,16,0,20,6,[],'pending');mkSlots(r,0,9,0,30,4,[0,1],'full');mkSlots(m,0,9,30,15,12,[2,6,7]);mkSlots(m,1,9,30,15,12,[]);mkSlots(m,6,9,30,15,12,[0]);
 a.unav=[dk(addD(4))];a.hist=[{d:addD(-50),t:'Approved',n:'Valid until '+fd(addD(130)),c:'var(--leaf)'},{d:addD(-232),t:'Approved',n:'Expired '+fd(addD(-50)),c:'var(--faint)'}];
 p.hist=[{d:addD(0),t:'Request sent',n:'Awaiting doctor approval',c:'var(--amber)'}];r.hist=[{d:addD(-235),t:'Approved',n:'Expired '+fd(addD(-52)),c:'var(--faint)'}];m.hist=[{d:addD(-95),t:'Approved',n:'Valid until '+fd(addD(88)),c:'var(--leaf)'}];p.unav=[];r.unav=[];m.unav=[];}

const med=id=>S.meds.find(m=>m.id===id), bat=id=>S.batches.find(b=>b.id===id);
const stockOf=id=>S.batches.filter(b=>b.med===id&&b.exp>=TODAY).reduce((a,b)=>a+b.stock,0);
const expState=b=>{const d=days(b.exp,TODAY);return d<0?['Expired','sos']:d<=30?['≤ 30 days','sos']:d<=90?['≤ 90 days','warn']:['Good','ok']};
const stockState=id=>{const s=stockOf(id);return s===0?['Out of stock','sos']:s<S.store.low?['Low stock','warn']:['In stock','ok']};

/* ---------- billing math (MRP is GST-inclusive, as on Indian packs) ---------- */
function calc(items,discType,discVal){
  const sub=items.reduce((a,i)=>a+i.mrp*i.qty,0);
  let disc=discType==='pct'?sub*Math.min(+discVal||0,100)/100:Math.min(+discVal||0,sub);
  const net=sub-disc;const f=sub?net/sub:0;let taxable=0,gst=0;const slabs={};
  const lines=items.map(i=>{const amt=i.mrp*i.qty*f;const tx=amt/(1+i.gst/100);const g=amt-tx;taxable+=tx;gst+=g;(slabs[i.gst]=slabs[i.gst]||{tx:0,g:0});slabs[i.gst].tx+=tx;slabs[i.gst].g+=g;return{...i,amt,tx,g}});
  const total=Math.round(net);return{sub,disc,net,taxable,gst,cgst:gst/2,sgst:gst/2,round:total-net,total,lines,slabs};
}
// seed sales over the last 30 days
let invNo=1001;
const walkin={id:'walk',name:'Walk-in Customer',mob:''};
for(let off=-30;off<=0;off++){const n=off===0?7:7+Math.floor(rnd()*6);for(let k=0;k<n;k++){const pt=rnd()<.6?pick(S.patients):walkin;const cnt=1+Math.floor(rnd()*3);const items=[];for(let j=0;j<cnt;j++){const b=pick(S.batches.filter(b=>b.exp>=TODAY));if(items.some(x=>x.batch===b.id))continue;const m=med(b.med);items.push({med:m.id,name:m.name,batch:b.id,bno:b.no,exp:b.exp,hsn:m.hsn,qty:1+Math.floor(rnd()*3),mrp:b.mrp,gst:m.gst})}
 const dt=addD(off);dt.setHours(9+Math.floor(rnd()*11),Math.floor(rnd()*60));const dType=rnd()<.3?'pct':'amt',dVal=dType==='pct'?pick([5,10]):0;const c=calc(items,dType,dVal);
 const mode=pick(['Cash','Cash','UPI','UPI','Card','Credit']);S.sales.push({no:S.store.prefix+'-'+(invNo++),date:dt,cust:pt.id,cname:pt.name,mob:pt.mob,doctor:pt.doc||'',items,discType:dType,discVal:dVal,calc:c,pay:{mode,ref:mode==='UPI'?'UPI'+Math.floor(1e9+rnd()*9e9):''},by:pick(['Babu Das','Riya Mondal'])})}}
S.sales.sort((a,b)=>b.date-a.date);
const MONTHLY=[226,214,239,251,233,262,248,271,259,284,276].map(x=>x*1000+Math.floor(rnd()*900));
S.ledger=[{d:addD(-25),type:'Expense',head:'Shop rent',amt:15000,mode:'Bank'},{d:addD(-20),type:'Expense',head:'Electricity bill',amt:3840,mode:'UPI'},{d:addD(-5),type:'Expense',head:'Staff salary (2)',amt:22000,mode:'Bank'},{d:addD(-2),type:'Expense',head:'Courier & packaging',amt:960,mode:'Cash'}];
S.pos=[
 {no:'PO-2611-014',sup:'s1',date:addD(-1),items:[['m14',200,64],['m6',150,21]],status:'Shipped'},
 {no:'PO-2611-013',sup:'s3',date:addD(-3),items:[['m12',20,960]],status:'Confirmed'},
 {no:'PO-2610-012',sup:'s2',date:addD(-9),items:[['m1',300,19],['m4',200,22]],status:'Received'},
 {no:'PO-2610-011',sup:'s1',date:addD(-16),items:[['m9',100,10]],status:'Received'},
];
S.adj=[{d:addD(-3),med:'m6',bno:'PCM24G08',delta:-6,reason:'Damaged in transit',by:'Riya Mondal'},{d:addD(-7),med:'m11',bno:'VTD24N09',delta:4,reason:'Stock count correction',by:'Anil Banerjee'}];
S.returns=[{no:'RET-2041',inv:S.sales[8].no,date:addD(-2),cname:S.sales[8].cname,items:[{name:S.sales[8].items[0].name,qty:1}],amt:Math.round(S.sales[8].items[0].mrp),mode:'Cash',reason:'Doctor changed medicine'}];

/* ---------- POS state ---------- */
const P={cart:[],cust:walkin,disc:'pct',dval:0,pay:'Cash',ref:'',chq:{no:'',bank:'',date:''},doctor:'',rxOk:false};

/* ---------- nav ---------- */
const NAV=[
 ['Overview',[['dashboard','Dashboard','grid']]],
 ['Clinical',[['prescription','Prescription Analyzer','upload'],['patients','Patient Records','users'],['doctors','Doctors','doc'],['refills','Refill Reminders','alarm']]],
 ['Billing & Stock',[['billing','Billing / POS','receipt'],['sales','Sales & Invoices','book'],['returns','Returns','ret'],['inventory','Inventory','box'],['purchases','Purchases & Suppliers','truck']]],
 ['Growth',[['promotions','Promotions & Ads','mega']]],
 ['Business',[['reports','Reports & Ledger','chart'],['attendance','Staff Attendance','finger'],['settings','Settings & Users','gear']]],
];
function counts(){return{refills:S.patients.filter(p=>p.status==='Active'&&p.refill<=0).length,inventory:S.meds.filter(m=>stockState(m.id)[1]!=='ok').length,prescription:S.pending.length,doctors:pharmRR().length,attendance:S.staff.filter(e=>attSt(e,dk(TODAY))[2]==='warn').length}}
function renderNav(cur){const c=counts();const navEl=$('#nav');if(!navEl)return;navEl.innerHTML=NAV.map(([g,items])=>`<div class="ng">${g}</div>`+items.map(([k,l,i])=>`<a class="nv ${k===cur?'on':''}" href="#${k}" data-go="${k}" data-page="${k}"><span class="n3" data-3="${i}"></span>${l}${c[k]?`<span class="cnt ${['inventory','attendance'].includes(k)?'am':''}">${c[k]}</span>`:''}</a>`).join('')).join('');paint3(navEl)}

/* ---------- toast / modal / drawer ---------- */
function toast(m,err){const t=document.createElement('div');t.className='toast'+(err?' err':'');t.innerHTML=`${ico(err?'alert':'check')}<span>${esc(m)}</span>`;$('#toasts').appendChild(t);while($('#toasts').children.length>3)$('#toasts').firstChild.remove();setTimeout(()=>{t.style.transition='opacity .3s';t.style.opacity=0;setTimeout(()=>t.remove(),300)},2600)}
function modal(title,body,foot='',opt={}){$('#modal').className='modal'+(opt.wide?' wide':'');$('#modal').innerHTML=`<div class="m-h">${opt.icon?`<span style="width:30px;height:30px" data-3="${opt.icon}"></span>`:''}<h3>${title}</h3><button class="x" data-act="mclose" aria-label="Close">${ico('x')}</button></div><div class="m-b">${body}</div>${foot?`<div class="m-f">${foot}</div>`:''}`;$('#mwrap').classList.add('on');paint3($('#modal'));setTimeout(()=>{const f=$('#modal .m-b input:not([type=checkbox]),#modal .m-b select');f&&f.focus()},60)}
function mclose(){$('#mwrap')?.classList.remove('on')}
$('#mwrap')?.addEventListener('mousedown',e=>{if(e.target.id==='mwrap')mclose()});
function drawer(html){if($('#drawer')){$('#drawer').innerHTML=html;$('#drawer').classList.add('on')}if($('#drsc'))$('#drsc').classList.add('on');paint3($('#drawer')||document)}
function dclose(){if($('#drawer'))$('#drawer').classList.remove('on');if($('#drsc'))$('#drsc').classList.remove('on')}
const drscEl = $('#drsc'); if (drscEl) drscEl.onclick=dclose;

/* ---------- small renderers ---------- */
const ph=(crumb,title,sub,act='')=>`<div class="ph"><div><div class="crumb">Dashboard › <b>${crumb}</b></div><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div><div class="ph-act">${act}</div></div>`;
const pnh=(t,i,r='')=>`<div class="panel-h"><h3>${i?`<span class="p3" data-3="${i}"></span>`:''}${t}</h3>${r}</div>`;
const who=(n,s)=>`<div class="who-cell"><span class="av" style="background:${gfor(n)}">${ini(n)}</span><div><b>${esc(n)}</b>${s?`<small>${esc(s)}</small>`:''}</div></div>`;
function barChart(vals,labels,h=170,color='var(--brand)',fmt=v=>inr0(v)){const W=600,pad=34,max=Math.max(...vals,1)*1.15,bw=(W-pad-10)/vals.length;const nice=[0,.25,.5,.75,1].map(f=>max*f);
 return `<svg class="chart" viewBox="0 0 ${W} ${h+26}" role="img"><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F47A2E"/><stop offset="1" stop-color="#E0510F"/></linearGradient></defs>${nice.map(v=>{const y=h-(v/max)*h+4;return`<line class="grid" x1="${pad}" x2="${W}" y1="${y}" y2="${y}"/><text x="${pad-6}" y="${y+4}" text-anchor="end">${v>=1000?Math.round(v/1000)+'k':Math.round(v)}</text>`}).join('')}
 ${vals.map((v,i)=>{const bh=(v/max)*h,x=pad+8+i*bw,last=i===vals.length-1;return`<g><title>${labels[i]}: ${fmt(v)}</title><rect class="bar" style="animation-delay:${i*40}ms" x="${x}" y="${h-bh+4}" width="${bw*.62}" height="${bh}" rx="5" fill="${last?'url(#bg1)':color}" opacity="${last?1:.35}"/>${last?`<text x="${x+bw*.31}" y="${h-bh-4}" text-anchor="middle" style="fill:var(--fg);font-weight:800">${fmt(v)}</text>`:''}<text x="${x+bw*.31}" y="${h+22}" text-anchor="middle">${labels[i]}</text></g>`}).join('')}</svg>`}

/* ================= PAGES ================= */
const PG={};
let RX={step:1,img:null,analyzed:false,data:null,otpSent:false,verified:false,timer:0};
PG.dashboard=()=>{
 const today=S.sales.filter(s=>dk(s.date)===dk(TODAY)),yest=S.sales.filter(s=>dk(s.date)===dk(addD(-1)));
 const ts=today.reduce((a,s)=>a+s.calc.total,0),ys=yest.reduce((a,s)=>a+s.calc.total,0)||1;
 const c=counts();const low=S.meds.filter(m=>stockState(m.id)[0]==='Low stock').length,out=S.meds.filter(m=>stockOf(m.id)===0).length;
 const nearExp=S.batches.filter(b=>{const d=days(b.exp,TODAY);return d>=0&&d<=S.store.expAlert&&b.stock>0}).length,expd=S.batches.filter(b=>days(b.exp,TODAY)<0&&b.stock>0).length;
 const last7=[...Array(7)].map((_,i)=>addD(i-6));const v7=last7.map(d=>S.sales.filter(s=>dk(s.date)===dk(d)).reduce((a,s)=>a+s.calc.total,0));
 const top={};S.sales.forEach(s=>s.items.forEach(i=>{top[i.name]=(top[i.name]||0)+i.qty}));const topL=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,5);const tmax=topL[0]?topL[0][1]:1;
 const pct=Math.round((ts-ys)/ys*100);
 const st=(icon,l,v,d,up,acc)=>`<div class="stat" style="--accent:${acc}"><span class="s3" data-3="${icon}"></span><span class="l">${l}</span><span class="v" data-count="${v}">${v}</span><span class="d ${up===true?'up':up===false?'dn':'muted'}">${d}</span></div>`;
 return `<div class="page">
 <div class="welcome"><span class="orb" style="width:220px;height:220px;right:-60px;top:-90px;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 65%)"></span><span class="w3" data-3="hospital"></span><div><h2>Good ${new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, ${esc(S.store.name)}</h2><p>${fd(TODAY)} · Here's what's happening at your pharmacy today.</p></div><div class="row" style="margin-left:auto"><a class="btn btn-p shine" href="#billing">${ico('plus')}New Bill <span class="kbd" style="background:rgba(255,255,255,.2);color:#fff;border-color:rgba(255,255,255,.3)">F2</span></a><a class="btn" style="background:rgba(255,255,255,.14);color:#fff" href="#prescription">${ico('upload')}Upload Rx</a></div></div>
 <div class="stats">
  ${st('coin',"Today's Sales",inr0(ts),'Yesterday '+inr0(ys),null,'var(--amber-tint)')}
  ${st('receipt','Bills Today',today.length,'Avg '+inr0(today.length?ts/today.length:0)+' per bill',null,'var(--brand-tint)')}
  ${st('upload','Pending Prescriptions',c.prescription,'2 need AI review',false,'var(--info-tint)')}
  ${st('alarm','Refills Due',c.refills,'Today & overdue',null,'var(--leaf-tint)')}
  ${st('box','Low / Out of Stock',low+out,out+' out of stock',false,'var(--sos-tint)')}
  ${st('calendar','Near / Past Expiry',nearExp+expd,expd+' already expired',false,'var(--plum-tint)')}
 </div>
 <div class="g g-main">
  <div class="stack">
   <div class="panel">${pnh('Action required','alarm',`<a class="link" href="#prescription">View all →</a>`)}
    <div class="tw"><table class="t"><thead><tr><th>Patient</th><th>Action</th><th>Details</th><th>Time</th><th></th></tr></thead><tbody>
    ${S.pending.map((r,i)=>`<tr><td>${who(r.p,'+91 '+r.mob)}</td><td><span class="chip ${r.cls}">${r.act}</span></td><td><div>${r.det}</div><small class="faint">${r.sub}</small></td><td class="faint nowrap">${r.time}</td><td class="r"><a class="btn ${i===0?'btn-d':'btn-o'} btn-sm" href="#${r.go}">${r.btn}</a></td></tr>`).join('')}
    </tbody></table></div></div>
   <div class="g g2">
    <div class="panel">${pnh('Sales · last 7 days','chart',`<a class="link" href="#reports">Reports →</a>`)}${barChart(v7,last7.map(d=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]),150)}</div>
    <div class="panel">${pnh('Top medicines','pill')}<div class="stack" style="gap:11px">${topL.map(([n,q],i)=>`<div><div class="row" style="justify-content:space-between;font-size:12.8px"><b>${n}</b><span class="muted">${q} sold</span></div><div class="bar-track" style="margin-top:5px"><div class="bar-fill" style="width:${q/tmax*100}%;background:${i===0?'linear-gradient(90deg,#E0510F,#F47A2E)':''}"></div></div></div>`).join('')}</div></div>
   </div>
   <div class="g g2">
    <div class="panel">${pnh('Doctor consultation','steth',`<a class="link" href="#doctors">View all →</a>`)}<div class="g g4" style="gap:10px">${[['3','New requests','var(--sos)'],['2','Scheduled today','var(--info)'],['8','Completed','var(--leaf)'],['1','Follow-up','var(--plum)']].map(([n,l,c])=>`<div style="border:1px solid var(--line);border-radius:12px;padding:12px"><b style="font-size:22px;color:${c}">${n}</b><small class="muted" style="display:block;font-size:11.5px">${l}</small></div>`).join('')}</div></div>
    <div class="panel">${pnh('Recent bills','receipt',`<a class="link" href="#sales">View all →</a>`)}${S.sales.slice(0,4).map(s=>`<div class="row" style="justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><div style="min-width:0"><b style="font-size:13px">${esc(s.cname)}</b><small class="faint" style="display:block">${s.no} · ${ft(s.date)}</small></div><div class="r"><b>${inr0(s.calc.total)}</b><small class="faint" style="display:block">${s.pay.mode}</small></div></div>`).join('')}</div>
   </div>
   <div class="panel">${pnh('Earnings & settlement','coin',`<a class="link" href="#reports">View transactions →</a>`)}<div class="g g4">${[["Today's transactions",inr0(ts)],['Pending settlement','₹12,400'],['Last settlement','₹8,750'],['Next settlement',fd(addD(4))]].map(([k,v])=>`<div><small class="muted" style="font-size:11.5px">${k}</small><div style="font-size:18px;font-weight:800;margin-top:3px">${v}</div></div>`).join('')}</div></div>
  </div>
  <div class="stack">
   <div class="panel">${pnh('Quick actions','bolt')}<div class="qa">
    <button class="hero shine" data-go="billing"><span class="q3" data-3="receipt"></span><b>New bill</b><small>Billing / POS · F2</small></button>
    <button data-go="prescription"><span class="q3" data-3="upload"></span><b>Upload prescription</b><small>AI analysis</small></button>
    <button data-act="add-patient"><span class="q3" data-3="user"></span><b>Add patient</b><small>Create new record</small></button>
    <button data-act="new-po"><span class="q3" data-3="truck"></span><b>Purchase order</b><small>Order from supplier</small></button>
   </div></div>
   <div class="panel" id="notifs">${pnh('Recent notifications','alarm')}${S.notifs.map(([i,t,m])=>`<div class="nrow"><span class="n3" data-3="${i}"></span><div><p>${t}</p><small>${m<60?m+' mins ago':Math.round(m/60)+' hr ago'}</small></div></div>`).join('')}</div>
   <div class="panel">${pnh('Upcoming refills','alarm',`<a class="link" href="#refills">View all →</a>`)}<div class="mini">${[['Today',S.patients.filter(p=>p.refill<=0&&p.status==='Active').length,'sos'],['Tomorrow',S.patients.filter(p=>p.refill===1).length,'warn'],['Next 7 days',S.patients.filter(p=>p.refill>1&&p.refill<=7).length,'ok']].map(([l,n,c])=>`<div style="background:var(--${c==='sos'?'sos':c==='warn'?'amber':'leaf'}-tint);color:var(--${c==='sos'?'sos':c==='warn'?'amber':'leaf'})"><small>${l}</small><b>${n}</b></div>`).join('')}</div></div>
   <div class="panel">${pnh('Inventory alerts','box',`<a class="link" href="#inventory">View all →</a>`)}<div class="mini">${[['Low stock',low,'amber'],['Near expiry',nearExp,'info'],['Out of stock',out,'sos']].map(([l,n,c])=>`<div style="background:var(--${c}-tint);color:var(--${c})"><small>${l}</small><b>${n}</b></div>`).join('')}</div></div>
  </div>
 </div></div>`};

/* ----- Prescription analyzer ----- */
const RX_DEMO={doc:'Dr. Amit Verma',qual:'MBBS, MD',reg:'WBMC12345',pat:'Rahul Sharma',age:45,g:'Male',mob:'9876543210',date:fd(addD(-2)),conf:92,meds:[['Metformin','500 mg','1 Tablet','BD (Twice a day)','30 Days',60],['Glimepiride','2 mg','1 Tablet','OD (Once a day)','30 Days',30],['Telmisartan','40 mg','1 Tablet','OD (Once a day)','30 Days',30]]};
PG.prescription=()=>{
 const steps=['Upload Prescription','AI Analysis','Verify & Edit','Consent & Save'];
 const cur=RX.step===1?(RX.analyzed?2:1):RX.step+1;
 const stp=`<div class="stepper">${steps.map((s,i)=>`<div class="step ${i+1<cur?'done':i+1===cur?'on':''}"><span class="cc">${i+1<cur?'✓':i+1}</span>${s}</div>${i<3?`<span class="sline ${i+1<cur?'done':''}"></span>`:''}`).join('')}</div>`;
 let body='';
 if(RX.step===1){
  const d=RX.data;
  body=`<div class="g g2">
   <div class="panel">${pnh('Upload prescription','upload')}
    <div class="drop" id="drop" data-act="pick-file">${RX.img?`<img src="${RX.img}" alt="Uploaded prescription">`:RX.analyzed?rxPaper():`<span class="d3" data-3="upload"></span><b style="font-size:15px">Drag and drop prescription image here</b><span class="muted">or</span><span class="btn btn-p btn-sm">Choose file</span><small class="faint">JPG, PNG or PDF · max 10 MB</small>`}${RX.scanning?'<div class="scanline"></div>':''}</div>
    <div class="row" style="margin-top:12px;justify-content:space-between"><ul class="tips" style="margin:0;padding-left:18px"><li>Use a clear, well-lit photo</li><li>Keep all text visible, avoid shadows</li></ul>${!RX.img&&!RX.analyzed?`<button class="btn btn-o btn-sm" data-act="rx-sample">Use sample prescription</button>`:`<button class="btn btn-o btn-sm" data-act="rx-reset">${ico('refresh')}Start over</button>`}</div>
   </div>
   <div class="panel">${pnh('AI analysis preview','sparkle',RX.analyzed?'<span class="chip ok dot">Analyzed</span>':RX.scanning?'<span class="chip info dot">Reading…</span>':'<span class="chip mut">Waiting for upload</span>')}
    ${RX.analyzed?`<div class="fg" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">${[['Doctor',d.doc],['Patient',d.pat],['Date',d.date]].map(([k,v])=>`<div><small class="muted" style="font-size:11.5px">${k}</small><div style="font-weight:800">${v}</div></div>`).join('')}</div>
     <div class="tw"><table class="t" style="min-width:520px"><thead><tr><th>Medicine</th><th>Strength</th><th>Dose</th><th>Frequency</th><th>Duration</th><th class="num">Qty</th></tr></thead><tbody>${d.meds.map(m=>`<tr><td><b>${m[0]}</b></td><td>${m[1]}</td><td>${m[2]}</td><td>${m[3]}</td><td>${m[4]}</td><td class="num">${m[5]}</td></tr>`).join('')}</tbody></table></div>
     <div class="conf" style="margin-top:14px"><svg class="conf-ring" viewBox="0 0 52 52"><circle cx="26" cy="26" r="21" fill="none" stroke="var(--line)" stroke-width="6"/><circle cx="26" cy="26" r="21" fill="none" stroke="var(--leaf)" stroke-width="6" stroke-linecap="round" stroke-dasharray="132" stroke-dashoffset="${132*(1-d.conf/100)}" transform="rotate(-90 26 26)"/><text x="26" y="30" text-anchor="middle" font-size="12" font-weight="800" fill="currentColor">${d.conf}%</text></svg><div><b style="color:var(--fg)">AI confidence ${d.conf}% · Clear</b><div class="muted" style="font-size:12.5px">All medicines matched to your inventory. Please verify before saving.</div></div></div>
     <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-p shine" data-act="rx-next" data-to="2">Next: Verify & Edit →</button></div>`
    :`<div class="empty"><span style="width:84px;height:84px;display:block;margin:0 auto 10px" data-3="${RX.scanning?'magnifier':'clipboard'}"></span>${RX.scanning?'Reading handwriting and matching medicines…':'Upload a prescription to extract doctor, patient and medicines automatically.'}</div>`}
   </div></div>`;
 }else if(RX.step===2){
  const d=RX.data;
  body=`<div class="panel">${pnh('Patient & doctor information','user')}
   <div class="fg">${[['Patient name','pat',d.pat,1],['Age','age',d.age,1],['Mobile number','mob',d.mob,1],['Doctor name','doc',d.doc,1],['Qualification','qual',d.qual],['Registration no.','reg',d.reg],['Consultation date','date',d.date]].map(([l,k,v,r])=>`<div class="fld"><label>${l} ${r?'<i>*</i>':''}</label><input class="inp" data-rx="${k}" value="${esc(v)}"></div>`).join('')}<div class="fld"><label>Gender <i>*</i></label><select class="inp" data-rx="g">${['Male','Female','Other'].map(x=>`<option ${x===d.g?'selected':''}>${x}</option>`).join('')}</select></div></div></div>
   <div class="panel" style="margin-top:16px">${pnh('Medicine details','pill',`<button class="btn btn-g btn-sm" data-act="rx-addmed">${ico('plus')}Add medicine</button>`)}
   <div class="tw"><table class="t"><thead><tr><th>Medicine name</th><th>Strength</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Qty</th><th></th></tr></thead><tbody>${d.meds.map((m,i)=>`<tr>${m.map((v,j)=>`<td><input class="inp inp-sm" style="min-width:${j===0?150:80}px" data-rxm="${i},${j}" value="${esc(v)}"></td>`).join('')}<td><button class="btn btn-x btn-sm" data-act="rx-delmed" data-i="${i}" aria-label="Remove">${ico('trash')}</button></td></tr>`).join('')}</tbody></table></div>
   <div class="row" style="justify-content:space-between;margin-top:16px"><button class="btn btn-o" data-act="rx-next" data-to="1">${ico('left')}Back</button><button class="btn btn-p shine" data-act="rx-next" data-to="3">Next: Patient consent →</button></div></div>`;
 }else{
  const d=RX.data;const dur=parseInt(d.meds[0]?.[4])||30;
  body=`<div class="g g2"><div class="panel">${pnh('Patient consent via OTP','lock3')}
   <div class="fld"><label>Mobile number</label><div class="row"><div class="mob" style="flex:1"><span>+91</span><input value="${esc(d.mob)}" readonly></div><button class="btn btn-o btn-sm" data-act="rx-next" data-to="2">Change</button></div></div>
   ${RX.otpSent?`<div class="okbox" style="margin-top:14px">${ico('check')}<div><b>OTP sent successfully</b>Ask the patient for the 6-digit code sent to their mobile.</div></div>
   <div class="fld" style="margin-top:14px"><label>Enter OTP</label><div class="otp" id="otp">${[...Array(6)].map((_,i)=>`<input inputmode="numeric" maxlength="1" data-otp="${i}" aria-label="OTP digit ${i+1}">`).join('')}</div><small class="faint" id="otpT">Resend OTP in ${RX.timer}s</small></div>
   ${RX.verified?`<div class="okbox" style="margin-top:14px">${ico('shield')}<div><b>Consent verified</b>Patient agreed to store prescription and medication information for reminders and related services.</div></div>`:`<button class="btn btn-d" style="margin-top:14px" data-act="otp-verify">Verify OTP</button>`}`
   :`<button class="btn btn-p shine" style="margin-top:14px" data-act="otp-send">${ico('send')}Send OTP to patient</button>`}
  </div>
  <div class="panel">${pnh('Record summary','clipboard')}<div class="kv"><span>Patient name</span><b>${esc(d.pat)}</b><span>Doctor name</span><b>${esc(d.doc)}</b><span>Consultation date</span><b>${esc(d.date)}</b><span>Total medicines</span><b>${d.meds.length}</b><span>Expected refill date</span><b>${fd(addD(dur-2))} <small class="faint">(based on duration)</small></b></div>
   <div class="fld" style="margin-top:16px"><label>Reminder preferences</label><div class="checks"><label><input type="checkbox" checked>App</label><label><input type="checkbox" checked>WhatsApp</label><label><input type="checkbox">Email</label><label><input type="checkbox" checked>SMS</label></div></div>
   <div class="row" style="justify-content:space-between;margin-top:18px"><button class="btn btn-o" data-act="rx-next" data-to="2">${ico('left')}Edit prescription</button><div class="row"><button class="btn btn-g" data-act="rx-bill" ${RX.verified?'':'disabled'}>${ico('plus')}Save & create bill</button><button class="btn btn-p shine" data-act="rx-save" ${RX.verified?'':'disabled'}>Save patient record</button></div></div></div></div>`;
 }
 return `<div class="page">${ph('Prescription','Prescription Analyzer','Upload a prescription, let AI read it, verify, take consent, and save to the patient record.')}${RX.step===1&&!RX.analyzed&&!RX.scanning?phRxBanner():''}${stp}${body}</div>`};
function rxPaper(){return `<div class="rx-paper"><h4>Dr. Amit Verma, MBBS, MD</h4><small style="font-family:var(--font);color:#666">Reg. WBMC12345 · Salt Lake Clinic</small><div style="margin:8px 0;font-family:var(--font);font-size:12px">Pt: Rahul Sharma · 45/M · ${fd(addD(-2))}</div><div class="rx">℞</div><div>1. Tab Metformin 500mg — 1-0-1 × 30d</div><div>2. Tab Glimepiride 2mg — 1-0-0 × 30d</div><div>3. Tab Telmisartan 40mg — 0-0-1 × 30d</div><div style="text-align:right;margin-top:10px">~ A. Verma</div></div>`}

/* ----- Patients ----- */
let PF={q:'',doc:'',st:'',page:1};
PG.patients=()=>{
 const docs=[...new Set(S.patients.map(p=>p.doc))];
 const list=S.patients.filter(p=>(!PF.q||(p.name+p.mob).toLowerCase().includes(PF.q.toLowerCase()))&&(!PF.doc||p.doc===PF.doc)&&(!PF.st||p.status===PF.st));
 return `<div class="page">${ph('Patient Records','Patient Health Records','Consented patient records with prescriptions, refills and dues.',`<button class="btn btn-p shine" data-act="add-patient">${ico('plus')}Add patient record</button>`)}
 <div class="panel"><div class="filters"><label class="sbox">${ico('search')}<input placeholder="Search name or mobile" data-pf="q" value="${esc(PF.q)}"></label><select class="inp" data-pf="doc"><option value="">All doctors</option>${docs.map(d=>`<option ${PF.doc===d?'selected':''}>${d}</option>`).join('')}</select><select class="inp" data-pf="st"><option value="">All status</option><option ${PF.st==='Active'?'selected':''}>Active</option><option ${PF.st==='Inactive'?'selected':''}>Inactive</option></select></div>
 <div class="tw"><table class="t"><thead><tr><th>ID</th><th>Patient</th><th>Age / Gender</th><th>Doctor</th><th>Last visit</th><th>Next refill</th><th class="num">Medicines</th><th class="num">Due</th><th>Status</th><th class="r">Actions</th></tr></thead><tbody>
 ${list.length?list.map(p=>`<tr><td class="faint">#P${String(p.id.slice(1)).padStart(4,'0')}</td><td>${who(p.name,'+91 '+p.mob)}</td><td>${p.age} / ${p.g}</td><td>${p.doc}</td><td>${fd(addD(p.last))}</td><td>${p.refill<=0&&p.status==='Active'?`<span class="chip sos">${p.refill<0?'Overdue '+(-p.refill)+'d':'Due today'}</span>`:fd(addD(p.refill))}</td><td class="num">${p.meds.length}</td><td class="num">${p.due?`<b style="color:var(--sos)">${inr0(p.due)}</b>`:'—'}</td><td><span class="chip ${p.status==='Active'?'ok':'mut'} dot">${p.status}</span></td><td class="r nowrap"><button class="btn btn-o btn-sm" data-act="view-patient" data-id="${p.id}">${ico('eye')}View</button> <button class="btn btn-g btn-sm" data-act="bill-patient" data-id="${p.id}">Bill</button></td></tr>`).join(''):`<tr><td colspan="10" class="empty">No patients match these filters.</td></tr>`}
 </tbody></table></div><div class="pager"><span>Showing ${list.length} of ${S.patients.length} records</span><div class="pg"><button class="on">1</button></div></div></div></div>`};

/* ----- Doctors ----- */
let DF={q:'',spec:'',appr:''};
const APPR={approved:['Approved','ok'],pending:['Request pending','warn'],expired:['Approval expired','info']};
PG.doctors=()=>{
 const specs=[...new Set(S.doctors.map(d=>d.spec))];
 const list=S.doctors.filter(d=>(!DF.q||(d.name+d.spec+d.reg).toLowerCase().includes(DF.q.toLowerCase()))&&(!DF.spec||d.spec===DF.spec)&&(!DF.appr||d.appr===DF.appr));
 const today=dk(TODAY);
 return `<div class="page">${ph('Doctors','Doctors List','Manage partnered doctors, consultation slots and 6-month approvals.',`<button class="btn btn-p shine" data-act="add-doctor">${ico('plus')}Add doctor</button>`)}
 ${pharmRRBanner()}<div class="filters"><label class="sbox">${ico('search')}<input placeholder="Search by name, specialty or registration" data-df="q" value="${esc(DF.q)}"></label><select class="inp" data-df="spec"><option value="">All specialties</option>${specs.map(s=>`<option ${DF.spec===s?'selected':''}>${s}</option>`).join('')}</select><select class="inp" data-df="appr"><option value="">All approval status</option>${Object.entries(APPR).map(([k,[l]])=>`<option value="${k}" ${DF.appr===k?'selected':''}>${l}</option>`).join('')}</select></div>
 <div class="docs">${list.map((d,i)=>{const t=d.slots[today];const av=t?t.list.filter(s=>!s.bk&&!s.blk).length:0,bk=t?t.list.filter(s=>s.bk).length:0;const[al,ac]=APPR[d.appr];
  return `<div class="dc"><div class="dc-top"><span class="dc-av" style="background:${GR[i%GR.length]}">${ini(d.name)}${d.appr==='approved'?`<span class="v">${ico('check')}</span>`:''}</span><div style="min-width:0"><b>${d.name}</b><small>${d.qual}</small><span class="sp">${d.spec}</span></div>${d.active?'<span class="chip ok dot" style="margin-left:auto;align-self:flex-start">Active</span>':'<span class="chip mut" style="margin-left:auto;align-self:flex-start">Inactive</span>'}</div>
  <div class="dc-mid"><div class="row"><span class="chip ${ac} dot">${al}</span><small class="faint">${d.appr==='approved'?'until '+fd(addD(d.to)):d.appr==='pending'?'sent '+fd(addD(d.sent)):'since '+fd(addD(d.to))}</small></div>
  <div class="dc-slots"><div><small>Today available</small><b style="color:var(--leaf)">${av}</b></div><div><small>Today booked</small><b style="color:var(--sos)">${bk}</b></div></div><small class="faint">Reg. ${d.reg} · ${d.mode}</small></div>
  <div class="dc-act"><button class="btn btn-p btn-sm shine" style="--d:${i*.7}s" data-act="slots" data-id="${d.id}">Manage slots</button><button class="btn btn-o btn-sm" data-act="doc-profile" data-id="${d.id}">View profile</button></div></div>`}).join('')}</div></div>`};
let DR={id:null,tab:'slots',sel:null,mon:0};
function renderDrawer(){
 const d=S.doctors.find(x=>x.id===DR.id);const[al,ac]=APPR[d.appr];const i=S.doctors.indexOf(d);
 let b=`<div class="banner">${ico('alert')}Doctor approval is required before slots go live for patients.</div><div class="tabs"><button class="${DR.tab==='slots'?'on':''}" data-act="dtab" data-t="slots">Manage slots</button><button class="${DR.tab==='hist'?'on':''}" data-act="dtab" data-t="hist">Approval history</button></div>`;
 if(DR.tab==='hist'){b+=d.hist.length?d.hist.map(h=>`<div class="hist"><i style="background:${h.c}"></i><div><small class="faint">${fd(h.d)}</small><div style="font-weight:700">${h.t} — ${d.name}</div><small class="muted">${h.n}</small></div></div>`).join(''):'<div class="empty">No approval history yet.</div>'}
 else{
  const all=Object.values(d.slots).flatMap(x=>x.list);const bkd=all.filter(s=>s.bk).length;
  b+=`<div class="panel" style="padding:14px 16px;margin-bottom:14px"><div class="row" style="justify-content:space-between"><span class="chip ${ac} dot">${al}</span>${d.appr!=='approved'?`<button class="btn btn-p btn-sm" data-act="renew">${d.appr==='expired'?'Request 6-month renewal':'Resend request'}</button>`:`<button class="btn btn-o btn-sm" data-act="renew">Send renewal request</button>`}</div>
  ${d.appr==='approved'?`<div class="g g3" style="margin-top:12px;gap:10px">${[['Live slots',all.length,'var(--fg)'],['Available',all.length-bkd,'var(--leaf)'],['Booked',bkd,'var(--sos)']].map(([l,n,c])=>`<div><b style="font-size:20px;color:${c}">${n}</b><small class="muted" style="display:block;font-size:11.5px">${l}</small></div>`).join('')}</div><div class="bar-track" style="margin-top:12px"><div class="bar-fill" style="width:${Math.round((d.to)/(d.to-d.from)*100)}%"></div></div><small class="muted">Approved ${fd(addD(d.from))} · valid until ${fd(addD(d.to))} (~${Math.round(d.to/30)} months left)</small>`
  :d.appr==='pending'?`<p class="muted" style="font-size:12.5px;margin-top:8px">Request sent on <b>${fd(addD(d.sent))}</b>. Slots stay hidden from patients until the doctor approves.</p>`:`<p class="muted" style="font-size:12.5px;margin-top:8px">Approval expired on <b>${fd(addD(d.to))}</b>. Send a renewal instead of re-adding the doctor.</p>`}</div>`;
  const base=new Date(TODAY.getFullYear(),TODAY.getMonth()+DR.mon,1);const first=base.getDay(),dim=new Date(base.getFullYear(),base.getMonth()+1,0).getDate();
  const col={live:'var(--leaf)',pending:'var(--amber)',full:'var(--sos)',unav:'var(--info)'};
  let cells=['S','M','T','W','T','F','S'].map(x=>`<div class="dw">${x}</div>`).join('')+'<div></div>'.repeat(first);
  for(let n=1;n<=dim;n++){const dt=new Date(base.getFullYear(),base.getMonth(),n);const k=dk(dt);const sl=d.slots[k];const un=d.unav.includes(k);const st=un?'unav':sl?sl.status:null;cells+=`<button class="${k===DR.sel?'sel':''} ${k===dk(TODAY)?'today':''} ${dt<TODAY?'past':''}" data-act="dsel" data-k="${k}">${n}${st?`<span class="dt" style="background:${col[st]}"></span>`:'<span class="dt"></span>'}</button>`}
  b+=`<div class="row" style="justify-content:space-between;margin-top:6px"><b>${MON[base.getMonth()]} ${base.getFullYear()}</b><div class="row"><button class="btn btn-o btn-sm" data-act="dmon" data-m="-1" aria-label="Previous month">‹</button><button class="btn btn-o btn-sm" data-act="dmon" data-m="0">Today</button><button class="btn btn-o btn-sm" data-act="dmon" data-m="1" aria-label="Next month">›</button></div></div>
  <div class="legend" style="margin-top:10px"><span><i style="background:var(--leaf)"></i>Live</span><span><i style="background:var(--amber)"></i>Pending approval</span><span><i style="background:var(--sos)"></i>Fully booked</span><span><i style="background:var(--info)"></i>Unavailable</span></div><div class="cal">${cells}</div>`;
  if(DR.sel){const sl=d.slots[DR.sel];const un=d.unav.includes(DR.sel);const dt=new Date(DR.sel+'T00:00');
   b+=`<div class="panel" style="margin-top:16px;padding:14px 16px"><div class="row" style="justify-content:space-between"><b>${fd(dt)}</b>${sl?`<span class="chip ${sl.status==='live'?'ok':sl.status==='full'?'sos':'warn'}">${sl.status==='live'?'Live':sl.status==='full'?'Fully booked':'Pending approval'}</span>`:''}</div>
   ${un?`<p class="muted" style="margin-top:8px;font-size:12.5px">Doctor marked unavailable for this date.</p><button class="btn btn-o btn-sm" style="margin-top:10px" data-act="unav-undo">Mark available again</button>`
   :sl?`<small class="muted">${sl.start} onwards · ${sl.dur}-min slots · ${sl.list.filter(s=>s.bk).length} booked</small><div class="slots">${sl.list.map((s,j)=>`<button class="slot ${s.blk?'blk':s.bk?'bk':'free'}" data-act="slot" data-j="${j}">${s.t.split(' – ')[0]}<small>${s.blk?'Blocked':s.bk?esc(s.bk):'Available'}</small></button>`).join('')}</div><div class="row" style="margin-top:12px"><button class="btn btn-o btn-sm" data-act="add-time">${ico('plus')}Add more time</button><button class="btn btn-x btn-sm" data-act="unav">Mark unavailable</button></div>`
   :`<p class="muted" style="margin-top:8px;font-size:12.5px">No consultation time on this date yet.</p><div class="row" style="margin-top:10px"><button class="btn btn-p btn-sm" data-act="add-time">${ico('plus')}Add consultation time</button><button class="btn btn-x btn-sm" data-act="unav">Mark unavailable</button></div>`}</div>`}
 }
 drawer(`<div class="dr-h"><span class="dc-av" style="background:${GR[i%GR.length]};width:50px;height:50px">${ini(d.name)}</span><div><b style="font-size:16px">${d.name}</b><small class="muted" style="display:block">${d.qual} · ${d.spec}</small><small class="faint">Registration ${d.reg}</small></div><button class="icon-btn" style="margin-left:auto" data-act="dclose" aria-label="Close">${ico('x')}</button></div><div class="dr-b">${b}</div>`);
}

/* ----- Refills ----- */
PG.refills=()=>{
 const list=S.patients.filter(p=>p.status==='Active').sort((a,b)=>a.refill-b.refill);
 const grp=[['Overdue & today',list.filter(p=>p.refill<=0),'sos'],['Tomorrow',list.filter(p=>p.refill===1),'warn'],['Next 7 days',list.filter(p=>p.refill>1&&p.refill<=7),'ok']];
 return `<div class="page">${ph('Refill Reminders','Refill Reminders','Patients whose medicines are about to run out. Remind them or bill the refill in one click.',`<button class="btn btn-o" data-act="remind-all">${ico('whats')}Remind all due today</button>`)}
 <div class="stack">${grp.map(([t,l,c])=>`<div class="panel">${pnh(`${t} <span class="chip ${c}">${l.length}</span>`,'alarm')}${l.length?`<div class="tw"><table class="t"><thead><tr><th>Patient</th><th>Medicines</th><th>Doctor</th><th>Refill date</th><th>Last reminder</th><th class="r">Actions</th></tr></thead><tbody>${l.map(p=>`<tr><td>${who(p.name,'+91 '+p.mob)}</td><td>${p.meds.map(m=>`<span class="chip mut" style="margin:2px">${med(m).name}</span>`).join('')}</td><td>${p.doc}</td><td>${p.refill<0?`<b style="color:var(--sos)">${fd(addD(p.refill))}</b>`:fd(addD(p.refill))}</td><td class="faint">${p.reminded?'Just now · '+p.reminded:'—'}</td><td class="r nowrap"><button class="btn btn-o btn-sm" data-act="remind" data-id="${p.id}">${ico('whats')}Remind</button> <button class="btn btn-p btn-sm" data-act="bill-refill" data-id="${p.id}">Bill refill</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Nothing here.</div>'}</div>`).join('')}</div></div>`};

/* ----- Billing / POS ----- */
let PQ='',PHL=0;
PG.billing=()=>{
 const c=calc(P.cart,P.disc,P.dval);const needRx=P.cart.some(i=>['H','H1'].includes(med(i.med).sch));
 const PM=[['Cash','coin'],['UPI','phone'],['Card','receipt'],['Cheque','book'],['Credit','clipboard']];
 return `<div class="page">${ph('Billing','Billing / POS',`Bill no. <b>${S.store.prefix}-${invNo}</b> · ${fd(TODAY)} · Counter 1`,`${S.held.length?`<div class="hold-list">${S.held.map((h,i)=>`<button class="btn btn-o btn-sm" data-act="resume" data-i="${i}">${ico('pause')}${esc(h.cust.name.split(' ')[0])} · ${h.cart.length} items</button>`).join('')}</div>`:''}<button class="btn btn-o" data-act="hold" ${P.cart.length?'':'disabled'}>${ico('pause')}Hold bill <span class="kbd">F8</span></button><button class="btn btn-x" data-act="clear-cart" ${P.cart.length?'':'disabled'}>${ico('trash')}Clear</button>`)}
 <div class="pos"><div class="stack">
  <div class="panel pos-search"><div class="row" style="flex-wrap:nowrap"><label class="sbox" style="flex:1">${ico('search')}<input id="pq" placeholder="Scan barcode or type medicine / generic name…" value="${esc(PQ)}" autocomplete="off"><span class="kbd">F2</span></label></div><div class="psr" id="psr" ${PQ?'':'hidden'}>${posResults()}</div>
   <div class="row" style="margin-top:10px;gap:6px">${S.meds.slice(0,8).map(m=>`<button class="chip mut" data-act="quick-add" data-id="${m.id}">${ico('plus','width:12px;height:12px')}${m.name}</button>`).join('')}</div></div>
  <div class="panel">${pnh(`Cart <span class="chip br">${P.cart.length} items</span>`,'cart')}
   ${P.cart.length?`<div class="tw"><table class="t cart"><thead><tr><th>#</th><th>Medicine</th><th>Batch · Expiry</th><th>HSN</th><th class="c">Qty</th><th class="num">MRP</th><th class="num">GST</th><th class="num">Amount</th><th></th></tr></thead><tbody>${P.cart.map((i,k)=>{const b=bat(i.batch);return `<tr><td class="faint">${k+1}</td><td><b>${i.name}</b>${['H','H1'].includes(med(i.med).sch)?` <span class="chip warn" style="padding:1px 6px;font-size:10px">Sch ${med(i.med).sch}</span>`:''}<small class="faint" style="display:block">${med(i.med).pack} · Rack ${med(i.med).rack}</small></td><td><button class="link" data-act="change-batch" data-k="${k}">${i.bno}</button><small class="faint" style="display:block">Exp ${fexp(i.exp)} · ${b.stock} in stock</small></td><td class="faint">${i.hsn}</td><td class="c"><span class="qty"><button data-act="qty" data-k="${k}" data-d="-1" aria-label="Decrease">−</button><input value="${i.qty}" data-qk="${k}" aria-label="Quantity"><button data-act="qty" data-k="${k}" data-d="1" aria-label="Increase">+</button></span></td><td class="num">${inr(i.mrp)}</td><td class="num">${i.gst}%</td><td class="num"><b>${inr(i.mrp*i.qty)}</b></td><td><button class="btn btn-x btn-sm" data-act="rm" data-k="${k}" aria-label="Remove">${ico('x')}</button></td></tr>`}).join('')}</tbody></table></div>`
   :`<div class="empty"><span style="width:90px;height:90px;display:block;margin:0 auto 10px" data-3="cart"></span><b style="color:var(--fg)">Cart is empty</b><p style="margin-top:4px">Search a medicine above, scan a barcode, or bill a refill from Patient Records.</p></div>`}
   <div class="shortcut" style="margin-top:12px"><span><span class="kbd">F2</span> Search</span><span><span class="kbd">F8</span> Hold</span><span><span class="kbd">F9</span> Generate invoice</span><span><span class="kbd">Esc</span> Close</span></div></div>
 </div>
 <div class="sum">
  <div class="panel">${pnh('Customer','user',`<button class="link" data-act="pick-cust">Change</button>`)}
   <div class="cust-pick">${P.cust.id==='walk'?`<span style="width:36px;height:36px" data-3="user"></span><div><b>Walk-in Customer</b><small class="muted" style="display:block">No record · cash/UPI/card only</small></div>`:`${who(P.cust.name,'+91 '+P.cust.mob+(P.cust.due?' · Due '+inr0(P.cust.due):''))}`}</div>
   <div class="fld" style="margin-top:10px"><label>Prescribing doctor</label><input class="inp" id="pdoc" list="docl" placeholder="Optional" value="${esc(P.doctor)}"><datalist id="docl">${S.doctors.map(d=>`<option>${d.name}</option>`).join('')}</datalist></div>
   ${needRx?`<label class="rxwarn" style="margin-top:10px">${ico('alert')}<input type="checkbox" id="rxok" ${P.rxOk?'checked':''}>Schedule H/H1 items · prescription checked</label>`:''}
  </div>
  <div class="panel">${pnh('Bill summary','receipt')}
   <div class="row" style="justify-content:space-between;margin-bottom:10px"><b style="font-size:13px">Discount</b><div class="row" style="gap:6px;flex-wrap:nowrap"><div class="seg"><button class="${P.disc==='pct'?'on':''}" data-act="disc" data-t="pct">%</button><button class="${P.disc==='amt'?'on':''}" data-act="disc" data-t="amt">₹</button></div><input class="inp inp-sm" style="width:80px" id="dval" value="${P.dval||''}" placeholder="0" inputmode="decimal"></div></div>
   <div class="srow"><span>Subtotal (MRP)</span><b>${inr(c.sub)}</b></div>
   <div class="srow"><span>Discount</span><b style="color:var(--leaf)">− ${inr(c.disc)}</b></div>
   <div class="srow"><span>Taxable value</span><b>${inr(c.taxable)}</b></div>
   <div class="srow"><span>CGST</span><b>${inr(c.cgst)}</b></div>
   <div class="srow"><span>SGST</span><b>${inr(c.sgst)}</b></div>
   <div class="srow"><span>Round off</span><b>${c.round>=0?'+':'−'} ${inr(Math.abs(c.round))}</b></div>
   <div class="grand"><span style="font-weight:800">Grand total</span><b>${inr(c.total)}</b></div>
   <small class="faint">${c.total?inWords(c.total)+' Rupees only':''}</small>
  </div>
  <div class="panel">${pnh('Payment','coin')}
   <div class="paym">${PM.map(([m,i])=>`<button class="${P.pay===m?'on':''}" data-act="pay" data-m="${m}"><span class="m3" data-3="${i}"></span>${m}</button>`).join('')}</div>
   <div style="margin-top:12px">${P.pay==='Cash'?`<div class="fg" style="grid-template-columns:1fr 1fr"><div class="fld"><label>Cash received</label><input class="inp" id="cashr" inputmode="decimal" placeholder="${c.total}"></div><div class="fld"><label>Change to return</label><input class="inp" id="chg" readonly value="₹0"></div></div>`
   :P.pay==='UPI'?`<div class="fld"><label>UPI reference no.</label><input class="inp" id="pref" placeholder="12-digit UTR" value="${esc(P.ref)}"></div>`
   :P.pay==='Card'?`<div class="fld"><label>Card last 4 digits / approval code</label><input class="inp" id="pref" placeholder="e.g. 4417" value="${esc(P.ref)}"></div>`
   :P.pay==='Cheque'?`<div class="fg" style="grid-template-columns:1fr 1fr"><div class="fld"><label>Cheque no.</label><input class="inp" id="chqno" value="${esc(P.chq.no)}"></div><div class="fld"><label>Bank</label><input class="inp" id="chqbank" value="${esc(P.chq.bank)}"></div><div class="fld"><label>Cheque date</label><input class="inp" id="chqdate" type="date" value="${P.chq.date}"></div></div>`
   :`<div class="rxwarn" style="background:var(--info-tint);color:var(--info)">${ico('alert')}${P.cust.id==='walk'?'Select a customer to sell on credit.':'Amount will be added to '+esc(P.cust.name)+'\'s due.'}</div>`}</div>
   <button class="btn btn-p btn-lg shine" style="width:100%;margin-top:14px" data-act="checkout" ${P.cart.length?'':'disabled'}>Generate invoice · ${inr0(c.total)} <span class="kbd" style="background:rgba(255,255,255,.2);color:#fff;border-color:rgba(255,255,255,.35)">F9</span></button>
  </div>
 </div></div></div>`};
function posResults(){const q=PQ.toLowerCase();const r=S.meds.filter(m=>(m.name+m.gen+m.mfr).toLowerCase().includes(q)).slice(0,8);if(!r.length)return`<div class="empty">No medicine matches “${esc(PQ)}”. <button class="link" data-act="add-med">Add new medicine</button></div>`;
 return r.map((m,i)=>{const s=stockOf(m.id);const b=S.batches.filter(x=>x.med===m.id&&x.exp>=TODAY&&x.stock>0).sort((a,b)=>a.exp-b.exp)[0];return `<button class="${i===PHL?'hl':''}" data-act="add-med-cart" data-id="${m.id}" ${s?'':'disabled style="opacity:.5"'}><span class="p3" data-3="${{Tablet:'pill',Capsule:'pill',Syrup:'bottle',Injection:'tube',Powder:'drop',Device:'chart'}[m.form]||'pill'}"></span><span><b>${m.name}</b><small>${m.gen} · ${m.pack} · ${m.mfr} · Rack ${m.rack}</small></span><span class="chip ${s===0?'sos':s<S.store.low?'warn':'ok'}">${s} in stock</span><b>${b?inr(b.mrp):'—'}</b></button>`}).join('')}
function addToCart(medId,batchId,qty=1){const m=med(medId);const avail=S.batches.filter(x=>x.med===medId&&x.exp>=TODAY&&x.stock>0).sort((a,b)=>a.exp-b.exp);const b=batchId?bat(batchId):avail[0];if(!b){toast(m.name+' is out of stock',1);return false}
 const ex=P.cart.find(i=>i.batch===b.id);if(ex){if(ex.qty+qty>b.stock){toast('Only '+b.stock+' in batch '+b.no,1);return false}ex.qty+=qty}else P.cart.push({med:m.id,name:m.name,batch:b.id,bno:b.no,exp:b.exp,hsn:m.hsn,qty:Math.min(qty,b.stock),mrp:b.mrp,gst:m.gst});return true}
function checkout(){
 const c=calc(P.cart,P.disc,P.dval);
 if(P.cart.some(i=>['H','H1'].includes(med(i.med).sch))&&!P.rxOk){toast('Confirm the prescription for Schedule H items',1);return}
 if(P.pay==='Credit'&&P.cust.id==='walk'){toast('Select a customer for a credit sale',1);return}
 if(P.pay==='UPI'&&!P.ref){toast('Enter the UPI reference number',1);$('#pref')?.focus();return}
 if(P.pay==='Cheque'&&!(P.chq.no&&P.chq.bank)){toast('Enter cheque number and bank',1);return}
 for(const i of P.cart){if(i.qty>bat(i.batch).stock){toast('Not enough stock for '+i.name,1);return}}
 P.cart.forEach(i=>{bat(i.batch).stock-=i.qty});
 const sale={no:S.store.prefix+'-'+(invNo++),date:new Date(),cust:P.cust.id,cname:P.cust.name,mob:P.cust.mob,doctor:P.doctor,items:P.cart.map(i=>({...i})),discType:P.disc,discVal:P.dval,calc:c,pay:{mode:P.pay,ref:P.pay==='Cheque'?`${P.chq.no} · ${P.chq.bank}`:P.ref},by:'Anil Banerjee'};
 S.sales.unshift(sale);if(P.pay==='Credit'){const p=S.patients.find(x=>x.id===P.cust.id);if(p)p.due+=c.total}
 if(P.cust.id!=='walk'){const p=S.patients.find(x=>x.id===P.cust.id);if(p){p.last=0;if(p.refill<=0)p.refill=28}}
 Object.assign(P,{cart:[],cust:walkin,disc:'pct',dval:0,pay:'Cash',ref:'',chq:{no:'',bank:'',date:''},doctor:'',rxOk:false});
 render();showInvoice(sale,true);
}
function invoiceHTML(s){const c=s.calc;return `<div class="inv"><div class="inv-h"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><img src="${LOGO}" alt=""><div><h2>${S.store.name}</h2><small>${S.store.addr}<br>Ph ${S.store.phone} · GSTIN ${S.store.gstin}<br>DL No. ${S.store.dl}</small></div></div><div style="text-align:right"><div class="tt">TAX INVOICE</div><div><b>${s.no}</b></div><small>${fd(s.date)} · ${ft(s.date)}</small><br><small>Powered by SevaDharam</small></div></div>
 <div class="row" style="justify-content:space-between;align-items:flex-start;margin-bottom:6px"><div><small>Billed to</small><div><b>${esc(s.cname)}</b>${s.mob?' · +91 '+s.mob:''}</div>${s.doctor?`<small>Prescribed by ${esc(s.doctor)}</small>`:''}</div><div style="text-align:right"><small>Place of supply</small><div><b>${S.store.state}</b></div></div></div>
 <div style="overflow-x:auto"><table><thead><tr><th>#</th><th>Item</th><th>HSN</th><th>Batch</th><th>Exp</th><th class="n">Qty</th><th class="n">MRP</th><th class="n">Taxable</th><th class="n">GST</th><th class="n">Amount</th></tr></thead><tbody>${c.lines.map((l,i)=>`<tr><td>${i+1}</td><td>${l.name}</td><td>${l.hsn}</td><td>${l.bno}</td><td>${fexp(new Date(l.exp))}</td><td class="n">${l.qty}</td><td class="n">${l.mrp.toFixed(2)}</td><td class="n">${l.tx.toFixed(2)}</td><td class="n">${l.gst}%</td><td class="n">${l.amt.toFixed(2)}</td></tr>`).join('')}</tbody></table></div>
 <div class="inv-f"><div><small>GST summary</small><table><thead><tr><th>Rate</th><th class="n">Taxable</th><th class="n">CGST</th><th class="n">SGST</th></tr></thead><tbody>${Object.entries(c.slabs).map(([r,v])=>`<tr><td>${r}%</td><td class="n">${v.tx.toFixed(2)}</td><td class="n">${(v.g/2).toFixed(2)}</td><td class="n">${(v.g/2).toFixed(2)}</td></tr>`).join('')}</tbody></table><small><b>Amount in words:</b> ${inWords(c.total)} Rupees only</small><br><small><b>Paid by:</b> ${s.pay.mode}${s.pay.ref?' · '+esc(s.pay.ref):''} · Billed by ${s.by}</small></div>
 <div class="inv-tot"><div><span>Subtotal (MRP)</span><b>${c.sub.toFixed(2)}</b></div><div><span>Discount${s.discType==='pct'&&s.discVal?' ('+s.discVal+'%)':''}</span><b>− ${c.disc.toFixed(2)}</b></div><div><span>Taxable value</span><b>${c.taxable.toFixed(2)}</b></div><div><span>CGST</span><b>${c.cgst.toFixed(2)}</b></div><div><span>SGST</span><b>${c.sgst.toFixed(2)}</b></div><div><span>Round off</span><b>${c.round.toFixed(2)}</b></div><div class="gt"><span>Total</span><span>₹${c.total.toFixed(2)}</span></div></div></div>
 <div style="display:flex;justify-content:space-between;margin-top:18px;align-items:flex-end"><small>Goods once sold can be returned within 7 days with this invoice. Keep medicines out of reach of children.</small><div style="text-align:center"><div style="height:28px"></div><small>Registered Pharmacist</small></div></div></div>`}
function showInvoice(s,fresh){modal(fresh?'Invoice generated':'Invoice '+s.no,invoiceHTML(s),`${fresh?'':`<button class="btn btn-o" data-act="start-return" data-no="${s.no}">${ico('refresh')}Return items</button>`}<button class="btn btn-o" data-act="share-inv" data-no="${s.no}">${ico('whats')}Send on WhatsApp</button><button class="btn btn-p" data-act="${fresh?'new-bill':'mclose'}">${fresh?ico('plus')+'New bill':'Close'}</button>`,{wide:1,icon:'receipt'});if(fresh)toast('Invoice '+s.no+' saved · stock updated')}

/* ----- Sales ----- */
let SF={q:'',mode:'',range:'7'};
PG.sales=()=>{
 const from=SF.range==='all'?new Date(0):addD(-(+SF.range)+1);
 const list=S.sales.filter(s=>s.date>=from&&(!SF.mode||s.pay.mode===SF.mode)&&(!SF.q||(s.no+s.cname).toLowerCase().includes(SF.q.toLowerCase())));
 const tot=list.reduce((a,s)=>a+s.calc.total,0),gst=list.reduce((a,s)=>a+s.calc.gst,0);
 return `<div class="page">${ph('Sales','Sales & Invoices','Every bill with its full GST invoice. Open one to share it or process a return.',`<a class="btn btn-p shine" href="#billing">${ico('plus')}New bill</a>`)}
 <div class="g g4" style="margin-bottom:16px">${[['receipt','Bills',list.length],['coin','Sales value',inr0(tot)],['chart','GST collected',inr0(gst)],['users','Avg bill value',inr0(list.length?tot/list.length:0)]].map(([i,l,v])=>`<div class="stat"><span class="s3" data-3="${i}"></span><span class="l">${l}</span><span class="v">${v}</span></div>`).join('')}</div>
 <div class="panel"><div class="filters"><label class="sbox">${ico('search')}<input placeholder="Search invoice no. or customer" data-sf="q" value="${esc(SF.q)}"></label><select class="inp" data-sf="range">${[['1','Today'],['7','Last 7 days'],['30','Last 30 days'],['all','All time']].map(([v,l])=>`<option value="${v}" ${SF.range===v?'selected':''}>${l}</option>`).join('')}</select><select class="inp" data-sf="mode"><option value="">All payment modes</option>${['Cash','UPI','Card','Cheque','Credit'].map(m=>`<option ${SF.mode===m?'selected':''}>${m}</option>`).join('')}</select></div>
 <div class="tw"><table class="t"><thead><tr><th>Invoice</th><th>Date & time</th><th>Customer</th><th class="num">Items</th><th>Payment</th><th class="num">Discount</th><th class="num">GST</th><th class="num">Total</th><th class="r">Actions</th></tr></thead><tbody>
 ${list.slice(0,40).map(s=>`<tr><td><b>${s.no}</b></td><td>${fd(s.date)}<small class="faint" style="display:block">${ft(s.date)}</small></td><td>${esc(s.cname)}</td><td class="num">${s.items.length}</td><td><span class="chip ${({Cash:'ok',UPI:'info',Card:'plum',Cheque:'mut',Credit:'warn'})[s.pay.mode]}">${s.pay.mode}</span></td><td class="num">${s.calc.disc?inr(s.calc.disc):'—'}</td><td class="num">${inr(s.calc.gst)}</td><td class="num"><b>${inr(s.calc.total)}</b></td><td class="r nowrap"><button class="btn btn-o btn-sm" data-act="view-inv" data-no="${s.no}">${ico('eye')}View</button> <button class="btn btn-g btn-sm" data-act="start-return" data-no="${s.no}">Return</button></td></tr>`).join('')||'<tr><td colspan="9" class="empty">No bills in this range.</td></tr>'}
 </tbody></table></div><div class="pager"><span>Showing ${Math.min(40,list.length)} of ${list.length} invoices</span></div></div></div>`};

/* ----- Returns ----- */
PG.returns=()=>`<div class="page">${ph('Returns','Returns & Refunds','Return items against an invoice. Stock goes back to the same batch and the refund is recorded in the ledger.',`<button class="btn btn-p shine" data-act="new-return">${ico('plus')}New return</button>`)}
 <div class="panel">${pnh('Return history','ret')}<div class="tw"><table class="t"><thead><tr><th>Return no.</th><th>Date</th><th>Invoice</th><th>Customer</th><th>Items</th><th>Reason</th><th>Refund</th><th class="num">Amount</th></tr></thead><tbody>
 ${S.returns.map(r=>`<tr><td><b>${r.no}</b></td><td>${fd(r.date)}</td><td><button class="link" data-act="view-inv" data-no="${r.inv}">${r.inv}</button></td><td>${esc(r.cname)}</td><td>${r.items.map(i=>`${i.name} × ${i.qty}`).join(', ')}</td><td class="muted">${esc(r.reason)}</td><td><span class="chip mut">${r.mode}</span></td><td class="num"><b style="color:var(--sos)">− ${inr(r.amt)}</b></td></tr>`).join('')||'<tr><td colspan="8" class="empty">No returns yet.</td></tr>'}
 </tbody></table></div></div></div>`;
function returnModal(no){const s=S.sales.find(x=>x.no===no);if(!s){toast('Invoice not found',1);return}
 const f=s.calc.sub?s.calc.net/s.calc.sub:1;
 modal('Return against '+s.no,`<div class="row" style="justify-content:space-between;margin-bottom:12px"><div>${who(s.cname,fd(s.date)+' · '+s.pay.mode)}</div><b>${inr(s.calc.total)}</b></div>
 <div class="tw"><table class="t" style="min-width:480px"><thead><tr><th>Item</th><th>Batch</th><th class="num">Sold</th><th class="num">Unit refund</th><th class="c">Return qty</th></tr></thead><tbody>${s.items.map((i,k)=>`<tr><td><b>${i.name}</b></td><td>${i.bno}</td><td class="num">${i.qty}</td><td class="num">${inr(i.mrp*f)}</td><td class="c"><input class="inp inp-sm" style="width:64px;text-align:center" type="number" min="0" max="${i.qty}" value="0" data-rq="${k}"></td></tr>`).join('')}</tbody></table></div>
 <div class="fg" style="margin-top:14px"><div class="fld"><label>Reason</label><select class="inp" id="rreason"><option>Doctor changed medicine</option><option>Wrong item given</option><option>Damaged / defective</option><option>Patient no longer needs it</option></select></div><div class="fld"><label>Refund mode</label><select class="inp" id="rmode"><option>Cash</option><option>UPI</option><option>Adjust in credit due</option></select></div><div class="fld"><label>Refund amount</label><input class="inp" id="ramt" readonly value="₹0.00"></div></div>`,
 `<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" data-act="do-return" data-no="${s.no}">Process return & restock</button>`,{wide:1,icon:'ret'})}

/* ----- Inventory ----- */
let IF={tab:'meds',q:'',st:'',form:''};
PG.inventory=()=>{
 const tabs=[['meds','Medicines'],['batches','Batches & Stock'],['expiry','Expiry Report'],['adj','Stock Adjustments']];
 let body='';
 if(IF.tab==='meds'){const list=S.meds.filter(m=>(!IF.q||(m.name+m.gen+m.mfr).toLowerCase().includes(IF.q.toLowerCase()))&&(!IF.form||m.form===IF.form)&&(!IF.st||stockState(m.id)[0]===IF.st));
  body=`<div class="filters"><label class="sbox">${ico('search')}<input placeholder="Search medicine, generic or manufacturer" data-if="q" value="${esc(IF.q)}"></label><select class="inp" data-if="form"><option value="">All forms</option>${[...new Set(S.meds.map(m=>m.form))].map(f=>`<option ${IF.form===f?'selected':''}>${f}</option>`).join('')}</select><select class="inp" data-if="st"><option value="">All stock status</option>${['In stock','Low stock','Out of stock'].map(s=>`<option ${IF.st===s?'selected':''}>${s}</option>`).join('')}</select></div>
  <div class="tw"><table class="t"><thead><tr><th>Medicine</th><th>Form · Pack</th><th>Schedule</th><th>HSN</th><th class="num">GST</th><th>Rack</th><th class="num">Batches</th><th class="num">Stock</th><th>Status</th><th class="r"></th></tr></thead><tbody>${list.map(m=>{const[sl,sc]=stockState(m.id);return `<tr><td><b>${m.name}</b><small class="faint" style="display:block">${m.gen} · ${m.mfr}</small></td><td>${m.form} · ${m.pack}</td><td><span class="chip ${m.sch==='OTC'?'mut':'warn'}">${m.sch}</span></td><td class="faint">${m.hsn}</td><td class="num">${m.gst}%</td><td>${m.rack}</td><td class="num">${S.batches.filter(b=>b.med===m.id).length}</td><td class="num"><b>${stockOf(m.id)}</b></td><td><span class="chip ${sc} dot">${sl}</span></td><td class="r nowrap"><button class="btn btn-o btn-sm" data-act="add-batch" data-id="${m.id}">${ico('plus')}Batch</button> <button class="btn btn-g btn-sm" data-act="reorder" data-id="${m.id}">Reorder</button></td></tr>`}).join('')}</tbody></table></div>`}
 else if(IF.tab==='batches'||IF.tab==='expiry'){let list=[...S.batches].sort((a,b)=>a.exp-b.exp);if(IF.tab==='expiry')list=list.filter(b=>b.stock>0&&days(b.exp,TODAY)<=90);
  const tiers=[['Expired',S.batches.filter(b=>days(b.exp,TODAY)<0&&b.stock>0),'sos'],['Within 30 days',S.batches.filter(b=>{const d=days(b.exp,TODAY);return d>=0&&d<=30&&b.stock>0}),'sos'],['31–90 days',S.batches.filter(b=>{const d=days(b.exp,TODAY);return d>30&&d<=90&&b.stock>0}),'warn'],['Good (90+ days)',S.batches.filter(b=>days(b.exp,TODAY)>90&&b.stock>0),'ok']];
  body=`${IF.tab==='expiry'?`<div class="g g4" style="margin-bottom:16px">${tiers.map(([l,a,c])=>`<div class="stat" style="--accent:var(--${c==='sos'?'sos':c==='warn'?'amber':'leaf'}-tint)"><span class="l">${l}</span><span class="v">${a.length} <small style="font-size:13px" class="muted">batches</small></span><span class="d muted">Stock value ${inr0(a.reduce((x,b)=>x+b.stock*b.cost,0))}</span></div>`).join('')}</div>`:''}
  <div class="tw"><table class="t"><thead><tr><th>Batch</th><th>Medicine</th><th>Expiry</th><th class="num">Days left</th><th class="num">Stock</th><th class="num">MRP</th><th class="num">Cost</th><th class="num">Stock value</th><th>Status</th><th class="r"></th></tr></thead><tbody>${list.map(b=>{const[l,c]=expState(b);const d=days(b.exp,TODAY);return `<tr><td><b>${b.no}</b></td><td>${med(b.med).name}</td><td>${fexp(b.exp)}</td><td class="num" style="color:${d<0?'var(--sos)':d<=90?'var(--amber)':'inherit'}">${d<0?'Expired':d}</td><td class="num"><b>${b.stock}</b></td><td class="num">${inr(b.mrp)}</td><td class="num">${inr(b.cost)}</td><td class="num">${inr0(b.stock*b.cost)}</td><td><span class="chip ${c} dot">${l}</span></td><td class="r nowrap"><button class="btn btn-o btn-sm" data-act="adjust" data-id="${b.id}">Adjust</button>${d<0&&b.stock?` <button class="btn btn-x btn-sm" data-act="writeoff" data-id="${b.id}">Write off</button>`:''}</td></tr>`}).join('')||'<tr><td colspan="10" class="empty">No batches need attention.</td></tr>'}</tbody></table></div>`}
 else{body=`<div class="tw"><table class="t"><thead><tr><th>Date</th><th>Medicine</th><th>Batch</th><th class="num">Change</th><th>Reason</th><th>By</th></tr></thead><tbody>${S.adj.map(a=>`<tr><td>${fd(a.d)}</td><td>${med(a.med).name}</td><td>${a.bno}</td><td class="num"><b style="color:${a.delta<0?'var(--sos)':'var(--leaf)'}">${a.delta>0?'+':''}${a.delta}</b></td><td>${esc(a.reason)}</td><td>${a.by}</td></tr>`).join('')}</tbody></table></div><p class="faint" style="font-size:12px;margin-top:10px">Every change is logged with user and reason for audit.</p>`}
 const val=S.batches.reduce((a,b)=>a+(b.exp>=TODAY?b.stock*b.cost:0),0);
 return `<div class="page">${ph('Inventory','Inventory',`${S.meds.length} medicines · ${S.batches.length} batches · stock value ${inr0(val)} at cost`,`<button class="btn btn-o" data-act="import-csv">${ico('upload')}Import CSV</button><button class="btn btn-d shine" style="--d:1.2s" data-act="scan-bill">${ico('scan')}Scan purchase bill</button><button class="btn btn-p shine" data-act="add-med">${ico('plus')}Add medicine</button>`)}
 <div class="panel"><div class="tabs">${tabs.map(([k,l])=>`<button class="${IF.tab===k?'on':''}" data-act="itab" data-t="${k}">${l}</button>`).join('')}</div>${body}</div></div>`};

/* ----- Purchases ----- */
let PUT='po';
const POST={Draft:'mut',Sent:'info',Confirmed:'plum',Shipped:'warn',Received:'ok'};
PG.purchases=()=>`<div class="page">${ph('Purchases','Purchases & Suppliers','Raise purchase orders, track supplier status, and receive stock into new batches.',`<button class="btn btn-o" data-act="add-supplier">${ico('plus')}Add supplier</button><button class="btn btn-p shine" data-act="new-po">${ico('plus')}New purchase order</button>`)}
 <div class="panel"><div class="tabs"><button class="${PUT==='po'?'on':''}" data-act="putab" data-t="po">Purchase orders</button><button class="${PUT==='sup'?'on':''}" data-act="putab" data-t="sup">Suppliers</button></div>
 ${PUT==='po'?`<div class="tw"><table class="t"><thead><tr><th>PO no.</th><th>Date</th><th>Supplier</th><th>Items</th><th class="num">Amount</th><th>Status</th><th class="r">Actions</th></tr></thead><tbody>${S.pos.map((p,i)=>{const amt=p.items.reduce((a,[,q,c])=>a+q*c,0);return `<tr><td><b>${p.no}</b></td><td>${fd(p.date)}</td><td>${S.suppliers.find(s=>s.id===p.sup).name}</td><td>${p.items.map(([m,q])=>`<span class="chip mut" style="margin:2px">${med(m).name} × ${q}</span>`).join('')}</td><td class="num"><b>${inr0(amt)}</b></td><td><span class="chip ${POST[p.status]} dot">${p.status}</span></td><td class="r nowrap">${p.status==='Draft'?`<button class="btn btn-o btn-sm" data-act="po-send" data-i="${i}">${ico('send')}Send to supplier</button>`:p.status!=='Received'?`<button class="btn btn-p btn-sm" data-act="po-recv" data-i="${i}">Receive stock</button>`:'<span class="faint">Stock added</span>'}</td></tr>`}).join('')}</tbody></table></div>`
 :`<div class="tw"><table class="t"><thead><tr><th>Supplier</th><th>Contact</th><th>GSTIN</th><th>City</th><th class="num">Orders</th><th class="num">Payable</th><th>Status</th></tr></thead><tbody>${S.suppliers.map(s=>`<tr><td>${who(s.name)}</td><td>${s.person}<small class="faint" style="display:block">+91 ${s.mob}</small></td><td class="faint">${s.gstin}</td><td>${s.city}</td><td class="num">${S.pos.filter(p=>p.sup===s.id).length}</td><td class="num">${s.due?`<b style="color:var(--sos)">${inr0(s.due)}</b>`:'—'}</td><td><span class="chip ${s.status==='Active'?'ok':'mut'} dot">${s.status}</span></td></tr>`).join('')}</tbody></table></div><p class="faint" style="font-size:12px;margin-top:10px">Suppliers get their own portal login to confirm and ship orders.</p>`}</div></div>`;

/* ----- Reports ----- */
let RT='analytics';
PG.reports=()=>{
 const curM=S.sales.filter(s=>s.date.getMonth()===TODAY.getMonth()&&s.date.getFullYear()===TODAY.getFullYear()).reduce((a,s)=>a+s.calc.total,0);
 const vals=[...MONTHLY,curM];const labs=[...Array(12)].map((_,i)=>MON[(TODAY.getMonth()-11+i+12)%12]);
 const pm={};S.sales.forEach(s=>pm[s.pay.mode]=(pm[s.pay.mode]||0)+s.calc.total);const pmt=Object.values(pm).reduce((a,b)=>a+b,0);
 const cust={};S.sales.filter(s=>s.cust!=='walk').forEach(s=>cust[s.cname]=(cust[s.cname]||0)+s.calc.total);
 const PMC={Cash:'#2A9615',UPI:'#1F6FB2',Card:'#7B4FB8',Credit:'#B7791F',Cheque:'#8A97A8'};
 let acc=0;const donut=Object.entries(pm).map(([k,v])=>{const a0=acc/pmt*Math.PI*2,a1=(acc+=v)/pmt*Math.PI*2;const r=56,cx=70,cy=70;const p=(a)=>[cx+r*Math.sin(a),cy-r*Math.cos(a)];const[x0,y0]=p(a0),[x1,y1]=p(a1);return`<path d="M${x0} ${y0}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${x1} ${y1}" stroke="${PMC[k]}" stroke-width="22" fill="none"><title>${k}: ${inr0(v)}</title></path>`}).join('');
 const slabs={};S.sales.filter(s=>s.date>=new Date(TODAY.getFullYear(),TODAY.getMonth(),1)).forEach(s=>Object.entries(s.calc.slabs).forEach(([r,v])=>{slabs[r]=slabs[r]||{tx:0,g:0};slabs[r].tx+=v.tx;slabs[r].g+=v.g}));
 const led=[...S.sales.slice(0,10).map(s=>({d:s.date,type:'Income',head:'Sale '+s.no+' · '+s.cname,amt:s.calc.total,mode:s.pay.mode})),...S.returns.map(r=>({d:r.date,type:'Return',head:r.no+' against '+r.inv,amt:-r.amt,mode:r.mode})),...S.ledger.map(l=>({...l,amt:-l.amt}))].sort((a,b)=>b.d-a.d);
 const tabs=[['analytics','Analytics'],['ledger','Ledger'],['gst','GST summary']];
 let body='';
 if(RT==='analytics')body=`<div class="g g-main"><div class="panel">${pnh('Sales · last 12 months','chart',`<span class="chip ok">This month ${inr0(curM)}</span>`)}${barChart(vals,labs,200)}</div>
  <div class="panel">${pnh('Payment modes','coin')}<div class="row" style="flex-wrap:nowrap;gap:18px"><svg viewBox="0 0 140 140" width="140" height="140" style="flex:none">${donut}<text x="70" y="66" text-anchor="middle" style="fill:var(--faint);font-size:10px">30-day total</text><text x="70" y="82" text-anchor="middle" style="fill:var(--fg);font-size:14px;font-weight:800">${inr0(pmt)}</text></svg><div class="stack" style="gap:8px;flex:1">${Object.entries(pm).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="row" style="justify-content:space-between;font-size:12.8px;flex-wrap:nowrap"><span class="row" style="gap:7px;flex-wrap:nowrap"><i style="width:10px;height:10px;border-radius:3px;background:${PMC[k]}"></i>${k}</span><b>${Math.round(v/pmt*100)}%</b></div>`).join('')}</div></div></div></div>
  <div class="g g2" style="margin-top:16px"><div class="panel">${pnh('Top customers · 30 days','users')}${Object.entries(cust).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([n,v])=>`<div class="row" style="justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap">${who(n)}<b>${inr0(v)}</b></div>`).join('')}</div>
  <div class="panel">${pnh('Profit snapshot · 30 days','coin')}${(()=>{const rev=S.sales.reduce((a,s)=>a+s.calc.total,0);const cogs=S.sales.reduce((a,s)=>a+s.items.reduce((x,i)=>x+bat(i.batch).cost*i.qty,0),0);const exp=S.ledger.filter(l=>l.type==='Expense').reduce((a,l)=>a+l.amt,0);return `<div class="kv" style="font-size:14px"><span>Revenue</span><b>${inr0(rev)}</b><span>Cost of goods</span><b>− ${inr0(cogs)}</b><span>Gross margin</span><b style="color:var(--leaf)">${inr0(rev-cogs)} (${Math.round((rev-cogs)/rev*100)}%)</b><span>Expenses</span><b>− ${inr0(exp)}</b><span>Net</span><b style="color:${rev-cogs-exp>=0?'var(--leaf)':'var(--sos)'}">${inr0(rev-cogs-exp)}</b></div>`})()}</div></div>`;
 else if(RT==='ledger')body=`<div class="panel">${pnh('Ledger','book',`<button class="btn btn-p btn-sm" data-act="add-expense">${ico('plus')}Add expense</button>`)}<div class="tw"><table class="t"><thead><tr><th>Date</th><th>Type</th><th>Particulars</th><th>Mode</th><th class="num">Amount</th></tr></thead><tbody>${led.map(l=>`<tr><td>${fd(l.d)}</td><td><span class="chip ${l.type==='Income'?'ok':l.type==='Return'?'warn':'sos'}">${l.type}</span></td><td>${esc(l.head)}</td><td>${l.mode}</td><td class="num"><b style="color:${l.amt<0?'var(--sos)':'var(--leaf)'}">${l.amt<0?'− ':'+ '}${inr(Math.abs(l.amt))}</b></td></tr>`).join('')}</tbody></table></div></div>`;
 else body=`<div class="panel">${pnh('GST summary · '+MON[TODAY.getMonth()]+' '+TODAY.getFullYear()+' (outward supplies)','receipt')}<div class="tw"><table class="t"><thead><tr><th>GST rate</th><th class="num">Taxable value</th><th class="num">CGST</th><th class="num">SGST</th><th class="num">Total tax</th><th class="num">Invoice value</th></tr></thead><tbody>${Object.entries(slabs).map(([r,v])=>`<tr><td><b>${r}%</b></td><td class="num">${inr(v.tx)}</td><td class="num">${inr(v.g/2)}</td><td class="num">${inr(v.g/2)}</td><td class="num">${inr(v.g)}</td><td class="num"><b>${inr(v.tx+v.g)}</b></td></tr>`).join('')}</tbody></table></div><p class="faint" style="font-size:12px;margin-top:10px">Intra-state sales in ${S.store.state}, so tax splits equally into CGST and SGST. Share this with your CA for GSTR-1 and GSTR-3B.</p></div>`;
 return `<div class="page">${ph('Reports','Reports & Ledger','Sales trends, payments, profit, ledger and GST in one place.')}<div class="tabs">${tabs.map(([k,l])=>`<button class="${RT===k?'on':''}" data-act="rtab" data-t="${k}">${l}</button>`).join('')}</div>${body}</div>`};

/* ----- Settings ----- */
PG.settings=()=>`<div class="page">${ph('Settings','Settings & Users','Store details printed on invoices, alert thresholds, and staff access.')}
 <div class="g g2"><div class="panel">${pnh('Store information','hospital')}<div class="fg" style="grid-template-columns:1fr 1fr">${[['Store name','name'],['Phone','phone'],['GSTIN','gstin'],['Registration / drug licence no.','dl'],['Owner mobile (login)','ownerMob'],['Invoice prefix','prefix'],['State','state']].map(([l,k])=>`<div class="fld"><label>${l}</label><input class="inp" data-set="${k}" value="${esc(S.store[k])}"></div>`).join('')}<div class="fld" style="grid-column:1/-1"><label>Address</label><input class="inp" data-set="addr" value="${esc(S.store.addr)}"></div></div></div>
 <div class="stack"><div class="panel">${pnh('Alerts & billing','alarm')}<div class="fg" style="grid-template-columns:1fr 1fr"><div class="fld"><label>Low stock below (units)</label><input class="inp" type="number" data-set="low" value="${S.store.low}"></div><div class="fld"><label>Expiry alert (days)</label><input class="inp" type="number" data-set="expAlert" value="${S.store.expAlert}"></div><div class="fld"><label>Currency</label><select class="inp"><option>₹ Indian Rupee</option></select></div><div class="fld"><label>Default discount</label><select class="inp"><option>None</option><option>5% senior citizens</option></select></div></div></div>
 <div class="panel">${pnh('Security','lock3')}<div class="kv"><span>Password hashing</span><b>BCrypt</b><span>Failed login lockout</span><b>5 attempts · 15 min</b><span>Session timeout</span><b>2 hours idle</b><span>Patient data</span><b>OTP consent required</b></div><button class="btn btn-o btn-sm" style="margin-top:12px" data-toast="Password change link sent to your mobile">Change password</button></div></div></div>
 <div class="panel" style="margin-top:16px">${pnh('Users & roles','users',`<button class="btn btn-p btn-sm" data-act="add-user">${ico('plus')}Add user</button>`)}<div class="tw"><table class="t"><thead><tr><th>User</th><th>Role</th><th>Can access</th><th>Last login</th><th>Enabled</th></tr></thead><tbody>${S.users.map((u,i)=>`<tr><td>${who(u.name,'+91 '+u.mob)}</td><td><span class="chip ${u.role==='Admin'?'br':u.role==='Pharmacist'?'info':'mut'}">${u.role}</span></td><td class="muted" style="font-size:12.5px">${u.role==='Admin'?'Everything':u.role==='Pharmacist'?'Prescriptions, patients, billing, inventory':'Billing, sales, returns'}</td><td class="faint">${u.last}</td><td><label class="row" style="gap:6px"><input type="checkbox" ${u.on?'checked':''} data-user="${i}" ${u.role==='Admin'?'disabled':''}>${u.on?'Active':'Disabled'}</label></td></tr>`).join('')}</tbody></table></div></div>
 <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-p shine" data-act="save-settings">Save settings</button></div></div>`;


/* ================= STAFF ATTENDANCE ================= */
const AU={on:false,tries:0,until:0,code:'246810'};
const BIO={scan:false,msg:null,emp:''};
S.staff=[
 {id:'E01',name:'Anil Banerjee',role:'Owner / Admin',shift:'09:00-21:00',off:0,bio:true},
 {id:'E02',name:'Riya Mondal',role:'Pharmacist',shift:'09:00-17:00',off:3,bio:true},
 {id:'E03',name:'Babu Das',role:'Billing Staff',shift:'13:00-21:00',off:2,bio:true},
 {id:'E04',name:'Sanjay Kar',role:'Billing Staff',shift:'09:00-17:00',off:4,bio:false,join:addD(-4)},
 {id:'E05',name:'Puja Sen',role:'Pharmacy Assistant',shift:'10:00-18:00',off:5,bio:true},
 {id:'E06',name:'Rakesh Yadav',role:'Delivery',shift:'11:00-20:00',off:1,bio:true},
];
const ATT={},ALOG=[];const ak=(e,d)=>e+'|'+d;
let AD=dk(TODAY),ATAB='day',AM=0;
const WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const atT=(dt,h,m)=>{const x=new Date(dt);x.setHours(h,m,0,0);return x};
const shf=e=>e.shift.split('-').map(s=>s.split(':').map(Number));
for(let off=-40;off<0;off++){const dt=addD(off);S.staff.forEach(e=>{if(e.join&&dt<e.join)return;if(dt.getDay()===e.off)return;const k=ak(e.id,dk(dt));
 if(!e.bio){ATT[k]={adm:'P',admAt:atT(dt,10,5)};return}
 const r=rnd();if(r<.05){ATT[k]={adm:'L',admAt:atT(dt,9,0)};return}if(r<.075){ATT[k]={adm:'A',admAt:atT(dt,12,0)};return}
 const[[h1,m1],[h2,m2]]=shf(e);const half=r<.1;ATT[k]={adm:half?'H':'P',admAt:atT(dt,h1+1,10),bin:atT(dt,h1,m1-10+Math.floor(rnd()*22)),bout:atT(dt,half?h1+4:h2,m2+Math.floor(rnd()*15))}})}
{const y=addD(-1);ATT[ak('E05',dk(y))]={adm:null,bin:atT(y,9,57),bout:atT(y,18,6)};const d3=addD(-3);ATT[ak('E06',dk(d3))]={adm:'A',admAt:atT(d3,12,0),bin:atT(d3,11,4),bout:atT(d3,19,48)};}
const tAt=(h,m)=>{const d=atT(TODAY,h,m);return d>new Date()?new Date(Date.now()-((h+m)%30+3)*6e4):d};
{const k=e=>ak(e,dk(TODAY));ATT[k('E01')]={adm:'P',admAt:tAt(9,5),bin:tAt(8,52)};ATT[k('E02')]={adm:null,bin:tAt(8,57)};ATT[k('E05')]={adm:null,bin:tAt(9,58)};ATT[k('E06')]={adm:'P',admAt:tAt(9,6)};ATT[k('E04')]={adm:'P',admAt:tAt(9,7)};
 ALOG.push({t:tAt(8,52),who:'Anil Banerjee',txt:'Biometric punch in',src:'bio'},{t:tAt(8,57),who:'Riya Mondal',txt:'Biometric punch in',src:'bio'},{t:tAt(9,5),who:'Anil Banerjee',txt:'Marked Present for '+fd(TODAY),src:'admin'},{t:tAt(9,6),who:'Rakesh Yadav',txt:'Marked Present for '+fd(TODAY)+' (on delivery run)',src:'admin'},{t:tAt(9,7),who:'Sanjay Kar',txt:'Marked Present for '+fd(TODAY),src:'admin'},{t:tAt(9,58),who:'Puja Sen',txt:'Biometric punch in',src:'bio'},{t:atT(addD(-1),18,6),who:'Puja Sen',txt:'Biometric punch out',src:'bio'})}
function attSt(e,key){const r=ATT[ak(e.id,key)]||{};const a=r.adm,b=r.bin;const dt=new Date(key+'T00:00');
 if(e.join&&dt<e.join)return['Not joined yet','','mut'];
 if(a==='L')return['On leave','L','info'];
 if(a==='A')return b?['Mismatch · review','!','sos']:['Absent','A','sos'];
 if(a==='P'||a==='H')return b?[a==='H'?'Half day · confirmed':'Present · confirmed',a==='H'?'½':'P','ok']:['Awaiting biometric','?','warn'];
 if(b)return['Awaiting admin mark','?','warn'];
 if(dt>TODAY)return['','','mut'];
 if(dt.getDay()===e.off)return['Weekly off','W','mut'];
 return['Not marked','–','mut']}
function bioPunch(id,via='Desktop scanner'){const e=S.staff.find(x=>x.id===id);const k=ak(id,dk(TODAY));const r=ATT[k]=ATT[k]||{adm:null};let kind;
 if(!r.bin){r.bin=new Date();kind='in'}else if(!r.bout){if(Date.now()-r.bin<6e4)return{e,kind:'dup',r};r.bout=new Date();kind='out'}else kind='done';
 if(kind==='in'||kind==='out')ALOG.push({t:new Date(),who:e.name,txt:'Biometric punch '+kind+(via==='Phone'?' · phone scanner':''),src:'bio'});if(kind==='in'||kind==='out')syncPunch(id,via);return{e,kind,r}}
function bioMsg({e,kind,r}){const st=attSt(e,dk(TODAY));
 if(kind==='dup')return `<div class="rxwarn">${ico('alert')}${esc(e.name)} punched in at ${ft(r.bin)}. Punch out works after a minute.</div>`;
 if(kind==='done')return `<div class="rxwarn">${ico('alert')}${esc(e.name)} already punched in and out today (${ft(r.bin)} – ${ft(r.bout)}). One attendance per day.</div>`;
 return `<div class="okbox">${ico('check')}<div><b>${esc(e.name)} · punch ${kind} ${ft(kind==='in'?r.bin:r.bout)}</b>${st[2]==='ok'?'Attendance confirmed for today: admin mark and biometric both recorded.':r.adm==='A'?'The admin marked this person absent, so today is flagged as a mismatch.':"Waiting for the admin's mark to confirm today's attendance."}</div></div>`}
function attUnlock(){if(Date.now()<AU.until)return;const v=$$('[data-apin]').map(i=>i.value).join('');if(v.length<6){toast('Enter all 6 digits',1);return}
 if(v===AU.code){AU.on=true;AU.tries=0;ALOG.push({t:new Date(),who:'Admin',txt:'Unlocked the attendance system',src:'admin'});render();toast('Attendance unlocked')}
 else{AU.tries++;if(AU.tries>=5){AU.until=Date.now()+15*6e4;AU.tries=0}render();$('#apin')?.classList.add('shake');toast('Wrong access code',1);setTimeout(()=>$('[data-apin="0"]')?.focus(),60)}}
function scanModal(id){const e=S.staff.find(x=>x.id===id);
 modal('Biometric · '+e.name,`<div class="stack" style="align-items:center;text-align:center;gap:14px"><div class="fp scan" id="fpBox"><span data-3="finger"></span><div class="scanline"></div></div><b id="fpMsg">Place ${esc(e.name.split(' ')[0])}'s finger on the scanner…</b><div id="fpRes" style="width:100%;text-align:left"></div></div>`,`<button class="btn btn-p" data-act="mclose">Done</button>`,{icon:'finger'});
 setTimeout(()=>{const box=$('#fpBox');const res=bioPunch(id);if(!box)return;box.classList.remove('scan');box.querySelector('.scanline')?.remove();$('#fpMsg').textContent='Fingerprint matched';$('#fpRes').innerHTML=bioMsg(res);render()},1700)}
function enrollModal(id){const e=S.staff.find(x=>x.id===id);let n=0;
 modal('Enroll fingerprint · '+e.name,`<div class="stack" style="align-items:center;text-align:center;gap:14px"><div class="fp" id="fpBox"><span data-3="finger"></span></div><b id="fpMsg">Ask ${esc(e.name.split(' ')[0])} to place the right index finger. 3 scans are needed.</b><div class="row">${[0,1,2].map(i=>`<span class="ac mut" data-dot="${i}">${i+1}</span>`).join('')}</div></div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="enGo">Scan</button>`,{icon:'finger'});
 $('#enGo').onclick=()=>{const b=$('#fpBox');if(b.classList.contains('scan'))return;b.classList.add('scan');b.insertAdjacentHTML('beforeend','<div class="scanline"></div>');
  setTimeout(()=>{b.classList.remove('scan');b.querySelector('.scanline')?.remove();$(`[data-dot="${n}"]`).className='ac ok';n++;if(n<3)$('#fpMsg').textContent=`Scan ${n} of 3 captured. Lift and place the same finger again.`;else{e.bio=true;ALOG.push({t:new Date(),who:e.name,txt:'Fingerprint enrolled',src:'admin'});mclose();render();toast(e.name+"'s fingerprint enrolled")}},1100)}}

PG.attendance=()=>{
 if(!AU.on){const lock=Date.now()<AU.until;return `<div class="page">${ph('Staff Attendance','Staff Attendance','Admin access only.')}
 <div class="panel" style="max-width:460px;margin:24px auto 0;text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px;padding:30px 24px"><span style="width:92px;height:92px;display:block" data-3="lock3"></span><h2 style="font-size:20px;font-weight:800">Enter admin access code</h2><p class="muted" style="font-size:13px">Only the store admin can mark or change staff attendance.</p>
 <div class="otp" id="apin">${[...Array(6)].map((_,i)=>`<input type="password" inputmode="numeric" maxlength="1" data-apin="${i}" aria-label="Code digit ${i+1}" ${lock?'disabled':''}>`).join('')}</div>
 ${lock?`<div class="rxwarn" style="background:var(--sos-tint);color:var(--sos)">${ico('lock')}Too many wrong tries. Try again after ${ft(new Date(AU.until))}.</div>`:AU.tries?`<small style="color:var(--sos);font-weight:700">${5-AU.tries} tries left before a 15-minute lock</small>`:''}
 <button class="btn btn-p btn-lg shine" style="width:100%" data-act="att-unlock" ${lock?'disabled':''}>Unlock attendance</button>
 <small class="faint">Demo code: 246810 · locks again when you leave this page</small></div></div>`}
 const tabs=[['day','Daily attendance'],['month','Monthly register'],['bio','Biometric device'],['log','Activity log']];let body='';
 if(ATAB==='day'){const dt=new Date(AD+'T00:00'),isT=AD===dk(TODAY);const sts=S.staff.map(e=>attSt(e,AD));const pend=S.staff.filter(e=>{const r=ATT[ak(e.id,AD)];return r&&r.bin&&!r.adm});
  body=`<div class="row" style="justify-content:space-between;margin-bottom:14px"><div class="row"><button class="btn btn-o btn-sm" data-act="att-shift" data-d="-1" aria-label="Previous day">‹</button><input type="date" class="inp" id="adate" style="width:auto" value="${AD}" max="${dk(TODAY)}"><button class="btn btn-o btn-sm" data-act="att-shift" data-d="1" aria-label="Next day" ${isT?'disabled':''}>›</button>${isT?'<span class="chip br">Today</span>':`<button class="btn btn-g btn-sm" data-act="att-shift" data-d="0">Go to today</button>`}<b style="margin-left:4px">${WD[dt.getDay()]}, ${fd(dt)}</b></div>${pend.length?`<button class="btn btn-p btn-sm" data-act="att-confirm-all">${ico('check')}Mark ${pend.length} punched-in staff present</button>`:''}</div>
  <div class="g g4" style="margin-bottom:16px">${[['Confirmed','ok',sts.filter(s=>s[2]==='ok').length,'leaf'],['Waiting for one side','warn',sts.filter(s=>s[2]==='warn').length,'amber'],['On leave','info',sts.filter(s=>s[1]==='L').length,'info'],['Absent / mismatch','sos',sts.filter(s=>s[2]==='sos').length,'sos']].map(([l,c,n,a])=>`<div class="stat" style="--accent:var(--${a}-tint)"><span class="l">${l}</span><span class="v" style="color:var(--${a==='leaf'?'leaf':a==='amber'?'amber':a})">${n}</span></div>`).join('')}</div>
  <div class="panel"><div class="tw"><table class="t"><thead><tr><th>Employee</th><th>Shift</th><th>Admin attendance</th><th>Biometric</th><th>Day status</th></tr></thead><tbody>
  ${S.staff.map(e=>{const r=ATT[ak(e.id,AD)]||{};const[sl,,c]=attSt(e,AD);const pre=e.join&&dt<e.join;
   return `<tr><td>${who(e.name,e.id+' · '+e.role)}</td><td class="nowrap">${e.shift.replace('-',' – ')}<small class="faint" style="display:block">Weekly off: ${WD[e.off]}</small></td>
   <td>${pre?'<span class="faint">—</span>':`<div class="seg">${[['P','Present'],['H','Half day'],['L','Leave'],['A','Absent']].map(([v,l])=>`<button class="${r.adm===v?'on':''}" data-act="att-mark" data-e="${e.id}" data-v="${v}">${l}</button>`).join('')}</div>${r.admAt?`<small class="faint" style="display:block;margin-top:3px">Marked at ${ft(r.admAt)}</small>`:''}`}</td>
   <td>${r.bin?`<div class="row" style="gap:6px"><span class="chip ok">In ${ft(r.bin)}</span>${r.bout?`<span class="chip mut">Out ${ft(r.bout)}</span>`:isT?`<button class="btn btn-o btn-sm" data-act="att-scan" data-e="${e.id}">Punch out</button>`:''}</div>`:pre?'<span class="faint">—</span>':!e.bio?`<button class="btn btn-o btn-sm" data-act="att-enroll" data-e="${e.id}">Enroll fingerprint</button><small class="faint" style="display:block;margin-top:3px">Not enrolled yet</small>`:isT?`<button class="btn btn-g btn-sm" data-act="att-scan" data-e="${e.id}"><span style="width:18px;height:18px;display:inline-block" data-3="finger"></span>Scan finger</button>`:'<span class="faint">No punch recorded</span>'}</td>
   <td>${sl?`<span class="chip ${c} dot">${sl}</span>`:''}</td></tr>`}).join('')}</tbody></table></div>
  <p class="faint" style="font-size:12px;margin-top:10px">Biometric punches come only from the scanner and can't be added later for a past day. Tap a selected mark again to clear it.</p></div>`}
 else if(ATAB==='month'){const base=new Date(TODAY.getFullYear(),TODAY.getMonth()+AM,1);const dim=new Date(base.getFullYear(),base.getMonth()+1,0).getDate();const keys=[...Array(dim)].map((_,i)=>dk(new Date(base.getFullYear(),base.getMonth(),i+1)));
  const lg=[['P','ok','Confirmed'],['½','ok','Half day'],['?','warn','Waiting'],['L','info','Leave'],['A','sos','Absent'],['!','sos','Mismatch'],['W','mut','Weekly off']];
  body=`<div class="row" style="justify-content:space-between;margin-bottom:12px"><div class="row"><button class="btn btn-o btn-sm" data-act="att-mon" data-m="-1" aria-label="Previous month">‹</button><b>${MON[base.getMonth()]} ${base.getFullYear()}</b><button class="btn btn-o btn-sm" data-act="att-mon" data-m="1" aria-label="Next month" ${AM>=0?'disabled':''}>›</button></div><div class="legend">${lg.map(([c,k,l])=>`<span><b class="ac ${k}" style="width:18px;height:18px;font-size:10px;display:inline-grid">${c}</b>${l}</span>`).join('')}</div></div>
  <div class="panel"><div class="tw"><table class="t reg" style="min-width:${300+dim*31}px"><thead><tr><th>Employee</th>${keys.map(k=>{const d=new Date(k+'T00:00');return `<th>${d.getDate()}<br><span style="font-weight:600">${'SMTWTFS'[d.getDay()]}</span></th>`}).join('')}<th>Paid days</th><th>L</th><th>A</th><th>?</th></tr></thead><tbody>
  ${S.staff.map(e=>{const st=keys.map(k=>attSt(e,k));const n=c=>st.filter(s=>s[1]===c).length;return `<tr><td>${who(e.name,e.role)}</td>${st.map((s,i)=>`<td><button class="ac ${s[2]} ${keys[i]===dk(TODAY)?'today':''}" data-act="att-day" data-k="${keys[i]}" title="${fd(new Date(keys[i]+'T00:00'))}${s[0]?' · '+s[0]:''}" ${new Date(keys[i]+'T00:00')>TODAY?'disabled':''}>${s[1]}</button></td>`).join('')}<td><b style="color:var(--leaf)">${n('P')+n('½')/2}</b></td><td>${n('L')}</td><td>${n('A')+n('!')}</td><td><b style="color:var(--amber)">${n('?')}</b></td></tr>`}).join('')}
  </tbody></table></div><p class="faint" style="font-size:12px;margin-top:10px">Paid days = confirmed present + half of confirmed half days. A day marked ? isn't counted until both the admin and the scanner confirm it. Tap any day to open it.</p></div>`}
 else if(ATAB==='bio'){const en=S.staff.filter(e=>e.bio);if(!en.find(e=>e.id===BIO.emp))BIO.emp=(en.find(e=>!(ATT[ak(e.id,dk(TODAY))]||{}).bin)||en[0]).id;
  body=`<div class="g g2" style="align-items:start"><div class="panel" style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center"><div class="row" style="justify-content:space-between;width:100%"><b>Fingerprint scanner</b><span class="chip ok dot">Connected · Counter 1</span></div>
  <div class="fp ${BIO.scan?'scan':''}"><span data-3="finger"></span>${BIO.scan?'<div class="scanline"></div>':''}</div>
  <div class="fld" style="width:100%;text-align:left"><label for="bioEmp">Staff member</label><select class="inp" id="bioEmp">${en.map(e=>`<option value="${e.id}" ${BIO.emp===e.id?'selected':''}>${e.name} · ${e.role}</option>`).join('')}</select></div>
  <button class="btn btn-p btn-lg shine" style="width:100%" data-act="bio-start" ${BIO.scan?'disabled':''}>${BIO.scan?'Scanning… keep the finger still':'Start scan'}</button>
  <div style="width:100%;text-align:left">${BIO.msg||'<p class="muted" style="font-size:12.5px">The first scan of the day is punch in and the next is punch out. Further scans are ignored, so each person gets one attendance per day.</p>'}</div></div>
  <div class="panel">${pnh('Enrolled fingerprints','finger')}${S.staff.map(e=>`<div class="row" style="justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap">${who(e.name,e.role)}<div class="row" style="flex-wrap:nowrap">${e.bio?'<span class="chip ok">Enrolled</span>':'<span class="chip warn">Not enrolled</span>'}<button class="btn btn-o btn-sm" data-act="att-enroll" data-e="${e.id}">${e.bio?'Re-enroll':'Enroll'}</button></div></div>`).join('')}</div></div>`}
 else{body=`<div class="panel"><div class="tl">${[...ALOG].sort((a,b)=>b.t-a.t).slice(0,50).map(l=>`<div class="tl-i" style="--c:${l.src==='bio'?'var(--info)':'var(--brand)'}"><small class="faint">${fd(l.t)} · ${ft(l.t)} · ${l.src==='bio'?'Fingerprint scanner':'Admin'}</small><div style="font-size:13px"><b>${esc(l.who)}</b> · ${esc(l.txt)}</div></div>`).join('')}</div></div>`}
 return `<div class="page">${ph('Staff Attendance','Staff Attendance',"A day counts only when the admin's mark and a biometric punch both agree. One attendance per person per day.",`<span class="chip ok dot">Admin unlocked</span><button class="btn btn-o" data-act="att-lock">${ico('lock')}Lock</button>`)}<div class="tabs">${tabs.map(([k,l])=>`<button class="${ATAB===k?'on':''}" data-act="att-tab" data-t="${k}">${l}</button>`).join('')}</div>${body}</div>`};

/* ================= PROMOTIONS ================= */
const PR={wallet:2450,tab:'overview',flt:'All',n:1032};
const D14=[...Array(14)].map((_,i)=>addD(i-13));
const dm=d=>d.getDate()+' '+MON[d.getMonth()];
const ht=s=>s.replace('{store}',S.store.name);
const BAN=/\b(best|no\.?\s*1|number\s*one|top[- ]rated|guarantee[ds]?|cures?|cured|miracle|permanent(ly)?|instant relief|risk[- ]free|lowest price)\b|100\s*%/i;
const PT={doctor:['Doctor promotion','doc','Consultation bookings','More consultation bookings for a partnered doctor',5,.06],pharmacy:['Pharmacy promotion','hospital','Store orders','Show your store and offers to patients nearby',4,.11],medicine:['Medicine boost','pill','Orders','Rank OTC products higher in medicine search',3,.09]};
const PLACES={doctor:['Home · Leading doctors','Doctor search results','Specialty pages','After a symptom check'],pharmacy:['Home · Pharmacies near you','Medicine search results','Order checkout'],medicine:['Medicine search results','Similar products','Category pages']};
PR.camps=[
 {id:'AD-1031',type:'doctor',ref:'d1',head:'Dr. Amit Verma, MBBS, MD · General Physician · Consult at {store}',place:['Home · Leading doctors','Doctor search results'],radius:5,daily:300,start:addD(-12),end:addD(18),status:'Live',views:18420,clicks:612,conv:41,rev:24600,spend:3060},
 {id:'AD-1029',type:'pharmacy',ref:'OF-21',head:'{store} · Free home delivery above ₹499',place:['Home · Pharmacies near you','Medicine search results'],radius:3,daily:200,start:addD(-20),end:addD(10),status:'Live',views:26310,clicks:840,conv:96,rev:41280,spend:3360},
 {id:'AD-1027',type:'medicine',ref:'m11',head:'Vitamin D3 60K · 4 Cap · in stock near you',place:['Medicine search results'],radius:5,daily:150,start:addD(-9),end:addD(5),status:'Paused',views:7120,clicks:205,conv:22,rev:2816,spend:615},
 {id:'AD-1024',type:'doctor',ref:'d4',head:'Dr. Meena Kapoor, MBBS, MD · Pediatrician · Consult at {store}',place:['Home · Leading doctors','Specialty pages'],radius:10,daily:250,start:addD(-44),end:addD(-14),status:'Ended',views:30110,clicks:980,conv:57,rev:34200,spend:4900},
];
PR.camps.forEach(c=>{c.series=D14.map(d=>(d<c.start||d>c.end||(c.status==='Paused'&&d>addD(-3)))?0:Math.round(c.clicks/Math.max(14,days(TODAY,c.start))*(.6+rnd()*.8)))});
PR.offers=[
 {id:'OF-21',title:'Free home delivery above ₹499',type:'Free delivery',val:0,min:499,on:'All OTC & devices',till:addD(10),uses:96,status:'Active'},
 {id:'OF-19',title:'10% off on diabetes care',type:'Percent off',val:10,min:299,on:'Diabetes care',till:addD(4),uses:38,status:'Active'},
 {id:'OF-17',title:'Free BP & sugar check with any purchase',type:'Free health check',val:0,min:0,on:'All OTC & devices',till:addD(20),uses:61,status:'Active'},
 {id:'OF-12',title:'₹50 off on vitamins above ₹399',type:'Flat ₹ off',val:50,min:399,on:'Vitamins & supplements',till:addD(-6),uses:44,status:'Expired'},
];
PR.events=[
 {id:'EV1',name:'SevaDharam Health Week',dates:dm(addD(6))+' – '+dm(addD(12)),req:'At least 10% off on 5 or more OTC products',perk:'2× visibility on the patient app home screen',joined:false,g:'linear-gradient(130deg,#C2410C,#E0510F 55%,#F47A2E)'},
 {id:'EV2',name:'World Diabetes Day',dates:dm(addD(8)),req:'Free blood sugar check with any purchase',perk:'Featured in the "Diabetes care" banner',joined:true,g:'linear-gradient(130deg,#0F2A44,#1F6FB2)'},
 {id:'EV3',name:'Winter Wellness Sale',dates:dm(addD(25))+' – '+dm(addD(34)),req:'At least 15% off on vitamins & immunity products',perk:'Push notification to 25,000 nearby app users',joined:false,g:'linear-gradient(130deg,#1E6A10,#2A9615 60%,#5BBF3E)'},
];
let PW=null;
function pwPick(type,ref){PW.type=type;PW.ref=ref;PW.place=PLACES[type].slice(0,2);
 if(type==='doctor'){const d=S.doctors.find(x=>x.id===ref);PW.head=`${d.name}, ${d.qual} · ${d.spec} · Consult at ${S.store.name}`}
 else if(type==='medicine'){const m=med(ref);PW.head=`${m.name} · ${m.pack} · in stock near you`}
 else{const o=PR.offers.find(x=>x.id===ref);PW.head=`${S.store.name} · ${o?o.title:'Genuine medicines, home delivery'}`}}
function pwOpen(type,ref){PW={step:1,type:null,ref:null,place:[],radius:5,daily:300,days:14,head:''};if(type){PW.type=type;PW.place=PLACES[type].slice(0,2);if(ref)pwPick(type,ref)}pwDraw()}
function comp(){const r=[[!BAN.test(PW.head),'No superlatives or cure claims ("best", "guaranteed", "100%"…)'],[PW.head.trim().length>=10,'Ad text is filled in']];
 if(PW.type==='doctor'){const d=S.doctors.find(x=>x.id===PW.ref);r.push([!!d&&d.appr==='approved','Doctor has approved this listing (consent on file)']);r.push([true,'Shows factual details only: name, qualification, specialty, timings'])}
 if(PW.type==='medicine'){const m=med(PW.ref);r.push([!!m&&m.sch==='OTC',"Product is OTC (prescription medicines can't be advertised)"])}
 r.push([PW.place.length>0,'At least one placement selected']);return r}
const compHTML=()=>`<div class="stack" style="gap:6px">${comp().map(([ok,l])=>`<div class="row" style="gap:8px;font-size:12.8px;flex-wrap:nowrap;color:${ok?'var(--leaf)':'var(--sos)'}">${ico(ok?'check':'alert')}<span style="color:var(--fg)">${l}</span></div>`).join('')}</div>`;
function estHTML(){const[,,convL,,cpc,cr]=PT[PW.type];const ck=PW.daily/cpc,vw=ck/.032,cv=ck*cr;const rg=v=>`${Math.max(0,Math.round(v*.75)).toLocaleString('en-IN')}–${Math.max(1,Math.round(v*1.25)).toLocaleString('en-IN')}`;const low=PR.wallet<PW.daily;
 return `<div class="g g3" style="gap:10px">${[['Views / day',rg(vw)],['Clicks / day',rg(ck)],[convL+' / day',rg(cv)]].map(([l,v])=>`<div class="panel" style="padding:12px"><small class="muted" style="font-size:11.5px">${l}</small><div style="font-size:18px;font-weight:800">${v}</div></div>`).join('')}</div>
 <div class="kv" style="margin-top:12px"><span>Cost per click</span><b>about ${inr0(cpc)}</b><span>Maximum total spend</span><b>${inr0(PW.daily*PW.days)} over ${PW.days} days</b><span>Ad wallet balance</span><b style="color:${low?'var(--sos)':'inherit'}">${inr0(PR.wallet)}</b></div>
 <p class="faint" style="font-size:12px;margin-top:8px">You pay only when a patient taps the ad. Unused budget stays in your wallet. Estimates come from similar pharmacies nearby.</p>${low?`<div class="rxwarn" style="margin-top:8px">${ico('alert')}Your wallet covers less than one day. <button class="link" data-act="pr-recharge">Recharge</button></div>`:''}`}
function adPreview(){const tag='<span class="sp-tag">SPONSORED</span>';let card='';
 if(PW.type==='doctor'){const d=S.doctors.find(x=>x.id===PW.ref);const sl=d.slots[dk(TODAY)];const fr=sl?sl.list.filter(s=>!s.bk&&!s.blk).length:0;card=`<div style="background:#fff;border-radius:14px;padding:11px;display:flex;gap:10px;box-shadow:0 4px 12px rgba(15,42,68,.08)"><span style="width:46px;height:46px;border-radius:12px;background:${gfor(d.name)};color:#fff;font-weight:800;display:grid;place-items:center;flex:none">${ini(d.name)}</span><div style="min-width:0;flex:1"><div style="display:flex;justify-content:space-between;gap:6px"><b style="font-size:12.5px">${esc(d.name)}</b>${tag}</div><div style="color:#C2410C;font-weight:700;font-size:11.5px">${esc(d.spec)} · ${esc(d.qual)}</div><div style="color:#5B6B7E;font-size:10.5px;margin-top:2px">At ${esc(S.store.name)} · ${fr} slots today</div><div style="text-align:right;margin-top:6px"><span style="background:#E0510F;color:#fff;border-radius:7px;padding:4px 10px;font-weight:800;font-size:11px">Book</span></div></div></div>`}
 else if(PW.type==='medicine'){const m=med(PW.ref);const b=S.batches.find(x=>x.med===m.id&&x.stock>0);card=`<div style="background:#fff;border-radius:14px;padding:11px;display:flex;gap:10px;box-shadow:0 4px 12px rgba(15,42,68,.08)"><span style="width:50px;height:50px;border-radius:12px;background:#F7F8FB;display:grid;place-items:center;flex:none"><span style="width:38px;height:38px;display:block">${D3('pill')}</span></span><div style="min-width:0;flex:1"><div style="display:flex;justify-content:space-between;gap:6px"><b style="font-size:12.5px">${esc(m.name)}</b>${tag}</div><div style="color:#5B6B7E;font-size:10.5px">${esc(m.pack)} · ${esc(m.mfr)}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><b>${b?inr(b.mrp):''}</b><span style="border:1.5px solid #E0510F;color:#C2410C;border-radius:7px;padding:3px 9px;font-weight:800;font-size:11px">+ Add</span></div></div></div>`}
 else card=`<div style="background:linear-gradient(125deg,#C2410C,#E0510F 55%,#F47A2E);border-radius:14px;padding:12px;color:#fff;display:flex;gap:10px;align-items:center"><span style="width:44px;height:44px;flex:none;display:block">${D3('hospital')}</span><div style="min-width:0;flex:1"><div style="display:flex;justify-content:space-between;gap:6px"><b style="font-size:12.5px">${esc(S.store.name)}</b><span class="sp-tag" style="color:#fff;border-color:rgba(255,255,255,.5)">SPONSORED</span></div><div style="font-size:11px;opacity:.92;margin-top:2px">${esc(PW.head.replace(S.store.name+' · ',''))}</div><div style="font-size:10.5px;opacity:.8;margin-top:4px">Within ${PW.radius} km · Order now</div></div></div>`;
 return `<div class="phone"><div style="display:flex;align-items:center;gap:6px;margin-bottom:8px"><img src="${LOGO}" alt="" style="width:20px;height:20px;border-radius:50%"><b style="font-size:12px">Seva<span style="color:#E0510F">Dharam</span></b></div><div style="background:#fff;border:1px solid #E4E8EF;border-radius:9px;padding:6px 9px;color:#8A97A8;font-size:11px;margin-bottom:10px">Search doctors, medicines…</div><div style="font-size:10.5px;font-weight:800;color:#5B6B7E;margin-bottom:6px">${esc(PW.place[0]||'')}</div>${card}<div style="background:#fff;border-radius:14px;height:56px;margin-top:8px;opacity:.55"></div><div style="background:#fff;border-radius:14px;height:56px;margin-top:8px;opacity:.35"></div></div>`}
function pwDraw(){const st=['What to promote','Audience & ad','Budget','Preview & launch'];let b='';
 if(PW.step===1){let opts='';
  if(PW.type==='doctor')opts=S.doctors.map(d=>{const ok=d.appr==='approved';return `<button class="cust-pick" style="text-align:left;${PW.ref===d.id?'border-color:var(--brand);background:var(--brand-tint)':''}" data-act="pw-ref" data-id="${d.id}" ${ok?'':'disabled'}>${who(d.name,d.qual+' · '+d.spec)}<span class="chip ${ok?'ok':'warn'}" style="margin-left:auto">${ok?'Consent on file':'Needs doctor approval'}</span></button>`}).join('');
  else if(PW.type==='medicine')opts=S.meds.map(m=>{const rx=m.sch!=='OTC',s=stockOf(m.id),ok=!rx&&s>0;return `<button class="cust-pick" style="text-align:left;${PW.ref===m.id?'border-color:var(--brand);background:var(--brand-tint)':''}" data-act="pw-ref" data-id="${m.id}" ${ok?'':'disabled'}><span style="width:30px;height:30px;flex:none;display:block" data-3="pill"></span><span style="min-width:0"><b style="font-size:13px">${esc(m.name)}</b><small class="muted" style="display:block">${esc(m.pack)} · Schedule ${m.sch}</small></span><span class="chip ${ok?'ok':rx?'sos':'warn'}" style="margin-left:auto">${rx?'Prescription · not allowed':s?s+' in stock':'Out of stock'}</span></button>`}).join('');
  else if(PW.type==='pharmacy')opts=[{id:'store',title:'Store visibility only',on:'Genuine medicines, home delivery'},...PR.offers.filter(o=>o.status==='Active')].map(o=>`<button class="cust-pick" style="text-align:left;${PW.ref===o.id?'border-color:var(--brand);background:var(--brand-tint)':''}" data-act="pw-ref" data-id="${o.id}"><span style="width:30px;height:30px;flex:none;display:block" data-3="${o.id==='store'?'hospital':'coin'}"></span><span><b style="font-size:13px">${esc(o.title)}</b><small class="muted" style="display:block">${o.id==='store'?'Show your store to patients nearby':'Offer · '+esc(o.on)}</small></span></button>`).join('');
  b=`<div class="g g3" style="gap:10px">${Object.entries(PT).map(([k,v])=>`<button class="pcard-t ${PW.type===k?'on':''}" data-act="pw-type" data-t="${k}"><span class="t3" data-3="${v[1]}"></span><b>${v[0]}</b><small class="muted">${v[3]}</small></button>`).join('')}</div>${PW.type?`<b style="display:block;margin:16px 0 8px">${{doctor:'Choose a doctor',pharmacy:'What should the ad highlight?',medicine:'Choose an OTC product'}[PW.type]}</b><div class="stack" style="gap:6px;max-height:260px;overflow:auto">${opts}</div>`:''}`}
 else if(PW.step===2)b=`<div class="fld"><label>Where should it appear in the SevaDharam patient app?</label><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">${PLACES[PW.type].map(p=>`<label class="cust-pick" style="padding:9px 12px;gap:8px;font-size:13px;font-weight:600"><input type="checkbox" data-pwp="${esc(p)}" ${PW.place.includes(p)?'checked':''}>${p}</label>`).join('')}</div></div>
  <div class="fld" style="margin-top:14px"><label>Show to patients within</label><div class="seg">${[2,5,10,20].map(r=>`<button class="${PW.radius===r?'on':''}" data-act="pw-rad" data-r="${r}">${r} km</button>`).join('')}</div></div>
  <div class="fld" style="margin-top:14px"><label for="pwHead">Ad text</label><input class="inp" id="pwHead" maxlength="90" value="${esc(PW.head)}"><small class="faint"><span id="pwLen">${PW.head.length}</span>/90 characters</small></div><div id="pwComp" style="margin-top:12px">${compHTML()}</div>`;
 else if(PW.step===3)b=`<div class="fld"><label for="pwR">Daily budget · <b id="pwD" style="color:var(--brand-ink);font-size:15px">${inr0(PW.daily)}</b> per day</label><input type="range" class="range" min="50" max="2000" step="50" value="${PW.daily}" id="pwR"><div class="row faint" style="justify-content:space-between;font-size:11.5px"><span>₹50</span><span>₹2,000</span></div></div>
  <div class="fld" style="margin-top:14px"><label>Run for</label><div class="seg">${[7,14,30].map(n=>`<button class="${PW.days===n?'on':''}" data-act="pw-days" data-n="${n}">${n} days</button>`).join('')}</div></div><div id="pwEst" style="margin-top:16px">${estHTML()}</div>`;
 else b=`<div class="g g2" style="align-items:start"><div>${adPreview()}<p class="faint c" style="font-size:11.5px;margin-top:8px">Preview in the patient app</p></div><div class="stack" style="gap:14px"><div class="kv"><span>Campaign</span><b>${PT[PW.type][0]}</b><span>Ad text</span><b>${esc(PW.head)}</b><span>Placements</span><b>${PW.place.join(', ')}</b><span>Radius</span><b>${PW.radius} km</b><span>Budget</span><b>${inr0(PW.daily)}/day · ${PW.days} days</b><span>Maximum spend</span><b>${inr0(PW.daily*PW.days)}</b></div><div><b style="font-size:13px;display:block;margin-bottom:8px">Compliance check</b>${compHTML()}</div></div></div>`;
 modal('Create ad campaign',`<div class="stepper" style="padding:10px 14px">${st.map((s,i)=>`<div class="step ${i+1<PW.step?'done':i+1===PW.step?'on':''}"><span class="cc">${i+1<PW.step?'✓':i+1}</span>${s}</div>${i<3?`<span class="sline ${i+1<PW.step?'done':''}"></span>`:''}`).join('')}</div>${b}`,
  `<button class="btn btn-o" data-act="mclose">Cancel</button>${PW.step>1?`<button class="btn btn-o" data-act="pw-back">${ico('left')}Back</button>`:''}${PW.step<4?'<button class="btn btn-p" data-act="pw-next">Next →</button>':`<button class="btn btn-p shine" data-act="pw-launch">${ico('send')}Launch campaign</button>`}`,{wide:1,icon:'mega'})}
function rechargeModal(){const fromPw=!!$('#pwEst');modal('Recharge ad wallet',`<p class="muted" style="font-size:13px">Current balance <b style="color:var(--fg)">${inr0(PR.wallet)}</b></p><div class="seg" style="margin-top:12px" id="rcSeg">${[500,1000,2000,5000].map((v,i)=>`<button class="${i===1?'on':''}" data-rc="${v}">${inr0(v)}</button>`).join('')}</div><div class="fld" style="margin-top:12px"><label for="rcA">Amount (₹)</label><input class="inp" id="rcA" type="number" min="100" value="1000"></div><p class="faint" style="font-size:12px;margin-top:8px">Paid by UPI. Recharges are recorded as an expense in your ledger.</p>`,`<button class="btn btn-o" data-act="${fromPw?'pw-resume':'mclose'}">Cancel</button><button class="btn btn-p" id="rcGo">Pay by UPI</button>`,{icon:'coin'});
 $('#rcSeg').onclick=e=>{const b=e.target.closest('[data-rc]');if(!b)return;$$('#rcSeg button').forEach(x=>x.classList.toggle('on',x===b));$('#rcA').value=b.dataset.rc};
 $('#rcGo').onclick=()=>{const v=+$('#rcA').value;if(!(v>=100)){toast('Minimum recharge is ₹100',1);return}PR.wallet+=v;S.ledger.unshift({d:new Date(),type:'Expense',head:'SevaDharam Ads wallet recharge',amt:v,mode:'UPI'});render();toast(inr0(v)+' added to ad wallet');if(fromPw)pwDraw();else mclose()}}

PG.promotions=()=>{const tabs=[['overview','Overview'],['campaigns','Ad campaigns'],['offers','Offers & deals'],['events','Sale events']];let body='';
 const roi=c=>c.spend?(c.rev/c.spend).toFixed(1)+'×':'—';const SC={Live:'ok','In review':'info',Paused:'warn',Ended:'mut'};
 const row=c=>`<tr><td style="max-width:340px"><div class="who-cell"><span style="width:34px;height:34px;flex:none;display:block" data-3="${PT[c.type][1]}"></span><div style="min-width:0"><b style="font-size:13px">${esc(ht(c.head))}</b><small class="muted" style="display:block">${c.id} · ${PT[c.type][0]} · ${c.place.length} placement${c.place.length>1?'s':''} · ${c.radius} km</small></div></div></td><td class="num">${inr0(c.daily)}</td><td class="num">${inr0(c.spend)}</td><td class="num">${c.views.toLocaleString('en-IN')}</td><td class="num">${c.clicks.toLocaleString('en-IN')}<small class="faint" style="display:block">${c.views?(c.clicks/c.views*100).toFixed(1):'0.0'}% CTR</small></td><td class="num">${c.conv}</td><td class="num"><b style="color:${c.spend&&c.rev/c.spend>=3?'var(--leaf)':'inherit'}">${roi(c)}</b></td><td><span class="chip ${SC[c.status]} dot">${c.status}</span></td><td class="r nowrap">${c.status==='Live'||c.status==='Paused'?`<button class="btn btn-o btn-sm" data-act="pr-pause" data-id="${c.id}">${c.status==='Live'?ico('pause')+'Pause':'Resume'}</button> <button class="btn btn-o btn-sm" data-act="pr-budget" data-id="${c.id}">Budget</button> `:''}<button class="btn btn-g btn-sm" data-act="pr-report" data-id="${c.id}">Report</button></td></tr>`;
 const thead='<thead><tr><th>Campaign</th><th class="num">Budget/day</th><th class="num">Spent</th><th class="num">Views</th><th class="num">Clicks</th><th class="num">Bookings / orders</th><th class="num">ROI</th><th>Status</th><th class="r"></th></tr></thead>';
 if(PR.tab==='overview'){const T=k=>PR.camps.reduce((a,c)=>a+c[k],0);const sp=T('spend'),vw=T('views'),ck=T('clicks'),cv=T('conv'),rv=T('rev');
  const daily=D14.map((d,i)=>PR.camps.reduce((a,c)=>a+c.series[i],0));
  const td=dk(TODAY);const dr=S.doctors.filter(d=>d.appr==='approved').map(d=>({d,free:d.slots[td]?d.slots[td].list.filter(s=>!s.bk&&!s.blk).length:0})).sort((a,b)=>b.free-a.free)[0];
  const eb=S.batches.filter(b=>med(b.med).sch==='OTC'&&b.stock>0&&days(b.exp,TODAY)>=0&&days(b.exp,TODAY)<=120).sort((a,b)=>a.exp-b.exp)[0];const ev=PR.events.find(e=>!e.joined);
  const st=(i,l,v,d)=>`<div class="stat"><span class="s3" data-3="${i}"></span><span class="l">${l}</span><span class="v">${v}</span><span class="d muted">${d}</span></div>`;
  body=`<div class="stats">${st('coin','Ad wallet',inr0(PR.wallet),'<button class="link" data-act="pr-recharge">Recharge →</button>')}${st('mega','Ad spend · 30 days',inr0(sp),PR.camps.filter(c=>c.status==='Live').length+' campaigns live')}${st('magnifier','Views',vw.toLocaleString('en-IN'),'Patients who saw your ads')}${st('bolt','Clicks',ck.toLocaleString('en-IN'),(ck/vw*100).toFixed(1)+'% click-through')}${st('calendar','Bookings & orders',cv,'Came from ads')}${st('chart','Return on ad spend',(rv/sp).toFixed(1)+'×',inr0(rv)+' earned from ads')}</div>
  <div class="g g-main"><div class="stack"><div class="panel">${pnh('Ad clicks · last 14 days','chart')}${barChart(daily,D14.map(d=>String(d.getDate())),170,'var(--brand)',v=>v)}</div>
  <div class="panel">${pnh('Running campaigns','mega','<button class="link" data-act="pr-tab" data-t="campaigns">All campaigns →</button>')}<div class="tw"><table class="t">${thead}<tbody>${PR.camps.filter(c=>c.status!=='Ended').map(row).join('')}</tbody></table></div></div></div>
  <div class="stack"><div class="panel">${pnh('Recommended for you','bolt')}<div class="stack" style="gap:10px">
   ${dr?`<div class="reco"><span class="r3" data-3="doc"></span><div style="flex:1;min-width:0"><b style="font-size:13px">${esc(dr.d.name)} has ${dr.free} open slots today</b><small class="muted" style="display:block">Promote to fill them · about 8–12 more bookings a week</small></div><button class="btn btn-p btn-sm" data-act="pr-new" data-type="doctor" data-ref="${dr.d.id}">Promote</button></div>`:''}
   ${eb?`<div class="reco"><span class="r3" data-3="pill"></span><div style="flex:1;min-width:0"><b style="font-size:13px">${esc(med(eb.med).name)}: ${eb.stock} units expire ${fexp(eb.exp)}</b><small class="muted" style="display:block">Boost it in medicine search before it expires</small></div><button class="btn btn-p btn-sm" data-act="pr-new" data-type="medicine" data-ref="${eb.med}">Boost</button></div>`:''}
   ${ev?`<div class="reco"><span class="r3" data-3="mega"></span><div style="flex:1;min-width:0"><b style="font-size:13px">${esc(ev.name)} · ${ev.dates}</b><small class="muted" style="display:block">${esc(ev.perk)}</small></div><button class="btn btn-o btn-sm" data-act="pr-tab" data-t="events">View</button></div>`:''}
  </div></div>
  <div class="panel">${pnh('How it works','clipboard')}<div class="tl"><div class="tl-i"><b style="font-size:13px">Pick what to promote</b><p class="muted" style="font-size:12px">A partnered doctor, your pharmacy, or an OTC product</p></div><div class="tl-i"><b style="font-size:13px">Set a daily budget</b><p class="muted" style="font-size:12px">Start from ₹50 a day from your ad wallet</p></div><div class="tl-i"><b style="font-size:13px">Pay only for clicks</b><p class="muted" style="font-size:12px">Ads show in the SevaDharam app to patients nearby</p></div><div class="tl-i" style="padding-bottom:0"><b style="font-size:13px">Track bookings & ROI</b><p class="muted" style="font-size:12px">Pause or change budget anytime</p></div></div></div></div></div>`}
 else if(PR.tab==='campaigns'){const list=PR.camps.filter(c=>PR.flt==='All'||c.status===PR.flt);
  body=`<div class="row" style="justify-content:space-between;margin-bottom:12px"><div class="seg">${['All','Live','In review','Paused','Ended'].map(f=>`<button class="${PR.flt===f?'on':''}" data-act="pr-flt" data-f="${f}">${f} <span class="faint">${f==='All'?PR.camps.length:PR.camps.filter(c=>c.status===f).length}</span></button>`).join('')}</div></div>
  <div class="panel"><div class="tw"><table class="t">${thead}<tbody>${list.map(row).join('')||'<tr><td colspan="9" class="empty">No campaigns here.</td></tr>'}</tbody></table></div></div>`}
 else if(PR.tab==='offers'){body=`<div class="banner">${ico('alert')}Offers apply to OTC products and devices. Prescription medicines are left out of advertised offers.</div>
  <div class="panel">${pnh('Offers & deals','coin',`<button class="btn btn-p btn-sm" data-act="pr-offer">${ico('plus')}Create offer</button>`)}<div class="tw"><table class="t"><thead><tr><th>Offer</th><th>Type</th><th>Applies to</th><th class="num">Min order</th><th>Valid till</th><th class="num">Used</th><th>Status</th><th class="r"></th></tr></thead><tbody>
  ${PR.offers.map(o=>`<tr><td><b>${esc(o.title)}</b><small class="faint" style="display:block">${o.id}</small></td><td>${o.type}${o.val?` · ${o.type==='Percent off'?o.val+'%':inr0(o.val)}`:''}</td><td>${esc(o.on)}</td><td class="num">${o.min?inr0(o.min):'—'}</td><td>${fd(o.till)}</td><td class="num">${o.uses}</td><td><span class="chip ${o.status==='Active'?'ok':o.status==='Paused'?'warn':'mut'} dot">${o.status}</span></td><td class="r nowrap">${o.status!=='Expired'?`<button class="btn btn-o btn-sm" data-act="pr-otog" data-id="${o.id}">${o.status==='Active'?'Pause':'Activate'}</button> <button class="btn btn-g btn-sm" data-act="pr-new" data-type="pharmacy" data-ref="${o.id}">Advertise</button>`:''}</td></tr>`).join('')}</tbody></table></div></div>`}
 else{body=`<p class="muted" style="font-size:13px;margin-bottom:14px">Platform-wide sale events run by SevaDharam. Join an event and meet its requirement to get extra visibility in the patient app.</p><div class="g g3">${PR.events.map(ev=>`<div class="evt shine" style="background:${ev.g}"><span class="chip" style="background:rgba(255,255,255,.2);color:#fff;align-self:flex-start">${ev.dates}</span><h3 style="font-size:18px;font-weight:800">${ev.name}</h3><div style="font-size:12.5px;opacity:.92"><b>Requirement:</b> ${esc(ev.req)}</div><div style="font-size:12.5px;opacity:.92"><b>You get:</b> ${esc(ev.perk)}</div><div class="row" style="margin-top:6px">${ev.joined?'<span class="chip" style="background:#fff;color:#1E6A10">✓ Joined</span>':''}<button class="btn btn-sm" style="background:#fff;color:#0F2A44;margin-left:auto" data-act="pr-event" data-id="${ev.id}">${ev.joined?'Leave event':'Join event'}</button></div></div>`).join('')}</div>`}
 return `<div class="page">${ph('Promotions','Promotions & Ads','Promote your partnered doctors, your pharmacy and OTC products in the SevaDharam patient app. You pay only for clicks.',`<span class="chip mut">${ico('rupee','width:14px;height:14px')}Wallet ${inr0(PR.wallet)}</span><button class="btn btn-o" data-act="pr-recharge">Recharge</button><button class="btn btn-p shine" data-act="pr-new">${ico('plus')}Create campaign</button>`)}<div class="tabs">${tabs.map(([k,l])=>`<button class="${PR.tab===k?'on':''}" data-act="pr-tab" data-t="${k}">${l}</button>`).join('')}</div>${body}</div>`};

/* ----- actions & inputs for the new modules ----- */
const MODA={
 'att-unlock'(){attUnlock()},
 'att-lock'(){AU.on=false;render();toast('Attendance locked')},
 'att-tab'(t){ATAB=t.dataset.t;render()},
 'att-shift'(t){const d=+t.dataset.d;if(d===0)AD=dk(TODAY);else{const n=addD(d,new Date(AD+'T00:00'));if(n<=TODAY)AD=dk(n)}render()},
 'att-day'(t){AD=t.dataset.k;ATAB='day';render()},
 'att-mon'(t){AM=Math.min(0,AM+ +t.dataset.m);render()},
 'att-mark'(t){const id=t.dataset.e,v=t.dataset.v;const r=ATT[ak(id,AD)]=ATT[ak(id,AD)]||{};const e=S.staff.find(x=>x.id===id);const dtl=fd(new Date(AD+'T00:00'));
  if(r.adm===v){r.adm=null;r.admAt=null;ALOG.push({t:new Date(),who:e.name,txt:'Admin mark cleared for '+dtl,src:'admin'})}else{r.adm=v;r.admAt=new Date();ALOG.push({t:new Date(),who:e.name,txt:'Marked '+{P:'Present',H:'Half day',L:'Leave',A:'Absent'}[v]+' for '+dtl,src:'admin'})}
  syncMark(id,AD);render();const s=attSt(e,AD);toast(e.name.split(' ')[0]+' · '+(s[0]||'cleared'),s[2]==='sos')},
 'att-confirm-all'(){let n=0;S.staff.forEach(e=>{const r=ATT[ak(e.id,AD)];if(r&&r.bin&&!r.adm){r.adm='P';r.admAt=new Date();n++;syncMark(e.id,AD);ALOG.push({t:new Date(),who:e.name,txt:'Marked Present for '+fd(new Date(AD+'T00:00')),src:'admin'})}});render();toast(n+' staff marked present · attendance confirmed')},
 'att-scan'(t){scanModal(t.dataset.e)},
 'att-enroll'(t){enrollModal(t.dataset.e)},
 'bio-start'(){BIO.scan=true;BIO.msg=null;render();setTimeout(()=>{const res=bioPunch(BIO.emp);BIO.scan=false;BIO.msg=bioMsg(res);if(CUR==='attendance'&&AU.on)render()},1700)},
 'pr-tab'(t){PR.tab=t.dataset.t;render()},
 'pr-flt'(t){PR.flt=t.dataset.f;render()},
 'pr-new'(t){pwOpen(t.dataset.type,t.dataset.ref)},
 'pw-type'(t){PW.type=t.dataset.t;PW.ref=null;PW.head='';PW.place=PLACES[PW.type].slice(0,2);pwDraw()},
 'pw-ref'(t){pwPick(PW.type,t.dataset.id);pwDraw()},
 'pw-rad'(t){PW.radius=+t.dataset.r;pwDraw()},
 'pw-days'(t){PW.days=+t.dataset.n;pwDraw()},
 'pw-resume'(){pwDraw()},
 'pw-back'(){PW.step--;pwDraw()},
 'pw-next'(){if(PW.step===1&&!(PW.type&&PW.ref)){toast(PW.type?'Pick one option from the list':'Choose what to promote',1);return}if(PW.step===2&&comp().some(c=>!c[0])){toast('Fix the items marked in red first',1);return}PW.step++;pwDraw()},
 'pw-launch'(){if(comp().some(c=>!c[0])){toast('Fix the compliance items first',1);return}if(PR.wallet<PW.daily){toast('Recharge your ad wallet to cover at least one day',1);rechargeModal();return}
  const c={id:'AD-'+(PR.n++),type:PW.type,ref:PW.ref,head:PW.head,place:PW.place.slice(),radius:PW.radius,daily:PW.daily,start:new Date(TODAY),end:addD(PW.days),status:'In review',views:0,clicks:0,conv:0,rev:0,spend:0,series:D14.map(()=>0)};PR.camps.unshift(c);PW=null;PR.tab='campaigns';PR.flt='All';mclose();go('promotions');toast(c.id+' submitted · review takes a few minutes');
  setTimeout(()=>{c.status='Live';if(CUR==='promotions')render();toast(c.id+' is now live in the patient app')},6000)},
 'pr-pause'(t){const c=PR.camps.find(x=>x.id===t.dataset.id);c.status=c.status==='Live'?'Paused':'Live';render();toast(c.id+(c.status==='Live'?' resumed':' paused'))},
 'pr-budget'(t){const c=PR.camps.find(x=>x.id===t.dataset.id);modal('Daily budget · '+c.id,`<div class="fld"><label for="bdA">Daily budget (₹)</label><input class="inp" id="bdA" type="number" min="50" step="50" value="${c.daily}"></div><p class="faint" style="font-size:12px;margin-top:8px">Changes apply from the next hour.</p>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="bdGo">Save</button>`,{icon:'coin'});$('#bdGo').onclick=()=>{const v=+$('#bdA').value;if(!(v>=50)){toast('Minimum daily budget is ₹50',1);return}c.daily=v;mclose();render();toast('Daily budget set to '+inr0(v))}},
 'pr-report'(t){const c=PR.camps.find(x=>x.id===t.dataset.id);modal('Campaign report · '+c.id,`<div class="row" style="gap:12px;flex-wrap:nowrap;margin-bottom:12px"><span style="width:40px;height:40px;flex:none;display:block" data-3="${PT[c.type][1]}"></span><div style="min-width:0"><b>${esc(ht(c.head))}</b><small class="muted" style="display:block">${PT[c.type][0]} · ${fd(c.start)} – ${fd(c.end)} · ${c.radius} km</small></div></div><div class="g g4" style="gap:10px">${[['Views',c.views.toLocaleString('en-IN')],['Clicks',c.clicks.toLocaleString('en-IN')],[PT[c.type][2],c.conv],['Spent',inr0(c.spend)],['Earned',inr0(c.rev)],['ROI',c.spend?(c.rev/c.spend).toFixed(1)+'×':'—'],['Cost per click',c.clicks?inr(c.spend/c.clicks):'—'],['Budget/day',inr0(c.daily)]].map(([l,v])=>`<div class="panel" style="padding:12px"><small class="muted" style="font-size:11.5px">${l}</small><div style="font-size:17px;font-weight:800">${v}</div></div>`).join('')}</div><b style="font-size:13px;display:block;margin-top:14px">Clicks · last 14 days</b>${barChart(c.series,D14.map(d=>String(d.getDate())),140,'var(--brand)',v=>v)}<div class="row" style="gap:6px;margin-top:8px">${c.place.map(p=>`<span class="chip mut">${p}</span>`).join('')}</div>`,`${c.status==='Live'||c.status==='Paused'?`<button class="btn btn-x" id="endC">End campaign</button>`:''}<button class="btn btn-p" data-act="mclose">Close</button>`,{wide:1,icon:'mega'});const eb=$('#endC');if(eb)eb.onclick=()=>{c.status='Ended';c.end=new Date();mclose();render();toast(c.id+' ended · unused budget stays in your wallet')}},
 'pr-recharge'(){rechargeModal()},
 'pr-otog'(t){const o=PR.offers.find(x=>x.id===t.dataset.id);o.status=o.status==='Active'?'Paused':'Active';render();toast(o.title+' · '+o.status)},
 'pr-offer'(){formModal('Create offer','coin',[['Offer title','title','wide',null,'15% off on immunity boosters'],['Offer type','type','text',['Percent off','Flat ₹ off','Free delivery','Free health check']],['Value (% or ₹, 0 if none)','val','number',null,'15'],['Minimum order (₹)','min','number',null,'299'],['Applies to','on','text',['All OTC & devices','Diabetes care','Vitamins & supplements','Pain relief','Devices']],['Valid till','till','date',null,dk(addD(14))]],'Create offer',v=>{if(BAN.test(v.title)){toast('Remove claims like "best" or "guaranteed" from the title',1);return false}if(new Date(v.till+'T00:00')<TODAY){toast('Pick a date from today onwards',1);return false}PR.offers.unshift({id:'OF-'+(22+PR.offers.length),title:v.title,type:v.type,val:+v.val||0,min:+v.min||0,on:v.on,till:new Date(v.till+'T00:00'),uses:0,status:'Active'});PR.tab='offers';render();toast('Offer is live for patients')})},
 'pr-event'(t){const ev=PR.events.find(x=>x.id===t.dataset.id);if(ev.joined){ev.joined=false;render();toast('Left '+ev.name);return}
  modal('Join '+ev.name,`<div class="kv"><span>Dates</span><b>${ev.dates}</b><span>Requirement</span><b>${esc(ev.req)}</b><span>You get</span><b>${esc(ev.perk)}</b></div><label class="row" style="gap:8px;margin-top:14px;font-size:13px;font-weight:600;flex-wrap:nowrap"><input type="checkbox" id="evOk">I'll keep the required offer live for the whole event</label>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="evGo">Join event</button>`,{icon:'mega'});$('#evGo').onclick=()=>{if(!$('#evOk').checked){toast('Confirm the requirement to join',1);return}ev.joined=true;mclose();render();toast('Joined '+ev.name)}},
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t||!MODA[t.dataset.act])return;const r=t.querySelector('[data-3]');if(r)boing(r);MODA[t.dataset.act](t)});
document.addEventListener('input',e=>{const t=e.target;
 for(const k of ['lotp','apin']){if(t.dataset[k]!==undefined){t.value=t.value.replace(/\D/g,'').slice(-1);if(t.value){const n=$(`[data-${k}="${+t.dataset[k]+1}"]`);if(n)n.focus();else if(k==='apin')attUnlock();else $('#loginForm').requestSubmit()}}}
 if(t.id==='pwHead'&&PW){PW.head=t.value;$('#pwLen').textContent=t.value.length;$('#pwComp').innerHTML=compHTML()}
 if(t.id==='pwR'&&PW){PW.daily=+t.value;$('#pwD').textContent=inr0(PW.daily);$('#pwEst').innerHTML=estHTML()}});
document.addEventListener('change',e=>{const t=e.target;
 if(t.dataset.pwp!==undefined&&PW){PW.place=$$('[data-pwp]:checked').map(x=>x.dataset.pwp);const c=$('#pwComp');if(c)c.innerHTML=compHTML()}
 if(t.id==='adate'&&t.value){if(new Date(t.value+'T00:00')>TODAY){toast("Attendance can't be marked for a future date",1);render();return}AD=t.value;render()}
 if(t.id==='bioEmp'){BIO.emp=t.value;BIO.msg=null}});
document.addEventListener('keydown',e=>{const t=e.target;if(!t.dataset)return;for(const k of ['lotp','apin']){if(t.dataset[k]!==undefined){if(e.key==='Backspace'&&!t.value)$(`[data-${k}="${+t.dataset[k]-1}"]`)?.focus();if(e.key==='Enter'&&k==='apin'){e.preventDefault();attUnlock()}}}});

/* ----- pharmacy login (name, registration, GSTIN, owner mobile, OTP) ----- */
const GST_RE=/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const STATES={'01':'Jammu & Kashmir','03':'Punjab','06':'Haryana','07':'Delhi','08':'Rajasthan','09':'Uttar Pradesh','10':'Bihar','18':'Assam','19':'West Bengal','20':'Jharkhand','21':'Odisha','22':'Chhattisgarh','23':'Madhya Pradesh','24':'Gujarat','27':'Maharashtra','29':'Karnataka','32':'Kerala','33':'Tamil Nadu','36':'Telangana','37':'Andhra Pradesh'};
const LG={sent:false,t:0,iv:null};
function gstHint(){const el=$('#lgGst');if(!el)return false;const v=el.value.toUpperCase().replace(/\s/g,'');if(el.value!==v)el.value=v;const h=$('#lgGstHint');if(!h)return false;
 if(!v){h.textContent='15-character GSTIN, e.g. 19ABCDE1234F1Z5';h.style.color='';return false}
 if(GST_RE.test(v)){h.textContent='✓ Valid GSTIN format · '+(STATES[v.slice(0,2)]||'state code '+v.slice(0,2));h.style.color='var(--leaf)';return true}
 h.textContent=v.length<15?`${15-v.length} more character${15-v.length>1?'s':''} needed`:'This GSTIN format looks wrong';h.style.color='var(--sos)';return false}
function lgCheck(){if(!$('#lgName')||!$('#lgReg')||!$('#lgMob')||!$('#lgGst'))return null;const n=$('#lgName').value.trim(),r=$('#lgReg').value.trim(),m=$('#lgMob').value.replace(/\D/g,'');
 if(n.length<3){toast('Enter the pharmacy name',1);$('#lgName').focus();return null}
 if(r.length<5){toast('Enter the pharmacy registration number',1);$('#lgReg').focus();return null}
 if(!gstHint()){toast('Enter a valid 15-character GSTIN',1);$('#lgGst').focus();return null}
 if(!/^[6-9]\d{9}$/.test(m)){toast("Enter the owner's 10-digit mobile number",1);$('#lgMob').focus();return null}
 return{n,r,g:$('#lgGst').value,m}}
function lgReset(){LG.sent=false;clearInterval(LG.iv);if($('#lgOtpWrap'))$('#lgOtpWrap').hidden=true;if($('#lgGo'))$('#lgGo').textContent='Send OTP';$$('[data-lotp]').forEach(i=>i.value='')}
function lgSend(){const v=lgCheck();if(!v)return;LG.sent=true;LG.t=30;if($('#lgOtpWrap'))$('#lgOtpWrap').hidden=false;if($('#lgGo'))$('#lgGo').textContent='Verify OTP & login';$$('[data-lotp]').forEach(i=>i.value='');$('[data-lotp="0"]')?.focus();toast('OTP sent to +91 '+v.m.replace(/(\d{5})(\d{5})/,'$1 $2'));
 clearInterval(LG.iv);const tick=()=>{if($('#lgOtpT'))$('#lgOtpT').innerHTML=LG.t?`Resend OTP in ${LG.t}s`:'<button type="button" class="link" data-act="lg-resend">Resend OTP</button>';if(!LG.t)clearInterval(LG.iv);LG.t=Math.max(0,LG.t-1)};tick();LG.iv=setInterval(tick,1000)}
MODA['lg-resend']=()=>lgSend();
if ($('#lgGst')) { $('#lgGst').addEventListener('input',gstHint); gstHint(); }
['lgName','lgReg','lgGst','lgMob'].forEach(id=>{ const el=$('#'+id); if(el) el.addEventListener('input',()=>{if(LG.sent)lgReset()}); });
const lgForm = $('#loginForm');
if (lgForm) {
  lgForm.addEventListener('submit',e=>{e.preventDefault();if(ROLE==='doctor'){docSubmit();return}if(!LG.sent){lgSend();return}const v=lgCheck();if(!v)return;const otp=$$('[data-lotp]').map(i=>i.value).join('');if(otp.length<6){toast('Enter the 6-digit OTP',1);return}
   Object.assign(S.store,{name:v.n,dl:v.r,gstin:v.g,ownerMob:'+91 '+v.m.replace(/(\d{5})(\d{5})/,'$1 $2'),state:STATES[v.g.slice(0,2)]||S.store.state});if($('#stName'))$('#stName').textContent=v.n;lgReset();
   if($('#login'))$('#login').hidden=true;if(PHONE.on)pShow();else go(location.hash.slice(1)||'dashboard');toast('Welcome, '+v.n)});
}


/* ================= DESKTOP ⇄ PHONE SYNC (shared artifact database) ================= */
const SYNC={db:null,assets:null,ok:false,scans:[],local:[],q:Promise.resolve(),first:true,last:null};
const ago=iso=>{const m=Math.round((Date.now()-new Date(iso))/6e4);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':fd(new Date(iso))};
const scanUrl=s=>s.pages&&s.pages[0]?(s.local?s.pages[0]:'/_blob/'+s.pages[0]):'';
const allScans=()=>[...SYNC.local,...SYNC.scans].sort((a,b)=>a.at<b.at?1:-1);
const SST={sent:['New','warn'],opened:['Opened','info'],processed:['Saved','ok']};
function phBadge(){const n=allScans().filter(s=>s.status==='sent').length;const d=$('#phdot');if(d){d.textContent=n;d.hidden=!n}}
function markScan(id,status){const s=allScans().find(x=>x.id===id);if(!s||s.status===status)return;s.status=status;if(SYNC.db&&!s.local)SYNC.db.doc('scans/'+id).update({status,[status+'At']:new Date().toISOString()}).catch(()=>{});phBadge()}
function attSync(key,field,id,val){if(!SYNC.db)return;SYNC.q=SYNC.q.then(async()=>{const ref=SYNC.db.doc('att/'+key);try{const s=await ref.get();const body={[field]:{[id]:val}};if(s.exists)await ref.update(body);else await ref.set(body)}catch(e){}})}
function syncPunch(id,via){const r=ATT[ak(id,dk(TODAY))];if(r&&r.bin)attSync(dk(TODAY),'punches',id,{in:r.bin.toISOString(),out:r.bout?r.bout.toISOString():null,via})}
function syncMark(id,key){const r=ATT[ak(id,key)]||{};attSync(key,'marks',id,{adm:r.adm||null,at:r.admAt?new Date(r.admAt).toISOString():null})}
function applyAtt(key,d){let ch=false;const P=d.punches||{},M=d.marks||{};
 Object.entries(P).forEach(([id,p])=>{const e=S.staff.find(x=>x.id===id);if(!e||!p)return;const r=ATT[ak(id,key)]=ATT[ak(id,key)]||{adm:null};const ph=p.via==='Phone';
  if(p.in&&(!r.bin||r.bin.toISOString()!==p.in)){const nw=!r.bin;r.bin=new Date(p.in);ch=true;if(nw&&ph)ALOG.push({t:new Date(p.in),who:e.name,txt:'Biometric punch in · phone scanner',src:'bio'})}
  if(p.out&&(!r.bout||r.bout.toISOString()!==p.out)){const nw=!r.bout;r.bout=new Date(p.out);ch=true;if(nw&&ph)ALOG.push({t:new Date(p.out),who:e.name,txt:'Biometric punch out · phone scanner',src:'bio'})}});
 Object.entries(M).forEach(([id,m])=>{if(!m)return;const r=ATT[ak(id,key)]=ATT[ak(id,key)]||{};if((r.adm||null)!==(m.adm||null)){r.adm=m.adm||null;r.admAt=m.at?new Date(m.at):null;ch=true}});
 if(ch){if(PHONE.on)prender();else if(CUR==='attendance'&&AU.on)render();else renderNav(CUR)}}
function syncInit(){if(!(window.claude&&window.claude.use))return;
 window.claude.use('assets').then(a=>{SYNC.assets=a||null}).catch(()=>{});
 window.claude.use('db').then(db=>{if(!db)return;SYNC.db=db;SYNC.ok=true;
  try{db.collection('scans').orderBy('at','desc').limit(40).onSnapshot(s=>{SYNC.last=new Date();const prev=new Set(SYNC.scans.map(x=>x.id));SYNC.scans=s.docs.map(d=>({id:d.id,...d.data()}));
   if(!SYNC.first&&!PHONE.on)s.docChanges().forEach(c=>{if(c.type==='added'&&!prev.has(c.doc.id)){const d=c.doc.data();if(d.status==='sent')toast('New '+(d.kind==='rx'?'prescription':'purchase bill')+' scan from phone')}});
   SYNC.first=false;phBadge();if(PHONE.on)prender();else{if($('#phInbox'))inboxDraw();if(CUR==='prescription')render()}},()=>{})}catch(e){}
  try{db.doc('att/'+dk(TODAY)).onSnapshot(s=>applyAtt(dk(TODAY),s.exists?s.data():{}),()=>{})}catch(e){}
  if(PHONE.on)prender()}).catch(()=>{})}

/* ----- desktop: phone inbox ----- */
function inboxDraw(){const L=allScans();
 drawer(`<div class="dr-h"><span style="width:44px;height:44px;display:block;flex:none" data-3="phone"></span><div><b style="font-size:16px">Scans from phone</b><small class="muted" style="display:block">${SYNC.ok?'Live · arrives the moment the phone sends':'Preview · live sync works on the published link'}</small></div><button class="icon-btn" style="margin-left:auto" data-act="dclose" aria-label="Close">${ico('x')}</button></div>
 <div class="dr-b" id="phInbox">${L.length?L.map(s=>`<div class="inb"><img src="${scanUrl(s)}" alt="Scanned ${s.kind==='rx'?'prescription':'bill'}" loading="lazy"><div style="flex:1;min-width:0"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="chip ${s.kind==='rx'?'br':'info'}">${s.kind==='rx'?'Prescription':'Purchase bill'}</span><small class="faint">${ago(s.at)}</small></div><b style="display:block;font-size:13.5px;margin-top:6px">${s.kind==='rx'?(esc(s.patient)||'Patient not named'):(esc(s.supplier)||'Supplier not set')}</b><small class="muted">${s.pages.length} page${s.pages.length>1?'s':''} · ${esc(s.device||'Phone')}${s.mob?' · +91 '+esc(s.mob):''}${s.inv?' · Inv '+esc(s.inv):''}</small><div class="row" style="margin-top:10px;justify-content:space-between"><span class="chip ${SST[s.status]?.[1]||'mut'} dot">${SST[s.status]?.[0]||s.status}</span><button class="btn ${s.status==='sent'?'btn-p':'btn-o'} btn-sm" data-act="ph-open" data-id="${s.id}">${s.kind==='rx'?'Open in analyzer':'Review bill'}</button></div></div></div>`).join('')
 :`<div class="empty"><span style="width:96px;height:96px;display:block;margin:0 auto 12px" data-3="phone"></span><b style="color:var(--fg);font-size:15px">No scans yet</b><p style="margin:6px auto 14px;max-width:34ch">Open this same link on your phone. It opens as the SevaDharam pharmacy app, and every prescription or bill you scan there appears here.</p><button class="btn btn-o" data-act="ph-phone">${ico('phone')}Preview the phone app here</button></div>`}
 <div class="banner" style="margin-top:14px">${ico('alert')}Fingerprint punches from the phone go straight into Staff Attendance.</div></div>`)}
function phRxBanner(){const w=allScans().filter(s=>s.kind==='rx'&&s.status==='sent');if(!w.length)return '';return `<div class="banner" style="background:var(--brand-tint);color:var(--brand-ink);justify-content:space-between;flex-wrap:wrap"><span class="row" style="gap:8px">${ico('phone')}<b>${w.length} prescription${w.length>1?'s':''} waiting from the phone</b>${w[0].patient?' · '+esc(w[0].patient):''}</span><button class="btn btn-p btn-sm" data-act="ph-open" data-id="${w[0].id}">Open latest</button></div>`}
Object.assign(MODA,{
 'ph-inbox'(){inboxDraw()},
 'ph-phone'(){dclose();location.hash='phone'},
 'ph-open'(t){const s=allScans().find(x=>x.id===t.dataset.id);if(!s)return;dclose();mclose();const url=scanUrl(s);
  if(s.kind==='rx'){RX={step:1,img:null,analyzed:false,data:null,otpSent:false,verified:false,timer:0};go('prescription');setTimeout(()=>{RX.src=s.id;RX.pre={pat:s.patient||'',mob:s.mob||''};startScan(url)},60)}
  else{go('inventory');setTimeout(()=>{sbScan(url);SB.src=s.id},60)}
  if(s.status==='sent')markScan(s.id,'opened')},
});

/* ================= PHONE APP ================= */
const PHONE={on:false,tab:'home',sub:null,q:'',sheet:false,jump:false};let CAM=null;const BIOP={open:false,emp:null,res:''};
function paintView(){$$('#viewSeg button').forEach(x=>x.classList.toggle('on',(x.dataset.view==='phone')===PHONE.on))}
function wantPhone(){if(location.hash==='#phone')return true;let p=null;try{p=localStorage.getItem('sd-view')}catch(_){}if(p)return p==='phone';return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||(matchMedia('(pointer:coarse)').matches&&innerWidth<1000)}
function enterPhone(){PHONE.on=true;document.body.classList.add('phone');try{localStorage.setItem('sd-view','phone')}catch(_){}paintView();if($('#login')&&$('#login').hidden)pShow()}
function pShow(){if($('#papp'))$('#papp').hidden=false;prender()}
function pHide(){if($('#papp'))$('#papp').hidden=true}
function exitPhone(){PHONE.on=false;try{localStorage.setItem('sd-view','desktop')}catch(_){}setTimeout(paintView);document.body.classList.remove('phone');pHide();CAM=null;BIOP.open=false}
const SCN=[['rx','Prescription scanner','Snap a prescription. It opens in the desktop Prescription Analyzer.','clipboard','linear-gradient(130deg,#C2410C,#E0510F 55%,#F47A2E)'],['bill','Purchase bill scanner',"Scan a supplier's bill. The stock entry waits for review on desktop.",'receipt','linear-gradient(130deg,#0F2A44,#1F6FB2)'],['bio','Staff biometric','Punch in and out with a fingerprint. Attendance updates on desktop.','finger','linear-gradient(130deg,#1E6A10,#2A9615 60%,#5BBF3E)']];
const scxCard=([k,t,d,ic,g])=>`<button class="scx" data-pa="${k==='bio'?'bio':'cam'}" data-k="${k}" style="--g:${g}"><span class="scx-in"><span class="scx-ic" data-3="${ic}"></span><span style="flex:1;min-width:0"><span class="scx-tag">${ico('send','width:11px;height:11px')}Sends to desktop</span><b>${t}</b><small>${d}</small></span>${ico('chev')}</span></button>`;
function pScanRow(s){const lvl={sent:1,opened:2,processed:3}[s.status]??1;return `<div class="ps-row"><img src="${scanUrl(s)}" alt=""><div style="flex:1;min-width:0"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b style="font-size:13.5px">${s.kind==='rx'?'Prescription':'Purchase bill'}</b><small class="faint nowrap">${ago(s.at)}</small></div><small class="muted" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.kind==='rx'?(esc(s.patient)||'Patient not named'):(esc(s.supplier)||'Desktop will detect supplier')} · ${s.pages.length} page${s.pages.length>1?'s':''}</small><div class="steps">${['Sent','On desktop','Opened','Saved'].map((l,i)=>`<span class="${i<=lvl?'on':''}">${l}</span>`).join('')}</div></div></div>`}
function stockList(){const q=PHONE.q.toLowerCase();const L=S.meds.filter(m=>!q||(m.name+m.gen+m.mfr).toLowerCase().includes(q));
 return L.map(m=>{const s=stockOf(m.id);const[,sc]=stockState(m.id);const b=S.batches.filter(x=>x.med===m.id&&x.stock>0&&x.exp>=TODAY).sort((a,c)=>a.exp-c.exp)[0];return `<button class="ps-row" data-pa="stock-open" data-id="${m.id}" style="text-align:left;width:100%;margin:0"><span style="width:40px;height:40px;flex:none;display:block" data-3="${{Syrup:'bottle',Injection:'tube',Device:'chart',Powder:'drop'}[m.form]||'pill'}"></span><span style="flex:1;min-width:0"><b style="font-size:13.5px;display:block">${esc(m.name)}</b><small class="muted" style="display:block">${esc(m.gen)} · Rack ${esc(m.rack)}${b?' · Exp '+fexp(b.exp):''}</small></span><span class="r"><span class="chip ${sc}">${s}</span><small class="faint" style="display:block;margin-top:3px">${b?inr(b.mrp):''}</small></span></button>`}).join('')||'<div class="empty">No medicine matches.</div>'}
const themeSw=()=>`<button class="theme-sw ${effTheme()==='dark'?'dark':''}" data-act="theme" aria-label="Switch light or dark mode"><svg class="ico"><use href="#i-sun"/></svg><svg class="ico"><use href="#i-moon"/></svg><span class="knob"><svg class="ico knob-ico"><use href="#i-${effTheme()==='dark'?'moon':'sun'}"/></svg></span></button>`;
const back=t=>`<div class="pa-title"><button class="link" data-pa="back">${ico('left','width:14px;height:14px')}Back</button><h2>${t}</h2></div>`;
function pBody(){const today=S.sales.filter(s=>dk(s.date)===dk(TODAY));
 if(PHONE.sub==='att'){const k=dk(TODAY);return back('Staff attendance today')+`<div class="stack" style="gap:8px">${S.staff.map(e=>{const r=ATT[ak(e.id,k)]||{};const st=attSt(e,k);return `<div class="ps-row" style="margin:0">${who(e.name,(r.bin?'In '+ft(r.bin):'No punch')+(r.bout?' · Out '+ft(r.bout):''))}<span class="chip ${st[2]}" style="margin-left:auto;font-size:10.5px">${st[0]||'—'}</span></div>`}).join('')}</div><button class="btn btn-p btn-lg shine" style="width:100%;margin-top:14px" data-pa="bio">Open biometric scanner</button><p class="faint" style="font-size:12px;margin-top:10px">Admin marks are made on the desktop with the admin code. A day is confirmed once the mark and a punch both exist.</p>`}
 if(PHONE.sub==='ref'){const L=S.patients.filter(p=>p.status==='Active'&&p.refill<=1).sort((a,b)=>a.refill-b.refill);return back('Refill reminders')+(L.map(p=>`<div class="ps-row" style="flex-wrap:wrap">${who(p.name,'+91 '+p.mob)}<span class="chip ${p.refill<=0?'sos':'warn'}" style="margin-left:auto">${p.refill<0?'Overdue':p.refill===0?'Due today':'Tomorrow'}</span><small class="muted" style="width:100%">${p.meds.map(m=>med(m).name).join(', ')}</small><button class="btn ${p.reminded?'btn-o':'btn-g'} btn-sm" data-pa="remind" data-id="${p.id}">${ico('whats')}${p.reminded?'Reminded':'Send WhatsApp reminder'}</button></div>`).join('')||'<div class="empty">No refills due.</div>')}
 if(PHONE.sub==='sales'){const tot=today.reduce((a,s)=>a+s.calc.total,0);return back("Today's sales")+`<div class="pa-stats" style="margin-bottom:12px"><div><small>Total</small><b>${inr0(tot)}</b></div><div><small>Bills</small><b>${today.length}</b></div></div>`+today.map(s=>`<div class="ps-row"><div style="flex:1;min-width:0"><b style="font-size:13.5px">${esc(s.cname)}</b><small class="muted" style="display:block">${s.no} · ${ft(s.date)} · ${s.pay.mode}</small></div><b>${inr0(s.calc.total)}</b></div>`).join('')}
 if(PHONE.sub==='promo'){return back('Promotions & ads')+`<div class="pa-stats" style="margin-bottom:12px"><div><span data-3="coin"></span><small>Ad wallet</small><b>${inr0(PR.wallet)}</b></div><div><span data-3="mega"></span><small>Live campaigns</small><b>${PR.camps.filter(c=>c.status==='Live').length}</b></div></div>`+PR.camps.filter(c=>c.status!=='Ended').map(c=>`<div class="ps-row" style="flex-wrap:wrap"><span style="width:36px;height:36px;flex:none;display:block" data-3="${PT[c.type][1]}"></span><div style="flex:1;min-width:0"><b style="font-size:13px;display:block">${esc(ht(c.head))}</b><small class="muted">${c.clicks.toLocaleString('en-IN')} clicks · ${c.conv} ${c.type==='doctor'?'bookings':'orders'} · ${c.spend?(c.rev/c.spend).toFixed(1)+'× ROI':'new'}</small></div><span class="chip ${c.status==='Live'?'ok':c.status==='Paused'?'warn':'info'} dot">${c.status}</span>${c.status!=='In review'?`<button class="btn btn-o btn-sm" data-pa="pr-tog" data-id="${c.id}">${c.status==='Live'?'Pause':'Resume'}</button>`:''}</div>`).join('')+'<p class="faint" style="font-size:12px">Create new campaigns from the desktop portal.</p>'}
 if(PHONE.sub==='link'){return back('Linked desktop')+`<div class="panel" style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px"><span style="width:84px;height:84px;display:block" data-3="hospital"></span><b style="font-size:16px">${esc(S.store.name)} · Desktop portal</b><span class="chip ${SYNC.ok?'ok':'warn'} dot">${SYNC.ok?'Connected · live sync':'Not syncing in this preview'}</span><p class="muted" style="font-size:13px;max-width:32ch">This phone and the desktop portal use the same SevaDharam link. Scans and fingerprint punches you send here appear on the desktop straight away.</p>${SYNC.last?`<small class="faint">Last update ${ago(SYNC.last.toISOString())}</small>`:''}</div>`}
 if(PHONE.tab==='stock')return `<div class="pa-title"><h2>Stock</h2><p>${S.meds.length} medicines · tap one for batches</p></div><label class="sbox" style="margin-bottom:12px">${ico('search')}<input id="pq2" placeholder="Search medicine or generic" value="${esc(PHONE.q)}" autocomplete="off"></label><div id="pStock" class="stack" style="gap:8px">${stockList()}</div>`;
 if(PHONE.tab==='sent'){const L=allScans();const k=dk(TODAY);const pun=S.staff.filter(e=>(ATT[ak(e.id,k)]||{}).bin);return `<div class="pa-title"><h2>Sent to desktop</h2><p>Live status of every scan from this store's phones</p></div>${L.map(pScanRow).join('')||'<div class="empty" style="padding:20px">Nothing sent yet. Tap the scan button below to start.</div>'}<div class="pa-sec"><b>Punches today</b></div><div class="stack" style="gap:8px">${pun.map(e=>{const r=ATT[ak(e.id,k)];return `<div class="ps-row" style="margin:0">${who(e.name,'In '+ft(r.bin)+(r.bout?' · Out '+ft(r.bout):''))}<span class="chip ok" style="margin-left:auto">On desktop</span></div>`}).join('')||'<div class="empty" style="padding:16px">No punches yet today.</div>'}</div>`}
 if(PHONE.tab==='more')return `<div class="pa-title"><h2>More</h2></div><div class="pa-menu">${[['att','Staff attendance today','finger'],['ref','Refill reminders','alarm'],['sales',"Today's sales",'receipt'],['promo','Promotions & ads','mega'],['link','Linked desktop','hospital']].map(([k,l,i])=>`<button data-pa="sub" data-s="${k}"><span data-3="${i}"></span>${l}${ico('chev')}</button>`).join('')}</div><div class="pa-menu" style="margin-top:12px"><div class="row" style="justify-content:space-between"><b>Dark mode</b>${themeSw()}</div><button data-pa="desk"><span data-3="grid"></span>Open desktop view${ico('chev')}</button><button data-act="logout"><span data-3="lock3"></span>Log out${ico('chev')}</button></div>`;
 const ts=today.reduce((a,s)=>a+s.calc.total,0);const h=new Date().getHours();
 return `<div class="pa-hello"><small>Good ${h<12?'morning':h<17?'afternoon':'evening'} · ${fd(TODAY)}</small><h2>Your scanners</h2><p>Everything you scan here lands on the desktop portal in seconds.</p></div>
 <div class="stack" style="gap:12px">${SCN.map(scxCard).join('')}</div>
 <div class="pa-sec"><b>Today at the store</b></div><div class="pa-stats">${[['coin','Sales',inr0(ts)],['receipt','Bills',today.length],['alarm','Refills due',S.patients.filter(p=>p.status==='Active'&&p.refill<=0).length],['box','Low / out of stock',S.meds.filter(m=>stockState(m.id)[1]!=='ok').length]].map(([i,l,v])=>`<div><span data-3="${i}"></span><small>${l}</small><b>${v}</b></div>`).join('')}</div>
 <div class="pa-sec"><b>Recently sent</b><button class="link" data-pa="tab" data-t="sent">See all</button></div>${allScans().slice(0,3).map(pScanRow).join('')||'<div class="empty" style="padding:16px">Nothing sent yet. Try the prescription scanner above.</div>'}`}
function camHTML(){const c=CAM;const kn=c.kind==='rx'?'prescription':'purchase bill';const tag=`<span class="scx-tag" style="margin:0">${ico('send','width:11px;height:11px')}To desktop</span>`;
 if(c.stage==='shoot')return `<div class="cam"><div class="cam-top"><button class="cam-x" data-pa="cam-close" aria-label="Close">${ico('x')}</button><b>${c.kind==='rx'?'Prescription scanner':'Purchase bill scanner'}</b>${tag}</div>
 <div class="vf"><span class="vf-doc" data-3="${c.kind==='rx'?'clipboard':'receipt'}"></span><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><div class="scanline"></div><div class="vf-hint">${c.pages.length?`Page ${c.pages.length+1} · `:''}Fit the whole ${kn} inside the frame, in good light</div></div>
 <div class="cam-bot">${c.pages.length?`<button class="cam-side" data-pa="cam-review" aria-label="Review pages"><img src="${c.pages[c.pages.length-1].url}" alt=""><b>${c.pages.length}</b></button>`:`<label class="cam-side" for="galIn">${ico('upload')}<span>Gallery</span></label>`}<label class="shutter" for="camIn" aria-label="Take photo"><span></span></label><button class="cam-side" data-pa="cam-sample">${ico('sparkle')}<span>Sample</span></button></div>
 <p class="cam-note">The shutter opens your phone camera · Sample sends a demo ${kn}</p>${c.busy?'<div class="cam-busy">Checking the photo…</div>':''}</div>`;
 if(c.stage==='review'){const p=c.pages[c.cur];const chk=[[p.w>=900,p.w>=900?`Sharp enough (${p.w}×${p.h})`:`Low resolution (${p.w}×${p.h}). Move closer`],[p.lum>=70&&p.lum<=252,p.lum<70?'Too dark. Add more light':p.lum>252?'Too bright. Avoid glare':'Lighting looks good'],[true,`Compressed for fast sending (${Math.max(1,Math.round(p.blob.size/1024))} KB)`]];
  return `<div class="cam rev"><div class="cam-top"><button class="cam-x" data-pa="cam-back" aria-label="Back to camera">${ico('left')}</button><b>Review${c.pages.length>1?` · page ${c.cur+1} of ${c.pages.length}`:''}</b><button class="cam-x" data-pa="cam-del" aria-label="Delete this page">${ico('trash')}</button></div>
  <div class="rv-img"><img src="${p.url}" alt="Scanned page"></div>
  <div class="rv-strip">${c.pages.map((x,i)=>`<button class="${i===c.cur?'on':''}" data-pa="cam-pg" data-i="${i}" aria-label="Page ${i+1}"><img src="${x.url}" alt=""></button>`).join('')}<button class="add" data-pa="cam-add">${ico('plus')}Page</button></div>
  <div class="rv-panel"><div class="rv-checks">${chk.map(([ok,l])=>`<span class="${ok?'ok':'bad'}">${ico(ok?'check':'alert','width:14px;height:14px')}${l}</span>`).join('')}</div>
  ${c.kind==='rx'?`<div class="fg" style="grid-template-columns:1fr 1fr;gap:10px"><div class="fld"><label for="cmP">Patient name</label><input class="inp" id="cmP" placeholder="Optional" value="${esc(c.meta.patient||'')}"></div><div class="fld"><label for="cmM">Patient mobile</label><input class="inp" id="cmM" inputmode="numeric" maxlength="10" placeholder="Optional" value="${esc(c.meta.mob||'')}"></div></div>`
  :`<div class="fg" style="grid-template-columns:1fr 1fr;gap:10px"><div class="fld"><label for="cmS">Supplier</label><select class="inp" id="cmS"><option value="">Desktop will detect</option>${S.suppliers.map(s=>`<option ${c.meta.supplier===s.name?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div><div class="fld"><label for="cmI">Invoice no.</label><input class="inp" id="cmI" placeholder="Optional" value="${esc(c.meta.inv||'')}"></div></div>`}
  <button class="btn btn-p btn-lg shine" style="width:100%;margin-top:12px" data-pa="cam-send">${ico('send')}Send ${c.pages.length} page${c.pages.length>1?'s':''} to desktop</button></div></div>`}
 if(c.stage==='sending')return `<div class="cam rev"><div class="send-anim"><span class="plane" data-3="upload"></span><b style="font-size:17px">Sending to desktop…</b><div class="bar-track" style="width:220px"><div class="bar-fill" style="width:${c.prog}%;transition:width .3s"></div></div><small>${c.step||''}</small></div></div>`;
 return `<div class="cam rev"><div class="send-anim"><span class="done-ck">${ico('check')}</span><b style="font-size:19px">${c.res.ok?'Delivered to your desktop':'Saved on this phone'}</b><p>${c.res.ok?(c.kind==='rx'?'It is waiting in the desktop Phone inbox and opens in Prescription Analyzer.':'It is waiting in the desktop Phone inbox and opens in the purchase bill review.'):'Live delivery to the desktop works when this app is opened from the published link. You can follow it under Sent.'}</p><div class="row" style="width:100%;gap:10px;flex-wrap:nowrap"><button class="btn btn-o btn-lg" style="flex:1" data-pa="cam-again">Scan another</button><button class="btn btn-p btn-lg" style="flex:1" data-pa="cam-close">Done</button></div></div></div>`}
function bioHTML(){const k=dk(TODAY);const ok=S.staff.filter(e=>e.bio&&!(e.join&&TODAY<e.join));if(!BIOP.emp||!ok.find(e=>e.id===BIOP.emp))BIOP.emp=(ok.find(e=>!(ATT[ak(e.id,k)]||{}).bin)||ok[0]).id;const e=S.staff.find(x=>x.id===BIOP.emp);
 return `<div class="cam bio"><div class="cam-top"><button class="cam-x" data-pa="bio-close" aria-label="Close">${ico('x')}</button><b>Staff biometric</b><span class="scx-tag" style="margin:0">${ico('send','width:11px;height:11px')}To desktop</span></div>
 <div class="bio-staff">${S.staff.map(s=>`<button class="${s.id===BIOP.emp?'on':''}" data-pa="bio-emp" data-id="${s.id}" ${s.bio?'':'disabled'}><span class="av" style="background:${gfor(s.name)};width:42px;height:42px">${ini(s.name)}</span>${esc(s.name.split(' ')[0])}${s.bio?'':'<em>Not enrolled</em>'}</button>`).join('')}</div>
 <div class="pad-wrap"><button class="pad" id="pad" aria-label="Press and hold to scan ${esc(e.name)}'s fingerprint"><svg class="pad-ring" viewBox="0 0 220 220" aria-hidden="true"><circle cx="110" cy="110" r="102"/><circle id="padP" cx="110" cy="110" r="102"/></svg><span class="pad-fp" data-3="finger"></span></button><b id="padT" style="font-size:16px">Press and hold · ${esc(e.name)}</b><small>The first scan punches in, the next punches out</small></div>
 <div class="bio-res">${BIOP.res||''}</div>
 <div class="bio-list">${S.staff.map(s=>{const r=ATT[ak(s.id,k)]||{};const st=attSt(s,k);return `<div><span>${esc(s.name)}</span><span>${r.bin?'In '+ft(r.bin):'No punch'}${r.bout?' · Out '+ft(r.bout):''}</span><span class="chip ${st[2]}">${st[0]||'—'}</span></div>`}).join('')}</div></div>`}
function bindPad(){const pad=$('#pad');if(!pad)return;const P=$('#padP');const C=2*Math.PI*102;P.style.strokeDasharray=C;P.style.strokeDashoffset=C;let raf,t0,holding=false;
 const stop=()=>{cancelAnimationFrame(raf);holding=false;pad.classList.remove('hold');P.style.strokeDashoffset=C};
 pad.addEventListener('pointerdown',ev=>{ev.preventDefault();try{pad.setPointerCapture(ev.pointerId)}catch(_){}holding=true;t0=performance.now();pad.classList.add('hold');$('#padT').textContent='Keep holding…';const step=t=>{if(!holding)return;const p=Math.min((t-t0)/1200,1);P.style.strokeDashoffset=C*(1-p);if(p<1)raf=requestAnimationFrame(step);else{stop();bioDone()}};raf=requestAnimationFrame(step)});
 ['pointerup','pointercancel'].forEach(n=>pad.addEventListener(n,()=>{if(holding){stop();$('#padT').textContent='Lifted too early. Hold a little longer'}}));
 pad.addEventListener('contextmenu',ev=>ev.preventDefault());
 pad.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();bioDone()}})}
function bioDone(){if(navigator.vibrate)navigator.vibrate([30,40,30]);const res=bioPunch(BIOP.emp,'Phone');BIOP.res=bioMsg(res)+(res.kind==='in'||res.kind==='out'?`<p class="faint" style="font-size:11.5px;margin-top:6px">${SYNC.ok?'Sent to the desktop Staff Attendance.':'Saved on this phone. Live delivery works on the published link.'}</p>`:'');prender()}
function prender(){const el=$('#papp');if(!el||el.hidden)return;const keep=$('#paScroll')?.scrollTop||0;let inner;
 if(CAM)inner=camHTML();else if(BIOP.open)inner=bioHTML();
 else{const wait=allScans().filter(s=>s.status==='sent').length;
  inner=`<header class="pa-h"><img src="${LOGO}" alt="" class="pa-logo"><div style="min-width:0;flex:1"><b style="font-size:15px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(S.store.name)}</b><span class="pa-sync ${SYNC.ok?'on':''}">${SYNC.ok?'Synced with desktop':'Preview · not syncing'}</span></div>${themeSw()}</header>
  <div class="pa-scroll" id="paScroll">${pBody()}</div>
  <nav class="pa-nav" aria-label="Phone app">${[['home','Home','house'],['stock','Stock','box'],['scan','',''],['sent','Sent','upload'],['more','More','grid']].map(([k,l,i])=>k==='scan'?'<button class="pa-fab" data-pa="fab" aria-label="Open scanners"><span data-3="scan"></span></button>':`<button class="${PHONE.tab===k&&!PHONE.sub?'on':''}" data-pa="tab" data-t="${k}"><span class="n3" data-3="${i}"></span>${l}${k==='sent'&&wait?`<i>${wait}</i>`:''}</button>`).join('')}</nav>
  ${PHONE.sheet?`<div class="psheet" data-pa="sheet-x"><div><div class="grab"></div><b style="font-size:17px">Choose a scanner</b>${SCN.map(scxCard).join('')}</div></div>`:''}`}
 el.innerHTML=`<div class="pa">${inner}</div>`;paint3(el);const sc=$('#paScroll');if(sc)sc.scrollTop=PHONE.jump?0:keep;PHONE.jump=false;if(BIOP.open&&!CAM)bindPad()}
async function prepImg(src){let img;if(src instanceof HTMLCanvasElement)img=src;else{const u=URL.createObjectURL(src);img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('bad'));i.src=u})}
 const W=img.naturalWidth||img.width,H=img.naturalHeight||img.height;const s=Math.min(1,1600/Math.max(W,H));const c=document.createElement('canvas');c.width=Math.round(W*s);c.height=Math.round(H*s);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
 const t=document.createElement('canvas');t.width=t.height=48;const tx=t.getContext('2d');tx.drawImage(c,0,0,48,48);const d=tx.getImageData(0,0,48,48).data;let L=0;for(let i=0;i<d.length;i+=4)L+=.299*d[i]+.587*d[i+1]+.114*d[i+2];L/=d.length/4;
 const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.82));if(!blob)throw new Error('encode');return{blob,url:URL.createObjectURL(blob),w:W,h:H,lum:Math.round(L)}}
function sampleCanvas(kind){const c=document.createElement('canvas');c.width=1200;c.height=1600;const x=c.getContext('2d');x.fillStyle='#FFFDF8';x.fillRect(0,0,1200,1600);const hand='"Segoe Print","Bradley Hand","Comic Sans MS",cursive';
 if(kind==='rx'){x.fillStyle='#0F2A44';x.font='bold 46px Arial';x.fillText('Dr. Amit Verma, MBBS, MD',80,130);x.font='30px Arial';x.fillStyle='#5B6B7E';x.fillText('General Physician · Reg. WBMC12345 · Salt Lake Clinic',80,180);x.strokeStyle='#E0510F';x.lineWidth=4;x.beginPath();x.moveTo(80,215);x.lineTo(1120,215);x.stroke();
  x.fillStyle='#1b1b1b';x.font='36px '+hand;x.fillText('Pt: Rahul Sharma    45/M    '+fd(TODAY),80,295);x.fillStyle='#C2410C';x.font='bold 96px Georgia,serif';x.fillText('℞',80,440);x.fillStyle='#1b1b1b';x.font='42px '+hand;['1. Tab Metformin 500mg    1-0-1 × 30d','2. Tab Glimepiride 2mg    1-0-0 × 30d','3. Tab Telmisartan 40mg   0-0-1 × 30d'].forEach((l,i)=>x.fillText(l,110,560+i*115));x.fillText('Review after 1 month',110,930);x.font='48px '+hand;x.fillText('~ A. Verma',800,1400)}
 else{x.fillStyle='#0F2A44';x.font='bold 46px Arial';x.fillText('EASTERN MEDICO AGENCIES',80,130);x.font='28px Arial';x.fillStyle='#5B6B7E';x.fillText('12 Bentinck St, Kolkata · GSTIN 19AAACE1111A1Z2',80,178);x.fillStyle='#1b1b1b';x.font='29px "Courier New",monospace';
  ['TAX INVOICE   EMA/2611/4471   '+fd(addD(-1)),'To: '+S.store.name,'------------------------------------------------','ITEM                BATCH    EXP   QTY    RATE','AMOXICILLIN 500 CAP AMX25K11 05/28 100+10 61.50','PARACETAMOL 650 TAB PCM25K03 02/28 150    20.40','INSULIN GLARGINE    INS25J07 09/27 10    950.00','MONTELUKAST+LEVOCET MLV25H09 12/27 60+6  104.00','------------------------------------------------','                     GRAND TOTAL  Rs 27,279.00'].forEach((l,i)=>x.fillText(l,70,270+i*58))}
 return c}
async function addPage(src){if(!CAM)return;CAM.busy=true;prender();try{const p=await prepImg(src);CAM.pages.push(p);CAM.cur=CAM.pages.length-1;CAM.stage='review'}catch(e){toast("Couldn't read that photo. Try another one.",1)}if(CAM)CAM.busy=false;prender()}
async function sendScan(){const c=CAM;const mob=(c.meta.mob||'').replace(/\D/g,'');if(c.kind==='rx'&&mob&&!/^[6-9]\d{9}$/.test(mob)){toast('Patient mobile should be 10 digits',1);return}
 c.stage='sending';c.prog=6;c.step='Preparing';prender();const meta=c.kind==='rx'?{patient:(c.meta.patient||'').trim(),mob}:{supplier:c.meta.supplier||'',inv:(c.meta.inv||'').trim()};
 try{if(SYNC.db&&SYNC.assets){const ids=[];for(let i=0;i<c.pages.length;i++){c.step=`Uploading page ${i+1} of ${c.pages.length}`;c.prog=10+80*i/c.pages.length;prender();const r=await SYNC.assets.upload(c.pages[i].blob,{type:'image/jpeg'});ids.push(r.id)}
   c.step='Notifying desktop';c.prog=95;prender();await SYNC.db.collection('scans').add({kind:c.kind,pages:ids,at:new Date().toISOString(),status:'sent',device:'Phone app',...meta});c.res={ok:true}}
  else{for(let p=20;p<=90;p+=35){c.prog=p;c.step='Saving on this phone';prender();await new Promise(r=>setTimeout(r,300))}SYNC.local.unshift({id:'L'+Date.now(),kind:c.kind,pages:c.pages.map(p=>p.url),local:true,at:new Date().toISOString(),status:'sent',device:'Phone app (preview)',...meta});c.res={ok:false}}
  c.prog=100;c.stage='done';if(navigator.vibrate)navigator.vibrate(40)}
 catch(e){c.stage='review';toast(e&&e.code==='too_large'?'That photo is too large to send':e&&(e.code==='quota_or_state'||e.code==='quota_exceeded')?'Scan storage is full. Clear old scans on desktop':"Couldn't send. Check the connection and try again",1)}
 phBadge();prender()}
$('#papp')?.addEventListener('click',e=>{const t=e.target.closest('[data-pa]');if(!t)return;const a=t.dataset.pa;if(a==='sheet-x'&&e.target!==t)return;const r=t.querySelector('[data-3]');if(r)boing(r);
 const A2={
  tab(){PHONE.tab=t.dataset.t;PHONE.sub=null;PHONE.jump=true;prender()},
  sub(){PHONE.sub=t.dataset.s;PHONE.jump=true;prender()},
  back(){PHONE.sub=null;PHONE.jump=true;prender()},
  fab(){PHONE.sheet=true;prender()},
  'sheet-x'(){PHONE.sheet=false;prender()},
  cam(){PHONE.sheet=false;CAM={kind:t.dataset.k,pages:[],stage:'shoot',meta:{},cur:0};prender()},
  bio(){PHONE.sheet=false;BIOP.open=true;BIOP.res='';prender()},
  'bio-close'(){BIOP.open=false;prender()},
  'bio-emp'(){BIOP.emp=t.dataset.id;BIOP.res='';prender()},
  'cam-close'(){CAM=null;prender()},
  'cam-sample'(){addPage(sampleCanvas(CAM.kind))},
  'cam-review'(){CAM.stage='review';prender()},
  'cam-add'(){CAM.stage='shoot';prender()},
  'cam-back'(){CAM.stage='shoot';prender()},
  'cam-pg'(){CAM.cur=+t.dataset.i;prender()},
  'cam-del'(){CAM.pages.splice(CAM.cur,1);CAM.cur=Math.max(0,CAM.cur-1);if(!CAM.pages.length)CAM.stage='shoot';prender()},
  'cam-send'(){sendScan()},
  'cam-again'(){CAM={kind:CAM.kind,pages:[],stage:'shoot',meta:{},cur:0};prender()},
  'stock-open'(){const m=med(t.dataset.id);const bs=S.batches.filter(b=>b.med===m.id).sort((a,b)=>a.exp-b.exp);modal(m.name,`<p class="muted" style="font-size:13px;margin-bottom:10px">${esc(m.gen)} · ${esc(m.pack)} · Rack ${esc(m.rack)} · Schedule ${m.sch}</p>${bs.map(b=>{const[l,c]=expState(b);return `<div class="row" style="justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><span><b>${b.no}</b><small class="faint" style="display:block">Exp ${fexp(b.exp)} · MRP ${inr(b.mrp)}</small></span><span class="r"><b>${b.stock}</b><span class="chip ${c}" style="display:block;margin-top:3px">${l}</span></span></div>`}).join('')}`,`<button class="btn btn-p" data-act="mclose">Close</button>`,{icon:'pill'})},
  remind(){const p=S.patients.find(x=>x.id===t.dataset.id);p.reminded='WhatsApp';prender();toast('Reminder sent to '+p.name)},
  'pr-tog'(){const c=PR.camps.find(x=>x.id===t.dataset.id);c.status=c.status==='Live'?'Paused':'Live';prender();toast(c.id+(c.status==='Live'?' resumed':' paused'))},
  desk(){location.hash='dashboard'},
 };A2[a]&&A2[a]()});
$('#papp')?.addEventListener('input',e=>{const t=e.target;if(t.id==='pq2'&&$('#pStock')){$('#pStock').innerHTML=stockList();paint3($('#pStock'))}if(CAM){if(t.id==='cmP')CAM.meta.patient=t.value;if(t.id==='cmM')CAM.meta.mob=t.value;if(t.id==='cmI')CAM.meta.inv=t.value}});
$('#papp')?.addEventListener('change',e=>{if(CAM&&e.target.id==='cmS')CAM.meta.supplier=e.target.value});
['camIn','galIn'].forEach(id=>{ const el=$('#'+id); if(el) el.addEventListener('change',async e=>{const f=[...e.target.files];e.target.value='';for(const x of f)await addPage(x)}); });
// hashchange phone listener disabled for SPA stability


/* ================= DOCTOR PORTAL (shares the artifact database with the pharmacy portal) ================= */
const CODE_CH='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function genCode(name){const ini2=(name.replace(/^Dr\.?\s*/i,'').match(/\b[A-Za-z]/g)||['D','R']).slice(0,2).join('').toUpperCase().padEnd(2,'X');let c;do{c='SDDR-'+ini2+[...Array(4)].map(()=>'23456789'[Math.floor(Math.random()*8)]).join('')}while(codeLookup(c));return c}
const maskMob=m=>{const d=String(m).replace(/\D/g,'').slice(-10);return '+91 '+d.slice(0,2)+'XXX X'+d.slice(-4)};
function codeLookup(code){code=String(code||'').trim().toUpperCase();if(!code)return null;if(code===DOCP.code)return {...DOCP};
 const fromPh=(typeof S!=='undefined'&&S.doctors||[]).find(d=>d.code===code);if(fromPh)return {code,name:fromPh.name,email:fromPh.email,mob:fromPh.mob,spec:fromPh.spec,qual:fromPh.qual,reg:fromPh.reg,fee:fromPh.fee,firstBy:fromPh.codeBy||'a pharmacy',codeAt:fromPh.codeAt||new Date()};
 const r=Object.values(DSY.req).filter(x=>x.doctorCode===code).sort((a,b)=>DT(a.at)-DT(b.at))[0];if(r)return {code,name:r.doctorName,email:r.doctorEmail,mob:r.doctorMob,spec:r.spec,qual:r.doctorQual||'Add your qualifications',reg:r.doctorReg||'—',fee:r.fee,firstBy:r.ph,codeAt:DT(r.at)};return null}
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const m2=t=>{const[h,m]=t.split(':').map(Number);return h*60+m};
const mt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const t12=t=>{let[h,m]=t.split(':').map(Number);const ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+String(m).padStart(2,'0')+' '+ap};
const pmin=s=>{const x=String(s).trim().toLowerCase().match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);if(!x)return 0;let h=+x[1];if(x[3]==='pm'&&h<12)h+=12;if(x[3]==='am'&&h===12)h=0;return h*60+ +x[2]};
const DT=x=>x?new Date(x):null;const iso=d=>d instanceof Date?d.toISOString():d;
const addM=(d,m)=>{const x=new Date(d);x.setMonth(x.getMonth()+m);return x};
const CHC=['#E0510F','#1F6FB2','#2A9615','#7B4FB8','#B7791F','#E11D48','#0E8C8C'];
const chColor=ph=>CHC[[...ph].reduce((a,c)=>a+c.charCodeAt(0),0)%CHC.length];
const DOCP={code:'SDDR-AS4821',firstBy:'Care & Cure Medicos',codeAt:addD(-172),email:'doctor@demo.com',name:'Dr. Aarav Sharma',spec:'Cardiologist',qual:'MBBS, MD (Medicine), DM (Cardiology)',reg:'WBMC 64218',mob:'98765 43211',fee:800,since:'2014'};
const REQS=[
 {id:'REQ-ABC-1',ph:'ABC Medical Store',addr:'DN-12, Sector V, Salt Lake, Kolkata',owner:'Anil Banerjee',phMob:'+91 98765 43210',reg:'WB/KOL/20B-1123',days:['Mon','Thu'],t1:'11:00',t2:'16:00',slot:15,fee:800,mode:'In-pharmacy chamber',months:6,status:'pending',kind:'new',at:new Date(Date.now()-95*6e4),note:'We have a private consultation room with an ECG machine. Many of our regular customers are heart patients.',doctorEmail:'doctor@demo.com'},
 {id:'REQ-GC-1',ph:'Green Cross Pharmacy',addr:'VIP Road, Baguiati, Kolkata',owner:'Ritu Saha',phMob:'+91 98301 22410',reg:'WB/NKP/20B-3381',days:['Wed'],t1:'10:00',t2:'13:00',slot:15,fee:700,mode:'In-pharmacy chamber',months:3,status:'pending',kind:'new',at:addD(-1),note:'',doctorEmail:'doctor@demo.com'},
 {id:'REQ-CC-2',ph:'Care & Cure Medicos',addr:'Nagerbazar, Dum Dum, Kolkata',owner:'Tapas Roy',phMob:'+91 98300 44004',reg:'WB/NKP/20B-2207',days:['Sat'],t1:'10:00',t2:'13:00',slot:20,fee:800,mode:'In-pharmacy chamber',months:6,status:'pending',kind:'renewal',renews:'REQ-CC-1',at:addD(-2),note:'Your current approval ends soon. Patients keep asking for your Saturday slots.',doctorEmail:'doctor@demo.com'},
 {id:'REQ-LF-1',ph:'Lifeline Pharmacy',addr:'Action Area I, New Town, Kolkata',owner:'Subrata Paul',phMob:'+91 98300 11001',reg:'WB/NKP/20B-1907',days:['Tue','Fri'],t1:'17:00',t2:'20:00',slot:15,fee:900,mode:'In-pharmacy chamber',months:6,status:'approved',approvedMonths:3,since:addD(-38),until:addM(addD(-38),3),kind:'new',at:addD(-40),doctorEmail:'doctor@demo.com'},
 {id:'REQ-CC-1',ph:'Care & Cure Medicos',addr:'Nagerbazar, Dum Dum, Kolkata',owner:'Tapas Roy',phMob:'+91 98300 44004',reg:'WB/NKP/20B-2207',days:['Sat'],t1:'10:00',t2:'13:00',slot:20,fee:800,mode:'In-pharmacy chamber',months:6,status:'approved',approvedMonths:6,since:addD(-170),until:addD(12),kind:'new',at:addD(-172),doctorEmail:'doctor@demo.com'},
 {id:'REQ-SV-1',ph:'SevaDharam Video Consult',addr:'Online · SevaDharam patient app',owner:'SevaDharam',phMob:'—',reg:'—',days:['Wed'],t1:'19:00',t2:'21:00',slot:15,fee:600,mode:'Video',months:6,status:'approved',approvedMonths:6,since:addD(-30),until:addM(addD(-30),6),kind:'new',at:addD(-31),doctorEmail:'doctor@demo.com'},
 {id:'REQ-WM-1',ph:'Wellness Medico',addr:'Lake Town, Kolkata',owner:'Arup Ghosh',phMob:'+91 98742 11220',reg:'WB/NKP/20B-0991',days:['Sun'],t1:'09:00',t2:'12:00',slot:15,fee:700,mode:'In-pharmacy chamber',months:6,status:'declined',declineReason:'Sunday is my family day',kind:'new',at:addD(-20),doctorEmail:'doctor@demo.com'},
];
const PFM=['Rahul','Arun','Prakash','Sourav','Debashis','Subhash','Tapan','Manoj','Gopal','Vikram','Bikash','Rajesh','Partha','Ashok','Biswajit'],PFF=['Suman','Neha','Meena','Kavita','Lakshmi','Priyanka','Rumpa','Moumita','Sarita','Rina','Sonali','Jaya','Mitali','Swati','Anita'],PLN=['Sharma','Das','Ghosh','Roy','Mondal','Saha','Banerjee','Chatterjee','Paul','Biswas','Sen','Dutta','Gupta','Mitra','Sarkar'];
const RSN=['Chest pain on exertion','BP follow-up','Palpitations','Post-angioplasty review','Breathless on walking','Abnormal ECG review','Cholesterol follow-up','Swelling of feet','Dizziness and fatigue'];
const RITEMS=['Previous prescriptions','ECG','Lipid profile','Echo report','HbA1c / blood sugar','Kidney function test','Chest X-ray','Discharge summary'];
const BK=[];let bkN=1;
REQS.filter(r=>r.status==='approved').forEach(r=>{for(let o=-7;o<=21;o++){const dt=addD(o);if(!r.days.includes(DOW[dt.getDay()])||dt<r.since||dt>r.until)continue;const n=Math.floor((m2(r.t2)-m2(r.t1))/r.slot);const fill=o<0?.75:o===0?.65:o<4?.5:o<8?.32:.15;
 for(let i=0;i<n;i++){if(rnd()>fill)continue;const g=rnd()<.5?'M':'F';BK.push({id:'BK'+(bkN++),reqId:r.id,date:dk(dt),time:mt(m2(r.t1)+i*r.slot),patient:{name:pick(g==='M'?PFM:PFF)+' '+pick(PLN),age:28+Math.floor(rnd()*50),g,mob:'9'+String(Math.floor(1e8+rnd()*8.99e8))},via:r.mode==='Video'?'SevaDharam app':(rnd()<.8?r.ph:'SevaDharam app'),type:rnd()<.45?'New':'Follow-up',reason:pick(RSN),status:o<0?(rnd()<.9?'Completed':'No-show'):'Booked'})}}});
const RR_BASE={};BK.forEach(b=>{const o=days(new Date(b.date+'T00:00'),TODAY);if(o<-6||o>4||rnd()>.35)return;const items=pick([['Previous prescriptions','ECG'],['Lipid profile','ECG'],['Echo report'],['HbA1c / blood sugar','Kidney function test'],['Previous prescriptions','Lipid profile','ECG']]);const st=o<0?'reviewed':o===0?'uploaded':pick(['requested','uploaded']);
 RR_BASE[b.id]={bookingId:b.id,items,note:'Please bring or upload your last reports before the visit.',status:st,at:new Date(Date.now()-(30+Math.floor(rnd()*600))*6e4),files:st==='requested'?[]:items.map(k=>({kind:k})),uploadedBy:st==='requested'?null:(rnd()<.6?'Patient (SevaDharam app)':'Pharmacy'),docNote:st==='reviewed'?'Reviewed. Continue current medicines.':''}});
const DSY={req:{},book:{},rr:{},f:{}};
function reqs(){const base=REQS.filter(r=>r.doctorEmail===DOCP.email).map(r=>({...r,...norm(DSY.req[r.id])}));const extra=Object.entries(DSY.req).filter(([id,d])=>!REQS.find(r=>r.id===id)&&d.doctorEmail===DOCP.email).map(([id,d])=>({id,...norm(d)}));return [...extra,...base].sort((a,b)=>DT(b.at)-DT(a.at))}
function norm(d){if(!d)return {};const x={...d};['at','since','until'].forEach(k=>{if(x[k])x[k]=DT(x[k])});return x}
const chambers=()=>reqs().filter(r=>r.status==='approved'&&DT(r.until)>=TODAY);
const pendingReqs=()=>reqs().filter(r=>r.status==='pending');
function books(){const R=reqs();const L=BK.filter(b=>R.some(r=>r.id===b.reqId));Object.entries(DSY.book).forEach(([id,b])=>{if(b.doctorEmail!==DOCP.email)return;const r=R.find(x=>x.id===b.reqId)||R.find(x=>x.status==='approved'&&x.ph===b.ph);L.push({...b,id,reqId:r?r.id:b.reqId})});return L}
const chOf=b=>reqs().find(r=>r.id===b.reqId)||{ph:b.via||'Pharmacy',addr:'',t1:'00:00',t2:'00:00',slot:15,mode:''};
function rrOf(id){const d=DSY.rr[id];if(d)return {...d,at:DT(d.at)};return RR_BASE[id]||null}
function dput(col,id,data){const key={requests:'req',bookings:'book',reportreqs:'rr'}[col];const body=JSON.parse(JSON.stringify(data,(k,v)=>v));
 if(SYNC.db){DSY[key][id]=body;SYNC.db.doc(col+'/'+id).set(body).catch(()=>toast("Couldn't sync this change. Check the connection",1));DHANDLE[key]([id],false)}else{DSY[key][id]=body;DHANDLE[key]([id],false)}}
/* ----- what the pharmacy portal does with these docs ----- */
APPR.declined=['Declined by doctor','sos'];
{const td=TODAY.getDay();const offs=[...Array(14)].map((_,i)=>i).filter(i=>['Mon','Thu'].includes(DOW[(td+i)%7]));
 const d={id:'d5',code:DOCP.code,codeBy:'Care & Cure Medicos',codeAt:DOCP.codeAt,name:'Dr. Aarav Sharma',qual:'MBBS, MD, DM (Cardiology)',spec:'Cardiologist',reg:'WBMC64218',mob:'98765 43211',mode:'In-Pharmacy',appr:'pending',sent:0,active:true,email:'doctor@demo.com',reqId:'REQ-ABC-1',days:['Mon','Thu'],t1:'11:00',t2:'16:00',slotMin:15,fee:800,slots:{},unav:[],hist:[{d:new Date(Date.now()-95*6e4),t:'Request sent',n:'Mon & Thu, 11 AM – 4 PM · asked for 6 months',c:'var(--amber)'}]};
 S.doctors.push(d);offs.forEach(o=>mkSlots(d,o,11,0,15,20,[],'pending'))}
function pharmReqWrite(d,kind){d.reqId='REQ-'+Date.now().toString(36).toUpperCase();dput('requests',d.reqId,{doctorCode:d.code,doctorMob:d.mob,doctorQual:d.qual,doctorReg:d.reg,ph:S.store.name,addr:S.store.addr,owner:'Anil Banerjee',phMob:S.store.ownerMob||S.store.phone,reg:S.store.dl,doctorEmail:d.email,doctorName:d.name,spec:d.spec,days:d.days,t1:d.t1,t2:d.t2,slot:d.slotMin||15,fee:+d.fee||0,mode:/Video/.test(d.mode)&&!/Pharmacy/.test(d.mode)?'Video':'In-pharmacy chamber',months:6,status:'pending',kind,at:new Date().toISOString(),note:d.note||''})}
function pharmApplyReq(id,doc,initial){const d=S.doctors.find(x=>x.reqId===id);if(!d)return false;
 if(doc.status==='approved'&&d.appr!=='approved'){d.appr='approved';d.from=days(DT(doc.since),TODAY);d.to=days(DT(doc.until),TODAY);Object.values(d.slots).forEach(s=>{if(s.status==='pending')s.status='live'});d.hist.unshift({d:new Date(),t:'Approved by doctor',n:`${doc.approvedMonths} month${doc.approvedMonths>1?'s':''} · valid until ${fd(DT(doc.until))}`,c:'var(--leaf)'});if(!initial&&!DOC.on)toast(`${d.name} approved your chamber for ${doc.approvedMonths} month${doc.approvedMonths>1?'s':''}`);return true}
 if(doc.status==='declined'&&d.appr!=='declined'){d.appr='declined';d.to=0;Object.keys(d.slots).forEach(k=>{if(d.slots[k].status==='pending')delete d.slots[k]});d.hist.unshift({d:new Date(),t:'Declined by doctor',n:doc.declineReason||'',c:'var(--sos)'});if(!initial&&!DOC.on)toast(`${d.name} declined: ${doc.declineReason||'no reason given'}`,1);return true}
 if(doc.status==='ended'&&d.appr==='approved'){d.appr='expired';d.to=0;return true}return false}
const pharmRR=()=>Object.entries(DSY.rr).map(([id,r])=>({id,...r})).filter(r=>r.ph===S.store.name&&r.status==='requested');
function pharmRRBanner(){const L=pharmRR();if(!L.length)return '';return `<div class="banner" style="background:var(--brand-tint);color:var(--brand-ink);justify-content:space-between;flex-wrap:wrap"><span class="row" style="gap:8px">${ico('file')}<b>${L.length} report request${L.length>1?'s':''} from doctors</b> · help patients upload before their consultation</span><button class="btn btn-p btn-sm" data-act="pr-rr">Open requests</button></div>`}
function bookSlotModal(d,s){modal('Book slot · '+s.t.split(' – ')[0],`<p class="muted" style="font-size:13px;margin-bottom:12px">${esc(d.name)} · ${fd(new Date(DR.sel+'T00:00'))} · ${s.t}</p><div class="fg" style="grid-template-columns:1fr 1fr"><div class="fld"><label for="bkN">Patient name</label><input class="inp" id="bkN"></div><div class="fld"><label for="bkM">Mobile</label><input class="inp" id="bkM" inputmode="numeric" maxlength="10"></div><div class="fld"><label for="bkA">Age</label><input class="inp" id="bkA" type="number"></div><div class="fld"><label for="bkG">Sex</label><select class="inp" id="bkG"><option value="M">Male</option><option value="F">Female</option></select></div><div class="fld" style="grid-column:1/-1"><label for="bkR">Reason for visit</label><input class="inp" id="bkR" placeholder="e.g. BP follow-up"></div><div class="fld"><label for="bkT">Visit type</label><select class="inp" id="bkT"><option>New</option><option>Follow-up</option></select></div></div>${d.email?`<p class="faint" style="font-size:12px;margin-top:10px">${esc(d.name)} sees this booking in their SevaDharam doctor portal straight away.</p>`:''}`,`<button class="btn btn-o" id="bkBlk">Block slot instead</button><button class="btn btn-p" id="bkGo">${ico('check')}Book patient</button>`,{icon:'calendar'});
 $('#bkBlk').onclick=()=>{s.blk=true;mclose();renderDrawer();toast('Slot blocked')};
 $('#bkGo').onclick=()=>{const n=$('#bkN').value.trim(),m=$('#bkM').value.replace(/\D/g,'');if(!n||m.length!==10){toast('Patient name and a 10-digit mobile are required',1);return}s.bk=n;const sl=d.slots[DR.sel];if(sl&&sl.list.every(x=>x.bk||x.blk))sl.status='full';
  if(d.email)dput('bookings','BKP'+Date.now().toString(36),{doctorEmail:d.email,reqId:d.reqId,ph:S.store.name,date:DR.sel,time:mt(pmin(s.t.split(' – ')[0])),patient:{name:n,mob:m,age:+$('#bkA').value||0,g:$('#bkG').value},reason:$('#bkR').value.trim()||'Consultation',type:$('#bkT').value,via:S.store.name,status:'Booked',at:new Date().toISOString()});
  mclose();renderDrawer();render();toast(`${n} booked with ${d.name} at ${s.t.split(' – ')[0]}`)}}
function pharmRRModal(){const L=pharmRR();modal('Report requests from doctors',L.length?L.map(r=>`<div class="inb" style="flex-direction:column;gap:8px"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b>${esc(r.patient.name)}</b><small class="faint">${fd(new Date(r.date+'T00:00'))} · ${t12(r.time)}</small></div><small class="muted">${esc(r.doctorName)} asks for: <b style="color:var(--fg)">${r.items.join(', ')}</b></small>${r.note?`<small class="rq-note">${esc(r.note)}</small>`:''}<small class="muted">Patient mobile +91 ${esc(r.patient.mob)}</small><div class="row" style="justify-content:flex-end"><button class="btn btn-o btn-sm" data-toast="WhatsApp reminder sent to ${esc(r.patient.name)}">${ico('whats')}Remind patient</button><button class="btn btn-p btn-sm" data-act="pr-rr-up" data-id="${r.id}">${ico('upload')}Upload for patient</button></div></div>`).join(''):'<div class="empty">No open requests.</div>',`<button class="btn btn-p" data-act="mclose">Close</button>`,{wide:1,icon:'clipboard'})}
async function pharmRRUpload(id){const r=DSY.rr[id];if(!r)return;const inp=document.createElement('input');inp.type='file';inp.accept='image/*,application/pdf';inp.multiple=true;
 inp.onchange=async()=>{const fs=[...inp.files];if(!fs.length)return;toast('Uploading '+fs.length+' file'+(fs.length>1?'s':'')+'…');const files=[];try{for(const f of fs){if(SYNC.assets){if(f.type==='application/pdf'){const u=await SYNC.assets.upload(f,{type:'application/pdf'});files.push({id:u.id,name:f.name,type:'pdf'})}else{const p=await prepImg(f);const u=await SYNC.assets.upload(p.blob,{type:'image/jpeg'});files.push({id:u.id,name:f.name,type:'img'})}}else files.push({url:URL.createObjectURL(f),name:f.name,type:f.type==='application/pdf'?'pdf':'img'})}
  dput('reportreqs',id,{...r,status:'uploaded',files,uploadedBy:S.store.name,uploadedAt:new Date().toISOString()});mclose();render();toast('Reports sent to '+r.doctorName)}catch(e){toast("Couldn't upload. Try a smaller file",1)}};inp.click()}
const DHANDLE={req(ids,initial){let ch=false;ids.forEach(id=>{const doc=DSY.req[id];if(!doc)return;if(pharmApplyReq(id,doc,initial))ch=true;if(!initial&&DOC.on&&DOC.auth&&doc.status==='pending'&&doc.doctorEmail===DOCP.email&&!REQS.find(r=>r.id===id))toast('New approval request from '+doc.ph)});dRefresh()},
 book(ids,initial){ids.forEach(id=>{const b=DSY.book[id];if(!initial&&b&&DOC.on&&DOC.auth&&b.doctorEmail===DOCP.email)toast(`New booking: ${b.patient.name} · ${fd(new Date(b.date+'T00:00'))} ${t12(b.time)} via ${b.via}`)});dRefresh()},
 rr(ids,initial){ids.forEach(id=>{const r=DSY.rr[id];if(!r||initial)return;if(r.status==='requested'&&!DOC.on&&r.ph===S.store.name)toast(`${r.doctorName} asked ${r.patient.name} for reports`);if(r.status==='uploaded'&&DOC.on&&r.doctorEmail===DOCP.email&&r.uploadedBy!=='doctor')toast(`Reports uploaded for ${r.patient.name}`)});dRefresh()}};
function dRefresh(){if(DOC.on&&DOC.auth){drender();if(DA&&$('#drawer').classList.contains('on'))agendaDraw()}else if(!PHONE.on&&$('#login').hidden){if(['doctors','dashboard'].includes(CUR))render();else renderNav(CUR);if($('#drawer').classList.contains('on')&&$('#drawer .cal')&&DR.id)renderDrawer()}}
function dsyncInit(){if(!(window.claude&&window.claude.use))return;window.claude.use('db').then(db=>{if(!db)return;
 [['requests','req'],['bookings','book'],['reportreqs','rr']].forEach(([col,key])=>{try{db.collection(col).onSnapshot(s=>{const ini=!DSY.f[key];const m={};s.docs.forEach(d=>m[d.id]=d.data());DSY[key]=m;DHANDLE[key](ini?Object.keys(m):s.docChanges().map(c=>c.doc.id),ini);DSY.f[key]=true},()=>{})}catch(e){}})}).catch(()=>{})}

/* ----- doctor portal state & shell ----- */
const DOC={on:false,auth:true,otp:false,t:0,iv:null};let DCUR='dash',DWK=0,DMO=0,DVIEW='week',DAPT='today',DFIL='',DA=null;const RQM={};const DOFF=new Set();
function enterDoctor(){if(PHONE.on)exitPhone();DOC.on=true;DOC.auth=true;document.body.classList.add('docmode');try{localStorage.setItem('sd-view','doctor')}catch(_){}setRole('doctor');if(location.hash!=='#doctor')location.hash='doctor';if($('#login'))$('#login').hidden=true;dShow()}
function exitDoctor(){DOC.on=false;document.body.classList.remove('docmode');if($('#dapp'))$('#dapp').hidden=true;if($('#shell'))$('#shell').hidden=false;dclose();try{localStorage.setItem('sd-view','desktop')}catch(_){}}
function dShow(){const dappEl=$('#dapp');if(dappEl)dappEl.hidden=false;const dn=$('#dname');if(dn)dn.textContent=DOCP.name;const ds=$('#dspec');if(ds)ds.textContent=DOCP.spec;const da=$('#dav');if(da)da.textContent=ini(DOCP.name);drender()}
const DNAV=[['Overview',[['dash','Dashboard','grid']]],['Practice',[['requests','Approval requests','alarm'],['calendar','My calendar','calendar'],['appts','Appointments','users'],['reports','Patient reports','clipboard']]],['Account',[['chambers','My chambers','hospital'],['profile','Profile','doc']]]];
function dcounts(){return{requests:pendingReqs().length,reports:books().filter(b=>{const r=rrOf(b.id);return r&&r.status==='uploaded'}).length}}
const DPAGES=['dash','requests','calendar','appts','reports','chambers','profile'];
if(options.initialTab) DCUR = options.initialTab;
function drender(pageToRender){
 const el=$('#dapp');if(!el||el.hidden)return;
 if(pageToRender && DPAGES.includes(pageToRender)) DCUR=pageToRender;
 const c=dcounts();
 const dnavEl=$('#dnav');
 if(dnavEl){
  dnavEl.innerHTML=DNAV.map(([g,items])=>`<div class="ng">${g}</div>`+items.map(([k,l,i])=>`<a class="nv ${k===DCUR?'on':''}" href="#${k}" data-dact="go" data-p="${k}"><span class="n3" data-3="${i}"></span>${l}${c[k]?`<span class="cnt ${k==='reports'?'am':''}">${c[k]}</span>`:''}</a>`).join('')).join('');
  paint3(dnavEl);
 }
 const dd=$('#ddot');if(dd){dd.textContent=c.requests;dd.hidden=!c.requests;}
 const dcontentEl=$('#dcontent');
 if(dcontentEl && typeof DPG[DCUR]==='function'){
  dcontentEl.innerHTML=DPG[DCUR]();
  paint3(dcontentEl);
 }
 if($('#dside')) $('#dside').classList.remove('open');
}
function dgo(p){
 if(!p || !DPAGES.includes(p)) return;
 DCUR=p;
 dclose();mclose();
 drender(p);
 const dcontentEl=$('#dcontent');
 if(dcontentEl) dcontentEl.scrollTop=0;
}
const dayLbl=r=>r.days.join(' & ');
const timeLbl=r=>t12(r.t1)+' – '+t12(r.t2);
function conflicts(r){return chambers().filter(c=>c.id!==r.id&&c.id!==r.renews&&c.days.some(d=>r.days.includes(d))&&m2(c.t1)<m2(r.t2)&&m2(r.t1)<m2(c.t2))}
function reqCard(r){const m=RQM[r.id]||r.months||6;const old=r.renews?reqs().find(x=>x.id===r.renews):null;const start=old&&DT(old.until)>TODAY?DT(old.until):TODAY;const cf=conflicts(r);
 return `<div class="rq ${r.kind==='renewal'?'renew':''}"><div class="rq-h"><span class="r3" data-3="${r.mode==='Video'?'phone':'hospital'}"></span><div style="flex:1;min-width:0"><b style="font-size:16px;display:block">${esc(r.ph)}</b><small class="muted">${esc(r.addr)}</small></div><div class="r" style="flex:none"><span class="chip ${r.kind==='renewal'?'info':'br'}">${r.kind==='renewal'?'Renewal request':'New chamber request'}</span><small class="faint" style="display:block;margin-top:4px">${ago(iso(r.at))}</small></div></div>
 <div class="rq-b"><div class="sched">${r.days.map(d=>`<span class="day">${d}</span>`).join('')}<span>${ico('clock','width:14px;height:14px')}${timeLbl(r)}</span><span>${r.slot}-min slots · ${Math.floor((m2(r.t2)-m2(r.t1))/r.slot)} per day</span><span>Fee ${inr0(r.fee)}</span><span>${esc(r.mode)}</span></div>
 <div class="kv" style="font-size:12.8px"><span>Pharmacy owner</span><b>${esc(r.owner||'—')} · ${esc(r.phMob||'')}</b><span>Drug licence / reg.</span><b>${esc(r.reg||'—')}</b>${old?`<span>Current approval ends</span><b>${fd(DT(old.until))}</b>`:''}</div>
 ${r.note?`<div class="rq-note">“${esc(r.note)}”</div>`:''}
 ${cf.length?`<div class="rxwarn" style="background:var(--sos-tint);color:var(--sos)">${ico('alert')}Overlaps with ${cf.map(c=>esc(c.ph)+' ('+dayLbl(c)+', '+timeLbl(c)+')').join(', ')}</div>`:''}
 <div class="rq-dur"><div><b style="font-size:13px;display:block">They asked for ${r.months} months. Approve for</b><small class="muted">Valid ${fd(start)} to <b style="color:var(--fg)">${fd(addM(start,m))}</b></small></div><div class="seg">${[1,3,6].map(n=>`<button class="${m===n?'on':''}" data-dact="rq-m" data-id="${r.id}" data-m="${n}">${n} month${n>1?'s':''}</button>`).join('')}</div></div>
 <div class="rq-f"><button class="btn btn-x" data-dact="rq-decline" data-id="${r.id}">Decline</button><button class="btn btn-ok shine" data-dact="rq-approve" data-id="${r.id}">${ico('check')}Approve for ${m} month${m>1?'s':''}</button></div></div></div>`}
const repChip=b=>{const r=rrOf(b.id);if(!r)return '<span class="faint" style="font-size:12px">No reports asked</span>';return `<span class="chip ${({requested:'warn',uploaded:'info',reviewed:'ok'})[r.status]} dot">${({requested:'Reports asked',uploaded:'Reports uploaded',reviewed:'Reports reviewed'})[r.status]}</span>`};
function patRow(b,full){const c=chOf(b);const r=rrOf(b.id);return `<div class="ag-p"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><div class="who-cell"><span class="av" style="background:${gfor(b.patient.name)}">${ini(b.patient.name)}</span><div><b>${esc(b.patient.name)}</b><small>${b.patient.age?b.patient.age+' / '+b.patient.g+' · ':''}${b.type} · ${esc(b.reason)}</small></div></div>${b.status!=='Booked'?`<span class="chip ${b.status==='Completed'?'ok':'sos'}">${b.status}</span>`:''}</div>
 <div class="row" style="gap:6px"><span class="chip mut">Booked via ${esc(b.via)}</span>${full?`<span class="chip" style="background:color-mix(in srgb,${chColor(c.ph)} 15%,var(--surface));color:var(--fg)">${esc(c.ph)}</span>`:''}${repChip(b)}</div>
 <div class="row" style="gap:6px">${(!r||r.status==='reviewed')&&b.status==='Booked'?`<button class="btn btn-g btn-sm" data-dact="rr-ask" data-id="${b.id}">${ico('file')}Ask for reports</button>`:''}${r&&r.files&&r.files.length?`<button class="btn btn-p btn-sm" data-dact="rr-view" data-id="${b.id}">${ico('eye')}View reports</button>`:''}${r&&r.status==='requested'?`<small class="faint">Asked ${ago(iso(r.at))} · waiting for upload</small>`:''}</div></div>`}

/* ----- doctor pages ----- */
const DPG={};
DPG.dash=()=>{const tk=dk(TODAY);const B=books();const today=B.filter(b=>b.date===tk&&b.status==='Booked').sort((a,b)=>m2(a.time)-m2(b.time));const wk=B.filter(b=>{const o=days(new Date(b.date+'T00:00'),TODAY);return o>=0&&o<7&&b.status==='Booked'});const toRev=B.filter(b=>rrOf(b.id)?.status==='uploaded');const P=pendingReqs();const exp=chambers().filter(c=>days(DT(c.until),TODAY)<=30);const h=new Date().getHours();
 const todayCh=chambers().filter(c=>c.days.includes(DOW[TODAY.getDay()]));
 return `<div class="page"><div class="welcome"><span class="orb" style="width:220px;height:220px;right:-60px;top:-90px;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 65%)"></span><span class="w3" data-3="doc"></span><div><h2>Good ${h<12?'morning':h<17?'afternoon':'evening'}, ${esc(DOCP.name)}</h2><p>${fd(TODAY)} · ${DOCP.spec} · ${chambers().length} active chambers</p></div><div class="row" style="margin-left:auto"><button class="btn" style="background:rgba(255,255,255,.14);color:#fff" data-dact="go" data-p="calendar">${ico('cal')}Open calendar</button></div></div>
 ${P.length?`<div class="panel" style="margin-bottom:16px;border-color:var(--brand)">${pnh(`Needs your approval <span class="chip br">${P.length}</span>`,'alarm',`<button class="link" data-dact="go" data-p="requests">All requests →</button>`)}<div class="g g2">${P.slice(0,2).map(reqCard).join('')}</div></div>`:''}
 <div class="stats" style="grid-template-columns:repeat(4,minmax(0,1fr))">${[['users',"Today's patients",today.length,todayCh.map(c=>c.ph.split(' ')[0]).join(', ')||'No chamber today','var(--brand-tint)'],['calendar','Next 7 days',wk.length,'booked consultations','var(--info-tint)'],['clipboard','Reports to review',toRev.length,'uploaded before visits','var(--plum-tint)'],['hospital','Active chambers',chambers().length,exp.length?exp.length+' ending within 30 days':'All valid','var(--leaf-tint)']].map(([i,l,v,d,a])=>`<div class="stat" style="--accent:${a}"><span class="s3" data-3="${i}"></span><span class="l">${l}</span><span class="v">${v}</span><span class="d muted">${esc(d)}</span></div>`).join('')}</div>
 <div class="g g-main"><div class="panel">${pnh("Today's consultations",'users',`<button class="link" data-dact="go" data-p="appts">All appointments →</button>`)}${today.length?today.map(b=>`<div class="ag-slot"><b>${t12(b.time)}</b>${patRow(b,true)}</div>`).join(''):`<div class="empty">No consultations booked for today.${todayCh.length?'':' You have no chamber today.'}</div>`}</div>
 <div class="stack"><div class="panel">${pnh('Reports to review','clipboard',`<button class="link" data-dact="go" data-p="reports">All →</button>`)}${toRev.slice(0,5).map(b=>`<button class="nrow" style="width:100%;text-align:left" data-dact="rr-view" data-id="${b.id}"><span class="n3" data-3="clipboard"></span><div><p><b>${esc(b.patient.name)}</b> · ${rrOf(b.id).items.join(', ')}</p><small>${fd(new Date(b.date+'T00:00'))} ${t12(b.time)} · ${esc(chOf(b).ph)}</small></div></button>`).join('')||'<div class="empty">Nothing waiting.</div>'}</div>
 ${exp.length?`<div class="panel">${pnh('Ending soon','alarm')}${exp.map(c=>`<div class="row" style="justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><span><b style="font-size:13px">${esc(c.ph)}</b><small class="faint" style="display:block">${dayLbl(c)} · ends ${fd(DT(c.until))}</small></span><span class="chip warn">${days(DT(c.until),TODAY)} days</span></div>`).join('')}</div>`:''}</div></div></div>`};
DPG.requests=()=>{const P=pendingReqs();const H=reqs().filter(r=>r.status!=='pending');return `<div class="page">${ph('Approval requests','Approval requests','Pharmacies that want to list you. You choose how long each approval lasts: 1, 3 or 6 months.')}
 ${P.length?`<div class="g g2">${P.map(reqCard).join('')}</div>`:'<div class="panel empty"><span style="width:84px;height:84px;display:block;margin:0 auto 10px" data-3="alarm"></span><b style="color:var(--fg)">All caught up</b><p>New requests from pharmacies appear here and on your dashboard.</p></div>'}
 <div class="panel" style="margin-top:16px">${pnh('Decision history','book')}<div class="tw"><table class="t"><thead><tr><th>Pharmacy</th><th>Schedule</th><th>Requested</th><th>Decision</th><th>Valid</th></tr></thead><tbody>${H.map(r=>`<tr><td>${who(r.ph,r.addr)}</td><td>${dayLbl(r)} · ${timeLbl(r)}</td><td>${fd(DT(r.at))} · ${r.months} mo</td><td>${r.status==='approved'?`<span class="chip ok dot">Approved · ${r.approvedMonths} mo</span>`:r.status==='declined'?`<span class="chip sos dot">Declined</span><small class="faint" style="display:block">${esc(r.declineReason||'')}</small>`:`<span class="chip mut">${r.status}</span>`}</td><td>${r.since?fd(DT(r.since))+' – '+fd(DT(r.until)):'—'}</td></tr>`).join('')}</tbody></table></div></div></div>`};
function weekStart(off){const d=new Date(TODAY);const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w+off*7);return d}
function blocksFor(dt){const k=dk(dt);const dw=DOW[dt.getDay()];return reqs().filter(r=>(r.status==='approved'&&dt>=new Date(dk(DT(r.since))+'T00:00')&&dt<=DT(r.until))||(r.status==='pending'&&r.kind!=='renewal'&&dt>=TODAY)).filter(r=>r.days.includes(dw))}
DPG.calendar=()=>{const B=books();let body='';
 if(DVIEW==='week'){const s=weekStart(DWK);const ds=[...Array(7)].map((_,i)=>{const d=new Date(s);d.setDate(s.getDate()+i);return d});const H0=8,H1=22,PX=48;const nowM=new Date().getHours()*60+new Date().getMinutes();
  body=`<div class="row" style="justify-content:space-between;margin-bottom:12px"><div class="row"><button class="btn btn-o btn-sm" data-dact="wk" data-d="-1" aria-label="Previous week">‹</button><b>${fd(ds[0])} – ${fd(ds[6])}</b><button class="btn btn-o btn-sm" data-dact="wk" data-d="1" aria-label="Next week">›</button>${DWK?'<button class="btn btn-g btn-sm" data-dact="wk" data-d="0">This week</button>':''}</div></div>
  <div class="wkw"><div class="wk"><div class="wk-h"></div>${ds.map(d=>`<div class="wk-h ${dk(d)===dk(TODAY)?'today':''}">${DOW[d.getDay()]}<b>${d.getDate()}</b></div>`).join('')}
  <div>${[...Array(H1-H0)].map((_,i)=>`<div class="wk-hr">${t12(mt((H0+i)*60)).replace(':00','')}</div>`).join('')}</div>
  ${ds.map(d=>{const k=dk(d);return `<div class="wk-col ${k===dk(TODAY)?'today':''}" style="height:${(H1-H0)*PX}px">${blocksFor(d).map(r=>{const top=(m2(r.t1)-H0*60)/60*PX,hh=(m2(r.t2)-m2(r.t1))/60*PX;const bk=B.filter(b=>b.reqId===r.id&&b.date===k).length;const tot=Math.floor((m2(r.t2)-m2(r.t1))/r.slot);const off=DOFF.has(r.id+'|'+k);return `<button class="blk ${r.status==='pending'?'pend':''} ${off?'off':''}" style="--c:${chColor(r.ph)};top:${top}px;height:${hh-3}px" data-dact="ag" data-k="${k}" data-r="${r.id}"><b>${esc(r.ph)}</b><small>${t12(r.t1)} – ${t12(r.t2)}</small>${r.status==='pending'?'<small style="color:var(--brand-ink)">Awaiting your approval</small>':off?'<small>Blocked</small>':`<small>${bk} of ${tot} booked</small>`}</button>`}).join('')}${k===dk(TODAY)&&nowM>H0*60&&nowM<H1*60?`<div class="nowl" style="top:${(nowM-H0*60)/60*PX}px"></div>`:''}</div>`}).join('')}</div></div>`}
 else{const base=new Date(TODAY.getFullYear(),TODAY.getMonth()+DMO,1);const first=(base.getDay()+6)%7,dim=new Date(base.getFullYear(),base.getMonth()+1,0).getDate();let cells=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<div class="dw">${x}</div>`).join('')+'<div></div>'.repeat(first);
  for(let n=1;n<=dim;n++){const d=new Date(base.getFullYear(),base.getMonth(),n);const k=dk(d);const bl=blocksFor(d);cells+=`<button class="${k===dk(TODAY)?'today':''} ${d<TODAY?'past':''}" data-dact="ag" data-k="${k}"><b>${n}</b>${bl.map(r=>`<i style="--c:${chColor(r.ph)}">${r.status==='pending'?'? ':''}${esc(r.ph.split(' ')[0])} · ${B.filter(b=>b.reqId===r.id&&b.date===k).length}</i>`).join('')}</button>`}
  body=`<div class="row" style="justify-content:space-between;margin-bottom:12px"><div class="row"><button class="btn btn-o btn-sm" data-dact="mo" data-d="-1" aria-label="Previous month">‹</button><b>${MON[base.getMonth()]} ${base.getFullYear()}</b><button class="btn btn-o btn-sm" data-dact="mo" data-d="1" aria-label="Next month">›</button></div></div><div class="mo">${cells}</div>`}
 const legend=reqs().filter(r=>r.status==='approved'&&DT(r.until)>=TODAY||r.status==='pending'&&r.kind!=='renewal');
 return `<div class="page">${ph('Calendar','My calendar','Which pharmacy chamber you sit in, on which day and time, and who has booked. Tap a block to see the patients.',`<div class="seg"><button class="${DVIEW==='week'?'on':''}" data-dact="view" data-v="week">Week</button><button class="${DVIEW==='month'?'on':''}" data-dact="view" data-v="month">Month</button></div>`)}
 <div class="legend3" style="margin-bottom:12px">${legend.map(r=>`<span><i style="--c:${chColor(r.ph)}"></i>${esc(r.ph)}${r.status==='pending'?' (awaiting approval)':''}</span>`).join('')}</div>${body}</div>`};
function agendaDraw(){if(!DA)return;const d=new Date(DA.k+'T00:00');const B=books();const L=blocksFor(d).filter(r=>!DA.r||r.id===DA.r);
 drawer(`<div class="dr-h"><span style="width:46px;height:46px;flex:none;display:block" data-3="calendar"></span><div><b style="font-size:16px">${DOW[d.getDay()]}, ${fd(d)}</b><small class="muted" style="display:block">${L.length} chamber${L.length!==1?'s':''} · ${B.filter(b=>b.date===DA.k).length} patients</small></div><button class="icon-btn" style="margin-left:auto" data-act="dclose" aria-label="Close">${ico('x')}</button></div>
 <div class="dr-b">${L.map(r=>{const slots=[];for(let m=m2(r.t1);m<m2(r.t2);m+=r.slot)slots.push(mt(m));const off=DOFF.has(r.id+'|'+DA.k);return `<div class="panel" style="padding:14px;margin-bottom:14px;border-top:4px solid ${chColor(r.ph)}"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div><b>${esc(r.ph)}</b><small class="muted" style="display:block">${esc(r.addr)}</small><small class="faint">${timeLbl(r)} · ${r.slot}-min slots · ${esc(r.mode)}</small></div>${r.status==='approved'&&d>=TODAY?`<button class="btn ${off?'btn-g':'btn-x'} btn-sm" data-dact="ag-off" data-id="${r.id}">${off?'Unblock day':'Block this day'}</button>`:''}</div>
 ${r.status==='pending'?`<div class="rxwarn" style="margin-top:10px">${ico('alert')}Awaiting your approval. Patients can't book until you approve. <button class="link" data-dact="go" data-p="requests">Review request</button></div>`:off?`<div class="rxwarn" style="margin-top:10px;background:var(--sos-tint);color:var(--sos)">${ico('alert')}You blocked this day. ${esc(r.ph)} can't book patients.</div>`:slots.map(t=>{const b=B.find(x=>x.reqId===r.id&&x.date===DA.k&&x.time===t);return `<div class="ag-slot"><b>${t12(t)}</b>${b?patRow(b,false):'<span class="ag-free">Open slot</span>'}</div>`}).join('')}</div>`}).join('')||'<div class="empty">No chamber on this day.</div>'}</div>`)}
DPG.appts=()=>{const tk=dk(TODAY);const B=books().filter(b=>(DAPT==='today'?b.date===tk:DAPT==='up'?b.date>tk:b.date<tk)&&(!DFIL||b.reqId===DFIL)).sort((a,b)=>DAPT==='past'?(b.date+b.time<a.date+a.time?-1:1):(a.date+a.time<b.date+b.time?-1:1));
 return `<div class="page">${ph('Appointments','Appointments','Every booking, the chamber it is in, and which pharmacy or app it came through.')}
 <div class="filters"><div class="seg">${[['today','Today'],['up','Upcoming'],['past','Past']].map(([k,l])=>`<button class="${DAPT===k?'on':''}" data-dact="apt" data-k="${k}">${l}</button>`).join('')}</div><select class="inp" id="dfil"><option value="">All chambers</option>${reqs().filter(r=>r.status==='approved').map(r=>`<option value="${r.id}" ${DFIL===r.id?'selected':''}>${esc(r.ph)}</option>`).join('')}</select></div>
 <div class="panel"><div class="tw"><table class="t"><thead><tr><th>Date & time</th><th>Patient</th><th>Chamber</th><th>Booked via</th><th>Visit</th><th>Reports</th><th class="r"></th></tr></thead><tbody>${B.slice(0,80).map(b=>{const c=chOf(b);const r=rrOf(b.id);return `<tr><td class="nowrap"><b>${fd(new Date(b.date+'T00:00'))}</b><small class="faint" style="display:block">${t12(b.time)}</small></td><td>${who(b.patient.name,(b.patient.age?b.patient.age+' / '+b.patient.g+' · ':'')+'+91 '+String(b.patient.mob).replace(/(\d{5})(\d{5})/,'$1 $2'))}</td><td><span class="row" style="gap:6px;flex-wrap:nowrap"><i style="width:10px;height:10px;border-radius:3px;background:${chColor(c.ph)};flex:none"></i>${esc(c.ph)}</span></td><td>${esc(b.via)}</td><td>${b.type}<small class="faint" style="display:block">${esc(b.reason)}</small></td><td>${repChip(b)}</td><td class="r nowrap">${b.status!=='Booked'?`<span class="chip ${b.status==='Completed'?'ok':'sos'}">${b.status}</span> `:''}${r&&r.files&&r.files.length?`<button class="btn btn-p btn-sm" data-dact="rr-view" data-id="${b.id}">View reports</button>`:(!r||r.status==='reviewed')&&b.status==='Booked'?`<button class="btn btn-g btn-sm" data-dact="rr-ask" data-id="${b.id}">Ask for reports</button>`:''}</td></tr>`}).join('')||'<tr><td colspan="7" class="empty">No appointments here.</td></tr>'}</tbody></table></div></div></div>`};
DPG.reports=()=>{const B=books();const col=(st,t,c)=>{const L=B.filter(b=>rrOf(b.id)?.status===st).sort((a,b)=>a.date+a.time<b.date+b.time?-1:1);return `<div class="tri-col"><div class="tri-h"><span><i style="background:var(--${c})"></i>${t}</span><span class="chip mut">${L.length}</span></div>${L.map(b=>{const r=rrOf(b.id);return `<div class="tri-card" style="--c:var(--${c})"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b>${esc(b.patient.name)}</b><small class="faint nowrap">${fd(new Date(b.date+'T00:00')).slice(0,6)} · ${t12(b.time)}</small></div><small class="muted">${esc(chOf(b).ph)}</small><div class="vit">${r.items.map(i=>`<span>${i}</span>`).join('')}</div>${r.uploadedBy?`<small class="faint">Uploaded by ${esc(r.uploadedBy)}</small>`:`<small class="faint">Asked ${ago(iso(r.at))}</small>`}${r.files&&r.files.length?`<button class="btn btn-p btn-sm" data-dact="rr-view" data-id="${b.id}">${ico('eye')}${st==='reviewed'?'Open':'Review'}</button>`:`<button class="btn btn-o btn-sm" data-dact="rr-remind" data-id="${b.id}">${ico('whats')}Remind patient</button>`}</div>`}).join('')||'<div class="empty" style="padding:16px">None</div>'}</div>`};
 return `<div class="page">${ph('Patient reports','Patient reports','Reports you asked patients for before their consultation. Patients upload from the SevaDharam app, or the pharmacy uploads for them.')}<div class="tri" style="grid-template-columns:repeat(3,minmax(0,1fr))">${col('requested','Waiting for upload','amber')}${col('uploaded','Ready to review','info')}${col('reviewed','Reviewed','leaf')}</div></div>`};
DPG.chambers=()=>{const C=chambers();return `<div class="page">${ph('My chambers','My chambers','Pharmacies you are approved at, how long each approval lasts, and upcoming bookings.')}
 <div class="chs">${C.map(c=>{const tot=days(DT(c.until),DT(c.since))||1;const left=days(DT(c.until),TODAY);const nx=books().filter(b=>b.reqId===c.id&&b.date>=dk(TODAY)&&b.status==='Booked').length;const ren=pendingReqs().find(r=>r.renews===c.id);return `<div class="ch" style="--c:${chColor(c.ph)}"><div class="row" style="gap:12px;flex-wrap:nowrap"><span style="width:44px;height:44px;flex:none;display:block" data-3="${c.mode==='Video'?'phone':'hospital'}"></span><div style="flex:1;min-width:0"><b style="font-size:15px">${esc(c.ph)}</b><small class="muted" style="display:block">${esc(c.addr)}</small></div><span class="chip ${left<=30?'warn':'ok'} dot">${left} days left</span></div>
 <div class="sched">${c.days.map(d=>`<span class="day">${d}</span>`).join('')}<span>${timeLbl(c)}</span><span>${c.slot} min</span><span>${inr0(c.fee)}</span></div>
 <div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(3,Math.min(100,(1-left/tot)*100))}%;${left<=30?'background:var(--amber)':''}"></div></div><small class="faint">Approved ${c.approvedMonths} month${c.approvedMonths>1?'s':''} · ${fd(DT(c.since))} to ${fd(DT(c.until))}</small></div>
 <div class="kv" style="font-size:12.8px"><span>Upcoming bookings</span><b>${nx}</b><span>Pharmacy contact</span><b>${esc(c.owner)} · ${esc(c.phMob)}</b></div>
 <div class="row" style="gap:8px">${ren?`<button class="btn btn-p btn-sm" data-dact="go" data-p="requests">Renewal waiting · review</button>`:''}<button class="btn btn-o btn-sm" data-dact="ch-cal" data-id="${c.id}">${ico('cal')}See in calendar</button><button class="btn btn-x btn-sm" data-dact="ch-end" data-id="${c.id}">End approval</button></div></div>`}).join('')||'<div class="panel empty">No active chambers yet. Approve a pharmacy request to start.</div>'}</div></div>`};
DPG.profile=()=>`<div class="page">${ph('Profile','Profile','How pharmacies and patients see you on SevaDharam.')}
 <div class="g g2"><div class="panel"><div class="ptop" style="margin-bottom:14px"><span class="av" style="background:${gfor(DOCP.name)}">${ini(DOCP.name)}</span><div><h2>${esc(DOCP.name)}</h2><div class="muted" style="font-size:13px">${esc(DOCP.qual)}</div><div class="tags"><span class="chip br">${esc(DOCP.spec)}</span><span class="chip ok dot">Verified · ${esc(DOCP.reg)}</span></div></div></div>
 <div class="fg" style="grid-template-columns:1fr 1fr">${[['Full name','name'],['Specialty','spec'],['Qualifications','qual'],['Medical council reg. no.','reg'],['Mobile','mob'],['Default fee (₹)','fee']].map(([l,k])=>`<div class="fld"><label>${l}</label><input class="inp" data-dp="${k}" value="${esc(DOCP[k])}"></div>`).join('')}<div class="fld"><label>Email</label><input class="inp" data-dp="email" value="${esc(DOCP.email)}"></div><div class="fld"><label>Doctor login code</label><div class="dcode sm">${DOCP.code}</div><small class="faint">Generated ${DOCP.codeAt?fd(DT(DOCP.codeAt)):""} when ${esc(DOCP.firstBy||"a pharmacy")} first added you. Same code for every pharmacy.</small></div></div><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-p" data-dact="dp-save">Save profile</button></div></div>
 <div class="panel">${pnh('Notifications','alarm')}<div class="checks" style="flex-direction:column;gap:10px"><label><input type="checkbox" checked>New approval requests · WhatsApp + app</label><label><input type="checkbox" checked>New bookings · app</label><label><input type="checkbox" checked>Reports uploaded by patients · app</label><label><input type="checkbox">Daily schedule summary at 8 AM · WhatsApp</label></div><p class="faint" style="font-size:12px;margin-top:14px">Approvals end on their own after the period you choose. You get a reminder 15 days before.</p></div></div></div>`;

/* ----- report viewer ----- */
function mockReport(kind,p){const L=(rows)=>`<table style="width:100%;border-collapse:collapse;font-size:12.5px">${rows.map(([n,v,u,r,f])=>`<tr><td style="padding:5px 4px;border-bottom:1px solid var(--line)">${n}</td><td style="padding:5px 4px;border-bottom:1px solid var(--line);text-align:right;font-weight:800;color:${f?'var(--sos)':'inherit'}">${v}</td><td style="padding:5px 4px;border-bottom:1px solid var(--line);color:var(--muted)">${u}</td><td style="padding:5px 4px;border-bottom:1px solid var(--line);color:var(--muted)">${r}</td></tr>`).join('')}</table>`;
 const ecg=()=>{let d='M0 60';for(let x=0;x<760;x+=95)d+=` L${x+20} 60 L${x+26} 54 L${x+32} 60 L${x+40} 60 L${x+44} 66 L${x+48} 14 L${x+53} 78 L${x+57} 60 L${x+70} 60 L${x+78} 48 L${x+88} 60 L${x+95} 60`;return `<svg class="ecg" viewBox="0 0 760 120" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#C81E1E" stroke-width="1.6"/></svg>`};
 const body={'ECG':ecg()+'<p style="font-size:12.5px;margin-top:6px"><b>Machine read:</b> Sinus rhythm, rate 78/min. Non-specific ST-T changes in V4–V6.</p>','Lipid profile':L([['Total cholesterol',224,'mg/dL','< 200',1],['Triglycerides',182,'mg/dL','< 150',1],['HDL',39,'mg/dL','> 40',1],['LDL',149,'mg/dL','< 100',1]]),'HbA1c / blood sugar':L([['HbA1c',7.4,'%','4.0 – 5.6',1],['Fasting glucose',138,'mg/dL','70 – 100',1]]),'Kidney function test':L([['Creatinine',1.1,'mg/dL','0.6 – 1.3'],['Urea',32,'mg/dL','15 – 40'],['Potassium',4.6,'mmol/L','3.5 – 5.1']]),'Echo report':'<p style="font-size:12.8px">LVEF 52%. Mild LV diastolic dysfunction (grade I). No regional wall motion abnormality. Valves normal.</p>','Previous prescriptions':'<div style="font-family:\'Segoe Print\',\'Bradley Hand\',cursive;font-size:14px;line-height:1.9">Tab Telmisartan 40 mg  0-0-1<br>Tab Atorvastatin 20 mg  0-0-1<br>Tab Aspirin 75 mg  0-1-0</div>','Chest X-ray':'<p style="font-size:12.8px">Heart size within normal limits. Lung fields clear.</p>','Discharge summary':'<p style="font-size:12.8px">Admitted with unstable angina; PTCA to LAD done. Discharged stable on dual antiplatelets.</p>'}[kind]||'<p class="muted">Scanned document</p>';
 return `<div class="repfile"><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>${kind}</b><small class="faint">${esc(p.name)} · ${fd(addD(-12))}</small></div>${body}</div>`}
function rrViewModal(id){const b=books().find(x=>x.id===id);const r=rrOf(id);const c=chOf(b);
 modal('Reports · '+b.patient.name,`<div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="muted" style="font-size:13px">${fd(new Date(b.date+'T00:00'))} · ${t12(b.time)} · ${esc(c.ph)} · ${esc(b.reason)}</span>${repChip(b)}</div>
 ${r.files.map(f=>f.kind?mockReport(f.kind,b.patient):f.type==='pdf'?`<div class="repfile"><b>${esc(f.name)}</b><p style="margin-top:6px"><a class="btn btn-o btn-sm" href="${f.id?'/_blob/'+f.id:f.url}" target="_blank" rel="noopener">${ico('eye')}Open PDF</a></p></div>`:`<div class="repfile"><b style="display:block;margin-bottom:8px">${esc(f.name||'Photo')}</b><img src="${f.id?'/_blob/'+f.id:f.url}" alt="${esc(f.name||'Report')}"></div>`).join('')}
 <small class="faint">Uploaded by ${esc(r.uploadedBy||'patient')}</small>
 <div class="fld" style="margin-top:12px"><label for="rrN">Your note (optional)</label><textarea class="inp" id="rrN" rows="2" placeholder="e.g. Bring the original ECG to the visit">${esc(r.docNote||'')}</textarea></div>`,
 `${r.status!=='reviewed'?`<button class="btn btn-ok" data-dact="rr-done" data-id="${id}">${ico('check')}Mark reviewed</button>`:''}<button class="btn btn-p" data-act="mclose">Close</button>`,{wide:1,icon:'clipboard'})}
function rrAskModal(id){const b=books().find(x=>x.id===id);const c=chOf(b);
 modal('Ask for reports · '+b.patient.name,`<p class="muted" style="font-size:13px;margin-bottom:12px">${fd(new Date(b.date+'T00:00'))} · ${t12(b.time)} · ${esc(c.ph)} · ${esc(b.reason)}</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px">${RITEMS.map((it,i)=>`<label class="cust-pick" style="padding:9px 12px;gap:8px;font-size:13px;font-weight:600"><input type="checkbox" data-ri="${it}" ${i<2?'checked':''}>${it}</label>`).join('')}</div><div class="fld" style="margin-top:12px"><label for="rrNote">Message to the patient</label><input class="inp" id="rrNote" value="Please upload your recent reports before our consultation."></div><p class="faint" style="font-size:12px;margin-top:10px">The patient gets this on the SevaDharam app and WhatsApp. ${c.mode==='Video'?'':esc(c.ph)+' is told too, so they can upload for the patient.'}</p>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" data-dact="rr-send" data-id="${id}">${ico('send')}Send request</button>`,{wide:1,icon:'clipboard'})}

/* ----- doctor actions ----- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-dact]');if(!t)return;const a=t.dataset.dact,id=t.dataset.id;if(t.tagName==='A')e.preventDefault();const r3=t.querySelector('[data-3]');if(r3)boing(r3);
 const X={
  go(){const p=t.dataset.p||'dash';dgo(p);},
  menu(){$('#dside').classList.toggle('open')},
  logout(){if(options.onLogout){options.onLogout();return}DOC.auth=false;DOC.otp=false;dclose();$('#dapp').hidden=true;$('#login').hidden=false;dResetOtp();toast('Signed out')},
  'rq-m'(){RQM[id]=+t.dataset.m;drender()},
  'rq-approve'(){const r=reqs().find(x=>x.id===id);const m=RQM[id]||r.months||6;const old=r.renews?reqs().find(x=>x.id===r.renews):null;const start=old&&DT(old.until)>TODAY?DT(old.until):new Date(TODAY);const until=addM(start,m);
   const base=REQS.find(x=>x.id===id)||{};dput('requests',id,{...base,...DSY.req[id],status:'approved',approvedMonths:m,since:iso(start),until:iso(until),decidedAt:new Date().toISOString(),at:iso(r.at)});
   if(old){const ob=REQS.find(x=>x.id===old.id)||{};dput('requests',old.id,{...ob,...DSY.req[old.id],status:'approved',approvedMonths:old.approvedMonths,since:iso(old.since),until:iso(until),at:iso(old.at)})}
   mclose();toast(`${r.ph} can book your ${dayLbl(r)} slots until ${fd(until)}`)},
  'rq-decline'(){const r=reqs().find(x=>x.id===id);modal('Decline · '+r.ph,`<div class="fld"><label for="dcR">Reason (the pharmacy sees this)</label><select class="inp" id="dcR"><option>Timing doesn't suit me</option><option>Already committed at this time</option><option>Too far from my clinic</option><option>Please suggest another day</option><option>Other</option></select></div><div class="fld" style="margin-top:12px"><label for="dcN">Note (optional)</label><input class="inp" id="dcN" placeholder="e.g. Tuesday evenings would work"></div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-x" id="dcGo">Decline request</button>`,{icon:'alarm'});
   $('#dcGo').onclick=()=>{const reason=$('#dcR').value+($('#dcN').value.trim()?' · '+$('#dcN').value.trim():'');const base=REQS.find(x=>x.id===id)||{};dput('requests',id,{...base,...DSY.req[id],status:'declined',declineReason:reason,decidedAt:new Date().toISOString(),at:iso(r.at)});mclose();toast('Declined. '+r.ph+' has been told.')}},
  wk(){const d=+t.dataset.d;DWK=d===0?0:DWK+d;drender()},
  mo(){DMO+=+t.dataset.d;drender()},
  view(){DVIEW=t.dataset.v;drender()},
  ag(){DA={k:t.dataset.k,r:t.dataset.r||null};agendaDraw()},
  'ag-off'(){const k=id+'|'+DA.k;const has=books().some(b=>b.reqId===id&&b.date===DA.k&&b.status==='Booked');if(DOFF.has(k))DOFF.delete(k);else{if(has){toast('Patients are booked that day. Ask the pharmacy to reschedule them first.',1);return}DOFF.add(k)}agendaDraw();drender();toast(DOFF.has(k)?'Day blocked · the pharmacy is told':'Day unblocked')},
  apt(){DAPT=t.dataset.k;drender()},
  'rr-ask'(){rrAskModal(id)},
  'rr-send'(){const b=books().find(x=>x.id===id);const items=$$('[data-ri]:checked').map(x=>x.dataset.ri);if(!items.length){toast('Pick at least one report',1);return}const c=chOf(b);dput('reportreqs',id,{bookingId:id,doctorEmail:DOCP.email,doctorName:DOCP.name,ph:c.ph,patient:b.patient,date:b.date,time:b.time,items,note:$('#rrNote').value.trim(),status:'requested',files:[],at:new Date().toISOString()});mclose();if(DA)agendaDraw();toast('Request sent to '+b.patient.name+(c.mode==='Video'?'':' and '+c.ph))},
  'rr-view'(){rrViewModal(id)},
  'rr-done'(){const b=books().find(x=>x.id===id);const r=rrOf(id);dput('reportreqs',id,{bookingId:id,doctorEmail:DOCP.email,doctorName:DOCP.name,ph:chOf(b).ph,patient:b.patient,date:b.date,time:b.time,items:r.items,note:r.note||'',files:r.files,uploadedBy:r.uploadedBy||'',at:iso(r.at),status:'reviewed',docNote:$('#rrN').value.trim()});mclose();toast('Marked reviewed')},
  'rr-remind'(){const b=books().find(x=>x.id===id);toast('Reminder sent to '+b.patient.name+' on WhatsApp')},
  'ch-cal'(){const c=reqs().find(x=>x.id===id);DCUR='calendar';DVIEW='week';DWK=0;drender();toast('Showing '+c.ph+' in this week')},
  'ch-end'(){const c=reqs().find(x=>x.id===id);const has=books().some(b=>b.reqId===id&&b.date>=dk(TODAY)&&b.status==='Booked');modal('End approval · '+c.ph,`<p style="font-size:13.5px">${esc(c.ph)} will no longer be able to book your ${dayLbl(c)} slots.</p>${has?`<div class="rxwarn" style="margin-top:12px;background:var(--sos-tint);color:var(--sos)">${ico('alert')}Patients are already booked. They stay booked; ending stops new bookings only.</div>`:''}`,`<button class="btn btn-o" data-act="mclose">Keep</button><button class="btn btn-x" id="ceGo">End approval</button>`,{icon:'hospital'});$('#ceGo').onclick=()=>{const base=REQS.find(x=>x.id===id)||{};dput('requests',id,{...base,...DSY.req[id],status:'ended',since:iso(c.since),until:iso(TODAY),at:iso(c.at)});mclose();toast('Approval ended for '+c.ph)}},
  'dp-save'(){$$('[data-dp]').forEach(el=>DOCP[el.dataset.dp]=el.value);dShow();toast('Profile saved')},
 };X[a]&&X[a]()});
document.addEventListener('change',e=>{if(e.target.id==='dfil'){DFIL=e.target.value;drender()}});
Object.assign(MODA,{'pr-rr'(){pharmRRModal()},'pr-rr-up'(t){pharmRRUpload(t.dataset.id)},
 'add-doctor'(){modal('Add doctor',`<div class="fg" style="grid-template-columns:1fr 1fr"><div class="fld"><label>Full name</label><input class="inp" id="adN" value="Dr. "></div><div class="fld"><label>Doctor's SevaDharam email</label><input class="inp" id="adE" type="email" placeholder="doctor@example.com"></div><div class="fld"><label>Qualification</label><input class="inp" id="adQ" placeholder="MBBS, MD"></div><div class="fld"><label>Specialty</label><select class="inp" id="adS">${['General Physician','Cardiologist','Diabetologist','Pediatrician','Gynecologist','Orthopedic','Dermatologist','ENT'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="fld"><label>Registration no.</label><input class="inp" id="adR"></div><div class="fld"><label>Mobile</label><input class="inp" id="adM" inputmode="numeric" maxlength="10"></div></div>
 <div class="fld" style="margin-top:14px"><label>Chamber days</label><div class="checks">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<label><input type="checkbox" data-ad="${d}" ${['Mon','Thu'].includes(d)?'checked':''}>${d}</label>`).join('')}</div></div>
 <div class="fg" style="grid-template-columns:repeat(4,1fr);margin-top:12px"><div class="fld"><label>From</label><input class="inp" type="time" id="adT1" value="11:00"></div><div class="fld"><label>To</label><input class="inp" type="time" id="adT2" value="16:00"></div><div class="fld"><label>Slot</label><select class="inp" id="adSl"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></div><div class="fld"><label>Fee (₹)</label><input class="inp" type="number" id="adF" value="600"></div></div>
 <div class="fld" style="margin-top:12px"><label for="adNote">Message to the doctor (optional)</label><input class="inp" id="adNote" placeholder="e.g. We have a private room and ECG"></div>
 <div class="banner" style="margin:12px 0 0">${ico('alert')}The request asks for 6 months. The doctor chooses 1, 3 or 6 months in their SevaDharam doctor portal.</div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="adGo">${ico('send')}Send approval request</button>`,{wide:1,icon:'doc'});
  $('#adGo').onclick=()=>{const v=k=>$('#'+k).value.trim();const dys=$$('[data-ad]:checked').map(x=>x.dataset.ad);const email=v('adE').toLowerCase();const mob=v('adM').replace(/\D/g,'');if(v('adN').length<5||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){toast("Enter the doctor's name and email",1);return}if(mob.length!==10){toast("Enter the doctor's 10-digit mobile. The login OTP goes there.",1);return}
   const ex=S.doctors.find(x=>x.code&&(x.email===email||String(x.mob).replace(/\D/g,'')===mob))||(Object.values(DSY.req).find(x=>x.doctorCode&&(x.doctorEmail===email||String(x.doctorMob).replace(/\D/g,'')===mob)));const exCode=ex?(ex.code||ex.doctorCode):null;if(!dys.length){toast('Pick at least one day',1);return}if(m2(v('adT2'))<=m2(v('adT1'))){toast('End time must be after start time',1);return}
   const d={id:'d'+(S.doctors.length+1),code:exCode||genCode(v('adN')),codeBy:exCode?(ex.codeBy||ex.ph):S.store.name,codeAt:exCode?(ex.codeAt||DT(ex.at)):new Date(),name:v('adN'),qual:v('adQ')||'—',spec:v('adS'),reg:v('adR')||'—',mob:mob.replace(/(\d{5})(\d{5})/,'$1 $2'),mode:'In-Pharmacy',appr:'pending',sent:0,active:true,email,days:dys,t1:v('adT1'),t2:v('adT2'),slotMin:+v('adSl'),fee:+v('adF'),note:v('adNote'),slots:{},unav:[],hist:[{d:new Date(),t:'Request sent',n:dys.join(' & ')+', '+t12(v('adT1'))+' – '+t12(v('adT2'))+' · asked for 6 months',c:'var(--amber)'}]};
   const td=TODAY.getDay();const[h,mm]=d.t1.split(':').map(Number);const n=Math.floor((m2(d.t2)-m2(d.t1))/d.slotMin);for(let i=0;i<14;i++)if(dys.includes(DOW[(td+i)%7]))mkSlots(d,i,h,mm,d.slotMin,n,[],'pending');
   S.doctors.push(d);pharmReqWrite(d,'new');render();codeModal(d,!!exCode)}}});
function codeModal(d,reused){const msg=`Namaste ${d.name}, ${S.store.name} has added you on SevaDharam. Log in to the Doctor's Platform with code ${d.code} and the OTP sent to this number.`;
 modal(reused?'Request sent':'Doctor code generated',`<div style="text-align:center;padding:6px 0 4px"><span style="width:64px;height:64px;display:block;margin:0 auto 10px" data-3="lock3"></span><small class="muted">${reused?`${esc(d.name)} is already on SevaDharam (code first generated by ${esc(d.codeBy)}). Your approval request was sent.`:`This is ${esc(d.name)}'s login code for the SevaDharam Doctor's Platform. It is created once, by the first pharmacy that adds the doctor, and stays the same for every pharmacy.`}</small>
 <div class="dcode">${d.code}</div><small class="faint" style="display:block">Login: this code + OTP on ${maskMob(d.mob)}</small></div>${reused?'':`<div class="rq-note" style="margin-top:12px;font-style:normal">${esc(msg)}</div>`}`,
 `${reused?'':`<button class="btn btn-o" id="dcCopy">${ico('file')}Copy message</button><button class="btn btn-o" data-toast="Code sent to ${esc(d.name)} by SMS">${ico('send')}Send SMS</button><button class="btn btn-g" data-toast="Code sent to ${esc(d.name)} on WhatsApp">${ico('whats')}WhatsApp</button>`}<button class="btn btn-p" data-act="mclose">Done</button>`,{icon:'doc'});
 const cp=$('#dcCopy');if(cp)cp.onclick=()=>{try{navigator.clipboard.writeText(msg).then(()=>toast('Message copied'),()=>toast('Copy blocked. Select the text instead',1))}catch(_){toast('Copy blocked. Select the text instead',1)}}}
/* ----- login: Pharmacy / Doctor / Patient ----- */
let ROLE='pharmacy';
function setRole(r){ROLE=r;$$('[data-role]').forEach(b=>b.classList.toggle('on',b.dataset.role===r));if($('#lgPharm'))$('#lgPharm').hidden=r!=='pharmacy';if($('#lgDoc'))$('#lgDoc').hidden=r!=='doctor';if($('#viewSeg'))$('#viewSeg').style.visibility=r==='pharmacy'?'visible':'hidden';if($('#lgH'))$('#lgH').textContent=r==='doctor'?"Doctor's Platform":'Pharmacy Login';if($('#lgP'))$('#lgP').textContent=r==='doctor'?'Enter the doctor code you received when a pharmacy first added you. We send an OTP to your registered mobile.':"Log in with your registered pharmacy details. An OTP goes to the owner's mobile."}
function dResetOtp(){DOC.otp=false;clearInterval(DOC.iv);if($('#dOtpWrap'))$('#dOtpWrap').hidden=true;DLOG=null;if($('#dGo'))$('#dGo').textContent='Send OTP';$$('[data-dotp]').forEach(i=>i.value='')}
let DLOG=null;
function docSubmit(){const code=$('#dCode')?.value?.trim().toUpperCase();if(!code||!/^SDDR-[A-Z0-9]{6}$/.test(code)){toast('Enter your doctor code, e.g. SDDR-AS4821',1);$('#dCode')?.focus();return}
 const who=codeLookup(code);if(!who){toast('Code not found. Ask the pharmacy that added you to resend it.',1);return}
 if(!DOC.otp||!DLOG||DLOG.code!==code){DLOG=who;DOC.otp=true;DOC.t=30;if($('#dOtpWrap'))$('#dOtpWrap').hidden=false;if($('#dWho'))$('#dWho').innerHTML=`<b>${esc(who.name)}</b> · OTP sent to ${maskMob(who.mob)}`;if($('#dGo'))$('#dGo').textContent='Verify OTP & sign in';$$('[data-dotp]').forEach(i=>i.value='');$('[data-dotp="0"]')?.focus();toast('OTP sent to '+maskMob(who.mob));clearInterval(DOC.iv);const tick=()=>{if($('#dOtpT'))$('#dOtpT').innerHTML=DOC.t?`Resend OTP in ${DOC.t}s`:'<button type="button" class="link" id="dRes">Resend OTP</button>';if(!DOC.t)clearInterval(DOC.iv);DOC.t=Math.max(0,DOC.t-1)};tick();DOC.iv=setInterval(tick,1000);return}
 const otp=$$('[data-dotp]').map(i=>i.value).join('');if(otp.length<6){toast('Enter the 6-digit OTP',1);return}
 if(code!==DOCP.code)Object.assign(DOCP,{code,name:who.name,email:who.email,mob:who.mob,spec:who.spec||'Doctor',qual:who.qual||'Add your qualifications',reg:who.reg||'—',fee:who.fee||DOCP.fee,firstBy:who.firstBy,codeAt:who.codeAt});
 DOC.auth=true;dResetOtp();if($('#login'))$('#login').hidden=true;enterDoctor();toast('Welcome, '+DOCP.name)}
$$('[data-role]').forEach(b=>b.addEventListener('click',()=>{const r=b.dataset.role;if(r==='patient'){toast('Patients sign in on the SevaDharam patient app');return}if(r==='doctor'){if(!DOC.on)enterDoctor();else setRole('doctor')}else{if(DOC.on){exitDoctor();location.hash='dashboard'}setRole('pharmacy')}}));
$('#dGo')?.addEventListener('click',docSubmit);
$('#lgDoc')?.addEventListener('click',e=>{if(e.target.id==='dRes'){DOC.otp=false;docSubmit()}});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.dotp!==undefined){t.value=t.value.replace(/\D/g,'').slice(-1);if(t.value){const n=$(`[data-dotp="${+t.dataset.dotp+1}"]`);if(n)n.focus();else docSubmit()}}});
document.addEventListener('keydown',e=>{const t=e.target;if(t.dataset&&t.dataset.dotp!==undefined&&e.key==='Backspace'&&!t.value)$(`[data-dotp="${+t.dataset.dotp-1}"]`)?.focus()});
// hashchange doctor listener disabled for SPA stability

/* ================= ROUTER ================= */
const PAGES=Object.keys(PG);
let CUR=options.initialTab || 'dashboard';
function render(pageToRender){
 if(pageToRender && PAGES.includes(pageToRender)) CUR = pageToRender;
 if(CUR!=='attendance'){AU.on=false;BIO.scan=false;BIO.msg=null}
 renderNav(CUR);
 const contentEl=$('#content');
 if(contentEl){
   contentEl.innerHTML = (typeof PG[CUR] === 'function' ? PG[CUR]() : PG.dashboard());
   paint3(contentEl);
 }
 $$('[data-count]').forEach(el=>{const raw=el.dataset.count;const n=parseFloat(raw.replace(/[^\d.]/g,''));if(!n||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const pre=raw.startsWith('₹')?'₹':'';const t0=performance.now();const step=t=>{const p=Math.min((t-t0)/700,1);el.textContent=pre+Math.round(n*(1-Math.pow(1-p,3))).toLocaleString('en-IN');if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)});
 if(CUR==='billing')bindPOS();
 if(CUR==='attendance'&&!AU.on)setTimeout(()=>$('[data-apin="0"]')?.focus(),60);
 if($('#side')) $('#side').classList.remove('open');
}
function go(p){
 if(!p || !PAGES.includes(p)) return;
 CUR=p;
 render(p);
 const contentEl=$('#content');
 if(contentEl) contentEl.scrollTop=0;
}
// hashchange render listener disabled for SPA stability

function bindPOS(){
 const q=$('#pq');if(!q)return;
 q.addEventListener('input',e=>{PQ=e.target.value;PHL=0;const r=$('#psr');r.hidden=!PQ;r.innerHTML=posResults();paint3(r)});
 q.addEventListener('keydown',e=>{const btns=$$('#psr button[data-act="add-med-cart"]');if(e.key==='ArrowDown'){PHL=Math.min(PHL+1,btns.length-1);e.preventDefault()}else if(e.key==='ArrowUp'){PHL=Math.max(PHL-1,0);e.preventDefault()}else if(e.key==='Enter'&&btns[PHL]){btns[PHL].click();return}else return;btns.forEach((b,i)=>b.classList.toggle('hl',i===PHL))});
 if(PQ){q.focus();q.setSelectionRange(PQ.length,PQ.length)}
 const dv=$('#dval');dv&&dv.addEventListener('change',e=>{P.dval=parseFloat(e.target.value)||0;render()});
 const cr=$('#cashr');cr&&cr.addEventListener('input',e=>{const c=calc(P.cart,P.disc,P.dval).total;const v=parseFloat(e.target.value)||0;$('#chg').value=v>=c?'₹'+(v-c).toFixed(2):'Short by ₹'+(c-v).toFixed(2)});
 const pr=$('#pref');pr&&pr.addEventListener('input',e=>P.ref=e.target.value);
 ['chqno:no','chqbank:bank','chqdate:date'].forEach(x=>{const[id,k]=x.split(':');const el=$('#'+id);el&&el.addEventListener('input',e=>P.chq[k]=e.target.value)});
 const pd=$('#pdoc');pd&&pd.addEventListener('input',e=>P.doctor=e.target.value);
 const rx=$('#rxok');rx&&rx.addEventListener('change',e=>P.rxOk=e.target.checked);
 $$('[data-qk]').forEach(inp=>inp.addEventListener('change',e=>{const i=P.cart[+e.target.dataset.qk];const v=Math.max(1,parseInt(e.target.value)||1);const st=bat(i.batch).stock;if(v>st)toast('Only '+st+' in batch '+i.bno,1);i.qty=Math.min(v,st);render()}));
}

/* ================= ACTIONS ================= */
function patientModal(p){const s=S.sales.filter(x=>x.cust===p.id);modal(p.name,`<div class="g g2" style="gap:14px"><div class="kv"><span>Patient ID</span><b>#P${p.id.slice(1).padStart(4,'0')}</b><span>Age / Gender</span><b>${p.age} / ${p.g}</b><span>Mobile</span><b>+91 ${p.mob}</b><span>Doctor</span><b>${p.doc}</b><span>Next refill</span><b>${fd(addD(p.refill))}</b><span>Credit due</span><b style="color:${p.due?'var(--sos)':'inherit'}">${p.due?inr0(p.due):'None'}</b></div><div><small class="muted" style="font-weight:700">Current medicines</small><div class="stack" style="gap:6px;margin-top:6px">${p.meds.map(m=>`<span class="chip mut" style="justify-content:flex-start">${med(m).name}</span>`).join('')}</div></div></div><div class="panel" style="margin-top:14px;padding:12px 14px"><b style="font-size:13px">Purchase history · ${s.length} bills · ${inr0(s.reduce((a,x)=>a+x.calc.total,0))}</b>${s.slice(0,5).map(x=>`<div class="row" style="justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line)"><button class="link" data-act="view-inv" data-no="${x.no}">${x.no}</button><span class="faint">${fd(x.date)}</span><b>${inr0(x.calc.total)}</b></div>`).join('')||'<p class="muted" style="margin-top:6px">No bills yet.</p>'}</div>`,`${p.due?`<button class="btn btn-o" data-act="collect-due" data-id="${p.id}">Collect due ${inr0(p.due)}</button>`:''}<button class="btn btn-p" data-act="bill-patient" data-id="${p.id}">Create bill</button>`,{wide:1,icon:'user'})}
function formModal(title,icon,fields,btn,onSave){modal(title,`<div class="fg" style="grid-template-columns:1fr 1fr">${fields.map(([l,k,type='text',opts,val=''])=>`<div class="fld"${type==='wide'?' style="grid-column:1/-1"':''}><label>${l}</label>${opts?`<select class="inp" data-f="${k}">${opts.map(o=>`<option>${o}</option>`).join('')}</select>`:`<input class="inp" data-f="${k}" type="${type==='wide'?'text':type}" value="${esc(val)}">`}</div>`).join('')}</div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="fsave">${btn}</button>`,{icon});
 $('#fsave').onclick=()=>{const v={};$$('#modal [data-f]').forEach(e=>v[e.dataset.f]=e.value.trim());if(Object.entries(v).some(([k,x])=>!x&&!k.startsWith('o_'))){toast('Please fill all fields',1);return}if(onSave(v)!==false)mclose()}}
function poModal(prefMed){const sup=S.suppliers.filter(s=>s.status==='Active');const lows=prefMed?[prefMed]:S.meds.filter(m=>stockState(m.id)[1]!=='ok').map(m=>m.id);
 modal('New purchase order',`<div class="fld"><label>Supplier</label><select class="inp" id="posup">${sup.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></div><p class="muted" style="font-size:12.5px;margin:12px 0 8px">Low and out-of-stock items are pre-filled.</p><div class="tw"><table class="t" style="min-width:420px"><thead><tr><th>Medicine</th><th class="num">In stock</th><th class="c">Order qty</th><th class="num">Cost / unit</th></tr></thead><tbody>${S.meds.map(m=>{const b=S.batches.find(x=>x.med===m.id);return `<tr><td>${m.name}</td><td class="num">${stockOf(m.id)}</td><td class="c"><input class="inp inp-sm" style="width:70px;text-align:center" type="number" min="0" data-poq="${m.id}" value="${lows.includes(m.id)?100:0}"></td><td class="num">${inr(b?b.cost:0)}</td></tr>`}).join('')}</tbody></table></div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-o" id="podraft">Save draft</button><button class="btn btn-p" id="posend">${ico('send')}Send to supplier</button>`,{wide:1,icon:'truck'});
 const mk=status=>{const items=$$('[data-poq]').map(e=>[e.dataset.poq,parseInt(e.value)||0]).filter(([,q])=>q>0).map(([m,q])=>[m,q,(S.batches.find(x=>x.med===m)||{cost:0}).cost]);if(!items.length){toast('Add at least one item',1);return}const n=S.pos.length+1;S.pos.unshift({no:'PO-'+String(TODAY.getFullYear()).slice(2)+String(TODAY.getMonth()+1).padStart(2,'0')+'-0'+(14+n),sup:$('#posup').value,date:new Date(),items,status});mclose();PUT='po';go('purchases');toast(status==='Draft'?'Purchase order saved as draft':'Purchase order sent to supplier')};
 $('#podraft').onclick=()=>mk('Draft');$('#posend').onclick=()=>mk('Sent')}


/* ----- Scan purchase bill ----- */
let SB=null;
const SB_DEMO=()=>({sup:'s1',inv:'EMA/2611/4471',date:dk(addD(-1)),conf:94,items:[
 {med:'m14',name:'Amoxicillin 500mg',bno:'AMX25K11',exp:'2028-05',qty:100,free:10,mrp:98,rate:61.5,gst:12},
 {med:'m6',name:'Paracetamol 650mg',bno:'PCM25K03',exp:'2028-02',qty:150,free:0,mrp:33,rate:20.4,gst:12},
 {med:'m12',name:'Insulin Glargine 100IU',bno:'INS25J07',exp:'2027-09',qty:10,free:0,mrp:1240,rate:950,gst:5},
 {med:null,name:'Montelukast 10mg + Levocetirizine 5mg',bno:'MLV25H09',exp:'2027-12',qty:60,free:6,mrp:165,rate:104,gst:12}]});
const sbTot=it=>{let tx=0,g=0;it.forEach(i=>{const a=(+i.qty||0)*(+i.rate||0);tx+=a;g+=a*i.gst/100});return{tx,g,tot:Math.round(tx+g)}};
const sbMargin=i=>i.mrp?Math.round((1-(i.rate*(1+i.gst/100))/i.mrp)*100):0;
function billPaper(){return `<div class="bill-paper"><b>EASTERN MEDICO AGENCIES</b><div>12 Bentinck St, Kolkata · GSTIN 19AAACE1111A1Z2</div><hr><div>TAX INVOICE  EMA/2611/4471   ${fd(addD(-1))}</div><div>To: ABC Medical Store, Salt Lake</div><hr><div>AMOXICILLIN 500 CAP  AMX25K11 05/28 100+10  61.50</div><div>PARACETAMOL 650 TAB  PCM25K03 02/28 150     20.40</div><div>INSULIN GLARGINE PEN INS25J07 09/27  10    950.00</div><div>MONTELUKAST+LEVOCET  MLV25H09 12/27  60+6  104.00</div><hr><div style="text-align:right">GRAND TOTAL  ₹ 27,279.00</div></div>`}
function sbDraw(){
 if(SB.stage!=='done'){modal('Scan purchase bill',`<div class="g g2" style="align-items:start"><div class="drop" id="sbdrop" data-act="sb-pick" style="min-height:300px">${SB.img?`<img src="${SB.img}" alt="Purchase bill">`:SB.stage==='scan'?billPaper():`<span class="d3" data-3="receipt"></span><b style="font-size:15px">Drop the supplier's purchase bill here</b><span class="muted">Photo or PDF of the printed invoice</span><span class="btn btn-p btn-sm">Choose file</span>`}${SB.stage==='scan'?'<div class="scanline"></div>':''}</div>
 <div class="stack" style="gap:12px"><b style="font-size:14px">What gets read</b><ul class="tips" style="margin:0;padding-left:18px"><li>Supplier, GSTIN, invoice number and date</li><li>Every item's batch, expiry, quantity and free quantity</li><li>MRP, purchase rate and GST %</li><li>New medicines are flagged and created for you</li></ul><div class="banner" style="margin:0">${ico('alert')}Nothing is added to stock until you review and confirm.</div>${SB.stage==='scan'?'<span class="chip info dot" style="align-self:flex-start">Reading the bill…</span>':`<button class="btn btn-o" style="align-self:flex-start" data-act="sb-sample">Use sample bill</button>`}</div></div>`,'',{wide:1,icon:'receipt'});return}
 const d=SB.data;const sup=S.suppliers.find(s=>s.id===d.sup);const t=sbTot(d.items);
 const openPOs=S.pos.filter(p=>p.sup===d.sup&&!['Received','Draft'].includes(p.status));const dup=(S.pbills||[]).some(b=>b.inv.toLowerCase()===d.inv.toLowerCase());
 modal('Review purchase bill',`<div class="row" style="justify-content:space-between;margin-bottom:14px"><div class="row"><span class="chip ok dot">Read with ${d.conf}% confidence</span><span class="chip ${d.items.some(i=>!i.med)?'warn':'mut'}">${d.items.filter(i=>!i.med).length} new medicine${d.items.filter(i=>!i.med).length===1?'':'s'}</span>${dup?'<span class="chip sos">Invoice already entered</span>':''}</div><button class="btn btn-o btn-sm" data-act="sb-rescan">${ico('refresh')}Scan another bill</button></div>
 <div class="fg" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))"><div class="fld"><label>Supplier</label><select class="inp" id="sbsup">${S.suppliers.map(s=>`<option value="${s.id}" ${s.id===d.sup?'selected':''}>${s.name}</option>`).join('')}</select></div><div class="fld"><label>Supplier GSTIN</label><input class="inp" value="${sup.gstin}" readonly></div><div class="fld"><label>Invoice no.</label><input class="inp" id="sbinv" value="${esc(d.inv)}"></div><div class="fld"><label>Invoice date</label><input class="inp" id="sbdate" type="date" value="${d.date}"></div></div>
 <div class="tw" style="margin-top:14px"><table class="t" style="min-width:860px"><thead><tr><th>Item</th><th>Batch</th><th>Expiry</th><th class="c">Qty</th><th class="c">Free</th><th class="num">MRP</th><th class="num">Rate</th><th class="c">GST</th><th class="num">Amount</th><th class="c">Margin</th></tr></thead><tbody>
 ${d.items.map((i,k)=>`<tr><td><b>${esc(i.name)}</b><div style="margin-top:3px">${i.med?`<span class="chip ok">Matched · Rack ${med(i.med).rack}</span>`:'<span class="chip warn">New · will be created</span>'}</div></td><td><input class="inp inp-sm" style="width:96px" data-sb="${k},bno" value="${esc(i.bno)}"></td><td><input class="inp inp-sm" style="width:128px" type="month" data-sb="${k},exp" value="${i.exp}"></td><td class="c"><input class="inp inp-sm" style="width:58px;text-align:center" type="number" min="0" data-sb="${k},qty" value="${i.qty}"></td><td class="c"><input class="inp inp-sm" style="width:50px;text-align:center" type="number" min="0" data-sb="${k},free" value="${i.free}"></td><td class="num"><input class="inp inp-sm" style="width:70px;text-align:right" type="number" step="0.01" data-sb="${k},mrp" value="${i.mrp}"></td><td class="num"><input class="inp inp-sm" style="width:70px;text-align:right" type="number" step="0.01" data-sb="${k},rate" value="${i.rate}"></td><td class="c">${i.gst}%</td><td class="num"><b data-sbamt="${k}">${inr(i.qty*i.rate)}</b></td><td class="c"><span class="chip ${sbMargin(i)<10?'sos':sbMargin(i)<20?'warn':'ok'}" data-sbm="${k}">${sbMargin(i)}%</span></td></tr>`).join('')}</tbody></table></div>
 <div class="g g2" style="margin-top:14px;align-items:start"><div class="stack" style="gap:10px">${openPOs.length?`<div class="fld"><label>Link to purchase order</label><select class="inp" id="sbpo"><option value="">Not linked</option>${openPOs.map((p,i)=>`<option value="${p.no}" ${i===0?'selected':''}>${p.no} · ${fd(p.date)} · ${p.status}</option>`).join('')}</select></div>`:''}<label class="row" style="gap:8px;font-size:13px;font-weight:600"><input type="checkbox" id="sbdue" checked>Add bill total to ${esc(sup.name)}'s payable</label><label class="row" style="gap:8px;font-size:13px;font-weight:600"><input type="checkbox" id="sbmrp" checked>Use MRP from this bill for selling</label></div>
 <div class="panel" style="padding:12px 16px"><div class="srow"><span>Items</span><b id="sbcnt">${d.items.length} · ${d.items.reduce((a,i)=>a+(+i.qty||0)+(+i.free||0),0)} units incl. free</b></div><div class="srow"><span>Taxable value</span><b id="sbtx">${inr(t.tx)}</b></div><div class="srow"><span>GST (input tax credit)</span><b id="sbg">${inr(t.g)}</b></div><div class="grand"><span style="font-weight:800">Bill total</span><b id="sbtot">${inr(t.tot)}</b></div></div></div>`,
 `<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p shine" data-act="sb-save">${ico('check')}Add ${d.items.length} items to stock</button>`,{wide:1,icon:'receipt'});
}
function sbScan(img){SB={stage:'scan',img};sbDraw();setTimeout(()=>{if(!SB||SB.stage!=='scan')return;SB.stage='done';SB.data=SB_DEMO();if(img)SB.data.conf=89;sbDraw();toast('Bill read · please review')},2300)}
function sbFile(f){if(!f)return;if(f.size>10*1024*1024){toast('File is larger than 10 MB',1);return}if(f.type.startsWith('image/')){const r=new FileReader();r.onload=()=>sbScan(r.result);r.readAsDataURL(f)}else sbScan(null)}
function sbSave(){const d=SB.data;d.inv=$('#sbinv').value.trim();d.date=$('#sbdate').value;
 if(!d.inv){toast('Enter the invoice number',1);return}
 if((S.pbills||[]).some(b=>b.inv.toLowerCase()===d.inv.toLowerCase())){toast('Invoice '+d.inv+' was already entered',1);return}
 for(const i of d.items){if(!i.bno||!i.exp||!(+i.qty>0)){toast('Check batch, expiry and qty for '+i.name,1);return}}
 const sup=S.suppliers.find(s=>s.id===d.sup);const useMrp=$('#sbmrp').checked;const t=sbTot(d.items);let created=0;
 d.items.forEach(i=>{let id=i.med;if(!id){id='m'+(S.meds.length+1);S.meds.push({id,name:i.name,gen:i.name,form:'Tablet',pack:'10 Tab',hsn:'30049099',gst:i.gst,rack:'—',sch:'H',mfr:'—'});created++}
  const[y,m]=i.exp.split('-').map(Number);const prev=S.batches.filter(b=>b.med===id).slice(-1)[0];const qty=(+i.qty||0)+(+i.free||0);
  S.batches.push({id:'b'+(S.batches.length+1),med:id,no:i.bno.toUpperCase(),exp:new Date(y,m,0),stock:qty,mrp:useMrp||!prev?+i.mrp:prev.mrp,cost:+i.rate});
  S.adj.unshift({d:new Date(),med:id,bno:i.bno.toUpperCase(),delta:qty,reason:'Purchase bill '+d.inv,by:'Anil Banerjee'})});
 if($('#sbdue').checked)sup.due+=t.tot;
 const po=$('#sbpo')?.value;if(po){const p=S.pos.find(x=>x.no===po);if(p)p.status='Received'}
 (S.pbills=S.pbills||[]).push({inv:d.inv,sup:d.sup,date:d.date,total:t.tot});
 if(SB.src)markScan(SB.src,'processed');SB=null;mclose();IF.tab='batches';go('inventory');toast(`${d.items.length} items added to stock${created?' · '+created+' new medicine created':''}`);
}

document.addEventListener('click',e=>{
 const t=e.target.closest('[data-act],[data-go],[data-toast]');if(!t)return;
 if(t.dataset.toast&&!t.dataset.act)return toast(t.dataset.toast);
 if(t.dataset.go){go(t.dataset.go);if(t.dataset.scrollto)setTimeout(()=>document.getElementById(t.dataset.scrollto)?.scrollIntoView({behavior:'smooth'}),80);return}
 const a=t.dataset.act,id=t.dataset.id;
 const A={
  theme(){const n=effTheme()==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('sd-theme',n)}catch(_){}paintSw()},
  menu(){$('#side').classList.toggle('open')},
  logout(){if(options.onLogout){options.onLogout();return}AU.on=false;lgReset();pHide();$('#login').hidden=false;if(CUR==='attendance')render();toast('Signed out')},
  'otp-login'(){toast('OTP sent to +91 98765 43210');setTimeout(()=>{$('#login').hidden=true;go('dashboard')},900)},
  mclose,dclose,
  'pick-file'(){if(!RX.img&&!RX.analyzed)$('#fileIn').click()},
  'rx-sample'(){startScan(null)},
  'rx-reset'(){RX={step:1,img:null,analyzed:false,data:null,otpSent:false,verified:false,timer:0};render()},
  'rx-next'(){collectRx();RX.step=+t.dataset.to;render()},
  'rx-addmed'(){collectRx();RX.data.meds.push(['','','1 Tablet','OD (Once a day)','30 Days',30]);render()},
  'rx-delmed'(){collectRx();RX.data.meds.splice(+t.dataset.i,1);render()},
  'otp-send'(){RX.otpSent=true;RX.timer=45;render();toast('OTP sent to +91 '+RX.data.mob);clearInterval(RX.iv);RX.iv=setInterval(()=>{RX.timer=Math.max(0,RX.timer-1);const el=$('#otpT');if(el)el.innerHTML=RX.timer?`Resend OTP in ${RX.timer}s`:`<button class="link" data-act="otp-send">Resend OTP</button>`;if(!RX.timer)clearInterval(RX.iv)},1000);setTimeout(()=>$('[data-otp="0"]')?.focus(),50)},
  'otp-verify'(){const v=$$('[data-otp]').map(i=>i.value).join('');if(v.length<6){toast('Enter all 6 digits',1);return}RX.verified=true;clearInterval(RX.iv);render();toast('Consent verified')},
  'rx-save'(){saveRx();go('patients');toast('Patient record saved · refill reminder scheduled')},
  'rx-bill'(){const p=saveRx();P.cart=[];P.cust=p;P.doctor=RX.data.doc;P.rxOk=true;RX.data.meds.forEach(m=>{const md=S.meds.find(x=>x.gen.toLowerCase()===m[0].toLowerCase().trim()||x.name.toLowerCase().startsWith(m[0].toLowerCase().trim()));if(md){const per=parseInt(md.pack)||10;addToCart(md.id,null,Math.max(1,Math.ceil((parseInt(m[5])||per)/per)))}});go('billing');toast('Prescription saved · items added to bill')},
  'add-patient'(){formModal('Add patient record','user',[['Full name','name'],['Mobile number','mob','tel'],['Age','age','number'],['Gender','g','text',['M','F','Other']],['Doctor','doc','text',S.doctors.map(d=>d.name)],['Address (optional)','o_addr','wide']],'Save patient',v=>{S.patients.unshift({id:'p'+(S.patients.length+1),name:v.name,mob:v.mob,age:+v.age,g:v.g,doc:v.doc,last:0,refill:30,meds:[],status:'Active',due:0});go('patients');toast('Patient added')})},
  'view-patient'(){patientModal(S.patients.find(p=>p.id===id))},
  'bill-patient'(){const p=S.patients.find(x=>x.id===id);mclose();P.cust=p;P.doctor=p.doc;go('billing');toast('Billing for '+p.name)},
  'collect-due'(){const p=S.patients.find(x=>x.id===id);S.ledger.unshift({d:new Date(),type:'Income',head:'Due collected · '+p.name,amt:-p.due,mode:'Cash'});toast(inr0(p.due)+' collected from '+p.name);p.due=0;mclose();render()},
  'add-doctor-old'(){formModal('Add doctor','doc',[['Full name (with Dr.)','name','text',null,'Dr. '],['Qualification','qual'],['Specialty','spec','text',['General Physician','Cardiologist','Diabetologist','Pediatrician','Gynecologist','Orthopedic','Dermatologist','ENT']],['Registration no.','reg'],['Mobile','mob','tel'],['Consultation mode','mode','text',['Video + In-Pharmacy','Video','In-Pharmacy']]],'Send approval request',v=>{S.doctors.push({id:'d'+(S.doctors.length+1),...v,appr:'pending',sent:0,active:true,slots:{},unav:[],hist:[{d:new Date(),t:'Request sent',n:'Awaiting doctor approval',c:'var(--amber)'}]});render();toast('Approval request sent to '+v.name)})},
  'doc-profile'(){const d=S.doctors.find(x=>x.id===id);modal(d.name,`<div class="kv"><span>Qualification</span><b>${d.qual}</b><span>Specialty</span><b>${d.spec}</b><span>Registration</span><b>${d.reg}</b><span>Mobile</span><b>+91 ${d.mob}</b><span>Consultation</span><b>${d.mode}</b><span>Approval</span><b>${APPR[d.appr][0]}</b><span>Patients referred</span><b>${S.patients.filter(p=>p.doc===d.name).length}</b></div>`,`<button class="btn btn-p" data-act="slots" data-id="${d.id}">Manage slots</button>`,{icon:'doc'})},
  slots(){mclose();DR={id,tab:'slots',sel:dk(TODAY),mon:0};renderDrawer()},
  dtab(){DR.tab=t.dataset.t;renderDrawer()},
  dsel(){DR.sel=t.dataset.k;renderDrawer()},
  dmon(){const m=+t.dataset.m;DR.mon=m===0?0:DR.mon+m;renderDrawer()},
  renew(){const d=S.doctors.find(x=>x.id===DR.id);d.appr='pending';d.sent=0;if(d.email){Object.values(d.slots).forEach(x=>{if(x.status==='live'&&d.appr!=='approved')x.status='pending'});pharmReqWrite(d,'renewal')}d.hist.unshift({d:new Date(),t:'Renewal requested',n:'6-month renewal sent to doctor',c:'var(--amber)'});renderDrawer();render();toast('Renewal request sent to '+d.name)},
  unav(){const d=S.doctors.find(x=>x.id===DR.id);const sl=d.slots[DR.sel];if(sl&&sl.list.some(s=>s.bk)){toast(sl.list.filter(s=>s.bk).length+' bookings exist. Reschedule them first.',1);return}d.unav.push(DR.sel);delete d.slots[DR.sel];renderDrawer();toast('Doctor marked unavailable')},
  'unav-undo'(){const d=S.doctors.find(x=>x.id===DR.id);d.unav=d.unav.filter(k=>k!==DR.sel);renderDrawer()},
  'add-time'(){modal('Add consultation time',`<div class="fg" style="grid-template-columns:1fr 1fr 1fr"><div class="fld"><label>Start</label><input class="inp" type="time" id="ts" value="10:00"></div><div class="fld"><label>End</label><input class="inp" type="time" id="te" value="13:00"></div><div class="fld"><label>Slot length</label><select class="inp" id="tdur"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></div></div><p class="muted" id="tcount" style="margin-top:12px;font-size:13px"></p><div class="banner" style="margin-top:12px;margin-bottom:0">${ico('alert')}New time is sent to the doctor for approval before it goes live.</div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="tgen">Send for approval</button>`,{icon:'calendar'});
   const cnt=()=>{const[sh,sm]=$('#ts').value.split(':').map(Number),[eh,em]=$('#te').value.split(':').map(Number);const n=Math.floor(((eh*60+em)-(sh*60+sm))/+$('#tdur').value);$('#tcount').innerHTML=n>0?`<b>${n}</b> appointment slots will be created.`:'End time must be after start time.';return n};cnt();['ts','te','tdur'].forEach(x=>$('#'+x).addEventListener('input',cnt));
   $('#tgen').onclick=()=>{const n=cnt();if(n<=0)return;const d=S.doctors.find(x=>x.id===DR.id);const[sh,sm]=$('#ts').value.split(':').map(Number);const dur=+$('#tdur').value;const k=DR.sel;const ex=d.slots[k];const list=ex?ex.list:[];for(let i=0;i<n;i++){const s=new Date(2026,0,1,sh,sm+dur*i);list.push({t:ft(s)+' – '+ft(new Date(s.getTime()+dur*6e4)),bk:null,blk:false})}d.slots[k]={status:ex&&ex.status==='live'?'live':'pending',start:ex?ex.start:ft(new Date(2026,0,1,sh,sm)),dur,list};mclose();renderDrawer();toast(n+' slots sent to '+d.name+' for approval')}},
  slot(){const d=S.doctors.find(x=>x.id===DR.id);const s=d.slots[DR.sel].list[+t.dataset.j];
   if(s.bk)modal('Appointment details',`<div class="kv"><span>Patient</span><b>${esc(s.bk)}</b><span>Doctor</span><b>${d.name}</b><span>Date</span><b>${fd(new Date(DR.sel+'T00:00'))}</b><span>Time</span><b>${s.t}</b><span>Status</span><b><span class="chip ok">Confirmed</span></b><span>Consultation</span><b>${d.mode.split(' ')[0]} consultation</b></div><p class="muted" style="font-size:12.5px;margin-top:12px">Only pharmacy-permitted patient information is shown.</p>`,`<button class="btn btn-x" id="bkcancel">Cancel booking</button><button class="btn btn-o" data-act="mclose">Close</button>`,{icon:'calendar'}),$('#bkcancel').onclick=()=>{s.bk=null;if(d.slots[DR.sel].status==='full')d.slots[DR.sel].status='live';mclose();renderDrawer();toast('Booking cancelled · patient notified')};
   else if(s.blk){s.blk=false;renderDrawer();toast('Slot reopened')}else if(d.slots[DR.sel].status==='pending'||d.appr!=='approved'){s.blk=true;renderDrawer();toast('Slot blocked. Patients can book once the doctor approves.')}else bookSlotModal(d,s)},
  remind(){const p=S.patients.find(x=>x.id===id);p.reminded='WhatsApp';render();toast('Refill reminder sent to '+p.name+' on WhatsApp')},
  'remind-all'(){const l=S.patients.filter(p=>p.status==='Active'&&p.refill<=0);l.forEach(p=>p.reminded='WhatsApp');render();toast(l.length+' reminders sent')},
  'bill-refill'(){const p=S.patients.find(x=>x.id===id);P.cart=[];P.cust=p;P.doctor=p.doc;P.rxOk=true;let miss=[];p.meds.forEach(m=>{if(!addToCart(m,null,3))miss.push(med(m).name)});go('billing');toast('Refill for '+p.name+' added to bill'+(miss.length?' · '+miss.length+' out of stock':''))},
  'quick-add'(){if(addToCart(id)){render();toast(med(id).name+' added')}},
  'add-med-cart'(){if(addToCart(id)){PQ='';render();toast(med(id).name+' added · earliest-expiry batch');setTimeout(()=>$('#pq')?.focus(),30)}},
  'change-batch'(){const i=P.cart[+t.dataset.k];batchPicker(i.med,+t.dataset.k)},
  qty(){const i=P.cart[+t.dataset.k];const n=i.qty+ +t.dataset.d;if(n<1)return;if(n>bat(i.batch).stock){toast('Only '+bat(i.batch).stock+' in batch '+i.bno,1);return}i.qty=n;render()},
  rm(){P.cart.splice(+t.dataset.k,1);render()},
  disc(){P.disc=t.dataset.t;render()},
  pay(){P.pay=t.dataset.m;P.ref='';render()},
  'pick-cust'(){modal('Select customer',`<label class="sbox" style="margin-bottom:10px">${ico('search')}<input id="cq" placeholder="Search patient by name or mobile"></label><div id="cl" class="stack" style="gap:4px;max-height:360px;overflow:auto"></div>`,`<button class="btn btn-o" data-act="add-patient">${ico('plus')}New patient</button><button class="btn btn-o" id="cwalk">Walk-in customer</button>`,{icon:'users'});const draw=()=>{const q=$('#cq').value.toLowerCase();$('#cl').innerHTML=S.patients.filter(p=>(p.name+p.mob).toLowerCase().includes(q)).map(p=>`<button class="cust-pick" style="text-align:left" data-pick="${p.id}">${who(p.name,'+91 '+p.mob+' · '+p.doc)}${p.due?`<span class="chip sos" style="margin-left:auto">Due ${inr0(p.due)}</span>`:''}</button>`).join('')};draw();$('#cq').addEventListener('input',draw);$('#cl').addEventListener('click',ev=>{const b=ev.target.closest('[data-pick]');if(!b)return;const p=S.patients.find(x=>x.id===b.dataset.pick);P.cust=p;P.doctor=P.doctor||p.doc;mclose();render()});$('#cwalk').onclick=()=>{P.cust=walkin;if(P.pay==='Credit')P.pay='Cash';mclose();render()}},
  hold(){S.held.push({cart:P.cart,cust:P.cust,doctor:P.doctor});Object.assign(P,{cart:[],cust:walkin,doctor:'',rxOk:false,dval:0});render();toast('Bill on hold')},
  resume(){const h=S.held.splice(+t.dataset.i,1)[0];if(P.cart.length)S.held.push({cart:P.cart,cust:P.cust,doctor:P.doctor});Object.assign(P,{cart:h.cart,cust:h.cust,doctor:h.doctor});render()},
  'clear-cart'(){P.cart=[];P.dval=0;render()},
  checkout,
  'new-bill'(){mclose();go('billing');setTimeout(()=>$('#pq')?.focus(),60)},
  'view-inv'(){showInvoice(S.sales.find(s=>s.no===t.dataset.no))},
  'share-inv'(){const s=S.sales.find(x=>x.no===t.dataset.no);toast(s.mob?'Invoice sent to +91 '+s.mob+' on WhatsApp':'Add a mobile number to share the invoice',!s.mob)},
  'start-return'(){returnModal(t.dataset.no)},
  'new-return'(){modal('New return',`<div class="fld"><label>Invoice number</label><input class="inp" id="rinv" list="invl" placeholder="${S.sales[0].no}"><datalist id="invl">${S.sales.slice(0,30).map(s=>`<option value="${s.no}">${s.cname}</option>`).join('')}</datalist></div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="rgo">Find invoice</button>`,{icon:'ret'});$('#rgo').onclick=()=>returnModal($('#rinv').value.trim())},
  'do-return'(){const s=S.sales.find(x=>x.no===t.dataset.no);const f=s.calc.sub?s.calc.net/s.calc.sub:1;const items=[];let amt=0;$$('[data-rq]').forEach(el=>{const q=Math.min(parseInt(el.value)||0,s.items[+el.dataset.rq].qty);if(q>0){const it=s.items[+el.dataset.rq];items.push({name:it.name,qty:q});amt+=it.mrp*q*f;bat(it.batch).stock+=q}});if(!items.length){toast('Enter a quantity to return',1);return}const mode=$('#rmode').value;if(mode.startsWith('Adjust')){const p=S.patients.find(x=>x.id===s.cust);if(p)p.due=Math.max(0,p.due-amt)}S.returns.unshift({no:'RET-'+(2042+S.returns.length),inv:s.no,date:new Date(),cname:s.cname,items,amt:Math.round(amt),mode:mode.startsWith('Adjust')?'Credit note':mode,reason:$('#rreason').value});mclose();go('returns');toast('Return processed · '+items.reduce((a,i)=>a+i.qty,0)+' units restocked')},
  itab(){IF.tab=t.dataset.t;render()},
  'scan-bill'(){SB={stage:'up'};sbDraw()},
  'sb-pick'(){if(SB&&SB.stage==='up')$('#billIn').click()},
  'sb-sample'(){sbScan(null)},
  'sb-rescan'(){SB={stage:'up'};sbDraw()},
  'sb-save'(){sbSave()},
  'add-med'(){mclose();formModal('Add medicine','pill',[['Medicine name','name','text',null,PQ],['Generic name','gen'],['Form','form','text',['Tablet','Capsule','Syrup','Injection','Powder','Device','Cream']],['Pack size','pack','text',null,'10 Tab'],['HSN code','hsn','text',null,'30049099'],['GST %','gst','text',['12','5','18','0']],['Schedule','sch','text',['OTC','H','H1','X']],['Rack location','rack'],['Manufacturer','mfr','wide']],'Save medicine',v=>{S.meds.push({id:'m'+(S.meds.length+1),...v,gst:+v.gst});PQ='';IF.tab='meds';render();toast(v.name+' added. Add a batch to stock it.')})},
  'add-batch'(){const m=med(id);formModal('Add batch · '+m.name,'box',[['Batch no.','no'],['Expiry (month)','exp','month'],['Quantity','stock','number'],['MRP (₹)','mrp','number'],['Cost (₹)','cost','number']],'Add to stock',v=>{const[y,mo]=v.exp.split('-').map(Number);S.batches.push({id:'b'+(S.batches.length+1),med:id,no:v.no.toUpperCase(),exp:new Date(y,mo,0),stock:+v.stock,mrp:+v.mrp,cost:+v.cost});S.adj.unshift({d:new Date(),med:id,bno:v.no.toUpperCase(),delta:+v.stock,reason:'New batch added',by:'Anil Banerjee'});render();toast('Batch added · stock updated')})},
  reorder(){poModal(id)},
  adjust(){const b=bat(id);modal('Adjust stock · '+med(b.med).name,`<div class="kv" style="margin-bottom:14px"><span>Batch</span><b>${b.no}</b><span>Current stock</span><b>${b.stock}</b></div><div class="fg" style="grid-template-columns:1fr 1fr 1fr"><div class="fld"><label>Type</label><select class="inp" id="adt"><option value="-1">Remove</option><option value="1">Add</option></select></div><div class="fld"><label>Quantity</label><input class="inp" id="adq" type="number" min="1" value="1"></div><div class="fld"><label>Reason</label><select class="inp" id="adr"><option>Damaged / broken</option><option>Stock count correction</option><option>Expired – destroyed</option><option>Free sample received</option></select></div></div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="adsave">Save adjustment</button>`,{icon:'box'});$('#adsave').onclick=()=>{const dl=+$('#adt').value*Math.max(1,parseInt($('#adq').value)||1);if(b.stock+dl<0){toast('Cannot remove more than '+b.stock,1);return}b.stock+=dl;S.adj.unshift({d:new Date(),med:b.med,bno:b.no,delta:dl,reason:$('#adr').value,by:'Anil Banerjee'});mclose();render();toast('Stock adjusted · logged in audit trail')}},
  writeoff(){const b=bat(id);S.adj.unshift({d:new Date(),med:b.med,bno:b.no,delta:-b.stock,reason:'Expired – written off',by:'Anil Banerjee'});b.stock=0;render();toast('Expired batch '+b.no+' written off')},
  'import-csv'(){modal('Import medicines from CSV',`<p class="muted" style="font-size:13px">Columns: <b>name, generic, form, pack, hsn, gst, rack, manufacturer</b>. Duplicates (same name) are skipped.</p><div class="drop" style="min-height:150px;margin-top:12px" data-act="csv-pick"><span style="width:56px;height:56px" data-3="upload"></span><b>Choose a CSV file</b></div><div id="csvprev"></div>`,`<button class="btn btn-o" data-act="mclose">Cancel</button><button class="btn btn-p" id="csvgo" disabled>Import</button>`,{icon:'upload',wide:1})},
  'csv-pick'(){$('#csvIn').click()},
  putab(){PUT=t.dataset.t;render()},
  'new-po'(){poModal()},
  'po-send'(){S.pos[+t.dataset.i].status='Sent';render();toast('Purchase order emailed to supplier')},
  'po-recv'(){const p=S.pos[+t.dataset.i];p.status='Received';p.items.forEach(([m,q,c])=>{const old=S.batches.find(b=>b.med===m);const no=med(m).name.slice(0,3).toUpperCase()+String(TODAY.getFullYear()).slice(2)+'R'+String(S.batches.length).padStart(2,'0');S.batches.push({id:'b'+(S.batches.length+1),med:m,no,exp:expM(18),stock:q,mrp:old?old.mrp:c*1.4,cost:c});S.adj.unshift({d:new Date(),med:m,bno:no,delta:q,reason:'Received '+p.no,by:'Anil Banerjee'})});const s=S.suppliers.find(x=>x.id===p.sup);s.due+=p.items.reduce((a,[,q,c])=>a+q*c,0);render();toast('Stock received into new batches')},
  'add-supplier'(){formModal('Add supplier','truck',[['Company name','name'],['Contact person','person'],['Mobile','mob','tel'],['GSTIN','gstin'],['City','city']],'Save & send portal login',v=>{S.suppliers.push({id:'s'+(S.suppliers.length+1),...v,due:0,status:'Active'});PUT='sup';render();toast('Supplier added · portal login sent')})},
  rtab(){RT=t.dataset.t;render()},
  'add-expense'(){formModal('Add expense','coin',[['Particulars','head'],['Amount (₹)','amt','number'],['Mode','mode','text',['Cash','UPI','Bank','Cheque']]],'Add to ledger',v=>{S.ledger.unshift({d:new Date(),type:'Expense',head:v.head,amt:+v.amt,mode:v.mode});render();toast('Expense recorded')})},
  'add-user'(){formModal('Add user','user',[['Full name','name'],['Mobile','mob','tel'],['Role','role','text',['Billing Staff','Pharmacist','Admin']]],'Create user',v=>{S.users.push({...v,on:true,last:'Never'});render();toast('User created · login sent by SMS')})},
  'save-settings'(){$$('[data-set]').forEach(e=>{const k=e.dataset.set;S.store[k]=['low','expAlert'].includes(k)?+e.value:e.value});render();toast('Settings saved')},
 };
 if(A[a]){const r=t.querySelector('[data-3]');if(r)boing(r);A[a]()}
});
function boing(el){el.classList.remove('boing');void el.offsetWidth;el.classList.add('boing')}
document.addEventListener('animationend',e=>{if(e.animationName==='boing')e.target.classList.remove('boing')});
document.addEventListener('pointerdown',e=>{const n=e.target.closest('.nv');if(n)boing(n.querySelector('.n3'))});

function batchPicker(mid,k){const m=med(mid);const bs=S.batches.filter(b=>b.med===mid).sort((a,b)=>a.exp-b.exp);
 modal('Select batch · '+m.name,`<p class="muted" style="font-size:12.5px;margin-bottom:10px">Earliest expiry first (FEFO). Expired batches can't be sold.</p><div class="tw"><table class="t" style="min-width:460px"><thead><tr><th>Batch</th><th>Expiry</th><th class="num">Stock</th><th class="num">MRP</th><th></th></tr></thead><tbody>${bs.map((b,i)=>{const[l,c]=expState(b);const ok=b.exp>=TODAY&&b.stock>0;return `<tr><td><b>${b.no}</b></td><td>${fexp(b.exp)} <span class="chip ${c}">${l}</span></td><td class="num">${b.stock}</td><td class="num">${inr(b.mrp)}</td><td class="r"><button class="btn ${i===bs.findIndex(x=>x.exp>=TODAY&&x.stock>0)?'btn-p':'btn-o'} btn-sm" data-bpick="${b.id}" ${ok?'':'disabled'}>Select</button></td></tr>`}).join('')}</tbody></table></div>`,'',{icon:'box'});
 $('#modal')?.addEventListener('click',ev=>{const b=ev.target.closest('[data-bpick]');if(!b)return;if(k!=null){const it=P.cart[k];const nb=bat(b.dataset.bpick);Object.assign(it,{batch:nb.id,bno:nb.no,exp:nb.exp,mrp:nb.mrp,qty:Math.min(it.qty,nb.stock)})}else addToCart(mid,b.dataset.bpick);PQ='';mclose();render()},{once:true})}

/* prescription helpers */
function collectRx(){if(RX.step!==2)return;$$('[data-rx]').forEach(e=>RX.data[e.dataset.rx]=e.value);$$('[data-rxm]').forEach(e=>{const[i,j]=e.dataset.rxm.split(',').map(Number);RX.data.meds[i][j]=e.value})}
function startScan(img){RX.img=img;RX.scanning=true;RX.analyzed=false;render();setTimeout(()=>{RX.scanning=false;RX.analyzed=true;RX.data=JSON.parse(JSON.stringify(RX_DEMO));if(img)RX.data.conf=88;if(RX.pre){if(RX.pre.pat)RX.data.pat=RX.pre.pat;if(RX.pre.mob)RX.data.mob=RX.pre.mob}render();toast('AI analysis complete')},2200)}
function saveRx(){const d=RX.data;let p=S.patients.find(x=>x.name.toLowerCase()===d.pat.toLowerCase());const meds=d.meds.map(m=>(S.meds.find(x=>x.gen.toLowerCase()===m[0].toLowerCase().trim())||{}).id).filter(Boolean);
 if(p){p.meds=[...new Set([...p.meds,...meds])];p.last=0;p.refill=parseInt(d.meds[0]?.[4])||30;p.doc=d.doc}else{p={id:'p'+(S.patients.length+1),name:d.pat,age:+d.age,g:d.g[0],mob:d.mob.replace(/(\d{5})(\d{5})/,'$1 $2'),doc:d.doc,last:0,refill:30,meds,status:'Active',due:0};S.patients.unshift(p)}
 S.pending=S.pending.filter(x=>x.p!==d.pat);if(RX.src)markScan(RX.src,'processed');RX={step:1,img:null,analyzed:false,data:null,otpSent:false,verified:false,timer:0};return p}
$('#fileIn')?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(f.size>10*1024*1024){toast('File is larger than 10 MB',1);return}if(f.type.startsWith('image/')){const r=new FileReader();r.onload=()=>startScan(r.result);r.readAsDataURL(f)}else startScan(null);e.target.value=''});
document.addEventListener('dragover',e=>{const d=e.target.closest('#drop,#sbdrop');if(d){e.preventDefault();d.classList.add('over')}});
document.addEventListener('dragleave',e=>{const d=e.target.closest('#drop,#sbdrop');if(d)d.classList.remove('over')});
document.addEventListener('drop',e=>{const d=e.target.closest('#drop,#sbdrop');if(!d)return;e.preventDefault();if(d.id==='sbdrop'){sbFile(e.dataTransfer.files[0]);return}const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/')){const r=new FileReader();r.onload=()=>startScan(r.result);r.readAsDataURL(f)}});
$('#billIn')?.addEventListener('change',e=>{sbFile(e.target.files[0]);e.target.value=''});
$('#csvIn')?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const rows=r.result.trim().split(/\r?\n/).map(l=>l.split(',').map(x=>x.trim()));const head=rows[0].map(h=>h.toLowerCase());const data=rows.slice(head.includes('name')?1:0).filter(x=>x[0]);const ex=new Set(S.meds.map(m=>m.name.toLowerCase()));const fresh=data.filter(x=>!ex.has(x[0].toLowerCase()));
 const prevEl = $('#csvprev');
 if(prevEl) prevEl.innerHTML=`<p style="margin:12px 0 8px;font-size:13px"><b>${data.length}</b> rows · <b style="color:var(--leaf)">${fresh.length} new</b> · <b style="color:var(--amber)">${data.length-fresh.length} duplicates skipped</b></p><div class="tw"><table class="t" style="min-width:500px"><thead><tr><th>Name</th><th>Generic</th><th>Form</th><th>Pack</th><th>HSN</th><th>GST</th><th></th></tr></thead><tbody>${data.slice(0,8).map(x=>`<tr><td>${esc(x[0])}</td><td>${esc(x[1]||'')}</td><td>${esc(x[2]||'')}</td><td>${esc(x[3]||'')}</td><td>${esc(x[4]||'')}</td><td>${esc(x[5]||'')}</td><td>${ex.has(x[0].toLowerCase())?'<span class="chip warn">Duplicate</span>':'<span class="chip ok">New</span>'}</td></tr>`).join('')}</tbody></table></div>`;
 const btn=$('#csvgo');
 if(btn) {
  btn.disabled=!fresh.length;
  btn.onclick=()=>{fresh.forEach(x=>S.meds.push({id:'m'+(S.meds.length+1),name:x[0],gen:x[1]||x[0],form:x[2]||'Tablet',pack:x[3]||'10 Tab',hsn:x[4]||'30049099',gst:+x[5]||12,rack:x[6]||'—',sch:'OTC',mfr:x[7]||'—'}));mclose();render();toast(fresh.length+' medicines imported')};
 }
};r.readAsText(f);e.target.value=''});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.dataset.sb&&SB&&SB.data){const[k,f]=t.dataset.sb.split(',');const it=SB.data.items[+k];it[f]=['bno','exp'].includes(f)?t.value:parseFloat(t.value)||0;const tt=sbTot(SB.data.items);$(`[data-sbamt="${k}"]`).textContent=inr(it.qty*it.rate);const mg=sbMargin(it),me=$(`[data-sbm="${k}"]`);me.textContent=mg+'%';me.className='chip '+(mg<10?'sos':mg<20?'warn':'ok');$('#sbtx').textContent=inr(tt.tx);$('#sbg').textContent=inr(tt.g);$('#sbtot').textContent=inr(tt.tot);$('#sbcnt').textContent=SB.data.items.length+' · '+SB.data.items.reduce((a,i)=>a+(+i.qty||0)+(+i.free||0),0)+' units incl. free'}
 if(t.dataset.otp!==undefined){t.value=t.value.replace(/\D/g,'').slice(-1);if(t.value)$(`[data-otp="${+t.dataset.otp+1}"]`)?.focus()}
 if(t.dataset.rq!==undefined){const no=$('[data-act="do-return"]').dataset.no;const s=S.sales.find(x=>x.no===no);const f=s.calc.sub?s.calc.net/s.calc.sub:1;let a=0;$$('[data-rq]').forEach(el=>{a+=Math.min(parseInt(el.value)||0,s.items[+el.dataset.rq].qty)*s.items[+el.dataset.rq].mrp*f});$('#ramt').value=inr(a)}
 const deb=(o,k)=>{o[k]=t.value;clearTimeout(window.__d);window.__d=setTimeout(()=>{const pos=t.selectionStart;render();const n=$(`[data-${Object.keys(t.dataset)[0].replace(/[A-Z]/g,m=>'-'+m.toLowerCase())}="${k}"]`);if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(_){}}},250)};
 if(t.dataset.pf)deb(PF,t.dataset.pf);if(t.dataset.df)deb(DF,t.dataset.df);if(t.dataset.sf)deb(SF,t.dataset.sf);if(t.dataset.if)deb(IF,t.dataset.if);
});
document.addEventListener('change',e=>{const t=e.target;if(t.tagName!=='SELECT')return;if(t.id==='sbsup'&&SB&&SB.data){SB.data.inv=$('#sbinv').value;SB.data.date=$('#sbdate').value;SB.data.sup=t.value;sbDraw();return}['pf:PF','df:DF','sf:SF','if:IF'].forEach(x=>{const[k,o]=x.split(':');if(t.dataset[k]){({PF,DF,SF,IF})[o][t.dataset[k]]=t.value;render()}});
 if(t.dataset.user){S.users[+t.dataset.user].on=t.checked;render()}});
document.addEventListener('change',e=>{if(e.target.dataset.user!==undefined){S.users[+e.target.dataset.user].on=e.target.checked;render()}});
document.addEventListener('keydown',e=>{if(e.target.dataset.otp!==undefined&&e.key==='Backspace'&&!e.target.value)$(`[data-otp="${+e.target.dataset.otp-1}"]`)?.focus()});

/* global search */
$('#gq')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();const box=$('#gres');if(!box)return;if(!q){box.hidden=true;return}
 const r=[...S.patients.filter(p=>(p.name+p.mob).toLowerCase().includes(q)).slice(0,4).map(p=>['user',p.name,'Patient','patient',p.id]),...S.meds.filter(m=>(m.name+m.gen).toLowerCase().includes(q)).slice(0,4).map(m=>['pill',m.name,stockOf(m.id)+' in stock','med',m.id]),...S.sales.filter(s=>s.no.toLowerCase().includes(q)).slice(0,3).map(s=>['receipt',s.no,s.cname,'inv',s.no]),...S.doctors.filter(d=>d.name.toLowerCase().includes(q)).slice(0,2).map(d=>['doc',d.name,d.spec,'doc',d.id])];
 box.hidden=false;box.innerHTML=r.length?r.map(([i,n,s,k,id])=>`<button data-gk="${k}" data-gid="${id}"><span style="width:26px;height:26px" data-3="${i}"></span>${esc(n)}<small>${esc(s)}</small></button>`).join(''):'<div class="empty">No results</div>';paint3(box)});
$('#gres')?.addEventListener('click',e=>{const b=e.target.closest('[data-gk]');if(!b)return;if($('#gres'))$('#gres').hidden=true;if($('#gq'))$('#gq').value='';const k=b.dataset.gk,id=b.dataset.gid;
 if(k==='patient')patientModal(S.patients.find(p=>p.id===id));else if(k==='med'){go('billing');setTimeout(()=>{if(addToCart(id)){render();toast(med(id).name+' added to bill')}},50)}else if(k==='inv')showInvoice(S.sales.find(s=>s.no===id));else{go('doctors');setTimeout(()=>{DR={id,tab:'slots',sel:dk(TODAY),mon:0};renderDrawer()},80)}});
document.addEventListener('click',e=>{if(!e.target.closest('.gsearch')&&$('#gres'))$('#gres').hidden=true;if(!e.target.closest('.pos-search')&&$('#psr'))$('#psr').hidden=true});

/* keyboard shortcuts (PC software) */
document.addEventListener('keydown',e=>{
 if($('#login')&&!$('#login').hidden)return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#gq')?.focus();return}
 if(e.key==='F2'){e.preventDefault();if(CUR!=='billing')go('billing');setTimeout(()=>$('#pq')?.focus(),60)}
 else if(e.key==='F8'&&CUR==='billing'&&P.cart.length){e.preventDefault();$('[data-act="hold"]')?.click()}
 else if(e.key==='F9'&&CUR==='billing'&&P.cart.length){e.preventDefault();checkout()}
 else if(e.key==='Escape'){mclose();dclose();if($('#gres'))$('#gres').hidden=true}
});

/* theme */
const mq=matchMedia('(prefers-color-scheme: dark)');
function effTheme(){return document.documentElement.dataset.theme||(mq.matches?'dark':'light')}
function paintSw(){const d=effTheme()==='dark';$$('.theme-sw').forEach(s=>s.classList.toggle('dark',d));$$('.knob-ico').forEach(k=>k.innerHTML=`<use href="#i-${d?'moon':'sun'}"/>`)}
try{const t=localStorage.getItem('sd-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(_){}
mq.addEventListener&&mq.addEventListener('change',paintSw);paintSw();



  // --- Apply currentUser overrides ---
  if (options.currentUser) {
    if (options.mode === 'pharmacy') {
      if (options.currentUser.pharmacyName || options.currentUser.name) {
        S.store.name = options.currentUser.pharmacyName || options.currentUser.name;
      }
      if (options.currentUser.pharmacyRegNo) S.store.dl = options.currentUser.pharmacyRegNo;
      if (options.currentUser.gstn) S.store.gstin = options.currentUser.gstn;
      if (options.currentUser.ownerMobile || options.currentUser.mobile) S.store.phone = options.currentUser.ownerMobile || options.currentUser.mobile;
      if (options.currentUser.location) S.store.addr = options.currentUser.location;
    } else if (options.mode === 'doctor') {
      if (options.currentUser.name) DOCP.name = options.currentUser.name;
      if (options.currentUser.specialty) DOCP.spec = options.currentUser.specialty;
      if (options.currentUser.email) DOCP.email = options.currentUser.email;
      if (options.currentUser.mobile) DOCP.mob = options.currentUser.mobile;
    }
  }

  // Robust capture-phase click interceptor for tabs, navigation and buttons
  const portalClickHandler = (e) => {
    // 1. Exit portal
    const exitBtn = e.target.closest('[data-act="exit-portal"], [data-dact="exit-portal"]');
    if (exitBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (options.onNavigatePatient) options.onNavigatePatient();
      else if (options.onNavigateHome) options.onNavigateHome();
      else window.location.href = '/portal/dashboard';
      return;
    }

    // 2. Doctor tab go action
    const dgoBtn = e.target.closest('[data-dact="go"]');
    if (dgoBtn) {
      e.preventDefault();
      e.stopPropagation();
      const p = dgoBtn.dataset.p || 'dash';
      dgo(p);
      return;
    }

    // 3. Any anchor with href="#..."
    const a = e.target.closest('a[href^="#"]');
    if (a) {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = href.slice(1);
        if (target && target !== '') {
          e.preventDefault();
          e.stopPropagation();
          if (options.mode === 'doctor' || (typeof DOC !== 'undefined' && DOC.on)) {
            const p = a.dataset.p || (DPAGES.includes(target) ? target : 'dash');
            dgo(p);
            return;
          }
          if (PAGES.includes(target)) {
            go(target);
            return;
          }
        }
      }
    }

    // 4. Any [data-go]
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) {
      e.preventDefault();
      e.stopPropagation();
      const p = goBtn.dataset.go;
      if (options.mode === 'doctor' || (typeof DOC !== 'undefined' && DOC.on)) {
        if (DPAGES.includes(p)) dgo(p);
      } else {
        if (PAGES.includes(p)) go(p);
      }
      if (goBtn.dataset.scrollto) {
        setTimeout(() => document.getElementById(goBtn.dataset.scrollto)?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
      return;
    }
  };
  document.addEventListener('click', portalClickHandler, true);

  // Initialize view mode
  document.body.classList.add('portal-active');
  const loginEl = $('#login');
  if (loginEl) loginEl.hidden = true;

  if (options.mode === 'doctor') {
    DOC.auth = true;
    DOC.on = true;
    document.body.classList.add('docmode');
    const shellEl = $('#shell');
    if (shellEl) shellEl.hidden = true;
    enterDoctor();
    dShow();
  } else {
    DOC.on = false;
    document.body.classList.remove('docmode');
    const dappEl = $('#dapp');
    if (dappEl) dappEl.hidden = true;
    const shellEl = $('#shell');
    if (shellEl) shellEl.hidden = false;
    exitDoctor();
    paint3(container || document);
    render();
  }

  return {
    destroy: () => {
      document.body.classList.remove('portal-active');
      document.body.classList.remove('docmode');
      document.removeEventListener('click', portalClickHandler, true);
      try { clearInterval(DOC.iv); } catch(_) {}
      try { clearInterval(LG.iv); } catch(_) {}
      try { mclose(); } catch(_) {}
      try { dclose(); } catch(_) {}
    },
    render: () => {
      if (options.mode === 'doctor') drender();
      else render();
    }
  };
}
