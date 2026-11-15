// Extracted Portal HTML templates from Demo UI
export const pharmacyPortalHtml = `<div class="shell" id="shell">
  <aside class="side" id="side">
    <div class="brand">
      <div class="logo"><img src="/logo.png" alt="SevaDharam logo"></div>
      <div><div class="bname">Seva<b>Dharam</b></div><div class="bsub">PHARMACY PORTAL</div></div>
    </div>
    <nav id="nav"></nav>
    <div class="side-foot">
      <div class="av" style="background:linear-gradient(135deg,#1C3D5E,#3E6A93)">AB</div>
      <div class="who"><b>Anil Banerjee</b><span>Admin · Pharmacist</span></div>
      <button class="icon-btn" style="margin-left:auto;width:34px;height:34px" data-act="logout" aria-label="Log out"><svg class="ico"><use href="#i-logout"/></svg></button>
    </div>
  </aside>
  <div class="main">
    <header class="top">
      <button class="menu-btn" data-act="menu" aria-label="Open menu"><svg class="ico"><use href="#i-menu"/></svg></button>
      <div class="gsearch">
        <svg class="ico"><use href="#i-search"/></svg>
        <input id="gq" placeholder="Search patient, invoice, medicine or doctor…" autocomplete="off">
        <span class="kbd">Ctrl K</span>
        <div class="gres" id="gres" hidden></div>
      </div>
      <div class="top-r">
        <button class="theme-sw" data-act="theme" aria-label="Switch light or dark mode"><svg class="ico"><use href="#i-sun"/></svg><svg class="ico"><use href="#i-moon"/></svg><span class="knob"><svg class="ico knob-ico"><use href="#i-sun"/></svg></span></button>
        <button class="btn btn-o btn-sm hide-n" data-act="ph-phone" style="height:40px"><svg class="ico"><use href="#i-phone"/></svg>Phone app</button>
        <button class="icon-btn" data-act="ph-inbox" aria-label="Scans from phone" title="Scans from phone"><svg class="ico"><use href="#i-phone"/></svg><span class="dot" id="phdot" hidden>0</span></button>
        <button class="icon-btn" data-go="dashboard" data-scrollto="notifs" aria-label="Notifications"><svg class="ico"><use href="#i-bell"/></svg><span class="dot" id="ndot">5</span></button>
        <div class="store"><span class="sm" data-3="hospital"></span><div><b id="stName">ABC Medical Store</b><span>Salt Lake, Kolkata</span></div></div>
        <span class="live">Online</span>
      </div>
    </header>
    <main class="content" id="content"></main>
  </div>
</div>
<div class="papp" id="papp" hidden></div>
<div class="drawer-sc" id="drsc"></div>
<aside class="drawer" id="drawer"></aside>
<div class="mwrap" id="mwrap"><div class="modal" id="modal"></div></div>
<div class="toasts" id="toasts"></div>
<input type="file" id="fileIn" accept="image/*,.pdf" hidden>
<input type="file" id="camIn" accept="image/*" capture="environment" hidden>
<input type="file" id="galIn" accept="image/*" multiple hidden>
<input type="file" id="billIn" accept="image/*,.pdf" hidden>
<input type="file" id="csvIn" accept=".csv,text/csv" hidden>`;

export const doctorPortalHtml = `<div class="dapp" id="dapp"><div class="shell">
  <aside class="side" id="dside">
    <div class="brand"><div class="logo"><img src="/logo.png" alt="SevaDharam logo"></div><div><div class="bname">Seva<b>Dharam</b></div><div class="bsub">DOCTOR'S PLATFORM</div></div></div>
    <nav id="dnav"></nav>
    <div class="side-foot"><div class="av" id="dav" style="background:linear-gradient(135deg,#E0510F,#F08A3C)">AS</div><div class="who"><b id="dname">Dr. Aarav Sharma</b><span id="dspec">Cardiologist</span></div><button class="icon-btn" style="margin-left:auto;width:34px;height:34px" data-dact="logout" aria-label="Log out"><svg class="ico"><use href="#i-logout"/></svg></button></div>
  </aside>
  <div class="main">
    <header class="top">
      <button class="menu-btn" data-dact="menu" aria-label="Open menu"><svg class="ico"><use href="#i-menu"/></svg></button>
      <div class="dt-t">Doctor's Platform</div>
      <div class="top-r">
        <button class="theme-sw" data-act="theme" aria-label="Switch light or dark mode"><svg class="ico"><use href="#i-sun"/></svg><svg class="ico"><use href="#i-moon"/></svg><span class="knob"><svg class="ico knob-ico"><use href="#i-sun"/></svg></span></button>
        <button class="icon-btn" data-dact="go" data-p="requests" aria-label="Approval requests"><svg class="ico"><use href="#i-bell"/></svg><span class="dot" id="ddot" hidden>0</span></button>
        <span class="live">Verified</span>
      </div>
    </header>
    <main class="content" id="dcontent"></main>
  </div>
</div>
</div>
<div class="drawer-sc" id="drsc"></div>
<aside class="drawer" id="drawer"></aside>
<div class="mwrap" id="mwrap"><div class="modal" id="modal"></div></div>
<div class="toasts" id="toasts"></div>
<input type="file" id="fileIn" accept="image/*,.pdf" hidden>
<input type="file" id="camIn" accept="image/*" capture="environment" hidden>
<input type="file" id="galIn" accept="image/*" multiple hidden>
<input type="file" id="billIn" accept="image/*,.pdf" hidden>
<input type="file" id="csvIn" accept=".csv,text/csv" hidden>`;
