import { getLoggedInUserInfo, getCourses, getRegions } from "../../pages/api";
import {
  buildCard,
  getErrorMessage,
  getTop100CourseSelect,
  get9HoleCourseSelect,
  getRalphRecommendsSelect,
  getLinksCourseSelect,
  getYouHavePlayedSelect,
  getCourseCategorySelect,
  getRegionSelect,
} from "../../pages/components";
import { populateSelectOptionsForRegionFilter } from "../../pages/selectBoxes";

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

    const data = await getRegions();

    const noCriteriaEntered = getErrorMessage(
      "noCriteriaEntered",
      "You have not entered any filter to criteria",
    );

    app.innerHTML += `
    <details id="openFilters" class="collapse bg-base-100 border-base-300 border mb-4">
    <summary class="collapse-title font-semibold">Show Mapping Filters</summary>
      <div class="collapse-content text-md">
        <div class="grid grid-cols-2 gap-4 items-center w-full mb-4">
          ${getTop100CourseSelect()}
          ${get9HoleCourseSelect()}
          ${getRalphRecommendsSelect()}
          ${getLinksCourseSelect()}
          ${getYouHavePlayedSelect()}
          ${getCourseCategorySelect()}
          ${getRegionSelect()}
        </div>
        ${noCriteriaEntered}
        <div class="flex text-center justify-center gap-3 mt-3">
          <a data-navigo class="btn btn-primary" id="clearMapFilter">Clear Filters</a>
          <a data-navigo class="btn btn-primary" id="mapFilter">Apply Filters</a>
        </div>
      </div>
    </details>
    <div id="map"></div>
    `;

    populateSelectOptionsForRegionFilter(data, "mapRegionFilter");
    loadUserMap();
  } else {
    app.innerHTML += `
    Woops. Something has gone wrong here
    `;
  }
}

async function loadUserMap() {
  const coursesData = await getCourses();
  loadCourseData(coursesData);
}

export async function clearFiltersForMap() {
  map.remove();
  loadUserMap();

  document.getElementById("top100Filter").value = "";
  document.getElementById("mapRegionFilter").value = "";
  document.getElementById("nineHoleFilter").value = "";
  document.getElementById("ralphRecommends").value = "";
  document.getElementById("linksCourses").value = "";
  document.getElementById("mapCourseCategory").value = "";
}

var map;

export async function filterMap() {
  const top100 = document.getElementById("top100Filter").value;
  const region = document.getElementById("mapRegionFilter").value;
  const nineHoles = document.getElementById("nineHoleFilter").value;
  const ralphRecommends = document.getElementById("ralphRecommends").value;
  const linksCourses = document.getElementById("linksCourses").value;
  const courseCategory = document.getElementById("mapCourseCategory").value;
  const played = document.getElementById("played").value;

  if (
    !top100 &&
    !region &&
    !nineHoles &&
    !ralphRecommends &&
    !linksCourses &&
    !courseCategory &&
    !played
  ) {
    document.getElementById("noCriteriaEntered").classList.remove("hidden");
    return;
  }

  document.getElementById("noCriteriaEntered").classList.add("hidden");

  map.remove();

  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = "";

  const coursesData = await getCourses(
    region,
    top100,
    nineHoles,
    courseCategory,
    linksCourses,
    ralphRecommends,
    played,
  );
  loadCourseData(coursesData);
}

export function loadCourseData(coursesData) {
  // 5. Initialize the map (Center it between your points)
  // Format: [Latitude, Longitude], Zoom Level
  map = L.map("map").setView([57.3986, -4.05871], 5);

  // 6. Add the OpenStreetMap "Tiles" (The actual map imagery)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 8,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

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
      layer.bindPopup(feature.properties.city);
    },
  }).addTo(map);

  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}
