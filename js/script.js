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
