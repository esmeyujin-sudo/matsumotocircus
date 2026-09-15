/* =========================================================
   松本達彦 幻想サーカス団 — Scripts
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeNav = () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

  /* ---------- Hero starfield ---------- */
  const starWrap = document.getElementById("stars");
  if (starWrap) {
    const count = window.innerWidth < 640 ? 60 : 120;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 78 + "%";
      const size = Math.random() * 2 + 1;
      s.style.width = s.style.height = size + "px";
      s.style.setProperty("--dur", (Math.random() * 3 + 2).toFixed(2) + "s");
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
      frag.appendChild(s);
    }
    starWrap.appendChild(frag);
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Countdown to Tokyo opening night ---------- */
  const target = new Date("2026-09-19T18:00:00+09:00").getTime();
  const cd = {
    d: document.getElementById("cdDays"),
    h: document.getElementById("cdHours"),
    m: document.getElementById("cdMins"),
    s: document.getElementById("cdSecs"),
  };
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    if (!cd.d) return;
    let diff = Math.max(0, target - Date.now());
    const day = Math.floor(diff / 86400000); diff -= day * 86400000;
    const hr = Math.floor(diff / 3600000); diff -= hr * 3600000;
    const min = Math.floor(diff / 60000); diff -= min * 60000;
    const sec = Math.floor(diff / 1000);
    cd.d.textContent = day;
    cd.h.textContent = pad(hr);
    cd.m.textContent = pad(min);
    cd.s.textContent = pad(sec);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Gallery: build SVG poster tiles + lightbox ---------- */
  const scenes = [
    { t: "空中の舞", cls: "tall", svg: sceneAerial() },
    { t: "炎のショー", cls: "", svg: sceneFire() },
    { t: "大テント", cls: "", svg: sceneTent() },
    { t: "観覧車の夜", cls: "", svg: sceneFerris() },
    { t: "道化師の登場", cls: "", svg: sceneClown() },
    { t: "気球の旅", cls: "tall", svg: sceneBalloon() },
    { t: "綱渡りの緊張", cls: "", svg: sceneRope() },
    { t: "満員の喝采", cls: "", svg: sceneCrowd() },
  ];
  const grid = document.getElementById("galleryGrid");
  if (grid) {
    scenes.forEach((sc, i) => {
      const fig = document.createElement("figure");
      fig.className = "gallery-tile reveal " + sc.cls;
      fig.style.transitionDelay = (i % 3) * 60 + "ms";
      fig.innerHTML = sc.svg + `<figcaption>${sc.t}</figcaption>`;
      fig.addEventListener("click", () => openLightbox(sc.svg, sc.t));
      grid.appendChild(fig);
    });
    // observe the newly added reveal tiles
    if ("IntersectionObserver" in window) {
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io2.unobserve(e.target); } });
      }, { threshold: 0.1 });
      grid.querySelectorAll(".reveal").forEach((el) => io2.observe(el));
    } else {
      grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    }
  }

  // Lightbox element
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `<button class="lightbox-close" aria-label="閉じる">&times;</button><div class="lightbox-inner"></div>`;
  document.body.appendChild(lb);
  const lbInner = lb.querySelector(".lightbox-inner");
  function openLightbox(svg, caption) {
    lbInner.innerHTML = svg + `<figcaption>${caption}</figcaption>`;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox-close")) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ---------- Contact form (demo) ---------- */
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      if (!name || !email) {
        formMsg.style.color = "var(--crimson)";
        formMsg.textContent = "お名前とメールアドレスをご入力ください。";
        return;
      }
      formMsg.style.color = "var(--teal)";
      formMsg.textContent = "送信ありがとうございます！折り返しご連絡いたします。";
      form.reset();
      setTimeout(() => (formMsg.textContent = ""), 6000);
    });
  }

  /* ---------- Welcome / next-show modal ---------- */
  const modal = document.getElementById("showModal");
  if (modal) {
    const closeModal = () => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => { modal.hidden = true; }, 350);
    };
    const openModal = () => {
      modal.hidden = false;
      void modal.offsetHeight; // reflow so the entrance transition plays
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    document.getElementById("modalClose").addEventListener("click", closeModal);
    modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

    // "View shows in my city" → close the modal, then let the anchor jump to the schedule
    const cityBtn = document.getElementById("modalCity");
    if (cityBtn) cityBtn.addEventListener("click", closeModal);

    // days remaining until the Tokyo opening night
    const modalDays = document.getElementById("modalDays");
    if (modalDays) {
      const d = Math.max(0, Math.floor((new Date("2026-09-19T18:00:00+09:00").getTime() - Date.now()) / 86400000));
      modalDays.textContent = d;
    }

    // open shortly after the page loads
    window.setTimeout(openModal, 500);
  }

  /* =========================================================
     SVG scene builders — self-contained circus illustrations
     ========================================================= */
  function frame(inner, defs) {
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1650"/><stop offset="1" stop-color="#120a26"/></linearGradient>
        ${defs || ""}
      </defs>
      <rect width="400" height="300" fill="url(#sky)"/>
      ${dots()}
      ${inner}
    </svg>`;
  }
  function dots() {
    let d = "";
    for (let i = 0; i < 40; i++) {
      const x = Math.round(Math.random() * 400), y = Math.round(Math.random() * 170), r = (Math.random() * 1.3 + 0.4).toFixed(1);
      d += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(Math.random() * 0.6 + 0.2).toFixed(2)}"/>`;
    }
    return d;
  }
  function sceneAerial() {
    return frame(`
      <circle cx="320" cy="55" r="34" fill="#f4c95d" opacity=".85"/>
      <line x1="150" y1="0" x2="150" y2="120" stroke="#6b4fa0" stroke-width="2"/>
      <line x1="250" y1="0" x2="250" y2="120" stroke="#6b4fa0" stroke-width="2"/>
      <rect x="140" y="118" width="20" height="6" rx="3" fill="#e23b4e"/>
      <rect x="240" y="118" width="20" height="6" rx="3" fill="#e23b4e"/>
      <g fill="#140b26">
        <circle cx="150" cy="150" r="10"/><rect x="146" y="158" width="8" height="26" rx="4"/>
        <path d="M150 165 l-16 12 M150 165 l16 12" stroke="#140b26" stroke-width="6" stroke-linecap="round"/>
        <path d="M150 182 l-12 22 M150 182 l12 22" stroke="#140b26" stroke-width="6" stroke-linecap="round"/>
      </g>
      <path d="M0 300 Q200 250 400 300 Z" fill="#3a2159"/>`);
  }
  function sceneFire() {
    return frame(`
      <g>
        <circle cx="200" cy="230" r="70" fill="#e23b4e" opacity=".25"/>
        <path d="M200 120 C175 165 215 180 195 220 C185 200 172 205 178 235 C160 220 158 260 178 285 C200 305 245 298 250 260 C254 228 232 222 232 200 C246 212 244 175 200 120 Z" fill="#f4c95d"/>
        <path d="M200 160 C188 188 210 196 200 222 C193 210 185 214 189 232 C178 222 178 250 192 268 C205 280 228 274 230 250 C232 230 218 226 218 212 C226 220 224 196 200 160 Z" fill="#e23b4e"/>
      </g>
      <circle cx="90" cy="70" r="26" fill="#f4c95d" opacity=".7"/>`);
  }
  function sceneTent() {
    return frame(`
      <path d="M200 50 L280 130 L120 130 Z" fill="#e23b4e"/>
      <path d="M200 50 L245 130 L200 130 Z" fill="#fff6e6"/>
      <path d="M200 50 L155 130 L200 130 Z" fill="#a3172b"/>
      <path d="M120 130 Q160 150 200 130 Q240 150 280 130 L280 145 Q200 165 120 145 Z" fill="#a3172b"/>
      <path d="M135 145 L150 250 L250 250 L265 145 Q200 160 135 145 Z" fill="#fff6e6"/>
      <rect x="185" y="185" width="30" height="65" fill="#4a1020"/>
      <rect x="197" y="42" width="4" height="14" fill="#f4c95d"/>
      <path d="M201 44 L222 50 L201 56 Z" fill="#f4c95d"/>
      <path d="M0 250 L400 250 L400 300 L0 300 Z" fill="#3a2159"/>`);
  }
  function sceneFerris() {
    let spokes = "";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const x = 200 + Math.cos(a) * 90, y = 150 + Math.sin(a) * 90;
      spokes += `<line x1="200" y1="150" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}" stroke="#6b4fa0" stroke-width="2"/>`;
      spokes += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="9" fill="${i % 2 ? "#e23b4e" : "#f4c95d"}"/>`;
    }
    return frame(`
      <circle cx="200" cy="150" r="90" fill="none" stroke="#f4c95d" stroke-width="3"/>
      ${spokes}
      <circle cx="200" cy="150" r="10" fill="#fff6e6"/>
      <path d="M200 150 L165 270 L235 270 Z" fill="#271745" stroke="#6b4fa0" stroke-width="2"/>
      <rect x="0" y="270" width="400" height="30" fill="#3a2159"/>`);
  }
  function sceneClown() {
    return frame(`
      <circle cx="200" cy="150" r="70" fill="#f3d3b3"/>
      <circle cx="200" cy="165" r="16" fill="#e23b4e"/>
      <circle cx="172" cy="130" r="9" fill="#140b26"/>
      <circle cx="228" cy="130" r="9" fill="#140b26"/>
      <path d="M165 185 Q200 220 235 185" fill="none" stroke="#a3172b" stroke-width="6" stroke-linecap="round"/>
      <path d="M150 95 Q200 60 250 95 L235 105 Q200 82 165 105 Z" fill="#e23b4e"/>
      <g fill="#f4c95d"><circle cx="140" cy="150" r="10"/><circle cx="260" cy="150" r="10"/></g>
      <path d="M120 260 Q200 210 280 260 L280 300 L120 300 Z" fill="#3a2159"/>`);
  }
  function sceneBalloon() {
    return frame(`
      <circle cx="200" cy="120" r="70" fill="#e23b4e"/>
      <path d="M130 120 a70 70 0 0 1 140 0 Z" fill="#f4c95d" opacity=".0"/>
      <path d="M200 50 C170 70 170 150 200 190 C230 150 230 70 200 50 Z" fill="#fff6e6" opacity=".55"/>
      <path d="M160 130 C170 160 185 180 200 190" fill="none"/>
      <path d="M175 182 L188 220 M225 182 L212 220" stroke="#f4c95d" stroke-width="2"/>
      <rect x="184" y="220" width="32" height="22" rx="4" fill="#4a2a12" stroke="#f4c95d" stroke-width="2"/>
      <circle cx="330" cy="60" r="28" fill="#f4c95d" opacity=".8"/>
      <path d="M0 300 Q200 260 400 300 Z" fill="#3a2159"/>`);
  }
  function sceneRope() {
    return frame(`
      <line x1="0" y1="160" x2="400" y2="150" stroke="#f4c95d" stroke-width="3"/>
      <g fill="#140b26">
        <circle cx="200" cy="135" r="11"/>
        <rect x="196" y="144" width="8" height="20" rx="4"/>
        <path d="M120 150 L200 150 L280 150" stroke="#140b26" stroke-width="4"/>
        <path d="M200 162 l-14 22 M200 162 l14 22" stroke="#140b26" stroke-width="7" stroke-linecap="round"/>
      </g>
      <circle cx="70" cy="70" r="30" fill="#f4c95d" opacity=".75"/>
      <path d="M0 260 L400 260 L400 300 L0 300 Z" fill="#3a2159"/>`);
  }
  function sceneCrowd() {
    let heads = "";
    for (let i = 0; i < 22; i++) {
      const x = 20 + (i % 11) * 36, y = 210 + Math.floor(i / 11) * 34;
      heads += `<circle cx="${x}" cy="${y}" r="12" fill="#271745" stroke="#6b4fa0" stroke-width="1.5"/>`;
    }
    return frame(`
      <path d="M200 40 L330 150 L70 150 Z" fill="#e23b4e" opacity=".9"/>
      <path d="M200 40 L265 150 L200 150 Z" fill="#fff6e6" opacity=".9"/>
      <circle cx="200" cy="120" r="30" fill="#f4c95d"/>
      <path d="M0 175 L400 175 L400 300 L0 300 Z" fill="#1a1030"/>
      ${heads}`);
  }
})();
