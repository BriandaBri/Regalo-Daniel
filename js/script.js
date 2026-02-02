// Configuración
const BIRTHDAY_DATE = new Date('2026-03-07T00:00:00').getTime();
const GOAL_AMOUNT = 150; // Objetivo en euros
let currentAmount = 0;
let selectedAmount = 0;

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initAmountButtons();
    initPhotoUpload();
    initContributeButton();
    updateProgress();
    loadPhotos();
    updateParticipantsCount();
});

// ============ CONTADOR REGRESIVO ============
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = BIRTHDAY_DATE - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<h2>¡Es el día del cumpleaños! 🎉</h2>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ============ BOTONES DE CANTIDAD ============
function initAmountButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');

    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover selección de otros botones
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedAmount = parseInt(this.dataset.amount);
            customAmount.value = '';
        });
    });

    customAmount.addEventListener('input', function() {
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        selectedAmount = parseInt(this.value) || 0;
    });
}

// ============ SUBIDA DE FOTOS ============
function initPhotoUpload() {
    const photoUpload = document.getElementById('photoUpload');
    const photoPreview = document.getElementById('photoPreview');

    photoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                photoPreview.innerHTML = `
                    <img src="${event.target.result}" alt="Preview">
                    <p style="margin-top: 10px; color: #10b981;">✓ Foto seleccionada</p>
                `;
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// ============ BOTÓN DE CONTRIBUCIÓN ============
function initContributeButton() {
    const contributeBtn = document.getElementById('contributeBtn');
    
    contributeBtn.addEventListener('click', function() {
        const name = document.getElementById('participantName').value.trim();
        const email = document.getElementById('participantEmail').value.trim();
        const message = document.getElementById('participantMessage').value.trim();
        const photoFile = document.getElementById('photoUpload').files[0];

        // Validaciones
        if (!name) {
            alert('Por favor, introduce tu nombre');
            return;
        }

        if (!email || !isValidEmail(email)) {
            alert('Por favor, introduce un email válido');
            return;
        }

        if (selectedAmount <= 0) {
            alert('Por favor, selecciona una cantidad a aportar');
            return;
        }

        // Aquí iría la lógica de pago
        // Por ahora mostramos un mensaje
        alert(`¡Gracias ${name}!\n\nEn el siguiente paso configuraremos el pago de ${selectedAmount}€.\n\nPor ahora esta es una vista previa del diseño.`);
        
        // TODO: Integrar con Stripe/PayPal
        // TODO: Guardar datos en Firebase
        // TODO: Subir foto a Firebase Storage
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============ BARRA DE PROGRESO ============
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const currentAmountEl = document.getElementById('currentAmount');
    
    const percentage = Math.min((currentAmount / GOAL_AMOUNT) * 100, 100);
    progressBar.style.width = percentage + '%';
    currentAmountEl.textContent = currentAmount;
}

// ============ GALERÍA DE FOTOS ============
function loadPhotos() {
    // Aquí cargaremos las fotos desde Firebase
    // Por ahora dejamos el mensaje de "no hay fotos"
    
    // TODO: Conectar con Firebase Storage
    // TODO: Mostrar fotos dinámicamente
}

// ============ CONTADOR DE PARTICIPANTES ============
function updateParticipantsCount() {
    // Aquí contaremos participantes desde Firebase
    const participantsCountEl = document.getElementById('participantsCount');
    
    // TODO: Obtener número real de Firebase
    participantsCountEl.textContent = '0';
}

// ============ SMOOTH SCROLL ============
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

// ============ ANIMACIONES AL HACER SCROLL ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar secciones para animaciones
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
