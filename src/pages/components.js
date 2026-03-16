export function buildCardRow(icon, titleText, subText, button) {
  let buttonHtml = "";

  if (button) {
    buttonHtml = `
    <div class="flex flex-col">${button}</div>
    `;
  }

  return `
  <div class="flex items-center justify-between p-3 space-x-3">
    <!-- Left side: icon + text -->
    <div class="flex items-center space-x-3 p-3">
      <!-- Icon -->
      <div class="flex-shrink-0">${icon}</div>
      <!-- Text Column -->
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">${titleText}</span>
        <span class="text-sm text-gray-600">${subText}</span>
      </div>
    </div>

    <!-- Right side: button -->
    ${buttonHtml}
  </div>
  `;
}

export function buildSideCardRow(icon, titleText, subText) {
  return `
  <div class="flex flex-1 items-center justify-between space-x-3">
    <!-- Left side: icon + text -->
    <div class="flex items-center space-x-3 p-1">
      <!-- Icon -->
      <div class="flex-shrink-0">${icon}</div>
      <!-- Text Column -->
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">${titleText}</span>
        <span class="text-sm text-gray-600">${subText}</span>
      </div>
    </div>
  </div>
  `;
}

export function buildSideCard(img, header, content, headerIcon) {
  let imgString = `<img src="/images/test1.jpg" alt="stock" class="h-full object-cover w-full block" />`;

  if (img) {
    imgString = `<img src="/images/${img}.jpg" alt="${img}" class="h-full object-cover w-full block" />`;
  }

  let headerIconString = "";

  if (headerIcon) {
    headerIconString = headerIcon;
  }

  return `
  <div class="card card-side bg-base-100 shadow-sm mb-4 w-full h-full hidden md:flex">
    <figure class="w-1/3 relative h-full block">
      ${imgString}
      <div class="absolute bottom-2 left-2 z-10 w-max h-fit inset-auto">
       <span class="badge badge-success border-none whitespace-nowrap">
         <i class="fa-solid fa-star"></i>Ralph Recommends
       </span>
      </div>
    </figure>
    <div class="card-body w-2/3">
      <div class="flex justify-between items-center">
        <h5 class="card-title mb-2.5 text-gray-900">${header}</h5>
        ${headerIconString}
      </div>
      ${content}
    </div>
  </div>
  `;
}

export function buildCardMobile(img, header, content, headerIcon) {
  let imgString = "";

  if (img) {
    imgString = `<figure><img src="/images/${img}.jpg" alt="${img}" /></figure>`;
  }

  let headerIconString = "";

  if (headerIcon) {
    headerIconString = headerIcon;
  }

  return `
  <div class="flex justify-center mb-6 block md:hidden">
    <div class="card w-full xl:max-w-7xl bg-base-100 border border-base-300 rounded-xl text-gray-900">
      ${imgString}
      <div class="card-body">
        <div class="flex justify-between items-center">
          <h5 class="card-title mb-2.5 text-gray-900">${header}</h5>
          ${headerIconString}
        </div>
        ${content}
      </div>
    </div>
  </div>
  `;
}

export function buildCard(
  img,
  header,
  content,
  id,
  additionalClass,
  badges,
  headerIcon,
) {
  let idToUse = "";
  let additionalClassToUse = "";
  let badgeString = "";

  if (badges) {
    badgeString = `<p class="card-text flex flex-wrap gap-2 mb-2.5">${badges}</p>`;
  }

  if (id && id != "undefined") {
    idToUse = ` id='${id}'`;
  }

  if (additionalClass && additionalClass != "undefined") {
    additionalClassToUse = ` ${additionalClass}`;
  }

  let imgString = "";

  if (img) {
    imgString = `<figure><img src="/images/${img}.jpg" alt="${img}" /></figure>`;
  }

  let headerIconString = "";

  if (headerIcon) {
    headerIconString = headerIcon;
  }

  return `
  <div class="flex justify-center mb-6 block">
    <div${idToUse} class="card w-full xl:max-w-7xl bg-base-100 border border-base-300 rounded-xl text-gray-900${additionalClassToUse}">
      ${imgString}
      <div class="card-body">
        <div class="flex justify-between items-center">
          <h5 class="card-title mb-2.5 text-gray-900">${header}</h5>
          ${headerIconString}
        </div>
        ${badgeString}
        ${content}
      </div>
    </div>
  </div>
  `;
}

export function getErrorMessage(id, message) {
  return `
  <div id='${id}' role="alert" class="alert alert-error hidden">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>${message}</span>
  </div>
  `;
}

export function getSuccessMessage(id, message) {
  return `
  <div id='${id}' role="alert" class="alert alert-success hidden">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>${message}</span>
  </div>
  `;
}

export function getModal() {
  return `
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box w-11/12 md:max-w-5xl">
      <h3 id="modalHeader" class="text-lg font-bold mb-2"></h3>
      <div id="modalContent">
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-primary">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  `;
}

export function getTop100CourseSelect() {
  return `
  <div class="w-full">Top 100 Course:</div>
  <div class="w-full">
    <select id='top100Filter' class="select">
      <option value='' selected>Select...</option>
      <option value='Yes'>Yes</option>
      <option value='No'>No</option>
    </select>
  </div>
  `;
}

export function get9HoleCourseSelect() {
  return `
  <div class="w-full">9 Hole Course:</div>
  <div class="w-full">
    <select id='nineHoleFilter' class="select">
      <option value='' selected>Select...</option>
      <option value='Yes'>Yes</option>
      <option value='No'>No</option>
    </select>
  </div>
  `;
}

export function getRalphRecommendsSelect() {
  return `
  <div class="w-full">Ralph Recommends:</div>
  <div class="w-full">
    <select id='ralphRecommends' class="select">
      <option value='' selected>Select...</option>
      <option value='Yes'>Yes</option>
      <option value='No'>No</option>
    </select>
  </div>
  `;
}

export function getLinksCourseSelect() {
  return `
  <div class="w-full">Links Courses:</div>
  <div class="w-full">
    <select id='linksCourses' class="select">
      <option value='' selected>Select...</option>
      <option value='Yes'>Yes</option>
      <option value='No'>No</option>
    </select>
  </div>
  `;
}

export function getYouHavePlayedSelect() {
  return `
  <div class="w-full">You've Played:</div>
  <div class="w-full">
    <select id='played' class="select">
      <option value='' selected>Select...</option>
      <option value='Yes'>Yes</option>
      <option value='No'>No</option>
    </select>
  </div>
  `;
}

export function getCourseCategorySelect() {
  return `
  <div class="w-full">Category:</div>
  <div class="w-full">
    <select id='mapCourseCategory' class="select">
      <option value='' selected>Select...</option>
      <option value="a">A</option>
      <option value="b">B</option>
      <option value="c">C</option>
      <option value="d">D</option>
    </select>
  </div>
  `;
}

export function getRegionSelect() {
  return `
  <div class="w-full">Region:</div>
  <div class="w-full">
    <select id='mapRegionFilter' class="select">
      <option value='' selected>Select...</option>
    </select>
  </div>
  `;
}
