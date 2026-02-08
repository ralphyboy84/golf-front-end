export function formatCell(data) {
  if (data.teeTimesAvailable == "No") {
    return `Availability: No`;
  }

  return `Availability: ${data.teeTimesAvailable}<br />First Tee Time: ${data.firstTime}<br />Cheapest Price: £${data.cheapestPrice}`;
}
