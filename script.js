const API_KEY = '6c4a07ff'; // ✅ Just the key as string

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('movieSearch');
    const searchBtn = document.getElementById('searchBtn');
    const movieDetailsSection = document.getElementById('movieDetails');
    const reviewsSection = document.getElementById('reviewsSection');

    // Elements for movie info
    const posterEl = document.getElementById('poster');
    const titleEl = document.getElementById('title');
    const yearEl = document.getElementById('year');
    const genreEl = document.getElementById('genre');
    const directorEl = document.getElementById('director');
    const plotEl = document.getElementById('plot');
    const imdbRatingEl = document.getElementById('imdbRating');

    // Review form elements
    const userRatingEl = document.getElementById('userRating');
    const userReviewEl = document.getElementById('userReview');
    const submitReviewBtn = document.getElementById('submitReview');
    const reviewsContainer = document.getElementById('reviewsContainer');

    let currentMovieId = '';

    // Event Listeners
    searchBtn.addEventListener('click', searchMovie);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovie();
    });

    submitReviewBtn.addEventListener('click', submitReview);

    // Search Movie Function
    async function searchMovie() {
        const query = searchInput.value.trim();
        if (!query) {
            alert('Please enter a movie title.');
            return;
        }

        try {
            const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${API_KEY}`);
            const data = await response.json();

            if (data.Response === 'True') {
                displayMovie(data);
                loadReviews(data.imdbID);
                currentMovieId = data.imdbID;
            } else {
                alert(data.Error || 'Movie not found. Please try another title.');
                movieDetailsSection.classList.add('hidden');
                reviewsSection.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error fetching movie:', error);
            alert('Something went wrong. Check console for details.');
        }
    }

    // Display Movie Info
    function displayMovie(movie) {
        posterEl.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x370?text=No+Poster';
        titleEl.textContent = movie.Title;
        yearEl.textContent = movie.Year;
        genreEl.textContent = movie.Genre;
        directorEl.textContent = movie.Director;
        plotEl.textContent = movie.Plot;
        imdbRatingEl.textContent = movie.imdbRating || 'N/A';

        movieDetailsSection.classList.remove('hidden');
        reviewsSection.classList.remove('hidden');
    }

    // Submit Review
    function submitReview() {
        const rating = userRatingEl.value;
        const reviewText = userReviewEl.value.trim();

        if (!rating || !reviewText) {
            alert('Please select a rating and write a review.');
            return;
        }

        const review = {
            rating: parseInt(rating),
            text: reviewText,
            date: new Date().toLocaleString()
        };

        saveReview(currentMovieId, review);
        displayReview(review);
        
        // Reset form
        userRatingEl.value = '';
        userReviewEl.value = '';
    }

    // Save Review to localStorage
    function saveReview(movieId, review) {
        let reviews = JSON.parse(localStorage.getItem(movieId)) || [];
        reviews.push(review);
        localStorage.setItem(movieId, JSON.stringify(reviews));
    }

    // Load and Display Existing Reviews
    function loadReviews(movieId) {
        reviewsContainer.innerHTML = '';
        const reviews = JSON.parse(localStorage.getItem(movieId)) || [];

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
            return;
        }

        reviews.forEach(review => {
            displayReview(review);
        });
    }

    // Display Single Review
    function displayReview(review) {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';

        const stars = '⭐'.repeat(review.rating);
        reviewCard.innerHTML = `
            <div class="review-rating">${stars} (${review.rating}/5)</div>
            <div class="review-text">"${review.text}"</div>
            <small>Reviewed on ${review.date}</small>
        `;

        reviewsContainer.prepend(reviewCard); // Newest on top
    }
});