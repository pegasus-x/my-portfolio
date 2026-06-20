
gsap.registerPlugin(ScrollTrigger);

// === SMOOTH SCROLL ===
const lenis = new Lenis({
    lerp: 0.08, // Buttery smooth linear interpolation
    wheelMultiplier: 1, // Standard wheel speed
    touchMultiplier: 2, // Faster response on touch devices
    smoothTouch: true, // Enable smooth scroll on touch devices too
    normalizeWheel: true, // Normalizes wheel input across browsers
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                lenis.scrollTo(targetElement, {
                    lerp: 0.08
                });

                // If mobile menu is open, close it (fallback just in case)
                if (typeof closeMenu === 'function') closeMenu();
            }
        }
    });
});

// === THEME TOGGLE ===
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// === ULTRA-PREMIUM PRELOADER ===
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    const preloader = document.getElementById('preloader');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderBar = document.getElementById('loader-bar');
    const loaderStatus = document.getElementById('loader-status');

    // Initial entry animation for loader elements
    gsap.to(["#loader-top", "#loader-bottom"], {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: 0.2
    });

    gsap.to("#loader-center", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
        delay: 0.4
    });

    let progress = { value: 0 };

    // Smooth GSAP counter for the percentage
    gsap.to(progress, {
        value: 100,
        duration: 1.5, // Enough time to read the numbers
        ease: "linear",
        delay: 0.5, // Wait for loader to fade in before counting
        onUpdate: () => {
            const current = Math.floor(progress.value);
            if (loaderPercent) loaderPercent.innerText = current;
            if (loaderBar) loaderBar.style.width = `${current}%`;

            // Dynamically update text based on progress
            if (loaderStatus) {
                if (current > 30 && current < 70) loaderStatus.innerText = "Building Interfaces";
                if (current >= 70 && current < 95) loaderStatus.innerText = "Connecting Systems";
                if (current >= 95) loaderStatus.innerText = "System Ready";
            }
        },
        onComplete: () => {
            // Exit sequence
            setTimeout(() => {
                // Preloader slides up out of view
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: () => preloader.remove()
                });

                // Hero text reveal synced with slide up
                gsap.from(".hero-title-line", {
                    y: "100%",
                    opacity: 0,
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power4.out",
                    delay: 0.8
                });

                gsap.from(".reveal-fade", {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.8
                });
            }, 100); // Hold at 100% briefly before revealing site
        }
    });
});


// === NAVBAR & BACK TO TOP ===
let lastScrollY = window.scrollY;
const navbar = document.getElementById("navbar");
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {
        backToTopBtn.classList.add("btt-visible");
    } else {
        backToTopBtn.classList.remove("btt-visible");
    }

    lastScrollY = window.scrollY;
});

backToTopBtn.addEventListener("click", () => {
    lenis.scrollTo(0, { lerp: 0.08 });
});

// === MOBILE MENU ===
const sideMenu = document.getElementById("sideMenu");
function openMenu() {
    sideMenu.style.transform = "translateX(0)";
    document.body.style.overflow = "hidden";
}
function closeMenu() {
    sideMenu.style.transform = "translateX(100%)";
    document.body.style.overflow = "auto";
}

// === SCROLL REVEALS (for sections below hero) ===
gsap.utils.toArray('.reveal-fade:not(#top .reveal-fade)').forEach(el => {
    gsap.from(el, {
        opacity: 0, y: 40, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
    });
});

// === STICKY STACK PROJECT CARDS ===
const cards = gsap.utils.toArray('.project-stack-card');

