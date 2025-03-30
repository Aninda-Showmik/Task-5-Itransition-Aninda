document.addEventListener("DOMContentLoaded", function() {
    let page = 1;
    let loading = false;
    let view = 'table';
    let timeoutId;
    let retryCount = 0;
    const maxRetries = 3;

    // Function to fetch books from the API
    async function fetchBooks(reset = false) {
        if (loading) return;
        loading = true;

        const seedInput = document.getElementById("seed").value;
        const seed = (seedInput && !isNaN(seedInput) && seedInput.trim() !== "") ? parseInt(seedInput, 10) : Math.floor(Math.random() * 10000);
        const region = document.getElementById("region").value;
        const likes = parseFloat(document.getElementById("likes-slider").value);
        const reviews = parseFloat(document.getElementById("reviews-input").value);

        if (reset) {
            document.getElementById("bookTableBody").innerHTML = "";
            document.getElementById("galleryView").innerHTML = "";
            page = 1;
            retryCount = 0;
        }

        document.getElementById("loadingIndicator").style.display = "block";
        document.getElementById("errorMessage").style.display = "none";

        try {
            const response = await fetch(`https://task-5-itransition-aninda.onrender.com/api/books?seed=${seed}&numBooks=10&page=${page}&region=${region}&likes=${likes}&reviews=${reviews}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const books = data.books;

            if (reset) {
                document.getElementById("bookTableBody").innerHTML = "";
                document.getElementById("galleryView").innerHTML = "";
            }

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

            page++;
            retryCount = 0;
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

    // Additional functions and event listeners go here...

    // Initial call to load books
    fetchBooks(true);
});
