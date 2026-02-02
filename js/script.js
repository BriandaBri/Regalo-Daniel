// Configuración
const BIRTHDAY_DATE = new Date('2026-03-07T00:00:00').getTime();
let selectedAmount = 0;

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initAmountButtons();
    initContributeButton();
    initUploadModal();
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
        document.getElementById('countdown').innerHTML = '<h2 style="color: white;">¡Es el día del cumpleaños! 🎉</h2>';
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

// ============ BOTÓN DE CONTRIBUCIÓN ============
function initContributeButton() {
    const contributeBtn = document.getElementById('contributeBtn');
    
    contributeBtn.addEventListener('click', function() {
        const name = document.getElementById('participantName').value.trim();
        const email = document.getElementById('participantEmail').value.trim();
        const message = document.getElementById('participantMessage').value.trim();

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

        // Aquí iría la lógica de pago (Stripe/PayPal)
        alert(`¡Gracias ${name}!\n\nEn el siguiente paso configuraremos el pago de ${selectedAmount}€.\n\nPor ahora esta es una vista previa del diseño.`);
        
        // TODO: Integrar con Stripe/PayPal
        // TODO: Guardar datos en Firebase
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============ MODAL DE SUBIDA DE FOTOS ============
function initUploadModal() {
    const modal = document.getElementById('uploadModal');
    const uploadBtn = document.getElementById('uploadPhotoBtn');
    const closeBtn = document.querySelector('.close');
    const photoFile = document.getElementById('photoFile');
    const uploadPreview = document.getElementById('uploadPreview');
    const submitBtn = document.getElementById('submitPhotoBtn');

    // Abrir modal
    uploadBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Cerrar modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        resetUploadForm();
    });

    // Cerrar al hacer click fuera del modal
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            resetUploadForm();
        }
    });

    // Preview de la foto
    photoFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                uploadPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Subir foto
    submitBtn.addEventListener('click', function() {
        const name = document.getElementById('uploaderName').value.trim();
        const file = photoFile.files[0];

        if (!name) {
            alert('Por favor, introduce tu nombre');
            return;
        }

        if (!file) {
            alert('Por favor, selecciona una foto');
            return;
        }

        // Aquí iría la lógica de subida a Firebase
        alert(`¡Gracias ${name}!\n\nTu foto se subirá cuando configuremos Firebase.\n\nPor ahora esta es una vista previa del diseño.`);
        
        modal.style.display = 'none';
        resetUploadForm();

        // TODO: Subir foto a Firebase Storage
        // TODO: Guardar metadata en Firestore
        // TODO: Actualizar galería
    });
}

function resetUploadForm() {
    document.getElementById('uploaderName').value = '';
    document.getElementById('photoFile').value = '';
    document.getElementById('uploadPreview').innerHTML = '';
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
    rootMargin: '0px 0px -50px 0px'
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
    if (section.id !== 'hero') {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    }
});
