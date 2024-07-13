const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
} else {
    console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0],2); // Start with a low zoom level
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Aditya Map",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    console.log("Location received:", data);
    const { id, latitude, longitude } = data;
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude],10).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude],16);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
