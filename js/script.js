// Configuración
const BIRTHDAY_DATE = new Date('2026-03-07T00:00:00').getTime();
let selectedAmount = 0;

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initPayPal();
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

// ============ BIZUM CON FIREBASE ============
function initPayPal() {
    const bizumBtn = document.getElementById('bizumBtn');
    const donorName = document.getElementById('donorName');
    const donorAmount = document.getElementById('donorAmount');
    const donorMessage = document.getElementById('donorMessage');
    const bizumModal = document.getElementById('bizumModal');
    const closeBizumModal = document.getElementById('closeBizumModal');
    const copyBizumBtn = document.getElementById('copyBizumBtn');
    
    bizumBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const name = donorName.value.trim();
        const amount = parseInt(donorAmount.value);
        const message = donorMessage.value.trim();
        
        if (!name) {
            alert('Por favor, introduce tu nombre');
            return;
        }
        
        if (!amount || amount <= 0) {
            alert('Por favor, introduce una cantidad válida');
            return;
        }
        
        // Guardar en Firebase
        try {
            const db = window.firebaseDb;
            const addDoc = window.firebaseAddDoc;
            const collection = window.firebaseCollection;
            const serverTimestamp = window.firebaseTimestamp;
            
            await addDoc(collection(db, 'aportaciones'), {
                nombre: name,
                cantidad: amount,
                mensaje: message || '',
                fecha: serverTimestamp()
            });
            
            console.log('Aportación guardada en Firebase');
            
            // Mostrar modal con número de Bizum
            bizumModal.style.display = 'block';
            
            // Limpiar formulario
            donorName.value = '';
            donorAmount.value = '';
            donorMessage.value = '';
            
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Hubo un error al guardar. Por favor, inténtalo de nuevo.');
        }
    });
    
    // Cerrar modal
    closeBizumModal.addEventListener('click', function() {
        bizumModal.style.display = 'none';
    });
    
    // Cerrar al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target == bizumModal) {
            bizumModal.style.display = 'none';
        }
    });
    
    // Copiar número de Bizum
    copyBizumBtn.addEventListener('click', function() {
        const bizumNumber = '601187600';
        navigator.clipboard.writeText(bizumNumber).then(function() {
            copyBizumBtn.textContent = '✓ ¡Copiado!';
            setTimeout(function() {
                copyBizumBtn.textContent = '📋 Copiar número';
            }, 2000);
        }).catch(function(err) {
            alert('No se pudo copiar. Número: 601 187 600');
        });
    });
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
