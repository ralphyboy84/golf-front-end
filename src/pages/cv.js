export async function cvPage() {
  const app = document.getElementById("app");
  const header = document.getElementById("pageHeader");

  header.innerHTML = "CV";
  app.innerHTML = "<p>About this site</p>";
}
