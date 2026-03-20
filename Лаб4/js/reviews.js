document.addEventListener('DOMContentLoaded', function() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    const addBtn = document.getElementById('addReviewBtn');
    const nameInput = document.getElementById('reviewName');
    const textInput = document.getElementById('reviewText');
    const errorDiv = document.getElementById('reviewError');

    const defaultReviews = [
        {
            name: 'Степан',
            text: 'Гоняю как сумасшедший! Хозяйка ругается, а мне п*фиг',
            image: 'img/сига.jpg',
            stars: 5
        },
        {
            name: 'Антоха',
            text: 'Просто пушка! Все телки теперь мои',
            image: 'img/шумахер.jpg',
            stars: 5
        },
        {
            name: 'Иннокентий',
            text: 'Мне понравилось, бросил пить, теперь есть чем заниматься',
            image: 'img/ягер.jpg',
            stars: 5
        },
        {
            name: 'Алексей',
            text: 'Скутер отличный, моему хомяку он очень нравился. Минус звезда тк хомяк к сожалению умер.',
            image: 'img/хозяин.jpg',
            stars: 4
        }
    ];

    let reviews = [];

    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            starsHTML += i < review.stars ? '★' : '☆';
        }
        
        card.innerHTML = `
            <div class="review-avatar">
                <img src="${review.image}" alt="${review.name}" class="avatar-img">
            </div>
            <div class="review-content">
                <div class="review-header">
                    <span class="review-author">${review.name}</span>
                </div>
                <div class="review-stars">${starsHTML}</div>
                <p class="review-text">"${review.text}"</p>
            </div>
        `;
        
        return card;
    }

    function renderReviews() {
        reviewsGrid.innerHTML = '';
        reviews.forEach(review => {
            reviewsGrid.appendChild(createReviewCard(review));
        });
    }

    function saveReviewsToCookie() {
        setCookie('reviews', reviews, 30);
    }

    function loadReviews() {
        const savedReviews = getCookie('reviews');
        
        if (savedReviews && savedReviews.length > 0) {
            reviews = savedReviews;
        } else {
            reviews = [...defaultReviews];
            saveReviewsToCookie();
        }
        
        renderReviews();
    }

    function addReview(name, text) {
        const newReview = {
            name: name,
            text: text,
            image: 'img/хомяк.jpg',
            stars: 5
        };
        
        reviews.push(newReview); 
        renderReviews(); 
        saveReviewsToCookie(); 
    }

    loadReviews();

    addBtn.addEventListener('click', function() {
        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        
        errorDiv.textContent = '';

        if (name === '' || text === '') {
            errorDiv.textContent = 'Оба поля должны быть заполнены';
            return;
        }

        if (name.length > 20) {
            errorDiv.textContent = 'Имя не должно быть длиннее 20 символов';
            return;
        }

        if (text.length > 100) {
            errorDiv.textContent = 'Текст отзыва не должен превышать 100 символов';
            return;
        }

        addReview(name, text);
        
        nameInput.value = '';
        textInput.value = '';
        
        errorDiv.textContent = 'Отзыв добавлен!';
        errorDiv.style.color = '#00aa00';
        
        setTimeout(() => {
            errorDiv.textContent = '';
            errorDiv.style.color = '#ff4444';
        }, 2000);
    });
});