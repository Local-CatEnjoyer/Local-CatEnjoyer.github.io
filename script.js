// theme toggle — flips data-theme on <html>, remembers it in localStorage
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

// mobile nav toggle
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

// fade in .reveal elements as they scroll into view
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

// play/pause for each track, using data-src on the container
(function audioPlayers(){
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

// paw print trail on mouse move, hero only
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

// builds the animated spectrum bars in the hero
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
