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

        // Get reviews value, ensuring it's valid (if empty, default to 5 or any other valid value)
        let reviews = parseFloat(document.getElementById("reviews-input").value);
        if (isNaN(reviews) || reviews < 0 || reviews > 5) {
            reviews = 5; // Set a default value if the input is empty or invalid
        }

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
            // Construct the API URL using the VERCEL_URL environment variable
            const apiUrl = `https://${process.env.VERCEL_URL}/api/books`;

            // Make the request to fetch books based on the selected filters
            const response = await fetch(`${apiUrl}?seed=${seed}&numBooks=10&page=${page}&region=${region}&likes=${likes}&reviews=${reviews}`);
            
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
        document.getElementById("book-details").style.display = "none
::contentReference[oaicite:6]{index=6}
 
