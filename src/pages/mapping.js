export async function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        // Success! Resolve the promise with the data
        resolve({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      },
      (error) => {
        // Error (e.g., User denied permission)
        resolve({});
      },
    );
  });
}
