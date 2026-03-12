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
        loading="lazy"
        class="w-full aspect-video object-cover" />
      </div>
      `;

      buttons += `<a href="#item${x}" class="btn btn-xs shrink-0">${x}</a>`;
      x++;
    });

    return `
    <div class="carousel w-full">
      ${html}
    </div>
    <div class="flex w-full overflow-x-auto gap-2 py-2">
      <div class="flex w-fit mx-auto gap-2">
        ${buttons}
      </div>
    </div>
    `;
  }

  return `No gallery available for this course`;
}
