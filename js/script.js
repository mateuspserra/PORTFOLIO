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

// Manipulador do formulário de contato
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    btn.textContent = 'mensagem enviada ✓';
    btn.style.background = '#1D9E75';
    
    setTimeout(() => {
        btn.textContent = 'enviar mensagem';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
}
