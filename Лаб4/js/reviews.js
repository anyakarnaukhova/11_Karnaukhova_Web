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

    function createReviewCard(name, text, image, stars = 5) {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            starsHTML += i < stars ? '★' : '☆';
        }
        
        card.innerHTML = `
            <div class="review-avatar">
                <img src="${image}" alt="${name}" class="avatar-img">
            </div>
            <div class="review-content">
                <div class="review-header">
                    <span class="review-author">${name}</span>
                </div>
                <div class="review-stars">${starsHTML}</div>
                <p class="review-text">"${text}"</p>
            </div>
        `;
        
        return card;
    }

    function loadReviews() {
        reviewsGrid.innerHTML = '';

        let savedReviews = getCookie('reviews');
        
        if (savedReviews && savedReviews.length > 0) {
            savedReviews.forEach(review => {
                reviewsGrid.appendChild(createReviewCard(review.name, review.text, review.image, review.stars));
            });
        } else {
            defaultReviews.forEach(review => {
                reviewsGrid.appendChild(createReviewCard(review.name, review.text, review.image, review.stars));
            });
            setCookie('reviews', defaultReviews, 30);
        }
    }

    function saveReviews() {
        const reviewCards = document.querySelectorAll('.review-card');
        const reviews = [];
        
        reviewCards.forEach(card => {
            const name = card.querySelector('.review-author').textContent;
            const text = card.querySelector('.review-text').textContent.replace(/"/g, '');
            const image = card.querySelector('.avatar-img').src.split('/').pop();
            const stars = card.querySelector('.review-stars').textContent.split('★').length - 1;
            
            reviews.push({
                name: name,
                text: text,
                image: 'img/' + image,
                stars: stars
            });
        });
        
        setCookie('reviews', reviews, 30);
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

        reviewsGrid.appendChild(createReviewCard(name, text, 'img/хомяк.jpg'));
        
        saveReviews();
        
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