cards.forEach((card, index) => {
    // Inject dynamic overlay for premium SaaS shadow effect
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-slate-900/30 dark:bg-black/60 z-50 pointer-events-none opacity-0 rounded-[2rem]';
    card.appendChild(overlay);

    if (index !== cards.length - 1) {
        // Animate the card pushing back
        gsap.to(card, {
            scale: 0.92,
            y: "-2vh",
            filter: "blur(3px)", // SaaS depth of field
            scrollTrigger: {
                trigger: cards[index + 1],
                start: "top 95%",
                endTrigger: cards[index + 1],
                end: "top 12%",
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        // Animate the overlay darkening
        gsap.to(overlay, {
            opacity: 1,
            scrollTrigger: {
                trigger: cards[index + 1],
                start: "top 95%",
                endTrigger: cards[index + 1],
                end: "top 12%",
                scrub: true,
                invalidateOnRefresh: true
            }
        });
    }
});


// === CLOCK ===
function updateClock() {
    const clockEl = document.getElementById('os-clock');
    const dateEl = document.getElementById('os-date');
    if (!clockEl || !dateEl) return;

    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };

    clockEl.innerText = now.toLocaleTimeString('en-IN', timeOptions);
    dateEl.innerText = now.toLocaleDateString('en-IN', dateOptions) + ' • IST';
}
setInterval(updateClock, 1000);
updateClock();

// === TECH STACK TABS ===
function switchSkillTab(category, btnElement) {
    document.querySelectorAll('.skill-tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-neon-orange/10', 'dark:bg-neon-orange/20', 'border-neon-orange/30', 'text-neon-orange');
        btn.classList.add('bg-slate-100', 'dark:bg-white/5', 'border-slate-200', 'dark:border-white/5', 'text-slate-500', 'dark:text-zinc-400');
    });

    btnElement.classList.add('active', 'bg-neon-orange/10', 'dark:bg-neon-orange/20', 'border-neon-orange/30', 'text-neon-orange');
    btnElement.classList.remove('bg-slate-100', 'dark:bg-white/5', 'border-slate-200', 'dark:border-white/5', 'text-slate-500', 'dark:text-zinc-400');

    document.querySelectorAll('.skill-pill-group').forEach(group => {
        group.classList.add('hidden');
    });

    const targetGroup = document.getElementById(`skill-group-${category}`);
    if (targetGroup) {
        targetGroup.classList.remove('hidden');
        gsap.from(targetGroup.querySelectorAll('.w-full'), {
            opacity: 0,
            y: 10,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out"
        });
    }
}

