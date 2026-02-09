export function buildCardRow(icon, titleText, subText) {
  return `
  <div class="flex items-center space-x-3 p-3">
    <!-- Icon -->
    <div class="flex-shrink-0">${icon}</div>
    <!-- Text Column -->
    <div class="flex flex-col">
      <span class="font-semibold text-gray-900">${titleText}</span>
      <span class="text-sm text-gray-600">${subText}</span>
    </div>
  </div>
  `;
}

export function buildCard(img, header, content, id, additionalClass) {
  let idToUse = "";
  let additionalClassToUse = "";

  if (id && id != "undefined") {
    idToUse = ` id='${id}'`;
  }

  if (additionalClass && additionalClass != "undefined") {
    additionalClassToUse = ` ${additionalClass}`;
  }

  return `
  <div${idToUse} class="card sm:max-w-sm md:max-w-xl bg-gray-100 border border-base-300 rounded-xl text-gray-900${additionalClassToUse}">
    <figure><img src="src/images/${img}.jpg" alt="Watch" /></figure>
    <div class="card-body">
      <h5 class="card-title mb-2.5 text-gray-900">${header}</h5>
      ${content}
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
