/* ==========================================================
   LCE portfolio — script.js
   Four small, independent features. Each one is self-contained,
   so you can read/edit them one at a time.
   ========================================================== */

/* ---------- 1. Theme switching (dark / light) ---------- */
// The actual colors live in style.css as CSS variables — this
// just toggles a data-theme attribute on <html> and remembers
// the choice in localStorage so it persists on reload.
(function themeSwitching(){
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('lce-theme');

    if(saved === 'light'){
        root.setAttribute('data-theme', 'light');
    }

    toggleBtn.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        if(isLight){
            root.removeAttribute('data-theme');
            localStorage.setItem('lce-theme', 'dark');
            toggleBtn.setAttribute('aria-label', 'Switch to light theme');
        } else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('lce-theme', 'light');
            toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        }
    });
})();

/* ---------- 2. Mobile navigation ---------- */
// Below 780px, style.css hides .nav-links by default. This just
// toggles a class to show/hide it, and closes the menu again
// once a link is tapped.
(function mobileNav(){
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
})();

/* ---------- 3. Scroll reveal ---------- */
// Any element with the .reveal class starts hidden (see the CSS)
// and fades/slides in the first time it scrolls into view.
// IntersectionObserver does the "has this entered the viewport"
// check without us having to listen to every scroll event.
(function scrollReveal(){
    const targets = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){
        // Fallback for very old browsers: just show everything.
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // only animate once
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(el => observer.observe(el));
})();

/* ---------- 4. Audio player placeholder interaction ---------- */
// Every play button lives inside a container with a data-src
// attribute. Right now data-src is empty everywhere, because
// there's no real audio yet.
//
// HOW TO ADD REAL AUDIO LATER:
// 1. Put an audio file (mp3) somewhere in your repo, e.g. /audio/colosseum-boss-theme.mp3
// 2. Set data-src="audio/colosseum-boss-theme.mp3" on that .player or .audio-slot element
// 3. That's it — this script will automatically play/pause it
//    instead of showing "Audio coming soon".
(function audioPlaceholders(){
    const containers = document.querySelectorAll('.player, .audio-slot');
    let currentAudio = null;
    let currentBtn = null;
    let currentStatus = null;

    containers.forEach(container => {
        const btn = container.querySelector('.play-btn');
        const status = container.querySelector('.player-status');
        const src = container.dataset.src;

        btn.addEventListener('click', () => {
            if(!src){
                // No audio linked yet — just give a small visual nudge.
                if(status){
                    const original = status.textContent;
                    status.textContent = 'No audio linked yet';
                    setTimeout(() => { status.textContent = original; }, 1600);
                }
                return;
            }

            // Stop whatever else is currently playing.
            if(currentAudio && currentAudio.src.indexOf(src) === -1){
                currentAudio.pause();
                currentBtn.classList.remove('is-playing');
                if(currentStatus) currentStatus.textContent = 'Play';
            }

            if(!container._audioEl){
                container._audioEl = new Audio(src);
                container._audioEl.addEventListener('ended', () => {
                    btn.classList.remove('is-playing');
                    if(status) status.textContent = 'Play';
                });
            }

            const audio = container._audioEl;
            if(audio.paused){
                audio.play();
                btn.classList.add('is-playing');
                if(status) status.textContent = 'Playing';
                currentAudio = audio;
                currentBtn = btn;
                currentStatus = status;
            } else {
                audio.pause();
                btn.classList.remove('is-playing');
                if(status) status.textContent = 'Play';
            }
        });
    });
})();

/* ---------- Paw-print cursor trail (hero only) ---------- */
// A small, playful touch: moving the mouse across the hero leaves
// a couple of tiny fading paw prints behind. Throttled so it's a
// light trail, not a mess, and skipped entirely on touch devices
// or when the visitor has motion reduced.
(function pawTrail(){
    const hero = document.querySelector('.hero');
    if(!hero) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if(prefersReducedMotion || isTouch) return;

    let lastStamp = 0;
    const minGap = 420; // ms between prints — sparse and restrained, not a gimmick

    hero.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if(now - lastStamp < minGap) return;
        lastStamp = now;

        const rect = hero.getBoundingClientRect();
        const print = document.createElement('span');
        print.className = 'paw-print';
        print.style.left = (e.clientX - rect.left) + 'px';
        print.style.top = (e.clientY - rect.top) + 'px';
        hero.appendChild(print);

        setTimeout(() => print.remove(), 900);
    });
})();

/* ---------- Spectrum analyzer bars (hero decoration) ---------- */
// Purely visual — builds the animated bars next to the hero CTA.
(function buildSpectrum(){
    const spectrum = document.getElementById('spectrum');
    if(!spectrum) return;
    const barCount = 40;
    for(let i = 0; i < barCount; i++){
        const bar = document.createElement('span');
        bar.style.height = (12 + Math.random() * 48) + 'px';
        bar.style.animationDelay = (Math.random() * 1.3).toFixed(2) + 's';
        bar.style.animationDuration = (1 + Math.random() * 0.7).toFixed(2) + 's';
        spectrum.appendChild(bar);
    }
})();
