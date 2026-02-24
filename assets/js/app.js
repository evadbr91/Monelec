// Year
const yEl = document.getElementById("y");
if (yEl) yEl.textContent = new Date().getFullYear();

// ===== Carousel (uniquement si présent) =====
const track = document.getElementById("track");
const slides = track ? Array.from(track.children) : [];
const dots = document.getElementById("dots");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let i = 0;
let timer = null;
let paused = false;

function setActive(){
  slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  const all = dots ? dots.querySelectorAll(".dotBtn") : [];
  all.forEach((d, idx) => d.classList.toggle("active", idx === i));
}

function buildDots(){
  if(!dots) return;
  dots.innerHTML = "";
  slides.forEach((_, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dotBtn" + (idx === 0 ? " active" : "");
    b.addEventListener("click", () => go(idx, true));
    dots.appendChild(b);
  });
}

function go(idx, user){
  if(!slides.length) return;
  i = (idx + slides.length) % slides.length;
  track.style.transform = "translateX(" + (-i * 100) + "%)";
  setActive();
  if(user) restart();
}

function start(){
  if(!slides.length) return;
  if(timer) clearInterval(timer);
  timer = setInterval(() => {
    if(!paused) go(i + 1, false);
  }, 5200);
}

function restart(){
  paused = false;
  start();
}

function pause(){
  paused = true;
}

if(slides.length){
  buildDots();
  setActive();
  start();

  if(prev) prev.addEventListener("click", () => go(i - 1, true));
  if(next) next.addEventListener("click", () => go(i + 1, true));

  const viewport = document.querySelector(".viewport");
  if(viewport){
    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", restart);
    viewport.addEventListener("touchstart", pause, { passive:true });
    viewport.addEventListener("touchend", restart, { passive:true });
  }

  document.addEventListener("visibilitychange", () => {
    if(document.hidden) pause();
    else restart();
  });
}

// Ajuste la vitesse des avis sur petit écran
const mq = window.matchMedia("(max-width: 520px)");
if (mq.matches) {
  const rt = document.getElementById("reviewsTrack");
  if (rt) rt.style.animationDuration = "34s";
}

// ===== Form devis (uniquement si présent) =====
const form = document.getElementById("quoteForm");
if(form){
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("name")?.value || "").trim();
    const city = (document.getElementById("city")?.value || "").trim();
    const type = (document.getElementById("type")?.value || "").trim();
    const msg  = (document.getElementById("msg")?.value || "").trim();

    const to = "monelec3@gmail.com";
    const subject = encodeURIComponent("Demande de devis — " + type + " — " + city);
    const body = encodeURIComponent(
      "Bonjour,\n\n" +
      "Je souhaite un devis.\n\n" +
      "Nom : " + name + "\n" +
      "Ville / Département : " + city + "\n" +
      "Type de travaux : " + type + "\n\n" +
      "Détails :\n" + (msg || "(non précisé)") + "\n\n" +
      "Contact MONELEC : 06 95 40 68 64 — monelec3@gmail.com\n\n" +
      "Merci,\n" + (name || "—")
    );

    window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
  });
}

// ===== Lightbox (uniquement si présent) =====
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");

function openLb(src){
  if(!lightbox || !lbImg) return;
  lbImg.src = src;
  lightbox.classList.add("open");
  pause();
}
function closeLb(){
  if(!lightbox || !lbImg) return;
  lightbox.classList.remove("open");
  lbImg.src = "";
  restart();
}

document.querySelectorAll(".gItem").forEach(item => {
  item.addEventListener("click", () => {
    const src = item.getAttribute("data-full");
    if(src) openLb(src);
  });
});

if(lbClose) lbClose.addEventListener("click", closeLb);
if(lightbox){
  lightbox.addEventListener("click", (e) => {
    if(e.target === lightbox) closeLb();
  });
}
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeLb();
});

// ===== Reveal on scroll (toutes pages) =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if(ent.isIntersecting){
      ent.target.classList.add("on");
      io.unobserve(ent.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));
