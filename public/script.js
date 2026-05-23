// --- Логика слайдера ---
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Автоперелистывание каждые 5 секунд (можно убрать, если не нужно)
setInterval(nextSlide, 5000);

// --- Плавная прокрутка к форме ---
document.querySelectorAll('a[href="#form"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#form').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Отправка формы ---
document.getElementById('requestForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value
    };

    try {
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        const msgDiv = document.getElementById('formMessage');
        msgDiv.classList.remove('hidden');
        if (response.ok) {
            msgDiv.textContent = 'Спасибо! Мы свяжемся с вами, чтобы назначить встречу со стилистом.';
            msgDiv.style.color = 'green';
            this.reset();
        } else {
            msgDiv.textContent = result.error || 'Ошибка при отправке. Попробуйте позже.';
            msgDiv.style.color = 'red';
        }
    } catch (err) {
        const msgDiv = document.getElementById('formMessage');
        msgDiv.classList.remove('hidden');
        msgDiv.textContent = 'Ошибка сети. Проверьте подключение.';
        msgDiv.style.color = 'red';
    }
});