let data = [];
let currentPage = 1;
const itemsPerPage = 50;

const renderListings = (listings) => {
  const listingsContainer = document.getElementById("listings-container");
  listingsContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = startIndex; i < endIndex && i < listings.length; i++) {
    let listing = listings[i];
    let amenitiesList;
    try {
      amenitiesList = JSON.parse(listing.amenities.replace(/'/g, '"'));
    } catch (error) {
      console.error("Error parsing amenities:", error);
      amenitiesList = [];
    }

    let listingElement = `
            <div class="listing">
                <img src="${listing.picture_url}" alt="${listing.name}">
                <h2>${listing.name}</h2>
                <p>${listing.description}</p>
                <ul class="amenities">
                    ${amenitiesList
                      .map((amenity) => `<li>${amenity}</li>`)
                      .join("")}
                </ul>
                <div class="host-info">
                    <img src="${listing.host_thumbnail_url}" alt="${
                      listing.host_name
                    }">
                    <span>${listing.host_name}</span>
                </div>
                <span class="price">${listing.price}</span>
            </div>
        `;

    listingsContainer.insertAdjacentHTML("beforeend", listingElement);
  }

  renderPaginationControls(listings.length);
};

const renderPaginationControls = (totalItems) => {
  const paginationContainer = document.getElementById("pagination-container");
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  let controls = "";
  for (let i = 1; i <= totalPages; i++) {
    controls += `<button ${
      currentPage === i ? 'class="active"' : ""
    } onclick="changePage(${i})">${i}</button>`;
  }

  paginationContainer.innerHTML = controls;
};

const changePage = (pageNum) => {
  currentPage = pageNum;
  renderListings(data);
};

const handleSearch = () => {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredListings = data.filter((listing) =>
    listing.name.toLowerCase().includes(searchTerm),
  );
  renderListings(filteredListings);
};

document.getElementById("search-btn").addEventListener("click", handleSearch);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/docs/airbnb_sf_listings_500.json");
    if (response.ok) {
      data = await response.json();
      renderListings(data);
    } else {
      console.error("Failed to fetch listings.");
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
});
