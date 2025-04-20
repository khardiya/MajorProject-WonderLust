document.addEventListener("DOMContentLoaded", function () {
    if (!window.mapData || !window.mapData.geometry || !window.mapData.geometry.coordinates) {
        return;
    }

    const coordinates = window.mapData.geometry.coordinates;

    if (!Array.isArray(coordinates) || coordinates.length !== 2 || 
        typeof coordinates[0] !== "number" || typeof coordinates[1] !== "number") {
        console.error("❌ Invalid coordinates:", coordinates);
        return;
    }

    Radar.initialize(mapToken); // Initialize Radar

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    mapContainer.style.display = "block";

    // Initialize the map
    const map = Radar.ui.map({
        container: "map",
        style: "radar-default-v1",
        center: coordinates,
        zoom: 7
    });

    // Create the popup (but don't show it yet)
    const popup = Radar.ui.popup({
        text: "Exact Location provided after booking",
    }).setLngLat(coordinates);

    // Create and add the marker
    const marker = Radar.ui
        .marker({
            color: "#000257",
            width: 40,
            height: 80,
        })
        .setLngLat(coordinates)
        .addTo(map);

    // Show the popup only when the marker is clicked
    marker.getElement().addEventListener("click", function () {
        popup.addTo(map);
    });

    // Optional: make sure map resizes correctly
    setTimeout(() => {
        map.resize();
        map.setCenter(coordinates);
    }, 1000);
});
