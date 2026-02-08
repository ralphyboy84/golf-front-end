export function getLoadingDiv(percentage) {
  return `
    <div class="flex flex-col items-center gap-3">
      <span class="loading loading-spinner text-primary"></span>
      <p class='text-white-900'>Please wait.... loading.... ${percentage.toFixed(0)}% complete</p>
      <progress class="progress progress-primary w-56" value="${percentage.toFixed(0)}" max="100"></progress>
    </div>
    `;
}
