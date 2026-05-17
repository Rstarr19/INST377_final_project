document.addEventListener("DOMContentLoaded", () => {

    AOS.init();

    loadFavorites();
    loadLiveChart();
});



// Global favorite drivers

let FAVORITES_CACHE = [];

async function refreshFavoritesCache() {
    const res = await fetch("/api/favorites");
    const data = await res.json();

    FAVORITES_CACHE = data.map(f =>
        (f.driver_name || "").toLowerCase().trim()
    );

    return FAVORITES_CACHE;
}

// Make sure driver names capitalize correctly
function formatDriverName(name) {
    if (!name) return "";

    return name
        .toLowerCase()
        .split(" ")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

// Chart with driver standings and updated with highlighted favorited driver 

async function loadLiveChart() {

    // ⭐ SHOW LOADER (ADDED)
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";

    const standingsRes = await fetch("/api/f1-standings");
    const standingsRaw = await standingsRes.json();

    const data = Array.isArray(standingsRaw)
        ? standingsRaw
        : standingsRaw.data || standingsRaw.results || [];

    await refreshFavoritesCache();

    const labels = [];
    const points = [];
    const colors = [];

    data.forEach(driver => {

        const name =
            driver.driver_name ||
            driver.full_name ||
            driver.name;

        const normalized = (name || "").toLowerCase().trim();

        labels.push(`P${driver.position} ${name}`);
        points.push(Number(driver.points || 0));

        colors.push(
            FAVORITES_CACHE.includes(normalized)
                ? "#ffcc00"
                : "#e10600"
        );
    });

    const ctx = document.getElementById("pointsChart");

    if (!ctx) {
        // ⭐ HIDE LOADER (ADDED)
        if (loader) loader.style.display = "none";
        return;
    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Live F1 Driver Standings",
                data: points,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,

            onClick: (event, elements) => {
                if (!elements.length) return;

                const driver = data[elements[0].index];

                const driverName =
                    driver.driver_name ||
                    driver.full_name ||
                    driver.name;

                window.location.href =
                    `driver.html?name=${encodeURIComponent(driverName)}`;
            }
        }
    });

    // ⭐ HIDE LOADER (ADDED)
    if (loader) loader.style.display = "none";
}



// Add favorite and update as needed

async function addFavorite(driverName) {

    await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_name: driverName })
    });

    await refreshFavoritesCache();

    loadFavorites();
    loadLiveChart();
}



// Remove favorite driver and update as needed 

async function removeFavorite(driverName) {

    await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_name: driverName })
    });

    await refreshFavoritesCache();

    loadFavorites();
    loadLiveChart();
}



// Favorites list (appears on dashboard at bottom)

function loadFavorites() {

    fetch("/api/favorites")
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById("favorites-list");

            if (!container) return;

            container.innerHTML = "";

            data.forEach(fav => {

                const card = document.createElement("div");
                card.className = "card";

                const name = fav.driver_name;

                const isFav = FAVORITES_CACHE.includes(
                    (name || "").toLowerCase().trim()
                );

                card.innerHTML = `
                    <p>${formatDriverName(fav.driver_name)}</p>
                    <button onclick="removeFavorite('${name}')">
                        Remove Favorite
                    </button>
                `;

                container.appendChild(card);
            });
        })
        .catch(err => console.error("FAVORITES ERROR:", err));
}
