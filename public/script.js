document.addEventListener("DOMContentLoaded", function() {
    let page = 1;
    let loading = false;
    let view = 'table'; // Default view is table
    let timeoutId;
    let retryCount = 0;
    const maxRetries = 3; // Maximum retries before showing a persistent error

    // Function to determine the base URL based on the environment
    function getBaseUrl() {
        if (window.location.hostname === 'localhost') {
            // Local development
            return 'http://localhost:3000/api/books';
        } else {
            // Production (Vercel)
            return `https://${window.location.hostname}/api/books`;
        }
    }

    // Function to fetch books from the API
    async function fetchBooks(reset = false) {
        if (loading) return;
        loading = true;

        // Get the seed value (either manually entered or random)
        const seedInput = document.getElementById("seed").value;
        const seed = (seedInput && !isNaN(seedInput) && seedInput.trim() !== "") ? parseInt(seedInput, 10) : Math.floor(Math.random() * 10000);

        // Other filter values
        const region = document.getElementById("region").value;
        const likes = 5; // Default value for likes
        const reviews = 5; // Default value for reviews

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
            const response = await fetch(`${getBaseUrl()}?seed=${seed}&numBooks=10&page=${page}&region=${region}&likes=${likes}&reviews=${reviews}`);
            
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
           
::contentReference[oaicite:0]{index=0}
 
