import { getLoggedInUserInfo, getCourses } from "../../pages/api";
import { buildCard } from "../../pages/components";

export async function getYourInfo() {
  const info = await getLoggedInUserInfo();

  const app = document.getElementById("app");

  if (info.username) {
    const content = `
    <div class="grid grid-cols-1 gap-4 items-center w-full mb-4">
      <div class="w-full">Username: ${info.username}</div>
    </div>
    `;

    app.innerHTML = buildCard(
      "crailbalcomie",
      "Your Info",
      content,
      "yourInfoDiv",
    );

    app.innerHTML += `
    <div id="map"></div>
    `;

    loadUserMap();
  } else {
    app.innerHTML += `
    Woops. Something has gone wrong here
    `;
  }
}

async function loadUserMap() {
  // 5. Initialize the map (Center it between your points)
  // Format: [Latitude, Longitude], Zoom Level
  var map = L.map("map").setView([57.3986, -4.05871], 5);

  // 6. Add the OpenStreetMap "Tiles" (The actual map imagery)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const coursesData = await getCourses();
  const features = [];

  for (let x in coursesData) {
    const courseData = {
      type: "Feature",
      properties: {
        city: coursesData[x].name,
        hasPlayed: coursesData[x].played ?? 0,
      },
      geometry: {
        type: "Point",
        coordinates: [
          Number(coursesData[x].location.lon),
          Number(coursesData[x].location.lat),
        ],
      },
    };

    features.push(courseData);
  }

  // 1. Your data (could be fetched from an external .json file too)
  var myData = {
    type: "FeatureCollection",
    features,
  };

  const redIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const blueIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // 2. Add the GeoJSON layer to the map
  L.geoJSON(myData, {
    // This part creates the red balloon
    pointToLayer: function (feature, latlng) {
      if (feature.properties.hasPlayed === 1) {
        return L.marker(latlng, { icon: blueIcon });
      } else {
        return L.marker(latlng, { icon: redIcon });
      }
    },
    onEachFeature: function (feature, layer) {
      // This automatically creates a popup using the "city" property
      layer.bindPopup("Welcome to " + feature.properties.city);
    },
  }).addTo(map);

  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}
