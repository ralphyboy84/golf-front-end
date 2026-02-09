import { buildCard } from "../pages/components";

export function loadHome() {
  const app = document.getElementById("app");

  const content = `
  <p class="mb-4">Always fancied a trip to Scotland, but found it to be too overwhelming to workout where to play? Put off by the cost? Don't know where to start?</p>
  <p class="mb-4">Well this app is exactly what you are looking for.</p>
  <p class="mb-4">Tell us where you are staying, answer a few questions and we will go away and build a trip tailored to your needs.</p>
  <p class="mb-4">We also include Open Competitions in our search results - a relatively unknown way to play Scottish golf courses for significantly cheaper than the rack rate.</p>
  <div class="flex gap-2">
    <div class="badge badge-primary h-auto text-center">528 Courses Loaded in the app</div>
    <div class="badge badge-accent h-auto text-center">354 Courses With Online Booking</div>
    <div class="badge badge-info h-auto text-center">262 Courses With Open Competition Booking</div>
  </div>
  `;
  app.innerHTML = buildCard(
    "standrews",
    "Welcome to Scottish Golf Tee Booker",
    content,
    "homePage",
  );
}
