async function searchArtworks() {
	// Get the user's search input and trim whitespace.
	const searchValue = document.getElementById("search-input").value.trim();

	// Alert and exit if the search input is empty.
	if (searchValue === "") {
		alert("Please enter a search term.");
		return;
	}

	// Build the iTunes search API URL.
	const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchValue)}&entity=album&limit=50`;

	try {
		// Fetch data from the API and convert it to JSON.
		const response = await fetch(url);
		const data = await response.json();

		// Clear previous search results.
		const resultsContainer = document.getElementById("results-container");
		resultsContainer.innerHTML = "";

		// If no results are found, display a message and exit.
		if (data.resultCount === 0) {
			resultsContainer.innerHTML = `<p>No results found.</p>`;
			return;
		}

		// Sort results by artist name (alphabetically) and release date (oldest to newest).
		const sortedResults = data.results.sort((a, b) => {
			if (a.artistName.toLowerCase() < b.artistName.toLowerCase()) return -1;
			if (a.artistName.toLowerCase() > b.artistName.toLowerCase()) return 1;
			return new Date(a.releaseDate) - new Date(b.releaseDate);
		});

		// Create and display result cards for each album.
		sortedResults.forEach(result => {
			// Generate artwork URLs.
			const baseUrl = result.artworkUrl100.replace(/\/[^\/]*$/, "/");
			const artworkPreviewUrl = baseUrl + "250x250.jpg";
			const artworkHighResUrl = baseUrl + "10000x10000.jpg";

			// Album and artist details.
			const artistName = result.artistName;
			const albumName = result.collectionName;

			// Create a card with album image, title, and artist.
			const resultCard = document.createElement("div");
			resultCard.innerHTML = `
				<a href="${artworkHighResUrl}" target="_blank">
						<img src="${artworkPreviewUrl}" alt="${albumName} artwork">
				</a>
				<h2>${artistName}</h2>
				<h3>${albumName}</h3>
			`;

			// Append the result card to the container.
			resultsContainer.appendChild(resultCard);
		});
	} catch (error) {
		// Log any errors that occur during the fetch or rendering process.
		console.error(error);
	}
}
