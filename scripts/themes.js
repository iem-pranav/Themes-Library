(() => {
  const DEFAULT_SHUFFLE_INTERVAL = 18; 
  const STORAGE_KEY = "themes.selected";
  const THEMES = {
    vibrant: { name: "Vibrant", "--bg-gradient": "linear-gradient(135deg, #ff7eb3, #65d2ff)", "--text-color":"#111827", "--btn-bg":"#ec4899" },
    techy: { name: "Techy", "--bg-gradient":"linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)", "--text-color":"#e2e8f0","--btn-bg":"#38bdf8" },
    energetic: { name: "Energetic","--bg-gradient":"linear-gradient(135deg, #22c55e, #06b6d4, #3b82f6)","--text-color":"#ffffff","--btn-bg":"#06b6d4" },
    cosmic: { name: "Cosmic","--bg-gradient":"linear-gradient(135deg, #7c3aed, #9333ea, #ec4899)","--text-color":"#fdf4ff","--btn-bg":"#9333ea" }
  };

  let currentTheme=null, shuffleTimer=null, shuffleInterval=DEFAULT_SHUFFLE_INTERVAL, shuffleActive=false;
  let panelEl, toggleBtn, helpOverlay, shuffleBtn;

  function el(tag, attrs={}, children=[]) {
    const e = document.createElement(tag);
    for(const k in attrs){ if(k==="class") e.className=attrs[k]; else if(k==="text") e.textContent=attrs[k]; else e.setAttribute(k, attrs[k]); }
    (Array.isArray(children)?children:[children]).forEach(c=>{if(!c)return; if(typeof c==="string") e.appendChild(document.createTextNode(c)); else e.appendChild(c);});
    return e;
  }

  function applyTheme(name, save=true){
    const theme = THEMES[name]; if(!theme) return;
    currentTheme = name;
    const root = document.documentElement;
    Object.keys(theme).forEach(k=>{ if(k!=="name") root.style.setProperty(k, theme[k]); });
    if(save) localStorage.setItem(STORAGE_KEY,name);
    updateActiveButton();
  }

  function randomThemeName(){ const keys=Object.keys(THEMES); return keys[Math.floor(Math.random()*keys.length)]; }

  function startShuffle(intervalSec){
    stopShuffle();
    if(!intervalSec || Number.isNaN(+intervalSec) || +intervalSec<=0) intervalSec=DEFAULT_SHUFFLE_INTERVAL;
    shuffleInterval=+intervalSec;
    shuffleTimer=setInterval(()=>{ setTheme(randomThemeName()); }, shuffleInterval*1000);
    shuffleActive=true; updateShuffleButton();
  }

  function stopShuffle(){ if(shuffleTimer){ clearInterval(shuffleTimer); shuffleTimer=null; } shuffleActive=false; updateShuffleButton(); }

  function toggleShuffle(){
    if(shuffleActive){ stopShuffle(); }
    else{
      let ans = prompt("Enter shuffle interval in seconds (Cancel for default 18s):", String(shuffleInterval||DEFAULT_SHUFFLE_INTERVAL));
      if(ans===null) startShuffle(DEFAULT_SHUFFLE_INTERVAL);
      else{ const val=parseFloat(ans); if(isNaN(val)||val<=0){ console.warn("Invalid number — using default"); startShuffle(DEFAULT_SHUFFLE_INTERVAL); } else startShuffle(val); }
    }
  }

  function buildUI(){
    const container=el("div",{class:"themes-switcher",id:"themes-switcher"});
    toggleBtn=el("button",{class:"themes-toggle-btn","aria-label":"Open themes panel"},"🎨");
    toggleBtn.addEventListener("click",()=>{ panelEl.classList.toggle("open"); toggleBtn.setAttribute("aria-expanded",panelEl.classList.contains("open")?"true":"false"); });
    panelEl=el("div",{class:"themes-panel"});
    panelEl.appendChild(el("div",{class:"title"},"Theme Picker"));

    const list=el("div",{class:"themes-list"});
    Object.keys(THEMES).forEach(key=>{
      const t=THEMES[key];
      const btn=el("button",{class:"themes-btn","data-theme":key,title:t.name},[t.name]);
      btn.style.background=t["--btn-bg"]||"var(--btn-bg)";
      btn.addEventListener("click",()=>{ setTheme(key); panelEl.classList.remove("open"); });
      list.appendChild(btn);
    });
    panelEl.appendChild(list);

    const controls=el("div",{class:"themes-controls"});
    const randomBtn=el("button",{class:"control-btn",title:"Random theme"},"🎲");
    randomBtn.addEventListener("click",()=>setTheme(randomThemeName())); controls.appendChild(randomBtn);
    shuffleBtn=el("button",{class:"control-btn",title:"Shuffle"},"🔁");
    shuffleBtn.addEventListener("click",()=>toggleShuffle()); controls.appendChild(shuffleBtn);
    const helpBtn=el("button",{class:"control-btn",title:"Help (Ctrl+H)"},"❓");
    helpBtn.addEventListener("click",()=>toggleHelp()); controls.appendChild(helpBtn);

    panelEl.appendChild(controls);
    container.appendChild(panelEl); container.appendChild(toggleBtn);
    document.body.appendChild(container);

    // help overlay
    helpOverlay=el("div",{class:"themes-help-overlay"});
    const helpBox=el("div",{class:"themes-help"});
    helpBox.innerHTML=`
      <strong>Theme Switcher — Help</strong>
      <p style="margin-top:8px">Use the theme button to open the panel. Choose a theme to apply it across the page.</p>
      <ul style="margin-left:18px;margin-top:8px">
        <li><strong>Random (🎲)</strong> picks a random theme</li>
        <li><strong>Shuffle (🔁)</strong> rotates themes automatically</li>
        <li>Press <kbd>Ctrl</kbd> + <kbd>H</kbd> to toggle this help popup</li>
      </ul>
      <div class="help-actions" style="text-align:right;margin-top:10px">
        <button id="themes-help-close" style="padding:8px 10px;border-radius:8px;border:none;cursor:pointer;background:#222;color:#fff">Close</button>
      </div>`;
    helpOverlay.appendChild(helpBox); document.body.appendChild(helpOverlay);
    document.getElementById("themes-help-close").addEventListener("click",()=>toggleHelp(false));
    helpOverlay.addEventListener("click",(e)=>{if(e.target===helpOverlay) toggleHelp(false);});
  }

  function updateActiveButton(){
    const btns=document.querySelectorAll(".themes-btn");
    btns.forEach(b=>{ const name=b.getAttribute("data-theme"); if(name===currentTheme){ b.style.outline="2px solid rgba(0,0,0,0.12)"; b.style.opacity="1"; } else{ b.style.outline="none"; b.style.opacity="0.95"; } });
  }

  function updateShuffleButton(){ if(!shuffleBtn) return; if(shuffleActive) shuffleBtn.classList.add("active"); else shuffleBtn.classList.remove("active"); }

  function toggleHelp(forceOpen=null){ if(!helpOverlay) return; const isOpen=helpOverlay.classList.contains("open"); const shouldOpen=forceOpen===null?!isOpen:forceOpen; helpOverlay.classList.toggle("open",shouldOpen); }

  function setTheme(name){ applyTheme(name,true); }

  function initThemeSwitcher(){
    if(document.getElementById("themes-switcher")) return;
    buildUI();
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved && THEMES[saved]) applyTheme(saved,false);
    else applyTheme(Object.keys(THEMES)[0],true);
    window.addEventListener("keydown",(e)=>{ if(e.ctrlKey&&(e.key==="h"||e.key==="H")){ e.preventDefault(); toggleHelp(); } });
  }

  window.themesSwitcher={ THEMES, initThemeSwitcher, setTheme, startShuffle, stopShuffle, toggleShuffle, getCurrentTheme:()=>currentTheme, isShuffleActive:()=>shuffleActive };

  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded",initThemeSwitcher); }
  else setTimeout(initThemeSwitcher,0);
})();
