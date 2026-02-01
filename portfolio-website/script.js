// ============================================
// Sound Effects & Vibration System
// ============================================

// Audio Context for sound effects
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Play a synth click sound
function playClickSound() {
    try {
        const ctx = initAudio();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Play hover sound (softer, higher pitch)
function playHoverSound() {
    try {
        const ctx = initAudio();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Play Rasengan power-up sound
function playRasenganSound() {
    try {
        const ctx = initAudio();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Vibration for mobile devices
function vibrate(duration = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// Add sound to all interactive elements
function initSoundEffects() {
    // Button clicks
    document.querySelectorAll('.btn, .social-link, .nav-link, .cert-card, .project-link').forEach(el => {
        el.addEventListener('click', () => {
            playClickSound();
            vibrate(30);
        });
    });

    // Card hovers
    document.querySelectorAll('.skill-card, .project-card, .cert-card, .stat-badge').forEach(el => {
        el.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
}

// Initialize sounds after first user interaction (required by browsers)
document.addEventListener('click', function initOnFirstClick() {
    initAudio();
    initSoundEffects();
    document.removeEventListener('click', initOnFirstClick);
}, { once: true });

// ============================================
// Navigation - Scroll Effect & Mobile Menu
// ============================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============================================
// Active Navigation Link on Scroll
// ============================================

const sections = document.querySelectorAll('section');

function setActiveNav() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ============================================
// Reveal on Scroll Animation
// ============================================

function revealOnScroll() {
    const reveals = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .contact-card, .about-content, .stat');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('reveal', 'active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form is now handled by EmailJS at the end of this file

// ============================================
// Morphing Text Animation
// ============================================

const morphText = document.querySelector('.morph-text');
const roles = [
    'ECE Student',
    'Embedded Systems Developer',
    'IoT Enthusiast',
    'Digital Content Creator',
    'Electronics Engineer'
];

if (morphText) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function morphType() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            morphText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            morphText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(morphType, typingSpeed);
    }

    // Start the animation after a short delay
    setTimeout(morphType, 1000);
}

// ============================================
// Dynamic Color-Changing Name Letters
// ============================================

const dynamicName = document.getElementById('dynamic-name');
const nameColors = [
    '#00CED1', // Teal
    '#4169E1', // Royal Blue
    '#9370DB', // Medium Purple
    '#48D1CC', // Medium Turquoise
    '#FFB347', // Pastel Orange
    '#40E0D0', // Turquoise
    '#6495ED', // Cornflower Blue
    '#F4D03F', // Meteor Gold
    '#E8F4F8', // Starlight White
];

if (dynamicName) {
    const originalText = dynamicName.textContent;

    // Wrap each letter in a span
    function wrapLetters() {
        dynamicName.innerHTML = originalText
            .split('')
            .map((char, index) => {
                if (char === ' ') return ' ';
                return `<span class="dynamic-letter" data-index="${index}">${char}</span>`;
            })
            .join('');
    }

    wrapLetters();

    // Change random letters' colors every second
    function animateColors() {
        const letters = dynamicName.querySelectorAll('.dynamic-letter');

        letters.forEach((letter, index) => {
            // Random chance to change color (about 30% of letters per cycle)
            if (Math.random() < 0.3) {
                const randomColor = nameColors[Math.floor(Math.random() * nameColors.length)];
                letter.style.color = randomColor;
                letter.style.textShadow = `0 0 20px ${randomColor}, 0 0 40px ${randomColor}`;
            }
        });
    }

    // Run animation every second
    setInterval(animateColors, 1000);

    // Initial animation
    animateColors();
}

// ============================================
// Add CSS class for reveal animation
// ============================================

const style = document.createElement('style');
style.textContent = `
    .skill-card, .project-card, .timeline-item, .contact-card, .about-content, .stat {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .skill-card.active, .project-card.active, .timeline-item.active, 
    .contact-card.active, .about-content.active, .stat.active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

console.log('Portfolio website loaded successfully! ✨');

// ============================================
// Anime Particle System
// ============================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = ['#ff6bcb', '#00d4ff', '#ffd700', '#a855f7', '#ffcb05'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = Math.random() * 4 + 6;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;

            container.appendChild(particle);
        }, i * 200);
    }
}

// ============================================
// Sparkle Cursor Trail
// ============================================

function initSparkleTrail() {
    const container = document.getElementById('sparkle-container');
    if (!container) return;

    const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '✦', '★'];
    let lastSparkle = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < 50) return; // Throttle sparkle creation
        lastSparkle = now;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        sparkle.style.cssText = `
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: ${Math.random() * 12 + 10}px;
        `;

        container.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    });
}

// ============================================
// Enhanced Anime Scroll Reveal
// ============================================

function animeRevealOnScroll() {
    const reveals = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .contact-card, .cert-card');

    reveals.forEach((element, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            setTimeout(() => {
                element.style.transform = 'translateY(0) scale(1)';
                element.style.opacity = '1';
            }, index * 100);
        }
    });
}

// Initialize anime effects when page loads
window.addEventListener('load', () => {
    createParticles();
    initSparkleTrail();

    // Add initial styles for anime reveal
    const revealElements = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .contact-card, .cert-card');
    revealElements.forEach(el => {
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

window.addEventListener('scroll', animeRevealOnScroll);

// ============================================
// Anime Power-Up Effect on Profile Image
// ============================================

const profileImage = document.querySelector('.image-wrapper');
if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        profileImage.style.transform = 'scale(1.05)';
        profileImage.style.transition = 'transform 0.3s ease';
    });

    profileImage.addEventListener('mouseleave', () => {
        profileImage.style.transform = 'scale(1)';
    });
}

console.log('Anime aesthetic loaded! 🎌✨🔥');

// ============================================
// Rasengan Link Effect - FULLSCREEN
// ============================================

function createRasengan(x, y) {
    const container = document.getElementById('rasengan-container');
    if (!container) return;

    // Play Rasengan sound and vibrate!
    playRasenganSound();
    vibrate(100);

    // Create fullscreen flash overlay
    const flash = document.createElement('div');
    flash.className = 'rasengan-fullscreen';
    flash.style.setProperty('--x', x + 'px');
    flash.style.setProperty('--y', y + 'px');
    document.body.appendChild(flash);

    // Create main Rasengan at click position
    const rasengan = document.createElement('div');
    rasengan.className = 'rasengan';
    rasengan.style.left = x + 'px';
    rasengan.style.top = y + 'px';

    rasengan.innerHTML = `
        <div class="rasengan-core">
            <div class="rasengan-spiral"></div>
            <div class="rasengan-spiral"></div>
            <div class="rasengan-spiral"></div>
            <div class="rasengan-particles"></div>
        </div>
        <div class="rasengan-ring"></div>
        <div class="rasengan-ring"></div>
        <div class="rasengan-ring"></div>
    `;

    container.appendChild(rasengan);

    // Clean up after animation
    setTimeout(() => {
        rasengan.remove();
        flash.remove();
    }, 800);
}

// Add Rasengan effect to external links
function initRasenganLinks() {
    // Select all external links (with target="_blank")
    const externalLinks = document.querySelectorAll('a[target="_blank"]');

    externalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Create fullscreen Rasengan effect
            createRasengan(x, y);

            // Navigate after animation completes
            setTimeout(() => {
                window.open(href, '_blank');
            }, 700);
        });
    });

    // Also add to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createRasengan(x, y);
        });
    });
}

// Initialize Rasengan effect
window.addEventListener('load', initRasenganLinks);

console.log('Rasengan FULLSCREEN effect ready! 🌀💨🔥');

// ============================================
// EmailJS Contact Form Integration
// ============================================

// Initialize EmailJS with your public key
(function () {
    emailjs.init("AKHejFytl6avf3Lqs");
})();

// Handle contact form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Get submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show sending state
        submitBtn.textContent = '⚡ Sending...';
        submitBtn.disabled = true;

        // Play sound effect
        playClickSound();

        // Send email using EmailJS
        emailjs.send("service_yulvvxm", "template_5r2n46l", {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: "Omm Prakasha Maharana"
        })
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);

                // Success feedback
                submitBtn.textContent = '✅ Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00CED1, #48D1CC)';

                // Play success sound
                try {
                    const ctx = initAudio();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.value = 523.25; // C5
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.3, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.3);
                } catch (e) { }

                // Reset form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);

            }, function (error) {
                console.log('FAILED...', error);

                // Error feedback
                submitBtn.textContent = '❌ Failed to send';
                submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a5a)';

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
    });
}

console.log('EmailJS contact form ready! 📧✨');
