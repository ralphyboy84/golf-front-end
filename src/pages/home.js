import { buildCard } from "../pages/components";

export function loadHome() {
  const app = document.getElementById("app");

  const content = `
  <p class="mb-4 text-base">Welcome to the Scottish Golf Database - the most comprehensive resource for Scottish Golf on the internet</p>
  <p class="mb-4 text-base">Whether it is checking course availability, searching for open competitions, or just merely wanting to look at pictures of beautiful Scottish golf courses, we have everything you could ever need.</p>
  <div class="flex gap-2">
    <a href="/courseDirectory" class="badge badge-primary h-auto text-center">555 Courses Loaded in the app</a>
    <a href="/dayAvailability" class="badge badge-accent h-auto text-center">357 Courses With Online Booking</a>
    <a href="/openSearcher" class="badge badge-info h-auto text-center">263 Courses With Open Competition Booking</a>
  </div>
  `;
  app.innerHTML = buildCard(
    "standrewsold",
    "Welcome to Scottish Golf Database",
    content,
    "homePage",
  );

  app.innerHTML += `
  <div class="w-full max-w-2xl mx-auto">
    <iframe 
      src="https://www.google.com/maps/d/embed?mid=17GjIFtAKs18qYQN_WnmKnRaRIBnHHPE&ehbc=2E312F&noprof=1" 
      class="w-full aspect-video rounded-lg shadow-md" 
      style="border:0;" 
      allowfullscreen="" 
      loading="lazy">
    </iframe>
  </div>  
  `;
}
