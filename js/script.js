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

// Site estático: sem backend de envio, o formulário abre um e-mail pré-preenchido.
function handleContactSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const btn = e.target.querySelector('.form-submit');

    const subject = encodeURIComponent(`Contato pelo portfolio - ${name || 'novo projeto'}`);
    const body = encodeURIComponent(
        `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`
    );

    btn.textContent = 'abrindo e-mail...';
    btn.style.background = '#1D9E75';

    window.location.href = `mailto:serramateus1@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
        btn.textContent = 'enviar mensagem';
        btn.style.background = '';
    }, 2000);
}