// === HERO WEBGL ANIMATION — NEURAL CONSTELLATION ===
function initHeroWebGL() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    if (typeof THREE === 'undefined') { console.warn('Three.js not loaded'); return; }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);

    let isDark = document.documentElement.classList.contains('dark');

    function getPalette() {
        return isDark
            ? { node: 0xA78BFA, line: 0x6C63FF } // Indigo / Violet
            : { node: 0x6366F1, line: 0x4F46E5 }; // Brand colors
    }

    const { node, line } = getPalette();

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 120 : 250;
    const maxDistance = isMobile ? 12 : 15;

    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 80; // x
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 80; // y
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40; // z

        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: node,
        size: 0.4,
        transparent: true,
        opacity: isDark ? 0.8 : 0.9,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Lines
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
        color: line,
        transparent: true,
        opacity: isDark ? 0.15 : 0.25,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isActive = false; // Track if mouse/touch is active

    window.addEventListener('mousemove', (e) => {
        isActive = true;
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetX = mouseX * 20;
        targetY = mouseY * 20;
    });

    window.addEventListener('mouseleave', () => {
        isActive = false; // Stop repulsing when mouse leaves window
    });

    function handleTouch(e) {
        isActive = true;
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        targetX = mouseX * 20;
        targetY = mouseY * 20;
    }

    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    window.addEventListener('touchend', () => {
        isActive = false; // Stop repulsing when finger is lifted
    });

    // Theme Update
    function applyTheme() {
        isDark = document.documentElement.classList.contains('dark');
        const p = getPalette();
        particleMaterial.color.setHex(p.node);
        particleMaterial.opacity = isDark ? 0.8 : 0.9;
        particleMaterial.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
        particleMaterial.needsUpdate = true;

        linesMaterial.color.setHex(p.line);
        linesMaterial.opacity = isDark ? 0.15 : 0.25;
        linesMaterial.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
        linesMaterial.needsUpdate = true;
    }
    document.getElementById('themeToggle').addEventListener('click', () => setTimeout(applyTheme, 50));

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        const positions = particleSystem.geometry.attributes.position.array;

        // Update particles
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += particleVelocities[i].x;
            positions[i * 3 + 1] += particleVelocities[i].y;
            positions[i * 3 + 2] += particleVelocities[i].z;

            // Bounds check
            if (positions[i * 3] < -40 || positions[i * 3] > 40) particleVelocities[i].x *= -1;
            if (positions[i * 3 + 1] < -40 || positions[i * 3 + 1] > 40) particleVelocities[i].y *= -1;
            if (positions[i * 3 + 2] < -20 || positions[i * 3 + 2] > 20) particleVelocities[i].z *= -1;

            // Mouse repulsion
            if (isActive) {
                const dx = positions[i * 3] - targetX;
                const dy = positions[i * 3 + 1] - targetY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repulseRadius = isMobile ? 18 : 10; // Larger touch area for mobile
                if (dist < repulseRadius) {
                    positions[i * 3] += dx * 0.015;
                    positions[i * 3 + 1] += dy * 0.015;
                }
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Update lines
        const linePositions = [];

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDistance) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }

        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // Gentle parallax rotation
        scene.rotation.y += (targetX * 0.01 - scene.rotation.y) * 0.05;
        scene.rotation.x += (-targetY * 0.01 - scene.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener('load', () => {
    // initialize after preloader
    setTimeout(initHeroWebGL, 500);
});

// === EMAILJS INTEGRATION ===
(function () {
    // Initialize EmailJS
    // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
    emailjs.init("bddN2Ey-WWMCRu9Xx");
})();

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const btn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');

    // Save original state
    const originalText = btnText.innerText;

    // Loading state
    btnText.innerText = 'Sending...';
    btnIcon.classList.add('animate-spin');
    btnIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>`;

    // Send Email
    // IMPORTANT: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS credentials
    emailjs.sendForm('service_pigx5e5', 'template_sx9dqdf', this)
        .then(() => {
            // Success state
            btnText.innerText = 'Message Sent!';
            btn.classList.remove('from-neon-orange', 'to-warm-gold');
            btn.classList.add('from-[#10B981]', 'to-emerald-400'); // Green gradient
            btnIcon.classList.remove('animate-spin');
            btnIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`;
            this.reset();

            // Revert back after 3 seconds
            setTimeout(() => {
                btnText.innerText = originalText;
                btn.classList.add('from-neon-orange', 'to-warm-gold');
                btn.classList.remove('from-[#10B981]', 'to-emerald-400');
                btnIcon.innerHTML = `<path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>`;
            }, 3000);
        }, (error) => {
            // Error state
            console.error('EmailJS Error:', error);
            btnText.innerText = 'Failed! Try Again';
            btnIcon.classList.remove('animate-spin');
            btnIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;

            // Revert back after 3 seconds
            setTimeout(() => {
                btnText.innerText = originalText;
                btnIcon.innerHTML = `<path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>`;
            }, 3000);
        });
});

// === CUSTOM CURSOR ===
const cursor = document.getElementById('custom-cursor');
const follower = document.getElementById('custom-cursor-follower');

if (cursor && follower) {
    if (window.innerWidth >= 768) {
        document.body.style.cursor = 'none';

        const interactables = document.querySelectorAll('a, button, input, textarea, select');
        interactables.forEach(el => {
            el.style.cursor = 'none';
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
                gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(108, 99, 255, 0.1)', borderColor: 'transparent', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
                gsap.to(follower, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(108, 99, 255, 0.5)', duration: 0.3 });
            });
        });

        // Set initial positions off-screen to avoid flash
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        gsap.set(follower, { xPercent: -50, yPercent: -50 });

        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
        });
    }
}
