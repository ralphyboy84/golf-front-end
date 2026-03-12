// Get the router
import router from "./router.js";
import "./pages/eventListeners";
import "./pages/courseDirectory/cdModal.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Resolve current route on page load */
router.resolve();
