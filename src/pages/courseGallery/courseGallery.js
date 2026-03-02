export function viewCourseGallery(courseId, images) {
  let x = 1;
  let html = "";
  let buttons = "";

  if (images[courseId] && images[courseId].length > 0) {
    images[courseId].forEach(function (image) {
      html += `
      <div id="item${x}" class="carousel-item w-full">
        <img
        src="images/${courseId}/DJI_${image}.jpg"
        class="w-full" />
      </div>
      `;

      buttons += `<a href="#item${x}" class="btn btn-xs">${x}</a>`;
      x++;
    });

    return `
    <div class="carousel w-full">
      ${html}
    </div>
    <div class="flex w-full justify-center gap-2 py-2">
      ${buttons}
    </div>
    `;
  }

  return `No gallery available for this course`;
}
