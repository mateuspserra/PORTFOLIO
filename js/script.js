// Animação das barras de habilidades
const bars = document.querySelectorAll('.skill-bar');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('animate'), 200);
        }
    });
}, { threshold: 0.3 });

bars.forEach(b => observer.observe(b));

// Manipulador do formulário de contato com Formspree
function handleSubmit(e) {
    const btn = e.target.querySelector('.form-submit');
    const form = e.target;
    
    // Desabilita o botão durante o envio
    btn.disabled = true;
    btn.textContent = 'enviando...';
    
    // Deixa o Formspree processar o envio
    // Após o envio, mostra feedback visual
    setTimeout(() => {
        btn.textContent = 'mensagem enviada ✓';
        btn.style.background = '#1D9E75';
        
        setTimeout(() => {
            btn.textContent = 'enviar mensagem';
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    }, 1000);
}

// Slider de imagens dos projetos
const sliderStates = {};

function initSlider(projectId) {
    if (!sliderStates[projectId]) {
        sliderStates[projectId] = { currentIndex: 0 };
    }
}

function moveSlider(projectId, direction) {
    initSlider(projectId);
    const slider = document.getElementById(`slider-${projectId}`);
    const dots = document.getElementById(`dots-${projectId}`).children;
    const totalSlides = slider.children.length;
    
    sliderStates[projectId].currentIndex += direction;
    
    if (sliderStates[projectId].currentIndex < 0) {
        sliderStates[projectId].currentIndex = totalSlides - 1;
    } else if (sliderStates[projectId].currentIndex >= totalSlides) {
        sliderStates[projectId].currentIndex = 0;
    }
    
    updateSlider(projectId, slider, dots);
}

function goToSlide(projectId, index) {
    initSlider(projectId);
    const slider = document.getElementById(`slider-${projectId}`);
    const dots = document.getElementById(`dots-${projectId}`).children;
    
    sliderStates[projectId].currentIndex = index;
    updateSlider(projectId, slider, dots);
}

function updateSlider(projectId, slider, dots) {
    const currentIndex = sliderStates[projectId].currentIndex;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    Array.from(dots).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// Auto-play dos sliders (opcional)
function autoPlaySliders() {
    Object.keys(sliderStates).forEach(projectId => {
        moveSlider(projectId, 1);
    });
}

// Inicializar sliders
document.addEventListener('DOMContentLoaded', () => {
    initSlider('mototracker');
    // Descomentar para auto-play a cada 5 segundos
    // setInterval(autoPlaySliders, 5000);
});

// Lightbox para visualizar imagens em tamanho maior
let lightboxState = {
    projectId: null,
    currentIndex: 0,
    images: []
};

function openLightbox(projectId, index) {
    // Para imagens únicas (não slider)
    const singleImage = document.querySelector(`img[onclick*="${projectId}"]`);
    
    if (singleImage) {
        lightboxState.projectId = projectId;
        lightboxState.currentIndex = 0;
        lightboxState.images = [{
            src: singleImage.src,
            alt: singleImage.alt
        }];
    } else {
        // Para sliders
        const slider = document.getElementById(`slider-${projectId}`);
        if (!slider) return;
        
        const images = Array.from(slider.children);
        lightboxState.projectId = projectId;
        lightboxState.currentIndex = index;
        lightboxState.images = images.map(img => ({
            src: img.src,
            alt: img.alt
        }));
    }
    
    updateLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event.target.id === 'lightbox' || event.target.classList.contains('lightbox-close')) {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    }
}

function lightboxNavigate(direction) {
    // Só navega se tiver mais de uma imagem
    if (lightboxState.images.length <= 1) return;
    
    lightboxState.currentIndex += direction;
    
    if (lightboxState.currentIndex < 0) {
        lightboxState.currentIndex = lightboxState.images.length - 1;
    } else if (lightboxState.currentIndex >= lightboxState.images.length) {
        lightboxState.currentIndex = 0;
    }
    
    updateLightbox();
}

function updateLightbox() {
    const img = document.getElementById('lightbox-image');
    const counter = document.getElementById('lightbox-counter');
    const arrows = document.querySelectorAll('.lightbox-arrow');
    const current = lightboxState.images[lightboxState.currentIndex];
    
    img.src = current.src;
    img.alt = current.alt;
    
    // Mostrar/ocultar contador e setas se tiver apenas 1 imagem
    if (lightboxState.images.length > 1) {
        counter.textContent = `${lightboxState.currentIndex + 1} / ${lightboxState.images.length}`;
        counter.style.display = 'block';
        arrows.forEach(arrow => arrow.style.display = 'flex');
    } else {
        counter.style.display = 'none';
        arrows.forEach(arrow => arrow.style.display = 'none');
    }
}

// Fechar lightbox com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft') {
        if (document.getElementById('lightbox').classList.contains('active')) {
            lightboxNavigate(-1);
        }
    } else if (e.key === 'ArrowRight') {
        if (document.getElementById('lightbox').classList.contains('active')) {
            lightboxNavigate(1);
        }
    }
});
