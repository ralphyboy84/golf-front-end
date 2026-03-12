import { buildCard } from "../pages/components";
import { getCourses } from "../pages/api";

export function loadHome() {
  const app = document.getElementById("app");

  const content = `
  <p class="mb-4 text-base">Welcome to the Scottish Golf Database - the most comprehensive resource for Scottish Golf on the internet</p>
  <p class="mb-4 text-base">Whether it is checking course availability, searching for open competitions, or just merely wanting to look at pictures of beautiful Scottish golf courses, we have everything you could ever need.</p>
  <div class="flex gap-2">
    <a href="/courseDirectory" class="badge badge-primary h-auto text-center">557 Courses Loaded in the app</a>
    <a href="/dayAvailability" class="badge badge-accent h-auto text-center">372 Courses With Online Booking</a>
    <a href="/openSearcher" class="badge badge-info h-auto text-center">284 Courses With Open Competition Booking</a>
  </div>
  `;
  app.innerHTML = buildCard(
    "standrewsold",
    "Welcome to Scottish Golf Database",
    content,
    "homePage",
  );

  // app.innerHTML += `
  // <div class="w-full max-w-2xl mx-auto">
  //   <iframe
  //     src="https://www.google.com/maps/d/embed?mid=17GjIFtAKs18qYQN_WnmKnRaRIBnHHPE&ehbc=2E312F&noprof=1"
  //     class="w-full aspect-video rounded-lg shadow-md"
  //     style="border:0;"
  //     allowfullscreen=""
  //     loading="lazy">
  //   </iframe>
  // </div>
  // `;

  app.innerHTML += `
  <div id="map"></div>
  `;
  loadMap();
}

async function loadMap() {
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
      return L.marker(latlng, { icon: blueIcon });
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
