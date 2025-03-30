document.addEventListener("DOMContentLoaded", function() {
    let page = 1;
    let loading = false;
    let view = 'table'; // Default view is table
    let timeoutId;
    let retryCount = 0;
    const maxRetries = 3; // Maximum retries before showing a persistent error

    // Function to fetch books from the API
    async function fetchBooks(reset = false) {
        if (loading) return;
        loading = true;

        // Get the seed value (either manually entered or random)
        const seedInput = document.getElementById("seed").value;
        console.log(seedInput);

        const seed = (seedInput && !isNaN(seedInput) && seedInput.trim() !== "") ? parseInt(seedInput, 10) : Math.floor(Math.random() * 10000);
        console.log(seed); // Log seed input to check its value
        // Other filter values
        const region = document.getElementById("region").value;
        const likes = parseFloat(document.getElementById("likes-slider").value);
        const reviews = parseFloat(document.getElementById("reviews-input").value);

        // Reset page and views if needed
        if (reset) {
            document.getElementById("bookTableBody").innerHTML = "";
            document.getElementById("galleryView").innerHTML = "";
            page = 1;
            retryCount = 0; // Reset retry count
        }

        // Show loading indicator
        document.getElementById("loadingIndicator").style.display = "block";
        document.getElementById("errorMessage").style.display = "none";

        try {
            // Make the request to fetch books based on the selected filters
            const response = await fetch(`https://task-5-itransition-aninda.onrender.com/api/books?seed=${seed}&numBooks=10&page=${page}&region=${region}&likes=${likes}&reviews=${reviews}`);
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const books = data.books;

            // Clear previous data if reset is requested
            if (reset) {
                document.getElementById("bookTableBody").innerHTML = "";
                document.getElementById("galleryView").innerHTML = "";
            }

            // Render books based on the selected view (table or gallery)
            if (view === 'table') {
                document.getElementById("galleryView").style.display = 'none';
                document.getElementById("bookTable").style.display = 'table';
                books.forEach((book) => {
                    const row = document.createElement("tr");
                    row.innerHTML = ` 
                        <td>${book.index}</td>
                        <td>${book.isbn}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.publisher}</td>
                        <td>${book.likes}</td>
                        <td>${book.reviews}</td>
                    `;
                    row.addEventListener('click', () => showBookDetails(book));
                    document.getElementById("bookTableBody").appendChild(row);
                });
            } else {
                document.getElementById("bookTable").style.display = 'none';
                document.getElementById("galleryView").style.display = 'grid';
                books.forEach((book) => {
                    const div = document.createElement("div");
                    div.classList.add("book-card");
                    div.innerHTML = `
                        <h3>${book.title}</h3>
                        <p>Author: ${book.author}</p>
                        <p>Likes: ${book.likes}</p>
                        <p>Reviews: ${book.reviews}</p>
                    `;
                    div.addEventListener('click', () => showBookDetails(book));
                    document.getElementById("galleryView").appendChild(div);
                });
            }

            page++; // Increment page for infinite scrolling
            retryCount = 0; // Reset retry count after a successful request
        } catch (error) {
            retryCount++;
            document.getElementById("errorMessage").innerText = `Error: ${error.message}`;
            document.getElementById("errorMessage").style.display = "block";

            if (retryCount < maxRetries) {
                document.getElementById("errorMessage").innerHTML += '<button onclick="fetchBooks(true)">Retry</button>';
            } else {
                document.getElementById("errorMessage").innerHTML += '<p>Please check your internet connection or try again later.</p>';
            }

            setTimeout(() => {
                document.getElementById("errorMessage").style.display = "none";
            }, 5000);
        } finally {
            loading = false;
            document.getElementById("loadingIndicator").style.display = "none";
        }
    }

    // Function to switch between table and gallery view
    function setView(newView) {
        view = newView;
        fetchBooks(true); // Fetch books again when view is changed
    }

    // Function to show book details
    function showBookDetails(book) {
        const bookDetailContent = document.getElementById("book-detail-content");
        bookDetailContent.innerHTML = `
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Title:</strong> ${book.title}</p>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Publisher:</strong> ${book.publisher}</p>
            <p><strong>Likes:</strong> ${book.likes}</p>
            <p><strong>Reviews:</strong> ${book.reviews}</p>
        `;
        document.getElementById("book-details").style.display = "block";
    }

    // Event listener for closing the book details modal
    document.querySelector("#book-details button").addEventListener("click", function() {
        document.getElementById("book-details").style.display = "none";
    });

    // Event listener for random seed button
    document.getElementById("randomSeedButton").addEventListener("click", () => {
        const randomSeed = Math.floor(Math.random() * 10000);
        document.getElementById("seed").value = randomSeed; // Update the seed input field
        fetchBooks(true); // Fetch books with the new random seed
    });

    // Event listeners for changing filters and inputs
    document.getElementById("likes-slider").addEventListener("input", () => {
        document.getElementById("likes-value").innerText = document.getElementById("likes-slider").value;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fetchBooks(true), 300); // Apply changes after a short delay
    });

    document.getElementById("reviews-input").addEventListener("input", () => {
        document.getElementById("reviews-value").innerText = document.getElementById("reviews-input").value;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fetchBooks(true), 300); // Apply changes after a short delay
    });

    document.getElementById("region").addEventListener("change", () => fetchBooks(true));

    document.getElementById("tableViewButton").addEventListener("click", () => setView('table'));
    document.getElementById("galleryViewButton").addEventListener("click", () => setView('gallery'));

    // Infinite scrolling functionality
    document.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            fetchBooks(); // Fetch more books as user scrolls to the bottom
        }
    });

    // Event listener for seed input field
    document.getElementById("seed").addEventListener("input", function() {
        const seedInput = document.getElementById("seed").value;
        console.log("Seed input changed to:", seedInput);
        fetchBooks(true); // Fetch books with the updated seed value
    });

    // Initial call to load books when the page is loaded
    fetchBooks(true);
});
