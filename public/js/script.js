const SLIDESHOW_CONFIG = {
    bannerFolder: './img/banner/',
    interval: 10000,
    transitionDuration: 1000
};

let currentSlideIndex = 0;
let bannerImages = [];
let slideInterval;

async function initBannerSlideshow() {
    try {
        const possibleImages = [];
        for (let i = 1; i <= 57; i++) {
            possibleImages.push(`banner${i}.jpg`);
        }
        for (const imageName of possibleImages) {
            const imageUrl = SLIDESHOW_CONFIG.bannerFolder + imageName;
            if (await imageExists(imageUrl)) {
                bannerImages.push(imageUrl);
            }
        }
        if (bannerImages.length === 0) {
            bannerImages.push('../img/frontBand.jpg');
        }
        bannerImages = shuffleArray(bannerImages);
        const hero = document.querySelector('.hero');
        if (hero && bannerImages.length > 0) {
            setupHeroStyles();
            if (bannerImages.length > 1) {
                startSlideshow();
            }
        }
    } catch (error) {
        console.error('Erro ao inicializar slideshow:', error);
    }
}

function imageExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startSlideshow() {
    slideInterval = setInterval(() => {
        nextSlide();
    }, SLIDESHOW_CONFIG.interval);
}

function nextSlide() {
    const styleElement = document.getElementById('hero-dynamic-style');
    if (!styleElement) return;
    currentSlideIndex = (currentSlideIndex + 1) % bannerImages.length;
    const nextImage = bannerImages[currentSlideIndex];
    updateSlideImage(nextImage);
}

function setupHeroStyles() {
    const hero = document.querySelector('.hero');
    if (hero && bannerImages.length > 0) {
        hero.style.backgroundImage = `url(${bannerImages[0]})`;
        const style = document.createElement('style');
        style.id = 'hero-dynamic-style';
        style.textContent = `
            .hero::after {
                background-image: url(${bannerImages[0]});
                opacity: 0;
                transition: opacity ${SLIDESHOW_CONFIG.transitionDuration}ms ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }
}

function updateSlideImage(imageUrl) {
    const styleElement = document.getElementById('hero-dynamic-style');
    const hero = document.querySelector('.hero');
    if (!styleElement || !hero) return;
    styleElement.textContent = `
        .hero::after {
            background-image: url(${imageUrl});
            opacity: 0;
            transition: opacity ${SLIDESHOW_CONFIG.transitionDuration}ms ease-in-out;
        }
    `;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            styleElement.textContent = `
                .hero::after {
                    background-image: url(${imageUrl});
                    opacity: 1;
                    transition: opacity ${SLIDESHOW_CONFIG.transitionDuration}ms ease-in-out;
                }
            `;
        });
    });
    setTimeout(() => {
        hero.style.backgroundImage = `url(${imageUrl})`;
    }, SLIDESHOW_CONFIG.transitionDuration);
}

function initRepertorioSlider() {
    const buttons = document.querySelectorAll('.repertorio-btn');
    const items = document.querySelectorAll('.repertorio-item');
    let autoIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    if (autoIndex < 0) autoIndex = 0;
    const total = items.length;
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const repertorioId = button.getAttribute('data-repertorio');
            setActiveRepertorio(repertorioId);
            autoIndex = Number(repertorioId) - 1;
        });
    });
    function setActiveRepertorio(repertorioId) {
        buttons.forEach(btn => btn.classList.remove('active'));
        items.forEach(item => item.classList.remove('active'));
        const targetButton = document.querySelector(`.repertorio-btn[data-repertorio="${repertorioId}"]`);
        const activeItem = document.querySelector(`.repertorio-item[data-repertorio="${repertorioId}"]`);
        if (targetButton) targetButton.classList.add('active');
        if (activeItem) activeItem.classList.add('active');
    }
    function advanceAuto() {
        autoIndex = (autoIndex + 1) % total;
        const nextId = (autoIndex + 1).toString();
        setActiveRepertorio(nextId);
    }
    setInterval(advanceAuto, 5000);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    initBannerSlideshow();
    initRepertorioSlider();
    const animatedElements = document.querySelectorAll('.integrante-card, .show-item, .social-link');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const openBtn = document.getElementById('openVideoModal');
    const modal = document.getElementById('videoModal');
    const closeBackdrop = document.getElementById('closeVideoModal');
    const closeBtn = document.getElementById('closeVideoBtn');
    const frame = document.getElementById('videoFrame');
    if (openBtn && modal && closeBackdrop && closeBtn && frame) {
        const listId = openBtn.getAttribute('data-playlist');
        openBtn.addEventListener('click', () => {
            const src = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(listId)}&autoplay=1&rel=0`;
            frame.setAttribute('src', src);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        function closeModal() {
            modal.classList.remove('active');
            frame.setAttribute('src', '');
            document.body.style.overflow = '';
        }
        closeBackdrop.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


// Função para copiar link da agenda
function copyAgendaLink() {
    const agendaUrl = `${window.location.origin}${window.location.pathname}#agenda`;
    
    // Tenta usar a API moderna de clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(agendaUrl).then(() => {
            showCopyFeedback(true);
        }).catch(() => {
            fallbackCopyTextToClipboard(agendaUrl);
        });
    } else {
        // Fallback para navegadores mais antigos
        fallbackCopyTextToClipboard(agendaUrl);
    }
}

// Método alternativo para copiar texto
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        showCopyFeedback(successful);
    } catch (err) {
        showCopyFeedback(false);
    }
    
    document.body.removeChild(textArea);
}

// Mostra feedback visual ao copiar
function showCopyFeedback(success) {
    const button = document.querySelector('.copy-agenda-link');
    const originalText = button.innerHTML;
    
    if (success) {
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Link copiado!
        `;
        button.style.background = '#4CAF50';
    } else {
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Erro ao copiar
        `;
        button.style.background = '#f44336';
    }
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
}

function markPastEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const showItems = document.querySelectorAll('.show-item[data-date]');
    
    showItems.forEach(item => {
        const eventDateStr = item.getAttribute('data-date');
        if (eventDateStr) {
            const eventDate = new Date(eventDateStr + 'T23:59:59');
            
            if (eventDate < today) {
                item.classList.add('past-event');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', markPastEvents);
