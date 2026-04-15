const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const bars = document.querySelectorAll(".skill-bar");
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector(".contact-form");
const statusMessage = document.getElementById("form-status");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-arrow.prev");
const lightboxNext = document.querySelector(".lightbox-arrow.next");
const galleryTriggers = document.querySelectorAll("[data-open-gallery]");

const lightboxState = {
    galleryId: null,
    currentIndex: 0
};

const galleries = {
    "painel-admin": [
        {
            src: "images/painel admin.png",
            alt: "MotoTracker Painel Admin"
        }
    ],
    "sistema-relatorios": [
        {
            src: "images/lj relatorios.png",
            alt: "Sistema de Relatorios - visao geral"
        },
        {
            src: "images/tela enfermagem.png",
            alt: "Sistema de Relatorios - tela de enfermagem"
        },
        {
            src: "images/meus relatorios.png",
            alt: "Sistema de Relatorios - meus relatorios"
        }
    ],
    "monitor-api": [
        {
            src: "images/monitor api.png",
            alt: "Monitor de APIs e Status"
        }
    ]
};

function setNavState(isOpen) {
    if (!navToggle || !navPanel) {
        return;
    }

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navPanel.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
}

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        setNavState(!isOpen);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.2 });

revealItems.forEach((item) => revealObserver.observe(item));

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add("animate");
        skillObserver.unobserve(entry.target);
    });
}, { threshold: 0.35 });

bars.forEach((bar) => skillObserver.observe(bar));

function openLightbox(galleryId, index = 0) {
    const gallery = galleries[galleryId];

    if (!gallery || !gallery.length) {
        return;
    }

    lightboxState.galleryId = galleryId;
    lightboxState.currentIndex = index;

    updateLightbox();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function updateLightbox() {
    const gallery = galleries[lightboxState.galleryId];

    if (!gallery || !gallery.length) {
        return;
    }

    const current = gallery[lightboxState.currentIndex];
    const hasMultipleImages = gallery.length > 1;

    lightboxImage.src = current.src;
    lightboxImage.alt = current.alt;
    lightboxCounter.textContent = `${lightboxState.currentIndex + 1} / ${gallery.length}`;
    lightboxCounter.style.display = hasMultipleImages ? "block" : "none";
    lightboxPrev.style.display = hasMultipleImages ? "inline-flex" : "none";
    lightboxNext.style.display = hasMultipleImages ? "inline-flex" : "none";
}

function navigateLightbox(direction) {
    const gallery = galleries[lightboxState.galleryId];

    if (!gallery || gallery.length <= 1) {
        return;
    }

    const nextIndex = lightboxState.currentIndex + direction;

    if (nextIndex < 0) {
        lightboxState.currentIndex = gallery.length - 1;
    } else if (nextIndex >= gallery.length) {
        lightboxState.currentIndex = 0;
    } else {
        lightboxState.currentIndex = nextIndex;
    }

    updateLightbox();
}

galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        openLightbox(trigger.dataset.openGallery, Number(trigger.dataset.index || 0));
    });
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
lightboxNext.addEventListener("click", () => navigateLightbox(1));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (lightbox.classList.contains("active")) {
            closeLightbox();
            return;
        }

        if (navPanel && navPanel.classList.contains("is-open")) {
            setNavState(false);
        }
    }

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "ArrowLeft") {
        navigateLightbox(-1);
    }

    if (event.key === "ArrowRight") {
        navigateLightbox(1);
    }
});

async function handleSubmit(event) {
    event.preventDefault();

    const submitButton = form.querySelector(".form-submit");
    const formData = new FormData(form);

    submitButton.disabled = true;
    submitButton.textContent = "enviando...";
    statusMessage.textContent = "";
    statusMessage.className = "form-status";

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("request_failed");
        }

        form.reset();
        statusMessage.textContent = "Mensagem enviada. Retorno em ate 24h.";
        statusMessage.classList.add("success");
    } catch (error) {
        statusMessage.textContent = "Nao consegui enviar agora. Tente novamente ou use o email direto.";
        statusMessage.classList.add("error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "enviar mensagem";
    }
}

if (form) {
    form.addEventListener("submit", handleSubmit);
}
